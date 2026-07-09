/**
 * Snake clássico (estilo Nokia) renderizado em <canvas>.
 *
 * Esqueleto da fase 1: define tipos, estado e a superfície pública que o
 * controlador vai usar. O game loop completo (colisão, comida, score) entra
 * na fase de implementação do jogo.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface SnakeOptions {
  canvas: HTMLCanvasElement;
  /** Quantidade de células por lado do tabuleiro. */
  grid?: number;
  /** Callback ao comer comida (para tocar som / somar score). */
  onEat?: (score: number) => void;
  /** Callback ao perder. */
  onGameOver?: (score: number) => void;
}

export interface SnakeGame {
  start(): void;
  pause(): void;
  reset(): void;
  setDirection(dir: Direction): void;
  destroy(): void;
}

export function createSnake(_options: SnakeOptions): SnakeGame {
  // TODO(fase-jogo): implementar game loop com requestAnimationFrame,
  // grid, colisão com parede/corpo, comida aleatória e high score.
  return {
    start() {},
    pause() {},
    reset() {},
    setDirection(_dir: Direction) {},
    destroy() {},
  };
}
