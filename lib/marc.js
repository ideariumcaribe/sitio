// Registros MARC 21 de la Biblioteca Digital, generados a partir del catálogo visible (fondo/catalogo.json sin las obras ocultas).
// Cada obra se describe como reproducción electrónica de la edición impresa (recurso en línea, RDA, puntuación ISBD).
// Salidas: MARC 21 binario (ISO 2709), MARCXML y formato de texto de MarcEdit (.mrk).

import fs from "node:fs";
import { amparo108h } from "./plazos.js";
const DERECHOS = JSON.parse(fs.readFileSync(new URL("../_data/derechos.json", import.meta.url), "utf8"));
const AUTORIDADES = JSON.parse(fs.readFileSync(new URL("../_data/autoridades.json", import.meta.url), "utf8"));
// Identificadores de autoridad del autor: $0 (Biblioteca del Congreso y VIAF) y $1 (Wikidata, entidad real).
const ident = (n) => { const a = AUTORIDADES[n] || {}; const s = [];
  if (a.lc) s.push(["0", `http://id.loc.gov/authorities/names/${a.lc}`]);
  if (a.viaf) s.push(["0", `http://viaf.org/viaf/${a.viaf}`]);
  if (a.wikidata) s.push(["1", `http://www.wikidata.org/entity/${a.wikidata}`]);
  return s; };
const SITIO = "https://www.ideariumcaribe.com";
const SERIE = "Biblioteca Digital de Idearium Caribe";
const INSTITUCION = "Idearium Caribe Co.";

// Códigos de país de MARC para los lugares de edición del catálogo.
const PAISES = {
  "Caracas": "ve", "San Cristóbal": "ve", "Maracaibo": "ve", "Mérida": "ve", "Valencia": "ve", "Trujillo": "ve",
  "Madrid": "sp", "Barcelona": "sp", "Oviedo": "sp",
  "New York": "nyu", "Ciudad Trujillo": "dr", "París": "fr", "Choisy-le-Roi": "fr", "México D.F.": "mx", "Méjico": "mx",
  "Bogotá": "ck", "Buenos Aires": "ag", "Santiago de Chile": "cl", "Tokio": "ja", "Bruselas": "be", "Roma": "it",
};
// Obras que no están en español.
export const IDIOMAS = { "IC-0211": "ita" };
const ARTICULOS = /^(el|la|lo|los|las|un|una|unos|unas) /i;

const nfc = (s) => String(s || "").normalize("NFC").trim();
const cierra = (s) => (/[.?!)\]]$/.test(s) ? s : s + ".");
const pieDe = (p) => { const s = nfc(p); const i = s.indexOf(","); return i >= 0 ? { lugar: s.slice(0, i).trim(), editorial: s.slice(i + 1).trim() } : { lugar: "", editorial: s }; };
const unirY = (l) => (l.length <= 1 ? l[0] || "" : l.slice(0, -1).join(", ") + " y " + l[l.length - 1]);

