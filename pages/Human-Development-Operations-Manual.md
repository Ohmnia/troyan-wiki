**Most solo game projects fail because the developer:**

knows **WHAT** they want
but not:
**HOW** to systematically execute it.

You need:

1) operational clarity
2) execution discipline
3) repeatable workflows
4) human task procedures
4) quality standards

**You essentially need:**

``“Senior Studio Development Operating Procedures.”``

**Especially because:**

-- AI can generate code
-- AI can scaffold systems
-- AI can explain concepts

BUT:

1) humans still direct quality
2) humans make design decisions
3) humans validate gameplay
4) humans maintain scope discipline
5) humans decide priorities

That is the real bottleneck.

**What you are asking for is essentially:**

A Human Development Operations Manual

And honestly?
That is an ** EXTREMELY** smart move.

**Because once this exists:**

1) you reduce decision fatigue
2) you reduce scope drift
3) you maintain production consistency
4) you improve AI task delegation quality

**You stop ``“randomly building things.``”**

Instead:
you begin operating like a real studio.

Below is the beginning of what should become your:

RTS Development Operations Handbook
Solo Studio Production Manual
AI-Assisted Development SOP

# Troyan (3226 AD)

# Human Development Operations Manual

# Solo RTS Studio Production Handbook

---

# PURPOSE OF THIS DOCUMENT

This document explains:

* how to execute development tasks correctly
* what humans must verify manually
* how to work effectively with AI assistance
* how professional RTS development pipelines function
* how to avoid common solo developer failure patterns

This is NOT:

* a coding tutorial
* a beginner programming course

This IS:

* production methodology
* execution doctrine
* workflow structure
* development operations

---

# CORE DEVELOPMENT PHILOSOPHY

The human developer is responsible for:

```text
vision
quality control
game feel
scope control
art direction
prioritization
design decisions
playtesting
system validation
```

AI is responsible for assisting with:

* implementation
* scaffolding
* iteration
* debugging
* boilerplate
* optimization suggestions
* code generation

---

# MOST IMPORTANT RULE

# DO NOT BUILD RANDOMLY

Every feature must answer:

```text
What gameplay problem does this solve?
```

If you cannot answer clearly:
DO NOT BUILD IT.

---

# DEVELOPMENT LOOP

Professional game development operates like this:

```text
Plan
Build
Test
Evaluate
Refine
Repeat
```

NOT:

```text
Build endlessly without validation
```

---

# HUMAN TASK RESPONSIBILITIES

Humans must ALWAYS verify:

| Area                      | Human Responsibility |
| ------------------------- | -------------------- |
| Gameplay feel             | REQUIRED             |
| Camera readability        | REQUIRED             |
| Combat clarity            | REQUIRED             |
| Visual cohesion           | REQUIRED             |
| Scope control             | REQUIRED             |
| AI-generated code quality | REQUIRED             |
| Performance testing       | REQUIRED             |
| UX decisions              | REQUIRED             |

---

# SECTION 1

# PROJECT INITIALIZATION

---

## GOAL

Create:

* stable foundation
* maintainable structure
* scalable project organization

---

# HUMAN TASKS

## TASK INIT-001

# Create Repository Structure

---

# WHY THIS MATTERS

Bad structure creates:

* chaos
* duplicated systems
* missing assets
* technical debt

Professional projects survive through:

* organization

---

# STEP-BY-STEP

## STEP 1

Create project root folder.

Example:

```text
Troyan-3226/
```

---

## STEP 2

Inside root folder create:

```text
/src
/assets
/docs
/public
/tools
```

---

## STEP 3

Inside `/src` create:

```text
/core
/rendering
/terrain
/units
/buildings
/systems
/ui
/audio
/shaders
/materials
/utils
```

---

# HUMAN VALIDATION CHECKLIST

Before continuing verify:

[ ] Folder structure is clean

[ ] Naming is consistent

[ ] No duplicate folders exist

[ ] Systems logically separated

---

# COMMON MISTAKES

## BAD

```text
/randomStuff
/newFolder2
/testFinalReal
```

This destroys maintainability.

---

