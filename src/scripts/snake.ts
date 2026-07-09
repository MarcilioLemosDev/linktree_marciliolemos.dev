/**
 * Snake clássico (estilo Nokia) — implementa a interface Game.
 * Só cuida do gameplay e do desenho do tabuleiro; as telas de PRESS START /
 * escolha / GAME OVER são responsabilidade do console (arcade.ts).
 */

import type { Button, Game, GameContext } from './types';
import { readColors } from './colors';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Cell {
  x: number;
  y: number;
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const DELTA: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

const DIRS: Button[] = ['up', 'down', 'left', 'right'];

export function createSnake(ctx: GameContext): Game {
  const { canvas, cell, onScore, onGameOver } = ctx;
  const c = canvas.getContext('2d')!;
  const grid = Math.round(canvas.width / cell);

  let COLORS = readColors(canvas);
  let snake: Cell[] = [];
  let dir: Direction = 'right';
  let queued: Direction[] = [];
  let food: Cell = { x: 0, y: 0 };
  let score = 0;
  let stepMs = 221;
  let running = false;
  let over = false;
  let raf = 0;
  let last = 0;

  function spawnFood(): void {
    let p: Cell;
    do {
      p = { x: randInt(grid), y: randInt(grid) };
    } while (snake.some((s) => s.x === p.x && s.y === p.y));
    food = p;
  }

  function resetState(): void {
    const mid = Math.floor(grid / 2);
    snake = [
      { x: mid + 1, y: mid },
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
    ];
    dir = 'right';
    queued = [];
    score = 0;
    stepMs = 221;
    over = false;
    COLORS = readColors(canvas);
    spawnFood();
    onScore(0);
  }

  function setDirection(next: Direction): void {
    const ref = queued.length ? queued[queued.length - 1] : dir;
    if (next === ref || next === OPPOSITE[ref]) return;
    queued.push(next);
  }

  function step(): void {
    if (queued.length) dir = queued.shift()!;

    const head = snake[0];
    const d = DELTA[dir];
    const nx = head.x + d.x;
    const ny = head.y + d.y;

    if (nx < 0 || ny < 0 || nx >= grid || ny >= grid) return gameOver();

    const ate = nx === food.x && ny === food.y;
    const body = ate ? snake : snake.slice(0, -1);
    if (body.some((s) => s.x === nx && s.y === ny)) return gameOver();

    snake.unshift({ x: nx, y: ny });
    if (ate) {
      score += 1;
      onScore(score);
      if (stepMs > 114) stepMs -= 3;
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function drawCell(cellPos: Cell): void {
    const pad = Math.max(1, cell * 0.08);
    c.fillRect(cellPos.x * cell + pad, cellPos.y * cell + pad, cell - pad * 2, cell - pad * 2);
  }

  function draw(): void {
    c.fillStyle = COLORS.bg;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = COLORS.food;
    drawCell(food);
    c.fillStyle = COLORS.ink;
    for (const s of snake) drawCell(s);
  }

  function frame(ts: number): void {
    if (!running) return;
    if (!last) last = ts;
    if (ts - last >= stepMs) {
      last = ts;
      step();
      if (over) return;
    }
    raf = requestAnimationFrame(frame);
  }

  function gameOver(): void {
    over = true;
    running = false;
    cancelAnimationFrame(raf);
    draw();
    onGameOver(score);
  }

  return {
    start() {
      resetState();
      draw();
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
    },
    press(button: Button) {
      if (DIRS.includes(button)) setDirection(button as Direction);
    },
  };
}
