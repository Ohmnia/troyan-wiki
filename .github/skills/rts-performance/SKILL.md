---
name: rts-performance
description: Use this skill when optimizing RTS simulation performance, movement systems, rendering scalability, ECS iteration, or large-scale unit processing.
compatibility: github-copilot-agent
license: MIT
tags:
  - performance
  - optimization
  - rts
  - ecs
  - rendering
  - simulation
---

# RTS Performance Skill

## Core Philosophy

Always assume:

```text id="e0m0me"
Current scale * 20
```

Any inefficient system will eventually collapse.

---

# Primary Bottlenecks

RTS bottlenecks are usually:

* movement systems
* neighbor queries
* pathfinding
* ECS iteration
* visibility checks
* draw calls
* memory churn

NOT:

* graphics alone

---

# Performance Rules

Avoid:

* O(n²) algorithms
* per-frame allocations
* hidden memory churn
* deep object nesting
* repeated expensive queries

Prefer:

* object pooling
* flat arrays
* spatial partitioning
* batched updates
* explicit loops
* reusable vector memory

---

# Hot Loop Rules

Avoid in hot loops:

* map/filter/reduce
* closures
* temporary vectors
* object spreading
* deep cloning

Prefer:

* for loops
* cached references
* reusable buffers

---

# RTS Performance Priorities

1. stable frametimes
2. scalability
3. low GC pressure
4. deterministic performance
5. maintainability
---
