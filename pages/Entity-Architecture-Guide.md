# Expert Guide: RTS Entity Architecture for Web Games (Three.js + TypeScript)

# Table of Contents

1. Core RTS Architecture Philosophy
2. The Biggest RTS Mistakes
3. Recommended Architecture
4. Why ECS Is The Best Choice
5. Entity Design
6. Component Design
7. Health Systems
8. Damage Systems
9. Ability Systems
10. Tech Tree Architecture
11. Upgrade Systems
12. Buffs & Debuffs
13. State Machines
14. Networking Architecture
15. Server Authority
16. Deterministic Simulation
17. Performance Scaling
18. Memory Optimization
19. Serialization
20. Rendering Separation
21. Example ECS Layout
22. Recommended Project Structure
23. Example TypeScript Code
24. Best Practices
25. Final Recommendations

---

# 1. Core RTS Architecture Philosophy

RTS games are fundamentally:

```txt
Data simulation engines
```

NOT:

```txt
3D rendering engines
```

The renderer is only a VISUALIZATION of game state.

This distinction is critical.

---

# Golden Rule

## NEVER store gameplay state inside Three.js objects.

BAD:

```ts
mesh.health = 100;
mesh.damage = 20;
```

GOOD:

```ts
HealthComponent
DamageComponent
AbilityComponent
```

Three.js should ONLY render.

---

# 2. The Biggest RTS Mistakes

# Common Beginner Errors

## 1. Gameplay inside render objects

```txt
Mesh contains game logic
```

This destroys scalability.

---

## 2. Massive inheritance trees

BAD:

```txt
Unit
  → Soldier
    → Sniper
      → EliteSniper
```

This becomes impossible to maintain.

---

## 3. Per-unit update loops

BAD:

```ts
units.forEach(unit => unit.update());
```

This scales poorly.

---

## 4. Large object allocations

RTS games generate enormous amounts of state changes.

Garbage collection spikes will kill performance.

---

# 3. Recommended Architecture

# BEST MODERN APPROACH

```txt
ECS (Entity Component System)
+
Data-oriented design
+
Server authoritative simulation
+
Renderer separation
```

---

# Recommended Stack

| System        | Recommendation              |
| ------------- | --------------------------- |
| ECS           | bitecs                      |
| Rendering     | Three.js                    |
| Physics       | Rapier                      |
| Networking    | Colyseus / Nakama           |
| Serialization | FlatBuffers / custom binary |
| State Sync    | Snapshot interpolation      |
| Pathfinding   | Flow fields                 |

---

# 4. Why ECS Is The Best Choice

# Traditional OOP Fails at RTS Scale

RTS games may contain:

```txt
10,000+ entities
```

OOP becomes cache inefficient.

---

# ECS Advantages

## ECS stores:

```txt
Behavior separately from data
```

This is ideal for RTS workloads.

---

# ECS Structure

```txt
Entity
  = ID only

Components
  = pure data

Systems
  = logic processors
```

---

# Example

```txt
Entity #1052

Components:
- Position
- Health
- Damage
- Abilities
- Target
- Movement
- Team
```

---

# 5. Entity Design

# Best Practice

Entities should ONLY contain:

```ts
type Entity = number;
```

That is all.

---

# NEVER Store

```txt
methods
logic
render state
```

inside entities.

---

# 6. Component Design

# Components Should Be PURE DATA

GOOD:

```ts
interface HealthComponent {
  current: number;
  max: number;
}
```

BAD:

```ts
class Health {
  takeDamage() {}
  regenerate() {}
}
```

Logic belongs in systems.

---

# Recommended Components

# Core Components

```txt
Position
Rotation
Velocity
Health
Damage
Armor
Team
Target
Movement
Selectable
Vision
```

---

# Combat Components

```txt
AttackCooldown
ProjectileWeapon
MeleeWeapon
Aggro
StatusEffects
```

---

# RTS-Specific Components

```txt
TechTreeNode
ProductionQueue
ResourceStorage
Builder
Harvester
PopulationCost
```

---

# Ability Components

```txt
AbilitySlots
Cooldowns
Mana
Energy
```

---

# 7. Health Systems

# BEST PRACTICE

Health should be:

```txt
integer-based
```

NOT floating point.

---

# Why?

Integers:

```txt
deterministic
faster
network efficient
easier syncing
```

---

# Recommended Format

