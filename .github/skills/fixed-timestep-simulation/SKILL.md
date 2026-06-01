---
name: fixed-timestep-simulation
description: Use this skill when implementing deterministic RTS simulation loops, gameplay updates, movement systems, or ECS update pipelines.
compatibility: github-copilot-agent
license: MIT
tags:
- simulation
- timestep
- deterministic
- ecs
- rts
- architecture
---

# Fixed Timestep Simulation Skill

## Core Philosophy

All gameplay simulation must run in fixed ticks.

Rendering must remain decoupled from simulation.

---

# Preferred Tick Rate

```ts id="2ag2u2"
const FIXED_DELTA = 1 / 20
```

---

# Simulation Rules

Simulation should be:

* deterministic
* reproducible
* stable
* predictable

Avoid:

* frame-dependent gameplay
* variable timestep simulation
* render-driven logic
* unstable update ordering

---

# Accumulated Lag Handling

If wall-clock time exceeds one tick interval since the last update, run multiple fixed ticks to catch up. Cap catch-up to a maximum of 5 ticks per frame to prevent a death spiral. Discard any remaining accumulated time beyond this cap.

---

# Render Interpolation

Rendering must interpolate entity positions between the previous and current simulation tick using the fractional remainder of accumulated time:

```ts
const alpha = accumulatedTime / FIXED_DELTA;
```

Simulation state must not be mutated during rendering.

---

# Preferred Update Order

```text id="vqglru"
Input
→ Commands
→ Pathfinding
→ Steering
→ Combat
→ Resource Updates
→ Visibility
→ Rendering
```

---

# Determinism Rules

* stable entity iteration order
* seeded deterministic RNG — if no seed is provided at simulation initialization, throw an error rather than falling back to a random seed; determinism must never be silently broken
* Use integer or fixed-point arithmetic for all simulation state. If floating-point is used, restrict to IEEE 754 strict mode and avoid platform-specific optimizations such as fused multiply-add (FMA).
* avoid hidden state mutations

---

# Performance Rules

* Each fixed tick must complete within `FIXED_DELTA` seconds of wall-clock time. If a tick exceeds its budget, log a warning and do not attempt to catch up beyond 5 accumulated ticks.
* predictable simulation cost
* reusable memory
* stable frametimes

---

# RTS Priorities

1. determinism
2. scalability
3. debuggability
4. maintainability
5. performance


---
