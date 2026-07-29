/**
 * Contato: monta a mensagem, abre o WhatsApp e guarda uma cópia local.
 *
 * O site é estático (sem backend), então o envio real acontece pelo WhatsApp:
 * a submissão abre a conversa já com o resumo preenchido. A cópia em
 * localStorage serve só de rascunho no navegador de quem preencheu.
 */

const KEY = 'marciliolemos.contatos';

export function guardaContato(entrada: unknown): void {
  try {
    const fila = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    fila.push(entrada);
    localStorage.setItem(KEY, JSON.stringify(fila));
  } catch {
    /* armazenamento indisponível — segue só em memória */
  }
}

const ROTULOS: Record<string, string> = {
  necessidade: 'Precisa de',
  ramo: 'Negócio',
  descoberta: 'Como encontram',
  trava: 'Trava hoje',
  urgencia: 'Prazo',
};

export interface DadosMensagem {
  titulo: string;
  nome: string;
  email?: string;
  whatsapp?: string;
  escopo?: string | null;
  mensagem?: string;
  respostas?: Record<string, string>;
}

export function montaMensagem(d: DadosMensagem): string {
  const linhas: string[] = [d.titulo, ''];
  linhas.push(`Nome: ${d.nome}`);
  if (d.email) linhas.push(`E-mail: ${d.email}`);
  if (d.whatsapp) linhas.push(`WhatsApp: ${d.whatsapp}`);
  if (d.escopo) linhas.push(`Escopo: ${d.escopo}`);
  if (d.mensagem) linhas.push('', d.mensagem);
  if (d.respostas && Object.keys(d.respostas).length) {
    linhas.push('');
    for (const [k, v] of Object.entries(d.respostas)) {
      linhas.push(`${ROTULOS[k] ?? k}: ${v}`);
    }
  }
  return linhas.join('\n');
}

/** Abre o WhatsApp numa nova aba e devolve a URL (para o link de fallback). */
export function abreWhatsapp(numero: string, texto: string): string {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
  return url;
}