```ts
interface HealthComponent {
  current: number;
  max: number;
}
```

---

# Avoid Percentages Internally

BAD:

```ts
health = 0.62;
```

GOOD:

```ts
health = 620;
max = 1000;
```

---

# Damage Processing Pipeline

```txt
Incoming damage
→ armor reduction
→ shield reduction
→ health reduction
→ death check
→ event dispatch
```

---

# 8. Damage Systems

# Best Practice

Use:

```txt
Queued combat events
```

NOT direct mutation everywhere.

---

# Recommended Damage Event

```ts
interface DamageEvent {
  source: Entity;
  target: Entity;
  amount: number;
  type: DamageType;
}
```

---

# Why Event Queues Matter

Benefits:

```txt
deterministic
multiplayer safe
easy replay systems
rollback friendly
debuggable
```

---

# Damage Types

Recommended:

```txt
physical
explosive
energy
fire
ice
poison
siege
```

---

# Armor Tables

Use lookup tables:

```ts
damageMultiplier[DamageType][ArmorType]
```

This is MUCH faster than conditionals.

---

# 9. Ability Systems

# Best RTS Ability Design

Abilities should be:

```txt
data-driven
```

NOT hardcoded.

---

# Example Ability Definition

```ts
interface AbilityDefinition {
  id: string;
  cooldown: number;
  range: number;
  energyCost: number;
  effects: EffectDefinition[];
}
```

---

# Runtime Ability State

```ts
interface AbilityState {
  cooldownRemaining: number;
  charges: number;
}
```

---

# NEVER Put Logic Inside Ability Definitions

Definitions are static.

State is dynamic.

---

# Recommended Ability Architecture

```txt
Ability Definition
+
Ability State
+
Ability System
```

---

# 10. Tech Tree Architecture

# NEVER Hardcode Tech Trees

BAD:

```ts
if (player.hasBarracks)
```

GOOD:

```txt
graph-based unlock system
```

---

# Best Tech Tree Structure

Use:

```txt
Directed Acyclic Graph (DAG)
```

---

# Example

```txt
TownHall
  → Barracks
      → Infantry
      → Elite Infantry
```

---

# Recommended Data Structure

```ts
interface TechNode {
  id: string;
  prerequisites: string[];
  unlocks: string[];
}
```

---

# Why DAG Works Best

Benefits:

```txt
easy balancing
easy modding
easy serialization
easy UI generation
```

---

# 11. Upgrade Systems

# Best Upgrade Strategy

Use:

```txt
modifier pipelines
```

NOT permanent stat mutation.

---

# BAD

```ts
unit.damage += 5;
```

---

# GOOD

```txt
base stats
+
modifier layers
+
upgrade multipliers
```

---

# Recommended Formula

```txt
finalStat =
  base
  * upgradeMultiplier
  * auraMultiplier
  * buffMultiplier
```

---

# 12. Buffs & Debuffs

# Best Practice

Buffs should be:

```txt
time-based modifiers
```

---

# Recommended Buff Structure

```ts
interface Buff {
  type: BuffType;
  duration: number;
  magnitude: number;
}
```

---

# Avoid Permanent Mutation

Always calculate final values dynamically.

---

# 13. State Machines

# Units NEED State Machines

Typical states:

```txt
Idle
Moving
Attacking
Building
Harvesting
Fleeing
Casting
Dead
```

---

# Recommended Approach

Use:

```txt
finite state machines
```

NOT giant condition chains.

---

# Example

```ts
switch(state) {
  case UnitState.Attacking:
}
```

---

# 14. Networking Architecture

# MOST IMPORTANT RULE

## SERVER AUTHORITATIVE.

Always.

---

# Why?

Prevents:

```txt
cheating
desyncs
speed hacks
modified clients
```

---

# Client Responsibilities

Clients should ONLY:

```txt
predict
interpolate
render
send commands
```

---

# Server Responsibilities

Server owns:

```txt
truth
combat
economy
pathfinding
visibility
simulation
```

---

# 15. Deterministic Simulation

# Critical for RTS

Use:

```txt
fixed tick simulation
```

---

# Recommended Tick Rate

```txt
10–30 simulation ticks/sec
```

NOT:

```txt
60+
```

RTS does not require shooter-level responsiveness.

---

# Fixed Tick Example

```ts
const FIXED_TICK = 100;
```

---

# Why Fixed Ticks Matter

