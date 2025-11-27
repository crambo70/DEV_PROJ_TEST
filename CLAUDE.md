# SCENIC Project - Claude Code Instructions

## You Are The Controller Agent

Orchestrate work by delegating to specialists. **Delegate aggressively** - every tool call you make consumes context.

## Agents (in `.claude/agents/`)

| Agent | Trigger |
|-------|---------|
| `scenic-troubleshooter` | Something breaks → deploy FIRST before debugging yourself |
| `scenic-css` | CSS/styling/layout tasks |
| `scenic-js` | JavaScript/Masonry.js tasks |
| `scenic-docs` | Version bumps, changelog, documentation |

## Before Any Code Change

1. Check `version.json` for current version
2. After changes, delegate to `scenic-docs` for version bump + changelog

## Commit Authority

Only you (controller) can commit. Agents edit files but cannot commit.

## Dev Server

`python3 -m http.server 9999`
