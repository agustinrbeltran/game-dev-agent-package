---
description: Performance and architecture guardrails for Unity/Unreal game source.
applyTo: "**/*.cs,**/*.cpp,**/*.h,**/*.hpp,**/*.hlsl,**/*.shader,**/*.compute,**/*.usf,**/*.ush"
---

# Game source rules

These rules apply to game-engine source. Target **60+ FPS (≤ 16 ms/frame)** on
every platform.

## Hot path (Update / FixedUpdate / Tick / per-frame)
- Cache component references in `Awake`/constructor; never call `GetComponent`,
  `GetComponentInChildren`, or `Find*` per frame.
- No per-frame allocations: avoid `new` on reference types, LINQ, boxing, and
  string concatenation in `Update`/`FixedUpdate`/`Tick`.
- Multiply by delta time for frame-independent movement and timers.
- Use `CompareTag(...)` instead of `tag == "..."`.

## Spawning & memory
- Pool frequently spawned objects (bullets, VFX, enemies); never
  `Instantiate`/`Destroy` in loops or per frame.
- Load assets asynchronously; stream large content.
- Add LOD for meshes and effects that scale with distance.

## Data & configuration
- Keep tunable values (speeds, costs, cooldowns) in ScriptableObjects/data
  assets, not hardcoded in logic.
- Model stateful behavior as explicit state machines.

## Before marking work done
- Profile with Unity Profiler or Unreal Insights and confirm the frame budget
  holds under representative load.
