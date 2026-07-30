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
    plus: Produto;
  };
  rodape: { linha: string };
  /** Mensagens já prontas do WhatsApp. */
  wa: { geral: string; projeto: string; escopo: (escopo: string) => string };
}

const pt: Textos = {
  htmlLang: 'pt-BR',
  meta: {
    titulo: 'marciliolemos.dev · Software sob medida: sites, aplicativos, dados e BI',
    descricao:
      'Sites, aplicativos web, mobile e desktop, painéis de dados e BI, e automações de TI. Construídos do primeiro protótipo até a operação em produção.',
  },
  cortina: { entrar: 'Entrar em português' },
  hud: { produtos: 'Produtos', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em inglês' },
  heroi: {
    eyebrow: 'Sites · Aplicativos · Dados e BI',
    h1Antes: 'Software ',
    h1Destaque: 'sob medida',
    h1Depois: ' para o seu negócio.',
    tag: 'Sites, aplicativos e painéis de dados construídos do zero, do primeiro protótipo até a operação rodando.',
    cta: 'Falar no WhatsApp',
    legenda: 'Atendimento direto com quem desenvolve.',
  },
  prova: {
    eyebrow: 'Em produção',
    frase:
      'Site institucional, simulador de consórcio e funil de qualificação. No ar, com os dados alimentando a operação.',
    dica: 'Abrir o projeto',
  },
  produtos: {
    eyebrow: 'Produtos',
    titulo: 'O que dá para construir',
    lead: 'Cada frente resolve uma parte do caminho: a interface que o cliente usa, o sistema que sustenta a operação e o dado que orienta a decisão.',
    cta: 'Falar no WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Sites e landing pages',
        texto:
          'Site institucional, landing de conversão ou vitrine de produtos: carrega rápido, aparece na busca e converte no celular, onde está a maior parte do tráfego.',
        escopo: 'um site',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Aplicativos',
        texto:
          'Aplicativo web, mobile ou desktop, do MVP que valida a ideia até a versão publicada, com login, integrações e painel de administração.',
        escopo: 'um aplicativo',
      },
      {
        eyebrow: '03 · Dados',
        titulo: 'Dados e BI',
        texto:
          'Painéis, integração de fontes e relatórios automáticos: os números saem da planilha manual e chegam prontos, atualizados e auditáveis.',
        escopo: 'dados e BI',
      },
    ],
    plus: {
      eyebrow: '04 · Sob demanda',
      titulo: 'TI em geral',
      texto:
        'Automação, API, integração entre sistemas e sustentação. Quando a operação depende de tecnologia, ela precisa continuar de pé.',
      escopo: 'TI em geral',
    },
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
    titulo: 'marciliolemos.dev · Custom software: websites, apps, data and BI',
    descricao:
      'Websites, web, mobile and desktop apps, data and BI dashboards, and IT automation. Built from the first prototype to a system running in production.',
  },
  cortina: { entrar: 'Enter in English' },
  hud: { produtos: 'Products', whatsapp: 'WhatsApp', trocarIdioma: 'Ver em português' },
  heroi: {
    eyebrow: 'Websites · Apps · Data and BI',
    h1Antes: 'Software ',
    h1Destaque: 'built to fit',
    h1Depois: ' your business.',
    tag: 'Websites, apps and data dashboards built from scratch, from the first prototype to a system running in production.',
    cta: 'Message on WhatsApp',
    legenda: 'You talk straight to the developer.',
  },
  prova: {
    eyebrow: 'In production',
    frase:
      'Corporate site, consortium simulator and qualification funnel. Live, with the data feeding daily operations.',
    dica: 'Open the project',
  },
  produtos: {
    eyebrow: 'Products',
    titulo: 'What gets built',
    lead: 'Each area covers one part of the path: the interface your customer uses, the system that runs the operation, and the data behind the decision.',
    cta: 'Message on WhatsApp',
    itens: [
      {
        eyebrow: '01 · Web',
        titulo: 'Websites and landing pages',
        texto:
          'Corporate site, conversion landing page or product showcase: loads fast, shows up in search and converts on mobile, where most of the traffic is.',
        escopo: 'a website',
      },
      {
        eyebrow: '02 · Apps',
        titulo: 'Applications',
        texto:
          'Web, mobile or desktop app, from the MVP that validates the idea to the published version, with login, integrations and an admin panel.',
        escopo: 'an app',
      },
      {
        eyebrow: '03 · Data',
        titulo: 'Data and BI',
        texto:
          'Dashboards, source integration and automated reports: the numbers leave the manual spreadsheet and arrive ready, current and auditable.',
        escopo: 'data and BI',
      },
    ],
    plus: {
      eyebrow: '04 · On demand',
      titulo: 'IT in general',
      texto:
        'Automation, APIs, system integration and support. When the operation depends on technology, it has to stay up.',
      escopo: 'IT in general',
    },
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
