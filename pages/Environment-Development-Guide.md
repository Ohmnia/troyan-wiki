# Expert Guide: Three.js + TypeScript for Online RTS Environment Development

# Table of Contents

1. Philosophy of Browser RTS Rendering
2. Recommended Stack
3. Architecture for Massive RTS Worlds
4. Rendering Strategy
5. Procedural Environments vs Textures
6. Terrain Rendering Techniques
7. Texture Optimization
8. Bump Maps, Normal Maps, Parallax & PBR
9. Shader Languages Explained
10. WebGL vs WebGPU
11. Best Environment Techniques
12. Performance Optimization
13. Instancing & Draw Call Reduction
14. Streaming & LOD Systems
15. Atmospheric Effects
16. Fog of War Techniques
17. Asset Pipeline
18. TypeScript Architecture
19. Production Rendering Pipeline
20. Best Professional Three.js References
21. Example Code
22. Final Recommendations

---

# 1. Philosophy of Browser RTS Rendering

The single biggest mistake in browser RTS development is trying to build an FPS-quality world.

RTS games succeed visually through:

* Strong silhouettes
* Strategic readability
* Atmospheric depth
* Scale illusion
* Lighting mood
* Terrain richness
* Motion
* FX layering

NOT through:

* Ultra high poly meshes
* 8K textures
* Film-quality assets
* Heavy ray tracing

The best browser RTS rendering strategy is:

> "Stylized realism with procedural enhancement."

This gives:

* tiny downloads
* fast startup
* scalability
* visual uniqueness
* easier LOD generation
* lower GPU memory pressure

---

# 2. Recommended Stack

## Core Stack

```txt
TypeScript
Three.js
Vite
WebGL2 (today)
WebGPU-ready architecture
GLSL shaders now
WGSL migration path later
```

## Strongly Recommended Libraries

| Purpose             | Library           |
| ------------------- | ----------------- |
| ECS                 | bitecs            |
| Physics             | Rapier            |
| Networking          | Colyseus / Nakama |
| Terrain Noise       | simplex-noise     |
| Compression         | Draco + Meshopt   |
| Texture Compression | KTX2/Basis        |
| GPU Particles       | Custom GLSL       |
| Post FX             | postprocessing    |

---

# 3. Architecture for Massive RTS Worlds

## Best RTS Rendering Strategy

```txt
Low-poly geometry
+
Smart procedural shaders
+
Instancing
+
Texture atlases
+
Atmospheric post FX
```

This produces MUCH better results than:

```txt
High poly
+
Many textures
+
Large materials
```

---

# 4. Rendering Strategy

## Recommended Pipeline

```txt
Terrain
→ Shadow Pass
→ Main Pass
→ SSAO
→ Fog
→ Bloom
→ Color Grade
→ FXAA/TAA
```

DO NOT overuse postprocessing.

RTS readability matters more than cinematic effects.

---

# 5. Procedural Environments vs Textures

# When Procedural Wins

Procedural techniques are best when:

| Use Case          | Why                  |
| ----------------- | -------------------- |
| Huge terrains     | Infinite variation   |
| RTS maps          | Repetition reduction |
| Stylized worlds   | Consistent art style |
| Dynamic weather   | Runtime control      |
| Fog of war        | GPU generated        |
| Grass/wind        | Cheap animation      |
| Terrain blending  | No seams             |
| Low download size | Tiny data footprint  |

## Procedural Advantages

```txt
Tiny download
Infinite variation
No texture repetition
Easy biome generation
Easy blending
Scalable detail
```

## Best Procedural Uses

* terrain masks
* biome blending
* cloud layers
* grass animation
* water
* fog
* lava
* snow accumulation
* dirt variation
* wetness
* terrain decals

---

# When Textures Are Better

Textures are still superior for:

