// Mapa de los lugares de edición de la Biblioteca, generado como SVG al compilar (sin JavaScript ni teselas externas).
// Contornos: world-atlas (Natural Earth, dominio público). Proyección Equal Earth para el mundo y Mercator para Venezuela.
import fs from "node:fs";
import { geoEqualEarth, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { CIUDADES, PAISES, isoPais, lugar } from "./lugares.js";

const leer = (f) => JSON.parse(fs.readFileSync(new URL(`../node_modules/world-atlas/${f}`, import.meta.url), "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const radio = (n, max, rmax) => Math.max(3.5, Math.sqrt(n / max) * rmax);
const plural = (n) => `${n} ${n === 1 ? "obra" : "obras"}`;

export function conteo(catalogo) {
  const ciudades = new Map();
  for (const o of catalogo || []) { const l = lugar(o.pie_de_imprenta); if (!l) continue; const k = l.nombre; if (!ciudades.has(k)) ciudades.set(k, { ...l, n: 0 }); ciudades.get(k).n++; }
  const lista = [...ciudades.values()].sort((a, b) => b.n - a.n || a.nombre.localeCompare(b.nombre, "es"));
  const paises = new Map();
  for (const c of lista) { if (!c.pais) continue; if (!paises.has(c.pais)) paises.set(c.pais, { pais: c.pais, n: 0, ciudades: [] }); const p = paises.get(c.pais); p.n += c.n; p.ciudades.push(c); }
  return { ciudades: lista, paises: [...paises.values()].sort((a, b) => b.n - a.n) };
}

export function mundo(catalogo, { ancho = 760 } = {}) {
  const { paises } = conteo(catalogo);
  const tierra = feature(leer("countries-110m.json"), leer("countries-110m.json").objects.countries);
  tierra.features = tierra.features.filter((f) => f.properties.name !== "Antarctica");
  const proy = geoEqualEarth().fitWidth(ancho, tierra); const path = geoPath(proy).digits(1);
  const [[, y0], [, y1]] = path.bounds(tierra); const alto = Math.ceil(y1 - y0); proy.translate([proy.translate()[0], proy.translate()[1] - y0]);
  const con = new Set(paises.map((p) => isoPais(p.pais)));
  const max = Math.max(...paises.map((p) => p.n));
  let s = `<svg class="mapa" viewBox="0 0 ${ancho} ${alto}" role="group" aria-label="Mapa del mundo: países donde se publicaron las obras de la Biblioteca">`;
  for (const f of tierra.features) s += `<path d="${path(f)}" class="${con.has(f.id) ? "m-pais m-con" : "m-pais"}"/>`;
  for (const p of paises.slice().reverse()) {
    const info = PAISES[p.pais]; if (!info) continue; const [x, y] = proy(info.c); const r = radio(p.n, max, 17);
    const dest = p.pais === "Venezuela" ? "#mapa-venezuela" : `/biblioteca/catalogo/?lugar=${encodeURIComponent(p.ciudades[0].nombre)}`;
    const det = p.ciudades.map((c) => `${c.nombre}: ${plural(c.n)}`).join("; ");
    s += `<a href="${esc(dest)}" class="m-marca"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 6).toFixed(1)}" class="m-hit"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" class="m-punto"/><text x="${(x + (info.dx > 0 ? r * 0.3 : -r * 0.3) + info.dx).toFixed(1)}" y="${(y + info.dy).toFixed(1)}" text-anchor="${info.a}" class="m-etq">${esc(p.pais)} <tspan class="m-n">${p.n}</tspan></text><title>${esc(p.pais)}: ${plural(p.n)} (${esc(det)})</title></a>`;
  }
  return s + "</svg>";
}

export function venezuela(catalogo, { ancho = 760, alto = 460 } = {}) {
  const { ciudades } = conteo(catalogo);
  const ven = ciudades.filter((c) => c.pais === "Venezuela" && c.c);
  const datos = leer("countries-50m.json"); const todos = feature(datos, datos.objects.countries);
  const vz = todos.features.find((f) => f.id === "862");
  const proy = geoMercator().fitExtent([[20, 20], [ancho - 20, alto - 20]], vz).clipExtent([[0, 0], [ancho, alto]]); const path = geoPath(proy).digits(1);
  const max = Math.max(...ven.map((c) => c.n));
  const ETQ = { "Caracas": [12, -14, "start"], "Valencia": [-8, 22, "end"], "Maracaibo": [-10, -10, "end"], "Mérida": [-10, 18, "end"], "San Cristóbal": [-10, 8, "end"] };
  let s = `<svg class="mapa" viewBox="0 0 ${ancho} ${alto}" role="group" aria-label="Mapa de Venezuela: ciudades donde se publicaron las obras de la Biblioteca">`;
  for (const f of todos.features) { const [[a, b], [c2, d2]] = path.bounds(f); if (c2 < 0 || a > ancho || d2 < 0 || b > alto) continue; const d = path(f); if (d) s += `<path d="${d}" class="${f.id === "862" ? "m-pais m-con" : "m-pais"}"/>`; }
  for (const c of ven.slice().reverse()) {
    const [x, y] = proy(c.c); const r = radio(c.n, max, 24); const [dx, dy, a] = ETQ[c.nombre] || [10, 4, "start"];
    s += `<a href="/biblioteca/catalogo/?lugar=${encodeURIComponent(c.nombre)}" class="m-marca"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r + 6).toFixed(1)}" class="m-hit"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" class="m-punto"/><text x="${(x + (dx > 0 ? r * 0.7 : -r * 0.7) + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${a}" class="m-etq m-etq-v">${esc(c.nombre)} <tspan class="m-n">${c.n}</tspan></text><title>${esc(c.nombre)}: ${plural(c.n)}</title></a>`;
  }
  return s + "</svg>";
}
