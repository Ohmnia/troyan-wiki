---
name: rts-entity-architecture
description: Use this skill when implementing, refactoring, or reviewing core RTS gameplay logic, ECS entities, pure-data components (bitECS structures), integer combat math pipelines, modifier trees, Directed Acyclic Graph (DAG) tech trees, finite state machines, or deterministic server-authoritative loops.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: simulation-architecture
  conventions: data-oriented-ecs
  tags:
    - ecs
    - typescript
    - bitecs
    - determinism
    - simulation
    - multiplayer
---

# RTS Entity & Simulation Architecture Skill

## Core Philosophy
An RTS game is fundamentally a **data simulation engine**, NOT a 3D rendering engine. Treat the 3D renderer (Three.js) purely as a passive **VISUAL VIEWER** of the underlying simulation state. 

**The Golden Rule:** Never store, mutate, or read gameplay state variables (such as health, damage, or faction flags) inside or from Three.js scene meshes or Object3D classes. 

---

# Tech Stack & Performance Budgets

All generated simulation systems, components, and event logic must align with this architectural profile:



| Operational Vector | Technical Standard | Core Performance Reason |
| :--- | :--- | :--- |
| **ECS Engine** | `bitecs` (or optimized Struct-of-Arrays) | Guarantees native CPU cache locality and zero GC churn. |
| **Entity Signature** | Pure numeric identifiers (`type Entity = number`). | Prevents object reference bloat and memory footprinting. |
| **Health & Combat** | Strict Integer-based values (No Floats). | Eliminates floating-point drift and networking syncing desyncs. |
| **Simulation Loop** | Fixed Tick-rate Gating (`10` to `30` Ticks/Sec). | Provides rock-solid determinism and low server overhead. |
| **Network Snapshots**| Binary Serialization (`FlatBuffers` / Custom Binary). | Bypasses large, slow, allocation-heavy JSON transfers. |

---

# RTS System Order & Execution Pipeline

The core simulation loop must execute decoupled systems linearly using this exact order of operations:
```text
Player Input Network Command Ingestion
    ↓
AI State Processing (Finite State Machine evaluations)
    ↓
Locomotion & Movement Integration (Velocity application, Flow Fields)
    ↓
Spatial Grid & Collision Resolution (Soft separation pushing)
    ↓
Combat Engine Evaluation (Weapon cooldown ticks, aggro queries)
    ↓
Damage Event Bus Resolution (Armor lookup modifications applied to Integer arrays)
    ↓
Buff & Status Duration Ticks (Time-based modifier pipelines)
    ↓
Entity Death & Deregistration (Cleanup routines)
    ↓
Renderer Synchronizer Pass (Three.js reads final data states and adjusts instances)
```

---

# AI Code Generation Rules

### 1. Pure Struct-of-Arrays (SoA) Component Definition
When creating new components or entity properties, never allocate JavaScript classes or object graphs. Always enforce flat, fixed-size Typed Arrays mapped directly by numerical Entity IDs:
```ts
// Enforced inside the ecs component registration block
export const MAX_ENTITIES = 10000;

export const Health = {
  current: new Uint16Array(MAX_ENTITIES), // Integer tracking for network determinism
  max: new Uint16Array(MAX_ENTITIES)
};

export const AbilityCooldown = {
  remaining: new Float32Array(MAX_ENTITIES) // Used for internal timer reductions
};
```

### 2. Event-Driven Queued Combat Processing
* **No Direct State Mutation:** Systems must not directly subtract health fields during combat evaluation ticks. Instead, push lightweight events onto a pre-allocated Object Pool queue.
* **Lookup Tables for Multipliers:** Calculate dynamic damage scales using a flat 2D multiplier array rather than branching conditions:
  ```ts
  // Inside the Damage System processing pass
  for (const evt of damageEventPool.active) {
    const armorType = Armor.type[evt.target];
    const multiplier = damageMultiplierTable[evt.damageType][armorType];
    
    Health.current[evt.target] -= Math.floor(evt.amount * multiplier);
    if (Health.current[evt.target]  Soldier -> Sniper`). Replace with granular components.
* Banish the `new` keyword and inline closures inside hot execution systems (`units.forEach(u => u.update())`).
* Banish floating-point percentages (`health = 0.62`) inside core combat logic. Enforce precise integers (`health = 620`).
