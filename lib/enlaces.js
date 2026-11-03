// Revisión de enlaces internos: al terminar la compilación se buscan en _site los enlaces y recursos propios
// (href y src que empiezan por /) que no corresponden a ningún archivo. Solo avisa; no detiene la compilación.
import fs from "node:fs";
import path from "node:path";

const DINAMICAS = [/^\/oai(\?|$)/, /^\/ark\//, /^\/pagefind\//, /^\/cdn-cgi\//];

function archivos(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "pagefind") archivos(p, out); }
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}
const existe = (salida, ruta) => {
  const r = decodeURIComponent(ruta.split(/[?#]/)[0]);
  if (!r || r === "/") return true;
  const base = path.join(salida, r);
  return [base, base + ".html", path.join(base, "index.html")].some((f) => fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, "index.html"))));
};

export function revisarEnlaces(salida) {
  const rotos = new Map();
  for (const f of archivos(salida)) {
    const html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/\b(?:href|src)="(\/[^"\/][^"]*|\/)"/g)) {
      const ruta = m[1].replace(/&amp;/g, "&");
      if (DINAMICAS.some((re) => re.test(ruta)) || existe(salida, ruta)) continue;
      const pag = "/" + path.relative(salida, f);
      if (!rotos.has(ruta)) rotos.set(ruta, new Set());
      rotos.get(ruta).add(pag);
    }
  }
  if (!rotos.size) { console.log("[enlaces] Sin enlaces internos rotos."); return 0; }
  console.warn(`[enlaces] ${rotos.size} enlaces internos rotos:`);
  for (const [r, p] of rotos) console.warn(`  ${r}  ←  ${[...p].slice(0, 3).join(", ")}${p.size > 3 ? ` y ${p.size - 3} más` : ""}`);
  return rotos.size;
}
