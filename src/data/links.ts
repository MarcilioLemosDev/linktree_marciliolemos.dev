/**
 * Configuração central do menu (linktree da bio do Instagram).
 *
 * Para DESBLOQUEAR uma opção "em breve": mude `locked: true` para `false` e
 * preencha `url`. É o único arquivo a editar para publicar um novo link.
 */

export interface MenuLink {
  /** Identificador estável (usado em data-atributos e analytics). */
  id: string;
  /** Texto do botão. */
  label: string;
  /** Linha de apoio opcional. */
  sublabel?: string;
  /** Destino do link. `null` quando ainda não há para onde ir. */
  url: string | null;
  /** Quando `true`, a opção aparece bloqueada (🔒 "em breve") e não é clicável. */
  locked: boolean;
}

export const links: MenuLink[] = [
  {
    id: 'mi6',
    label: 'Projeto recente',
    sublabel: 'MI6 Consórcio',
    url: 'https://mi6consorcio.com.br',
    locked: false,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    sublabel: '(19) 99830-3476',
    url: 'https://wa.me/5519998303476',
    locked: false,
  },
  {
    id: 'wonderspace',
    label: 'WonderSpace',
    sublabel: 'marketplace de serviços · em breve',
    url: null,
    locked: true,
  },
];

/** Redes sociais exibidas como ícones no rodapé. */
export interface Social {
  /** Identificador usado para escolher o ícone. */
  id: 'linkedin';
  label: string;
  url: string;
}

export const socials: Social[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://br.linkedin.com/in/marc%C3%ADlio-lemos-630a6b336',
  },
];

/** Crédito no rodapé: leva ao perfil do Instagram (abre no app no mobile). */
export const credit = {
  label: '@marciliolemos.dev',
  url: 'https://instagram.com/marciliolemos.dev',
};
