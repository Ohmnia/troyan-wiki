# Troyan (3226 AD)

# Technical Baseline Architecture

# Three.js RTS Foundation Guide

---

# CORE DEVELOPMENT PRINCIPLE

The renderer exists to support:

* gameplay readability
* scalability
* optimization
* modularity
* iteration speed

NOT cinematic rendering.

---

# INITIAL TECH STACK

## Recommended Stack

| System      | Recommendation                |
| ----------- | ----------------------------- |
| Rendering   | Three.js                      |
| Language    | TypeScript                    |
| Build Tool  | Vite                          |
| Physics     | NONE initially                |
| Pathfinding | Custom Grid A*                |
| UI          | HTML/CSS Overlay              |
| State       | Simple ECS-style architecture |
| Models      | GLTF                          |
| Textures    | KTX2 later                    |
| Audio       | Howler.js                     |
| Terrain     | Chunked Mesh System           |

---

# INITIAL PROJECT STRUCTURE

```text id="z1kx0o"
/src
    /core
    /rendering
    /terrain
    /units
    /buildings
    /ui
    /audio
    /effects
    /materials
    /shaders
    /systems
    /utils

/assets
    /models
    /textures
    /audio
    /ui

/docs

/public
```

---

# INITIAL SETUP

## Install Dependencies

```bash
npm create vite@latest troyan-rts -- --template vanilla-ts

cd troyan-rts

npm install three

npm install --save-dev @types/three
```

---

# BASIC THREE.JS FOUNDATION

## main.ts

```ts
import * as THREE from 'three'

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x101418)

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
)

camera.position.set(45, 55, 45)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.shadowMap.enabled = false

renderer.outputColorSpace = THREE.SRGBColorSpace

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()
```

---

# IMPORTANT RENDERING RULES

## DO NOT ENABLE SHADOWS YET

Shadows are expensive.

Early RTS prototype priorities:

* readability
* unit movement
* performance

Fake shadows later using:

* blob shadows
* decals
* baked AO

---

# RECOMMENDED RTS LIGHTING

## IMPORTANT

DO NOT use:

* dramatic directional lighting
* cinematic contrast
* strong shadows
* HDR overload

Use:

* soft neutral lighting
* readability-first lighting
* ambient-heavy setup

---

# BASELINE LIGHTING SETUP

```ts
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.4
)

scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    0.35
)

directionalLight.position.set(20, 40, 20)

scene.add(directionalLight)
```

---

# WHY THIS WORKS

This setup:

* avoids harsh contrast
* keeps units readable
* prevents black terrain zones
* avoids “AI concept art lighting”
* improves gameplay clarity

---

# ISOMETRIC CAMERA BASELINE

## Recommended Starting Values

```ts
camera.position.set(45, 55, 45)

camera.lookAt(0, 0, 0)
```

---

# CAMERA CONTROLS

## Implemented

| Control | Input | Notes |
|---|---|---|
| Pan | WASD / Arrow keys | Perceived screen-forward direction, recalibrates after yaw |
| Pan (drag) | Middle-mouse drag | World-anchored — terrain point under cursor stays fixed |
| Zoom | Scroll wheel | Scales the base offset vector |
| Yaw rotation | Ctrl + Scroll | Orbits around selected unit or center pivot |

## Rules

* Yaw rotation is allowed but must recalibrate all player-perceived controls immediately
* `W` / `ArrowUp` always moves in the **current** perceived screen-forward direction
* Avoid adding pitch or roll — RTS readability depends on a stable horizon
* Free rotation without a pivot is not allowed

---

# PLAYER-PERCEIVED RECALIBRATION RULE

When camera orientation changes (for example: controlled rotation), all player-facing controls and perspective-sensitive feedback must recalibrate immediately to player perception.

Required behavior:

* `W` / `ArrowUp` always moves in perceived screen-forward direction
* `S` / `ArrowDown` always moves in perceived screen-back direction
* `A` / `ArrowLeft` and `D` / `ArrowRight` always map to perceived left/right
* destination and selection feedback that depends on perspective must reset/recompute using current camera state each interaction

Vanishing-point / perspective expectation:

* near-to-player side reads larger
* farther side reads progressively smaller
* left/right clicks at similar forward depth should not create artificial size bias

This is a gameplay readability requirement, not optional polish.

---

# RTS CAMERA CONTROLLER

## src/core/cameraController.ts

Full class — do not reduce to a stub.

### Key responsibilities

* Maintains a `center` pivot point and a `baseOffset` vector
* Zoom scales the offset vector (`zoomScale` clamped between `minZoomScale` and `maxZoomScale`)
* Yaw rotates the offset around the Y axis (`yawAngle`, driven by Ctrl+Scroll)
* Middle-drag pan is world-anchored: the terrain point under the cursor when drag starts remains fixed under the cursor until drag ends
* WASD / Arrow key pan always moves along the **current perceived screen forward / right** axes — these are derived from the camera's actual direction each frame, not a fixed world axis
* Orbit pivot is provided externally via `setOrbitPivotProvider()` — defaults to selected unit, falls back to scene center

