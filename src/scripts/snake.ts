/**
 * Snake clássico (estilo Nokia) renderizado em <canvas>.
 *
 * - Grade fixa; a cobrinha anda uma célula por "tick".
 * - Bater na parede ou no próprio corpo = game over (como no Nokia 3310).
 * - A comida some/reaparece; cada uma acelera levemente o jogo.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface SnakeOptions {
  canvas: HTMLCanvasElement;
  /** Quantidade de células por lado do tabuleiro. */
  grid?: number;
  /** Chamado quando o score muda (para atualizar o HUD). */
  onScore?: (score: number) => void;
  /** Chamado ao comer comida (para som/efeitos). */
  onEat?: (score: number) => void;
  /** Chamado ao perder. */
  onGameOver?: (score: number) => void;
}

export interface SnakeGame {
  start(): void;
  pause(): void;
  reset(): void;
  setDirection(dir: Direction): void;
  readonly isRunning: boolean;
  readonly isOver: boolean;
  destroy(): void;
}

interface Cell {
  x: number;
  y: number;
}

// Paleta LCD lida dos tokens CSS (--lcd-*), com fallback para o verde clássico.
// Assim, trocar a paleta em global.css muda a tela e a cobrinha juntas.
function readColors(el: HTMLElement) {
  const s = getComputedStyle(el);
  const get = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    bg: get('--lcd-bg', '#9bbc0f'),
    food: get('--lcd-dark', '#306230'),
    ink: get('--lcd-ink', '#0f380f'),
  };
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

export function createSnake(options: SnakeOptions): SnakeGame {
  const { canvas, grid = 16, onScore, onEat, onGameOver } = options;
  const ctx = canvas.getContext('2d')!;
  const cell = canvas.width / grid;

  let COLORS = readColors(canvas);
  let snake: Cell[] = [];
  let dir: Direction = 'right';
  let queued: Direction[] = [];
  let food: Cell = { x: 0, y: 0 };
  let score = 0;
  let stepMs = 204;
  let running = false;
  let over = false;
  let raf = 0;
  let last = 0;

  // Pisca-pisca do texto quando parado / game over.
  let blinkOn = true;
  let blinkRaf = 0;
  let blinkLast = 0;

  function spawnFood(): void {
    let p: Cell;
    do {
      p = { x: randInt(grid), y: randInt(grid) };
    } while (snake.some((s) => s.x === p.x && s.y === p.y));
    food = p;
  }

  function reset(): void {
    const mid = Math.floor(grid / 2);
    snake = [
      { x: mid + 1, y: mid },
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
    ];
    dir = 'right';
    queued = [];
    score = 0;
    stepMs = 204;
    running = false;
    over = false;
    COLORS = readColors(canvas);
    cancelAnimationFrame(raf);
    spawnFood();
    onScore?.(0);
    draw();
    startBlink();
  }

  function setDirection(next: Direction): void {
    // Referência = última direção enfileirada, ou a atual.
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

    // Parede.
    if (nx < 0 || ny < 0 || nx >= grid || ny >= grid) return gameOver();

    const ate = nx === food.x && ny === food.y;
    // Se não vai crescer, a cauda sai da frente (colidir com ela é permitido).
    const body = ate ? snake : snake.slice(0, -1);
    if (body.some((s) => s.x === nx && s.y === ny)) return gameOver();

    snake.unshift({ x: nx, y: ny });
    if (ate) {
      score += 1;
      onScore?.(score);
      onEat?.(score);
      if (stepMs > 105) stepMs -= 3;
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function drawCell(c: Cell): void {
    const pad = Math.max(1, cell * 0.08);
    ctx.fillRect(c.x * cell + pad, c.y * cell + pad, cell - pad * 2, cell - pad * 2);
  }

  function draw(): void {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLORS.food;
    drawCell(food);

    ctx.fillStyle = COLORS.ink;
    for (const s of snake) drawCell(s);

    if (over) {
      dim();
      drawText(['GAME', 'OVER'], cell * 1.0, canvas.height * 0.36);
      if (blinkOn) drawText(['PRESS START'], cell * 0.6, canvas.height * 0.72);
    } else if (!running) {
      dim();
      if (blinkOn) drawText(['PRESS', 'START'], cell * 1.0, canvas.height / 2);
    }
  }

  function dim(): void {
    ctx.fillStyle = 'rgba(6, 48, 73, 0.72)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawText(lines: string[], size: number, cy: number): void {
    ctx.fillStyle = COLORS.bg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${Math.floor(size)}px 'Press Start 2P', monospace`;
    const lineH = size * 1.5;
    const startY = cy - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineH);
    });
  }

  function blinkLoop(ts: number): void {
    if (running) return;
    if (!blinkLast) blinkLast = ts;
    if (ts - blinkLast >= 500) {
      blinkLast = ts;
      blinkOn = !blinkOn;
      draw();
    }
    blinkRaf = requestAnimationFrame(blinkLoop);
  }

  function startBlink(): void {
    cancelAnimationFrame(blinkRaf);
    blinkOn = true;
    blinkLast = 0;
    blinkRaf = requestAnimationFrame(blinkLoop);
  }

  function stopBlink(): void {
    cancelAnimationFrame(blinkRaf);
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

  function start(): void {
    if (running) return;
    if (over) reset();
    stopBlink();
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function pause(): void {
    running = false;
    cancelAnimationFrame(raf);
    draw();
    startBlink();
  }

  function gameOver(): void {
    over = true;
    running = false;
    cancelAnimationFrame(raf);
    onGameOver?.(score);
    draw();
    startBlink();
  }

  function destroy(): void {
    running = false;
    cancelAnimationFrame(raf);
    stopBlink();
  }

  return {
    start,
    pause,
    reset,
    setDirection,
    get isRunning() {
      return running;
    },
    get isOver() {
      return over;
    },
    destroy,
  };
}
