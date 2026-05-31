# The Strategy Game Engineering Bible

# RTS Development Knowledge Base

# Senior Engineering Doctrine for Large-Scale Strategy Games

---

# PURPOSE OF THIS DOCUMENT

This document exists to teach:

* how professional strategy games are engineered
* why most RTS projects fail
* how to build scalable gameplay systems
* how to maintain performance
* how to avoid catastrophic technical debt
* how to think like a senior game engineer

This is NOT:

* beginner tutorial theory
* academic-only computer science
* “perfect architecture” fantasy

This is:

* production reality
* battle-tested engineering philosophy
* scalability doctrine
* gameplay-first development

---

# THE FIRST LAW OF GAME DEVELOPMENT

# THE PLAYER DOES NOT CARE

ABOUT YOUR CODEBASE.

Players care about:

* responsiveness
* clarity
* feel
* consistency
* immersion
* stability

NOT:

* elegant abstractions
* advanced design patterns
* clever architectures

A successful game with ugly code ships.
A perfect architecture with no game dies unfinished.

---

# THE SECOND LAW OF RTS DEVELOPMENT

# READABILITY IS EVERYTHING

If the player cannot instantly understand:

* combat
* movement
* threats
* resources
* territory

then the game fails.

RTS games are information warfare.

Visual clarity always overrides:

* realism
* detail
* spectacle

---

# THE THIRD LAW OF SOLO DEVELOPMENT

# FINISHABLE SYSTEMS

BEAT AMBITIOUS SYSTEMS.

Bad:

* infinite procedural worlds
* 400 unit types
* dynamic weather ecosystems
* advanced diplomacy simulation

Good:

* one polished gameplay loop
* readable combat
* stable performance
* strong faction identity

---

# CORE ENGINEERING PHILOSOPHY

Professional RTS engines prioritize:

```text id="7gk0de"
1. Determinism
2. Performance
3. Readability
4. Scalability
5. Stability
6. Tooling
7. Content pipelines
```

NOT:

* visual excess
* realism obsession
* engine complexity

---

# DELTA TIME

# WHAT IS DELTA TIME?

Delta time is:

* the elapsed time between frames

Example:

```text id="0ty63t"
Frame 1 = 16ms
Frame 2 = 17ms
Frame 3 = 15ms
```

Movement must use delta time.

Otherwise:

* gameplay speed changes with FPS

---

# CORRECT MOVEMENT

```ts id="w3oy0g"
position += velocity * deltaTime
```

---

# WRONG MOVEMENT

```ts id="4y3i3n"
position += velocity
```

This causes:

* faster PCs = faster gameplay
* inconsistent simulation

---

# FIXED TIMESTEP

Professional RTS games usually separate:

## Rendering

from

## Simulation

---

# WHY?

Rendering FPS changes constantly.

Simulation must remain stable.

---

# COMMON STRUCTURE

```text id="g1k2ln"
Rendering = variable FPS

Simulation = fixed tick rate
```

Example:

```text id="9gbmka"
Simulation Tick:
20 ticks/sec
30 ticks/sec
60 ticks/sec
```

---

# WHY FIXED TIMESTEP MATTERS

Without fixed simulation:

* physics becomes unstable
* AI behaves inconsistently
* networking becomes impossible
* combat desync occurs

---

# PROFESSIONAL RTS RULE

# GAMEPLAY SHOULD NOT DEPEND

ON FRAME RATE.

---

# COLLISION DETECTION

# MOST BEGINNERS OVERCOMPLICATE COLLISION

RTS games rarely use:

* complex physics engines
* mesh collision
* realistic rigidbodies

Instead:

* simplified collision volumes

---

# COMMON COLLISION TYPES

| Type    | Usage       |
| ------- | ----------- |
| Sphere  | Units       |
| Capsule | Characters  |
| Box     | Buildings   |
| Grid    | Pathfinding |
| Raycast | Selection   |

