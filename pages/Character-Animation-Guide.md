# Expert Guide: RTS Character Animation in Three.js + TypeScript

# Table of Contents

1. RTS Animation Philosophy
2. Biggest Animation Mistakes
3. Best RTS Animation Strategy
4. Skeletal Animation vs Vertex Animation
5. Why RTS Animation Is Different
6. The Illusion of Motion
7. Best Unit Animation Architecture
8. Animation LOD Systems
9. GPU Animation Techniques
10. Animation Compression
11. Instanced Animation
12. Root Motion vs Simulated Movement
13. Blend Trees
14. Animation State Machines
15. Crowd Animation Techniques
16. Procedural Animation
17. Animation Timing Tricks
18. Unit Turning
19. Terrain Adaptation
20. Foot Sliding Prevention
21. Wind, Secondary Motion & Microanimation
22. Best RTS Readability Practices
23. Memory Optimization
24. Best File Formats
25. Networking Animation
26. Recommended Animation Pipeline
27. Three.js Animation Best Practices
28. Example TypeScript Code
29. Best Professional References
30. Free/Open Source Resources
31. Final Recommendations

---

# 1. RTS Animation Philosophy

# IMPORTANT

RTS animation is NOT character-action animation.

The player usually sees units from:

```txt id="a1p7nm"
high camera angle
medium/far distance
many units simultaneously
```

This changes EVERYTHING.

---

# RTS Animation Priorities

## Most Important

```txt id="zxl7xv"
clarity
readability
silhouette
timing
responsiveness
```

---

# Least Important

```txt id="4nl9u7"
facial animation
finger animation
micro realism
```

---

# Golden Rule

## RTS animation is about MOTION IMPRESSION.

NOT cinematic realism.

---

# 2. Biggest Animation Mistakes

# Common RTS Animation Failures

## 1. Using AAA FPS animation pipelines

Huge waste.

---

## 2. Overly detailed rigs

BAD:

```txt id="g5h2jx"
120-bone skeletons
```

GOOD:

```txt id="hpx1sr"
15–40 bones
```

---

## 3. Unique animations per unit

Destroys memory usage.

---

## 4. High-framerate baked animation everywhere

Expensive.

---

## 5. Root motion in RTS

Usually wrong.

---

# 3. Best RTS Animation Strategy

# Best Overall Approach

```txt id="o4c0ux"
Shared skeletons
+
Animation reuse
+
GPU instancing
+
Animation LOD
+
Procedural enhancement
```

---

# Best Quality-to-Performance Formula

```txt id="k5d7ko"
Simple animations
+
Excellent timing
+
Procedural secondary motion
+
Strong silhouettes
```

This looks FAR better than:

```txt id="sqkp5o"
complex expensive animation
```

---

# 4. Skeletal Animation vs Vertex Animation

# Skeletal Animation

## Best overall RTS solution.

Advantages:

```txt id="2bte6g"
small file size
animation reuse
blend support
easy retargeting
good memory usage
```

---

# Vertex Animation

Good for:

```txt id="i9ul0q"
crowds
grass
monsters
very large armies
```

---

# Recommendation

## Use Skeletal Animation for:

* hero units
* infantry
* vehicles
* important units

## Use Vertex Animation for:

* distant crowds
* ambient units
* background life
* swarm effects

---

# 5. Why RTS Animation Is Different

# Players Read Units by:

## 1. Motion silhouette

## 2. Speed

## 3. Rhythm

## 4. Direction

## 5. Attack timing

NOT tiny details.

---

# Example

StarCraft units remain readable because:

```txt id="6h9cz1"
animation timing is excellent
```

NOT because rigs are advanced.

---

# 6. The Illusion of Motion

# MOST IMPORTANT CONCEPT

You do NOT need realistic animation.

You need:

```txt id="qt0h4w"
convincing motion illusion
```

---

# Motion Illusion Techniques

## 1. Exaggerated anticipation

## 2. Clear attack silhouettes

## 3. Strong timing

## 4. Good acceleration

## 5. Proper turn arcs

## 6. Secondary motion

## 7. Animation sync variation

---

# 7. Best Unit Animation Architecture

# BEST PRACTICE

