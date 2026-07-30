/**
 * Todo o texto visível do site, nos dois idiomas.
 *
 * Editar copy é editar este arquivo. As chaves são iguais nos dois idiomas, e
 * o tipo Textos garante em tempo de build que nenhuma tradução fique faltando.
 */

export type Idioma = 'pt' | 'en';

export interface Produto {
  eyebrow: string;
  titulo: string;
  texto: string;
  /** Trecho que entra na mensagem do WhatsApp. */
  escopo: string;
}

export interface Textos {
  /** Atributo lang do documento. */
  htmlLang: string;
  meta: { titulo: string; descricao: string };
  cortina: { entrar: string };
  hud: { produtos: string; whatsapp: string; trocarIdioma: string };
  heroi: {
    eyebrow: string;
    h1Antes: string;
    h1Destaque: string;
    h1Depois: string;
    tag: string;
    cta: string;
    legenda: string;
  };
  prova: { eyebrow: string; frase: string; dica: string };
  produtos: {
    eyebrow: string;
    titulo: string;
    lead: string;
    cta: string;
    itens: Produto[];
  };
  rodape: { linha: string };
  /** Mensagens já prontas do WhatsApp. */
  wa: { geral: string; projeto: string; escopo: (escopo: string) => string };
}

const pt: Textos = {
  htmlLang: 'pt-BR',
  meta: {
    titulo: 'marciliolemos.dev · Sites, aplicativos, dados, jogos e IA',
    descricao:
      'Desenvolvimento de sites, aplicativos web e mobile, painéis de dados, jogos e operações com IA. Do primeiro protótipo ao sistema rodando em produção.',
  },
  cortina: { entrar: 'Entrar em português' },
  hud: { produtos: 'Produtos', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em inglês' },
  heroi: {
    eyebrow: 'Sites · Apps · Dados · Jogos · IA',
    h1Antes: 'Software que ',
    h1Destaque: 'entra na operação',
    h1Depois: ' e fica de pé.',
    tag: 'Sites, aplicativos, painéis de dados, jogos e operações com IA. Do primeiro protótipo ao sistema no ar.',
    cta: 'Falar no WhatsApp',
    legenda: 'Você fala direto com quem escreve o código.',
  },
  prova: {
    eyebrow: 'Em produção',
    frase:
      'Site institucional, simulador de consórcio e captação de contato. Está no ar, e os dados caem direto na operação.',
    dica: 'Abrir o projeto',
  },
  produtos: {
    eyebrow: 'Produtos',
    titulo: 'O que dá para construir',
    lead: 'Seis frentes que se combinam. Um site que traz gente, um painel que mostra o resultado e uma automação que cuida do resto.',
    cta: 'Falar no WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Sites e landing pages',
        texto:
          'Site institucional, landing de campanha ou vitrine de produtos. Carrega rápido, aparece no Google e funciona no celular, de onde vem a maior parte das visitas.',
        escopo: 'um site',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Aplicativos',
        texto:
          'Aplicativo web, mobile ou desktop. Começa no MVP que testa a ideia com usuário de verdade. Chega na versão publicada, com login, integração e painel de administração.',
        escopo: 'um aplicativo',
      },
      {
        eyebrow: '03 · Dados',
        titulo: 'Dados e BI',
        texto:
          'Seus números saem da planilha que alguém atualiza à mão. Painel ligado nas fontes, relatório que chega sozinho e histórico para comparar mês a mês.',
        escopo: 'dados e BI',
      },
      {
        eyebrow: '04 · Jogos',
        titulo: 'Jogos',
        texto:
          'Jogo para navegador, celular ou desktop. Serve para campanha de marca, treinamento de equipe ou produto próprio, com placar, progressão e dados de quem jogou.',
        escopo: 'um jogo',
      },
      {
        eyebrow: '05 · IA',
        titulo: 'Operações com IA',
        texto:
          'Agente que atende no WhatsApp, lê documento, preenche planilha e abre chamado. Você define até onde ele pode ir e acompanha o que ele fez em cada passo.',
        escopo: 'operações com IA',
      },
      {
        eyebrow: '06 · Sob demanda',
        titulo: 'TI em geral',
        texto:
          'Automação, API, integração entre sistemas e manutenção do que já roda. Inclui plantão para quando algo cai fora de hora.',
        escopo: 'TI em geral',
      },
    ],
  },
  rodape: { linha: 'Desenvolvimento de software · Brasil' },
  wa: {
    geral: 'Olá! Vim pelo site marciliolemos.dev.',
    projeto: 'Olá! Vim pelo site marciliolemos.dev e quero falar sobre um projeto.',
    escopo: (escopo) => `Olá! Vim pelo site marciliolemos.dev e quero falar sobre ${escopo}.`,
  },
};

