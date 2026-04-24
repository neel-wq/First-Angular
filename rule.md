# Change Log Rule

## Purpose
Ensure every meaningful change in the repository is tracked in a structured and consistent way.

## Rule
After any change to:
- Source code
- Configuration files
- Documentation

You MUST append a new entry to:
`README_TODAY_CHANGES.md`

---

## Entry Format

Each entry must follow this structure:

### [yyyy-MM-dd HH:mm:ss]

**Files Changed:**
- <file-path>
- <file-path>
- line numbers (if applicable)

**What Changed:**
- Brief description of the modification

**Commit Message:**
- Exact user commit comment/message

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

**Commit Message:**
- fix(payment): prevent duplicate popup on Enter key

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
