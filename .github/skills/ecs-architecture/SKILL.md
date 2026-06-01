````md
---
name: ecs-architecture
description: Use this skill when designing, reviewing, or refactoring Entity Component System architecture for RTS-scale simulation systems using TypeScript and data-oriented design.
version: 1.1.0
compatibility: github-copilot-agent
license: MIT
tags:
  - ecs
  - data-oriented-design
  - gamedev
  - architecture
  - typescript
  - performance
  - simulation
---

# ECS Architecture Skill

## Mission

Design scalable, deterministic, debuggable ECS architectures suitable for RTS-scale simulations with thousands of active entities.

Focus on:

- data-oriented design
- deterministic simulation
- predictable performance
- isolated systems
- testable logic
- maintainable component composition

---

# Rule Precedence

When rules conflict, apply them in this order:

1. RTS Priorities
2. Core ECS Philosophy
3. System Rules
4. Component Rules
5. Performance Rules

---

# Core ECS Philosophy

Prefer:

- composition over inheritance
- systems over giant entity classes
- flat data structures
- deterministic processing
- explicit data flow
- immutable inputs where possible
- predictable update ordering

Avoid:

- deep inheritance hierarchies
- hidden mutable state
- giant `Unit` classes
- tightly coupled systems
- frame-dependent gameplay logic
- side-effect-heavy systems
- implicit dependencies between systems

---

# Preferred Architecture

Use:

```text
Entities + Components + Systems
````

Example:

```text
Entity
 ├── PositionComponent
 ├── VelocityComponent
 ├── HealthComponent
 └── AttackComponent
```

Avoid:

```text
Unit extends Character extends Actor extends Entity
```

Reason:

Inheritance trees become rigid, difficult to debug, and expensive to scale in RTS environments.

---

# Component Rules

Components should be:

* small
* serializable
* cache-friendly
* isolated
* Components must contain only serializable data fields. No methods except plain constructors or static factory functions that perform no side effects.
* versionable
* easy to snapshot and restore

Recommended:

```ts
interface PositionComponent {
  x: number;
  y: number;
}
```

Avoid:

* embedded business logic
* side effects
* large nested objects
* direct references to unrelated systems
* rendering or networking logic inside components

Avoid:

```ts
class Unit {
  move() {}
  attack() {}
  pathfind() {}
  render() {}
}
```

---

# System Rules

Systems should:

* process one responsibility
* iterate deterministically
* avoid hidden mutations
* be independently testable
* minimize branching
* fail gracefully
* validate required components
* avoid direct system-to-system coupling

Recommended:

```ts
for (const entity of movementQuery) {
  position.x += velocity.x * delta;
  position.y += velocity.y * delta;
}
```

Avoid:

* modifying unrelated components
* random update ordering
* hidden allocations inside loops
* reliance on global mutable state

---

# Inter-System Communication

Use an event queue component (e.g., `EventBufferComponent`) written by producing systems and consumed by subscribing systems in a deterministic order. Never call system methods directly from another system.

Example:

```ts
// Producing system writes events
eventBuffer.push({ type: 'UnitDied', entityId });

