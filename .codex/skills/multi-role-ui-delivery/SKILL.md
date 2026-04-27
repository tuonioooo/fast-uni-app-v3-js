---
name: multi-role-ui-delivery
description: |
  Coordinate multi-role delivery for UI-to-page work in this repository using the local agent setup under `.codex/agents`.
  Use when the task starts from a prototype, screenshot, UI draft, or partially implemented page and needs to be converted into maintainable uni-app code with connected business flow.
  This skill is for tasks that should move through: requirements analysis, frontend implementation, refactor cleanup, testing, and final delivery summary.
---

# Multi-role UI delivery

Use this skill when a task is not just "build one page", but "turn a prototype into a usable feature flow" in the current `fast-uni-app-v3-js` project.

## Role chain

Follow this order:

1. `requirements-analyst`
2. `frontend-engineer`
3. `refactor-engineer`
4. `tester`
5. `reporter`

Agent definitions live in:

- `.codex/agents/requirements-analyst.toml`
- `.codex/agents/frontend-engineer.toml`
- `.codex/agents/refactor-engineer.toml`
- `.codex/agents/tester.toml`
- `.codex/agents/reporter.toml`

## Base skill

For any prototype-to-page task, first apply:

- `.codex/skills/ui-prototype-to-page/SKILL.md`

This skill does not replace `ui-prototype-to-page`; it organizes the role workflow around it.

## When to use

Use this skill if any of the following is true:

- The user provides a screenshot, prototype, Figma export, or static page and expects project-ready code.
- The task involves more than one page or state, such as list -> detail -> form -> success popup.
- The task needs both visual restoration and business interaction design.
- The current code is a prototype cut-image page and should be converted into maintainable code.

## Execution checklist

### 1. requirements-analyst

Output:

- page goals
- page sections
- data fields
- route and parameter flow
- interaction states
- mock/API expectations

Do not skip upstream/downstream linkage. If the page belongs between list/detail/form/popup pages, define the chain explicitly.

### 2. frontend-engineer

Implement:

- `pages/*`
- `api/*`
- `mock/*`
- `pages.json`
- `main.js` whitelist when needed
- test entry if the page is hard to reach manually

Default to `script setup` + `scoped scss`.

### 3. refactor-engineer

Clean up:

- prototype export structure
- repeated text and validation rules
- duplicate popup or intermediate-page logic
- unused image assets when confirmed safe to remove

### 4. tester

Verify at least:

- route entry
- parameter passing
- empty/error handling
- form validation
- success feedback
- return path
- config sync (`pages.json`, whitelist, mock, API)

### 5. reporter

Summarize:

- what was delivered
- how the flow works now
- how it was validated
- what remains risky or pending

## Project-specific constraints

- Reuse `uv-ui`, `jasper-ui`, existing request wrapper, and current mock mechanism.
- Do not introduce a new UI framework or a parallel page architecture.
- Prefer `https://picsum.photos/` only for placeholder assets. If the user gives local assets, use those local assets first.
- Avoid leaving prototype-only pages as final code.

## Final output expectation

A good result should clearly state whether the business loop is actually connected.

Examples:

- `activity_list -> activity_detail -> activity_booking -> activity_success_modal`
- `list -> detail -> submit -> success`

If the loop is not connected yet, say so explicitly instead of implying the feature is done.
