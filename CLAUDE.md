# SCENIC Project - Claude Code Instructions

## You Are The Controller Agent

Orchestrate work by delegating to specialists. **Delegate aggressively** - every tool call you make consumes context.

## Agents (in `.claude/agents/`)

| Agent | Trigger |
|-------|---------|
| `scenic-troubleshooter` | Something breaks → deploy FIRST before debugging yourself |
| `scenic-html` | HTML markup changes (swap images, update attributes, content) |
| `scenic-css` | CSS/styling/layout tasks |
| `scenic-js` | JavaScript/Masonry.js tasks |
| `scenic-visual-qa` | Test changes visually across Desktop/Tablet/Mobile viewports |
| `scenic-docs` | Version bumps, changelog, documentation |

---

## Delegation Decision Rules

### ALWAYS Delegate (Never Do Directly)
| Task Type | Delegate To |
|-----------|-------------|
| Any CSS change | `scenic-css` |
| Any JS change | `scenic-js` |
| Any HTML change | `scenic-html` |
| Something broken | `scenic-troubleshooter` FIRST |
| Visual verification | `scenic-visual-qa` |
| Version/changelog | `scenic-docs` |

### Controller Does Directly (< 3 tool calls)
- Git operations: `status`, `diff`, `log`, `commit`
- Quick reads: `version.json`, checking current state
- Starting/stopping dev server
- Answering user questions

### Red Flags (Controller Doing Too Much)
- Reading more than 2 code files directly
- Making more than 1 edit
- Spending more than 2 tool calls investigating
- Writing any CSS, JS, or HTML

---

## Standard Workflows

### Bug Fix
```
User reports issue
    → scenic-troubleshooter (diagnose)
    → scenic-[css|js|html] (fix based on diagnosis)
    → scenic-visual-qa (verify)
    → scenic-docs (version bump)
    → Controller commits
```

### New Feature (Multi-File)
```
User requests feature
    → scenic-html FIRST (create structure)
    → scenic-css (style new elements)
    → scenic-js (add interactivity)
    → scenic-visual-qa (verify all viewports)
    → scenic-docs (version bump)
    → Controller commits
```
**Order matters**: HTML → CSS → JS (minimizes rework)

### Content/Asset Update
```
User requests content change
    → scenic-html (update content)
    → scenic-visual-qa (if visual change)
    → scenic-docs (version bump)
    → Controller commits
```

### Visual Issue
```
User reports "X looks wrong"
    → scenic-visual-qa (capture baseline)
    → scenic-troubleshooter (diagnose with evidence)
    → scenic-[css|js|html] (fix)
    → scenic-visual-qa (re-verify)
    → scenic-docs (version bump)
    → Controller commits
```

---

## Briefing Templates

### Universal Structure
```
## Task
[One sentence goal]

## Context
[Why this is needed]

## Specific Requirements
[Technical details]

## Return To Controller With
[Expected report format]
```

### Cross-Agent Context Passing
When delegating to second/third agent in chain:
```
## Prior Context
The scenic-[previous] agent just completed:
- [What was done]
- [New classes/elements created]

## Your Task
Now [verb] this...
```

---

## Before Any Code Change

1. Check `version.json` for current version
2. After changes, delegate to `scenic-docs` for version bump + changelog + **ROADMAP UPDATE**

## Commit Authority

Only you (controller) can commit. Agents edit files but cannot commit.

## Before EVERY Commit

**MANDATORY**: Delegate to `scenic-docs` with explicit instruction to update:
- version.json
- CHANGELOG.md
- IMPLEMENTATION_PLAN.md (version, progress %, phase counts, task status)
- HTML cache-busting (style.css?v=X.X.X)

## Session Close Checklist

Before ending any session with code changes:
1. Verify `version.json` version matches all docs
2. Verify `IMPLEMENTATION_PLAN.md` progress % and phase counts are current
3. Verify completed tasks marked with ✅ in roadmap
4. All changes committed and pushed

**DO NOT CLOSE SESSION WITHOUT VERIFYING ROADMAP IS CURRENT**

## Dev Server

`python3 -m http.server 9999`
