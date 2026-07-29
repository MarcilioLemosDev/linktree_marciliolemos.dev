/**
 * Normaliza as imagens dos planetas: reenquadra cada disco para ficar
 * centralizado e preenchendo ~90% de um quadro quadrado (Saturno: ~94% da
 * largura num quadro largo). Assim uma única máscara radial no CSS
 * (src/styles/global.css) serve para todos, sem hacks por planeta — e a
 * margem preta da foto nunca vira halo/contorno duro.
 *
 * Rodar após trocar qualquer imagem em public/space/:
 *   1. cd public/space && python3 -m http.server 8931 &
 *   2. NODE_PATH=node_modules node scripts/normalize-discos.mjs
 *      (usa canvas headless via playwright-core + Chromium do ambiente)
 *
 * Backup dos originais em scripts/.discos-originais/ antes de sobrescrever.
 */
import { chromium } from "playwright-core";
import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(AQUI, "..", "public", "space");
const BACKUP = path.join(AQUI, ".discos-originais");
mkdirSync(BACKUP, { recursive: true });

// discos: normalizados para o disco preencher ~90% de um quadro 1200x1200,
// centralizado. wide (saturno) é tratado à parte: mantém proporção, centraliza
// o conjunto (planeta + anéis) num quadro 1920x980.
const DISCOS = ["mercurio", "venus", "terra", "marte", "jupiter", "urano", "netuno"];
const BASE = "http://localhost:8931";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
// carrega a partir da origem do servidor (imagens same-origin → canvas não tainta)
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" }).catch(() => {});

async function processa(nome, { wide = false } = {}) {
  const url = `${BASE}/${nome}.jpg`;
  const dataUrl = await page.evaluate(
    async ({ src, wide }) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await img.decode();
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // mede a bounding box do conteúdo (acima do fundo dos cantos)
      const probe = document.createElement("canvas");
      probe.width = iw;
      probe.height = ih;
      const pctx = probe.getContext("2d");
      pctx.drawImage(img, 0, 0);
      const d = pctx.getImageData(0, 0, iw, ih).data;
      const lum = (x, y) => {
        const i = (y * iw + x) * 4;
        return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      };
      const cantos = [lum(3, 3), lum(iw - 3, 3), lum(3, ih - 3), lum(iw - 3, ih - 3)];
      const fundo = cantos.reduce((a, b) => a + b, 0) / 4;
      const limiar = fundo + 12;
      let L = iw, R = 0, T = ih, B = 0;
      const passo = Math.max(1, Math.floor(Math.min(iw, ih) / 600));
      for (let y = 0; y < ih; y += passo) {
        for (let x = 0; x < iw; x += passo) {
          if (lum(x, y) > limiar) {
            if (x < L) L = x;
            if (x > R) R = x;
            if (y < T) T = y;
            if (y > B) B = y;
          }
        }
      }
      const cx = (L + R) / 2;
      const cy = (T + B) / 2;
      const larguraConteudo = R - L;
      const alturaConteudo = B - T;

      let out, ctx, alvoFrac, diamRef;
      if (wide) {
        // saturno: quadro largo, centraliza o conjunto ocupando ~92% da largura
        out = document.createElement("canvas");
        out.width = 1920;
        out.height = 980;
        ctx = out.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, out.width, out.height);
        const escala = (out.width * 0.94) / larguraConteudo;
        ctx.translate(out.width / 2, out.height / 2);
        ctx.scale(escala, escala);
        ctx.translate(-cx, -cy);
        ctx.drawImage(img, 0, 0);
      } else {
        // disco: quadro 1200, disco ocupa 90% (diâmetro = maior lado do bbox)
        diamRef = Math.max(larguraConteudo, alturaConteudo);
        out = document.createElement("canvas");
        out.width = 1200;
        out.height = 1200;
        ctx = out.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, out.width, out.height);
        const escala = (out.width * 0.9) / diamRef;
        ctx.translate(600, 600);
        ctx.scale(escala, escala);
        ctx.translate(-cx, -cy);
        ctx.drawImage(img, 0, 0);
      }
      return {
        dataUrl: out.toDataURL("image/jpeg", 0.9),
        info: { iw, ih, fundo: +fundo.toFixed(1), L, R, T, B, larguraConteudo, alturaConteudo },
      };
    },
    { src: url, wide }
  );

  copyFileSync(path.join(DIR, `${nome}.jpg`), path.join(BACKUP, `${nome}.jpg`));
  const b64 = dataUrl.dataUrl.replace(/^data:image\/jpeg;base64,/, "");
  writeFileSync(path.join(DIR, `${nome}.jpg`), Buffer.from(b64, "base64"));
  console.log(`✓ ${nome}`, JSON.stringify(dataUrl.info));
}

for (const nome of DISCOS) await processa(nome);
await processa("saturno", { wide: true });

await browser.close();
console.log("normalização concluída");
