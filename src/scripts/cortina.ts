/**
 * Cortina de entrada.
 *
 * Guarda o idioma escolhido e some para quem já escolheu. Quando a escolha é o
 * outro idioma, troca de página. A cortina nasce visível no HTML de propósito:
 * quem chega pela primeira vez não vê o site aparecer antes dela.
 */

const CHAVE = 'marciliolemos.idioma';
const IDIOMAS = ['pt', 'en'] as const;
type Idioma = (typeof IDIOMAS)[number];

/**
 * Troca de idioma pelo menu: grava a escolha ANTES de navegar. Sem isso, a
 * cortina da outra página leria a preferência antiga e mandaria o visitante de
 * volta, num pingue-pongue entre os dois idiomas.
 */
document.querySelectorAll<HTMLAnchorElement>('[data-trocar-idioma]').forEach((link) => {
  link.addEventListener('click', () => {
    const alvo = link.dataset.trocarIdioma as Idioma;
    if (!IDIOMAS.includes(alvo)) return;
    try {
      localStorage.setItem(CHAVE, alvo);
    } catch {
      /* armazenamento indisponível, a navegação segue de todo jeito */
    }
  });
});

const cortina = document.querySelector<HTMLElement>('[data-cortina]');

if (cortina) {
  const daPagina = (document.documentElement.lang.startsWith('en') ? 'en' : 'pt') as Idioma;
  const caminho: Record<Idioma, string> = { pt: '/', en: '/en/' };

  const lido = (() => {
    try {
      const v = localStorage.getItem(CHAVE);
      return IDIOMAS.includes(v as Idioma) ? (v as Idioma) : null;
    } catch {
      return null;
    }
  })();

  const some = () => {
    cortina.hidden = true;
    document.documentElement.classList.remove('cortina-ativa');
  };

  if (lido === daPagina) {
    // Já escolheu este idioma: nunca mostra a cortina.
    some();
  } else if (lido) {
    // Escolheu o outro idioma: vai para lá sem entrar no histórico.
    location.replace(caminho[lido]);
  } else {
    // Primeira visita: a cortina fica, e a página atrás não rola.
    document.documentElement.classList.add('cortina-ativa');
  }

  const abrir = () => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz) {
      some();
      return;
    }
    cortina.classList.add('abrindo');
    document.documentElement.classList.remove('cortina-ativa');
    // Espera a transição das metades antes de tirar do fluxo.
    window.setTimeout(some, 1000);
  };

  cortina.querySelectorAll<HTMLElement>('[data-escolher]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const escolhido = botao.dataset.escolher as Idioma;
      try {
        localStorage.setItem(CHAVE, escolhido);
      } catch {
        /* armazenamento indisponível, segue sem lembrar da escolha */
      }
      if (escolhido === daPagina) abrir();
      else location.href = caminho[escolhido];
    });
  });
}