| Asset Type          | Why                    |
| ------------------- | ---------------------- |
| Buildings           | Specific detail        |
| Units               | Recognizable surfaces  |
| UI-like detail      | Precision              |
| Hero assets         | Artistic control       |
| Hard-surface sci-fi | Mechanical consistency |

---

# Best Hybrid Strategy

The BEST modern RTS approach:

```txt
Procedural macro detail
+
Texture micro detail
```

Example:

```txt
Procedural terrain coloration
+
Small seamless tiling detail maps
+
Runtime slope blending
+
Noise breakup
```

This gives AAA visuals with tiny downloads.

---

# 6. Terrain Rendering Techniques

# Recommended Terrain Stack

## Use:

```txt
Heightmap
+
Procedural biome masks
+
Texture splatting
+
Noise breakup
+
GPU instanced foliage
```

---

# Texture Splatting

Still the gold standard for RTS terrain.

## Example layers:

* dirt
* grass
* rock
* sand
* snow

Blend by:

* slope
* height
* biome
* moisture
* noise

---

# Runtime Slope Blending

Example:

```glsl
float slope = 1.0 - normal.y;
```

Steep slopes become rock automatically.

This dramatically increases realism.

---

# 7. Texture Optimization

# Use Seamless Textures ONLY For

| Good Uses | Avoid            |
| --------- | ---------------- |
| Terrain   | Character faces  |
| Dirt      | Hero props       |
| Grass     | Unique buildings |
| Rock      | Cinematic assets |
| Sand      | UI assets        |

---

# Best Texture Strategy

## DO:

```txt
512-1024 textures
KTX2 compression
Texture atlases
Shared materials
```

## DO NOT:

```txt
4K textures everywhere
Unique materials
PNG normals
Large albedo maps
```

---

# Recommended Texture Format

## Use:

```txt
KTX2 + Basis Universal
```

This is one of the largest performance wins possible.

Three.js KTX2:
https://threejs.org/examples/?q=ktx#webgl_loader_texture_ktx2

