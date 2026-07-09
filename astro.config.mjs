// @ts-check
import { defineConfig } from 'astro/config';

// Site é uma landing page única e estática (linktree retrô).
// https://astro.build/config
export default defineConfig({
  site: 'https://marciliolemos.dev',
  // Sem framework de UI: HTML/CSS + JS/TS vanilla, zero JS desnecessário no cliente.
  compressHTML: true,
});
