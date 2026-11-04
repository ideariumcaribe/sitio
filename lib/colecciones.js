// Obras en varios tomos: agrupa los volúmenes del catálogo visible por título base y autor.
// «Historia de Venezuela. Vol. III» → «Historia de Venezuela». Si un volumen queda solo, se prueba con el título
// sin subtítulo («Mariño y la Independencia de Venezuela: El disidente. Vol. II») o sin las fechas finales
// («Archivo del General José Antonio Páez, 1818-1820. Vol. I»). Solo se forman colecciones de dos o más tomos.
import { slugAutor } from "./slug.js";

const VOL = /^(.*?)[.,:]?\s+(?:Vol(?:umen)?\.?|Tomo|T\.)\s+([IVXLC]+|\d+)\b(.*)$/i;
const ROMANOS = { I: 1, V: 5, X: 10, L: 50, C: 100 };
export const numeroTomo = (s) => {
  if (/^\d+$/.test(s)) return Number(s);
  let n = 0; const r = String(s).toUpperCase();
  for (let i = 0; i < r.length; i++) { const v = ROMANOS[r[i]], w = ROMANOS[r[i + 1]] || 0; n += v < w ? -v : v; }
  return n;
};
const clave = (t) => t.trim().toLowerCase();
const rango = (tomos) => { const a = tomos.map((t) => parseInt(t.anio, 10)).filter(Boolean); if (!a.length) return ""; const d = Math.min(...a), h = Math.max(...a); return d === h ? String(d) : `${d}-${h}`; };

export function colecciones(catalogo) {
  const tomos = [];
  for (const o of catalogo) {
    const m = String(o.titulo || "").match(VOL);
    if (m) tomos.push({ o, base: m[1].trim(), num: numeroTomo(m[2]) });
  }
  const agrupar = (lista, f) => { const g = new Map(); for (const t of lista) { const k = clave(f(t)) + "|" + t.o.autor; if (!g.has(k)) g.set(k, []); g.get(k).push(t); } return g; };
  const grupos = [];
  let g = agrupar(tomos, (t) => t.base);
  let sueltos = [];
  for (const l of g.values()) (l.length > 1 ? grupos.push(l) : sueltos.push(l[0]));
  for (const f of [(t) => t.base.split(":")[0], (t) => t.base.replace(/,\s*\d{4}\s*-\s*\d{4}$/, "")]) {
    g = agrupar(sueltos, f); sueltos = [];
    for (const l of g.values()) {
      if (l.length > 1) { const b = f(l[0]); l.forEach((t) => (t.base = b)); grupos.push(l); } else sueltos.push(l[0]);
    }
  }
  const usados = new Set();
  return grupos.map((l) => {
    l.sort((a, b) => a.num - b.num || a.o.signatura.localeCompare(b.o.signatura));
    const titulo = l[0].base;
    let slug = slugAutor(titulo); if (usados.has(slug)) slug += "-" + slugAutor(l[0].o.autor.split(";")[0]); usados.add(slug);
    const tomosL = l.map((t) => ({ ...t.o, tomo: t.num }));
    // Si un mismo tomo aparece más de una vez, la colección reúne varias ediciones: se separan por pie de imprenta.
    const repetidos = new Set(tomosL.map((t) => t.tomo)).size < tomosL.length;
    const ediciones = [];
    if (repetidos) {
      for (const t of tomosL) { let e = ediciones.find((x) => x.pie === t.pie_de_imprenta); if (!e) ediciones.push((e = { pie: t.pie_de_imprenta, tomos: [] })); e.tomos.push(t); }
      ediciones.forEach((e) => (e.anios = rango(e.tomos)));
      ediciones.sort((a, b) => a.anios.localeCompare(b.anios));
    } else ediciones.push({ pie: "", tomos: tomosL, anios: rango(tomosL) });
    return { slug, titulo, autor: l[0].o.autor, tomos: tomosL, ediciones, anios: rango(tomosL) };
  }).sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
}
