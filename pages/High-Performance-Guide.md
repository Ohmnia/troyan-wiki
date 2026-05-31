# THREE.js + GLB Expert Guide for High-Performance RTS Games

## Overview

This guide focuses on professional-grade usage of `.glb` assets in THREE.js for large-scale RTS games where hundreds or thousands of units may be visible simultaneously.

---

# Why GLB Is the Preferred Format

Use `.glb` instead of `.gltf` whenever possible.

### Advantages

- Single binary file
- Faster network transfer
- Fewer HTTP requests
- Embedded textures
- Better CDN caching
- Easier asset management
- Supports:
  - Animations
  - Skeletons
  - Materials
  - Cameras
  - Lights

For RTS games, asset loading speed directly impacts player experience.

### Recommended

```text
Tank.glb
Soldier.glb
Building.glb
Tree.glb
Explosion.glb
```

### Avoid

```text
Tank.gltf
Tank.bin
Tank_diffuse.png
Tank_normal.png
Tank_metallic.png
```

---

# Asset Pipeline

The biggest performance gains happen **before assets reach THREE.js**.

```text
Blender
 ↓
Apply transforms
 ↓
Merge meshes
 ↓
Atlas textures
 ↓
Draco Compression
 ↓
Meshopt Compression
 ↓
GLB Export
 ↓
CDN
 ↓
THREE.js
```

---

# Blender Export Settings

## Apply Transforms

Before exporting:

```text
Ctrl + A

Apply:
- Scale
- Rotation
- Location
```

Never export unapplied transforms.

---

## Remove Hidden Geometry

### Bad

```text
Tank
 ├ Turret Interior
 ├ Driver Seat
 ├ Hidden Bolts
 └ Hidden Pipes
```

### Good

```text
Tank
 ├ Hull
 ├ Turret
 └ Cannon
```

RTS cameras never see hidden details.

---

## Reduce Material Count

### Worst

```text
20 materials
```

### Better

```text
1 material
```

### Best

```text
1 texture atlas
1 material
```

Every material increases draw calls.

---

# Compression

Always use:

- Draco
- Meshopt

Together.

---

## Draco Setup

```javascript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
```

### Benefits

- Smaller downloads
- Faster network transfer
- Reduced bandwidth usage

---

## Meshopt Setup

```javascript
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

loader.setMeshoptDecoder(MeshoptDecoder);
```

### Benefits

- Faster loading
- Reduced memory usage
- Improved vertex throughput

---

# Gold Standard Loader Setup

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const draco = new DRACOLoader();
draco.setDecoderPath('/draco/');

const loader = new GLTFLoader();

loader.setDRACOLoader(draco);
loader.setMeshoptDecoder(MeshoptDecoder);
```

---

# Asset Cache System

Never load the same GLB twice.

### Bad

```javascript
loader.load('/tank.glb');
loader.load('/tank.glb');
loader.load('/tank.glb');
```

### Good

```javascript
const assetCache = new Map();

async function loadGLB(url) {
    if (assetCache.has(url)) {
        return assetCache.get(url);
    }

    const gltf = await loader.loadAsync(url);

    assetCache.set(url, gltf);

    return gltf;
}
```

---

# Clone Correctly

Never duplicate loaded assets directly.

### Bad

```javascript
scene.add(gltf.scene);
scene.add(gltf.scene);
```

Only one object exists.

---

### Correct Approach

```javascript
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';

const unit = SkeletonUtils.clone(gltf.scene);
```

---

# InstancedMesh: The RTS Superpower

Most RTS games fail because they create thousands of mesh objects.

### Bad

```javascript
for (let i = 0; i < 1000; i++) {
    scene.add(
        new THREE.Mesh(
            geometry,
            material
        )
    );
}
```

Result:

```text
1000 draw calls
```

---

### Good

```javascript
const mesh = new THREE.InstancedMesh(
    geometry,
    material,
    1000
);

scene.add(mesh);
```

Result:

```text
1 draw call
```

---

## Updating Instance Transforms

```javascript
const matrix = new THREE.Matrix4();

for (let i = 0; i < count; i++) {
    matrix.compose(
        position,
        quaternion,
        scale
    );

    mesh.setMatrixAt(i, matrix);
}

mesh.instanceMatrix.needsUpdate = true;
```

This is how modern RTS games render armies.

---

# GPU-Friendly RTS Unit Design

### Ideal

```text
300–1000 triangles
```

### Maximum

```text
2000 triangles
```

### Avoid

```text
15000+ triangles
```

---

### Example

```text
500 units
×
1000 triangles

=
500,000 triangles
```

Well within modern GPU limits.

---

# Level of Detail (LOD)

Always use LOD.

### Example

```text
LOD0 = 1000 tris
LOD1 = 500 tris
LOD2 = 150 tris
LOD3 = billboard
```

### THREE.js Implementation

```javascript
const lod = new THREE.LOD();

