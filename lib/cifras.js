// «La Biblioteca en cifras»: datos y gráficos SVG generados al compilar (sin JavaScript en el navegador).
// Una sola serie por gráfico, en el color sepia del sitio; cada marca lleva su valor en <title> (información al pasar el puntero)
// y cada gráfico tiene su tabla de datos.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const tope = (m) => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(m, 1)))); for (const k of [1, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * p >= m) return k * p; return 10 * p; };
const marcas = (max, n = 4) => Array.from({ length: n + 1 }, (_, i) => Math.round((max / n) * i));
// Barra con los extremos de datos redondeados (4 px) y anclada a la base.
const barraV = (x, y, w, h, r = 4) => h <= 0 ? "" : (h < r ? `M${x},${y + h}V${y}H${x + w}V${y + h}Z` : `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`);
const barraH = (x, y, w, h, r = 4) => w <= 0 ? "" : (w < r ? `M${x},${y}H${x + w}V${y + h}H${x}Z` : `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`);

export function datos(catalogo, materias, colecciones, articulos, numeros, derechos) {
  const c = catalogo || [];
  const autores = new Set(c.flatMap((o) => String(o.autor || "").split(";").map((s) => s.trim()).filter(Boolean)));
  // Crecimiento: obras acumuladas al final de cada mes de incorporación.
  const porMes = {}; for (const o of c) { const m = String(o.incorporacion || "").slice(0, 7); if (m) porMes[m] = (porMes[m] || 0) + 1; }
  const meses = Object.keys(porMes).sort(); const serieMes = [];
  if (meses.length) { let [a, m] = meses[0].split("-").map(Number); const [af, mf] = meses[meses.length - 1].split("-").map(Number); let acum = 0;
    while (a < af || (a === af && m <= mf)) { const k = `${a}-${String(m).padStart(2, "0")}`; acum += porMes[k] || 0; serieMes.push({ k, etiqueta: `${MESES[m - 1]} ${a}`, n: acum, nuevas: porMes[k] || 0 }); m++; if (m > 12) { m = 1; a++; } } }
  const dec = {}; for (const o of c) { const n = parseInt(o.anio, 10); if (n) dec[Math.floor(n / 10) * 10] = (dec[Math.floor(n / 10) * 10] || 0) + 1; }
  const decadas = []; const ks = Object.keys(dec).map(Number).sort((a, b) => a - b);
  for (let d = ks[0]; d <= ks[ks.length - 1]; d += 10) decadas.push({ etiqueta: `${d}`, n: dec[d] || 0, url: dec[d] ? `/biblioteca/catalogo/?decada=${d}` : "" });
  const temas = (materias || []).map((m) => ({ etiqueta: m.nombre, slug: m.slug, url: `/biblioteca/materias/${m.slug}/`, n: c.filter((o) => (o.materias || []).includes(m.slug)).length })).filter((t) => t.n).sort((a, b) => b.n - a.n || a.etiqueta.localeCompare(b.etiqueta, "es"));
  const der = [
    { etiqueta: "Dominio público en EE. UU.", n: c.filter((o) => o.derechos_eeuu === "NoC-US").length, url: "/biblioteca/catalogo/?derechos=NoC-US" },
    { etiqueta: "Protegidas por derechos de autor", n: c.filter((o) => o.derechos_eeuu === "InC").length, url: "/biblioteca/catalogo/?derechos=InC" },
    { etiqueta: "Derechos indeterminados", n: c.filter((o) => o.derechos_eeuu === "UND").length, url: "/biblioteca/catalogo/?derechos=UND" },
    { etiqueta: "Publicadas con autorización del titular", n: c.filter((o) => o.autorizacion).length, url: "/biblioteca/catalogo/?derechos=autorizada" },
  ];
  const tomos = (colecciones || []).reduce((s, x) => s + x.tomos.length, 0);
  const anios = c.map((o) => parseInt(o.anio, 10)).filter(Boolean);
  return {
    total: c.length, autores: autores.size, temas: temas.length, colecciones: (colecciones || []).length, tomos,
    articulos: (articulos || []).length, numeros: (numeros || []).length, desde: Math.min(...anios), hasta: Math.max(...anios),
    serieMes, decadas, porTema: temas, derechos: der,
  };
}

// Columnas verticales (obras por década).
export function columnas(serie, { titulo, ancho = 720, alto = 280, unidad = "obras", saltar = 1 } = {}) {
  const m = { t: 16, r: 8, b: 30, l: 36 }, W = ancho - m.l - m.r, H = alto - m.t - m.b;
  const max = tope(Math.max(...serie.map((d) => d.n))); const paso = W / serie.length, gap = 2, w = Math.max(4, paso - gap);
  const y = (v) => m.t + H - (v / max) * H;
  let s = `<svg class="graf" viewBox="0 0 ${ancho} ${alto}" role="${serie.some((d) => d.url) ? "group" : "img"}" aria-label="${esc(titulo)}">`;
  for (const v of marcas(max)) s += `<line x1="${m.l}" x2="${ancho - m.r}" y1="${y(v)}" y2="${y(v)}" class="g-grid"/><text x="${m.l - 6}" y="${y(v) + 4}" class="g-eje" text-anchor="end">${v}</text>`;
  serie.forEach((d, i) => { const x = m.l + i * paso + gap / 2, h = (d.n / max) * H;
    const marca = `<rect x="${m.l + i * paso}" y="${m.t}" width="${paso}" height="${H}" class="g-hit"/><path d="${barraV(x, y(d.n), w, h)}" class="g-barra"/><title>${esc(d.etiqueta)}: ${d.n} ${unidad}</title>`;
    s += d.url ? `<a href="${esc(d.url)}" class="g-marca">${marca}</a>` : `<g class="g-marca">${marca}</g>`;
    if (i % saltar === 0) s += `<text x="${x + w / 2}" y="${alto - 10}" class="g-eje" text-anchor="middle">${esc(d.etiqueta)}</text>`; });
  return s + `<line x1="${m.l}" x2="${ancho - m.r}" y1="${m.t + H}" y2="${m.t + H}" class="g-base"/></svg>`;
}

