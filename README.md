# Web Game Developer — APM Package

A reusable **Web Game Developer role** for AI coding agents, built on
[APM](https://github.com/danielmeppiel/apm). It turns your agent into a senior
web-game engineer who ships small browser games **fast** in vanilla **TypeScript** —
HTML5 Canvas for real-time arcade games and the DOM for grid/turn-based games — and
adds features one at a time without rewrites.

Purpose-built for **timed, feature-by-feature coding challenges** (e.g. live "AI
adoption" interviews): scaffold in seconds, keep all state in one object, land each
released feature in one place, and verify by running.

## What's inside

| Primitive | File | Purpose |
|-----------|------|---------|
| Skill | `.apm/skills/web-game-developer/` | Game-loop, DOM/grid, canvas/arcade, and state/update/render architecture references. |
| Agent | `.apm/agents/web-game-developer.agent.md` | The Web Game Developer role — persona, operating loop, and guardrails. |
| Instructions | `.apm/instructions/web-game-performance.instructions.md` | Always-on architecture + performance rules bound to web game source. |
| Prompt | `.apm/prompts/scaffold-game.prompt.md` | Stand up a runnable game skeleton. |
| Prompt | `.apm/prompts/implement-game-feature.prompt.md` | Add one feature, additively, then verify. |
| Prompt | `.apm/prompts/run-and-verify.prompt.md` | Start the dev server and verify in a real browser (Playwright). |
| Prompt | `.apm/prompts/web-performance-audit.prompt.md` | Find and fix render-loop jank (60 FPS). |
| Template | `templates/vite-ts-game/` | Vite + TypeScript starter with a clean state/update/render skeleton. |
| Playbook | `INTERVIEW_PLAYBOOK.md` | Timeboxing, the DOM-vs-Canvas decision, feature-drop map, and an English talk-track. |

The skill is **local** (`.apm/skills/web-game-developer/`) and picked up automatically
by `apm install` — no external or self-referential dependency.

## Quick start for an interview

```bash
# once, beforehand — warms the npm cache so install is instant on the day
cd templates/vite-ts-game && npm install && npm run dev   # http://localhost:5173
```

Then in Claude Code: `/scaffold-game`, `/implement-game-feature`, `/run-and-verify`.
Read `INTERVIEW_PLAYBOOK.md` first — it's the 30-minute game plan.

## Install into another project

Add this package to a project's `apm.yml`:

```yaml
dependencies:
  apm:
    - <your-org>/web-game-dev-agent-package
```

Then:

```bash
apm install   # resolve + deploy the skill, agent, commands, and rules
apm compile   # emit per-target files (.claude/, …)
```

To work in this repo directly, `apm install` regenerates `.claude/` from `.apm/` and
`skills/`. (`.claude/` and `apm_modules/` are generated and gitignored.)

## Targets

Compiles for **Claude** by default (see `targets:` in `apm.yml`). Add `copilot`,
`cursor`, `codex`, `gemini`, etc., or `all`.

## License

MIT