// Consuming system reads events next tick
for (const event of eventBuffer) {
  if (event.type === 'UnitDied') { /* handle */ }
}
```

---

# Determinism Rules

RTS simulations should remain deterministic whenever multiplayer synchronization or replay systems are required.

Prefer:

* fixed timestep simulation
* deterministic iteration order
* integer math where appropriate
* seeded random generators
* simulation authority separation

Avoid:

* frame-rate-dependent logic
* unordered object iteration
* non-deterministic async operations in simulation
* floating point drift accumulation without correction

Recommended:

```ts
const FIXED_TIMESTEP = 16;
```

Avoid:

```ts
update(deltaTime);
```

when gameplay depends directly on variable frame timing.

---

# Performance Rules

> These rules apply within the constraints of higher-priority concerns (scalability, determinism, maintainability, debuggability). When a simpler allocation-heavy approach better serves those priorities, prefer it and optimize later.

Optimize for large-scale entity counts.

Prefer:

* arrays over nested objects
* struct-of-arrays layouts where beneficial
* Use pre-allocated object pools or typed array scratch buffers for temporary data inside hot loops; never use `new` inside per-frame iteration.
* pooled entities
* contiguous iteration
* query caching
* batch processing

Avoid:

* allocations in hot loops
* excessive garbage collection pressure
* repeated query rebuilding
* dynamic object reshaping
* deep cloning large game state

Recommended:

```ts
const positionsX = new Float32Array(MAX_ENTITIES);
const positionsY = new Float32Array(MAX_ENTITIES);
```

---

# Error Handling

When reviewing existing code, report violations grouped by RTS Priority impact (highest priority violations first). Suggest one refactor path per violation rather than listing all possible fixes.

Systems should fail safely and provide actionable diagnostics.

Prefer:

* validating component existence before processing
* explicit null checks
* defensive query handling
* structured logging
* recoverable failures where possible
* debug assertions in development builds

Recommended:

```ts
if (!healthComponent) {
  logger.warn(`Missing HealthComponent for entity ${entityId}`);
  continue;
}
```

Avoid:

```ts
entity.health.current -= damage;
```

without validating the component exists.

Do not:

* silently swallow errors
* throw exceptions inside hot loops unless critical
* allow partial mutations during failed system execution

---

# Semantic Coverage Guidelines

When generating ECS code or architecture suggestions, ensure coverage for:

* entity lifecycle management
* component registration
* system scheduling
* deterministic update order
* memory management
* serialization
* save/load support
* networking implications
* replay compatibility
* debugging hooks
* profiling support
* scalability considerations
* testing strategy
* error handling paths
* edge-case validation

Generated examples should include:

* realistic component structures
* clear system boundaries
* update flow examples
* failure handling examples
* performance-conscious iteration

Avoid incomplete architecture examples that omit:

* cleanup logic
* invalid entity handling
* missing component handling
* synchronization concerns
* debugging or observability support

---

# RTS Priorities

Priority order:

1. scalability
2. determinism
3. maintainability
4. debuggability
5. performance
6. extensibility
7. tooling support

---

# Recommended Patterns

## Good

```text
Input System
  -> Command Buffer
    -> Simulation Systems
      -> Event Queue
        -> Rendering
```

## Avoid

```text
Rendering directly modifies gameplay state
```

---

# Testing Expectations

Systems should support:

* isolated unit testing
* deterministic replay testing
* simulation verification
* performance benchmarking
* snapshot testing

Recommended:

```ts
expect(simulationState).toEqual(expectedState);
```

---

# Observability

Prefer architectures that support:

* debug overlays
* frame event tracing
* deterministic replay capture
* performance metrics
* entity inspection tools
* simulation state snapshots

---

# Networking Guidance

For multiplayer RTS architectures:

Prefer:

* lockstep simulation
* deterministic commands
* compact serialized state
* rollback-safe state mutation

Avoid:

* direct state replication for all entities
* non-deterministic simulation side effects
* rendering-driven gameplay state

---

# TypeScript Implementation Notes

Prefer `Float32Array` / `Int32Array` over plain arrays for numeric component data. Avoid generic `object` types for components; use discriminated unions or explicit interfaces. Be explicit about `readonly` to signal immutable component data.

Prefer:

```ts
const positionsX = new Float32Array(MAX_ENTITIES); // typed, cache-friendly
interface PositionComponent { readonly x: number; readonly y: number; }
```

Avoid:

```ts
const positions: object[] = []; // untyped, causes GC pressure
```

---

# Entity Lifecycle

Use deferred destruction: mark entities with a `DestroyedTag` component during simulation, then batch-remove them at the end of the tick. Recycle entity IDs using a free-list to avoid unbounded ID growth.

```ts
// During tick: mark for removal
components.destroyedTag[entityId] = 1;

// End of tick: batch cleanup
for (let i = 0; i < MAX_ENTITIES; i++) {
  if (components.destroyedTag[i]) {
    freeList.push(i);
    clearComponents(i);
  }
}
```

---

# Summary

A proper RTS ECS architecture should:

* scale to thousands of entities
* remain deterministic
* minimize memory churn
* isolate responsibilities
* support replay/debugging
* tolerate partial failures safely
* remain maintainable long-term

```
```
