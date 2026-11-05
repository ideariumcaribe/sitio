// Portadas provisionales (SVG) para las obras que aún no tienen portada local en assets/portadas/
// (por ejemplo, mientras Internet Archive procesa una obra recién subida). Las usa el filtro «portada».
import fs from "node:fs";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tieneLocal = (o) => fs.existsSync(new URL(`../../assets/portadas/${o.identificador}.webp`, import.meta.url));
// Reparte un texto en líneas de como máximo n caracteres.
function lineas(t, n) { const out = []; let l = ""; for (const p of String(t).split(/\s+/)) { if ((l + " " + p).trim().length > n && l) { out.push(l); l = p; } else l = (l + " " + p).trim(); } if (l) out.push(l); return out; }

export default class {
  data() {
    return {
      pagination: { data: "catalogo", size: 1, alias: "obra", before: (d) => d.filter((o) => !tieneLocal(o)) },
      permalink: (d) => `/assets/portadas/provisional/${d.obra.identificador}.svg`,
      eleventyExcludeFromCollections: true,
    };
  }
  render({ obra: o }) {
    let tl = lineas(o.titulo, 17); let fs1 = 25; if (tl.length > 6) { tl = lineas(o.titulo, 22); fs1 = 20; } if (tl.length > 8) tl = tl.slice(0, 7).concat(["…"]);
    const au = lineas(String(o.autor || "").split(";").map((s) => s.trim()).join(", "), 30).slice(0, 2);
    const y0 = 210 - (tl.length * fs1 * 1.2) / 2 + fs1;
    const T = tl.map((l, i) => `<text x="150" y="${(y0 + i * fs1 * 1.2).toFixed(1)}" font-size="${fs1}" text-anchor="middle">${esc(l)}</text>`).join("");
    const A = au.map((l, i) => `<text x="150" y="${62 + i * 18}" font-size="13" letter-spacing="1.2" text-anchor="middle" fill="#3F3F3F">${esc(l.toUpperCase())}</text>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420" role="img" aria-label="${esc(o.titulo)}">
<rect width="300" height="420" fill="#F1EBDD"/><rect x="14" y="14" width="272" height="392" fill="none" stroke="#7A5A1E" stroke-width="1"/><rect x="20" y="20" width="260" height="380" fill="none" stroke="#7A5A1E" stroke-width=".5"/>
<g font-family="'EB Garamond', Garamond, Georgia, 'Times New Roman', serif" fill="#000">${A}${T}
<line x1="125" y1="${(y0 + tl.length * fs1 * 1.2 + 4).toFixed(1)}" x2="175" y2="${(y0 + tl.length * fs1 * 1.2 + 4).toFixed(1)}" stroke="#7A5A1E" stroke-width="1"/>
<text x="150" y="${(y0 + tl.length * fs1 * 1.2 + 30).toFixed(1)}" font-size="14" text-anchor="middle" fill="#3F3F3F">${esc(o.anio || "")}</text>
<text x="150" y="384" font-size="11" letter-spacing="2" text-anchor="middle" fill="#7A5A1E">${esc(o.signatura)} · IDEARIUM CARIBE</text></g></svg>`;
  }
}
