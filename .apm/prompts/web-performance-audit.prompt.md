---
description: Find and fix jank in a browser game so the render loop holds 60 FPS.
input:
  - target: "What to audit (the game, a scene/screen, or a file/area)"
allowed-tools: [Read, Grep, Glob, Bash, Edit]
---

# Web game performance audit: ${input:target}

Audit **${input:target}** and keep the real-time loop smooth (**~16 ms/frame, 60 FPS**).
Most interview-scale games are already fast — focus on real jank, not micro-tuning.

1. **Measure** — Use the browser DevTools Performance panel (or `performance.now()`
   timing around update/render) to find the dominant cost: is it logic, layout, or
   paint? Watch for dropped frames and long tasks.
2. **Find** — Scan for the usual culprits:
   - `setInterval`/`setTimeout` driving animation instead of `requestAnimationFrame`.
   - Motion not scaled by `dt` (speed varies by display refresh rate).
   - Layout thrash: reading layout (`offsetWidth`, `getBoundingClientRect`) and writing
     styles in the same loop; rebuilding large DOM subtrees every frame.
   - Canvas: per-frame allocations in the hot loop, redundant state changes, drawing
     off-screen entities, missing devicePixelRatio handling.
   - Unbounded arrays (dead entities never filtered out).
3. **Fix** — Apply targeted changes without altering behavior: rAF + fixed timestep,
   batch DOM writes / re-render from state, hoist allocations out of the loop, cull
   off-screen draws, clamp `dt`.
4. **Verify** — Re-measure; confirm steady 60 FPS under representative play. Report
   before/after.

Report findings as: issue → impact → fix, ordered by frame-time cost.
