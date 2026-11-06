// Búsqueda en el texto de toda la Biblioteca: índice Pagefind propio, separado del buscador del sitio.
// Fuente: fondo/textos/{identificador}.json.gz (scripts/textos-paginas.py), con el OCR de cada obra página a página.
// Cada obra se convierte en un documento con un encabezado por página (id="n{imagen}"), de modo que cada resultado
// apunta a la página exacta: /biblioteca/obras/{id}/#n37 → el visor abre esa página (?pagina=n37).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { visibles } from "./fondo.js";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function indiceTextos(pagefind, salida) {
  if (process.env.SIN_TEXTOS) { console.log("[textos] Índice del texto omitido (SIN_TEXTOS)."); return; }
  const inicio = Date.now();
  const raiz = new URL("../", import.meta.url);
  const mats = JSON.parse(fs.readFileSync(new URL("_data/materias.json", raiz), "utf8"));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ic-textos-"));
  let obras = 0, paginas = 0;
  for (const o of visibles()) {
    const f = new URL(`fondo/textos/${o.identificador}.json.gz`, raiz);
    if (!fs.existsSync(f)) continue;
    const pags = JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
    const mini = fs.existsSync(new URL(`assets/portadas/mini/${o.identificador}.webp`, raiz)) ? `/assets/portadas/mini/${o.identificador}.webp` : `/assets/portadas/provisional/${o.identificador}.svg`;
    const temas = (o.materias || []).map((s) => (mats.find((m) => m.slug === s) || {}).nombre).filter(Boolean);
    const meta = [["autor", String(o.autor || "").replace(/;/g, ",")], ["anio", o.anio || ""], ["signatura", o.signatura], ["image", mini]]
      .map(([k, v]) => `<span data-pagefind-meta="${k}:${esc(v)}"></span>`).join("");
    const filtros = temas.map((t) => `<span data-pagefind-filter="tema:${esc(t)}"></span>`).join("");
    const cuerpo = pags.map(([i, num, t]) => `<h2 id="n${i}">${num ? "p. " + esc(num) : "imagen " + (i + 1)}</h2><p>${esc(t)}</p>`).join("\n");
    const dir = path.join(tmp, "biblioteca", "obras", o.identificador);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(o.titulo)}</title></head><body><main data-pagefind-body><h1 data-pagefind-meta="title">${esc(o.titulo)}</h1>${meta}${filtros}\n${cuerpo}</main></body></html>`);
    obras++; paginas += pags.length;
  }
  const { index } = await pagefind.createIndex({ forceLanguage: "es" });
  await index.addDirectory({ path: tmp });
  await index.writeFiles({ outputPath: path.join(salida, "biblioteca", "texto", "pagefind") });
  await index.deleteIndex();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`[textos] ${obras} obras y ${paginas.toLocaleString("es")} páginas indexadas en ${Math.round((Date.now() - inicio) / 1000)} s.`);
}
