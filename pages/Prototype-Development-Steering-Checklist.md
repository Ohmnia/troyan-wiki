# Troyan (3226 AD)

# Prototype Development Steering Checklist

# Solo AI-Assisted RTS Development Roadmap

---

# DOCUMENT PURPOSE

This document acts as:

* development steering guide
* milestone tracker
* AI copilot task reference
* production roadmap
* scope control system

Every task should be completed in small manageable chunks.

When complete:

* change `[ ]` to `[x]`
* record notes if needed
* move to next milestone

---

# STATUS LEGEND

```text
[ ] = Not Started
[-] = In Progress
[x] = Complete
[!] = Blocked
```

---

# DEVELOPMENT RULES

## CORE RULES

* Prototype FIRST
* Polish later
* Systems before content
* Readability before realism
* Gameplay before graphics
* Finish vertical slice before expansion

---

# PROJECT STRUCTURE

## Main Development Goals

| ID    | Goal                  |
| ----- | --------------------- |
| CORE  | Core RTS gameplay     |
| TECH  | Technical foundation  |
| ART   | Visual identity       |
| MAP   | Battlefield systems   |
| UI    | Interface systems     |
| AUDIO | Sound & atmosphere    |
| AI    | Enemy behavior        |
| FX    | Environmental effects |
| LOG   | Logistics systems     |
| OPT   | Optimization          |
| BUILD | Playable builds       |

---

# SECTION CORE

# Core Gameplay Systems

---

## CORE-001

# Project Initialization

### Goal

Create clean project foundation.

### Completion Conditions

* Repository created
* Folder structure complete
* Engine initializes correctly
* Development environment stable

### Tasks

[x] CORE-001-A Create Git repository

[x] CORE-001-B Create folder structure

Example:

```text
/src
/assets
/shaders
/materials
/models
/textures
/audio
/ui
/maps
/docs
```

[x] CORE-001-C Initialize Three.js project

[x] CORE-001-D Setup local development server

[x] CORE-001-E Verify hot reload workflow

[ ] CORE-001-F Create development notes document

---

## CORE-002

# Camera System

### Goal

Create RTS camera controls.

### Completion Conditions

* Smooth movement
* Stable zoom
* Rotation working
* No clipping issues

### Tasks

[x] CORE-002-A Create isometric camera

[x] CORE-002-B Add pan movement

[x] CORE-002-C Add zoom controls

[x] CORE-002-B.1 Middle-drag world-anchored pan — terrain point under cursor stays fixed during drag

[x] CORE-002-C.1 Scroll-wheel zoom — scales base offset vector, clamped min/max

[x] CORE-002-C.2 Ctrl+Scroll yaw rotation — orbits around selected unit or scene center; recalibrates all perceived-direction controls immediately

[ ] CORE-002-D Add edge scrolling

[ ] CORE-002-E Add smooth interpolation

[ ] CORE-002-F Clamp camera bounds

[ ] CORE-002-G Test readability at gameplay zoom

[x] CORE-002-H Validate perceived-direction recalibration — WASD/Arrows always follow current screen-forward direction, recomputed each frame from camera orientation

IMPORTANT:
Gameplay readability matters more than cinematic angles.

---

## CORE-003

# Terrain Prototype

### Goal

Create readable battlefield terrain.

### Completion Conditions

* Playable battlefield exists
* Terrain visually readable
* Unit navigation functional

### Tasks

[x] CORE-003-A Create flat battlefield plane

[x] CORE-003-B Add simple terrain material

[ ] CORE-003-C Add modular rock formations

[ ] CORE-003-D Add shallow crater decals

[ ] CORE-003-E Add neutral wasteland texture

[ ] CORE-003-F Add terrain chunk system

[ ] CORE-003-G Test unit readability on terrain

IMPORTANT:
Terrain must remain mostly flat.

Avoid:

* giant cliffs
* excessive elevation
* over-detailed terrain

---

## CORE-004

# Unit Movement

### Goal

Units move reliably and clearly.

### Completion Conditions

* Units selectable
* Units move correctly
* Movement readable

### Tasks

[x] CORE-004-A Create placeholder unit

[x] CORE-004-B Add click selection

[x] CORE-004-B.1 Drag-box selection — left-mouse drag projects a screen rect onto the terrain plane; unit's screen-space position is hit-tested against the rect; box fades out on release

[x] CORE-004-C Add move commands

[x] CORE-004-D Add pathfinding

[x] CORE-004-E Add movement smoothing

[x] CORE-004-F Add destination indicators

