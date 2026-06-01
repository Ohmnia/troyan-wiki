# The Most Valuable Specialist Skills for Building an Online RTS Game

# Overview

If you are building an online RTS using:

* TypeScript
* Three.js
* Vite
* WebSockets/WebRTC
* Node.js
* ECS architecture

then the biggest challenge is NOT graphics.

The hardest part is:

> managing large-scale simulation complexity while keeping the game responsive, deterministic, scalable, and maintainable.

Most indie RTS projects fail because developers spend too much energy on:

* rendering
* shaders
* art systems
* visual polish

before solving:

* simulation architecture
* networking
* pathfinding
* unit coordination
* scalability

---

# The 5 Hardest / Highest-Value RTS Problems

These are the systems where the majority of your engineering effort should go.

---

# 1. Simulation Architecture (MOST IMPORTANT)

## Why It Matters

Everything in an RTS depends on simulation quality.

Bad architecture causes:

* impossible debugging
* poor scalability
* networking instability
* frame spikes
* AI problems
* desyncs

RTS games are essentially:

> giant real-time simulations.

---

## What You Need

You need a robust:

* Entity Component System (ECS)
* fixed timestep simulation
* deterministic update pipeline
* event/message system
* memory-efficient data layout

---

## Specialist Skill

# RTS Simulation Architect

This is the highest-value skill.

---

## Key Concepts

### Fixed timestep

```ts id="o7pnmx"
const FIXED_DELTA = 1 / 20
```

---

### Deterministic processing order

```text id="9c1k5x"
Input
→ Commands
→ Pathfinding
→ Steering
→ Combat
→ Resource updates
→ Rendering
```

---

### Data-oriented design

Avoid deep OOP hierarchies.

Prefer:

```text id="0m7f9u"
Components + Systems
```

instead of:

```text id="z6m9tr"
Unit extends Character extends Entity
```

---

## Your Energy Should Go Here First

This determines whether:

* 100 units works
* 1000 units works
* multiplayer works
* AI works
* replay systems work

---

# 2. Multiplayer Networking & Determinism

## Why It Matters

Online RTS networking is extremely difficult.

RTS games are NOT FPS games.

Bandwidth scales badly if done incorrectly.

---

## The Core Challenge

Synchronizing:

* thousands of units
* player commands
* AI
* projectiles
* economy
* combat

across multiple clients.

---

## Best Practice

RTS games usually use:

# Lockstep Networking

Players send:

```text id="m6xw5f"
commands
```

NOT:

```text id="1a3bn2"
unit positions
```

---

## Specialist Skill

# Deterministic Multiplayer Engineer

---

## Important Topics

### Input delay

### Command buffering

### Replay systems

### State hashing

### Desync debugging

### Tick synchronization

---

## Huge Mistake

Most developers try:

```text id="5k2sxn"
server sends world state
```

This becomes extremely expensive for RTS games.

---

## Your Energy Priority

VERY HIGH.

Networking decisions affect:

* every gameplay system
* architecture
* performance
* simulation

---

# 3. Pathfinding + Unit Movement

## Why It Matters

This is the “feel” of the RTS.

Players judge quality based on:

* unit responsiveness
* formation movement
* collision handling
* traffic jams

---

## Hard Problems

### Thousands of units moving simultaneously

### Avoiding traffic deadlocks

### Large formations

### Dynamic obstacles

### Local avoidance

---

## Specialist Skill

# RTS Movement Engineer

---

## Important Systems

### Flow fields

### Hierarchical A*

### Steering behaviors

### Spatial partitioning

### Formation systems

### Local avoidance

---

## Most Important Insight

RTS movement is mostly:

# Fake physics

NOT realistic physics.

---

## Best Practice

Use:

* soft collisions
* steering
* separation
* formation slots

Avoid:

* rigidbody physics
* realistic pushing

---

# 4. Performance & Scalability Engineering

## Why It Matters

RTS games are performance monsters.

You simulate:

* AI
* movement
* combat
* visibility
* networking
* rendering

for hundreds or thousands of units.

---

## Specialist Skill

# Real-Time Performance Engineer

---

## Important Areas

### CPU optimization

### Spatial partitioning

### Object pooling

### GPU instancing

### Memory reuse

### Hot-loop optimization

---

## Most Important Rule

Never trust:

```text id="ewr0t6"
it runs fine now
```

RTS complexity grows exponentially.

---

## Performance Targets

You should architect for:

| Scale      | Goal        |
| ---------- | ----------- |
| Small RTS  | 100 units   |
| Medium RTS | 500 units   |
| Large RTS  | 2000+ units |

---

## Critical Optimization Areas

### Simulation update loops

### Neighbor searches

### Rendering batches

### Visibility checks

