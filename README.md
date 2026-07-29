# marciliolemos.dev

Site de página única em Astro estático. Fundo de espaço profundo com campo de
estrelas em canvas, apresentando os produtos de TI e capturando contato por um
formulário único de diagnóstico.

A marca aparece só no app bar, como o próprio domínio — sem logo.

## Produtos

1. **Sites e landing pages** — institucional, landing de conversão, vitrine
2. **Aplicativos** — web, mobile e desktop
3. **Dados e BI** — dashboards, integração de fontes, relatórios automáticos
4. **TI em geral** — automações, APIs, integrações e sustentação

Todos os CTAs abrem o **mesmo formulário**; o card só pré-responde a primeira
pergunta (o escopo). Assim a captura sai sempre num **formato único**.

## Stack

- **Astro 7** (`output: 'static'`), `@astrojs/sitemap`
- **i18n**: `pt` (padrão), `en`, `fr` — `en`/`fr` servem o conteúdo pt-BR via
  fallback automático do Astro
- **Campo de estrelas próprio** em canvas (`src/scripts/estrelas.ts`):
  distribuição de magnitude, cor por classe espectral, brilho somado com
  espículas de difração e paralaxe por profundidade. Sprites pré-renderizados,
  então o laço por frame só faz `drawImage`
- **GSAP ScrollTrigger** (entradas por scroll) + **Lenis** (scroll suave, só no
  desktop — no mobile o scroll nativo é mais previsível)
- Fontes via Fontsource (Space Grotesk Variable + IBM Plex Mono), empacotadas
  no build — zero chamadas externas em runtime
- **@vercel/analytics**
- Zero dependências de UI; design system em `src/styles/global.css`

## Arquitetura

```
src/
├── pages/index.astro          # página única (head inline + script central)
├── components/
│   ├── Hud.astro              # app bar: marca, Produtos, idioma, Diagnóstico
│   ├── Heroi.astro            # herói sobre o campo de estrelas
│   ├── ProvaSocial.astro      # projeto em produção (MI6)
│   ├── Produtos.astro         # as 4 frentes de entrega
│   ├── Formulario.astro       # formulário único (5 perguntas + captura)
│   └── Rodape.astro           # marca, contatos
├── dados/contato.ts           # ⚙️ WhatsApp, LinkedIn, Instagram
├── scripts/
│   ├── estrelas.ts            # campo de estrelas
│   └── captura.ts             # formato único + envio + WhatsApp
└── styles/global.css          # tokens e todo o CSS
public/
├── favicon.svg, og.png        # ícone e preview de link
└── logo-mi6.png               # prova social
```

## Captura de leads

O envio gera **um objeto plano** (uma chave por coluna) e vai para a URL de um
fluxo do Power Automate que grava a linha numa planilha do Excel. As colunas e
a ordem vivem em `COLUNAS`, em `src/scripts/captura.ts`.

Configuração do fluxo, da planilha e da variável `PUBLIC_CAPTURA_URL`:
**[`docs/CAPTURA.md`](docs/CAPTURA.md)** (inclui o aviso de licença: o gatilho
HTTP é premium e não vem no Microsoft 365 Business Basic).

Sem a variável configurada, o formulário abre o **WhatsApp** com o resumo —
nenhum contato se perde enquanto o fluxo não existir.

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
porque GSAP e Lenis animam via atributo `style`; `connect-src` libera os hosts
do Power Automate para o envio da captura.
