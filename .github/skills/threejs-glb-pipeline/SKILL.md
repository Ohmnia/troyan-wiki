---
name: threejs-glb-pipeline
description: Use this skill when implementing, refactoring, or reviewing 3D asset loaders, GLB asset pipelines, DRACO/Meshopt compression decoders, KTX2 texturing pipelines, SkeletonUtils cloning engines, or asset pooling collections.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: asset-pipeline
  conventions: resource-pooling
  tags:
    - threejs
    - glb
    - compression
    - pooling
    - lod
    - framework
---

# Three.js GLB Optimization & Asset Pipeline Skill

## Core Philosophy
Never interpret a `.glb` binary bundle as a standalone game entity. Treat a loaded mesh asset purely as a reusable resource template. Load assets exactly once, cache them globally, and clone geometric footprints strictly through memory-efficient structures. 

RTS games bottleneck on main-thread CPU executions long before they hit raw GPU geometric rendering limits.

---

# Elite RTS Asset Targets Matrix

Enforce these strict engineering budget limits across all model loading hooks:


| Optimization Vector | Targeted Technical Constraint Boundary | Core Performance Reason |
| :--- | :--- | :--- |
| **Draw Calls Count** | Strictly `< 200` calls per active render frame. | Eliminates main-thread JavaScript execution overhead. |
| **Unit Mesh Complexity** | `300` to `1000` triangles max per instance. | Ensures smooth performance for thousands of on-screen units. |
| **Texture Allocations** | `512x512` (Units) \| `1024x1024` (Buildings). | Prevents browser VRAM allocation crashes. |
| **Material Limits** | Exactly `1` material structure via Texture Atlases. | Keeps draw calls flat regardless of army size. |
| **Asset Compression** | Combined Draco + Meshopt decoding arrays. | Minimizes initial network transfer payload sizes. |

---

# Asset Architecture Flow

```text
3D DCC Engine (Blender: Apply Ctrl+A Transforms & Merge Hierarchies)
    ↓
Asset Compressor Pipeline (Inject Draco + Meshopt Geometry + KTX2 Textures)
    ↓
Asynchronous AssetCache (Map registry blocking duplicate HTTP loops)
    ↓
SkeletonUtils Clone System (Decouples skeletal node maps for instancing)
    ↓
LOD Mesh Sorting Node (Swaps geometry configurations based on distance arrays)
    ↓
InstancedMesh Grid Buffer (Consolidates active units into 1 Draw Call)
```

---

# AI Code Generation Rules

### 1. Unified Asynchronous Asset Manager Schema
When building or refactoring loader utilities, never allow raw duplicate `loader.load()` calls. Always implement a unified cache manager that caches and clones skeleton hierarchies correctly without duplicating core materials:

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js';

class AssetManager {
  private cache: Map<string, any> = new Map();

  public async load(url: string): Promise<any> {
    if (this.cache.has(url)) return this.cache.get(url);
    const gltf = await loader.loadAsync(url);
    this.cache.set(url, gltf);
    return gltf;
  }

  public clone(url: string): THREE.Object3D {
    const cached = this.cache.get(url);
    if (!cached) throw new Error(`Asset not preloaded: ${url}`);
    return SkeletonUtils.clone(cached.scene);
  }
}
```

### 2. Mandatory Compression Hook Bindings
* When initializing `GLTFLoader`, you must explicitly bind a `DRACOLoader` instance pointing to standard local decoder binaries (`/draco/`), and configure the `MeshoptDecoder` directly onto the engine reference loop.
* All textures must route through a dedicated `KTX2Loader` setup with a transcoding path to save GPU texture allocation space.

### 3. Locomotion & Animation Cull Rules
* **No Un-Gated Updates:** Never update an active `AnimationMixer` object array unconditionally. Always gate animation mix tracks based on visibility parameters: `if (unit.visible && distanceToCamera < 50) { mixer.update(dt); }`.
* **Shadow Overhead Culling:** Standard army units must not cast dynamic cascaded shadow maps (`unit.castShadow = false`). Dynamic shadows are restricted to unique structure anchors, landscape meshes, and elite hero units.

### 4. Memory Preservation & Object Pooling
* **Ban Runtime Creation:** Instantiating new entity instances or asset objects during gameplay phases is completely forbidden. 
* All active meshes, projectiles, particles, and logic modules must be pre-allocated inside local array structures during initialization stages and managed via `.pop()` and `.push()` collection reuse methods.

---

# Pre-Shipping Audit Checklist
Before allowing code refactors or code additions to merge into production pipelines, enforce this automated compliance scan:
- [ ] Single composite texture atlas bound to a single uniform material structure.
- [ ] Model geometry compressed through concurrent Draco and Meshopt libraries.
- [ ] Textures transcoded directly into the `.ktx2` format.
- [ ] Level of Detail (`THREE.LOD`) meshes configured for camera distance transitions.
- [ ] Dynamic path computations and crowd flow vectors run entirely off-thread inside Web Workers.
- [ ] Layout values completely structured via flat typed array components (`Float32Array`) rather than object arrays.
