#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const rulePath = path.join(repoRoot, 'rule.md');
const readmeTodayPath = path.join(repoRoot, 'readme_today.md');
const logPath = path.join(repoRoot, 'README_TODAY_CHANGES.md');
const automationDocPath = path.join(repoRoot, 'CHANGE_LOG_AUTOMATION.md');

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || 'Unknown git error').trim();
    throw new Error(message);
  }

  return (result.stdout || '').trim();
}

function ensureFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function safeNumStat(filePath) {
  const result = spawnSync('git', ['diff', '--cached', '--numstat', '--', filePath], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    return { added: '?', removed: '?' };
  }

  const firstLine = (result.stdout || '').trim().split('\n').filter(Boolean)[0];
  if (!firstLine) {
    return { added: '0', removed: '0' };
  }

  const [added, removed] = firstLine.split('\t');
  return {
    added: added || '0',
    removed: removed || '0',
  };
}

function loadTemplateContent() {
  const ruleTemplate = `# Change Log Rule

## Purpose
Ensure every meaningful change in the repository is tracked in a structured and consistent way.

## Rule
After any change to:
- Source code
- Configuration files
- Documentation

You MUST append a new entry to:
\`README_TODAY_CHANGES.md\`

---

## Entry Format

Each entry must follow this structure:

### [yyyy-MM-dd HH:mm:ss]

**Files Changed:**
- <file-path>
- line numbers (if applicable)

**What Changed:**
- Brief description of the modification

**Purpose:**
- Why the change was made

**Validation:**
- How the change was tested or verified

**Caution (if any):**
- Any risks, edge cases, or things to watch

---

## Rules to Follow

- Always append (never overwrite existing logs)
- Use accurate timestamps (local system time)
- Keep entries concise but meaningful
- One logical change = one entry
- Do NOT skip logging even for small fixes
- Do NOT remove older entries unless explicitly instructed

---

## Example Entry

### 2026-04-23 18:45:10

**Files Changed:**
- src/app/payment/payment.component.ts
- src/app/payment/payment.html

**What Changed:**
- Fixed Enter key triggering multiple popups in payment row action

**Purpose:**
- Prevent duplicate popup creation on rapid key press

**Validation:**
- Tested keyboard navigation manually
- Verified only one popup opens per Enter press

**Caution:**
- Ensure future keyboard handlers also prevent event.repeat

---

## Copilot Instruction Hint

When generating or modifying code:
> "After completing this change, append a properly formatted entry to README_TODAY_CHANGES.md following rule.md"
`;

  const todayTemplate = `# README_TODAY

## What This Is
This project auto-captures commit-time change logs for source, config, and documentation updates.

## Mandatory Rule
Follow rule.md for entry structure and quality.

## How It Runs
1. Developer stages files.
2. Git pre-commit hook runs scripts/auto-log-commit.cjs.
3. The script appends a structured entry to README_TODAY_CHANGES.md.
4. The script force-adds README_TODAY_CHANGES.md to the commit.

## Team Benefit
- Consistent daily traceability across all developers
- Faster audit and TeamLead reporting
- Less manual logging work
`;

  const logTemplate = `# README_TODAY_CHANGES

This file is auto-appended by the pre-commit hook. Do not rewrite history unless explicitly approved.
`;

  const automationTemplate = `# Change Log Automation - TeamLead Overview

## Why This Exists
The project enforces commit-time change logging so no meaningful code, config, or documentation update is missed.

## Team Purpose
- Improve accountability across all developers
- Produce a consistent daily activity trail
- Support fast TeamLead reporting and audits
- Reduce dependency on manual status updates

## How It Works
1. Each developer runs npm install (or npm run changelog:setup) after pulling latest changes.
2. Setup script configures repository hooks path to .githooks.
3. On every commit, .githooks/pre-commit runs scripts/auto-log-commit.cjs.
4. Script auto-ensures baseline docs exist (rule.md, readme_today.md, README_TODAY_CHANGES.md).
5. Script appends a structured log block to README_TODAY_CHANGES.md.
6. Since all markdown files are ignored by design, script uses git add -f so commit capture does not fail.

## What Output Looks Like
Per commit, one entry is appended with:
- Timestamp (local system time)
- Files changed + status + line stats
- What changed
- Purpose
- Validation
- Caution

## Failure Behavior
- If hook cannot complete logging, commit is blocked.
- This prevents unlogged commits and enforces compliance.

## Commands
npm install
npm run changelog:setup
npm run changelog:run
`;

  return { ruleTemplate, todayTemplate, logTemplate, automationTemplate };
}

