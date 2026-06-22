---
description: Profile a game scene/system and bring it back within the 60 FPS frame budget.
input:
  - target: "What to audit (scene, system, or file/area)"
  - engine: "Target engine (e.g. Unity, Unreal)"
allowed-tools: [Read, Grep, Glob, Bash, Edit]
---

# Performance audit: ${input:target}

Audit **${input:target}** in **${input:engine}** and bring it within
**≤ 16 ms/frame (60 FPS)**.

1. **Measure** — Describe how to profile (Unity Profiler / Unreal Insights):
   capture CPU, GPU, and memory; identify the dominant frame-time cost.
2. **Find** — Scan for the usual culprits: `GetComponent`/`Find` in `Update`,
   per-frame allocations/LINQ/boxing, `Instantiate`/`Destroy` in loops, string
   tag compares, missing pooling/LOD, and synchronous asset loads.
3. **Fix** — Apply targeted changes (cache refs, pool, async-load, LOD, move
   values to data) without changing behavior.
4. **Verify** — State the before/after metrics to compare and confirm the
   budget holds under representative load.

Report findings as: issue → impact → fix, ordered by frame-time cost.