### Constants

| Name | Value | Purpose |
|---|---|---|
| `speed` | 0.4 | WASD pan speed per frame |
| `minZoomScale` | 0.55 | Maximum zoom-in |
| `maxZoomScale` | 1.6 | Maximum zoom-out |
| `zoomStep` | 0.08 | Per-scroll-tick zoom increment |
| `wheelRotateSpeed` | 0.002 | Radians per scroll-delta unit |

---

# TERRAIN BASELINE

## IMPORTANT

DO NOT start with:

* procedural terrain
* heightmaps
* voxel terrain
* marching cubes

START SIMPLE.

---

# INITIAL TERRAIN

```ts
const terrainGeometry = new THREE.PlaneGeometry(
    200,
    200,
    1,
    1
)

const terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2f32,
    roughness: 1.0,
    metalness: 0.0
})

const terrain = new THREE.Mesh(
    terrainGeometry,
    terrainMaterial
)

terrain.rotation.x = -Math.PI / 2

scene.add(terrain)
```

---

# TERRAIN COLOR RULES

## Neutral Terrain

Use:

* dark gray
* basalt
* muted blue-gray
* volcanic ash

Avoid:

* saturated terrain
* bright colors
* noisy textures

Reason:
Units must visually separate from terrain.

---

# GLOW SYSTEM RULES

## VERY IMPORTANT

Glow should ONLY appear:

* near corruption
* near toxic fissures
* near reactors
* near special landmarks

NOT everywhere.

---

# SIMPLE EMISSIVE MATERIAL

```ts
const sludgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x224422,
    emissive: 0x33ff66,
    emissiveIntensity: 1.5,
    roughness: 0.9
})
```

---

# PERFORMANCE RULES

## ABSOLUTE RULES

DO NOT:

* use 4K textures
* use high poly terrain
* use dynamic shadows
* use transparency everywhere
* use expensive postprocessing

---

# TARGET POLYCOUNTS

| Asset     | Target         |
| --------- | -------------- |
| Infantry  | 300-1200 tris  |
| Vehicles  | 1500-4000 tris |
| Buildings | 2000-8000 tris |

---

# TEXTURE RULES

## EARLY PROTOTYPE

Use:

* 512 textures
* atlases
* shared materials

Avoid:

* unique materials per object

---

# MATERIAL STRATEGY

## GOOD

```text id="c9lww8"
1 terrain material
1 building material
1 vehicle material
1 corruption material
```

## BAD

```text id="ym03v0"
unique material for every asset
```

---

# UNIT BASELINE

## Simple Unit Placeholder

```ts
const unitGeometry = new THREE.BoxGeometry(1, 2, 1)

const unitMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff
})

const unit = new THREE.Mesh(
    unitGeometry,
    unitMaterial
)

unit.position.y = 1

scene.add(unit)
```

---

# RTS SELECTION SYSTEM

## IMPORTANT

DO NOT start with:

* advanced UI
* animated portraits
* complex command systems

Start with:

* click selection
* drag-box selection
* movement
* feedback indicators

---

# SELECTION INDICATOR — IMPLEMENTED

## Selection Ring (CORE-004-B)

A cyan `LineLoop` attached to the unit, sitting flat on the ground plane.

```text
Geometry : BufferGeometry, 48 vertices, closed loop
Radius   : 1.4 world units
Y offset : -0.94 (ground level relative to unit centre)
Material : LineBasicMaterial, color 0x00ffff, transparent
Visibility: only when unit is selected
```

### Pulse animation

Sine-wave opacity oscillation — equal ease in both fade directions, no abrupt stops:

```ts
const SELECTION_PULSE_MAX_OPACITY = 1
const SELECTION_PULSE_MIN_OPACITY = 0.1
const DESTINATION_PULSE_DURATION_MS = 1000 // shared period constant

// In animate loop:
const sineValue = (Math.sin((elapsed / DESTINATION_PULSE_DURATION_MS) * Math.PI * 2 - Math.PI / 2) + 1) / 2
selectionRingMaterial.opacity = SELECTION_PULSE_MIN_OPACITY
    + sineValue * (SELECTION_PULSE_MAX_OPACITY - SELECTION_PULSE_MIN_OPACITY)
```

---

# DESTINATION INDICATOR — IMPLEMENTED

## Move-order rings (CORE-004-F)

Two orange/gold `LineLoop` rings that appear at the right-clicked terrain point and animate outward/inward.

