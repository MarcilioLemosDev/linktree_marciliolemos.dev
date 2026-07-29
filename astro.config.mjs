// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site estático para deploy na Vercel (preview por branch, produção na main).
// `site` gera canonical + sitemap. Domínio de produção: marciliolemos.dev
// (a atribuição do domínio + DNS na Vercel é feita no painel).
export default defineConfig({
  site: 'https://marciliolemos.dev',
  output: 'static',
  integrations: [sitemap()],
  build: {
    // CSS sempre em arquivo externo (same-origin), para a CSP usar
    // style-src 'self' sem 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Nada de asset/script embutido no HTML: mantém todo JS em arquivo
      // externo same-origin, então a CSP não precisa de hash por script
      // (que quebraria a cada edição de componente).
      assetsInlineLimit: 0,
    },
  },
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
    // /en/ e /fr/ servem o conteúdo pt-BR até a tradução real chegar
    // (rodada futura); o rewrite mantém a URL do idioma escolhido.
    fallback: {
      en: 'pt',
      fr: 'pt',
    },
  },
});
