# Change Log Automation - TeamLead Overview

## Why This Exists
The project enforces commit-time change logging so no meaningful code, config, or documentation update is missed.

## Business Purpose
- Improve accountability across all developers
- Produce a consistent daily activity trail
- Support fast management reporting and audits
- Reduce dependency on manual status updates

## How It Works
1. Each developer runs `npm install` (or `npm run changelog:setup`) after pulling latest changes.
2. Setup script configures repository hooks path to `.githooks`.
3. On every commit, `.githooks/pre-commit` runs `scripts/auto-log-commit.cjs`.
4. Script auto-ensures baseline docs exist (`rule.md`, `readme_today.md`, `README_TODAY_CHANGES.md`).
5. Script appends a structured log block to `README_TODAY_CHANGES.md`.
6. Because all markdown files are gitignored by design, script uses `git add -f` to include required markdown in commit-time capture without failure.

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

## Operational Notes
- `package.json` includes scripts for setup and manual run.
- `.gitignore` ignores `*.md` by design; pre-commit force-add handles required markdown capture.
- Log entries are append-only; history should not be rewritten unless explicitly approved.
- Duplicate protection avoids repeating the same snapshot entry.

## Commands
```bash
npm install
npm run changelog:setup
npm run changelog:run
```
