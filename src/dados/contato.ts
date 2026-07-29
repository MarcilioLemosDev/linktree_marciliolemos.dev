/**
 * Contato central do site. Editar aqui reflete no rodapé, no diálogo e no
 * envio das mensagens (WhatsApp).
 */

/** Número no formato internacional, só dígitos (usado em wa.me). */
export const whatsappNumero = '5519998303476';

/** Rótulo humano do telefone. */
export const whatsappLabel = '(19) 99830-3476';

export const contatos = [
  { id: 'whatsapp', label: `WhatsApp ${whatsappLabel}`, url: `https://wa.me/${whatsappNumero}` },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://br.linkedin.com/in/marc%C3%ADlio-lemos-630a6b336',
  },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/marciliolemos.dev' },
];
