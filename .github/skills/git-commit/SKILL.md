---
name: git-commit
description: Use this skill when generating git commit messages, organizing commits, reviewing staged changes, or preparing RTS development work for commit. Helps enforce clean conventional commits and logical commit grouping across git devops workflows.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: git-vcs
  conventions: conventional-commits
  triggers:
    - "git commit"
    - git
    - commits
---

# Git Commit Skill

## Purpose

This skill standardizes git commit workflow rules for AI-assisted RTS development.

It defines:

* commit formatting
* commit hygiene
* commit grouping
* RTS-friendly scope naming
* commit readability standards
* AI-assisted workflow discipline

---

# Core Philosophy

Commits should be:

* small
* focused
* readable
* reversible
* logically grouped

Avoid:

* giant mixed-purpose commits
* vague commit messages
* unrelated file changes
* noisy WIP commits
* meaningless AI-generated summaries

---

# Preferred Commit Format

Use Conventional Commits:

```text id="l9mbl7"
type(scope): concise summary
```

Examples:

```text id="v88gtm"
feat(movement): add formation slot assignment

fix(selection): resolve drag selection offset bug

perf(rendering): reduce instanced mesh updates

refactor(ecs): simplify transform component layout

docs(agents): update movement engineering rules
```

---

# Allowed Commit Types

| Type        | Purpose                  |
| ----------- | ------------------------ |
| feat        | new feature              |
| fix         | bug fix                  |
| perf        | performance optimization |
| refactor    | structural improvement   |
| docs        | documentation            |
| config      | tooling/configuration    |
| test        | tests                    |
| chore       | maintenance              |
| investigate | debugging/research       |

---

# Preferred RTS Scopes

Preferred scopes:

* simulation
* movement
* steering
* pathfinding
* ecs
* rendering
* selection
* camera
* combat
* economy
* ui
* agents
* tooling
* performance
* terrain

Examples:

```text id="c8bfgt"
feat(combat): add projectile damage falloff

perf(pathfinding): cache neighbor lookups

fix(camera): prevent edge-scroll jitter
```

---

# Commit Hygiene Rules

## One Purpose Per Commit

Good:

```text id="h7h1gk"
feat(selection): add multi-unit drag selection
```

Bad:

```text id="obdjmf"
misc updates
```

---

## Separate Refactors From Features

Avoid mixing:

* gameplay changes
* rendering changes
* refactors
* formatting
* performance optimizations

into one commit.

---

## Prefer Small Commits

Preferred commits are:

* focused
* reviewable
* reversible

Avoid:

* huge AI-generated commits

---

# AI Workflow Rules

When generating commits:

1. Identify logical change groups
2. Separate unrelated changes
3. Summarize architectural impact clearly
4. Avoid vague wording
5. Mention scalability/performance impact when relevant

---

# RTS Development Commit Philosophy

Commit history should clearly communicate:

* architectural evolution
* performance improvements
* gameplay system growth
* rendering scalability changes
* ECS evolution

The git history should become a readable engineering timeline.

---

# Anti-Patterns

Avoid commit messages like:

```text id="3nsxhh"
fix stuff
misc changes
wip
updates
cleanup
more work
testing
```

---

# Performance Commit Rules

Performance commits should explain:

* what bottleneck changed
* what system improved
* what scale issue was addressed

Example:

```text id="4bup9v"
perf(rendering): batch transform uploads for instanced units
```

---

# Refactor Rules

Refactors must NOT imply gameplay changes unless gameplay changed.

Good:

```text id="z6rkdp"
refactor(ecs): flatten unit transform storage
```

Bad:

```text id="c8vggk"
improve architecture
```

---

# Documentation Rules

Docs commits should reference affected systems.

Example:metadata: <--- ERR: Stray characters
---
