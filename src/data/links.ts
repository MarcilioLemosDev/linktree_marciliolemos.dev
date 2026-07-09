/**
 * Configuração central do menu do handheld.
 *
 * Para ATIVAR uma opção que está "em breve": mude `locked: true` para `false`
 * e preencha o campo `url`. É o único arquivo que você precisa editar para
 * publicar um novo link.
 */

export interface MenuLink {
  /** Identificador estável (usado em data-atributos e analytics). */
  id: string;
  /** Texto curto exibido no menu (cabe na "telinha"). */
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
    id: '7aery-build',
    label: '7aery Build',
    sublabel: 'desenvolvimento web, mobile e desktop sob medida',
    // Provisório: leva ao WhatsApp com mensagem pronta sobre o serviço.
    url: 'https://wa.me/5519998303476?text=Ol%C3%A1!%20Quero%20saber%20sobre%20o%207aery%20Build%20(desenvolvimento%20web%2C%20mobile%20e%20desktop%20sob%20medida).',
    locked: false,
  },
  {
    id: '7aery-marketplace',
    label: '7aery Marketplace',
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
