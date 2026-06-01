---
name: spatial-partitioning
description: Use this skill when implementing RTS neighbor queries, movement systems, collision avoidance, visibility checks, or scalable unit interaction systems.
license: MIT
compatibility: ">=1.0.0"
tags:
- spatial-partitioning
- rts
- movement
- performance
- pathfinding
- ecs
-----

# Spatial Partitioning Skill

## Core Philosophy

Never use:

```text id="4qvg3m"
all-units vs all-units checks
```

RTS systems must scale efficiently.

---

# Preferred Spatial Systems

Use:

* uniform grids
* spatial hashing
* lightweight cell partitioning

Avoid:

* brute-force neighbor searches
* expensive tree structures too early
* premature complexity

---

# RTS Use Cases

Spatial partitioning should support:

* neighbor queries
* movement avoidance
* combat targeting
* visibility checks
* selection queries
* pathfinding optimization

---

# Preferred Architecture

```text id="d3d6b6"
World
→ Spatial Grid
→ Cell Buckets
→ Neighbor Queries
```

---

# Performance Rules

* minimize query counts
* reuse query buffers
* avoid allocations during queries
* update partitions incrementally

---

# Cell Design Rules

Cells should be:

* lightweight
* cache-friendly
* easy to update
* iteration-efficient

Avoid:

* deep recursive structures
* excessive dynamic allocations

---

# RTS Priorities

1. scalability
2. query efficiency
3. low memory overhead
4. deterministic behavior
5. maintainability

---
