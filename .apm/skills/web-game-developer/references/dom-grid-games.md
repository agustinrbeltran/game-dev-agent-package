# DOM / grid / turn-based games

Tic-Tac-Toe, Connect Four, Gomoku, 2048, Minesweeper, Wordle, memory/match, sliding
puzzles. These are **state machines, not loops**: an input produces a new board, you
re-render, you check for win/draw. Render to the DOM (CSS Grid) — it's less code than
canvas and gives you accessible, clickable cells for free.

## Board model

Use a flat array (`index = row * cols + col`) or a 2D array — flat is simpler to copy
and compare. Keep cells as plain data.

```ts
type Player = "X" | "O";
type Cell = Player | null;
interface State {
  board: Cell[];          // rows*cols
  rows: number; cols: number;
  turn: Player;
  status: "playing" | "won" | "draw";
  winner: Player | null;
}
const idx = (r: number, c: number, cols: number) => r * cols + c;
```

## Render a grid to the DOM

Set up the grid container once; on each render, reconcile cell text/classes. For
small boards, rebuilding innerHTML is fine; for larger/animated boards, update
existing nodes.

```css
#board { display: grid; grid-template-columns: repeat(var(--cols), 64px); gap: 4px; }
.cell { width: 64px; height: 64px; display: grid; place-items: center;
        font-size: 32px; background: #1e293b; cursor: pointer; }
.cell.win { background: #16a34a; }
```

```ts
const boardEl = document.querySelector<HTMLDivElement>("#board")!;
boardEl.style.setProperty("--cols", String(state.cols));

function render(s: State) {
  boardEl.replaceChildren(...s.board.map((cell, i) => {
    const el = document.createElement("div");
    el.className = "cell";
    el.textContent = cell ?? "";
    el.dataset.i = String(i);
    return el;
  }));
  status.textContent = s.status === "won" ? `${s.winner} wins!`
    : s.status === "draw" ? "Draw" : `${s.turn} to move`;
}
```

## Input: event delegation

One listener on the container, read `dataset.i`. Survives re-renders, no per-cell
wiring.

```ts
boardEl.addEventListener("click", (e) => {
  const cell = (e.target as HTMLElement).closest<HTMLElement>(".cell");
  if (!cell) return;
  state = move(state, Number(cell.dataset.i));
  render(state);
});
```

## Win detection

### Lines (Tic-Tac-Toe): precomputed index triples
```ts
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winner = (b: Cell[]) =>
  LINES.find(([a,c,d]) => b[a] && b[a] === b[c] && b[a] === b[d])?.map(i => b[i])[0] ?? null;
```

### N-in-a-row (Connect Four, Gomoku): scan 4 directions from the last move
Only check from the cell that just changed — O(1) per move.

```ts
const DIRS = [[0,1],[1,0],[1,1],[1,-1]]; // →, ↓, ↘, ↙
function wins(b: Cell[], rows: number, cols: number, r: number, c: number, need: number): boolean {
  const p = b[idx(r,c,cols)];
  if (!p) return false;
  return DIRS.some(([dr, dc]) => {
    let count = 1;
    for (const sign of [1, -1]) {
      let nr = r + dr*sign, nc = c + dc*sign;
      while (nr>=0 && nr<rows && nc>=0 && nc<cols && b[idx(nr,nc,cols)] === p) {
        count++; nr += dr*sign; nc += dc*sign;
      }
    }
    return count >= need;
  });
}
```

Connect Four drop: find the lowest empty row in the clicked column.
```ts
function drop(b: Cell[], rows: number, cols: number, col: number): number {
  for (let r = rows - 1; r >= 0; r--) if (!b[idx(r,col,cols)]) return r;
  return -1; // column full
}
```

## 2048: slide + merge a single line, then rotate the board

Collapse one row left; reuse it for all directions by rotating the grid so the move
is always "left", then rotating back.

```ts
function slideLeft(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((n) => n !== 0);
  let gained = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) { nums[i] *= 2; gained += nums[i]; nums.splice(i + 1, 1); }
  }
  while (nums.length < row.length) nums.push(0);
  return { row: nums, gained };
}
```
Spawn a new 2 (90%) or 4 (10%) in a random empty cell after any move that changed
the board; game over when no move changes anything.

## Minesweeper: flood-fill reveal

Adjacency count per cell; revealing a 0 cascades to neighbors (BFS/DFS).

```ts
function reveal(s: State, start: number) {
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    if (s.revealed[i] || s.flagged[i]) continue;
    s.revealed[i] = true;
    if (s.adjacent[i] === 0) stack.push(...neighbors(i, s.rows, s.cols));
  }
}
```
Generate mines *after* the first click (exclude that cell) so the first move is never
a loss.

## Wordle: score a guess (handle duplicate letters)

Two passes: greens first, then mark remaining letters as present from a tally so a
letter isn't counted twice.

```ts
type Mark = "correct" | "present" | "absent";
function score(guess: string, answer: string): Mark[] {
  const res: Mark[] = Array(guess.length).fill("absent");
  const counts: Record<string, number> = {};
  for (const ch of answer) counts[ch] = (counts[ch] ?? 0) + 1;
  for (let i = 0; i < guess.length; i++)
    if (guess[i] === answer[i]) { res[i] = "correct"; counts[guess[i]]--; }
  for (let i = 0; i < guess.length; i++)
    if (res[i] === "absent" && counts[guess[i]] > 0) { res[i] = "present"; counts[guess[i]]--; }
  return res;
}
```

## Principles
- **Immutability** makes undo, AI lookahead, and "did this move change anything?"
  trivial — copy the board, apply, compare.
- **Detect end state after every move**, set `status`, and **ignore further input**
  until restart.
- **Re-render from state** — never reach into the DOM to flip one cell by hand; you'll
  desync the model and the view.
