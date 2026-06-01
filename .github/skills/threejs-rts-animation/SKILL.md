---
name: threejs-rts-animation
description: Use this skill when writing, refactoring, or optimizing RTS character animation systems, skeletal rigs, bone texture palettes, animation blend trees, phase offsets, procedural turning arcs, or level-of-detail (LOD) skeletal frame rate drops.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: character-animation
  conventions: motion-impression
  tags:
    - threejs
    - animation
    - skinning
    - blending
    - lod
    - optimization
---

# Three.js RTS Character Animation & Rigging Skill

## Core Philosophy
RTS character animation is entirely about **MOTION IMPRESSION**, not cinematic realism [hl3m2y]. Because players evaluate entities from far camera viewpoints, prioritize strong silhouettes, crisp action timing, and responsive state transitions over micro-realism (such as finger bones or facial shapes) [a1p7nm, zxl7xv, 4nl9u7]. 

**The Golden Law:** The simulation state must always drive the animation engine; the animation engine must never dictate structural gameplay positioning or velocity changes (No Root Motion) [7a4f0n, gngb9r].

---

# Tech Stack & Animation Budgets

Enforce these rigorous operational boundaries across all rigged mesh and skeleton configuration passes:



| Engineering Vector | Rigging & Animation Budget Standard | Core Performance Reason |
| :--- | :--- | :--- |
| **Standard Bone Count**| Strictly `15` to `35` bone structures max. | Eliminates transform computation overhead at scale [hpx1sr]. |
| **Animation Keys** | `10` to `20` FPS baked animation keyframes. | Drastically cuts binary payload size and VRAM bloat [7af8c0]. |
| **Rig Architecture** | Globally Shared Skeletons and Rig Libraries. | Allows seamless memory sharing across entities [48c2jy]. |
| **Networking State** | Primitive state flags only (`State: ATTACK`). | Avoids broadcasting high-bandwidth bone arrays [ux2b0m]. |
| **Skinning Pipeline** | GPU Texture-Based Bone Skinning / Palettes. | Prevents main-thread CPU transform blocking loops [y7k4sd]. |

---

# RTS Locomotion & Animation Sync Pipeline

All entity movement updates, rotational interpolations, and mesh playback transformations must step sequentially through this flow:
```text
Kinematic Pathfinding Velocity Update (Derived from fixed-tick simulation)
    ↓
Animation State Tree Evaluator (Queries primitive states: Idle, Walk, Attack, Die)
    ↓
Time-Scale Velocity Matching (Dynamically adjusts track speed to prevent foot sliding)
    ↓
Rotational Interpolation (Applies smooth turn rates and banking modifiers)
    ↓
Animation Distance-LOD Gating (Reduces skeletal evaluation ticks based on camera range)
    ↓
Procedural Blend Application (Combines baked data with secondary vertex wind or weight sway)
    ↓
GPU Skinning Matrix Multiplier (Bakes final transforms into InstancedMesh array shaders)
```

---

# AI Code Generation Rules

### 1. Kinematic Velocity Matching (Anti-Foot-Sliding)
When writing locomotion playback logic, never map walk loops to flat static speed multipliers. Always scale the action playback rate dynamically based on the current actual grid speed relative to a base variable to wipe out visual foot-sliding bugs:
```ts
// Enforced runtime speed-matching calculations
const currentSpeed = entity.velocity.length();
walkAction.timeScale = currentSpeed / baseWalkSpeedConstant;
```

### 2. Bounded Rotation Interpolation (No Snap-Turning)
Entities must not instantly snap to face their movement target vectors, which creates jagged, unpolished visual presentation. Always smoothly interpolate character orientation matrices using delta-gated linear interpolation loops:
```ts
// Smooth turn-rate interpolation logic configuration
unitMesh.rotation.y = THREE.MathUtils.lerp(
  unitMesh.rotation.y,
  targetYawAngle,
  deltaTime * turnRateModifierConstant
);
```

### 3. Progressive Distance-Based Animation LOD
To retain high frame-rates across vast army scale, do not update animation frames at maximum fidelity on distant items. Implement a distance-gated framerate throttling structure within system updates:
* **Near Zone (< 50 Units):** Update the skeletal animation state tree fully at 30 FPS.
* **Mid Zone (50 - 150 Units):** Drop skeletal matrix update checks to a compressed 15 FPS window [xaqn91].
* **Far Zone (> 150 Units):** Drop updates to 8 FPS, or fully swap the model out for a low-overhead, GPU Vertex Animation Texture (VAT) mesh or 2D Billboard plane [h3lz0k].

### 4. Non-Synchronized Crowd Phase Randomization
* **Ban Synchronized Marching:** When initializing cloned or pooled unit armies from the pipeline cache, never allow them to start animations simultaneously on frame 0.
* **Phase Offsetting:** Always inject a randomized temporal offset parameter into the animation timeline to shatter synchronized clone behavior across the army group:
  ```ts
  // Executed on unit pool allocation instantiation
  unitAction.time = Math.random() * unitClip.duration;
  ```

### 5. Multi-Mixer Allocations Disallowed
* Instantiating one distinct `THREE.AnimationMixer` loop per individual unit inside an army array of 1000+ entities is strictly forbidden [4f1j5y].
* Code must route playback parameters through a centralized, shared GPU-driven skinning pipeline or specialized shader matrix arrays to keep draw calls flat [98cuw9].

---

# Structural Anti-Patterns to Refuse
* Refuse any assets featuring finger bone chains, facial topology points, or unique custom base skeletons [6v5eb4].
* Refuse any logic loops that try to update bone transformation matrices manually on the CPU thread every render frame.
* Refuse any network synchronization scripts that transmit raw character keyframe steps over web sockets [ux2b0m].