### Pathfinding costs

---

# 5. AI & Decision Systems

## Why It Matters

RTS AI becomes extremely complex very quickly.

Even basic AI requires:

* resource management
* tactical behavior
* strategic planning
* threat analysis
* path coordination

---

## Specialist Skill

# RTS AI Systems Engineer

---

## AI Layers

| Layer        | Purpose            |
| ------------ | ------------------ |
| Strategic AI | Expansion, economy |
| Tactical AI  | Army positioning   |
| Unit AI      | Local combat       |
| Steering AI  | Avoidance          |

---

## Important Concepts

### Utility AI

### Behavior Trees

### Goal-Oriented Action Planning (GOAP)

### Influence maps

### Threat maps

### Fog-of-war reasoning

---

# Top 10 RTS Specialist Skills (Most Valuable → Least)

---

# 1. RTS Simulation Architect

The foundation of everything.

Without this:

* networking breaks
* AI breaks
* scaling breaks

---

# 2. Multiplayer Determinism Engineer

Critical for online RTS.

Extremely difficult to retrofit later.

---

# 3. RTS Movement & Pathfinding Engineer

Movement quality defines RTS feel.

---

# 4. Real-Time Performance Engineer

Necessary for scale.

---

# 5. RTS AI Systems Engineer

Very difficult but highly valuable.

---

# 6. ECS / Data-Oriented Design Specialist

Critical for maintainability and performance.

---

# 7. Gameplay Systems Designer

Economy, combat, balance, tech trees.

---

# 8. Three.js Rendering Engineer

Important, but often over-prioritized.

Rendering is usually easier than simulation.

---

# 9. UI/UX RTS Interaction Designer

Selection, minimap, command UX.

Huge quality-of-life impact.

---

# 10. Tooling & Pipeline Engineer

Editors, debugging tools, replay systems.

Very valuable long term.

---

# Recommended Specialist Agents for OpenCode CLI

If using AI coding agents, these are the highest-value agents to build.

---

# 1. Simulation Architect Agent

Responsibilities:

* ECS design
* fixed timestep
* command processing
* event systems
* deterministic simulation

---

# 2. Multiplayer Networking Agent

Responsibilities:

* lockstep networking
* WebSocket architecture
* rollback handling
* desync debugging
* replay systems

---

# 3. RTS Movement Agent

Responsibilities:

* pathfinding
* steering
* formations
* collision avoidance
* flow fields

---

# 4. Performance Optimization Agent

Responsibilities:

* profiling
* memory optimization
* spatial partitioning
* batching
* hot-loop optimization

---

# 5. AI Systems Agent

Responsibilities:

* tactical AI
* strategic AI
* influence maps
* behavior trees
* utility systems

---

# 6. Rendering Agent

Responsibilities:

* Three.js optimization
* instancing
* culling
* LOD systems
* shaders

---

# 7. Gameplay Systems Agent

Responsibilities:

* combat systems
* economy
* abilities
* upgrades
* tech trees

---

# 8. RTS UX/UI Agent

Responsibilities:

* selection systems
* minimap
* command responsiveness
* unit feedback
* control groups

---

# 9. Tooling & Debugging Agent

Responsibilities:

* replay systems
* debugging overlays
* simulation inspection
* profiling tools

---

# 10. Infrastructure Agent

Responsibilities:

* Vite architecture
* build tooling
* deployment
* CI/CD
* multiplayer backend hosting

---

# The Biggest RTS Development Trap

Most developers over-invest in:

* graphics
* effects
* shaders
* terrain visuals

before solving:

* simulation
* networking
* movement
* scalability

---

# Recommended Development Priority

# Phase 1 — Core Simulation

Build:

* ECS
* fixed timestep
* command system
* deterministic update loop

WITHOUT graphics.

---

# Phase 2 — Unit Movement

Build:

* pathfinding
* steering
* formations
* collision avoidance

Again:
WITHOUT graphics polish.

---

# Phase 3 — Multiplayer

Build:

* lockstep networking
* replay systems
* desync detection

VERY EARLY.

---

# Phase 4 — AI

Add:

* tactical AI
* economy AI
* combat behavior

---

# Phase 5 — Rendering & Polish

Only now focus heavily on:

* visuals
* particles
* shaders
* terrain polish

---

# Final Recommendation

If your goal is:

# “efficiently build a scalable online RTS”

then your energy should mostly go into:

| Priority | Focus                    |
| -------- | ------------------------ |
| 1        | Simulation architecture  |
| 2        | Deterministic networking |
| 3        | Unit movement            |
| 4        | Performance scaling      |
| 5        | AI systems               |

Rendering is important, but it is NOT the hardest problem in RTS engineering.

Simulation complexity is the real challenge.