Benefits:

```txt
sync stability
determinism
replay support
rollback support
lower CPU cost
```

---

# 16. Performance Scaling

# Biggest RTS CPU Costs

Usually:

```txt
pathfinding
AI
visibility
combat checks
```

NOT rendering.

---

# Optimization Priority

## Optimize SIMULATION first.

---

# Best Performance Practices

## Use:

```txt
typed arrays
struct-of-arrays
pooled objects
batch processing
spatial partitioning
```

---

# Avoid

```txt
deep object graphs
closures in hot loops
frequent allocations
```

---

# 17. Memory Optimization

# RTS Games Are Memory Intensive

Avoid:

```ts
new DamageEvent()
```

every frame.

---

# Use Object Pools

```txt
preallocated buffers
reused event objects
```

---

# Example

```ts
damageEventPool.acquire();
```

---

# 18. Serialization

# Best Network Strategy

Use:

```txt
binary serialization
```

NOT JSON.

---

# Why?

JSON is:

```txt
large
slow
allocation heavy
```

---

# Recommended Formats

| Format        | Good             |
| ------------- | ---------------- |
| FlatBuffers   | Excellent        |
| Protobuf      | Excellent        |
| Custom binary | Best performance |

---

# 19. Rendering Separation

# CRITICAL RULE

Renderer should ONLY:

```txt
read ECS state
```

Never own gameplay.

---

# Rendering Flow

```txt
Simulation
→ ECS state update
→ renderer reads state
→ mesh transforms update
```

---

# Example

```ts
mesh.position.set(
  Position.x[id],
  Position.y[id],
  Position.z[id]
);
```

---

# 20. Example ECS Layout

# Best Modern Layout

```txt
ECS
 ├── Components
 ├── Systems
 ├── Queries
 ├── Event Queues
 └── Simulation Tick
```

---

# Recommended System Order

```txt
Input
→ AI
→ Movement
→ Collision
→ Combat
→ Damage
→ Buffs
→ Death
→ Rendering Sync
```

---

# 21. Recommended Project Structure

```txt
src/
  ecs/
    components/
    systems/
    events/
    queries/

  gameplay/
    abilities/
    tech/
    combat/

  networking/
    snapshots/
    commands/

  rendering/
    meshes/
    materials/
    effects/
```

---

# 22. Example TypeScript Code

# Health Component

```ts
export const Health = {
  current: new Uint16Array(MAX_ENTITIES),
  max: new Uint16Array(MAX_ENTITIES),
};
```

---

# Damage Queue

```ts
interface DamageEvent {
  source: number;
  target: number;
  amount: number;
}
```

---

# Damage System

```ts
for (const evt of damageQueue) {
  Health.current[evt.target] -= evt.amount;

  if (Health.current[evt.target] <= 0) {
    destroyEntity(evt.target);
  }
}
```

---

# Ability Cooldowns

```ts
export const AbilityCooldown = {
  remaining: new Float32Array(MAX_ENTITIES),
};
```

---

# Tech Tree Node

```ts
interface TechNode {
  id: string;
  prerequisites: string[];
}
```

---

# 23. Best Practices

# DO

## Use:

```txt
ECS
fixed ticks
integer health
event queues
typed arrays
binary networking
server authority
```

---

# DO NOT

## Avoid:

```txt
logic in meshes
deep inheritance
JSON sync
per-frame allocations
floating-point combat
massive monolithic classes
```

---

# 24. Scaling Strategy

# If You Want Massive RTS Battles

Prioritize:

```txt
cache efficiency
batch processing
minimal allocations
spatial partitioning
deterministic simulation
```

---

# 25. Final Recommendations

# Best Overall RTS Architecture

## Ideal Modern Stack

```txt
TypeScript
Three.js
bitecs ECS
Fixed-tick simulation
Server authoritative networking
Binary snapshots
Instanced rendering
GPU-driven visuals
```

---

# Golden RTS Rule

## Treat the renderer as a VIEWER.

NOT the game itself.

---

# Best Overall Design Philosophy

```txt
Data-oriented simulation
+
GPU-efficient rendering
+
Server authority
+
Event-driven combat
+
Deterministic systems
```

This architecture scales to:

```txt
thousands of units
large battles
spectator systems
replays
competitive multiplayer
massive maps
```

while remaining:

```txt
fast
maintainable
network efficient
future proof
```
