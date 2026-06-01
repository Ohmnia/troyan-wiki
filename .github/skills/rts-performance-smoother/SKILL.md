---
name: rts-performance-smoother
description: Use this skill when implementing, refactoring, or optimizing telemetry dashboards, engine profilers, subsystem performance timers, FPS trackers, frame budgeting trackers, or hardware stress-testing readouts.
license: MIT
compatibility: ">=1.0.0"
metadata:
  audience: developers
  workflow: engine-telemetry
  conventions: metric-decoupling
  tags:
    - rts
    - telemetry
    - profiler
    - smoothing
    - fps
    - frame-budget
---

# RTS Performance Smoothing & Telemetry Skill

## Core Philosophy
The interface layer must never read raw engine diagnostic timings directly. Real-time telemetry signals inherently contain background operating system scheduling noise. Isolate raw platform tracking from display pipelines using exponential mathematical filters and gated temporal intervals to maintain readable diagnostics.

---

# Architecture & Telemetry Pipeline

All generated diagnostic telemetry code must route metrics through this decoupled data flow structure:
```text
Active Engine Subsystems (Raw Frame / Physics / Render Ticks)
    ↓
Raw Telemetry Registry (Populates 'performance.raw' states instantly)
    ↓
Performance Monitor Engine (Applies Exponential Moving Average 'smooth()' filters)
    ↓
Gated HUD Update Clock Timer (Throttled update ticks, e.g., every 250ms)
    ↓
Stabilized Display Telemetry Panel (Exposes 'performance.display' variables to UI)
```

---

# AI Code Generation Rules

### 1. Dual Interface Schema Separation
When creating metric tracking layers, always separate highly volatile raw signals from stabilized user configurations. Ensure your performance registries implement this exact object structural schema:
```ts
class PerformanceMonitor {
  public raw: Record<string, number> = {};
  public display: Record<string, number> = {};

  public smooth(current: number, target: number, factor: number = 0.05): number {
    return current + (target - current) * factor;
  }
}
```

### 2. Gated Temporal Interface Refreshing
* **No Per-Frame DOM Overwrites:** The engine must never overwrite layout text fields, DOM text nodes, or screen overlays every single frame loop.
* **Interval Gating Rule:** Telemetry presentation updates must be restricted to a throttled clock. Accumulate delta time variables and execute UI refreshes exactly 4 times per second (every **250ms** tracking interval).

### 3. Balanced Factor Constants
When applying the exponential filter algorithm, adhere strictly to these operational coefficients based on telemetry context:
* **`0.02` (Ultra-Filtered):** Use for heavily chaotic strings like network packet ping counts or memory footprint tracking.
* **`0.05` (Balanced Standard):** Use for standard engine readouts like frame rate outputs (`fps`).
* **`0.08` to `0.10` (High-Responsiveness Debugging):** Use for tracking core computational frame metrics (`frameTime`, `renderTime`, `physicsTime`).

### 4. Splitting Stability and Peak Traps
* Display layouts must split smooth streaming data strings away from peak execution warnings.
* Keep long-duration telemetry spikes (such as a 40ms garbage collection trace or a shader loading pause) out of the main rolling average filter. Route these instead to a dedicated **Spike Warning Cache** that triggers a temporary screen warning while keeping the baseline FPS line stable.

---

# Telemetry Optimization Checklist
When checking or generating engine profiling code, verify that operations are free from these high-overhead anti-patterns:
1. **No Hot-Loop Allocations:** Banish the generation of new tracking objects or data arrays inside active subsystem loops.
2. **String Formatting Constraints:** Restrict expensive string truncation operations (such as `.toFixed(1)`) so they only run inside the throttled 250ms interface refresh block rather than on every raw loop step.
3. **No Layout Thrashing:** Ensure that telemetry overlay mutations do not trigger costly browser rendering calculations during performance-critical stages of the core loop.
