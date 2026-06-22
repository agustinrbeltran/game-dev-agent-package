// Events -> a snapshot the game logic reads. Game rules never live in handlers.

const pressed = new Set<string>();
const queue: string[] = []; // discrete presses since the last snapshot

addEventListener("keydown", (e) => {
  // stop arrows/space from scrolling the page
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
  if (!e.repeat) queue.push(e.key); // one entry per physical press
  pressed.add(e.key);
});
addEventListener("keyup", (e) => pressed.delete(e.key));

export interface Input {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  /** keys pressed since the last snapshot — use for one-shot actions (rotate, drop, restart) */
  presses: string[];
}

export function snapshot(): Input {
  const presses = queue.splice(0); // drain so each press is consumed once
  return {
    up: pressed.has("ArrowUp") || pressed.has("w"),
    down: pressed.has("ArrowDown") || pressed.has("s"),
    left: pressed.has("ArrowLeft") || pressed.has("a"),
    right: pressed.has("ArrowRight") || pressed.has("d"),
    presses,
  };
}
