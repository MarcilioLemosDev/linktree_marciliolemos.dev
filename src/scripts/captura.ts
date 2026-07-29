/**
 * Captura de leads — formato único.
 *
 * Todo CTA do site abre o mesmo formulário, e todo envio gera UM objeto plano
 * (uma chave por coluna) para virar uma linha de planilha sem transformação.
 *
 * Destino: a URL do gatilho HTTP de um fluxo do Power Automate, configurada em
 * PUBLIC_CAPTURA_URL (ver .env.example e docs/CAPTURA.md).
 *
 * O corpo vai como text/plain de propósito: evita o preflight CORS, que o
 * gatilho do Power Automate não responde. O envio é "dispare e siga" — a
 * resposta não é lida, então a confirmação para o visitante nunca depende dela.
 * Sem endpoint configurado, o envio cai no WhatsApp para nenhum lead se perder.
 */

import { whatsappNumero } from '../dados/contato';

/** Ordem das colunas na planilha. Mantida junto do código de propósito. */
export const COLUNAS = [
  'quando',
  'origem',
  'pagina',
  'escopo',
  'necessidade',
  'ramo',
  'descoberta',
  'trava',
  'urgencia',
  'faixa',
  'nome',
  'email',
  'whatsapp',
  'mensagem',
] as const;

export type Captura = Record<(typeof COLUNAS)[number], string>;

const ENDPOINT = (import.meta.env.PUBLIC_CAPTURA_URL ?? '').trim();
const KEY = 'marciliolemos.capturas';

export function temEndpoint(): boolean {
  return ENDPOINT.length > 0;
}

/** Monta o objeto plano no formato único, com todas as colunas presentes. */
export function montaCaptura(dados: Partial<Captura>): Captura {
  const base = {} as Captura;
  for (const c of COLUNAS) base[c] = '';
  base.quando = new Date().toISOString();
  base.origem = 'marciliolemos.dev';
  base.pagina = location.pathname;
  return { ...base, ...dados } as Captura;
}

/** Rascunho local, só no navegador de quem preencheu. */
export function guardaLocal(c: Captura): void {
  try {
    const fila = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    fila.push(c);
    localStorage.setItem(KEY, JSON.stringify(fila));
  } catch {
    /* armazenamento indisponível — segue só em memória */
  }
}

/** Envia ao fluxo. Retorna false quando não há endpoint configurado. */
export function envia(c: Captura): boolean {
  if (!ENDPOINT) return false;
  const corpo = JSON.stringify(c);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([corpo], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return true;
    }
  } catch {
    /* cai no fetch */
  }
  try {
    void fetch(ENDPOINT, {
      method: 'POST',
      body: corpo,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      keepalive: true,
      mode: 'cors',
      // A resposta do fluxo não traz cabeçalhos CORS: a promessa rejeita
      // mesmo com a requisição entregue. Por isso o catch vazio.
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

const ROTULOS: Record<string, string> = {
  escopo: 'Interesse',
  necessidade: 'Precisa de',
  ramo: 'Negócio',
  descoberta: 'Como encontram',
  trava: 'Trava hoje',
  urgencia: 'Prazo',
};

/** Resumo legível para o WhatsApp. */
export function resumo(c: Captura): string {
  const l: string[] = ['Contato pelo site', ''];
  if (c.nome) l.push(`Nome: ${c.nome}`);
  if (c.email) l.push(`E-mail: ${c.email}`);
  if (c.whatsapp) l.push(`WhatsApp: ${c.whatsapp}`);
  l.push('');
  for (const k of ['escopo', 'necessidade', 'ramo', 'descoberta', 'trava', 'urgencia']) {
    const v = c[k as keyof Captura];
    if (v) l.push(`${ROTULOS[k]}: ${v}`);
  }
  if (c.mensagem) l.push('', c.mensagem);
  return l.join('\n');
}

export function linkWhatsapp(texto: string): string {
  return `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(texto)}`;
}