// Barras horizontales con etiqueta y valor (temas, derechos).
export function barras(serie, { titulo, ancho = 720, fila = 26, etiqueta = 250, unidad = "obras", apilado = false } = {}) {
  if (apilado) {
    // Móvil: la etiqueta va encima de su barra, a todo el ancho.
    const r = 44, alto = serie.length * 42 + 4, W = ancho - r, max = Math.max(...serie.map((d) => d.n));
    let s = `<svg class="graf" viewBox="0 0 ${ancho} ${alto}" role="${serie.some((d) => d.url) ? "group" : "img"}" aria-label="${esc(titulo)}">`;
    serie.forEach((d, i) => { const y = i * 42, w = Math.max(2, (d.n / max) * W);
      const marca = `<rect x="0" y="${y}" width="${ancho}" height="42" class="g-hit"/><text x="0" y="${y + 15}" class="g-etq">${esc(d.etiqueta)}</text><path d="${barraH(0, y + 21, w, 14)}" class="g-barra"/><text x="${w + 6}" y="${y + 33}" class="g-valor">${d.n}</text><title>${esc(d.etiqueta)}: ${d.n} ${unidad}</title>`;
      s += d.url ? `<a href="${esc(d.url)}" class="g-marca">${marca}</a>` : `<g class="g-marca">${marca}</g>`; });
    return s + "</svg>";
  }
  const m = { t: 4, r: 44, l: etiqueta }, W = ancho - m.l - m.r, alto = m.t + serie.length * fila + 4;
  const max = Math.max(...serie.map((d) => d.n));
  let s = `<svg class="graf" viewBox="0 0 ${ancho} ${alto}" role="${serie.some((d) => d.url) ? "group" : "img"}" aria-label="${esc(titulo)}">`;
  serie.forEach((d, i) => { const y = m.t + i * fila, h = fila - 8, w = (d.n / max) * W;
    const marca = `<rect x="0" y="${y}" width="${ancho}" height="${fila}" class="g-hit"/><text x="${m.l - 10}" y="${y + h / 2 + 5}" class="g-etq" text-anchor="end">${esc(d.etiqueta)}</text><path d="${barraH(m.l, y + 2, w, h)}" class="g-barra"/><text x="${m.l + w + 6}" y="${y + h / 2 + 5}" class="g-valor">${d.n}</text><title>${esc(d.etiqueta)}: ${d.n} ${unidad}</title>`;
    s += d.url ? `<a href="${esc(d.url)}" class="g-marca">${marca}</a>` : `<g class="g-marca">${marca}</g>`; });
  return s + `<line x1="${m.l}" x2="${m.l}" y1="0" y2="${alto}" class="g-base"/></svg>`;
}

// Línea de crecimiento acumulado.
export function linea(serie, { titulo, ancho = 720, alto = 260, etiquetas = 7 } = {}) {
  const m = { t: 16, r: 16, b: 30, l: 40 }, W = ancho - m.l - m.r, H = alto - m.t - m.b;
  const max = tope(serie[serie.length - 1].n); const x = (i) => m.l + (serie.length === 1 ? W / 2 : (i / (serie.length - 1)) * W); const y = (v) => m.t + H - (v / max) * H;
  let s = `<svg class="graf" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${esc(titulo)}">`;
  for (const v of marcas(max)) s += `<line x1="${m.l}" x2="${ancho - m.r}" y1="${y(v)}" y2="${y(v)}" class="g-grid"/><text x="${m.l - 6}" y="${y(v) + 4}" class="g-eje" text-anchor="end">${v}</text>`;
  s += `<path d="${serie.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.n).toFixed(1)}`).join("")}" class="g-linea"/>`;
  const cada = Math.ceil(serie.length / etiquetas);
  serie.forEach((d, i) => {
    const paso = serie.length > 1 ? W / (serie.length - 1) : W;
    s += `<g class="g-marca"><rect x="${x(i) - paso / 2}" y="${m.t}" width="${paso}" height="${H}" class="g-hit"/><circle cx="${x(i)}" cy="${y(d.n)}" r="4" class="g-punto"/><title>${esc(d.etiqueta)}: ${d.n} obras${d.nuevas ? ` (${d.nuevas} nuevas)` : ""}</title></g>`;
    if (i % cada === 0 || i === serie.length - 1) s += `<text x="${x(i)}" y="${alto - 10}" class="g-eje" text-anchor="middle">${esc(d.etiqueta)}</text>`;
  });
  const u = serie[serie.length - 1]; s += `<text x="${x(serie.length - 1) - 8}" y="${y(u.n) - 10}" class="g-valor" text-anchor="end">${u.n}</text>`;
  return s + `<line x1="${m.l}" x2="${ancho - m.r}" y1="${m.t + H}" y2="${m.t + H}" class="g-base"/></svg>`;
}
export { fmt };