Separate:

```txt id="5nwb18"
Simulation
Animation state
Rendering
```

---

# Recommended Structure

```txt id="w7ejys"
Entity
  → movement state
  → combat state
  → animation state
```

---

# Example Animation States

```txt id="bj0g7m"
Idle
Walk
Run
Attack
Cast
Harvest
Build
Die
```

---

# 8. Animation LOD Systems

# CRITICAL FOR RTS

Units far away should use:

```txt id="h3lz0k"
simpler animation
```

---

# Recommended Animation LOD

| Distance | Animation          |
| -------- | ------------------ |
| Near     | Full skeletal      |
| Mid      | Reduced FPS        |
| Far      | Vertex/simple      |
| Very Far | Billboard/impostor |

---

# Massive Optimization Trick

Reduce animation FPS with distance.

Example:

```txt id="xaqn91"
Near: 30 FPS
Mid: 15 FPS
Far: 8 FPS
```

Most players NEVER notice.

Huge CPU savings.

---

# 9. GPU Animation Techniques

# CPU Skinning Does NOT Scale Well

For huge RTS battles:

```txt id="y7k4sd"
GPU skinning
```

is essential.

---

# Best GPU Animation Methods

## 1. Texture-based bone animation

## 2. Bone texture palettes

## 3. Vertex animation textures (VAT)

---

# Texture-Based Bone Animation

Stores bone transforms in textures.

Advantages:

```txt id="q61v3q"
massive batching
GPU efficient
thousands of units
```

---

# 10. Animation Compression

# IMPORTANT

Animation data becomes enormous.

---

# Use Compression

## Recommended

```txt id="5xj32l"
glTF animation compression
```

---

# Remove:

```txt id="6v5eb4"
unused tracks
finger bones
tiny motion noise
```

---

# Keyframe Reduction

Huge optimization.

Most RTS units only need:

```txt id="7af8c0"
10–20 FPS baked animation
```

NOT 60 FPS.

---

# 11. Instanced Animation

# Best Modern RTS Technique

```txt id="gyd13u"
instanced skinned meshes
```

---

# Benefits

```txt id="y57r8j"
thousands of animated units
low draw calls
shared animation data
```

---

# Strategy

All units share:

```txt id="vvrv2u"
same skeleton
same animation clips
different state offsets
```

---

# Add Variation Using

```txt id="7n4wqi"
phase offsets
speed variation
blend variation
```

This prevents clone appearance.

---

# 12. Root Motion vs Simulated Movement

# NEVER Use Root Motion for RTS Movement

BAD:

```txt id="7a4f0n"
animation drives movement
```

GOOD:

```txt id="gngb9r"
simulation drives animation
```

---

# Correct RTS Flow

```txt id="kfwfcs"
Pathfinding
→ movement velocity
→ animation speed
```

---

# Why?

RTS requires:

```txt id="ytl7x0"
precise gameplay movement
```

---

# 13. Blend Trees

# Use Animation Blending

Critical for smooth movement.

---

# Recommended Blends

```txt id="lpzgb4"
idle ↔ walk
walk ↔ run
move ↔ attack
```

---

# Avoid Hard Transitions

They look robotic.

---

# 14. Animation State Machines

# Recommended Structure

```txt id="vk99l2"
Movement State Machine
+
Combat State Machine
```

---

# Example

```txt id="l50m9s"
Idle
→ Move
→ Attack
→ Recover
→ Move
```

---

# Use Timed Attack Windows

Combat should sync with:

```txt id="j9u6b9"
animation hit frames
```

---

# 15. Crowd Animation Techniques

# For Massive Battles

Use:

```txt id="gpkpaz"
animation phase randomization
```

---

# Example

```ts id="jmdh8l"
animation.time += randomOffset;
```

This prevents synchronized marching.

---

# Best Crowd Tricks

## Add:

```txt id="jycj4i"
speed variance
timing variance
turn variance
idle variance
```

Tiny changes create huge realism.

---

# 16. Procedural Animation

# Procedural Animation Is EXTREMELY Valuable

Especially for:

```txt id="6gpxoq"
secondary motion
terrain adaptation
weapon sway
look targets
wind response
```

