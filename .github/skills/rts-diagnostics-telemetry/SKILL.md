---
name: rts-diagnostics-telemetry
description: Use this skill when implementing, refactoring, or optimizing telemetry dashboards, engine profilers, subsystem performance timers, FPS trackers, frame budgeting trackers, pathfinding job counters, or diagnostic HUD interfaces.
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
    - pathfinding
    - hud
---

# RTS Diagnostics, Smoothing & Telemetry Skill

## Language Scope

All code examples in this skill are TypeScript/browser-context references. When generating code for other languages (C++, C#, GDScript), preserve all architectural rules (dual schema, EMA coefficients, 250ms gating) but adapt syntax and DOM-specific rules to the appropriate platform equivalent (e.g., replace DOM writes with ImGui calls or in-engine debug label updates).

## Core Philosophy
The interface layer must never read raw engine diagnostic timings or transient snapshot states directly. Real-time telemetry signals inherently contain background operating system scheduling noise, and fast queues resolve too quickly for human display tracking. Isolate raw platform tracking from display pipelines using exponential filters, cumulative counters, and gated temporal intervals to maintain readable, accurate diagnostics.

---

# Architecture & Telemetry Pipeline

All generated diagnostic telemetry code must route metrics through this decoupled data flow structure:
```text
Active Subsystems (Raw Frame Ticks / Path Requests / Physics Updates)
    ↓
Raw Telemetry Registry (Populates 'performance.raw' and triggers 'totalJobs' counters)
    ↓
Performance Monitor Engine (Applies Exponential Moving Average 'smooth()' filters)
    ↓
Gated HUD Update Clock Timer (Throttled update ticks, exactly every 250ms)
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

  public smooth(current: number, target: number, factor: number): number {
    factor = Math.max(0.0, Math.min(1.0, factor)); // clamp to [0,1]
    return current + (target - current) * factor;
  }
}
```
Generated call sites must only pass factor values from the approved coefficient list in Rule 4. Never rely on a default factor value — always pass the correct coefficient explicitly.

### 2. Cumulative Navigation Tracking Standard
Never display pathfinding workloads solely using an instantaneous active queue snapshot count (which constantly reads 0 when jobs resolve mid-frame). Always capture historical workloads alongside queue lengths:
```ts
interface RTSPathTelemetry {
  activeJobs: number;          // Current frame queue length
  totalJobsCreated: number;    // Monotonically increasing counter (Incremented inside createPathJob)
  jobsPerSecond: number;       // Solves calculated inside the current rolling 1-second window
  avgSolveTimeMs: number;      // Exponential moving average of solver cycles
}
```
When a subsystem produces no new raw ticks for a full 1-second window, set its `jobsPerSecond` to 0 and freeze `avgSolveTimeMs` at its last known value rather than continuing to apply the EMA with a zero input.

### 3. UI Write Policy
* All UI writes — baseline metrics AND spike warnings — must occur only inside the 250ms gated refresh block.
* `.toFixed()` and all string formatting run exclusively in that block.
* Spike warning state is written to a flag variable during the hot loop and rendered during the next gate tick.
* **No Per-Frame DOM Overwrites:** The engine must never overwrite layout text fields, DOM text nodes, or canvas overlays every single frame loop.
* **Interval Gating Rule:** Telemetry presentation updates must be restricted to a throttled clock. Accumulate delta time variables and execute UI refreshes exactly 4 times per second (every **250ms** tracking interval).

### 4. Balanced Factor Constants
When applying the exponential filter algorithm, adhere strictly to these operational coefficients based on telemetry context:
* **`0.02` (Ultra-Filtered):** Use for heavily chaotic data streams like network packet ping counts or memory footprint tracking.
* **`0.05` (Balanced Standard):** Use for standard engine readouts like frame rate outputs (`fps`).
* **`0.08` to `0.10` (High-Responsiveness Debugging):** Use for tracking core computational frame metrics (`frameTime`, `renderTime`, `physicsTime`).

### 5. Splitting Stability and Peak Traps
* Display layouts must split smooth streaming data strings away from peak execution warnings.
* A spike is defined as any single-frame value exceeding 2× the current rolling average OR any value above an absolute threshold of 33ms for frame-time metrics. Values meeting either condition must be routed to the Spike Warning Cache and excluded from the EMA filter input.
* Keep long-duration telemetry spikes (such as a 40ms garbage collection trace or a shader loading pause) out of the main rolling average filter. Route these instead to a dedicated **Spike Warning Cache**.
* Display the spike warning for a fixed duration of 2000ms after the spike is detected, then clear it automatically.

---

# Telemetry Optimization Checklist
When checking or generating engine profiling code, verify that operations are free from these high-overhead anti-patterns:
1. **No Hot-Loop Allocations:** Banish the generation of new tracking objects or data arrays inside active subsystem loops.
2. **String Formatting Constraints:** Restrict expensive string truncation operations (such as `.toFixed(1)`) so they only run inside the throttled 250ms interface refresh block rather than on every raw loop step.
3. **No Layout Thrashing:** Ensure that telemetry overlay mutations do not trigger costly browser rendering calculations during performance-critical stages of the core loop.
