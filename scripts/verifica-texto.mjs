/**
 * Caça clichê e marca de texto de IA no HTML gerado, nos dois idiomas.
 * A lista vem do que as duas referências NÃO usam em nenhuma string de copy.
 */
import fs from 'fs';

const PT = [
  'transformação digital', 'transformar o seu negócio', 'transforme o seu negócio',
  'solução completa', 'soluções completas', 'excelência', 'inovador', 'inovadora',
  'de ponta', 'ponta a ponta', 'revolucion', 'potencializar', 'alavancar',
  'impulsionar', 'não apenas', 'mas também', 'no mundo atual', 'na era digital',
  'cenário atual', 'mergulhe', 'descubra o poder', 'parceiro ideal',
  'outro nível', 'elevar o seu negócio', 'de forma a', 'por meio de',
  'user experience', 'experiência única', 'sob medida', 'personalizado sob',
  'estaremos enviando', 'venha conhecer', 'o que você precisa saber',
  'em um mundo cada vez mais', 'aqui na', 'nossa missão é',
];

const EN = [
  'cutting-edge', 'cutting edge', 'state-of-the-art', 'seamless', 'seamlessly',
  'unlock the', 'unleash', 'empower', 'elevate your', 'supercharge',
  'game-changer', 'game changer', 'game-changing', "today's fast-paced",
  "in today's digital", 'robust and scalable', 'not only', 'but also',
  'delve into', 'dive into', 'leverage', 'tailored solution', 'tailored solutions',
  'comprehensive solution', 'revolutionize', 'transform your business',
  'best-in-class', 'world-class', 'take your business to', 'look no further',
  'in the ever-evolving', 'harness the power',
];

const AMBOS = ['—', '–', 'lorem ipsum'];

function textoVisivel(arquivo) {
  let h = fs.readFileSync(arquivo, 'utf8');
  h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  h = h.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // conteúdo de meta description e title contam como texto do site
  const metas = [...h.matchAll(/<meta[^>]+content="([^"]+)"/gi)].map((m) => m[1]).join(' ');
  const titulo = (h.match(/<title>([^<]*)<\/title>/i) || [, ''])[1];
  // fronteira de bloco vira ponto, senão título e menu colam numa "frase" só
  const corpo = h
    .replace(/<\/(h1|h2|h3|h4|p|li|a|button|span|div|section|footer|header|title)>/gi, '. ')
    .replace(/<[^>]+>/g, ' ');
  return (titulo + ' ' + metas + ' ' + corpo)
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

let falhas = 0;
for (const [rota, arquivo, lista] of [
  ['/', '/home/user/linktree_marciliolemos.dev/dist/index.html', PT],
  ['/en/', '/home/user/linktree_marciliolemos.dev/dist/en/index.html', EN],
]) {
  const txt = textoVisivel(arquivo).toLowerCase();
  const achados = [...lista, ...AMBOS].filter((c) => txt.includes(c.toLowerCase()));
  console.log(`\n### ${rota}  (${txt.length} chars de texto visível)`);
  if (achados.length) {
    falhas += achados.length;
    achados.forEach((a) => {
      const i = txt.indexOf(a.toLowerCase());
      console.log(`   ❌ "${a}"  ...${txt.slice(Math.max(0, i - 55), i + 55)}...`);
    });
  } else {
    console.log(`   ✓ nenhum dos ${lista.length + AMBOS.length} termos da lista`);
  }

  // frase longa demais é sinal de texto que ninguém fala em voz alta
  const frases = txt.split(/(?<=[.!?])\s+/).filter((f) => f.split(' ').length > 3);
  const longas = frases.filter((f) => f.split(' ').length > 34);
  if (longas.length) {
    falhas += longas.length;
    longas.forEach((f) => console.log(`   ❌ frase de ${f.split(' ').length} palavras: ${f.slice(0, 110)}...`));
  } else {
    const maior = Math.max(...frases.map((f) => f.split(' ').length));
    console.log(`   ✓ nenhuma frase acima de 34 palavras (maior tem ${maior})`);
  }
}

console.log(`\n${'='.repeat(58)}\nOCORRÊNCIAS: ${falhas}`);
