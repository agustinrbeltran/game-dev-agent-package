# Game Developer — APM Package

A reusable **Game Developer role** for AI coding agents, built on
[APM](https://github.com/microsoft/apm). It turns your agent into a senior
Unity/Unreal engineer that designs performant architecture; implements
gameplay, physics, game AI, shaders, and networking; and holds work to a
**60+ FPS (≤ 16 ms/frame)** budget.

## What's inside

| Primitive | File | Purpose |
|-----------|------|---------|
| Agent | `.apm/agents/game-developer.agent.md` | The Game Developer role — persona, workflow, and guardrails. |
| Instructions | `.apm/instructions/game-performance.instructions.md` | Always-on performance rules bound to game source files. |
| Prompt | `.apm/prompts/implement-game-system.prompt.md` | Design and build a game system end-to-end. |
| Prompt | `.apm/prompts/performance-audit.prompt.md` | Profile and bring a scene/system back to budget. |

### Dependency

Builds on the
[`game-developer` skill](https://github.com/Jeffallan/claude-skills/blob/main/skills/game-developer/SKILL.md)
(Unity/Unreal patterns, ECS, performance, and networking references), declared
in `apm.yml`.

## Install

Add this package to another project's `apm.yml`:

```yaml
dependencies:
  apm:
    - <your-org>/game-dev-agent-package
```

Then run:

```bash
apm install   # resolve dependencies, including the game-developer skill
apm compile   # emit per-target files (.claude/, .github/, …)
```

To work in this repo directly, run the same two commands here.

## Targets

Compiles for **Claude** by default (see `targets:` in `apm.yml`). Add
`copilot`, `cursor`, `codex`, `gemini`, etc., or `all`.

## License

MIT