Official examples:
[Three.js Examples](https://threejs.org/examples/?utm_source=chatgpt.com)

---

# 8. Bump Maps, Normal Maps, Parallax & PBR

# Bump Maps

Cheap.
Old.
Limited.

Use only for:

* tiny detail enhancement
* low-end mobile

---

# Normal Maps

BEST all-round solution.

Use for:

* RTS buildings
* cliffs
* terrain detail
* units
* hard-surface detail

---

# Parallax Occlusion Mapping

Looks amazing.

BUT:

* expensive
* poor for large RTS maps
* can hurt readability

Use ONLY for:

* hero assets
* close camera views

---

# PBR Materials

Use selectively.

RTS benefits from stylized PBR:

```txt
Lower roughness variation
Simplified metals
Controlled contrast
```

Too much realism hurts readability.

---

# 9. Shader Languages Explained

# GLSL

## Current king for Three.js/WebGL.

Best today.

Use for:

* production RTS
* maximum compatibility
* mature tooling

---

# WGSL

Future of WebGPU.

Best long-term choice.

Advantages:

* compute shaders
* better GPU access
* safer architecture
* superior performance scaling

Use for:

* next-gen RTS systems
* GPU simulation
* fog of war
* particles
* crowd systems

---

# MSL (Metal Shading Language)

Apple-specific.

You generally NEVER write MSL directly in web development.

WebGPU handles translation.

---

# OSL (Open Shading Language)

Offline rendering.

Used in:

* Blender
* Arnold
* film rendering

NOT for browser RTS games.

---

# Recommendation

## Use:

| Today | Future |
| ----- | ------ |
| GLSL  | WGSL   |

---

# 10. WebGL vs WebGPU

# WebGL

## Advantages

* works everywhere
* stable
* mature
* battle-tested

## Disadvantages

* limited compute
* CPU bottlenecks
* older architecture

---

# WebGPU

## Advantages

* compute shaders
* massively better batching
* GPU simulation
* future-proof

## Disadvantages

* still evolving
* browser support improving
* tooling younger

---

# Best Strategy

## TODAY

```txt
Three.js + WebGL2
```

## ARCHITECTURE

Design systems to migrate later to:

```txt
Three.js WebGPU + WGSL
```

---

# 11. Best Environment Techniques

# 1. GPU Instanced Grass

Massive visual improvement.

Tiny performance cost if done correctly.

Best approach:

```txt
Low poly cards
+
Vertex wind animation
+
Distance fade
```

---

# 2. Height-Based Fog

EXTREMELY important for RTS scale.

Makes worlds feel huge.

---

# 3. Atmospheric Perspective

Critical for realism.

Distance should:

* desaturate
* lighten
* soften

---

# 4. Terrain Macro Variation

The secret to AAA terrain.

Never use pure repeating textures.

Add:

```txt
Large scale noise
+
Color variation
+
Macro breakup
```

---

# 5. Decal Systems

Use for:

* roads
* damage
* scorch marks
* paths
* biome transitions

---

# 12. Performance Optimization

# Golden Rule

## Draw calls kill RTS performance.

NOT polygons.

---

# Target Budgets

| Metric         | Target    |
| -------------- | --------- |
| Draw Calls     | < 500     |
| Materials      | < 50      |
| Shadow Casters | limited   |
| Texture Memory | < 512MB   |
| Unit Meshes    | instanced |

---

# Most Important Optimization

## Instancing.

Always.

---

# 13. Instancing & Draw Call Reduction

# InstancedMesh

One of the MOST important Three.js RTS tools.

Example:

```ts
const mesh = new THREE.InstancedMesh(
  geometry,
  material,
  10000
);
```

---

# Use Instancing For

* trees
* rocks
* units
* grass
* projectiles
* debris

---

# Avoid

```txt
One mesh per object
```

This destroys performance.

---

# 14. Streaming & LOD Systems

# Chunk-Based World Streaming

Required for large RTS maps.

Use:

```txt
terrain chunks
foliage chunks
entity regions
```

---

# LOD Strategy

Use:

| Distance | Detail     |
| -------- | ---------- |
| Near     | Full       |
| Mid      | Simplified |
| Far      | Billboard  |

---

# Billboard Forests

Still one of the BEST RTS techniques.

Especially with:

```txt
camera-facing normal correction
```

---

# 15. Atmospheric Effects

# Most Important RTS FX

## Fog

## God rays

## Wind

## Dust

## Heat haze

## Cloud shadows

These add FAR more quality than high-poly models.

---

# 16. Fog of War Techniques

# Best Modern Approach

GPU-generated fog textures.

Modern RTS fog should use:

```txt
compute textures
blur passes
animated cloud layers
visibility masks
```

Excellent reference:
[VOIDSTRIKE RTS Rendering Discussion](https://www.reddit.com/r/threejs/comments/1rus2v8/building_an_rts_with_threejs_webgpu_perinstance/?utm_source=chatgpt.com)

---

# 17. Asset Pipeline

# Best Workflow

```txt
Blender
→ glTF
→ Draco
→ Meshopt
→ KTX2
```

---

# glTF

Use glTF exclusively.

Avoid:

```txt
FBX
OBJ
DAE
```

---

# Compression Stack

## Mandatory

```txt
Draco
Meshopt
KTX2
```

---

# 18. TypeScript Architecture

# Recommended Project Structure

```txt
src/
  core/
  rendering/
  ecs/
  networking/
  terrain/
  shaders/
  units/
  effects/
  ui/
```

---

# Avoid Massive Scene Logic

Use:

```txt
Entity Component System
```

NOT:

```txt
Huge monolithic classes
```

---

# 19. Production Rendering Pipeline

# AAA Browser RTS Stack

```txt
Instancing
Texture atlases
Terrain splatting
GPU particles
Runtime fog
Atmospheric perspective
Temporal AA
LOD
Chunk streaming
Procedural variation
```

---

# 20. Best Professional Three.js References

# Official Three.js Examples

The gold standard:
[Three.js Official Examples](https://threejs.org/examples/?utm_source=chatgpt.com)

---

# Award-Winning Creative Three.js

## Botanics — Exceptional shader/environment work

[Botanics by Sujen Phea](https://botanics.sujen.co?utm_source=chatgpt.com)

---

# Advanced RTS Rendering Discussion

## VOIDSTRIKE

[VOIDSTRIKE Rendering Thread](https://www.reddit.com/r/threejs/comments/1rus2v8/building_an_rts_with_threejs_webgpu_perinstance/?utm_source=chatgpt.com)

---

# Massive RTS Browser Example

## Kiomet

[Kiomet RTS Showcase](https://www.webgpu.com/showcase/kiomet-real-time-multiplayer-strategy-game-rust-webgl/?utm_source=chatgpt.com)

---

# Three.js Advanced Techniques

[Three.js Blocks Examples](https://www.threejs-blocks.com/examples/?utm_source=chatgpt.com)

---

# 21. Example Code

# Terrain Material Blending

```glsl
vec3 grass = texture(grassTex, uv * 16.0).rgb;
vec3 rock = texture(rockTex, uv * 16.0).rgb;

float slope = 1.0 - normal.y;

vec3 finalColor = mix(grass, rock, slope);
```

---

# Wind Animation

```glsl
float wind =
    sin(position.x * 0.5 + time)
  * 0.1;

transformed.x += wind;
```

---

# Instanced Trees

```ts
const trees = new THREE.InstancedMesh(
  treeGeometry,
  treeMaterial,
  50000
);
```

---

# Chunk Streaming

```ts
if (cameraMovedChunk()) {
  loadNearbyChunks();
  unloadFarChunks();
}
```

---

# Fog Height

```glsl
float fogFactor =
  smoothstep(
    fogNear,
    fogFar,
    vWorldPosition.y
  );
```

---

# 22. Final Recommendations

# Highest ROI Features

If you only invest in a few systems:

## PRIORITIZE

1. Instancing
2. Terrain blending
3. Atmospheric fog
4. Wind animation
5. Procedural variation
6. KTX2 compression
7. LOD
8. Chunk streaming
9. GPU particles
10. Good lighting

---

# Biggest Mistakes

## DO NOT

* overuse 4K textures
* use too many materials
* rely on ultra-poly models
* ignore atmospheric depth
* skip instancing
* use unique textures everywhere
* overload postprocessing

---

# Best Overall RTS Visual Strategy

```txt
Low-poly stylized realism
+
Procedural enhancement
+
Strong atmosphere
+
Excellent lighting
+
Massive batching
```

This produces:

```txt
Tiny downloads
Fast loading
Huge worlds
Strong visual identity
Excellent performance
AAA appearance
```

---

# Final Rendering Recommendation

## 2026 Best Stack

```txt
Three.js
TypeScript
WebGL2
GLSL
KTX2
Instancing
Procedural terrain
Texture splatting
GPU fog
Chunk streaming
```

## Future Upgrade Path

```txt
WebGPU
WGSL
GPU compute simulation
GPU culling
GPU pathfinding
```

---

# Additional References

## Three.js Documentation

[Three.js Docs](https://threejs.org/docs/?utm_source=chatgpt.com)

## Three.js GitHub

[Three.js GitHub](https://github.com/mrdoob/three.js?utm_source=chatgpt.com)

## WebGPU Fundamentals

[WebGPU Fundamentals](https://webgpufundamentals.org/?utm_source=chatgpt.com)

## GLSL Reference

[The Book of Shaders](https://thebookofshaders.com/?utm_source=chatgpt.com)

## WGSL Spec

[WGSL Specification](https://www.w3.org/TR/WGSL/?utm_source=chatgpt.com)

## KTX2 Compression

[KTX Texture Format](https://www.khronos.org/ktx/?utm_source=chatgpt.com)
