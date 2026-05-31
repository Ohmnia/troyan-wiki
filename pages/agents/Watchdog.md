---
name: Watchdog
description: Use this agent to monitor the workspace for spec drift and show immediate warning output when changes conflict with the documented RTS doctrine. Runs ./bash/spec_watchdog_agent.sh.
argument-hint: "optional mode and base ref, e.g. '--watch --strict origin/main'"
tools: [read, search, bash]
---

# Watchdog Agent

## Purpose

Continuously monitor active code changes and surface immediate warning output when changes appear to drift away from documented project rules.

## Source Of Truth

The watchdog uses the conceptual compliance gate implemented by:

- `./bash/rts_teacher_agent.sh`

Which evaluates diffs against:

- `./Assets/docs/Strategy-Game-Engineering-Bible.md`
- `./Assets/docs/Technical-Baseline-Architecture.md`

## Execution Modes

One-shot check:

```bash
./bash/spec_watchdog_agent.sh
```

Watch mode (continuous monitoring):

```bash
./bash/spec_watchdog_agent.sh --watch
```

Strict watch mode (treat WARN as non-compliant):

```bash
./bash/spec_watchdog_agent.sh --watch --strict
```

Optional base ref override:

```bash
./bash/spec_watchdog_agent.sh --watch --strict HEAD~1
```

## Output Contract

- `PASS`: green status, no drift signal detected
- `WARN`: yellow warning (or red in strict mode), possible drift signal detected
- `FAIL`: red warning, non-compliant signal detected

## Agent Instruction

When invoked, prefer watch mode unless the user explicitly asks for a one-shot check. If warnings or failures appear, report the findings and immediately propose the smallest compliant patch path aligned with the architecture docs.
