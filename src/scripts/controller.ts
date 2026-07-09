/**
 * Controlador central: liga o D-pad (toque + teclado) ao jogo e ao menu.
 *
 * O mesmo D-pad tem dois modos, como nos celulares antigos:
 *   - 'game': setas controlam a cobrinha; A acelera; MENU abre a lista.
 *   - 'menu': ↑↓ navegam as opções; A abre o link selecionado; B/MENU volta.
 */

export type ControllerMode = 'game' | 'menu';
export type Button = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'menu';

export interface ControllerOptions {
  onButton: (button: Button, mode: ControllerMode) => void;
  initialMode?: ControllerMode;
}

export interface Controller {
  mode: ControllerMode;
  setMode(mode: ControllerMode): void;
  destroy(): void;
}

export function initController(_options: ControllerOptions): Controller {
  // TODO(fase-jogo): registrar listeners de teclado (setas/WASD/Enter),
  // toque nos botões do D-pad e swipe na tela; despachar para onButton.
  return {
    mode: _options.initialMode ?? 'game',
    setMode() {},
    destroy() {},
  };
}
