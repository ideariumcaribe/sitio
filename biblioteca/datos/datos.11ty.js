// Catálogo de la Biblioteca Digital como conjunto de datos abierto (CC0 1.0): /biblioteca/datos/catalogo.csv y catalogo.json.
import fs from "node:fs";
const DERECHOS = JSON.parse(fs.readFileSync(new URL("../../_data/derechos.json", import.meta.url), "utf8"));
const SITIO = "https://www.ideariumcaribe.com";
const COLUMNAS = ["signatura", "ark", "titulo", "autores", "anio", "primera_edicion", "pie_de_imprenta", "materias", "derechos_eeuu", "derechos_eeuu_uri", "derechos_venezuela", "autorizacion", "incorporacion", "url", "internet_archive", "iiif"];

function filas(d) {
  const naan = (d.sitio && d.sitio.naan) || "";
  const mats = d.materias || [];
  return (d.catalogo || []).slice().sort((a, b) => a.signatura.localeCompare(b.signatura)).map((o) => ({
    signatura: o.signatura,
    ark: naan ? `ark:${naan}/${o.signatura}` : "",
    titulo: o.titulo,
    autores: String(o.autor || "").split(";").map((s) => s.trim()).filter(Boolean),
    anio: o.anio || "", primera_edicion: o.primera_edicion || "", pie_de_imprenta: o.pie_de_imprenta || "",
    materias: (o.materias || []).map((s) => (mats.find((m) => m.slug === s) || {}).nombre).filter(Boolean),
    derechos_eeuu: DERECHOS[o.derechos_eeuu] ? DERECHOS[o.derechos_eeuu].es : "",
    derechos_eeuu_uri: DERECHOS[o.derechos_eeuu] ? DERECHOS[o.derechos_eeuu].uri : "",
    derechos_venezuela: o.derechos_venezuela || "", autorizacion: o.autorizacion || "",
    incorporacion: o.incorporacion || "",
    url: `${SITIO}/biblioteca/obras/${o.identificador}/`,
    internet_archive: `https://archive.org/details/${o.identificador}`,
    iiif: `https://iiif.archive.org/iiif/3/${o.identificador}/manifest.json`,
  }));
}
const celda = (v) => { const s = Array.isArray(v) ? v.join("; ") : String(v ?? ""); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export default class {
  data() {
    return { pagination: { data: "formatos", size: 1, alias: "formato" }, formatos: ["csv", "json"], permalink: (d) => `/biblioteca/datos/catalogo.${d.formato}`, eleventyExcludeFromCollections: true };
  }
  render(d) {
    const f = filas(d);
    if (d.formato === "csv") return "﻿" + [COLUMNAS.join(","), ...f.map((r) => COLUMNAS.map((c) => celda(r[c])).join(","))].join("\r\n") + "\r\n";
    return JSON.stringify({
      titulo: "Catálogo de la Biblioteca Digital de Idearium Caribe",
      editor: "Idearium Caribe Co.",
      licencia: "https://creativecommons.org/publicdomain/zero/1.0/",
      nota: "La licencia CC0 se aplica a los metadatos descriptivos, no a las obras. Los derechos de cada obra figuran en derechos_eeuu y derechos_venezuela.",
      fuente: `${SITIO}/biblioteca/catalogo/`,
      generado: new Date().toISOString().slice(0, 10),
      total: f.length,
      obras: f,
    }, null, 1) + "\n";
  }
}
