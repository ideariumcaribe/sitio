// Datos que usa el punto de cosecha OAI-PMH (functions/oai.js): una entrada por obra, con sus metadatos ya en XML.
import { registro, aMarcXml } from "../../lib/marc.js";
import { oaiDc } from "../../lib/dc.js";

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
      sets: o.materias || [],
      oai_dc: oaiDc(o, { formas, materias, naan }),
      marc21: aMarcXml(registro(o, { formas, materias, naan })).trim()
        .replace(/^<record>/, '<record xmlns="http://www.loc.gov/MARC21/slim" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd">'),
    }));
    return JSON.stringify({ naan: (d.sitio && d.sitio.naan) || "", sets: materias.map((m) => ({ spec: m.slug, nombre: m.nombre })), obras });
  }
}
