/**
 * City Bloxx (estilo Nokia) — empilhar blocos.
 *
 * Uma grua leva o bloco de um lado ao outro no topo. Ao soltar (qualquer
 * botão / toque), o bloco cai sobre a pilha: a parte que passa do bloco de
 * baixo é cortada e o bloco fica mais estreito. Errar totalmente = fim de jogo.
 * Quanto mais alto, mais rápido. Score = altura da torre.
 */

import type { Game, GameContext } from './types';
import { readColors } from './colors';

interface Block {
  x: number;
  w: number;
}

export function createCityBloxx(ctx: GameContext): Game {
  const { canvas, cell, onScore, onGameOver } = ctx;
  const c = canvas.getContext('2d')!;
  const W = canvas.width;
  const H = canvas.height;

  let COLORS = readColors(canvas);
  const BH = cell; // altura do bloco
  const targetTopY = Math.round(H * 0.28); // onde o bloco ativo fica na tela

  let stack: Block[] = [];
  let cur: Block = { x: 0, w: 0 };
  let dir = 1;
  let speed = 0.06; // px/ms
  let score = 0;
  let over = false;
  let running = false;
  let raf = 0;
  let last = 0;

  function spawn(): void {
    const top = stack[stack.length - 1];
    speed = Math.min(0.18, 0.06 + score * 0.004);
    dir = 1;
    cur = { x: 0, w: top.w };
  }

  function resetState(): void {
    const w0 = cell * 6;
    stack = [{ x: (W - w0) / 2, w: w0 }];
    score = 0;
    over = false;
    COLORS = readColors(canvas);
    spawn();
    onScore(0);
  }

  function cameraOffset(): number {
    const naturalCurTop = H - (stack.length + 1) * BH;
    return Math.max(0, targetTopY - naturalCurTop);
  }

  function drop(): void {
    if (!running || over) return;
    const top = stack[stack.length - 1];
    const l = Math.max(cur.x, top.x);
    const r = Math.min(cur.x + cur.w, top.x + top.w);
    const overlap = r - l;
    if (overlap <= 0) return gameOver();
    stack.push({ x: l, w: overlap });
    score += 1;
    onScore(score);
    spawn();
  }

  function update(dt: number): void {
    cur.x += speed * dir * dt;
    if (cur.x <= 0) {
      cur.x = 0;
      dir = 1;
    } else if (cur.x + cur.w >= W) {
      cur.x = W - cur.w;
      dir = -1;
    }
  }

  function drawBlock(x: number, y: number, w: number, i: number): void {
    c.fillStyle = i % 2 === 0 ? COLORS.ink : COLORS.food;
    c.fillRect(x, y, w, BH - 1);
  }

  function draw(): void {
    c.fillStyle = COLORS.bg;
    c.fillRect(0, 0, W, H);

    const off = cameraOffset();
    for (let i = 0; i < stack.length; i++) {
      const y = H - (i + 1) * BH + off;
      if (y > H) continue;
      drawBlock(stack[i].x, y, stack[i].w, i);
    }

    // Cabo da grua + bloco ativo
    const cy = H - (stack.length + 1) * BH + off;
    c.fillStyle = COLORS.ink;
    c.fillRect(cur.x + cur.w / 2 - 1, 0, 2, cy);
    drawBlock(cur.x, cy, cur.w, stack.length);
  }

  function frame(ts: number): void {
    if (!running) return;
    if (!last) last = ts;
    let dt = ts - last;
    last = ts;
    if (dt > 50) dt = 50;
    update(dt);
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
      // Qualquer botão / toque solta o bloco.
      drop();
    },
  };
}