---

# RTS COLLISION PHILOSOPHY

RTS collision is mostly:

* spatial organization
* avoidance
* occupancy

NOT:

* realistic physics

---

# PROFESSIONAL RTS SECRET

Many RTS games fake:

* collision
* physics
* impact
* destruction

because:

* readability matters more

---

# PATHFINDING

# PATHFINDING IS ONE OF THE HARDEST RTS PROBLEMS

**Concept / Definitions Claried:**

# Pathfinding Architecture
Game developers combine **A* search**, **flow fields**, and **hierarchical grids** to create scalable, real-time navigation systems for hundreds or thousands of in-game agents. 
---## Core Components Defined*   **A* Search**: A heuristic-driven algorithm that finds the shortest path between two specific points.*   **Flow Fields**: A grid of directional vectors that steer any agent toward a single, shared destination.*   **Hierarchical Grids**: A multi-layered map representation that separates paths into high-level zones and low-level tiles.
---## How They Work Together

[ Hierarchical Grid ] ---> 1. Breaks large map into macro-nodes
|
v
[ A* Search ] ---> 2. Finds high-level path through macro-nodes
|
v
[ Flow Fields ] ---> 3. Generates local steering vectors for crowd movement


### 1. Hierarchical Grids (The Map Structure)
*   **Concept**: Divide a massive game map into a two-tier grid.
*   **Low-Level**: Individual tiles (e.g., 1x1 meters) tracking precise obstacles like trees or walls.
*   **High-Level**: Macro-zones (e.g., 10x10 tiles) tracking connectivity between larger rooms or regions.
*   **Benefit**: Reduces the search space by ignoring local clutter during long-distance planning.

### 2. Hierarchical A* (The Macro Planner)
*   **Concept**: A* runs strictly on the high-level macro-nodes instead of individual tiles.
*   **Process**: It finds which sequence of macro-zones an agent must cross to reach the target destination.
*   **Benefit**: Drastically cuts down CPU cycles, preventing game stutter when calculating long-range paths.

### 3. Flow Fields (The Micro Navigator)
*   **Concept**: Once A* identifies the macro-path, a flow field is generated inside the active macro-zones.
*   **Process**: Dijkstra's algorithm calculates a "cost field" from the destination backward, creating a grid of arrows (vectors).
*   **Benefit**: Moving units do not need individual paths; they simply read the vector arrow of the tile they stand on.

---

## Real-World Use Case: RTS Games

In Real-Time Strategy (RTS) games like *StarCraft* or *Supreme Commander*, a player might order 500 soldiers to march across a giant continent.

1.  **Hierarchical Grid** checks the world map and isolates the 5 large regions the army must traverse.
2.  **A*** plots the line through those 5 regions instantly.
3.  **Flow Fields** activate inside those regions, guiding all 500 units simultaneously around rocks, corners, and each other without computing 500 separate paths.

---

## Tailoring to Your Architecture

To get specific code examples or implementation advice, let me know:
*   What **game engine** or **programming language** are you using?
*   How many **simultaneous pathfinding units** does your game need to support?
*   Is your game environment **static** or **dynamically changing** (destructible terrain, moving barriers)?




Most RTS games use:

* A*
* flow fields
* hierarchical grids

NOT:

* full physics navigation

---

# COMMON BEGINNER MISTAKE

Trying:

* “realistic movement”
* physics-driven units
* complex navmesh systems

early.

This destroys:

* scalability
* predictability
* CPU budget

---

# RTS PATHFINDING PRIORITIES

```text id="1slz4s"
1. Stability
2. Scalability
3. Readability
4. Performance
5. Accuracy
```

NOT:

* realism

---

# FLOW FIELD PATHFINDING

Large RTS games often use:

* flow fields

instead of:

* individual A* for every unit

Reason:
A* becomes expensive at scale.

---

# AI ENGINEERING

# GAME AI IS MOSTLY ILLUSION

