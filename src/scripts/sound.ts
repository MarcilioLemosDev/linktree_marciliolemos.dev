/**
 * Efeitos sonoros retrô via Web Audio API (bips gerados, sem arquivos).
 * Respeita um toggle liga/desliga persistido em localStorage.
 */

const STORAGE_KEY = 'ml.sound.enabled';

let ctx: AudioContext | null = null;
let enabled = true;

export function initSound(): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  enabled = saved === null ? true : saved === 'true';
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function toggleSound(): boolean {
  enabled = !enabled;
  localStorage.setItem(STORAGE_KEY, String(enabled));
  return enabled;
}

/** Toca um bip curto. Lazily cria o AudioContext no primeiro gesto do usuário. */
export function beep(freq = 440, durationMs = 60): void {
  if (!enabled) return;
  ctx ??= new AudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square'; // onda quadrada = timbre 8-bit
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(ctx.destination);

  const now = ctx.currentTime;
  osc.start(now);
  osc.stop(now + durationMs / 1000);
}

// Presets de eventos do jogo/menu.
export const sfx = {
  move: () => beep(220, 40),
  eat: () => beep(660, 70),
  select: () => beep(880, 90),
  gameOver: () => beep(110, 300),
  locked: () => beep(160, 120),
};