[x] CORE-004-F.1 Selection ring (blue circle) — cyan `LineLoop` (48 segments, r=1.4 world units) attached to the unit, sits flat on the ground plane (y=−0.94). Visible only when unit is selected. Pulses continuously with a smooth sine-based opacity oscillation between `SELECTION_PULSE_MIN_OPACITY` (0.1) and `SELECTION_PULSE_MAX_OPACITY` (1.0) over `DESTINATION_PULSE_DURATION_MS` (1 s). Uses `sin((t / period) * 2π − π/2)` so the fade eases symmetrically in both directions with no abrupt stops.

[x] CORE-004-F.2 Destination indicator (yellow circles) — two orange/gold `LineLoop` rings that appear at the right-clicked terrain point. They pulse outward/inward from each other over 1 s using an `easeIn` (t²) curve, then loop. Radius and opacity are perspective-corrected relative to the unit's blue ring size so they always read clearly regardless of camera distance.

[x] CORE-004-F.3 Destination perspective parity — a point clicked closer to the player-facing side of the camera must render a larger yellow ring, and a point clicked further away must render a smaller yellow ring. This must reuse the same blue-ring sizing pipeline rather than hardcoded pixel offsets.

[x] CORE-004-G Add unit collision avoidance — per-unit separation steering prevents overlap while units travel to move targets

[x] CORE-004-D Add pathfinding — A* grid (1-unit cells, 200×200 terrain) with AABB obstacle registration. Units follow waypoint list, fall back to direct movement when no path exists. Separation steering prevents clumping mid-path.

[x] CORE-004-H Test multiple unit movement
Movement feel is CRITICAL.

---

## CORE-005

# Basic Combat

### Goal

Functional readable combat.

### Completion Conditions

* Units attack correctly
* Damage works
* Combat readable

### Tasks

[x] CORE-005-A Add health system — hp/maxHp on every UnitActor and EnemyActor via CombatStats in combat.ts

[x] CORE-005-B Add attack range — attackRange field on CombatStats; units auto-fire when enemy enters range

[x] CORE-005-C Add projectile system — travelling sphere mesh (projectileSystem.ts); spawnProjectile / updateProjectiles

[x] CORE-005-D Add hit detection — onHit callback fires when projectile reaches target world position; applyDamage called

[x] CORE-005-E Add death handling — dead units/enemies removed from scene and arrays each tick in updateUnitMovement

[x] CORE-005-F Add combat feedback FX — orange emissive hit-flash on damaged units (120 ms); cyan projectiles for player, red for enemy

[x] CORE-005-G Add simple enemy AI — enemyAI.ts: enemy faction (red) seeks nearest living player, attacks when in range, staggered cooldowns

[-] CORE-005-H Test battle readability — pending in-browser validation

---

# SECTION MAP

# Battlefield & Environment

---

## MAP-001

# Neutral Wasteland Biome

### Goal

Create primary battlefield style.

### Completion Conditions

* Cohesive environment
* Good readability
* Atmospheric consistency

### Tasks

[ ] MAP-001-A Create basalt terrain material

[ ] MAP-001-B Create ash overlay texture

[ ] MAP-001-C Add dead industrial debris

[ ] MAP-001-D Add crater props

[ ] MAP-001-E Add destroyed infrastructure

[ ] MAP-001-F Add subtle fog

[ ] MAP-001-G Validate readability

IMPORTANT:
70% of terrain should remain visually calm.

---

## MAP-002

# Toxic Landmark Zones

### Goal

Create rare high-intensity areas.

### Completion Conditions

* Landmark areas distinct
* Glow usage restrained
* Terrain remains readable

### Tasks

[ ] MAP-002-A Create glowing sludge shader

[ ] MAP-002-B Add toxic fissures

[ ] MAP-002-C Add geothermal vents

[ ] MAP-002-D Add animated emissive effects

[ ] MAP-002-E Add environmental particles

[ ] MAP-002-F Limit glow density

IMPORTANT:
Glow should be RARE.

If everything glows:
nothing glows.

---

## MAP-003

# Terrain Corruption System

### Goal

Visual territory transformation.

### Completion Conditions

* Terrain changes visually
* Corruption spread readable
* Faction identity clear

### Tasks

[ ] MAP-003-A Create neutral terrain state

[ ] MAP-003-B Create light corruption state

[ ] MAP-003-C Create heavy corruption state

[ ] MAP-003-D Add terrain blending

[ ] MAP-003-E Add faction overlays

[ ] MAP-003-F Test performance impact

---

# SECTION ART

# Visual Identity

---

## ART-001

# EYA Visual Identity

### Goal

Define EYA faction language.

### Completion Conditions

* Consistent architecture
* Readable silhouettes
* Unified palette

### Tasks

[ ] ART-001-A Define faction palette