lod.addLevel(highMesh, 0);
lod.addLevel(midMesh, 50);
lod.addLevel(lowMesh, 100);
lod.addLevel(sprite, 250);
```

Most RTS cameras spend their time viewing distant units.

---

# Frustum Culling

THREE.js supports automatic frustum culling.

### Recommended

```javascript
mesh.frustumCulled = true;
```

### Avoid

```javascript
mesh.frustumCulled = false;
```

Unless absolutely necessary.

---

# Texture Best Practices

Use KTX2 instead of PNG/JPG.

### Benefits

- GPU compressed
- Faster uploads
- Reduced VRAM usage
- Smaller downloads

---

## Setup

```javascript
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();

ktx2Loader.setTranscoderPath('/basis/');
ktx2Loader.detectSupport(renderer);

loader.setKTX2Loader(ktx2Loader);
```

---

# Recommended Texture Sizes

| Asset Type | Resolution |
|------------|------------|
| Units | 512×512 |
| Buildings | 1024×1024 |
| Hero Units | 2048×2048 |

Avoid:

```text
8192×8192
```

For RTS assets.

---

# Animation Optimization

### Bad

```text
1000 animation mixers
```

---

### Better

```javascript
if (unit.visible) {
    mixer.update(delta);
}
```

---

### Even Better

```javascript
if (distance < 50) {
    mixer.update(delta);
}
```

Only animate visible nearby units.

---

# Shadow Optimization

One of the biggest FPS killers in RTS games.

### Avoid

```text
All units cast shadows
```

### Better

```text
Heroes cast shadows
Buildings cast shadows
Regular units do not
```

```javascript
unit.castShadow = false;
```

---

### Recommended Shadow Setup

```javascript
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;
```

---

# Object Pooling

Never create units during gameplay.

### Bad

```javascript
new Tank();
new Tank();
new Tank();
```

---

### Good

```javascript
const tankPool = [];

for (let i = 0; i < 500; i++) {
    tankPool.push(createTank());
}
```

Reuse instances:

```javascript
const tank = tankPool.pop();
```

---

# Worker-Based Pathfinding

Never pathfind on the main thread.

Use:

```text
Web Workers
```

For:

- A*
- Flow Fields
- Crowd Simulation
- Influence Maps

---

### Example

```javascript
const worker =
    new Worker('pathfinding.js');
```

RTS games become CPU-bound long before they become GPU-bound.

---

# Massive Army Architecture

### Professional RTS Architecture

```text
Entity System
 ↓
Transform Array
 ↓
GPU Instancing
 ↓
Single Draw Call
```

---

### Avoid

```text
Tank Object
Tank Object
Tank Object
Tank Object
```

---

### Use Data-Oriented Design

```javascript
const positions = new Float32Array(...);
const health = new Uint16Array(...);
const team = new Uint8Array(...);
```

Instead of:

```javascript
class Tank {
    position;
    health;
    team;
}
```

Thousands of times faster at scale.

---

# Asset Streaming

For huge maps:

```text
Chunk_0_0.glb
Chunk_0_1.glb
Chunk_0_2.glb
```

Load only nearby chunks.

```javascript
if (chunkVisible) {
    loadChunk();
}
```

Unload distant chunks.

---

# Production-Grade Renderer Settings

```javascript
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance'
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;
```

---

# Ultra-Fast Asset Manager

```javascript
class AssetManager {
    constructor() {
        this.cache = new Map();
    }

    async load(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        const gltf =
            await loader.loadAsync(url);

        this.cache.set(url, gltf);

        return gltf;
    }

    clone(url) {
        return SkeletonUtils.clone(
            this.cache.get(url).scene
        );
    }
}
```

---

# Performance Targets

| Metric | Target |
|----------|----------|
| Draw Calls | < 200 |
| Units | 500–5000 |
| FPS | 60+ |
| Frame Time | < 16ms |
| Unit Model | 300–1000 tris |
| Texture Size | 512–1024 |
| Materials | 1 |
| Instancing | Always |
| Compression | Draco + Meshopt |
| Texture Format | KTX2 |

---

# Elite RTS Checklist

Before shipping:

- [ ] Single material
- [ ] Single texture atlas
- [ ] Draco compressed
- [ ] Meshopt compressed
- [ ] KTX2 textures
- [ ] Instancing compatible
- [ ] LOD versions created
- [ ] Frustum culling enabled
- [ ] Object pooling implemented
- [ ] Asset caching implemented
- [ ] Web Worker pathfinding
- [ ] Less than 1000 triangles
- [ ] Less than 1 MB compressed

---

# Architecture Used by the Fastest Browser RTS Games

```text
Blender
 ↓
GLB Export
 ↓
Draco + Meshopt
 ↓
KTX2 Textures
 ↓
Asset Cache
 ↓
InstancedMesh
 ↓
LOD
 ↓
Frustum Culling
 ↓
Object Pooling
 ↓
Web Workers
 ↓
Data-Oriented ECS
 ↓
60–144 FPS
```

---

# The Single Most Important Rule

> Do not think of a GLB as a game object.
>
> Think of it as a reusable asset template.
>
> Load it once.
>
> Cache it once.
>
> Render thousands of instances through GPU instancing whenever possible.

That is the difference between a browser RTS that struggles at 100 units and one that comfortably handles thousands of units at high frame rates.