/**
 * Controlador: teclado + D-pad de toque + swipe.
 *
 * - `onPress(button)`: dispara a cada toque (discreto) — usado para virar a
 *   cobrinha, navegar menus e selecionar.
 * - `held`: conjunto de botões mantidos pressionados — usado para movimento
 *   contínuo (a nave do Space Impact). Só teclado e D-pad alimentam o `held`
 *   (têm evento de "soltar" confiável); swipe/toque contam só como discreto.
 */

import type { Button } from './types';

export interface ControllerOptions {
  onPress: (button: Button) => void;
  /** Elemento onde o swipe/toque é detectado (a telinha). */
  swipeTarget?: HTMLElement | null;
}

export interface Controller {
  readonly held: Set<Button>;
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
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
  Enter: 'a',
  ' ': 'a',
  Escape: 'b',
};

const SWIPE_THRESHOLD = 20;

export function initController(opts: ControllerOptions): Controller {
  const held = new Set<Button>();
  const { onPress, swipeTarget } = opts;
  const bound: Array<[EventTarget, string, EventListener]> = [];
  const bind = (el: EventTarget, type: string, h: EventListener) => {
    el.addEventListener(type, h);
    bound.push([el, type, h]);
  };

  // Teclado
  const onKeyDown = (e: Event) => {
    const ke = e as KeyboardEvent;
    const b = KEY_MAP[ke.key];
    if (!b) return;
    ke.preventDefault();
    if (ke.repeat) return; // ignora auto-repeat
    held.add(b);
    onPress(b);
  };
  const onKeyUp = (e: Event) => {
    const b = KEY_MAP[(e as KeyboardEvent).key];
    if (b) held.delete(b);
  };
  bind(window, 'keydown', onKeyDown);
  bind(window, 'keyup', onKeyUp);

  // D-pad de toque (qualquer elemento com data-btn)
  document.querySelectorAll<HTMLElement>('[data-btn]').forEach((el) => {
    const b = el.dataset.btn as Button;
    bind(el, 'pointerdown', (e) => {
      e.preventDefault();
      held.add(b);
      onPress(b);
    });
    const release = () => held.delete(b);
    bind(el, 'pointerup', release);
    bind(el, 'pointercancel', release);
    bind(el, 'pointerleave', release);
  });

  // Swipe / toque na telinha (só discreto)
  let sx = 0;
  let sy = 0;
  if (swipeTarget) {
    bind(swipeTarget, 'touchstart', (e) => {
      const t = (e as TouchEvent).changedTouches[0];
      sx = t.clientX;
      sy = t.clientY;
    });
    bind(swipeTarget, 'touchend', (e) => {
      const t = (e as TouchEvent).changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
        onPress('a');
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) onPress(dx > 0 ? 'right' : 'left');
      else onPress(dy > 0 ? 'down' : 'up');
    });
  }

  // Evita botão "preso" ao trocar de aba/janela.
  const clearHeld = () => held.clear();
  bind(window, 'blur', clearHeld);

  return {
    held,
    destroy() {
      bound.forEach(([el, type, h]) => el.removeEventListener(type, h));
    },
  };
}
