// Búsqueda en el texto de toda la Biblioteca: índice Pagefind propio, separado del buscador del sitio.
// Fuente: fondo/textos/{identificador}.json.gz (scripts/textos-paginas.py), con el OCR de cada obra página a página.
// Cada obra se divide en tramos de veinte páginas (/biblioteca/obras/{id}/t{k}/), con un encabezado por página (id="n{imagen}"):
// cada resultado apunta a la página exacta (…/t1/#n37 → ?pagina=n37) y solo se descarga el texto de su tramo.
// El índice se reparte en GRUPOS índices menores (cada obra va siempre al mismo grupo), que el navegador combina al buscar.
// Caché: cada grupo compilado se guarda en .cache/textos/ con una huella de su contenido. Cloudflare Pages conserva .cache
// entre compilaciones (caché de compilación activada), así que solo se recompilan los grupos que cambiaron; si nada cambió,
// el índice se copia en pocos segundos.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { visibles } from "./fondo.js";

const PAGINAS_TRAMO = 20;
export const GRUPOS = 8;
const VERSION = "2"; // cámbiese si se modifica el formato de los documentos indexados
const grupoDe = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.codePointAt(0)) >>> 0; return h % GRUPOS; };
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function indiceTextos(pagefind, salida) {
  if (process.env.SIN_TEXTOS) { console.log("[textos] Índice del texto omitido (SIN_TEXTOS)."); return; }
  const inicio = Date.now();
  const raiz = new URL("../", import.meta.url);
  const mats = JSON.parse(fs.readFileSync(new URL("_data/materias.json", raiz), "utf8"));
  const destino = path.join(salida, "biblioteca", "texto", "indice");
  const cache = path.join(fileURLaRuta(raiz), ".cache", "textos");
  fs.mkdirSync(destino, { recursive: true }); fs.mkdirSync(cache, { recursive: true });

  // 1. Obras por grupo y huella de cada grupo (texto de las obras y datos indexados).
  const fichas = {}, grupos = Array.from({ length: GRUPOS }, () => ({ obras: [], huella: crypto.createHash("sha256").update(VERSION + PAGINAS_TRAMO) }));
  for (const o of visibles()) {
    const f = new URL(`fondo/textos/${o.identificador}.json.gz`, raiz);
    if (!fs.existsSync(f)) continue;
    const mini = fs.existsSync(new URL(`assets/portadas/mini/${o.identificador}.webp`, raiz)) ? `/assets/portadas/mini/${o.identificador}.webp` : `/assets/portadas/provisional/${o.identificador}.svg`;
    const temas = (o.materias || []).map((s) => (mats.find((m) => m.slug === s) || {}).nombre).filter(Boolean);
    fichas[o.signatura] = { t: o.titulo, a: String(o.autor || "").replace(/;/g, ","), y: o.anio || "", i: mini };
    const gz = fs.readFileSync(f), g = grupos[grupoDe(o.identificador)];
    g.obras.push({ o, temas, gz });
    g.huella.update(JSON.stringify([o.identificador, o.signatura, temas])).update(gz);
  }
  fs.writeFileSync(path.join(destino, "obras.json"), JSON.stringify(fichas));

  // 2. Cada grupo: se copia de la caché si su huella no cambió; si no, se compila y se guarda en la caché.
  let compilados = 0, obras = 0;
  for (let n = 0; n < GRUPOS; n++) {
    const g = grupos[n]; if (!g.obras.length) continue;
    const huella = g.huella.digest("hex").slice(0, 16), enCache = path.join(cache, `${n}-${huella}`), dest = path.join(destino, String(n));
    obras += g.obras.length;
    if (!fs.existsSync(path.join(enCache, "pagefind.js"))) {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ic-textos-"));
      for (const { o, temas, gz } of g.obras) {
        const pags = JSON.parse(zlib.gunzipSync(gz));
        // Solo la signatura va en los metadatos (Pagefind también indexa los metadatos); título, autor y portada van en obras.json.
        const meta = `<span data-pagefind-meta="signatura:${esc(o.signatura)}"></span>`;
        const filtros = temas.map((t) => `<span data-pagefind-filter="tema:${esc(t)}"></span>`).join("") + `<span data-pagefind-filter="obra:${esc(o.signatura)}"></span>`;
        for (let k = 0; k * PAGINAS_TRAMO < pags.length; k++) {
          const cuerpo = pags.slice(k * PAGINAS_TRAMO, (k + 1) * PAGINAS_TRAMO).map(([i, num, t]) => `<h2 id="n${i}">${num ? "p. " + esc(num) : "imagen " + (i + 1)}</h2><p>${esc(t)}</p>`).join("\n");
          const dir = path.join(tmp, "biblioteca", "obras", o.identificador, "t" + k);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body><main data-pagefind-body>${meta}${filtros}\n${cuerpo}</main></body></html>`);
        }
      }
      const { index } = await pagefind.createIndex({ forceLanguage: "es" });
      await index.addDirectory({ path: tmp });
      fs.rmSync(enCache, { recursive: true, force: true });
      await index.writeFiles({ outputPath: enCache });
      await index.deleteIndex();
      fs.rmSync(tmp, { recursive: true, force: true });
      compilados++;
      // Borra de la caché las versiones anteriores de este grupo.
      for (const d of fs.readdirSync(cache)) if (d.startsWith(n + "-") && d !== `${n}-${huella}`) fs.rmSync(path.join(cache, d), { recursive: true, force: true });
    }
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(enCache, dest, { recursive: true });
  }
  console.log(`[textos] ${obras} obras; ${compilados} de ${GRUPOS} grupos compilados, el resto desde la caché; ${Math.round((Date.now() - inicio) / 1000)} s.`);
}

function fileURLaRuta(u) { return decodeURIComponent(new URL(u).pathname); }
