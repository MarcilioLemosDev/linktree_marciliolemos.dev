/** Tipos compartilhados do "console" arcade. */

export type Button = 'up' | 'down' | 'left' | 'right' | 'a' | 'b';

export interface LcdColors {
  bg: string;
  food: string;
  ink: string;
}

/** Contexto que o console fornece a cada jogo. */
export interface GameContext {
  canvas: HTMLCanvasElement;
  /** Tamanho da célula base (canvas.width / 16). */
  cell: number;
  /** Botões atualmente pressionados (para movimento contínuo). */
  getHeld: () => Set<Button>;
  /** Atualiza o placar no HUD. */
  onScore: (score: number) => void;
  /** Sinaliza fim de jogo ao console. */
  onGameOver: (score: number) => void;
}

/** Interface comum a todos os jogos (Snake, Space Impact...). */
export interface Game {
  start(): void;
  destroy(): void;
  /** Botão pressionado (discreto) — usado para virar/selecionar. */
  press(button: Button): void;
}

export type GameFactory = (ctx: GameContext) => Game;
