# RTS Debugging, Replay & Observability Architecture Guide

# Purpose

This document explains a scalable debugging, replay, logging, and observability architecture for RTS game development using:

* TypeScript
* Three.js
* ECS architecture
* Fixed timestep simulation

The goal is to make large-scale RTS simulation systems:

* debuggable
* observable
* reproducible
* scalable
* maintainable

This architecture is especially valuable during:

* prototype development
* movement debugging
* performance optimization
* multiplayer preparation
* regression testing

---

# Core RTS Development Reality

RTS games quickly become:

* simulation-heavy
* system-heavy
* difficult to reason about mentally
* difficult to debug without tooling

Many systems interact simultaneously:

* movement
* steering
* pathfinding
* combat
* visibility
* rendering
* selection
* formations
* AI

Without observability tools:

* bugs become difficult to reproduce
* performance issues become unclear
* system interactions become invisible
* debugging becomes extremely slow

The solution is:

# layered observability architecture

---

# IMPORTANT PRINCIPLE

Do NOT build:

```text
one giant everything logger
```

This usually becomes:

* noisy
* expensive
* unreadable
* difficult to filter
* difficult to maintain

Instead build:

# multiple focused debugging systems

---

# Recommended RTS Observability Architecture

Use FOUR separate systems:

| System               | Purpose                           |
| -------------------- | --------------------------------- |
| Event Log            | meaningful gameplay/system events |
| Error Monitor        | failures, warnings, crashes       |
| Performance Timeline | frame timings and bottlenecks     |
| Replay Recorder      | deterministic replay              |

These systems should remain independent.

---

# 1. Event Log System

## Purpose

Track:

* meaningful gameplay events
* important simulation events
* major state changes

NOT:

* every tiny simulation update

---

# Good Event Examples

```text
[12:14:22:331]
SelectionSystem:
42 units selected
```

```text
[12:14:26:120]
MovementSystem:
Formation created
Units: 20
```

```text
[12:14:29:002]
Pathfinding:
Path request failed
Target blocked
```

---

# BAD Event Examples

Avoid logging noise:

```text
unit moved 0.002 units
```

```text
unit rotation updated
```

```text
vector normalized
```

These create overwhelming log spam.

---

# Recommended Event Types

Use structured categories:

| Type        | Purpose                |
| ----------- | ---------------------- |
| Selection   | unit selection         |
| Movement    | move commands          |
| Formation   | formation behavior     |
| Pathfinding | path requests/failures |
| Combat      | attacks/damage         |
| Resource    | harvesting/economy     |
| Rendering   | rendering changes      |
| System      | major engine events    |

---

# Structured Logging

Avoid:

```ts
console.log("stuff happened")
```

Prefer:

```json
{
  "time": 124422331,
  "system": "MovementSystem",
  "type": "FORMATION_CREATED",
  "units": 20,
  "formationId": 4
}
```

Structured logs become:

* searchable
* filterable
* visualizable
* analyzable

---

# 2. Error Monitoring System

## Purpose

Track:

* crashes
* warnings
* invalid states
* system failures
* dangerous performance spikes

---

# Example Error Log

```text
[12:14:31:102]
ERROR:
SpatialGrid overflow

Impact:
Neighbor queries may fail
Potential unit overlap increase
```

---

# Example Warning

```text
[12:14:40:002]
WARNING:
Frame spike detected

Simulation:
48ms

Expected:
16ms
```

---

# Recommended Error Levels

| Level | Purpose                |
| ----- | ---------------------- |
| DEBUG | verbose developer info |
| INFO  | normal events          |
| WARN  | suspicious behavior    |
| ERROR | actual failures        |
| PERF  | performance metrics    |

This makes filtering manageable.

---

# Error Context Matters

Always log:

* system name
* timestamp
* affected entities
* likely gameplay impact
* performance implications

Example:

```text
Pathfinding timeout
Impact:
Units may stop responding temporarily
Potential frame spike risk
```

---

# 3. Performance Timeline System

## Purpose

Track:

* frametime history
* simulation cost
* rendering cost
* bottlenecks over time

This is EXTREMELY important for RTS games.

---

# Recommended Metrics

Track:

| Metric           | Why                    |
| ---------------- | ---------------------- |
| FPS              | overall responsiveness |
| Frame Time       | stability              |
| Simulation Time  | ECS scaling            |
| Render Time      | rendering bottlenecks  |
| Draw Calls       | rendering scalability  |
| Unit Count       | scale tracking         |
| Neighbor Queries | movement scaling       |
| Pathfinding Jobs | pathfinding pressure   |

---

# WHY TIMELINES MATTER

Professional RTS debugging is usually:

# timeline debugging