# PROFESSIONAL RULE

Structure projects as if:

* 20 people will work on them later

Even if solo.

---

# SECTION 2

# CAMERA DEVELOPMENT

---

# WHY CAMERA IS CRITICAL

In RTS games:

* the camera IS the player experience

Bad camera:

* destroys readability
* destroys tactical awareness
* destroys game feel

---

# HUMAN RESPONSIBILITY

You must manually validate:

* comfort
* readability
* clarity
* movement feel

AI cannot judge this properly.

---

## TASK CAM-001

# RTS Camera Validation

---

# STEP-BY-STEP

## STEP 1

Start with fixed isometric angle.

DO NOT:

* add free rotation
* add cinematic movement
* add camera shake

Early RTS cameras should remain:

* stable
* readable
* predictable

---

## STEP 2

Test zoom levels.

Verify:

* units readable
* buildings identifiable
* terrain not cluttered

---

## STEP 3

Test camera movement speed.

Bad:

* floaty
* sluggish
* hyper fast

Good:

* responsive
* smooth
* controllable

---

## STEP 4

Test battlefield visibility.

Questions:

```text
Can you instantly understand:
- combat locations?
- unit groups?
- terrain?
- resources?
```

If not:
camera needs refinement.

---

# COMMON CAMERA FAILURE

Most beginners create:

* cinematic cameras

instead of:

* strategy cameras

RTS cameras prioritize:

* information
  NOT:
* drama

---

# SECTION 3

# TERRAIN CREATION

---

# TERRAIN PHILOSOPHY

RTS terrain exists to:

* support gameplay
* support readability
* support navigation

NOT:

* become visual spectacle

---

# HUMAN RESPONSIBILITY

You must manually judge:

* visual noise
* readability
* navigation clarity
* faction contrast

AI cannot reliably judge this.

---

## TASK TERR-001

# Neutral Battlefield Design

---

# STEP-BY-STEP

## STEP 1

Create flat terrain first.

Reason:
Flat terrain reveals gameplay problems faster.

DO NOT start with:

* mountains
* cliffs
* procedural terrain

---

## STEP 2

Apply SIMPLE terrain material.

Recommended:

* dark basalt
* ash gray
* muted volcanic tones

Avoid:

* high contrast
* busy textures
* strong saturation

---

## STEP 3

Place ONLY a few props.

Examples:

* rocks
* debris
* ruined pipes
* craters

Goal:
test readability.

---

## STEP 4

Spawn units.

Now verify:

* unit visibility
* silhouette separation
* combat readability

THIS is the real terrain test.

---

# IMPORTANT RULE

Terrain should visually support:

* units

NOT compete with them.

---

# COMMON TERRAIN FAILURE

Most beginners create:

* beautiful screenshots

that become:

* unreadable gameplay

---

# SECTION 4

# UNIT DESIGN VALIDATION

---

# RTS UNIT RULE

Units must read clearly from:

* far camera distance

NOT:

* close-up inspection

---

## TASK UNIT-001

# Unit Readability Test

---

# STEP-BY-STEP

## STEP 1

Create primitive placeholder units.

Use:

* cubes
* capsules
* simple geometry

DO NOT begin with detailed models.

---

## STEP 2

Assign faction colors.

Example:

* EYA = white/cyan
* Ugroo = green/purple

---

## STEP 3

Test visibility on terrain.

Questions:

```text
Can you instantly identify:
- faction?
- unit direction?
- movement?
- combat state?
```

---

## STEP 4

Spawn MANY units.

Single-unit readability means nothing.

RTS readability only matters:

* at scale

---

# PROFESSIONAL RULE

A good RTS unit is readable:

* in motion
* in combat
* at distance
* in groups

---

# SECTION 5

# COMBAT FEEL

---

# COMBAT IS MOSTLY FEEDBACK

Not realism.

---

# HUMAN RESPONSIBILITY

You must judge:

* impact feel
* timing
* readability
* satisfaction

AI cannot feel combat.

---

## TASK COMBAT-001

# Combat Feel Validation

---

# STEP-BY-STEP

## STEP 1

Test attack timing.