Good AI does NOT mean:

* human intelligence

Good AI means:

* believable behavior
* readable behavior
* predictable strategic response

---

# BAD AI

Feels:

* random
* unfair
* chaotic

---

# GOOD AI

Feels:

* understandable
* reactive
* strategic
* intentional

---

# RTS AI PRIORITIES

```text id="5j0mkq"
1. Readability
2. Predictability
3. Performance
4. Strategic illusion
```

---

# PERFORMANCE ENGINEERING

# PERFORMANCE IS A DESIGN PROBLEM

NOT:

* an optimization phase later

---

# BAD PIPELINE

```text id="m8l9gw"
Build everything first
Optimize later
```

This often fails completely.

---

# GOOD PIPELINE

```text id="q6f1z0"
Build
Measure
Optimize
Repeat
```

---

# CPU VS GPU

# RTS GAMES ARE USUALLY CPU LIMITED

Because of:

* AI
* pathfinding
* simulation
* unit logic
* command systems

NOT graphics.

---

# GPU COSTS

Mostly:

* rendering
* postprocessing
* shadows
* transparency
* particles

---

# CPU COSTS

Mostly:

* unit updates
* AI
* pathfinding
* collision
* simulation

---

# GOLDEN PERFORMANCE RULE

# NEVER UPDATE

EVERYTHING EVERY FRAME.

---

# PROFESSIONAL TECHNIQUES

Use:

* update intervals
* LOD logic
* sleeping systems
* visibility culling
* chunk systems

---

# OBJECT POOLING

# NEVER CONSTANTLY CREATE/DESTROY OBJECTS

Bad:

```ts id="m2m7wo"
new Bullet()
delete Bullet()
```

This creates:

* garbage collection spikes
* frame stutter

---

# GOOD

Reuse objects.

```text id="7jzjyt"
bullet pool
particle pool
effect pool
```

---

# MEMORY MANAGEMENT

# STABLE MEMORY = STABLE FRAME RATE

Most stutter comes from:

* garbage collection
* memory churn
* allocation spikes

---

# PROFESSIONAL RULE

Avoid:

* unnecessary allocations inside update loops

---

# GOOD

```ts id="i9jqca"
reuse vectors
reuse arrays
reuse objects
```

---

# BAD

```ts id="x1u7v8"
new Vector3()
inside update()
```

---

# ENTITY COMPONENT SYSTEMS (ECS)

# ECS IS NOT MAGIC

Many beginners think:

* ECS automatically solves scalability

False.

Bad ECS:

* becomes abstraction hell

---

# GOOD ECS

Should:

* reduce coupling
* improve batching
* simplify scaling

---

# BAD ECS

Creates:

* unreadable architecture
* debugging nightmares
* overengineering

---

# SOLO DEV RECOMMENDATION

DO NOT build:

* custom AAA ECS engine

until:

* gameplay exists

---

# RENDERING PHILOSOPHY

# GAMEPLAY FIRST

GRAPHICS SECOND.

---

# WHY MANY INDIE RTS GAMES FAIL VISUALLY

They prioritize:

* screenshots

instead of:

* gameplay readability

---

# RTS VISUAL PRIORITY

```text id="z8d9q2"
1. Units
2. Combat
3. Selection
4. Buildings
5. Resources
6. Terrain
7. Atmosphere
```

Terrain should NEVER dominate readability.

---

# SHADOWS

# REALTIME SHADOWS ARE EXPENSIVE

RTS games often fake shadows using:

* decals
* blob shadows
* baked AO

because:

* gameplay readability matters more

---

# PARTICLE SYSTEMS

# PARTICLES ARE CHEAP

UNTIL THEY AREN'T.

Common killer:

* transparency overdraw

---

# BAD PARTICLE USAGE

* full-screen smoke
* excessive alpha blending
* huge overlapping transparency

---

# GOOD PARTICLE USAGE

