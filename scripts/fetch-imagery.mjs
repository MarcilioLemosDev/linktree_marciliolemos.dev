/**
 * Baixa a iconografia oficial do site a partir da NASA Image and Video Library
 * (images-api.nasa.gov — imagens NASA em domínio público).
 *
 * Uso: node scripts/fetch-imagery.mjs
 * Saída: public/space/*.jpg + public/space/credits.json
 *
 * O transporte usa `curl` (respeita HTTPS_PROXY do ambiente).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const OUT_DIR = "public/space";
const MAX_BYTES = 1_800_000; // evita jpgs gigantes no repo

const TARGETS = [
  { slug: "sol",            q: "sdo sun full disk",                       must: /full disk view of the sun/i },
  { slug: "mercurio",       q: "mercury globe",                           must: /mercury globe: 0.n, 0.e/i },
  { slug: "venus",          q: "venus global view magellan",              must: /global view of venus/i },
  { slug: "terra",          q: "apollo 17 view of earth",                 must: /view of the earth seen by the apollo 17/i },
  { slug: "marte",          q: "mars valles marineris",                   must: /tharsis volcanoes and valles marineris/i },
  { slug: "saturno",        q: "saturn natural color global cassini",     must: /greatest saturn portrait|farewell to saturn/i },
  { slug: "urano",          q: "uranus voyager 2",                        must: /uranus as seen by/i },
  { slug: "netuno",         q: "neptune full disk",                       must: /neptune full disk/i },
  { slug: "via-lactea",     q: "milky way galactic center spitzer hubble chandra", must: /great observatories.*milky way/i },
];

const curlText = (url) =>
  execFileSync("curl", ["-sfL", "--max-time", "60", url], { maxBuffer: 64e6 }).toString();
const curlJson = (url) => JSON.parse(curlText(url));
const curlDownload = (url, dest) =>
  execFileSync("curl", ["-sfL", "--max-time", "180", "-o", dest, url], { maxBuffer: 64e6 });

function pickAsset(assetUrls) {
  const jpgs = assetUrls.filter((u) => /\.jpe?g$/i.test(u));
  const byTag = (tag) => jpgs.find((u) => u.includes(tag));
  // preferência: large → medium → orig → qualquer jpg
  return byTag("~large") ?? byTag("~medium") ?? byTag("~orig") ?? jpgs[0];
}

mkdirSync(OUT_DIR, { recursive: true });
const credits = [];

for (const t of TARGETS) {
  const dest = path.join(OUT_DIR, `${t.slug}.jpg`);
  const searchUrl =
    "https://images-api.nasa.gov/search?media_type=image&q=" + encodeURIComponent(t.q);
  const res = curlJson(searchUrl);
  const items = res?.collection?.items ?? [];
  console.log(`\n── ${t.slug} ← "${t.q}" (${items.length} resultados)`);
  items.slice(0, 5).forEach((it, i) => console.log(`   [${i}] ${it.data?.[0]?.title}`));

  const item =
    items.find((it) => t.must.test(it.data?.[0]?.title ?? "")) ?? items[0];
  if (!item) {
    console.error(`   !! nada encontrado para ${t.slug}`);
    continue;
  }
  const meta = item.data[0];
  // o collection.json de assets é um array simples de URLs (http://…)
  const assets = curlJson(item.href);
  const urls = (Array.isArray(assets) ? assets : (assets?.collection?.items ?? []).map((a) => a.href))
    .map((u) => u.replace(/^http:\/\//, "https://"));
  let asset = pickAsset(urls);
  if (!asset) {
    console.error(`   !! sem jpg para ${t.slug}`);
    continue;
  }

  curlDownload(asset, dest);
  let size = statSync(dest).size;
  if (size > MAX_BYTES) {
    const smaller = urls.find((u) => u.includes("~medium")) ?? urls.find((u) => u.includes("~small"));
    if (smaller && smaller !== asset) {
      curlDownload(smaller, dest);
      asset = smaller;
      size = statSync(dest).size;
    }
  }
  console.log(`   ✓ ${meta.title} — ${(size / 1024).toFixed(0)} KB`);
  credits.push({
    slug: t.slug,
    nasa_id: meta.nasa_id,
    title: meta.title,
    center: meta.center,
    date_created: meta.date_created,
    source: asset,
  });
}

// Fora da NASA Image Library: imagens da ESA/Hubble (CC BY 4.0, crédito no rodapé).
const ESA = [
  {
    slug: "jupiter",
    url: "https://cdn.esahubble.org/archives/images/screen/heic1914a.jpg",
    nasa_id: "heic1914a",
    title: "Jupiter — Hubble OPAL portrait (27 jun 2019)",
    center: "ESA/Hubble",
    date_created: "2019-08-08",
    credit:
      "NASA, ESA, A. Simon (Goddard Space Flight Center), M.H. Wong (University of California, Berkeley) — CC BY 4.0",
  },
];

for (const e of ESA) {
  const dest = path.join(OUT_DIR, `${e.slug}.jpg`);
  console.log(`\n── ${e.slug} ← ESA/Hubble ${e.nasa_id}`);
  curlDownload(e.url, dest);
  console.log(`   ✓ ${e.title} — ${(statSync(dest).size / 1024).toFixed(0)} KB`);
  const { url, ...meta } = e;
  credits.push({ ...meta, source: url });
}

writeFileSync(path.join(OUT_DIR, "credits.json"), JSON.stringify(credits, null, 2));
console.log(`\n${credits.length}/${TARGETS.length + ESA.length} imagens salvas em ${OUT_DIR}/`);