---

# Best Hybrid Strategy

```txt id="cpt8xv"
Baked core animation
+
Procedural enhancement
```

---

# Procedural Additions

## Examples

```txt id="4a6epf"
head tracking
torso rotation
weapon recoil
foot alignment
leaning
```

---

# 17. Animation Timing Tricks

# Timing > Detail

Professional RTS feel comes from:

```txt id="5j0zfj"
timing quality
```

---

# Important Timing Principles

## Attack windup

## Anticipation

## Impact pause

## Recovery

## Movement acceleration

---

# Animation Curves Matter

Avoid perfectly linear motion.

---

# 18. Unit Turning

# One of the MOST Important RTS Features

Bad turning ruins quality instantly.

---

# Use:

```txt id="8jlc7r"
turn rates
rotation interpolation
banking
leaning
```

---

# Units Should NOT

```txt id="83s9dr"
snap rotate instantly
```

unless intentionally robotic.

---

# 19. Terrain Adaptation

# Terrain Alignment Matters

Use procedural IK lightly.

---

# RTS Best Practice

## Simplified terrain adaptation.

NOT expensive full IK.

---

# Recommended

```txt id="v6xjup"
pelvis offset
foot height adjustment
body tilt
```

---

# 20. Foot Sliding Prevention

# Common Problem

Foot sliding destroys realism.

---

# Best Fix

Animation speed should match:

```txt id="1jmm1k"
actual movement speed
```

---

# Example

```ts id="1g8xcm"
walkAnim.timeScale =
  velocity / baseWalkSpeed;
```

---

# 21. Wind, Secondary Motion & Microanimation

# HUGE QUALITY BOOST

Small ambient movement makes units feel alive.

---

# Add:

```txt id="3gm4ux"
cape motion
weapon sway
idle breathing
shield bounce
cloth flutter
```

---

# Use GPU Vertex Motion

Cheap and effective.

---

# 22. Best RTS Readability Practices

# Animation Must Communicate Gameplay

Players should instantly recognize:

```txt id="fpp7sn"
attacking
moving
casting
dying
retreating
```

---

# Readability Beats Realism

Always.

---

# Exaggerate Important Actions

Especially:

```txt id="jlwmr9"
attacks
spell casts
death animations
```

---

# 23. Memory Optimization

# Biggest Animation Costs

Usually:

```txt id="hyyqyz"
bone transforms
animation clips
skinning
```

---

# Best Optimization Techniques

## Share:

```txt id="48c2jy"
skeletons
clips
materials
textures
```

---

# Avoid Unique Rigs

Shared rigs are CRITICAL.

---

# Recommended Bone Counts

| Unit Type | Bones |
| --------- | ----- |
| Infantry  | 20–35 |
| Hero      | 40–70 |
| Monster   | 25–50 |
| RTS Crowd | 10–20 |

---

# 24. Best File Formats

# BEST FORMAT

```txt id="2n75zh"
glTF / GLB
```

---

# Why?

Advantages:

```txt id="0b5zv2"
compressed
modern
animation support
PBR support
fast loading
Three.js native
```

---

# Compression Stack

## Mandatory

```txt id="7b55jt"
Draco
Meshopt
KTX2
```

---

# 25. Networking Animation

# NEVER Network Animation Frames

Instead sync:

```txt id="ux2b0m"
state
velocity
action
direction
```

---

# Example

```txt id="ys4mvv"
Unit #1052
State: ATTACK
Target: #44
```

Clients determine animation locally.

---

# 26. Recommended Animation Pipeline

# BEST PIPELINE

```txt id="pq6y2x"
Blender
→ Rigify/custom rig
→ glTF export
→ Draco/Meshopt
→ Three.js
```

---

# Recommended Workflow

## Use:

```txt id="0mswgj"
shared skeletons
shared clips
animation libraries
```

---

# 27. Three.js Animation Best Practices

# Use AnimationMixer Sparingly

Too many mixers can become expensive.

---

# Better Strategy

Use:

```txt id="6xpdjr"
shared animation systems
```

---

# Avoid One Mixer Per Unit

Especially for:

```txt id="4f1j5y"
1000+ units
```