Combat should feel:

* responsive
* intentional
* readable

---

## STEP 2

Add visual feedback.

Examples:

* flashes
* hit sparks
* recoil
* impact FX

---

## STEP 3

Add audio feedback.

Sound massively improves:

* perceived responsiveness

---

## STEP 4

Test combat readability at scale.

Can you understand:

* who is winning?
* where damage occurs?
* which units are firing?

If not:
combat clarity is failing.

---

# COMMON COMBAT FAILURE

Overusing:

* particles
* explosions
* screen shake
* effects spam

This destroys tactical readability.

---

# SECTION 6

# PERFORMANCE VALIDATION

---

# PERFORMANCE IS A DESIGN CONSTRAINT

NOT:

* something fixed later

---

# HUMAN RESPONSIBILITY

You must profile performance regularly.

---

## TASK PERF-001

# Performance Testing Procedure

---

# STEP-BY-STEP

## STEP 1

Measure FPS constantly.

Do NOT guess.

Use:

* browser profiler
* stats.js
* Chrome dev tools

---

## STEP 2

Stress test regularly.

Spawn:

* more units
* more effects
* more buildings

Find limits EARLY.

---

## STEP 3

Monitor frame spikes.

Stable frame pacing matters more than:

* maximum FPS

---

## STEP 4

Track CPU bottlenecks.

RTS games are usually:

* CPU limited

NOT GPU limited.

---

# PROFESSIONAL RULE

Optimization is continuous.

NOT:

* final-stage panic.

---

# SECTION 7

# WORKING WITH AI

---

# AI DEVELOPMENT RULES

AI is:

* assistant
  NOT:
* autonomous architect

---

# GOOD AI TASKS

Examples:

```text
Write pathfinding scaffolding
Create selection system
Generate shader baseline
Optimize terrain batching
```

---

# BAD AI TASKS

Examples:

```text
Design the entire game
Create all architecture automatically
Make final gameplay decisions
```

---

# HUMAN RESPONSIBILITY

You must:

* validate
* simplify
* refactor
* reject bad complexity

---

# IMPORTANT AI RULE

Never paste massive unreviewed AI code into production.

Review:

* architecture
* memory allocations
* update loops
* object creation
* performance risks

---

# SECTION 8

# SCOPE CONTROL

---

# MOST SOLO RTS PROJECTS DIE HERE

---

# SCOPE EXPANSION WARNING SIGNS

```text
"just one more feature"
"maybe procedural planets"
"maybe multiplayer"
"maybe full physics destruction"
```

These kill projects.

---

# PROFESSIONAL RULE

Finish:

* current systems
  BEFORE:
* adding new systems

---

# THE VERTICAL SLICE RULE

A vertical slice means:

```text
one polished small experience
```

NOT:

* giant unfinished framework

---

# SECTION 9

# PLAYTESTING

---

# PLAYTESTING IS MANDATORY

Never trust:

* theory alone

---

# HUMAN RESPONSIBILITY

Observe:

* confusion
* frustration
* readability failures
* pacing problems

---

## TASK TEST-001

# Playtest Procedure

---

# STEP-BY-STEP

## STEP 1

Watch players silently.

Do NOT explain mechanics immediately.

Observe:

* confusion points

---

## STEP 2

Record recurring problems.

If multiple players fail:

* system clarity is failing

---

## STEP 3

Identify friction.

Examples:

* bad selection
* unclear UI
* unreadable combat
* camera frustration

---

## STEP 4

Fix highest-impact issues FIRST.

---

# PROFESSIONAL RULE

Players are excellent at:

* finding problems

Players are terrible at:

* designing solutions

---

# FINAL DEVELOPMENT DOCTRINE

The best RTS games succeed because of:

```text
clarity
feedback
consistency
systemic depth
readability
performance
strong iteration
controlled scope
```

NOT:

* maximal complexity
* maximal realism
* maximal graphics

---

# FINAL RULE

Your job is NOT:

* to build everything

Your job is:

* to build the RIGHT things
* in the RIGHT order
* with the RIGHT level of complexity

That is how strategy games survive development.