```text
Geometry   : BufferGeometry, 48 vertices, updated per frame
Materials  : LineBasicMaterial — outer 0xffaa00, inner 0xffdd66
Animation  : easeIn (t²) curve, large ring shrinks while small ring grows, loops every 1 s
Opacity    : fades from DESTINATION_PULSE_LARGE_OPACITY (0.8) to DESTINATION_PULSE_SMALL_OPACITY (0.05)
Radii      : perspective-corrected relative to the unit's blue ring screen size
Plane      : follows terrain quaternion (ground-aligned)
Lifetime   : hidden when unit reaches its destination
```

### Perspective correction rule

The yellow ring size is derived from the same blue-ring world-to-screen scaling pipeline, then adjusted by the current camera-facing depth of the clicked ground point.

Required behavior:

* points closer to the player-facing side of the screen must produce a larger yellow circle
* points further away from the player-facing side must produce a smaller yellow circle
* the calculation must stay tied to the blue ring's size and thickness logic, not hardcoded pixel offsets
* camera yaw must recalculate the perceived perspective immediately before the destination rings are shown

---

# DRAG SELECTION BOX — IMPLEMENTED

## Screen-rect drag selection (CORE-004-B extension)

```text
Trigger    : left-mouse drag exceeding DRAG_THRESHOLD_PX (6 px)
Geometry   : LineLoop (4 corners) + filled Mesh quad, both terrain-projected
Material   : white, semi-transparent (outline 0.5, fill 0.05)
Y plane    : SELECTION_BOX_Y = 0.08 above terrain
Fade       : opacity fades to 0 over SELECTION_BOX_FADE_MS (100 ms) on mouse release
Hit test   : unit's projected screen position tested against screen-space rect min/max
```

---

# RESOURCE NODE BASELINE

## Mineral Node

```ts
const mineralGeometry = new THREE.DodecahedronGeometry(2)

const mineralMaterial = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    emissive: 0x2244aa,
    emissiveIntensity: 0.5
})
```

---

# ATMOSPHERE SYSTEM

## IMPORTANT

Atmosphere should:

* support mood
* preserve readability

NOT:

* overwhelm gameplay

---

# FOG SETTINGS

```ts
scene.fog = new THREE.Fog(
    0x101418,
    60,
    180
)
```

---

# WHY THIS FOG WORKS

It:

* softens distant geometry
* increases atmosphere
* improves scale perception
* hides low-detail distance areas

WITHOUT:

* destroying visibility

---

# RTS VISUAL HIERARCHY

## PRIORITY ORDER

```text id="gw6dgo"
1. Units
2. Combat
3. Selection indicators
4. Buildings
5. Resources
6. Terrain
7. Atmosphere
```

Terrain should NEVER dominate the scene.

---

# PATHFINDING RECOMMENDATION

## EARLY PROTOTYPE

Use:

* simple grid A*
* flat navigation

DO NOT:

* use navmesh systems initially

---

# SIMPLE GRID SIZE

```text id="eh94ck"
1 tile = 1 meter
128x128 grid
```

This is more than enough initially.

---

# BUILDING SYSTEM BASELINE

## IMPORTANT

Buildings should use:

* modular kits
* reusable geometry
* simple silhouettes

DO NOT build:

* giant hero assets

---

# RTS BUILDING DESIGN RULE

Buildings must read clearly from:

* far camera distance

NOT:

* close inspection

---

# SHADER STRATEGY

## EARLY PROTOTYPE

DO NOT build:

* advanced custom shaders

Start with:

* MeshStandardMaterial

Then later:

* terrain blending
* emissive pulsing
* corruption shaders
* holograms

---

# INITIAL DEVELOPMENT PRIORITIES

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

Performance stability.

---

## PRIORITY 5

Faction identity.

---

# VERY IMPORTANT SOLO DEV RULE

## DO NOT OVER-ENGINEER EARLY

Bad:

* ECS rewrite
* custom renderer
* advanced networking
* procedural megasystems

Good:

* playable prototype
* fast iteration
* stable systems
* clear gameplay

---

# FIRST PLAYABLE GOAL

The prototype succeeds if:

* units move
* combat works
* terrain readable
* atmosphere interesting
* FPS stable

NOT because:

* graphics are AAA
* maps are massive
* systems are infinite

---

# RECOMMENDED NEXT TECHNICAL STEP

Build THIS ORDER:

```text id="hhj38n"
1. Scene setup
2. Camera
3. Terrain plane
4. Unit placeholder
5. Unit selection
6. Movement
7. Resource node
8. Basic harvesting
9. Building placement
10. Basic combat
```

Do NOT skip ahead.

---

# FINAL TECHNICAL ADVICE

Your biggest future risk is NOT:

* rendering

It is:

* uncontrolled complexity

The safest path is:

* small stable systems
* incremental scaling
* continuous optimization
* readability-first design
* modular architecture

That is how solo RTS projects survive.