Not:

# isolated event debugging

You are usually trying to answer:

```text
What chain of events caused this problem?
```

Example:

| Time     | Event                   |
| -------- | ----------------------- |
| 12:14:31 | Pathfinding spike       |
| 12:14:31 | Neighbor query overflow |
| 12:14:31 | FPS dropped             |
| 12:14:32 | Units clumped           |
| 12:14:32 | Steering oscillation    |

This reveals causality.

---

# Performance HUD

Build a permanent debug HUD showing:

```text
FPS
Frame Time
Simulation Time
Render Time
Draw Calls
Unit Count
Neighbor Queries
Pathfinding Jobs
```

Visible during all development.

This becomes one of the highest-value RTS debugging tools.

---

# 4. Deterministic Replay System

# Simple Explanation

Instead of recording:

* video
* positions every frame
* full world state

record ONLY:

* player commands
* timestamps
* RNG seeds

Example:

```json
{
  "tick": 120,
  "type": "MOVE_UNITS",
  "unitIds": [4, 5, 6],
  "target": { "x": 10, "y": 25 }
}
```

Then:

* restart simulation
* replay same commands
* reproduce same game behavior

---

# Deterministic Simulation

Deterministic means:

```text
same inputs
+
same starting state
=
same results
```

Every time.

---

# Why Replay Is Valuable

Replay systems help with:

| Benefit                 | Why It Matters     |
| ----------------------- | ------------------ |
| Bug reproduction        | extremely valuable |
| Movement debugging      | extremely valuable |
| Regression testing      | extremely valuable |
| Performance profiling   | extremely valuable |
| Multiplayer preparation | future-proofing    |

---

# RTS Replay Architecture

```text
Player Input
    ↓
Command Queue
    ↓
Simulation
    ↓
Replay Log
```

Replay stores:

* command
* timestamp/tick
* parameters

NOT:

* graphics
* transforms every frame
* visual state

---

# Fixed Timestep Importance

Replay systems require:

# deterministic simulation

Use:

```ts
const FIXED_DELTA = 1 / 20
```

Avoid:

* variable timestep gameplay
* frame-dependent simulation
* unstable update order

---

# Most Important RTS Debugging Tool

# Debug Visualization

Visualization is often MORE useful than logs.

Because logs explain:

# WHEN something happened

Visualization explains:

# WHY it happened

---

# Recommended Debug Overlays

Visualize:

| System       | Visualization    |
| ------------ | ---------------- |
| Selection    | selection bounds |
| Movement     | target positions |
| Steering     | steering vectors |
| Separation   | neighbor radius  |
| Pathfinding  | path nodes       |
| Spatial Grid | occupied cells   |
| Collision    | avoidance radii  |
| Formation    | formation slots  |
| Visibility   | fog cells        |
| Performance  | timing overlays  |

---

# Recommended Debug Hotkeys

Example:

```text
F1 = steering debug
F2 = pathfinding debug
F3 = spatial grid debug
F4 = formation slots
F5 = render stats
```

This becomes incredibly valuable.

---

# IMPORTANT PERFORMANCE WARNING

DO NOT:

```text
write logs to disk every frame
```

This can destroy performance.

Instead:

* buffer logs in memory
* flush periodically
* flush immediately on fatal error

---

# Recommended RTS Debug Architecture

```text
Simulation
    ↓
Event Bus
    ↓
Observability Layer
    ├── Event Logger
    ├── Error Monitor
    ├── Perf Timeline
    ├── Replay Recorder
    └── Debug Visualization
```

This architecture remains:

* scalable
* maintainable
* debuggable

---

# Recommended Prototype Priorities

## Phase 1

Build:

* structured logs
* log levels
* performance HUD
* replay command recording

---

## Phase 2

Add:

* debug overlays
* steering visualization
* spatial grid visualization
* formation visualization

---

## Phase 3

Add:

* replay debugger
* event filtering
* timeline analysis
* automated benchmark tools

---

# EXTREMELY Valuable Feature

# Last 30 Seconds Capture

When crash happens:
save:

* recent logs
* replay commands
* performance metrics

This becomes incredibly powerful for debugging.

---

# IMPORTANT RTS DEVELOPMENT INSIGHT

RTS development is often more about:

* tooling
* observability
* debugging infrastructure
* simulation introspection

than:

* raw gameplay coding

Especially early.

---

# Final Recommendation

Your prototype goal is NOT:

```text
build a complete RTS
```

Your real goal is:

```text
validate scalable RTS architecture
```

That means prioritizing:

* movement scalability
* rendering scalability
* ECS maintainability
* debugging visibility
* deterministic simulation
* observability tooling

This foundation will save enormous time later as the project grows.