[ ] ART-001-B Define emissive rules

[ ] ART-001-C Define material rules

[ ] ART-001-D Create architecture guide

[ ] ART-001-E Create unit silhouette guide

[ ] ART-001-F Create modular building kit

### EYA Rules

```text
Primary Colors:
- white
- gray
- cyan

Visual Language:
- angular
- disciplined
- engineered
- clean
```

---

## ART-002

# Ugroo Visual Identity

### Goal

Define Ugroo faction language.

### Completion Conditions

* Corruption visually distinct
* Organic forms consistent
* Strong contrast vs EYA

### Tasks

[ ] ART-002-A Define faction palette

[ ] ART-002-B Define corruption rules

[ ] ART-002-C Define glow rules

[ ] ART-002-D Create organic architecture guide

[ ] ART-002-E Create modular growth system

[ ] ART-002-F Create corruption decals

### Ugroo Rules

```text
Primary Colors:
- dark purple
- toxic green
- black basalt

Visual Language:
- organic
- asymmetrical
- fungal
- evolving
```

---

# SECTION LOG

# Automation & Logistics

---

## LOG-001

# Basic Resource Gathering

### Goal

Prototype automated logistics.

### Completion Conditions

* Workers harvest automatically
* Resources transport correctly
* Loop functions reliably

### Tasks

[ ] LOG-001-A Create mineral nodes

[ ] LOG-001-B Create worker AI

[ ] LOG-001-C Add harvesting logic

[ ] LOG-001-D Add transport logic

[ ] LOG-001-E Add resource storage

[ ] LOG-001-F Add UI resource display

IMPORTANT:
This is one of the CORE unique systems.

---

# SECTION UI

# User Interface

---

## UI-001

# RTS Interface Foundation

### Goal

Basic playable interface.

### Completion Conditions

* UI readable
* Selection feedback works
* Resource display functional

### Tasks

[ ] UI-001-A Add selection indicators

[ ] UI-001-B Add minimap placeholder

[ ] UI-001-C Add resource counters

[ ] UI-001-D Add command panel

[ ] UI-001-E Add build menu

[ ] UI-001-F Add health bars

---

# SECTION FX

# Atmosphere & Effects

---

## FX-001

# Environmental Atmosphere

### Goal

Create immersive battlefield atmosphere.

### Completion Conditions

* Atmosphere consistent
* Visibility preserved
* Performance acceptable

### Tasks

[ ] FX-001-A Add ambient fog

[ ] FX-001-B Add dust particles

[ ] FX-001-C Add toxic gas effects

[ ] FX-001-D Add emissive shaders

[ ] FX-001-E Add environmental animation

[ ] FX-001-F Test readability impact

IMPORTANT:
Atmosphere must NEVER reduce gameplay clarity.

---

# SECTION OPT

# Optimization

---

## OPT-001

# Performance Foundation

### Goal

Maintain stable RTS performance.

### Completion Conditions

* Stable FPS
* Memory stable
* Unit scaling functional

### Tasks

[ ] OPT-001-A Add GPU instancing

[ ] OPT-001-B Add texture atlas system

[ ] OPT-001-C Add frustum culling

[ ] OPT-001-D Optimize terrain rendering

[ ] OPT-001-E Optimize particles

[ ] OPT-001-F Stress test large battles

---

# SECTION BUILD

# Prototype Build Milestones

---

## BUILD-001

# First Playable

### Goal

First functional prototype.

### Completion Conditions

* Playable battlefield
* Unit movement
* Basic combat
* Basic harvesting

### Required Systems

```text
[x] CORE-001
[x] CORE-002
[x] CORE-003
[x] CORE-004
[x] CORE-005
[x] LOG-001
[x] UI-001
```

---

## BUILD-002

# Atmosphere Prototype

### Goal

World identity established.

### Required Systems

```text
[x] MAP-001
[x] MAP-002
[x] ART-001
[x] ART-002
[x] FX-001
```

---

## BUILD-003

# Vertical Slice

### Goal

Small but polished experience.

### Required Features

* One complete map
* EYA faction
* Ugroo enemy presence
* Logistics gameplay
* Terrain corruption
* Stable combat
* Atmospheric battlefield

---

# FINAL DEVELOPMENT RULE

## NEVER EXPAND SCOPE

UNTIL:

* current systems work
* gameplay is fun
* prototype is stable
* readability is good

---

# SUCCESS METRIC

The prototype succeeds if:

* movement feels satisfying
* combat is readable
* logistics are interesting
* factions feel unique
* atmosphere feels memorable

NOT because:

* map is huge
* graphics are photorealistic
* there are hundreds of units

---
