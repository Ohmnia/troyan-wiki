---
name: AgentInit
description: >
  Minimal context loader that runs automatically when the Troyan-3500 project
  is opened or a new agent/model session starts. Greets the developer by name,
  recalls one personal note from the last session, and orients the agent on the
  project's current state so no time is wasted re-establishing context.
applyTo: "**"
---

# Agent Init — Troyan-3500 Project Bootstrap

## Developer Profile
- **Name**: Schalk
- **Role**: Lead developer on Troyan-3500
- Always greet Schalk by name at the start of every session.
- At the start of each session, recall **one specific thing** from the previous session (e.g. the last feature worked on, a problem that was being solved, or a decision that was made). Store this in session memory under `/memories/session/last-session-note.md` so it persists across the conversation.

## Project Identity
| Field | Value |
|---|---|
| Project | **Troyan-3500** |
| Type | Real-Time Strategy (RTS) prototype |
| Stack | TypeScript · Three.js · Vite |
| Root | `/home/skunk/Documents/Game Development/Troyan-3500` |
| Entry | `src/main.ts` |
| Docs | `Assets/docs/` |

## Key Documents to Load on Init
Load these in order — stop as soon as context is sufficient for the current task:

1. `Assets/docs/Technical-Baseline-Architecture.md` — authoritative module boundaries and coding rules
2. `Assets/docs/Prototype-Development-Steering-Checklist.md` — current task status (what is ✅ done, what is next)
3. `Assets/docs/Strategy-Game-Engineering-Bible.md` — design philosophy and performance constraints
4. `Assets/docs/Development-Strategy-Prototype-Scope-Revised.md` — scope limits (what NOT to build yet)

## Current Implementation State (update this section as milestones are reached)
- **Terrain**: flat procedural mesh with basic material ✅
- **Camera**: orbit + pan + zoom with pivot tracking ✅
- **Unit**: single placeholder unit with click-select ✅
- **Selection ring**: cyan pulsing `LineLoop`, smooth sine-wave opacity animation ✅
- **Destination indicator**: dual yellow rings, perspective-corrected, pulse on right-click ✅
- **Drag selection**: screen-rect box with terrain-projected corners, fade-out on release ✅
- **Pathfinding**: not started ⬜
- **Combat**: not started ⬜

## Session Startup Checklist
When a new session begins, do the following before accepting any task:

1. Greet Schalk by name.
2. State the one thing remembered from the last session (read `/memories/session/last-session-note.md` if it exists).
3. Briefly confirm the current implementation state above (2–3 lines max).
4. Ask what Schalk wants to work on, or proceed if he has already stated a task.

## Conventions (never violate without flagging it)
- All units: TypeScript strict mode, no `any`
- Three.js objects named with camelCase matching their CORE-xxx tag comment
- Pulse / animation constants are declared as named `const` near the top of `main.ts`
- Spec updates (checklist + architecture doc) are made alongside every feature implementation
- Micro-commits: one logical change per commit, commit message format `CORE-xxx: short description`