---

# Best Approach

```txt id="98cuw9"
GPU animation
+
shared clip playback
+
animation texture systems
```

---

# 28. Example TypeScript Code

# Shared Animation

```ts id="o7xk4v"
const mixer =
  new THREE.AnimationMixer(sharedModel);
```

---

# Animation Speed Scaling

```ts id="p01g5z"
walkAction.timeScale =
  movementSpeed / walkBaseSpeed;
```

---

# Smooth Rotation

```ts id="w4nmkc"
unit.rotation.y = THREE.MathUtils.lerp(
  unit.rotation.y,
  targetRotation,
  delta * 5
);
```

---

# Animation State

```ts id="z0n8qv"
enum AnimationState {
  Idle,
  Walk,
  Attack,
  Die
}
```

---

# Randomized Idle Offset

```ts id="wfwglp"
action.time =
  Math.random() * clip.duration;
```

---

# 29. Best Professional References

# Three.js Animation Examples

[Three.js Animation Examples](https://threejs.org/examples/?q=animation&utm_source=chatgpt.com)

([threejs.org](https://threejs.org/examples/?q=animation&utm_source=chatgpt.com))

---

# GPU Animation Techniques

[WebGPU Animation Research](https://webgpu.github.io/webgpu-samples/?utm_source=chatgpt.com)

([webgpu.github.io](https://webgpu.github.io/webgpu-samples/?utm_source=chatgpt.com))

---

# Advanced Crowd Animation

[Unity DOTS Crowd Research](https://unity.com/dots?utm_source=chatgpt.com)

([unity.com](https://unity.com/dots?utm_source=chatgpt.com))

---

# Motion Design & Timing

[The Animator's Survival Kit](https://www.animatorssurvivalkit.com/?utm_source=chatgpt.com)

([animatorssurvivalkit.com](https://www.animatorssurvivalkit.com/?utm_source=chatgpt.com))

---

# Shader Animation Learning

[The Book of Shaders](https://thebookofshaders.com/?utm_source=chatgpt.com)

([thebookofshaders.com](https://thebookofshaders.com/?utm_source=chatgpt.com))

---

# 30. Free/Open Source Resources

# Free Character Models

## Mixamo

Free animations:
https://www.mixamo.com/

---

# OpenGameArt

Huge free RTS resources:
https://opengameart.org/

---

# Kenney Assets

Excellent stylized free assets:
https://kenney.nl/assets

---

# Poly Pizza

Free low-poly models:
https://poly.pizza/

---

# Quaternius

Fantastic free RTS-compatible assets:
https://quaternius.com/

---

# Sketchfab Free Models

https://sketchfab.com/features/free-3d-models

---

# Blender

Best free animation tool:
https://www.blender.org/

---

# glTF Transform

Optimization toolkit:
https://gltf-transform.dev/

---

# Meshoptimizer

Critical compression:
https://github.com/zeux/meshoptimizer

---

# Draco Compression

https://google.github.io/draco/

---

# 31. Final Recommendations

# Best Overall RTS Animation Strategy

## Use:

```txt id="98iowx"
shared skeletons
GPU skinning
animation LOD
procedural enhancement
instancing
timing-focused animation
```

---

# Best Quality-to-Performance Formula

```txt id="q06zk1"
Simple rigs
+
Excellent timing
+
Strong silhouettes
+
Procedural variation
+
Secondary motion
```

This produces FAR better RTS visuals than:

```txt id="x8zsj6"
ultra-complex cinematic animation
```

---

# Highest ROI Features

If you prioritize only a few things:

## PRIORITIZE

1. Shared skeletons
2. Animation LOD
3. Timing polish
4. Turning quality
5. Speed matching
6. Secondary motion
7. Animation variation
8. GPU animation
9. Instancing
10. Strong silhouettes

---

# Best Modern RTS Animation Stack

```txt id="5rwnc7"
Three.js
TypeScript
glTF
GPU skinning
Instanced rendering
Animation LOD
Procedural enhancement
```

---

# Golden Rule

## Players remember:

```txt id="hl3m2y"
how motion FEELS
```

NOT:

```txt id="j8hs0w"
how many bones your rig used
```
