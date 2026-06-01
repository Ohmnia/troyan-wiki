---
name: rts-observability-architecture
description: Use this skill when implementing, refactoring, or reviewing RTS logging, telemetry, error tracking, deterministic replay recorders, telemetry visualizers, or debug tools. Activates for TypeScript, Three.js, and ECS simulation loop introspection.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: gamedev-observability
  conventions: tiered-telemetry
  tags:
    - rts
    - telemetry
    - replay
    - deterministic
    - debugging
    - ecs
---

# RTS Observability & Debugging Skill

## Core Philosophy
RTS systems are simulation-heavy and impossible to debug without specialized instrumentation. Do not build a single monolithic logger. Maintain separate, independent, zero-allocation observation streams.

The ultimate goal of this codebase early on is **validating scalable architecture**, not shipping final gameplay loops.

---

# The Four Tier Observability Matrix


| Subsystem | Scope & Constraints | Implementation Strategy |
| :--- | :--- | :--- |
| **1. Event Log** | High-level structural gameplay shifts only. | Noisy ticks forbidden. Must use structured JSON payloads. |
| **2. Error Monitor** | Failure conditions, warnings, state degradation. | Must output: System, Impact, Entity list, and Perf risk. |
| **3. Perf Timeline** | Structural frame telemetry and budget tracking. | Tracks: FPS, Frame time, Sim time, Render time, Queries. |
| **4. Replay Recorder**| Pure deterministic command logging. | Records inputs, ticks, and RNG seeds. No spatial states. |

---

# Architecture & Data Flow

```text
Simulation Loop (Fixed Timestep: 1/20s)
    ↓
Event Bus (Decoupled extraction)
    ↓
Observability Layer
    ├── Event Logger (Buffered in memory)
    ├── Error Monitor (Immediate flush on Error status)
    ├── Perf Timeline (Cyclic Ring Buffers)
    ├── Replay Recorder (Deterministic command queue)
    └── Debug Visualization (Batched InstancedMesh graphics)
```

---

# AI Code Generation Rules

### 1. High-Performance Logging Disallowed Antipatterns
* Never call unstructured raw logs (`console.log("stuff")`) inside game loops or systems.
* **Strict Performance Boundary:** Never perform raw disk or file I/O operations inside update frames. All telemetry logs must buffer to local memory stacks and flush asynchronously, or instantly upon a critical `ERROR` state trap.

### 2. Structured Event Standard
When creating log entries, output strictly typed, filterable JSON objects matching this structural architecture:
```ts
interface RTSEventLog {
  time: number;       // Simulation tick or timestamp
  system: string;     // Calling ECS system name
  type: string;       // Upper-case snake_case action tag
  payload: Record<string, any>; // Arbitrary flat, lightweight data
}
```

### 3. High-Scale Debug Visualization Rules
* Visualize system behavior over logging state text whenever possible. (e.g., Draw pathfinding nodes, steering vectors, avoidance rings, and spatial grid cell grids).
* Never allocate new graphics objects inside system logic updates (e.g., do not call `new THREE.Vector3()`).
* Always batch debug visualizations using a unified `THREE.InstancedMesh` collection or pre-allocated vertex arrays to keep draw calls near zero.

### 4. Deterministic Replay Constraints
* Enforce absolute frame determinism: `same inputs + same starting state = same results`.
* Replay files must only store historical command IDs, tick limits, targets, and structural seeding data. They must never contain spatial transform data or visual mesh calculations.
* Simulation update rates must run inside a strict fixed timestep boundary (e.g., `const FIXED_DELTA = 1 / 20;`).

---

# Prototype Milestones & Prioritization

### Phase 1: Core Diagnostics Base
* Build structured JSON loop emitters and core severity log layers.
* Implement a continuous layout performance diagnostic HUD.
* Build the baseline input seed replay command pipeline wrapper.

### Phase 2: Structural Overlays
* Implement toggleable runtime shortcut hooks (`F1`-`F5`).
* Build batched graphics rendering instancing for steering vectors, spatial cells, and formation tracks.

### Phase 3: Introspection & Analysis Tools
* Implement an active **Last 30 Seconds Crash Capture Buffer** which dumps current frame traces, replay stacks, and memory structures on unexpected engine failure traps.
* Generate automated benchmark sequences and offline timeline analysis parsers.
