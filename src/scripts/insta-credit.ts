/**
 * No mobile, o crédito tenta abrir o perfil no APP do Instagram
 * (deep link instagram://user?username=...), com fallback para o https.
 *
 * Mantido em arquivo externo (não inline) para a CSP poder usar
 * script-src 'self' sem 'unsafe-inline'.
 */
const link = document.querySelector<HTMLAnchorElement>('.credito');
if (link) {
  link.addEventListener('click', (e) => {
    const web = link.href;
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if (!isMobile) return;

    let user = '';
    try {
      user = new URL(web).pathname.replace(/\//g, '');
    } catch {}
    if (!user) return;

    e.preventDefault();
    const app = 'instagram://user?username=' + user;
    const fallback = window.setTimeout(() => {
      window.location.href = web;
    }, 700);
    const cancel = () => window.clearTimeout(fallback);
    window.addEventListener('pagehide', cancel, { once: true });
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) cancel();
      },
      { once: true }
    );
    window.location.href = app;
  });
}
