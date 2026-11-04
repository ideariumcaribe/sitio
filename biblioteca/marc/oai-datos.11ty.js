// Datos que usa el punto de cosecha OAI-PMH (functions/oai.js): una entrada por obra de la Biblioteca y por artículo de Colombeia, con sus metadatos ya en XML.
// Conjuntos: «biblioteca» y las materias para las obras; «colombeia» para los artículos (solo en oai_dc).
import fs from "node:fs";
import { registro, aMarcXml } from "../../lib/marc.js";
import { oaiDc, oaiDcArticulo } from "../../lib/dc.js";
import { ocultas } from "../../lib/fondo.js";
const SITIO = "https://www.ideariumcaribe.com";
const ORCID = Object.fromEntries(JSON.parse(fs.readFileSync(new URL("../../_data/orcid.json", import.meta.url), "utf8")).filter((a) => a.nombre && a.orcid).map((a) => [a.nombre.trim(), String(a.orcid).trim()]));
const iso = (f) => (f instanceof Date ? f.toISOString().slice(0, 10) : String(f || "").slice(0, 10));
// Fecha nominal del número (n.º 1 = septiembre de 2025, bimestral), si no consta la de publicación en línea.
const nominal = (n) => { const m = 8 + 2 * (Number(n) - 1); return `${2025 + Math.floor(m / 12)}-${String((m % 12) + 1).padStart(2, "0")}-01`; };

export default class {
  data() { return { permalink: "/biblioteca/oai/datos.json", eleventyExcludeFromCollections: true }; }
  render(d) {
    const formas = Object.fromEntries((d.ordenAutores || []).map((a) => [a.nombre, a.forma_catalogo]));
    const materias = d.materias || [];
    const naan = (d.sitio && d.sitio.naan) || "";
    const obras = (d.catalogo || []).slice().sort((a, b) => a.signatura.localeCompare(b.signatura)).map((o) => ({
      id: o.signatura,
      ruta: `/biblioteca/obras/${o.identificador}/`,
      titulo: o.titulo, autor: o.autor, anio: o.anio,
      fecha: o.incorporacion,
      sets: ["biblioteca", ...(o.materias || [])],
      oai_dc: oaiDc(o, { formas, materias, naan }),
      marc21: aMarcXml(registro(o, { formas, materias, naan })).trim()
        .replace(/^<record>/, '<record xmlns="http://www.loc.gov/MARC21/slim" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd">'),
    }));
    const numeros = ((d.collections && d.collections.numeros) || []).map((n) => n.data);
    const articulos = ((d.collections && d.collections.articulo) || []).slice()
      .sort((a, b) => a.data.numero - b.data.numero || (a.data.orden ?? 0) - (b.data.orden ?? 0))
      .map((p) => {
        const a = p.data; const num = numeros.find((n) => n.numero === a.numero) || {};
        return {
          id: p.page.fileSlug,
          ruta: p.url,
          titulo: a.titulo, autor: (a.autores || []).join("; "), anio: num.anio,
          fecha: iso(num.publicado) || nominal(a.numero),
          sets: ["colombeia"],
          oai_dc: oaiDcArticulo(a, { url: SITIO + p.url.replace(/\.html$/, ""), num, issn: d.sitio.issn, orcid: ORCID }),
        };
      });
    const sets = [{ spec: "biblioteca", nombre: "Biblioteca Digital" }, { spec: "colombeia", nombre: "Colombeia (ISSN " + d.sitio.issn + ")" }, ...materias.map((m) => ({ spec: m.slug, nombre: m.nombre }))];
    // Obras ocultas temporalmente: registros eliminados (deletedRecord «transient»), sin metadatos.
    const hoy = new Date().toISOString().slice(0, 10);
    const retiradas = ocultas().map((o) => ({ id: o.signatura, oculta: true, fecha: hoy, sets: ["biblioteca", ...(o.materias || [])] }));
    return JSON.stringify({ naan, sets, obras: [...[...obras, ...retiradas].sort((a, b) => a.id.localeCompare(b.id)), ...articulos] });
  }
}
