/**
 * Mãozinha guia: percorre os botões ativos (links reais), posicionando-se na
 * borda direita de cada um e dando um "toque" (anel), em looping. Some na
 * primeira interação e respeita "prefers-reduced-motion".
 *
 * Mantido em arquivo externo (não inline) para a CSP poder usar
 * script-src 'self' sem 'unsafe-inline'.
 */
const menu = document.querySelector<HTMLElement>('.menu');
const mao = menu?.querySelector<HTMLElement>('.menu-mao') ?? null;
const alvos = menu ? Array.from(menu.querySelectorAll<HTMLElement>('a.item')) : [];
const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menu && mao && alvos.length && !reduz) {
  let i = 0;
  let parado = false;
  let timer = 0;

  const posiciona = (el: HTMLElement) => {
    const mr = menu.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.right - mr.left - 30;
    const y = r.top - mr.top + r.height / 2 - 8;
    mao.style.transform = `translate(${x}px, ${y}px)`;
  };

  const ciclo = () => {
    if (parado) return;
    const el = alvos[i % alvos.length];
    posiciona(el);
    mao.classList.add('mostrar');
    mao.classList.remove('tocando');
    void mao.offsetWidth;
    window.setTimeout(() => {
      if (!parado) mao.classList.add('tocando');
    }, 480);
    i += 1;
    timer = window.setTimeout(ciclo, 2000);
  };

  posiciona(alvos[0]);
  timer = window.setTimeout(ciclo, 800);

  const parar = () => {
    parado = true;
    window.clearTimeout(timer);
    mao.classList.remove('mostrar', 'tocando');
  };
  menu.addEventListener('pointerdown', parar, { once: true });
  window.addEventListener('resize', () => {
    if (!parado) posiciona(alvos[(i - 1 + alvos.length) % alvos.length]);
  });
}
