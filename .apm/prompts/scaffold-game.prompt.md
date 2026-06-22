---
description: Scaffold a runnable vanilla-TypeScript browser game with a clean state/update/render skeleton.
input:
  - game: "What to scaffold (e.g. 'Snake', 'Tic-Tac-Toe', or 'blank canvas loop')"
  - kind: "Optional: 'canvas' for real-time arcade, 'dom' for grid/turn-based (default: infer from the game)"
allowed-tools: [Read, Write, Edit, Grep, Glob, Bash]
---

# Scaffold: ${input:game}

Stand up a runnable **${input:game}** skeleton fast. Kind: ${input:kind} (infer if
unspecified: real-time motion ⇒ canvas; board/turn-based ⇒ dom).

1. **Base** — Start from `templates/vite-ts-game/` (copy it) when available; otherwise
   create `index.html` + `src/main.ts` + `src/style.css` with Vite + TypeScript. For a
   no-network fallback, a single `index.html` with a `<script type="module">` works.
2. **Skeleton** — Lay down the four files of the contract:
   - `state.ts` — the State interface + `initState()`.
   - `update.ts` — `update(state, input, dt)`; the rules (start minimal but real).
   - `render.ts` — `render(state)` to DOM (grid) or Canvas (arcade); no logic.
   - `input.ts` — events → a snapshot/queue update reads.
   Wire them in `main.ts`: event→update→render for turn-based, an rAF loop for arcade.
3. **Make it move** — Implement just enough that the core mechanic runs (a moving
   snake, a clickable board) — a visible, correct starting point to extend.
4. **Run** — Install deps if needed, start the dev server, and confirm it loads and
   the core mechanic works. Report the URL and what you verified.

Keep it minimal and idiomatic — every later feature should slot into state/update/
render without a rewrite.
