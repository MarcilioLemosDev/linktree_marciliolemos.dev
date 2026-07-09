/**
 * Space Impact (estilo Nokia) — implementa a interface Game.
 *
 * A nave fica à esquerda e se move com o D-pad (movimento contínuo via `held`).
 * Tiro automático para a direita; inimigos surgem da direita indo para a
 * esquerda. Encostar num inimigo = game over. Coordenadas em pixels do canvas.
 */

import type { Button, Game, GameContext } from './types';
import { readColors } from './colors';

interface Rect {
  x: number;
  y: number;
}

interface Enemy extends Rect {
  s: number;
}

export function createSpace(ctx: GameContext): Game {
  const { canvas, cell, getHeld, onScore, onGameOver } = ctx;
  const c = canvas.getContext('2d')!;
  const W = canvas.width;
  const H = canvas.height;

  let COLORS = readColors(canvas);

  const shipW = cell * 1.7;
  const shipH = cell * 1.2;

  let shipX = cell;
  let shipY = H / 2 - shipH / 2;
  let bullets: Rect[] = [];
  let enemies: Enemy[] = [];
  let score = 0;
  let over = false;
  let running = false;
  let raf = 0;
  let last = 0;
  let fireCd = 0;
  let spawnCd = 600;
  let enemySpeed = 0.045;

  const SHIP_SPEED = 0.09; // px/ms
  const BULLET_SPEED = 0.3;
  const FIRE_INTERVAL = 300;

  function resetState(): void {
    shipX = cell;
    shipY = H / 2 - shipH / 2;
    bullets = [];
    enemies = [];
    score = 0;
    over = false;
    fireCd = 0;
    spawnCd = 600;
    enemySpeed = 0.045;
    COLORS = readColors(canvas);
    onScore(0);
  }

  function update(dt: number): void {
    const held = getHeld();
    if (held.has('up')) shipY -= SHIP_SPEED * dt;
    if (held.has('down')) shipY += SHIP_SPEED * dt;
    if (held.has('left')) shipX -= SHIP_SPEED * dt;
    if (held.has('right')) shipX += SHIP_SPEED * dt;
    shipY = Math.max(0, Math.min(H - shipH, shipY));
    shipX = Math.max(cell * 0.3, Math.min(W * 0.5, shipX));

    // Tiro automático
    fireCd -= dt;
    if (fireCd <= 0) {
      bullets.push({ x: shipX + shipW, y: shipY + shipH / 2 });
      fireCd = FIRE_INTERVAL;
    }
    for (const b of bullets) b.x += BULLET_SPEED * dt;
    bullets = bullets.filter((b) => b.x < W + cell);

    // Surgimento de inimigos (acelera com o score)
    spawnCd -= dt;
    if (spawnCd <= 0) {
      const s = cell * 0.9;
      enemies.push({ x: W + s, y: Math.random() * (H - s), s });
      spawnCd = Math.max(420, 900 - score * 12);
      enemySpeed = 0.045 + Math.min(0.05, score * 0.001);
    }
    for (const e of enemies) e.x -= enemySpeed * dt;
    enemies = enemies.filter((e) => e.x + e.s > 0);

    // Colisões
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      let hit = false;
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        if (b.x >= e.x && b.x <= e.x + e.s && b.y >= e.y && b.y <= e.y + e.s) {
          bullets.splice(j, 1);
          hit = true;
          break;
        }
      }
      if (hit) {
        enemies.splice(i, 1);
        score += 1;
        onScore(score);
        continue;
      }
      if (e.x < shipX + shipW && e.x + e.s > shipX && e.y < shipY + shipH && e.y + e.s > shipY) {
        return gameOver();
      }
    }
  }

  function draw(): void {
    c.fillStyle = COLORS.bg;
    c.fillRect(0, 0, W, H);

    // Nave (blocos apontando pra direita)
    c.fillStyle = COLORS.ink;
    c.fillRect(shipX, shipY + shipH * 0.32, shipW * 0.72, shipH * 0.36);
    c.fillRect(shipX + shipW * 0.62, shipY + shipH * 0.44, shipW * 0.38, shipH * 0.12);
    c.fillRect(shipX, shipY, shipW * 0.32, shipH);

    // Tiros
    for (const b of bullets) c.fillRect(b.x, b.y - cell * 0.08, cell * 0.5, cell * 0.16);

    // Inimigos
    c.fillStyle = COLORS.food;
    for (const e of enemies) {
      c.fillRect(e.x, e.y + e.s * 0.25, e.s, e.s * 0.5);
      c.fillRect(e.x + e.s * 0.2, e.y, e.s * 0.6, e.s);
    }
  }

  function frame(ts: number): void {
    if (!running) return;
    if (!last) last = ts;
    let dt = ts - last;
    last = ts;
    if (dt > 50) dt = 50; // clamp após aba inativa
    update(dt);
    if (over) return;
    draw();
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
    press() {
      // Movimento é contínuo (via held); nada a fazer no toque discreto.
    },
  };
}