function forceAddMarkdownFiles(filePaths) {
  const normalized = [...new Set(filePaths.filter(Boolean))];
  if (normalized.length === 0) {
    return;
  }

  // Why: all markdown files are gitignored, so -f is mandatory for commit-time capture.
  runGit(['add', '-f', '--', ...normalized]);
}

function main() {
  const { ruleTemplate, todayTemplate, logTemplate, automationTemplate } = loadTemplateContent();

  // Why: create required policy/docs automatically so every clone has the same baseline.
  ensureFile(rulePath, ruleTemplate);
  ensureFile(readmeTodayPath, todayTemplate);
  ensureFile(logPath, logTemplate);
  ensureFile(automationDocPath, automationTemplate);

  const stagedOutput = runGit(['diff', '--cached', '--name-status', '--diff-filter=ACMR']);
  const stagedLines = stagedOutput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (stagedLines.length === 0) {
    process.exit(0);
  }

  const files = [];
  const stagedMarkdownFiles = [];
  for (const line of stagedLines) {
    const [status, ...fileParts] = line.split('\t');
    const filePath = fileParts.join('\t');

    if (!filePath || filePath === 'README_TODAY_CHANGES.md') {
      continue;
    }

    if (filePath.toLowerCase().endsWith('.md')) {
      stagedMarkdownFiles.push(filePath);
    }

    files.push({ status, filePath });
  }

  if (files.length === 0) {
    process.exit(0);
  }

  const digest = crypto
    .createHash('sha1')
    .update(JSON.stringify(files))
    .digest('hex');

  const currentLog = fs.readFileSync(logPath, 'utf8');
  if (currentLog.includes(`<!-- change-hash: ${digest} -->`)) {
    process.exit(0);
  }

  const timestamp = formatTimestamp(new Date());
  const fileLines = files.map(({ status, filePath }) => {
    const numStat = safeNumStat(filePath);
    const friendlyStatus =
      status === 'A' ? 'Added' : status === 'M' ? 'Modified' : status === 'R' ? 'Renamed' : status;

    return `- ${filePath} (${friendlyStatus}, +${numStat.added}/-${numStat.removed})`;
  });

  const entry = [
    '',
    `### ${timestamp}`,
    `<!-- change-hash: ${digest} -->`,
    '',
    '**Files Changed:**',
    ...fileLines,
    '- line numbers: N/A (captured at file-level by automation)',
    '',
    '**What Changed:**',
    '- Automated commit snapshot of currently staged files.',
    '',
    '**Purpose:**',
    '- Preserve reliable team-level traceability without depending on manual logging.',
    '',
    '**Validation:**',
    '- Pre-commit hook executed and appended this entry before commit.',
    '',
    '**Caution (if any):**',
    '- Review generated summary before pushing, especially for large refactors.',
    '',
    '---',
    '',
  ].join('\n');

  fs.appendFileSync(logPath, entry, 'utf8');

  // Why: force-add guarantees markdown capture even when markdown is globally ignored.
  forceAddMarkdownFiles([
    'README_TODAY_CHANGES.md',
    'rule.md',
    'readme_today.md',
    'CHANGE_LOG_AUTOMATION.md',
    ...stagedMarkdownFiles,
  ]);
}

try {
  main();
} catch (error) {
  console.error(`[auto-log-commit] ${error.message}`);
  process.exit(1);
}
