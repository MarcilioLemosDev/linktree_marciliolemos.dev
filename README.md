# marciliolemos.dev

Site de **Marcílio Lemos** — Desenvolvedor de Software. Página única em Astro
estático, tema espacial com iconografia da NASA/ESA, apresentando os serviços
de TI e captando contato por um diagnóstico qualificado.

## Serviços apresentados

1. **Sites e landing pages** — institucional, landing de conversão, vitrine
2. **Aplicativos** — web, mobile e desktop (do MVP ao app publicado)
3. **Dados e BI** — dashboards, integração de fontes, automação de relatórios
4. **TI em geral** — automações, APIs, integrações, manutenção e sustentação

## Stack

- **Astro 7** (`output: 'static'`), `@astrojs/sitemap`
- **i18n**: `pt` (padrão), `en`, `fr` — `en`/`fr` servem o conteúdo pt-BR via
  fallback automático do Astro até a tradução real
- **GSAP ScrollTrigger** (véu do herói e entradas) + **Lenis** (scroll suave),
  num `<script>` central em `src/pages/index.astro`
- **Canvas próprio** para o céu estrelado com paralaxe
- Fontes via Fontsource (Space Grotesk Variable + IBM Plex Mono) — empacotadas
  no build, zero chamadas externas em runtime
- **@vercel/analytics** (Web Analytics)
- Zero dependências de UI; design system em `src/styles/global.css`

## Arquitetura

```
src/
├── pages/index.astro          # página única (head inline + script central)
├── components/
│   ├── Hud.astro              # appbar: marca, Serviços, idioma, Diagnóstico
│   ├── Heroi.astro            # herói (Terra ao fundo, pinned + véu)
│   ├── Orbita.astro           # órbita ambiente de planetas
│   ├── ProvaSocial.astro      # projeto mais recente (MI6)
│   ├── Produtos.astro         # os 4 escopos de serviço
│   ├── Aplicacao.astro        # diálogo de contato
│   ├── Quiz.astro             # diagnóstico de 5 perguntas
│   └── Rodape.astro           # identidade + contatos
├── dados/
│   ├── contato.ts             # ⚙️ WhatsApp, LinkedIn, Instagram
│   └── corpos.ts              # planetas da órbita (imagem + glow)
├── scripts/contato.ts         # mensagem + abertura do WhatsApp
└── styles/global.css          # tokens e todo o CSS
public/
├── logo.svg, favicon.svg      # monograma ML (ciano #3cc9e9)
├── logo-mi6.png               # prova social
└── space/*.jpg + credits.json # iconografia NASA/ESA, com proveniência
```

## Como os contatos chegam

O site é estático (sem backend). Ao enviar o formulário — tanto o diagnóstico
quanto o diálogo direto — a mensagem é montada com as respostas e **abre o
WhatsApp** já preenchida; o visitante só confirma o envio. Uma cópia fica em
`localStorage["marciliolemos.contatos"]` no navegador de quem preencheu.

Para trocar o número ou as redes: **`src/dados/contato.ts`**.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/
npm run preview
npm run fetch:imagery   # rebaixa imagens da NASA e atualiza credits.json
```

## Deploy e segurança

Deploy na Vercel a cada push na `main`, domínio `marciliolemos.dev`.

`vercel.json` aplica os cabeçalhos de segurança: **CSP** (com `script-src`
restrito a same-origin, sem `unsafe-inline`), HSTS, `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy` e `Permissions-Policy`.

O build mantém todo JS e CSS em arquivos externos same-origin
(`build.inlineStylesheets: 'never'` + `vite.build.assetsInlineLimit: 0`), então
a CSP não depende de hashes por script — editar componentes não quebra a
política. `style-src` permite estilos inline porque GSAP e Lenis animam via
atributo `style`.
