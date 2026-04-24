# README_TODAY

## Objective
Automatically record meaningful repository changes from all developers in a consistent commit-time log.

## Included Files
- rule.md: Mandatory formatting and policy for change entries
- README_TODAY_CHANGES.md: Auto-appended running log (all markdown is gitignored by design)

## Automatic Flow
1. Developer makes changes and stages files.
2. During commit, the pre-commit hook runs scripts/auto-log-commit.cjs.
3. The script ensures rule.md and readme_today.md exist.
4. The script appends a structured markdown entry to README_TODAY_CHANGES.md.
5. The script force-adds required markdown (`git add -f`) so commit does not fail because markdown files are ignored.

## Setup Commands
Run once per clone:

```bash
npm install
npm run changelog:setup
```

## Expected Output Per Commit
Each commit generates one block with:
- Local timestamp
- Files changed with status and +/- line stats
- What Changed
- Purpose
- Validation
- Caution

## For TeamLead / Audit Reporting
This system provides:
- Daily visibility of what changed and why
- Commit-linked traceability across team members
- Reduced risk of missing manual updates
- Faster preparation of status and audit summaries

## Reliability Notes
- If no files are staged, nothing is appended.
- Duplicate protection avoids repeated entries for the exact same staged snapshot.
- If the hook fails, commit is blocked to prevent missing logs.