const en: Textos = {
  htmlLang: 'en',
  meta: {
    titulo: 'marciliolemos.dev · Websites, apps, data, games and AI',
    descricao:
      'Websites, web and mobile apps, data dashboards, games and AI operations. From the first prototype to a system running in production.',
  },
  cortina: { entrar: 'Enter in English' },
  hud: { produtos: 'Products', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em português' },
  heroi: {
    eyebrow: 'Websites · Apps · Data · Games · AI',
    h1Antes: 'Software that ',
    h1Destaque: 'runs your operation',
    h1Depois: ' and stays up.',
    tag: 'Websites, apps, data dashboards, games and AI operations. From the first prototype to a system live in production.',
    cta: 'Message on WhatsApp',
    legenda: 'You talk straight to the person writing the code.',
  },
  prova: {
    eyebrow: 'In production',
    frase:
      'Corporate site, consortium simulator and contact capture. It is live, and the data lands straight in the operation.',
    dica: 'Open the project',
  },
  produtos: {
    eyebrow: 'Products',
    titulo: 'What gets built',
    lead: 'Six areas that fit together. A site that brings people in, a dashboard that shows the result and an automation that handles the rest.',
    cta: 'Message on WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Websites and landing pages',
        texto:
          'Corporate site, campaign landing page or product showcase. Loads fast, shows up on Google and works on the phone, where most of the visits come from.',
        escopo: 'a website',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Applications',
        texto:
          'Web, mobile or desktop app. Starts at the MVP that tests the idea on real users. Ends at the published version, with login, integrations and an admin panel.',
        escopo: 'an app',
      },
      {
        eyebrow: '03 · Data',
        titulo: 'Data and BI',
        texto:
          'Your numbers leave the spreadsheet somebody updates by hand. Dashboard wired to the sources, a report that arrives on its own and history to compare month over month.',
        escopo: 'data and BI',
      },
      {
        eyebrow: '04 · Games',
        titulo: 'Games',
        texto:
          'Game for browser, phone or desktop. Works for a brand campaign, team training or a product of your own, with scoreboard, progression and data on who played.',
        escopo: 'a game',
      },
      {
        eyebrow: '05 · AI',
        titulo: 'AI operations',
        texto:
          'An agent that answers on WhatsApp, reads documents, fills spreadsheets and opens tickets. You set how far it can go and follow what it did at every step.',
        escopo: 'AI operations',
      },
      {
        eyebrow: '06 · On demand',
        titulo: 'IT in general',
        texto:
          'Automation, APIs, system integration and upkeep of what already runs. Includes on-call for when something breaks outside business hours.',
        escopo: 'IT in general',
      },
    ],
  },
  rodape: { linha: 'Software development · Brazil' },
  wa: {
    geral: 'Hi! I came from marciliolemos.dev.',
    projeto: 'Hi! I came from marciliolemos.dev and I would like to talk about a project.',
    escopo: (escopo) => `Hi! I came from marciliolemos.dev and I would like to talk about ${escopo}.`,
  },
};

export const textos: Record<Idioma, Textos> = { pt, en };

/** Caminho da versão no outro idioma. */
export const outroIdioma: Record<Idioma, { idioma: Idioma; href: string; rotulo: string }> = {
  pt: { idioma: 'en', href: '/en/', rotulo: 'EN' },
  en: { idioma: 'pt', href: '/', rotulo: 'PT' },
};
