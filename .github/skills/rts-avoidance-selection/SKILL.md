---
name: rts-avoidance-selection
description: Use this skill when implementing, refactoring, or optimizing RTS unit selection layers, 2D screen-space selections, group formation assignments, local steering avoidance, soft separation mechanics, uniform grid spatial partitioning, or deterministic locomotion updates.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: physics-steering
  conventions: soft-kinematics
  tags:
    - rts
    - steering
    - selection
    - collision
    - spatial-grid
    - determinism
---

# RTS Avoidance & Selection Skill

## Core Philosophy
RTS locomotion must rely on **Navigation + Steering** rather than rigid body physics constraints. Controlled cheating—such as soft penetration bounds, localized group compression, and temporary entity ghosting—is preferred over hard blocking to preserve responsiveness.

---

# RTS Movement Pipeline Sequence

All generated locomotion updates must step linearly through this exact pipeline architecture:
```text
INPUT (Mouse / Touch Interface Window)
  ↓
Unit Selection (Screen-space bounds evaluation)
  ↓
Formation Generation (Slot coordinate allocation)
  ↓
Global Pathfinding (A* Route / Flow Field generation)
  ↓
Local Steering (Reynolds Separation / Alignment vectors)
  ↓
Soft Separation (Proximity pushing adjustments)
  ↓
Velocity Integration (Fixed-timestep transform updates)
  ↓
Animation Update (Decoupled rendering extraction)
```

---

# AI Code Generation Rules

### 1. Dual Selection & Screen-Space Prioritization
When building selection handlers, use 2D screen-space pixel bounds checks as the primary method, with a 3D raycast as a fallback. Raycasting must target simplified, invisible colliders rather than animated meshes.
* **Prioritization Evaluation Order:** When multiple unit selection volumes intersect, resolve conflicts using these exact criteria:
  1. Shortest distance to the cursor center point.
  2. Entity visibility bit state.
  3. Team alliance matching (prioritize friendly units).
  4. Lowest depth distance relative to the camera near-plane.

### 2. Zero-Allocation Soft Collision & Steering
* Traditional rigid body contacts, impulses, and polygon intersections are completely disallowed.
* Implement Craig Reynolds-style soft separation forces. Use vector pushing forces away from nearby units inside a neighborhood radius: `force.add(myPos.clone().sub(otherPos).normalize())`.
* **Traffic Jam Protections:** Group move commands must navigate to unique formation offsets rather than converging on a single point (`goal = formationSlot`). Units must scale down avoidance weights or alter priority rankings based on unit class designations (e.g., heavy units push light units).

### 3. Hot-Loop Math & Performance Restrictions
To scale calculations up to thousands of active entities, code within update frame hooks must adhere to these absolute micro-optimizations:
* **Avoid Square Roots:** Always use squared distance evaluations for range tests. Replace `.distanceTo()` loops with `.distanceToSquared()` checks:
  ```ts
  if (distSq < radiusSq) { /* Trigger proximity routine */ }
  ```
* **Object Recycling:** Instantiating new math objects (e.g., `new THREE.Vector3()`) inside system loops is banned. Pre-allocate scratchpad vectors outside loops and clean them using `.set(0,0,0)` or `.copy()` methods.

### 4. Rigid Simulation Determinism
* The update loop must be decoupled from the renderer using a fixed interval constant (`const FIXED_DELTA = 1 / 20;`).
* Do not use non-deterministic physics parameters or system delta times for simulation state mutations. Ensure all internal calculation results depend entirely on initial seed arrays and historical player command tick logs.

---

# Spatial Partitioning Blueprint
To eliminate nested $O(N^2)$ tracking overhead loops, lookups must utilize a uniform tracking grid:
* **Cell Size Standard:** Initialize grid structures using a cell scale equivalent to twice the average unit radius: `cellSize = averageUnitRadius * 2;`.
* **Neighbor Culling:** Entity avoidance calculations must only sample from the unit's immediate grid node and its adjacent neighboring cells.
