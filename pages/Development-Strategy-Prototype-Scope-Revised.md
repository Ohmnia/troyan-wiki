# Troyan (3226 AD)

# Revised Development Strategy & Prototype Scope

# Core Development Philosophy

The primary goal of the prototype is NOT to build the final game.

The goal is to prove:

* gameplay readability
* faction identity
* atmosphere
* automated logistics gameplay
* basic RTS combat
* visual cohesion
* technical feasibility

The prototype should remain intentionally small and manageable.

---

# IMPORTANT STRATEGIC CHANGE

## Removed System

The original concept attempted:

* full procedural world generation
* fully generated tiled map systems
* large-scale terrain automation

This introduced major problems:

* inconsistent terrain quality
* poor gameplay readability
* difficult visual cohesion
* excessive technical scope
* difficult AI navigation
* poor terrain control

---

# New Direction

## Semi-Handcrafted Battlefield Design

Instead of generating entire maps procedurally:

### Use:

* handcrafted battlefield layouts
* modular terrain chunks
* reusable terrain kits
* procedural resource placement
* procedural environmental decoration

This dramatically improves:

* visual quality
* gameplay readability
* production speed
* artistic control
* balancing

---

# Recommended Terrain Structure

## Terrain Philosophy

Terrain should prioritize:

* readability
* navigability
* faction atmosphere
* tactical clarity

NOT cinematic realism.

---

# Terrain Composition Rules

## 70% Neutral Wasteland

Primary battlefield terrain.

Visual features:

* volcanic basalt
* ash fields
* dead industrial ruins
* dry cracked earth
* collapsed infrastructure

Gameplay purpose:

* open combat
* readable movement
* strategic expansion

---

## 20% Controlled Territory

Faction influence zones.

### EYA Territory

* reinforced structures
* power grids
* clean extraction systems
* geometric layouts
* white/cyan lighting

### Ugroo Territory

* fungal spread
* toxic fissures
* organic growth
* corruption zones
* green/purple glow

---

## 10% High-Intensity Landmark Zones

Rare atmospheric areas.

Examples:

* glowing sludge rivers
* geothermal vents
* toxic lakes
* deep fissures
* collapsed megastructures

Purpose:

* visual landmarks
* tactical choke points
* environmental storytelling

---

# Terrain Elevation Rules

## IMPORTANT

Terrain must remain mostly flat.

Avoid:

* giant cliffs
* stacked mountain systems
* excessive elevation
* complex traversal geometry

Use instead:

* shallow craters
* trenches
* rock outcroppings
* fissures
* gentle height variation

RTS gameplay depends on readable movement.

---

# Terrain Generation Strategy

## Removed:

* fully procedural world generation

## Added:

* handcrafted map layouts
* modular terrain chunks
* procedural prop scattering
* procedural resource node placement

---

# Resource System

## Resources

### Minerals

Placed semi-randomly in logical clusters.

Visual style:

* embedded crystal veins
* mining deposits
* metallic debris zones

### Water

Rare strategic resource.

Examples:

* underground aquifers
* geothermal condensation pools
* toxic purification systems

---

# Core Gameplay Pillars

## 1. Automated Logistics

Workers automatically:

* harvest
* transport
* process
* distribute

Player focuses on:

* macro strategy
* infrastructure
* territorial control

---

## 2. Territory Transformation

The battlefield visually evolves.

### EYA Expansion

Creates:

* structured infrastructure
* power networks
* defensive fortifications

### Ugroo Expansion

Creates:

* corruption spread
* fungal growth
* toxic terrain
* underground infestations

---

## 3. Surface vs Underground Warfare

Core asymmetrical mechanic.

### EYA

* surface dominance
* air superiority
* structured defense

### Ugroo

* subterranean movement
* ambush warfare
* terrain corruption

---

# Prototype Scope

## Initial Prototype MUST Stay Small

---

# Prototype Requirements

## ONE Playable Map

Small battlefield.

---

## ONE Primary Resource

Minerals only initially.

Water can be added later.

---

## ONE Functional Faction

Start with EYA.

Ugroo can initially exist as:

* AI enemies
* simple corruption systems

---

## Minimal Unit Set

### Recommended Units

* Worker
* Soldier
* Engineer
* Scout vehicle
* Basic transport

---

## Minimal Building Set

### Recommended Buildings

* HQ
* Power Facility
* Barracks
* Refinery
* Support Facility

---

# Technical Recommendations

## Recommended Engine

### Three.js

Reason:

* strong WebGL ecosystem
* good shader support
* GPU instancing
* suitable for RTS rendering
* flexible rendering pipeline

---

# Recommended Art Style

## Semi-Stylized Realism

Avoid:

* ultra photorealism
* excessive detail
* cinematic rendering

Prioritize:

* readability
* silhouette clarity
* atmospheric lighting
* controlled detail density

---

# Recommended Free Toolchain

## Terrain & Materials

### Material Maker

https://www.materialmaker.org/

---

## 3D Content

### Blender

https://www.blender.org/

---

## Texture Editing

### GIMP

https://www.gimp.org/

### Krita

https://krita.org/

---

## Game Engine / Rendering

### Three.js

https://threejs.org/

---

# Production Priorities

## PRIORITY 1

Movement feels good.

---

## PRIORITY 2

Camera feels good.

---

## PRIORITY 3

Combat readability.

---

## PRIORITY 4

Faction readability.

---

## PRIORITY 5

Automation gameplay loop.

---

## PRIORITY 6

Visual polish.

---

# Things To Avoid Early

DO NOT build:

* multiplayer
* massive procedural worlds
* advanced diplomacy
* massive tech trees
* giant unit rosters
* cinematic cutscenes
* advanced terrain destruction

These massively increase scope.

---

# Development Roadmap

# Phase 1 — Core Prototype

Goal:
Playable RTS sandbox.

Features:

* camera
* movement
* selection
* simple combat
* basic harvesting
* building placement

---

# Phase 2 — Faction Identity

Goal:
Distinct gameplay feel.

Features:

* EYA visuals
* Ugroo corruption
* underground mechanics
* territory visuals

---

# Phase 3 — Atmosphere

Goal:
World immersion.

Features:

* shaders
* fog
* emissive systems
* environmental FX
* ambient audio

---

# Phase 4 — Strategic Systems

Goal:
Deeper gameplay.

Features:

* staffing systems
* logistics complexity
* territory spread
* advanced AI

---

# Phase 5 — Expansion

Goal:
Content scaling.

Features:

* more factions
* larger maps
* advanced tech
* campaign systems

---

# Most Important Rule

## FINISH THE CORE LOOP FIRST

The prototype succeeds if:

* moving units feels satisfying
* battles are readable
* automation is interesting
* factions feel distinct
* atmosphere feels unique

Everything else comes later.
