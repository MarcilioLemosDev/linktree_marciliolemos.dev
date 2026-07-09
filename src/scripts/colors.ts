import type { LcdColors } from './types';

/**
 * Lê a paleta LCD dos tokens CSS (--lcd-*), com fallback para o verde clássico.
 * Trocar a paleta em global.css muda telas e jogos de uma vez só.
 */
export function readColors(el: HTMLElement): LcdColors {
  const s = getComputedStyle(el);
  const get = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return {
    bg: get('--lcd-bg', '#9bbc0f'),
    food: get('--lcd-dark', '#306230'),
    ink: get('--lcd-ink', '#0f380f'),
  };
}
