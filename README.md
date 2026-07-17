# marciliolemos.dev

Bio interativa em **layout de celular (iPhone)**: um linktree direto ao ponto,
com a tela do aparelho rodando o "app" — marca + menu de links + rodapé.
Feito para a bio do Instagram profissional (mobile-first).

## 🎨 Conceito

- Moldura de iPhone (titânio, Dynamic Island, status bar, home indicator).
- Fundo premium escuro com leve halo da cor da marca.
- Menu em cartões estilo iOS (vidro), com chevron nos ativos e 🔒 nos "em breve".
- Mãozinha guia que indica onde tocar (some ao primeiro uso).
- Rodapé: crédito (abre o Instagram) + ícone do LinkedIn.

## 🛠️ Stack

- [Astro](https://astro.build) — site estático de página única.
- HTML/CSS + TypeScript vanilla, fonte Inter (`@fontsource-variable/inter`).
- [@vercel/analytics](https://vercel.com/docs/analytics) — Web Analytics.

## 📁 Estrutura

```
src/
├── layouts/Layout.astro     # HTML base, SEO, Open Graph, Analytics
├── pages/index.astro        # página única
├── components/
│   ├── Console.astro        # o aparelho (iPhone) + tela/app
│   ├── Menu.astro           # cartões de link (com 🔒 e mãozinha guia)
│   └── Footer.astro         # crédito + redes sociais
├── data/links.ts            # ⚙️ links, redes e crédito (edite aqui)
└── styles/global.css        # tema/tokens
```

## ⚙️ Como editar os links

Tudo em **`src/data/links.ts`**. Para publicar um link "em breve": mude
`locked: true` para `false` e preencha `url`.

## 💻 Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/
npm run preview
```

## 🚀 Deploy

Site estático na Vercel (deploy automático a cada push na `main`), domínio
`marciliolemos.dev`. O Web Analytics precisa ser habilitado uma vez no painel
da Vercel (aba **Analytics → Enable**).
