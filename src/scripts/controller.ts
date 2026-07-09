/**
 * Controlador central: liga o D-pad (toque + teclado + swipe) ao jogo/menu.
 *
 * Dois modos, como nos celulares antigos:
 *   - 'game': setas controlam a cobrinha; A (Enter/Espaço) reinicia/começa.
 *   - 'menu': ↑↓ navegam as opções; A abre; B/MENU volta. (usado no MVP 2)
 *
 * O controlador só despacha eventos de botão; quem decide o que fazer é o
 * consumidor, via `onButton(button, mode)`.
 */

export type ControllerMode = 'game' | 'menu';
export type Button = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'menu';

export interface ControllerOptions {
  onButton: (button: Button, mode: ControllerMode) => void;
  initialMode?: ControllerMode;
  /** Elemento onde o swipe é detectado (a telinha). */
  swipeTarget?: HTMLElement | null;
}

export interface Controller {
  readonly mode: ControllerMode;
  setMode(mode: ControllerMode): void;
  destroy(): void;
}

const KEY_MAP: Record<string, Button> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  Enter: 'a',
  ' ': 'a',
  Escape: 'b',
  m: 'menu',
};

const SWIPE_THRESHOLD = 20;

export function initController(options: ControllerOptions): Controller {
  let mode: ControllerMode = options.initialMode ?? 'game';
  const { onButton, swipeTarget } = options;

  function onKey(e: KeyboardEvent): void {
    const btn = KEY_MAP[e.key];
    if (!btn) return;
    e.preventDefault();
    onButton(btn, mode);
  }
  window.addEventListener('keydown', onKey);

  // D-pad / botões de toque (qualquer elemento com data-btn).
  const bound: Array<[HTMLElement, (e: Event) => void]> = [];
  document.querySelectorAll<HTMLElement>('[data-btn]').forEach((el) => {
    const btn = el.dataset.btn as Button;
    const handler = (e: Event) => {
      e.preventDefault();
      onButton(btn, mode);
    };
    el.addEventListener('pointerdown', handler);
    bound.push([el, handler]);
  });

  // Swipe na telinha (mobile).
  let sx = 0;
  let sy = 0;
  function onTouchStart(e: TouchEvent): void {
    const t = e.changedTouches[0];
    sx = t.clientX;
    sy = t.clientY;
  }
  function onTouchEnd(e: TouchEvent): void {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      onButton('a', mode); // toque simples = A
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) onButton(dx > 0 ? 'right' : 'left', mode);
    else onButton(dy > 0 ? 'down' : 'up', mode);
  }
  if (swipeTarget) {
    swipeTarget.addEventListener('touchstart', onTouchStart, { passive: true });
    swipeTarget.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  return {
    get mode() {
      return mode;
    },
    setMode(m: ControllerMode) {
      mode = m;
    },
    destroy() {
      window.removeEventListener('keydown', onKey);
      bound.forEach(([el, h]) => el.removeEventListener('pointerdown', h));
      if (swipeTarget) {
        swipeTarget.removeEventListener('touchstart', onTouchStart);
        swipeTarget.removeEventListener('touchend', onTouchEnd);
      }
    },
  };
}
