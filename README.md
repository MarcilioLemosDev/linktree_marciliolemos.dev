# marciliolemos.dev

Site de página única em Astro estático. Fundo de espaço profundo com campo de
estrelas em canvas, apresentando os produtos de TI. Todo botão leva direto ao
WhatsApp com a mensagem do escopo já preenchida.

A marca aparece só no app bar, como o próprio domínio, sem logo.

## Produtos

1. **Sites e landing pages**: institucional, landing de conversão, vitrine
2. **Aplicativos**: web, mobile e desktop
3. **Dados e BI**: painéis, integração de fontes, relatórios automáticos
4. **TI em geral**: automação, API, integração e sustentação

## Contato

Os CTAs são links `wa.me` resolvidos no build, sem JavaScript envolvido: se o
script falhar, os botões continuam funcionando. Cada card manda uma mensagem
diferente, então a conversa começa sabendo o que o visitante procura.

Número, LinkedIn e Instagram ficam em **`src/dados/contato.ts`**.

## Stack

- **Astro 7** (`output: 'static'`), `@astrojs/sitemap`
- **i18n**: `pt` (padrão), `en`, `fr`. `en`/`fr` servem o conteúdo pt-BR via
  fallback automático do Astro
- **Campo de estrelas próprio** em canvas (`src/scripts/estrelas.ts`):
  distribuição de magnitude, cor por classe espectral, brilho somado com
  espículas de difração e paralaxe por profundidade. Sprites pré-renderizados,
  então o laço por frame só faz `drawImage`
- **GSAP ScrollTrigger** (entradas por scroll) + **Lenis** (scroll suave, só no
  desktop, porque no mobile o scroll nativo é mais previsível)
- Fontes via Fontsource (Space Grotesk Variable + IBM Plex Mono), empacotadas
  no build, sem chamadas externas em runtime
- **@vercel/analytics**
- Zero dependências de UI; design system em `src/styles/global.css`

## Arquitetura

```
src/
├── pages/index.astro          # página única (head inline + script central)
├── components/
│   ├── Hud.astro              # app bar: marca, Produtos, idioma, WhatsApp
│   ├── Heroi.astro            # herói sobre o campo de estrelas
│   ├── ProvaSocial.astro      # projeto em produção (MI6)
│   ├── Produtos.astro         # as quatro frentes de entrega
│   └── Rodape.astro           # marca e contatos
├── dados/contato.ts           # ⚙️ WhatsApp, LinkedIn, Instagram
├── scripts/estrelas.ts        # campo de estrelas
└── styles/global.css          # tokens e todo o CSS
public/
├── favicon.svg, og.png        # ícone e preview de link
└── logo-mi6.png               # prova social
```

## Dois cuidados no CSS que já causaram defeito

1. **Ordem da cascata.** As media queries do herói precisam vir **depois** das
   regras base: mesma especificidade, então a última declaração vence. Quando
   ficaram antes, todo o ajuste de tipografia mobile virou letra morta.
2. **Nunca dar `transition: transform` em elemento animado pelo GSAP.** As duas
   coisas escrevem a mesma propriedade e sobra `transform` inline preso no
   elemento, o que empurrava o botão do herói contra a legenda de baixo. O hover
   usa a propriedade autônoma `translate`, e as entradas usam `clearProps`.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/
npm run preview
```

## Deploy e segurança

Deploy na Vercel a cada push na `main`, domínio `marciliolemos.dev`.

`vercel.json` aplica **CSP** (com `script-src` restrito a same-origin, sem
`unsafe-inline`), HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
`Referrer-Policy` e `Permissions-Policy`.

O build mantém todo JS e CSS em arquivos externos same-origin
(`build.inlineStylesheets: 'never'` + `vite.build.assetsInlineLimit: 0`), então
a CSP não depende de hashes por script. `style-src` permite estilos inline
porque GSAP e Lenis animam via atributo `style`.
