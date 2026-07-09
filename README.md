# marciliolemos.dev

Bio interativa no estilo de um **handheld retrô** (aquele "tijolão" / Nokia
antigo): a telinha roda o clássico jogo da **cobrinha (Snake)** e o D-pad
também navega por um menu de links dos meus projetos.

Serve como linktree criativo para a bio do Instagram profissional.

## 🎮 Conceito

- Corpo de handheld ocupando a tela (mobile-first — o tráfego vem da bio do Insta).
- **Telinha LCD** monocromática (verde-fosforado) no topo, com o Snake jogável.
- Metade de baixo dividida: **menu de links** à esquerda, **D-pad** à direita.
- O mesmo D-pad tem dois modos: joga a cobrinha **e** navega o menu.
- Bips retrô (Web Audio) com toggle liga/desliga.

## 🛠️ Stack

- [Astro](https://astro.build) — site estático de página única, zero JS desnecessário.
- HTML/CSS + TypeScript vanilla — Snake em `<canvas>`, sem bibliotecas de jogo.
- `localStorage` para o high score.

## 📁 Estrutura

```
src/
├── layouts/Layout.astro     # HTML base, SEO, Open Graph
├── pages/index.astro        # página única
├── components/
│   ├── Console.astro        # o aparelho inteiro
│   ├── Screen.astro         # telinha LCD (canvas do Snake)
│   ├── Dpad.astro           # setas ↑↓←→
│   └── Menu.astro           # opções de link (com 🔒 "em breve")
├── scripts/
│   ├── snake.ts             # game loop da cobrinha
│   ├── controller.ts        # D-pad ↔ jogo/menu (teclado + toque)
│   └── sound.ts             # bips retrô
├── data/links.ts            # ⚙️ configuração central dos links
└── styles/global.css        # tema/tokens do visual retrô
```

## ⚙️ Como editar os links

Tudo em **`src/data/links.ts`**. Para publicar um link que está "em breve":
mude `locked: true` para `false` e preencha `url`.

## 💻 Desenvolvimento

```bash
npm install        # instala dependências
npm run dev        # servidor local em http://localhost:4321
npm run build      # gera o site estático em dist/
npm run preview    # pré-visualiza o build
```

## 🚀 Deploy

Site estático — publica em Cloudflare Pages, Vercel ou Netlify apontando o
domínio `marciliolemos.dev`. Build: `npm run build`, saída: `dist/`.
