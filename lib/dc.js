import fs from "node:fs";
import { amparo108h } from "./plazos.js";
import { IDIOMAS } from "./marc.js";
const DERECHOS = JSON.parse(fs.readFileSync(new URL("../_data/derechos.json", import.meta.url), "utf8"));
// Dublin Core simple (oai_dc) de cada obra de la Biblioteca Digital, para el punto de cosecha OAI-PMH.
const SITIO = "https://www.ideariumcaribe.com";
const nfc = (s) => String(s || "").normalize("NFC").trim();
const x = (s) => nfc(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function oaiDc(o, { formas = {}, materias = [], naan = "" } = {}) {
  const autores = nfc(o.autor).split(";").map((s) => s.trim()).filter(Boolean);
  const pie = nfc(o.pie_de_imprenta);
  const coma = pie.indexOf(",");
  const editorial = coma >= 0 ? pie.slice(coma + 1).trim() : pie;
  const campos = [["title", o.titulo]];
  for (const a of autores) campos.push(["creator", formas[a] || a]);
  for (const s of o.materias || []) { const m = materias.find((z) => z.slug === s); if (m) campos.push(["subject", m.nombre]); }
  if (o.primera_edicion && o.primera_edicion !== o.anio) campos.push(["description", `Primera edición: ${o.primera_edicion}.`]);
  if (editorial) campos.push(["publisher", editorial]);
  campos.push(["contributor", "Idearium Caribe Co. (digitalización)"]);
  if (o.anio) campos.push(["date", o.anio]);
  campos.push(["type", "Text"], ["format", "text/html"]);
  if (naan) campos.push(["identifier", `https://n2t.net/ark:${naan}/${o.signatura}`]);
  campos.push(["identifier", `${SITIO}/biblioteca/obras/${o.identificador}/`], ["identifier", `https://archive.org/details/${o.identificador}`], ["identifier", o.signatura]);
  campos.push(["source", `Edición impresa: ${pie}${o.anio ? ", " + o.anio : ""}.`]);
  campos.push(["language", IDIOMAS[o.signatura] || "spa"]);
  campos.push(["relation", "Biblioteca Digital de Idearium Caribe"], ["relation", `https://iiif.archive.org/iiif/3/${o.identificador}/manifest.json`]);
  if (DERECHOS[o.derechos_eeuu]) campos.push(["rights", DERECHOS[o.derechos_eeuu].uri], ["rights", `Estados Unidos: ${DERECHOS[o.derechos_eeuu].es}.`]);
  if (o.derechos_venezuela) campos.push(["rights", `Venezuela: ${o.derechos_venezuela}`]);
  campos.push(["rights", o.autorizacion ? `Acceso abierto. Difundida con autorización de ${nfc(o.autorizacion)}.` : amparo108h(o) ? "Acceso con fines de investigación y estudio al amparo de 17 U.S.C. § 108(h)." : "Acceso abierto."]);
  return '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
    campos.map(([k, v]) => `<dc:${k}>${x(v)}</dc:${k}>`).join("") + "</oai_dc:dc>";
}

// Dublin Core simple (oai_dc) de un artículo de Colombeia.
export function oaiDcArticulo(a, { url, num = {}, issn = "", orcid = {} } = {}) {
  const titulo = nfc(a.titulo) + (a.subtitulo ? ": " + nfc(a.subtitulo) : "");
  const campos = [["title", titulo]];
  for (const n of a.autores || []) campos.push(["creator", nfc(n)]);
  if (a.editor) campos.push(["contributor", `${nfc(a.editor)} (ed.)`]);
  for (const k of a.palabras_clave || []) campos.push(["subject", k]);
  if (a.resumen) campos.push(["description", a.resumen]);
  if (a.abstract) campos.push(["description", a.abstract]);
  campos.push(["publisher", "Idearium Caribe Co."]);
  if (num.anio) campos.push(["date", String(num.anio)]);
  campos.push(["type", "Text"], ["type", "info:eu-repo/semantics/article"], ["type", "info:eu-repo/semantics/publishedVersion"], ["format", "application/pdf"]);
  campos.push(["identifier", url]);
  if (a.pdf) campos.push(["identifier", SITIO + a.pdf]);
  if (a.doi) campos.push(["identifier", "https://doi.org/" + nfc(a.doi)]);
  campos.push(["source", `Colombeia, n.º ${a.numero}${num.fecha ? " (" + num.fecha + ")" : ""}${a.pagina_inicial ? ", pp. " + a.pagina_inicial + "-" + a.pagina_final : ""}. ISSN ${issn}.`]);
  campos.push(["language", "spa"]);
  campos.push(["relation", `${SITIO}/colombeia/numero-${a.numero}/`]);
  for (const n of a.autores || []) if (orcid[n]) campos.push(["relation", `https://orcid.org/${orcid[n]}`]);
  campos.push(["rights", "info:eu-repo/semantics/openAccess"]);
  if (a.licencia === "CC BY 4.0") campos.push(["rights", "https://creativecommons.org/licenses/by/4.0/"], ["rights", "Creative Commons Atribución 4.0 Internacional (CC BY 4.0)."]);
  return '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
    campos.map(([k, v]) => `<dc:${k}>${x(v)}</dc:${k}>`).join("") + "</oai_dc:dc>";
}
