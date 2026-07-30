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
      'Desenvolvimento de sites, aplicativos web e mobile, painéis de dados, jogos e automação com IA. Do primeiro protótipo até o sistema publicado.',
  },
  cortina: { entrar: 'Entrar em português' },
  hud: { produtos: 'Produtos', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em inglês' },
  heroi: {
    eyebrow: 'Sites · Apps · Dados · Jogos · IA',
    h1Antes: 'Desenvolvimento de software ',
    h1Destaque: 'sob demanda',
    h1Depois: '.',
    tag: 'Sites, aplicativos, painéis de dados, jogos e automação com IA.',
    cta: 'Falar no WhatsApp',
    legenda:
      'Do primeiro protótipo até o sistema publicado. Você fala direto com quem escreve o código.',
  },
  prova: {
    eyebrow: 'Em produção',
    frase:
      'Site institucional, simulador de consórcio e captação de contato pelo WhatsApp.',
    dica: 'Visitar mi6consorcio.com.br',
  },
  produtos: {
    eyebrow: 'Produtos',
    titulo: 'Frentes de trabalho',
    lead: 'Um projeto costuma juntar mais de uma: site com painel de dados, aplicativo com automação.',
    cta: 'Falar no WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Sites e landing pages',
        texto:
          'Site institucional, landing de campanha ou vitrine de produtos. Carrega rápido, funciona bem no celular e aparece nas buscas do Google.',
        escopo: 'um site',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Aplicativos',
        texto:
          'Aplicativo web, mobile ou desktop. Começa por uma versão enxuta para testar a ideia e chega até a publicação, com login, integrações e painel de administração.',
        escopo: 'um aplicativo',
      },
      {
        eyebrow: '03 · Dados',
        titulo: 'Dados e BI',
        texto:
          'Fim da planilha atualizada à mão. Painel conectado às suas fontes, relatório automático por e-mail e histórico para comparar períodos.',
        escopo: 'dados e BI',
      },
      {
        eyebrow: '04 · Jogos',
        titulo: 'Jogos',
        texto:
          'Jogo para navegador, celular ou desktop. Serve para campanha de marca, treinamento de equipe ou produto próprio, com placar, fases e relatório de quem jogou.',
        escopo: 'um jogo',
      },
      {
        eyebrow: '05 · IA',
        titulo: 'Operações com IA',
        texto:
          'Agente que atende no WhatsApp, lê documentos, preenche planilhas e abre chamados. Você define até onde ele pode ir e vê o que ele fez em cada passo.',
        escopo: 'operações com IA',
      },
      {
        eyebrow: '06 · Suporte',
        titulo: 'TI em geral',
        texto:
          'Automação, API, integração entre sistemas e manutenção do que já está rodando. Inclui suporte para incidentes fora do horário comercial.',
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
      'Development of websites, web and mobile apps, data dashboards, games and AI automation. From the first prototype to a published system.',
  },
  cortina: { entrar: 'Enter in English' },
  hud: { produtos: 'Products', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em português' },
  heroi: {
    eyebrow: 'Websites · Apps · Data · Games · AI',
    h1Antes: 'Software development ',
    h1Destaque: 'on demand',
    h1Depois: '.',
    tag: 'Websites, apps, data dashboards, games and AI automation.',
    cta: 'Message on WhatsApp',
    legenda:
      'From the first prototype to a published system. You talk straight to the person writing the code.',
  },
  prova: {
    eyebrow: 'In production',
    frase: 'Corporate site, consortium simulator and contact capture through WhatsApp.',
    dica: 'Visit mi6consorcio.com.br',
  },
  produtos: {
    eyebrow: 'Products',
    titulo: 'Areas of work',
    lead: 'One project usually combines more than one: a site with a data dashboard, an app with automation.',
    cta: 'Message on WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Websites and landing pages',
        texto:
          'Corporate site, campaign landing page or product showcase. Loads fast, works well on the phone and shows up in Google searches.',
        escopo: 'a website',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Applications',
        texto:
          'Web, mobile or desktop app. Starts with a lean version to test the idea and goes all the way to release, with login, integrations and an admin panel.',
        escopo: 'an app',
      },
      {
        eyebrow: '03 · Data',
        titulo: 'Data and BI',
        texto:
          'The end of the spreadsheet someone updates by hand. Dashboard connected to your sources, automated report by email and history to compare periods.',
        escopo: 'data and BI',
      },
      {
        eyebrow: '04 · Games',
        titulo: 'Games',
        texto:
          'Game for browser, phone or desktop. Works for a brand campaign, team training or a product of your own, with scoreboard, levels and a report on who played.',
        escopo: 'a game',
      },
      {
        eyebrow: '05 · AI',
        titulo: 'AI operations',
        texto:
          'An agent that answers on WhatsApp, reads documents, fills spreadsheets and opens tickets. You set how far it can go and see what it did at every step.',
        escopo: 'AI operations',
      },
      {
        eyebrow: '06 · Support',
        titulo: 'IT in general',
        texto:
          'Automation, APIs, system integration and maintenance of what is already running. Includes support for incidents outside business hours.',
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
