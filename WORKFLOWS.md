# `.apm` Workflows

A map of the `.apm` package. The folder is one cohesive unit — the
**`web-game-developer` skill/agent** — and the four `prompts/` files are the entry
points (workflows) that sit on top of it. The shared foundation is described once,
then each workflow with the files it pulls in.

> APM primitives at a glance: **skills** hold reference knowledge, an **agent** is the
> role/persona, **instructions** are always-on path-scoped guardrails (the old "rules"),
> and **prompts** are the runnable entry points (the old "commands"). On the Claude
> target, prompts surface as slash commands (`/scaffold-game`, …).

---

## Shared foundation (auto-engages for every workflow)

These aren't started directly — they activate automatically when a game task is
detected, and every prompt-driven workflow builds on them.

- **`.apm/skills/web-game-developer/SKILL.md`** — The core skill. Defines the "ship
  small browser games fast in vanilla TS" operating loop, the **State → Update →
  Render → Input** architecture, the non-negotiables, and key code patterns
  (fixed-timestep loop, immutable board update, AABB collision). Contains the
  *reference guide table* that routes to the five reference files below.
  - **`references/game-loop-and-input.md`** — Real-time loop mechanics:
    `requestAnimationFrame` vs `setInterval`, variable vs fixed timestep, grid-stepped
    ticks (Snake/Tetris), pause/resume, and input capture (held-key Sets,
    discrete-press queues, pointer/touch).
  - **`references/dom-grid-games.md`** — Turn-based/grid games as state machines:
    board models, CSS-Grid rendering, event delegation, and win-detection per genre
    (Tic-Tac-Toe lines, Connect Four/Gomoku scans, 2048 slide+merge, Minesweeper
    flood-fill, Wordle scoring).
  - **`references/canvas-arcade-games.md`** — Real-time canvas games: retina/DPR setup,
    clear-and-redraw rendering, entity integration, wall handling (clamp/wrap/bounce),
    AABB & circle collision, grid-on-canvas (Snake/Tetris), spawning, and WebAudio
    beeps.
  - **`references/architecture-and-feature-flow.md`** — How to keep features cheap to
    add: the State/Update/Render/Input contract, a feature-drop table (where
    Score/Pause/Undo/AI/etc. land), seeded-RNG determinism, and lightweight unit
    testing.
  - **`references/interview-playbook.md`** — The meta-doc tying everything together:
    timeboxing a 25–30 min live challenge, the DOM-vs-Canvas decision table, the
    per-feature loop, an English talk-track, and a *prompt index* listing all four
    workflows below.
- **`.apm/agents/web-game-developer.agent.md`** — Agent definition (the "senior web
  game developer" role, pinned to `claude-opus-4-8`, with Read/Write/Edit/Grep/Glob/Bash).
  Restates the operating loop and architecture as the agent's "operating contract" and
  explicitly layers on top of the skill.
- **`.apm/instructions/web-game-performance.instructions.md`** — Path-scoped Instructions
  (auto-applied via `applyTo:` to `**/*.ts,**/*.tsx,**/*.js,**/*.jsx`). Enforces the
  architecture, real-time-loop discipline, grid/turn-based discipline, end-state
  correctness, and "run before marking done" on any game source file you touch.

---

## Workflow 1 — Scaffold a game

Entry point: **`.apm/prompts/scaffold-game.prompt.md`** — Stands up a runnable
vanilla-TS skeleton. Inputs: `game`, `kind`. Steps: pick base (bundled `vite-ts-game`
starter → `npm create vite` → zero-build fallback), lay down the four contract files
(`state/update/render/input`), make the core mechanic move, then run and report.

- Leans most on **`references/architecture-and-feature-flow.md`** (the
  State/Update/Render/Input contract it scaffolds) and **`SKILL.md`** (skeleton
  patterns + the same starter-location instructions).
- Closes by handing off to the **run** behavior to confirm it loads.

## Workflow 2 — Implement a feature

Entry point: **`.apm/prompts/implement-game-feature.prompt.md`** — Adds ONE feature
additively. Inputs: `feature`, `notes`. Steps: orient (find state/update/render/input,
run it), locate the single seam, make the additive change, verify by running, report in
2–3 lines. Explicitly "work as the Web Game Developer role."

- Drives the **agent** (`.apm/agents/web-game-developer.agent.md`) and **`SKILL.md`**
  operating loop.
- Uses the feature-drop tables in **`references/architecture-and-feature-flow.md`** and
  **`references/interview-playbook.md`** to find the seam.
- Genre patterns come from **`references/dom-grid-games.md`** or
  **`references/canvas-arcade-games.md`** depending on the game;
  **`.apm/instructions/web-game-performance.instructions.md`** guards the edit.
- Ends by invoking the **run-and-verify** step.

## Workflow 3 — Run & verify

Entry point: **`.apm/prompts/run-and-verify.prompt.md`** — Launches the dev server and
drives the game in a real browser via Playwright. Input: `check`. Steps: start server
(background) → open + snapshot → drive (keys/clicks) → inspect console → report
pass/fail per behavior, pointing at the likely layer on failure.

- The verification stage that Workflows 1, 2, and 4 all call into.
- Embodies the "Verify by running" sections of
  **`references/architecture-and-feature-flow.md`** and
  **`references/interview-playbook.md`**, and the "run before done" rule in
  **`.apm/instructions/web-game-performance.instructions.md`**.

## Workflow 4 — Web performance audit

Entry point: **`.apm/prompts/web-performance-audit.prompt.md`** — Finds and fixes jank
to hold ~16 ms/frame (60 FPS). Input: `target`. Steps: measure
(DevTools/`performance.now()`) → find culprits (`setInterval`, no-`dt` motion, layout
thrash, canvas allocations, unbounded arrays) → apply targeted fixes → re-measure and
report issue → impact → fix.

- Backed by the real-time-loop sections of **`references/game-loop-and-input.md`** and
  **`references/canvas-arcade-games.md`**.
- Enforces the loop discipline codified in
  **`.apm/instructions/web-game-performance.instructions.md`**; re-verifies through the
  **run-and-verify** workflow.

---

## How they chain

`interview-playbook.md` is the conductor — it documents all four prompts as the
live-interview loop (*scaffold → implement-feature → run-and-verify*, with
*performance-audit* only if a real-time game gets janky). Notice the dependency
arrows: **scaffold**, **implement-feature**, and **performance-audit** all terminate
in **run-and-verify**, which is the shared "prove it works in the browser" step.

> **Note:** the prompts reference a `templates/vite-ts-game/` starter that lives
> outside `.apm` — at the repo root, or vendored into
> `apm_modules/<author>/game-dev-agent-package/templates/` when this package is
> installed as a dependency — so it's not part of the `.apm` folder but is a real
> dependency of Workflow 1.
