// Búsqueda en el texto de toda la Biblioteca: índice Pagefind propio, separado del buscador del sitio.
// Fuente: fondo/textos/{identificador}.json.gz (scripts/textos-paginas.py), con el OCR de cada obra página a página.
// Cada obra se divide en tramos de veinte páginas (/biblioteca/obras/{id}/t{k}/), con un encabezado por página (id="n{imagen}"):
// cada resultado apunta a la página exacta (…/t1/#n37 → ?pagina=n37) y solo se descarga el texto de su tramo.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { visibles } from "./fondo.js";

const PAGINAS_TRAMO = 20;
// El índice se reparte en GRUPOS índices menores (cada obra va siempre al mismo, según su identificador), que se compilan
// uno tras otro para no agotar la memoria y que el navegador combina al buscar (mergeIndex).
export const GRUPOS = 8;
const grupoDe = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.codePointAt(0)) >>> 0; return h % GRUPOS; };
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function indiceTextos(pagefind, salida) {
  if (process.env.SIN_TEXTOS) { console.log("[textos] Índice del texto omitido (SIN_TEXTOS)."); return; }
  const inicio = Date.now();
  const raiz = new URL("../", import.meta.url);
  const mats = JSON.parse(fs.readFileSync(new URL("_data/materias.json", raiz), "utf8"));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ic-textos-"));
  const destino = path.join(salida, "biblioteca", "texto", "indice");
  let obras = 0, paginas = 0;
  const fichas = {};
  for (const o of visibles()) {
    const f = new URL(`fondo/textos/${o.identificador}.json.gz`, raiz);
    if (!fs.existsSync(f)) continue;
    const pags = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
    const mini = fs.existsSync(new URL(`assets/portadas/mini/${o.identificador}.webp`, raiz)) ? `/assets/portadas/mini/${o.identificador}.webp` : `/assets/portadas/provisional/${o.identificador}.svg`;
    const temas = (o.materias || []).map((s) => (mats.find((m) => m.slug === s) || {}).nombre).filter(Boolean);
    // Solo la signatura va en los metadatos (Pagefind indexa los metadatos); título, autor y portada van en obras.json.
    const meta = `<span data-pagefind-meta="signatura:${esc(o.signatura)}"></span>`;
    fichas[o.signatura] = { t: o.titulo, a: String(o.autor || "").replace(/;/g, ","), y: o.anio || "", i: mini };
    const filtros = temas.map((t) => `<span data-pagefind-filter="tema:${esc(t)}"></span>`).join("") + `<span data-pagefind-filter="obra:${esc(o.signatura)}"></span>`;
    // Tramos de PAGINAS_TRAMO páginas: cada resultado descarga solo el texto de su tramo, no el libro entero.
    for (let k = 0; k * PAGINAS_TRAMO < pags.length; k++) {
      const cuerpo = pags.slice(k * PAGINAS_TRAMO, (k + 1) * PAGINAS_TRAMO).map(([i, num, t]) => `<h2 id="n${i}">${num ? "p. " + esc(num) : "imagen " + (i + 1)}</h2><p>${esc(t)}</p>`).join("\n");
      const dir = path.join(tmp, String(grupoDe(o.identificador)), "biblioteca", "obras", o.identificador, "t" + k);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body><main data-pagefind-body>${meta}${filtros}\n${cuerpo}</main></body></html>`);
    }
    obras++; paginas += pags.length;
  }
  fs.mkdirSync(destino, { recursive: true });
  fs.writeFileSync(path.join(destino, "obras.json"), JSON.stringify(fichas));
  for (let g = 0; g < GRUPOS; g++) {
    if (!fs.existsSync(path.join(tmp, String(g)))) continue;
    const { index } = await pagefind.createIndex({ forceLanguage: "es" });
    await index.addDirectory({ path: path.join(tmp, String(g)) });
    await index.writeFiles({ outputPath: path.join(destino, String(g)) });
    await index.deleteIndex();
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`[textos] ${obras} obras y ${paginas.toLocaleString("es")} páginas indexadas en ${Math.round((Date.now() - inicio) / 1000)} s.`);
}
