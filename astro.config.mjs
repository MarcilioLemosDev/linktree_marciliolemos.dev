// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site estático para deploy na Vercel (preview por branch, produção na main).
// `site` gera canonical + sitemap. Domínio de produção: marciliolemos.dev
export default defineConfig({
  site: 'https://marciliolemos.dev',
  output: 'static',
  integrations: [sitemap({ i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } } })],
  // Duas línguas com tradução real: pt em / e en em /en/. Sem fallback, porque
  // cada página tem o próprio texto (src/dados/textos.ts).
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // CSS sempre em arquivo externo (same-origin), para a CSP usar
    // style-src 'self' sem 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Nada de asset/script embutido no HTML: mantém todo JS em arquivo
      // externo same-origin, então a CSP não precisa de hash por script.
      assetsInlineLimit: 0,
    },
  },
});
