/**
 * Contato central do site. Editar aqui reflete no herói, nos produtos, no app
 * bar e no rodapé.
 */

/** Número no formato internacional, só dígitos (usado em wa.me). */
export const whatsappNumero = '5519998303476';

/** Rótulo humano do telefone. */
export const whatsappLabel = '(19) 99830-3476';

/**
 * Monta o link do WhatsApp com a mensagem já preenchida. O visitante só
 * confirma o envio. Link puro, resolvido no build: não depende de JavaScript.
 */
export function linkWhatsapp(mensagem: string): string {
  return `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export const contatos = [
  { id: 'whatsapp', label: `WhatsApp ${whatsappLabel}`, url: `https://wa.me/${whatsappNumero}` },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://br.linkedin.com/in/marc%C3%ADlio-lemos-630a6b336',
  },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/marciliolemos.dev' },
];
