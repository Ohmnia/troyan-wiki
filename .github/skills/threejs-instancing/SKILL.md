---
name: threejs-instancing
description: Use this skill when designing scalable RTS rendering systems using Three.js InstancedMesh, batched rendering, and large-scale unit rendering.
license: MIT
compatibility: ">=1.0.0"
metadata:
  tags:
    - threejs
    - instancing
    - rendering
    - rts
    - graphics
    - performance
---

# Three.js Instancing Skill

## Core Philosophy
RTS rendering is primarily:
* batching
* visibility management
* draw-call reduction

NOT:
* cinematic rendering

---

# Instancing Rules
Use:
* InstancedMesh
* shared geometry
* shared materials
* batched transform updates

Avoid:
* one mesh per unit
* material proliferation
* deep Object3D hierarchies

---

# Rendering Priorities
1. low draw calls
2. scalable rendering
3. stable frametimes
4. efficient visibility
5. simple materials

---

# Preferred Rendering Patterns
Prefer:
* texture atlases
* frustum culling
* shared materials
* lightweight shaders
* transform buffering

Avoid:
* excessive shadows
* expensive post-processing
* runtime geometry rebuilding
* per-unit skinned meshes

---

# RTS Rendering Rules
Rendering must remain decoupled from simulation.

Preferred pipeline:
```text
Simulation
→ Render Extraction
→ Visibility Filtering
→ Instance Updates
→ GPU Submission
```

---

# API Implementation Constraints
* When updating instance transformations via matrices, always explicitly call `instancedMesh.instanceMatrix.needsUpdate = true;` during the GPU submission phase.
* Never instantiate a separate `THREE.Mesh` object inside a game-loop array update step.