// Construye la lista de campos de una obra.
export function registro(o, { formas = {}, materias = [], naan = "" } = {}) {
  const autores = nfc(o.autor).split(";").map((x) => x.trim()).filter(Boolean);
  const forma = (n) => nfc(formas[n] || n);
  const corporativo = (f) => f.indexOf(",") === -1;
  const { lugar, editorial } = pieDe(o.pie_de_imprenta);
  const anio = nfc(o.anio);
  const primera = nfc(o.primera_edicion);
  const alta = nfc(o.incorporacion) || "2025-01-01";
  const idioma = IDIOMAS[o.signatura] || "spa";
  const pais = (PAISES[lugar] || "xx").padEnd(3, " ");
  const url = `${SITIO}/biblioteca/obras/${o.identificador}/`;
  const ia = `https://archive.org/details/${o.identificador}`;

  const f008 =
    alta.slice(2, 4) + alta.slice(5, 7) + alta.slice(8, 10) +
    (primera && primera !== anio ? "r" + anio + primera : "s" + anio + "    ") +
    pais + "    " + " " + "o" + "    " + " " + "000" + " " + "0" + " " + idioma + " " + "d";

  const campos = [
    { tag: "001", valor: o.signatura },
    { tag: "005", valor: alta.replace(/-/g, "") + "000000.0" },
    { tag: "006", valor: "m     o  d        " },
    { tag: "007", valor: "cr |||||||||||" },
    { tag: "008", valor: f008 },
    { tag: "040", i1: " ", i2: " ", sub: [["b", "spa"], ["e", "rda"]] },
  ];
  if (idioma !== "spa") campos.push({ tag: "041", i1: "1", i2: " ", sub: [["a", idioma], ["h", "spa"]] });

  // Autor principal y secundarios.
  const formasAut = autores.map(forma);
  if (formasAut.length) {
    const f = formasAut[0];
    campos.push(corporativo(f)
      ? { tag: "110", i1: "2", i2: " ", sub: [["a", cierra(f)], ...ident(autores[0])] }
      : { tag: "100", i1: "1", i2: " ", sub: [["a", cierra(f)], ...ident(autores[0])] });
  }

  // Título: «Título: subtítulo» → $a Título : $b subtítulo / $c responsabilidad.
  const titulo = nfc(o.titulo);
  const dos = titulo.indexOf(": ");
  const tit = dos > 0 ? titulo.slice(0, dos) : titulo;
  const sub = dos > 0 ? titulo.slice(dos + 2) : "";
  const resp = unirY(autores);
  const art = titulo.match(ARTICULOS);
  const f245 = [["a", tit + (sub ? " :" : resp ? " /" : ".")]];
  if (sub) f245.push(["b", sub + (resp ? " /" : ".")]);
  if (resp) f245.push(["c", cierra(resp)]);
  campos.push({ tag: "245", i1: formasAut.length ? "1" : "0", i2: art ? String(art[0].length) : "0", sub: f245 });

  // Publicación.
  const f264 = [];
  if (lugar) f264.push(["a", lugar + (editorial ? " :" : ",")]);
  if (editorial) f264.push(["b", editorial + ","]);
  f264.push(["c", anio + "."]);
  campos.push({ tag: "264", i1: " ", i2: "1", sub: f264 });

  campos.push(
    { tag: "300", i1: " ", i2: " ", sub: [["a", "1 recurso en línea."]] },
    { tag: "336", i1: " ", i2: " ", sub: [["a", "texto"], ["b", "txt"], ["2", "rdacontent"]] },
    { tag: "337", i1: " ", i2: " ", sub: [["a", "computadora"], ["b", "c"], ["2", "rdamedia"]] },
    { tag: "338", i1: " ", i2: " ", sub: [["a", "recurso en línea"], ["b", "cr"], ["2", "rdacarrier"]] },
    { tag: "490", i1: "1", i2: " ", sub: [["a", SERIE + " ;"], ["v", o.signatura]] },
  );
  if (primera && primera !== anio) campos.push({ tag: "500", i1: " ", i2: " ", sub: [["a", `Primera edición: ${primera}.`]] });
  campos.push(
    { tag: "506", i1: "0", i2: " ", sub: [["a", "Acceso abierto."], ["f", "Unrestricted online access"], ["2", "star"]] },
    { tag: "533", i1: " ", i2: " ", sub: [["a", "Reproducción electrónica."], ["c", INSTITUCION + ","], ["d", alta.slice(0, 4) + "."], ["n", "Disponible en Internet Archive."]] },
  );
  if (o.autorizacion) campos.push({ tag: "540", i1: " ", i2: " ", sub: [["a", `Difundida en acceso abierto con autorización de ${nfc(o.autorizacion)}.`]] });
  if (amparo108h(o)) campos.push({ tag: "540", i1: " ", i2: " ", sub: [["a", "Difundida con fines de investigación y estudio al amparo de 17 U.S.C. § 108(h) (últimos veinte años de protección en EE. UU.)."], ["u", "https://www.ideariumcaribe.com/biblioteca/ultimos-veinte/"]] });
  // Situación de derechos por jurisdicción (campo 542): Estados Unidos con RightsStatements.org; Venezuela con nota propia.
  const der = DERECHOS[o.derechos_eeuu];
  if (der) campos.push({ tag: "542", i1: "1", i2: " ", sub: [["l", der.es + "."], ["r", "Estados Unidos"], ["u", der.uri]] });
  if (o.derechos_venezuela) campos.push({ tag: "542", i1: "1", i2: " ", sub: [["l", nfc(o.derechos_venezuela)], ["r", "Venezuela"]] });

  for (const slug of o.materias || []) {
    const m = materias.find((x) => x.slug === slug);
    if (m) campos.push({ tag: "650", i1: " ", i2: "4", sub: [["a", cierra(nfc(m.nombre))]] });
  }
  formasAut.slice(1).forEach((f, i) => {
    campos.push(corporativo(f)
      ? { tag: "710", i1: "2", i2: " ", sub: [["a", cierra(f)], ...ident(autores[i + 1])] }
      : { tag: "700", i1: "1", i2: " ", sub: [["a", cierra(f)], ...ident(autores[i + 1])] });
  });
  campos.push(
    { tag: "710", i1: "2", i2: " ", sub: [["a", INSTITUCION]] },
    { tag: "830", i1: " ", i2: "0", sub: [["a", SERIE + " ;"], ["v", o.signatura + "."]] },
    ...(naan ? [{ tag: "856", i1: "4", i2: "0", sub: [["u", `https://n2t.net/ark:${naan}/${o.signatura}`], ["z", "Identificador persistente (ARK)"]] }] : []),
    { tag: "856", i1: "4", i2: "0", sub: [["u", url], ["z", "Lectura en la " + SERIE]] },
    { tag: "856", i1: "4", i2: "0", sub: [["u", ia], ["z", "Internet Archive"]] },
    ...(o.commons ? [{ tag: "856", i1: "4", i2: "0", sub: [["u", "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(o.commons.replace(/ /g, "_"))], ["z", "Wikimedia Commons"]] }] : []),
    { tag: "856", i1: "4", i2: "0", sub: [["u", `https://iiif.archive.org/iiif/3/${o.identificador}/manifest.json`], ["q", "application/ld+json"], ["z", "Manifiesto IIIF"]] },
  );
  // Cabecera: registro nuevo, texto, monografía, Unicode, nivel mínimo, ISBD.
  return { cabecera: "     nam a22     7i 4500", campos };
}

// MARC 21 binario (ISO 2709). Las longitudes se cuentan en bytes UTF-8.
const FT = "\x1e", RT = "\x1d", SF = "\x1f";
const bytes = (s) => Buffer.byteLength(s, "utf8");
export function aIso2709({ cabecera, campos }) {
  let directorio = "", datos = "", pos = 0;
  for (const c of campos) {
    const cuerpo = (c.valor !== undefined ? c.valor : c.i1 + c.i2 + c.sub.map(([k, v]) => SF + k + v).join("")) + FT;
    const n = bytes(cuerpo);
    directorio += c.tag + String(n).padStart(4, "0") + String(pos).padStart(5, "0");
    datos += cuerpo; pos += n;
  }
  directorio += FT;
  const base = 24 + bytes(directorio);
  const total = base + bytes(datos) + 1;
  const lider = String(total).padStart(5, "0") + cabecera.slice(5, 12) + String(base).padStart(5, "0") + cabecera.slice(17);
  return lider + directorio + datos + RT;
}

const x = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function aMarcXml({ cabecera, campos }) {
  const l = ["  <record>", `    <leader>${x(cabecera.slice(0, 5).replace(/ /g, "0") + cabecera.slice(5, 12) + "00000" + cabecera.slice(17))}</leader>`];
  for (const c of campos) {
    if (c.valor !== undefined) l.push(`    <controlfield tag="${c.tag}">${x(c.valor)}</controlfield>`);
    else {
      l.push(`    <datafield tag="${c.tag}" ind1="${c.i1}" ind2="${c.i2}">`);
      for (const [k, v] of c.sub) l.push(`      <subfield code="${k}">${x(v)}</subfield>`);
      l.push("    </datafield>");
    }
  }
  l.push("  </record>");
  return l.join("\n");
}

// Formato de texto de MarcEdit: espacios como «\», subcampos con «$».
export function aMrk({ cabecera, campos }) {
  const l = ["=LDR  " + cabecera.replace(/ /g, "\\")];
  for (const c of campos) {
    if (c.valor !== undefined) l.push(`=${c.tag}  ${c.valor.replace(/ /g, "\\")}`);
    else l.push(`=${c.tag}  ${(c.i1 + c.i2).replace(/ /g, "\\")}${c.sub.map(([k, v]) => "$" + k + v).join("")}`);
  }
  return l.join("\n");
}

export function datosMarc(data) {
  const formas = Object.fromEntries((data.ordenAutores || []).map((a) => [a.nombre, a.forma_catalogo]));
  const lista = (data.catalogo || []).slice().sort((a, b) => a.signatura.localeCompare(b.signatura));
  return lista.map((o) => registro(o, { formas, materias: data.materias || [], naan: (data.sitio && data.sitio.naan) || "" }));
}
