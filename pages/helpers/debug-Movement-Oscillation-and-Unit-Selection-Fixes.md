# RTS Unit Arrival Detection, Movement Oscillation & Unit Selection Fixes

# Current Symptoms

Your RTS units currently:

* move toward the target correctly
* overshoot the destination
* bounce around the target position
* walk past the destination
* turn around repeatedly
* only eventually stop after 2–3 corrections

Additionally:

* single-unit selection is unreliable
* clicking units individually is difficult
* units use GLB models instead of simple squares
* selection circles and destination indicators were added

These are VERY common RTS movement problems.

---

# The REAL Problem

This is usually NOT a pathfinding issue.

It is almost always:

```txt
Arrival detection + movement deceleration problem
```

Your units likely do this:

```js
direction = target - currentPosition;
velocity = normalize(direction) * speed;
position += velocity * deltaTime;
```

This creates:

```txt
Infinite correction oscillation
```

because the unit overshoots the destination.

---

# Why Units Bounce Around The Target

Example:

---

## Frame 1

```txt
Unit position = 9.8
Target = 10
```

Moves forward.

---

## Frame 2

```txt
Unit position = 10.3
```

Oops — overshot.

Now direction reverses.

---

## Frame 3

```txt
Unit position = 9.9
```

Overshoots again.

Result:

```txt
Back-and-forth jitter
```

---

# THE Correct RTS Solution

Professional RTS engines NEVER rely on exact target matching.

They use:

```txt
Arrival Radius / Stopping Distance
```

---

# Correct Arrival Logic

Instead of:

```js
if (position === target)
```

use:

```js
const distance =
    position.distanceTo(target);

if (distance <= arrivalRadius) {

    stopMoving();
}
```

---

# Recommended Arrival Radius

For RTS games:

```txt
0.2 → 1.5 world units
```

depending on:

* unit size
* movement speed
* scale

---

# CRITICAL FIX: Snap To Target

When arriving:

```js
if (distance <= arrivalRadius) {

    unit.position.copy(target);

    unit.velocity.set(0, 0, 0);

    unit.isMoving = false;
}
```

This is VERY important.

Without snapping:

```txt
Tiny floating-point drift continues forever
```

---

# Second Major Problem: No Deceleration

Your units probably move at:

```txt
Full speed until exact stop
```

This guarantees overshoot.

Professional RTS engines use:

```txt
Arrival Steering
```

---

# Proper Arrival Steering

As units approach the target:

```txt
Reduce movement speed gradually
```

---

# Example

```js
const distance =
    position.distanceTo(target);

let desiredSpeed = maxSpeed;

if (distance < slowRadius) {

    desiredSpeed =
        maxSpeed * (distance / slowRadius);
}
```

This creates:

* smooth stopping
* no bouncing
* natural movement

---

# Recommended Values

## Slow Radius

```txt
2 → 5 units
```

---

## Arrival Radius

```txt
0.3 → 1 units
```

---

# Third Problem: Units Fighting Separation

Very common RTS issue.

You likely have:

* collision avoidance
* separation steering
* neighbor pushing

while ALSO trying to stop movement.

Result:

```txt
Movement system says STOP
Separation system says MOVE
```

Units wobble forever.

---

# Proper Fix

When unit arrives:

```js
unit.isMoving = false;
unit.hasDestination = false;
```

AND reduce:

* steering
* avoidance
* separation forces

near arrival.

---

# VERY Important RTS Fix

Once inside arrival radius:

```txt
Disable path correction entirely
```

Otherwise the unit constantly tries micro-adjustments.

---

# Recommended Final Arrival System

```js
const distance =
    unit.position.distanceTo(target);

if (distance <= arrivalRadius) {

    unit.position.copy(target);

    unit.velocity.set(0, 0, 0);

    unit.isMoving = false;

    return;
}

let desiredSpeed = maxSpeed;

if (distance < slowRadius) {

    desiredSpeed =
        maxSpeed * (distance / slowRadius);
}

const direction =
    target.clone()
        .sub(unit.position)
        .normalize();

unit.velocity.copy(
    direction.multiplyScalar(desiredSpeed)
);
```

This solves MOST RTS arrival problems.

---

# Why GLB Models Broke Selection

This is VERY important.

When you switched from:

```txt
Dummy Squares
```

to:

```txt
GLB Models
```

selection probably became inaccurate because:

* model origin/pivot changed
* mesh bounds changed
* raycasting hits child meshes
* model scale differs
* selection collider mismatch

This is EXTREMELY common.

---

# Common GLB Selection Problems

# 1. Bad Pivot Origin

The GLB model origin may be:

```txt
At feet
At center
Underground
Offset entirely
```

Raycasting becomes inconsistent.

---

# 2. Tiny Meshes

The visual model may be much smaller than expected.

Result:

```txt
Difficult clicking
```

---

# 3. Multiple Child Meshes

GLB models often contain:

```txt
Scene
 ├─ Mesh
 ├─ Mesh
 ├─ Armature
 └─ Bones
```

Raycaster may hit unexpected objects.

---

# BEST RTS PRACTICE

DO NOT raycast against visual models directly.

Instead create:

```txt
Invisible Selection Collider
```

---

# Professional RTS Solution

Each unit should have:

```txt
Visual Model
+
Selection Collider
+
Movement Collider
```

SEPARATE systems.

---

# Example

```js
const selectionSphere =
    new THREE.Mesh(
        new THREE.SphereGeometry(1),
        invisibleMaterial
    );

selectionSphere.visible = false;

unit.add(selectionSphere);

unit.selectionCollider =
    selectionSphere;
```

Then raycast ONLY against:

```txt
selectionCollider
```

NOT the GLB mesh.

---

# This Is Industry Standard

Games separate:

| System            | Purpose     |
| ----------------- | ----------- |
| Visual Mesh       | Graphics    |
| Collider          | Physics     |
| Selection Bounds  | Mouse Input |
| Navigation Radius | Pathfinding |
| Combat Radius     | Attacking   |

Never combine them.

---

# Pulsing Circle Under Units

Good idea.

But ensure:

```txt
Circle is attached to unit root
```

NOT the animated mesh.

Otherwise animations move the indicator incorrectly.

---

# Recommended Selection Ring

Use:

```txt
THREE.RingGeometry
```

with:

```txt
transparent: true
depthWrite: false
```

to prevent Z-fighting.

---

# Destination Marker

Your yellow destination circle is correct RTS UX.

Recommended behavior:

* spawn on click
* fade out
* pulse once
* disappear after 1–2 seconds

Professional RTS games do this.

---

# MOST IMPORTANT FIXES (Priority Order)

# 1. Add Arrival Radius

MOST important.

---

# 2. Snap To Target On Arrival

Prevents floating drift.

---

# 3. Add Slowdown Radius

Prevents overshoot.

---

# 4. Disable Steering Near Destination

Stops wobbling.

---

# 5. Separate Selection Collider From GLB Model

Fixes unreliable clicking.

---

# 6. Raycast ONLY Against Selection Colliders

Critical RTS architecture fix.

---

# Final Diagnosis

Your engine is MOST likely suffering from:

```txt
Exact-position arrival logic
+
No movement deceleration
+
GLB pivot/collider mismatch
```

These three combined produce:

* bouncing
* overshoot
* turning around
* delayed stopping
* unreliable selection

This is VERY normal during early RTS engine development.
