// Bibliografía descargable de cada tema, autor y obra en varios tomos: /biblioteca/…/{slug}/bibliografia.{ris,bib,csv}.
import fs from "node:fs";
const DERECHOS = JSON.parse(fs.readFileSync(new URL("../_data/derechos.json", import.meta.url), "utf8"));
const SITIO = "https://www.ideariumcaribe.com";
const celda = (v) => { const s = Array.isArray(v) ? v.join("; ") : String(v ?? ""); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const COLUMNAS = ["signatura", "titulo", "autores", "anio", "pie_de_imprenta", "materias", "derechos_eeuu", "ark", "url", "internet_archive"];

export default class {
  data() {
    return { pagination: { data: "bibliografias", size: 1, alias: "bib" }, permalink: (d) => `${d.bib.ruta}bibliografia.${d.bib.formato}`, eleventyExcludeFromCollections: true };
  }
  render(d) {
    const { obras, formato } = d.bib, naan = (d.sitio && d.sitio.naan) || "";
    if (formato === "ris") return obras.map((o) => this.risObra(o, d.materias, naan).trim()).join("\n\n") + "\n";
    if (formato === "bib") return obras.map((o) => this.bibObra(o, d.materias, naan).trim()).join("\n\n") + "\n";
    const filas = obras.map((o) => ({
      signatura: o.signatura, titulo: o.titulo, autores: String(o.autor || "").split(";").map((s) => s.trim()).filter(Boolean),
      anio: o.anio || "", pie_de_imprenta: o.pie_de_imprenta || "",
      materias: (o.materias || []).map((s) => ((d.materias || []).find((m) => m.slug === s) || {}).nombre).filter(Boolean),
      derechos_eeuu: DERECHOS[o.derechos_eeuu] ? DERECHOS[o.derechos_eeuu].es : "",
      ark: naan ? `https://n2t.net/ark:${naan}/${o.signatura}` : "",
      url: `${SITIO}/biblioteca/obras/${o.identificador}/`, internet_archive: `https://archive.org/details/${o.identificador}`,
    }));
    return "﻿" + [COLUMNAS.join(","), ...filas.map((f) => COLUMNAS.map((c) => celda(f[c])).join(","))].join("\r\n") + "\r\n";
  }
}
