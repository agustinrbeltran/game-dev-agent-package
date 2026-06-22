---
description: Start the dev server and verify the game in a real browser with Playwright.
input:
  - check: "Optional: what to verify (e.g. 'arrow keys move the snake and score increments'). Default: load + core mechanic."
allowed-tools: [Read, Bash, Grep, Glob]
---

# Run & verify

Launch the game and confirm it actually works in the browser. Check: ${input:check}

1. **Start** — Run the dev server in the background (e.g. `npm run dev`, or
   `python3 -m http.server` for a no-build project). Find the served URL/port; wait
   until it responds.
2. **Open** — Use the Playwright browser tools to navigate to the URL. Take a snapshot
   to confirm the page and canvas/board rendered (no blank screen, no console errors).
3. **Drive** — Exercise the game the way a player would: press keys (arrows, space,
   enter) or click cells, then re-snapshot/screenshot to see the effect. Verify the
   specific behavior in ${input:check}, plus that prior features still work.
4. **Inspect** — Check the browser console for errors/warnings; report any.
5. **Report** — State what you did, what you observed (with a screenshot if useful),
   and a clear pass/fail per checked behavior. If it failed, point at the likely
   layer (state/update/render/input).

Keep the server running in the background so you can re-verify after the next change.
