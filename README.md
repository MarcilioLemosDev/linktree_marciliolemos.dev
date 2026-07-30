# marciliolemos.dev

Site em Astro estático, em português e inglês. Fundo de espaço profundo com
campo de estrelas em canvas, apresentando os produtos de TI. Todo botão leva
direto ao WhatsApp com a mensagem do escopo já preenchida.

A marca aparece só no app bar, como o próprio domínio, sem logo.

## Idiomas

Duas versões com tradução real, não fallback: `pt` em `/` e `en` em `/en/`.
Todo o texto visível vive em **`src/dados/textos.ts`**, uma chave por string nos
dois idiomas. O tipo `Textos` reprova o build se faltar tradução.

A entrada é uma **cortina** em preto de espaço profundo, dividida ao meio: uma
metade por idioma. Ao escolher, as metades abrem para os lados e revelam o site.
A escolha fica em `localStorage`, então quem volta não vê a cortina, e quem
escolheu o outro idioma é levado para lá.

O app bar tem um botão de duas letras (`EN` ou `PT`) que leva à outra versão.
Ele grava a preferência **antes** de navegar: sem isso, a cortina da outra
página leria a escolha antiga e devolveria o visitante, num pingue-pongue.

## Produtos

Seis frentes, numa grade de três colunas, então as duas fileiras fecham sem
buraco. A de IA fica com a borda de destaque.

1. **Sites e landing pages**: institucional, campanha, vitrine
2. **Aplicativos**: web, mobile e desktop
3. **Dados e BI**: painéis, integração de fontes, relatório automático
4. **Jogos**: navegador, celular e desktop
5. **Operações com IA**: agente que atende, lê, preenche e abre chamado
6. **TI em geral**: automação, API, integração e manutenção

## Registro do texto

A copy segue o que as páginas de produto da Anthropic e da OpenAI de fato
escrevem, coletado em `claude.com/product/claude-code`,
`claude.com/solutions/enterprise`, `claude.com/product/cowork` e
`learn.chatgpt.com`. O que se repete nelas:

- produto como sujeito, ou frase no imperativo dirigida ao leitor
- verbo concreto e artefato com nome, no lugar de adjetivo
- duas ou três frases curtas, em vez de uma longa
- o leitor fica com o resultado: "You sign off", "You're always in control"
- nada de pilha de adjetivo abstrato, que é a marca mais visível de texto de IA

`scripts` de verificação cobrem isso: um deles varre o HTML gerado procurando
39 termos de clichê em português e 35 em inglês, travessão e frase acima de 34
palavras.

## Contato

Os CTAs são links `wa.me` resolvidos no build, sem JavaScript envolvido: se o
script falhar, os botões continuam funcionando. Cada card manda uma mensagem
diferente, então a conversa começa sabendo o que o visitante procura.

Número, LinkedIn e Instagram ficam em **`src/dados/contato.ts`**.

## Stack

- **Astro 7** (`output: 'static'`), `@astrojs/sitemap`
- **i18n**: `pt` (padrão) e `en`, cada um com o próprio texto
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
├── pages/index.astro          # pt
├── pages/en/index.astro       # en
├── components/
│   ├── Cortina.astro          # cortina de entrada, uma metade por idioma
│   ├── Hud.astro              # app bar: marca, Produtos, idioma, WhatsApp
│   ├── Heroi.astro            # herói sobre o campo de estrelas
│   ├── ProvaSocial.astro      # projeto em produção (MI6)
│   ├── Produtos.astro         # as quatro frentes de entrega
│   └── Rodape.astro           # marca e contatos
├── layouts/Pagina.astro       # a página inteira, servindo os dois idiomas
├── dados/
│   ├── contato.ts             # ⚙️ WhatsApp, LinkedIn, Instagram
│   └── textos.ts              # ⚙️ toda a copy, pt e en
├── scripts/
│   ├── estrelas.ts            # campo de estrelas
│   └── cortina.ts             # escolha de idioma e abertura
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
3. **Não basta não sobrepor.** Dois textos podem ter caixas separadas e ainda
   parecer colados por estarem na mesma faixa vertical, como aconteceu com a
   marca no vinco da cortina. A verificação mede folga, não só colisão.

A verificação roda em 6 larguras de tela, nos dois idiomas, medindo espaço entre
elementos, sobreposição, overflow horizontal, altura de alvo de toque, erro de
JS e violação de CSP.

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
