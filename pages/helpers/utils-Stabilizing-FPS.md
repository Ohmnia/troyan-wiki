# Stabilizing FPS, Frametime & Render Timing in RTS/Web Game Engines

# The Core Problem

Newer game engines and HUD systems often display raw per-frame timing data directly to the screen.

This includes:

* FPS
* Frametime
* Render Time
* Physics Time
* AI Time
* GPU Time

The issue is that every frame is naturally different.

Example:

```txt
Frame 1 = 15.9ms
Frame 2 = 17.2ms
Frame 3 = 16.4ms
Frame 4 = 24ms spike
Frame 5 = 15.8ms
```

This causes the HUD to fluctuate constantly:

```txt
FPS:
61
58
63
54
60
```

The engine may actually be stable, but the HUD appears unstable because it is displaying raw timing data directly.

---

# Why Real-Time Metrics Fluctuate

All real-time systems contain natural timing noise caused by:

* CPU scheduling
* Browser garbage collection
* GPU pipeline timing
* Shader compilation
* Texture uploads
* Asset streaming
* OS interrupts
* Cache misses
* JavaScript JIT optimization
* Pathfinding spikes
* Collision spikes
* DOM updates

Even AAA engines experience these fluctuations.

The goal is NOT to eliminate all spikes.

The goal is to stabilize presentation.

---

# The Correct Architecture

DO NOT do this:

```txt
Raw Metrics → HUD
```

Instead:

```txt
RAW ENGINE METRICS
        ↓
Performance Smoother
        ↓
HUD Display
```

The HUD should NEVER read raw metrics directly.

---

# Professional Solution

Create a centralized:

```txt
PerformanceMonitor
```

or:

```txt
MetricsSmoother
```

system.

Every metric passes through this system before being displayed.

---

# Universal Smoothing Function

The industry-standard solution is exponential smoothing.

One function can stabilize nearly all engine metrics.

```js
function smooth(current, target, smoothing = 0.05) {

    return current + (target - current) * smoothing;
}
```

This works for:

* FPS
* Frametime
* Render Time
* Physics Time
* GPU Time
* Network Latency
* Draw Calls
* AI Timing
* Memory Usage

---

# FPS Stabilization

```js
displayFPS =
    smooth(displayFPS, rawFPS, 0.05);
```

---

# Frametime Stabilization

```js
displayFrameTime =
    smooth(displayFrameTime, rawFrameTime, 0.08);
```

---

# Render Time Stabilization

```js
displayRenderTime =
    smooth(displayRenderTime, rawRenderTime, 0.08);
```

---

# Physics Timing Stabilization

```js
displayPhysicsTime =
    smooth(displayPhysicsTime, rawPhysicsTime, 0.1);
```

---

# Recommended Smoothing Values

## Very Stable

```js
0.02
```

Very smooth but slower response.

---

## Balanced (Recommended)

```js
0.05
```

Best overall balance.

---

## Highly Responsive

```js
0.15
```

Used for debugging/profiling tools.

---

# Update the HUD Less Frequently

Professional engines usually DO NOT redraw metrics every frame.

Instead update the HUD:

```txt
4 times per second
```

or every:

```txt
250ms
```

Example:

```js
let hudUpdateTimer = 0;

function update(deltaTime) {

    hudUpdateTimer += deltaTime;

    if (hudUpdateTimer >= 0.25) {

        refreshHUD();

        hudUpdateTimer = 0;
    }
}
```

This dramatically improves perceived stability.

---

# Recommended Engine Structure

## Raw Metrics

```js
performance.raw = {

    fps: 62.48,
    frame: 16.1,
    render: 5.2,
    physics: 1.8,
    ai: 0.7
};
```

---

## Smoothed Display Metrics

```js
performance.display = {

    fps: 60.1,
    frame: 16.6,
    render: 5.4,
    physics: 1.9,
    ai: 0.8
};
```

HUD reads ONLY:

```js
performance.display
```

Never:

```js
performance.raw
```

---

# Recommended Performance Manager Example

```js
class PerformanceMonitor {

    constructor() {

        this.raw = {};

        this.display = {};
    }

    smooth(current, target, factor = 0.05) {

        return current +
            (target - current) * factor;
    }

    updateMetric(name, value, factor = 0.05) {

        this.raw[name] = value;

        if (this.display[name] === undefined) {
            this.display[name] = value;
        }

        this.display[name] =
            this.smooth(
                this.display[name],
                value,
                factor
            );
    }
}
```

Usage:

```js
const perf = new PerformanceMonitor();

perf.updateMetric("fps", rawFPS);
perf.updateMetric("frame", rawFrameTime);
perf.updateMetric("render", rawRenderTime);
```

HUD:

```js
hudFPS.innerText =
    perf.display.fps.toFixed(1);
```

---

# Advanced Recommendation: Spike Detection

Professional engines usually separate:

## Stable Display Metrics

```txt
FPS: 60
Frame: 16.6ms
Render: 5.3ms
```

from:

## Spike Warnings

```txt
Frame Spike: 42ms
GC Pause: 18ms
```

This preserves stable visuals while still exposing performance issues.

---

# Important: Smoothing Does NOT Fix Real Performance Problems

If frametimes look like this:

```txt
16ms
16ms
35ms
16ms
40ms
```

then the engine still has actual instability.

Common causes:

* Garbage collection spikes
* Excessive allocations
* Shader compilation
* Texture uploads
* Layout thrashing
* Pathfinding spikes
* Physics spikes
* Too many draw calls
* DOM manipulation
* Asset streaming

Smoothing only stabilizes presentation.

You still need profiling and optimization.

---

# Best RTS Engine Practice

Professional RTS engines typically have a centralized:

```txt
PerformanceManager
```

responsible for:

* Metric smoothing
* Rolling averages
* Spike detection
* GPU timings
* CPU timings
* Frame pacing
* Subsystem profiling
* Adaptive smoothing
* Debug HUD management

This scales properly as the engine grows.

---

# Final Recommended Stack

## Recommended Pipeline

```txt
Engine Systems
    ↓
Raw Metrics
    ↓
Performance Monitor
    ↓
Metric Smoothing
    ↓
HUD Update Timer
    ↓
Displayed Metrics
```

This is the correct scalable architecture for:

* RTS engines
* WebGL engines
* Three.js games
* Multiplayer games
* Browser-based simulation engines
* Custom game frameworks
