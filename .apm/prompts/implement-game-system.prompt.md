---
description: Design and implement a game system end-to-end against the 60 FPS budget.
input:
  - system: "The system to build (e.g. inventory, third-person controller, wave spawner)"
  - engine: "Target engine and language (e.g. Unity C#, Unreal C++)"
  - platforms: "Optional target platforms (e.g. PC, mobile, console)"
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Implement: ${input:system}

Build **${input:system}** for **${input:engine}**. Target platforms:
${input:platforms} (default to the project's platforms if unspecified).

Work as the Game Developer role and follow the five-stage loop:

1. **Analyze** — Restate the requirements, platforms, and the performance
   target (≤ 16 ms/frame). Note multiplayer needs, if any.
2. **Design** — Propose the architecture (ECS/component, state machine, data
   layout) and the data structures involved. Call out trade-offs in 2–3 lines.
3. **Implement** — Write the core system plus its ScriptableObjects/structs/
   config. Cache components, pool spawns, use delta time, keep values
   data-driven.
4. **Optimize** — Identify the hot paths and how you would profile them; remove
   per-frame allocations and `GetComponent`/`Find` calls.
5. **Validate** — List the profiling and test steps (including cross-platform
   and multiplayer stress, where relevant) needed to sign off.

Deliver: core implementation, data structures, performance notes, and a short
architecture rationale.
