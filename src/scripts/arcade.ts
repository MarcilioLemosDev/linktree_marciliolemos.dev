/**
 * Console arcade: máquina de estados que gerencia as telas (PRESS START →
 * escolha do jogo → jogando → game over) e delega o gameplay ao jogo ativo.
 */

import type { Button, Game, GameContext, GameFactory } from './types';
import { readColors } from './colors';
import { createSnake } from './snake';
import { createSpace } from './space';
import { createCityBloxx } from './citybloxx';

type State = 'start' | 'choose' | 'playing' | 'over';

interface ArcadeOptions {
  canvas: HTMLCanvasElement;
  scoreEl: HTMLElement | null;
  hiEl: HTMLElement | null;
  getHeld: () => Set<Button>;
}

interface GameEntry {
  name: string;
  factory: GameFactory;
  hiKey: string;
}

const GAMES: GameEntry[] = [
  { name: 'SNAKE', factory: createSnake, hiKey: 'ml.snake.hi' },
  { name: 'SPACE IMPACT', factory: createSpace, hiKey: 'ml.space.hi' },
  { name: 'CITY BLOXX', factory: createCityBloxx, hiKey: 'ml.city.hi' },
];

export interface Arcade {
  press(button: Button): void;
  destroy(): void;
}

export function createArcade(opts: ArcadeOptions): Arcade {
  const { canvas, scoreEl, hiEl, getHeld } = opts;
  const c = canvas.getContext('2d')!;
  const W = canvas.width;
  const H = canvas.height;
  const cell = W / 16;
  const COLORS = readColors(canvas);

  let state: State = 'start';
  let game: Game | null = null;
  let sel = 0;
  let blinkOn = true;
  let blinkRaf = 0;
  let blinkLast = 0;

  const pad = (n: number) => String(n).padStart(4, '0');
  const showScore = (n: number) => {
    if (scoreEl) scoreEl.textContent = pad(n);
  };
  const loadHi = (key: string) => Number(localStorage.getItem(key) || 0);
  const showHi = (v: number) => {
    if (hiEl) hiEl.textContent = `HI ${pad(v)}`;
  };

  // ---- desenho das telas ----
  function clearBg(): void {
    c.fillStyle = COLORS.bg;
    c.fillRect(0, 0, W, H);
  }

  function text(lines: string[], size: number, cy: number): void {
    c.fillStyle = COLORS.ink;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `${Math.floor(size)}px 'Press Start 2P', monospace`;
    const lineH = size * 1.5;
    const startY = cy - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => c.fillText(line, W / 2, startY + i * lineH));
  }

  function drawOverlay(): void {
    clearBg();
    if (state === 'start') {
      if (blinkOn) text(['PRESS', 'START'], cell * 1.0, H / 2);
    } else if (state === 'choose') {
      text(['ESCOLHA'], cell * 0.7, H * 0.16);
      GAMES.forEach((g, i) => {
        const prefix = i === sel ? '> ' : '  ';
        text([prefix + g.name], cell * 0.68, H * 0.42 + i * cell * 2.4);
      });
      if (blinkOn) text(['TOQUE P/ JOGAR'], cell * 0.45, H * 0.86);
    } else if (state === 'over') {
      text(['GAME', 'OVER'], cell * 1.0, H * 0.36);
      if (blinkOn) text(['PRESS START'], cell * 0.55, H * 0.72);
    }
  }

  function overlayLoop(ts: number): void {
    if (state === 'playing') return;
    if (!blinkLast) blinkLast = ts;
    if (ts - blinkLast >= 500) {
      blinkLast = ts;
      blinkOn = !blinkOn;
    }
    drawOverlay();
    blinkRaf = requestAnimationFrame(overlayLoop);
  }

  function startOverlay(): void {
    cancelAnimationFrame(blinkRaf);
    blinkOn = true;
    blinkLast = 0;
    blinkRaf = requestAnimationFrame(overlayLoop);
  }

  function stopOverlay(): void {
    cancelAnimationFrame(blinkRaf);
  }

  // ---- contexto para os jogos ----
  function makeCtx(hiKey: string): GameContext {
    return {
      canvas,
      cell,
      getHeld,
      onScore: showScore,
      onGameOver: (n: number) => handleGameOver(n, hiKey),
    };
  }

  function handleGameOver(n: number, hiKey: string): void {
    if (n > loadHi(hiKey)) {
      localStorage.setItem(hiKey, String(n));
      showHi(n);
    }
    state = 'over';
    startOverlay();
  }

  // ---- transições ----
  function enterChoose(): void {
    if (game) {
      game.destroy();
      game = null;
    }
    state = 'choose';
    showScore(0);
    showHi(loadHi(GAMES[sel].hiKey));
    startOverlay();
  }

  function startGame(i: number): void {
    stopOverlay();
    sel = i;
    state = 'playing';
    showScore(0);
    showHi(loadHi(GAMES[i].hiKey));
    game = GAMES[i].factory(makeCtx(GAMES[i].hiKey));
    game.start();
  }

  function press(button: Button): void {
    switch (state) {
      case 'start':
        enterChoose();
        break;
      case 'choose':
        if (button === 'up' || button === 'left') {
          sel = (sel - 1 + GAMES.length) % GAMES.length;
          showHi(loadHi(GAMES[sel].hiKey));
        } else if (button === 'down' || button === 'right') {
          sel = (sel + 1) % GAMES.length;
          showHi(loadHi(GAMES[sel].hiKey));
        } else if (button === 'a') {
          startGame(sel);
        }
        break;
      case 'playing':
        game?.press(button);
        break;
      case 'over':
        enterChoose();
        break;
    }
  }

  // ---- init ----
  showScore(0);
  showHi(loadHi(GAMES[0].hiKey));
  startOverlay();

  return {
    press,
    destroy() {
      stopOverlay();
      game?.destroy();
    },
  };
}
