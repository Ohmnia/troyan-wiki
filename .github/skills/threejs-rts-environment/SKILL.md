---
name: threejs-rts-environment
description: Use this skill when designing, writing, or optimizing Three.js terrain systems, custom GLSL/WGSL shaders, runtime texture splatting, slope blending, vertex wind animations, height fog, chunk streaming, and level-of-detail (LOD) environments.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: environment-rendering
  conventions: stylized-realism
  tags:
    - threejs
    - shaders
    - glsl
    - webgpu
    - terrain
    - streaming
---

# Three.js RTS Environment & Shader Architecture Skill

## Core Philosophy
Never design a browser-based RTS world around FPS-style cinematic poly-counts or unique heavy textures. Visual quality is achieved through stylized realism, strong silhouettes, macro noise breakout, and atmospheric depth [1]. Massively optimize the pipeline through procedural shaders and aggressive GPU batching—draw calls, not polygon counts, kill browser game performance.

---

# Production Environment Budget Targets

All generated world assets and environment pipelines must adhere strictly to these engineering limits:


| Performance Vector | Maximum Budget Target | Core Architectural Reason |
| :--- | :--- | :--- |
| **Draw Calls** | `< 500` per active frame. | Eliminates main-thread JavaScript CPU stalls. |
| **Unique Materials** | `< 50` across the entire scene map. | Maximizes batch aggregation via texture atlases. |
| **VRAM Allocations** | `< 512 MB` total texture memory footprint. | Prevents browser context loss and system page crashes. |
| **Texture Formats** | `KTX2 / Basis Universal` exclusively. | Bypasses uncompressed runtime PNG/JPG VRAM bloat. |

---

# AI Code Generation & Shader Rules

### 1. Procedural Runtime Slope Blending (GLSL)
When creating or extending custom terrain shader materials, do not use flat unique albedo maps. Implement procedural slope-gated blending inside the fragment shader to separate cliffs from walkable paths automatically:
```glsl
// Enforced inside custom terrain fragment shaders
vec3 grassColor = texture(grassTex, vUv * 16.0).rgb;
vec3 rockColor = texture(rockTex, vUv * 16.0).rgb;

// Derive slope from the transformed surface normal
float slope = 1.0 - vNormal.y;
vec3 finalTerrainColor = mix(grassColor, rockColor, smoothstep(0.2, 0.6, slope));
```

### 2. Vertex-Based Animation for Foliage
* **No Skeletal Bones for Grass/Trees:** Creating skeletal bone systems or individual mixers for environmental assets is banned.
* **GPU Wind Injection:** All environmental animations (grass cards, foliage meshes, tree leaves) must use stateless vertex-displacement modifications in the vertex shader:
  ```glsl
  // Vertex shader injection code block
  float windWave = sin(position.x * 0.5 + uTime) * 0.1;
  transformed.x += windWave * (1.0 - uv.y); // Scale influence so roots remain anchored
  ```

### 3. Height-Based Atmospheric Fog (GLSL)
To establish structural scale and realistic atmospheric perspective, all custom materials must apply height-attenuated density checks inside their fragment shader routines:
```glsl
// Height-based atmospheric perspective calculations
float fogFactor = smoothstep(uFogNearHeight, uFogFarHeight, vWorldPosition.y);
vec3 atmosphericColor = mix(vColor, uFogColor, fogFactor);
```

### 4. Chunk-Based Spatial World Streaming
When building large-scale map systems, do not load or evaluate the complete environment array at startup. Implement chunk-based viewport grid management:
```ts
class TerrainStreamer {
  private activeChunks: Map<string, THREE.Object3D> = new Map();
  
  public updateView(cameraPosition: THREE.Vector3): void {
    // 1. Calculate current grid block coordinates.
    // 2. Load missing adjacent grid regions via object pools.
    // 3. Unload/Deactivate distant data rings to reclaim CPU context.
  }
}
```

### 5. WebGPU & WGSL Migration Alignment
* Write current production mechanics using **WebGL2 + GLSL**.
* Structure data objects cleanly using WebGL2-compatible configurations, but design system boundaries to smoothly adapt to **WebGPU compute pipelines** and **WGSL shaders** later (e.g., maintain layout properties using flat typed arrays like `Float32Array`).

---

# Telemetry Anti-Patterns to Refuse
* Never allow multiple materials on single low-poly models; enforce texture atlases.
* Never generate parallax occlusion mapping (POM) loops on widespread environmental filler meshes; lock POM strictly to unique close-up hero nodes.
* Never use uncompressed image arrays (`.png`, `.jpg`) for runtime terrain texture splatting.
