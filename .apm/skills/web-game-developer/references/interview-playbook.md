# Interview Playbook — AI Adoption (web game)

A 25–30 minute live challenge: you're handed a game (or scaffold one), and the
interviewer **releases features one at a time** while you talk through it in English.
Evaluated on how effectively you use your AI tools to ship correct features fast.

This package is the setup. The `web-game-developer` skill + agent auto-engage on game
work; the commands below remove the boilerplate.

---

## Before the interview (5 min, the day before)

- [ ] **Warm the npm cache** so an interview-time install is seconds, not minutes:
      `npm create vite@latest warmup -- --template vanilla-ts && cd warmup && npm install`.
      (Working in this repo? `cd templates/vite-ts-game && npm install` does the same.)
- [ ] Run `npm run dev` once; confirm a Vite + TS app loads at `localhost:5173`.
- [ ] Confirm the skill is active: in Claude Code, ask "what does the web-game-developer
      skill cover?" — it should reference the loop/grid/canvas/architecture guides.
- [ ] Skim the sibling references in this skill (game loop & input, DOM/grid, canvas/
      arcade, architecture & feature flow) so you recognize the patterns on sight.
- [ ] Have the Playwright MCP available (for `run-and-verify`), or be ready to verify
      by hand in the browser.

## First 60 seconds of the challenge

1. **Read or run what you're given.** If it's a repo: install, run it, see the current
   behavior. If it's "build X": pick the kind (below) and scaffold.
2. **Classify the game** — this picks your stack:

   | If the game is… | Use | Why |
   |---|---|---|
   | Board / turn-based (Tic-Tac-Toe, 2048, Minesweeper, Connect Four, Wordle) | **DOM + CSS Grid** | less code, clickable/accessible cells free |
   | Real-time motion (Snake, Pong, Breakout, Tetris, Flappy) | **Canvas + rAF loop** | one redraw per frame, pixel control |

3. **State the architecture out loud:** "I'll keep all state in one object, put rules
   in an `update` function, and render from state — so each feature you add lands in
   one place." This signals seniority and sets up every later feature.

## The loop per released feature

> Orient → locate the seam → additive change → **run & verify** → narrate.

- **Locate the seam:** does this feature change *state shape*, an *update rule*,
  *input*, or *render*? Touch only that. (See the feature-drop table below.)
- **Drive the AI tightly:** give it the feature + the constraint, let the skill/agent
  apply the pattern. Prefer `/implement-game-feature "<feature>" "<notes>"`.
- **Verify by running** — never say "done" before you've seen it. Use
  `/run-and-verify "<what to check>"` or reload and play. Confirm the new feature
  **and** that prior ones still work.
- **Narrate**: one line — what changed, which layer, how you verified.

## Commands in this package

| Command | Use it to |
|---|---|
| `/scaffold-game "<game>" "<canvas\|dom>"` | Stand up a runnable Vite + TS skeleton |
| `/implement-game-feature "<feature>" "<notes>"` | Add one feature, additively, then verify |
| `/run-and-verify "<what to check>"` | Start the dev server + drive it with Playwright |
| `/web-performance-audit "<target>"` | Only if a real-time game gets janky |

## Where common feature drops land (so you answer instantly)

| Feature | State | Update | Render | Input |
|---|---|---|---|---|
| Score | `+score` | increment on event | draw it | — |
| Restart / play again | — | `state = initState()` | — | key/button |
| Pause | `status` | early-return when paused | — | key |
| Win / lose / game over | `status`, `winner` | set on condition | overlay | freeze |
| Difficulty ramp / speed up | `tickInterval` | shrink over time | — | — |
| Levels / waves | `level` | advance on clear | — | — |
| High score (persist) | — | — | `localStorage` | — |
| Undo | history stack | push/pop | — | key |
| Two players (hotseat) | `turn` | alternate | — | — |
| AI opponent | — | call `chooseMove(state)` on AI turn | — | — |
| Timer / countdown | `timeLeft` | `-= dt`, lose at 0 | draw clock | — |

The tell: **most features = one field on State + one rule in update + one line in
render.** If a feature is forcing a rewrite, logic is in the wrong layer.

## English talk-track (keep the conversation flowing)

- Framing: *"Let me run it first so I understand the current behavior."*
- Designing: *"This is turn-based, so I'll model the board as one array and re-render
  from it — no game loop needed."*
- Implementing: *"This feature only touches the update rule — I'll add it there and
  leave the rest untouched."*
- Verifying: *"Let me reload and play it… score goes up, restart works, and the win
  case still triggers."*
- Trade-offs: *"I could refactor this, but with the clock running I'll make the
  additive change and keep it working."*
- Stuck: *"Let me check the console / add a log and confirm what the state looks like."*

## Under-pressure rules (don't break these)

- **Run before you claim done.** Every feature, every time.
- **One object of state**; render from it; rules in `update`, not in handlers.
- **Additive over refactor** while the clock runs.
- **`requestAnimationFrame` + `dt`**, never `setInterval`, for motion.
- **Detect end states** and freeze input until restart.
- Keep talking — a thinking-out-loud narration scores better than silent speed.

## No-network / build-broken escape hatch

If `npm`/network fails, go zero-build: one `index.html` with
`<script type="module" src="main.js">`, write plain JS (no compile), and serve with
`python3 -m http.server 5173`. Instant reload, nothing to install.