* sparse
* purposeful
* gameplay readable

---

# NETWORKING

# RTS MULTIPLAYER IS EXTREMELY HARD

Because:

* determinism matters
* desyncs destroy games
* simulation consistency required

---

# SOLO DEV ADVICE

DO NOT START WITH MULTIPLAYER.

Build:

* stable single-player simulation first

---

# GAME FEEL

# GAME FEEL IS EVERYTHING

Players forgive:

* low poly graphics
* simple systems

They do NOT forgive:

* sluggish controls
* poor responsiveness
* unclear feedback

---

# GAME FEEL COMPONENTS

```text id="0t03d4"
input responsiveness
animation timing
audio feedback
impact feedback
camera response
movement smoothing
selection clarity
```

---

# STRATEGY GAME UX

# UX IS STRATEGY DESIGN

Poor UI destroys:

* tactical thinking
* readability
* player trust

---

# GOOD RTS UI

Should:

* reduce cognitive load
* communicate state instantly
* minimize clicks

---

# RTS CAMERA RULES

# CAMERA STABILITY IS SACRED

Bad:

* excessive shake
* cinematic movement
* unstable zoom

Good:

* predictable framing
* stable orientation
* readable battlefield

---

# CONTENT PIPELINES

# PROFESSIONAL GAMES ARE TOOL PIPELINES

NOT:

* manually assembled art piles

---

# GOOD PIPELINE

```text id="ewzj3n"
modular assets
shared materials
texture atlases
reusable systems
procedural assistance
```

---

# BAD PIPELINE

```text id="6i6jz3"
unique everything
manual everything
handcrafted every asset
```

This kills scalability.

---

# MODULARITY

# MODULARITY IS SURVIVAL

Buildings should use:

* reusable kits
* reusable materials
* reusable effects

---

# ART DIRECTION

# STRONG ART DIRECTION

BEATS HIGH DETAIL.

Players remember:

* silhouette
* palette
* atmosphere

NOT:

* polygon count

---

# WHY STARCRAFT WORKED

Not because:

* realism

Because:

* readability
* faction identity
* silhouette clarity
* responsiveness

---

# WHY SUPREME COMMANDER WORKED

Not because:

* graphics

Because:

* scale readability
* strategic clarity
* automation systems

---

# WHY FACTORIO WORKED

Because:

* systemic depth
* automation loops
* player-driven complexity

NOT:

* visual realism

---

# THE BIGGEST RTS DEVELOPMENT TRAP

# BUILDING SYSTEMS

WITHOUT A CORE LOOP.

Bad:

* giant lore
* massive worlds
* huge tech trees

before:

* movement
* combat
* economy
* feel

---

# PROFESSIONAL PROTOTYPING RULE

# PROVE FUN FIRST.

Everything else is secondary.

---

# RTS DEVELOPMENT ORDER

```text id="yr5a4g"
1. Camera
2. Movement
3. Selection
4. Combat
5. Economy
6. AI
7. Atmosphere
8. Content
9. Polish
```

NOT:

* giant content production first

---

# SOLO DEVELOPER SURVIVAL RULES

## NEVER:

* chase perfection
* rewrite constantly
* restart endlessly
* over-engineer

---

# ALWAYS:

* iterate
* simplify
* ship playable builds
* test constantly

---

# THE MOST IMPORTANT RULE

# FINISHED

BEATS
PERFECT.

A playable imperfect prototype:

* teaches everything

An unfinished dream project:

* teaches nothing

---

# FINAL ENGINEERING DOCTRINE

The best strategy games are built from:

```text id="bxl9v7"
clarity
consistency
performance
feedback
systemic depth
modular pipelines
strong iteration
controlled scope
```

NOT:

* maximal realism
* maximal complexity
* maximal graphics

---

# FINAL THOUGHT

The greatest RTS games are not simulations of reality.

They are:

* simulations of decision-making.

That distinction changes everything.

---
