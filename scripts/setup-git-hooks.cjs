#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function runGit(args) {
  return spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const insideRepo = runGit(['rev-parse', '--is-inside-work-tree']);
if (insideRepo.status !== 0) {
  console.error('Git repository not detected. Skipping hooks setup.');
  process.exit(0);
}

// Why: force a repo-local hooks path so every developer uses the same automation.
const setHooksPath = runGit(['config', 'core.hooksPath', '.githooks']);
if (setHooksPath.status !== 0) {
  console.error(setHooksPath.stderr || 'Failed to configure core.hooksPath');
  process.exit(1);
}

console.log('Configured git hooks path to .githooks');
