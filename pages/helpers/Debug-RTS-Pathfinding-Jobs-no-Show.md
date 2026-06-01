# RTS Pathfinding Jobs Showing 0 While Units Still Move

# The Problem

Units are successfully moving when selected and relocated, but:

```txt id="mjlwmv"
Pathfinding Jobs = 0
```

remains at zero permanently.

This is an extremely common RTS engine architecture issue.

The important detail is:

```txt id="q7lq2r"
Movement working does NOT necessarily mean pathfinding is working.
```

Movement and pathfinding are separate systems.

---

# Understanding The Difference

## Movement System

The movement system handles:

* Velocity
* Steering
* Separation
* Position updates
* Rotation
* Interpolation

Example:

```js id="4wqarf"
unit.position += velocity * deltaTime;
```

This system physically moves units.

---

## Pathfinding System

The pathfinding system handles:

* A*
* NavMesh searches
* Flowfields
* Route generation
* Async worker jobs
* Obstacle avoidance paths

Example:

```js id="xofl1d"
pathfinding.requestPath(start, end);
```

This system calculates HOW the unit should move.

---

# Common RTS Architecture Flow

Correct RTS pathfinding flow should look like this:

```txt id="4ptn3l"
Mouse Click
    ↓
Movement Command
    ↓
Pathfinding Job Created
    ↓
Job Queue
    ↓
Path Solver
    ↓
Path Returned
    ↓
Unit Follows Path
```

If units move before path jobs exist:

```txt id="jlwmv4"
Pathfinding Jobs will always remain 0
```

---

# Most Likely Causes

# 1. Units Are Moving Directly Without Pathfinding

This is the MOST common issue.

Example:

```js id="jlwmv5"
unit.targetPosition = clickPosition;
```

Then:

```js id="9m1v5m"
unit.position += direction * speed;
```

This causes units to move directly toward the target.

No pathfinding job is ever created.

---

# 2. Direct-Line Optimization Is Skipping Pathfinding

Many RTS engines intentionally skip pathfinding if:

* terrain is open
* no obstacles exist
* target is directly reachable

Example logic:

```js id="jlwmv6"
if (hasDirectLine(start, target)) {
    moveDirectly();
}
else {
    createPathJob();
}
```

This is GOOD optimization.

There is no reason to run expensive A* searches when the path is obvious.

---

# Why This Is Likely Happening

From the screenshot:

* very open terrain
* almost no obstacles
* only a few units
* small map
* short movement distances

The engine may correctly decide:

```txt id="jlwmv7"
No pathfinding required.
```

---

# Important Test

Add:

* walls
* rocks
* chokepoints
* blocked terrain
* obstacles

Then order units around them.

If:

```txt id="h1kk8g"
Pathfinding Jobs > 0
```

appears, the system is working correctly.

---

# 3. Jobs Complete Too Fast To Display

This is another VERY common issue.

Your HUD probably displays:

```txt id="qq4epm"
Currently Active Jobs
```

But with:

* only 5 units
* tiny terrain
* lightweight pathfinding

jobs may complete instantly.

Example:

```txt id="8n4c8f"
Job Created
    ↓
Solved Same Frame
    ↓
Removed From Queue
```

By the time the HUD updates:

```txt id="jlwmv8"
Queue already empty
```

So the HUD always shows:

```txt id="jlwmv9"
0
```

even though jobs ARE being created.

---

# This Is Probably The Real Issue

Based on the screenshot, this is the MOST likely explanation.

The engine is probably:

```txt id="fdw2mk"
Creating and solving path jobs within a single frame.
```

---

# How To Verify

Inside your actual pathfinding job creation code:

```js id="jlwmwa"
function createPathJob(...) {

    console.log("Path job created");

    stats.totalPathJobs++;
}
```

If console logs appear while units move:

```txt id="jlwmwb"
Pathfinding IS working.
```

The HUD metric is simply misleading.

---

# Better RTS Debug Metrics

Instead of only displaying:

```txt id="qmlc7n"
Current Active Jobs
```

track these metrics:

---

# Total Jobs Created

```js id="dy5tyc"
stats.totalPathJobs++;
```

HUD:

```txt id="l0vcr9"
Total Path Jobs: 523
```

This is MUCH more useful.

---

# Jobs Per Second

```js id="d7kzmh"
stats.jobsPerSecond
```

Shows workload intensity.

---

# Average Solve Time

```js id="6ig1m0"
stats.averagePathSolveTime
```

Very important for optimization.

---

# Longest Solve Time

```js id="0t6zyw"
stats.longestPathSolveTime
```

Helps detect spikes.

---

# Queue Size

```js id="vjlwmc"
pathQueue.length
```

Shows whether jobs are backing up.

---

# Recommended RTS Debug HUD

```txt id="y3ahuj"
FPS: 60
Frame: 16.6ms
Render: 5.2ms

Path Jobs Active: 0
Path Jobs Total: 1452
Jobs/sec: 8
Avg Solve: 0.21ms
Longest Solve: 2.1ms
```

This is FAR more useful than only showing active jobs.

---

# Another Important RTS Optimization

Professional RTS games often use:

```txt id="jlwmwd"
Flowfields
```

instead of individual A* searches.

Meaning:

```txt id="jlwmwe"
1 path job
→ shared by 50 units
```

So low job counts are often intentional.

---

# Recommended Debug Checklist

# Verify Job Creation

Search for:

```js id="jlwmwf"
requestPath(...)
```

OR:

```js id="jlwmwg"
createPathJob(...)
```

OR:

```js id="jlwmwh"
pathQueue.push(...)
```

Ensure these are actually called when units move.

---

# Verify Queue Updates

Check whether:

```js id="jlwmwi"
pathfindingJobs++
```

is ever incremented.

---

# Verify HUD Timing

Your HUD may update too slowly or too late.

Jobs may already be finished before the HUD reads the queue.

---

# Verify Direct-Line Optimization

Check for logic like:

```js id="jlwmwj"
if (directPathAvailable)
```

which bypasses pathfinding entirely.

---

# Final Most Likely Explanation Ranking

## MOST LIKELY

```txt id="jlwmwk"
Jobs are created and solved too quickly to display.
```

---

## SECOND MOST LIKELY

```txt id="jlwmwl"
Direct-line optimization bypasses pathfinding.
```

---

## THIRD MOST LIKELY

```txt id="jlwmwm"
Movement system bypasses pathfinding entirely.
```

---

# Best Immediate Fix

Add this inside the actual job creation function:

```js id="jlwmwn"
stats.totalPathJobs++;
```

Then display:

```txt id="jlwmwo"
Total Path Jobs
```

instead of only:

```txt id="jlwmwp"
Current Active Jobs
```

This will immediately confirm whether the pathfinding system is truly running.
