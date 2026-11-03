// Punto de cosecha OAI-PMH 2.0 de la Biblioteca Digital: https://www.ideariumcaribe.com/oai
// Formatos: oai_dc (Dublin Core) y marc21 (MARCXML). Conjuntos: las materias de la Biblioteca.
// Los metadatos se generan en cada compilación en /biblioteca/oai/datos.json (biblioteca/marc/oai-datos.11ty.js).
// La colección es pequeña: las listas se entregan completas, sin resumptionToken.

const BASE = "https://www.ideariumcaribe.com/oai";
const DOMINIO = "ideariumcaribe.com";
const PREFIJO = `oai:${DOMINIO}:`;
const CORREO = "biblioteca@ideariumcaribe.com";
const FORMATOS = {
  oai_dc: { schema: "http://www.openarchives.org/OAI/2.0/oai_dc.xsd", ns: "http://www.openarchives.org/OAI/2.0/oai_dc/" },
  marc21: { schema: "http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd", ns: "http://www.loc.gov/MARC21/slim" },
};
const ARGUMENTOS = {
  Identify: { req: [], opt: [] },
  ListMetadataFormats: { req: [], opt: ["identifier"] },
  ListSets: { req: [], opt: [], excl: "resumptionToken" },
  ListIdentifiers: { req: ["metadataPrefix"], opt: ["from", "until", "set"], excl: "resumptionToken" },
  ListRecords: { req: ["metadataPrefix"], opt: ["from", "until", "set"], excl: "resumptionToken" },
  GetRecord: { req: ["identifier", "metadataPrefix"], opt: [] },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ahora = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function respuesta(cuerpo, peticion, estado = 200) {
  const req = peticion ? `<request${Object.entries(peticion).map(([k, v]) => ` ${k}="${esc(v)}"`).join("")}>${BASE}</request>` : `<request>${BASE}</request>`;
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/assets/oai.xsl"?>\n' +
    '<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">' +
    `<responseDate>${ahora()}</responseDate>${req}${cuerpo}</OAI-PMH>\n`;
  return new Response(xml, { status: estado, headers: { "Content-Type": "text/xml; charset=utf-8", "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" } });
}
const error = (codigo, texto) => `<error code="${codigo}">${esc(texto)}</error>`;
const cabecera = (o) => `<header><identifier>${PREFIJO}${o.id}</identifier><datestamp>${o.fecha}</datestamp>${o.sets.map((s) => `<setSpec>${esc(s)}</setSpec>`).join("")}</header>`;

export async function responder(params, datos) {
  // Argumentos repetidos o desconocidos: badArgument (sin atributos en <request>).
  const verbos = params.getAll("verb");
  if (verbos.length !== 1 || !ARGUMENTOS[verbos[0]]) return respuesta(error("badVerb", "Verbo ausente, repetido o no válido."));
  const verbo = verbos[0];
  const regla = ARGUMENTOS[verbo];
  const args = {};
  for (const k of new Set(params.keys())) {
    if (k === "verb") continue;
    if (params.getAll(k).length > 1) return respuesta(error("badArgument", `Argumento repetido: ${k}.`));
    if (![...regla.req, ...regla.opt, regla.excl].includes(k)) return respuesta(error("badArgument", `Argumento no permitido: ${k}.`));
    args[k] = params.get(k);
  }
  const pet = { verb: verbo, ...args };
  if (regla.excl && args[regla.excl] !== undefined) {
    if (Object.keys(args).length > 1) return respuesta(error("badArgument", "resumptionToken es un argumento exclusivo."));
    return respuesta(error("badResumptionToken", "Este repositorio no usa resumptionToken."), pet);
  }
  for (const r of regla.req) if (!args[r]) return respuesta(error("badArgument", `Falta el argumento ${r}.`));

  const obras = datos.obras;
  const buscar = (ident) => (ident && ident.startsWith(PREFIJO) ? obras.find((o) => o.id === ident.slice(PREFIJO.length)) : null);

  if (verbo === "Identify") {
    const primera = obras.map((o) => o.fecha).filter(Boolean).sort()[0] || "2025-01-01";
    return respuesta(`<Identify><repositoryName>Biblioteca Digital de Idearium Caribe</repositoryName><baseURL>${BASE}</baseURL><protocolVersion>2.0</protocolVersion><adminEmail>${CORREO}</adminEmail><earliestDatestamp>${primera}</earliestDatestamp><deletedRecord>no</deletedRecord><granularity>YYYY-MM-DD</granularity>` +
      `<description><oai-identifier xmlns="http://www.openarchives.org/OAI/2.0/oai-identifier" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai-identifier http://www.openarchives.org/OAI/2.0/oai-identifier.xsd"><scheme>oai</scheme><repositoryIdentifier>${DOMINIO}</repositoryIdentifier><delimiter>:</delimiter><sampleIdentifier>${PREFIJO}IC-0001</sampleIdentifier></oai-identifier></description>` +
      `<description><rightsManifest xmlns="http://www.openarchives.org/OAI/2.0/rights/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/rights/ http://www.openarchives.org/OAI/2.0/rightsManifest.xsd" appliesTo="http://www.openarchives.org/OAI/2.0/entity#metadata"><rights><rightsReference ref="https://creativecommons.org/publicdomain/zero/1.0/"/></rights></rightsManifest></description></Identify>`, pet);
  }
  if (verbo === "ListMetadataFormats") {
    if (args.identifier && !buscar(args.identifier)) return respuesta(error("idDoesNotExist", "Identificador desconocido."), pet);
    return respuesta(`<ListMetadataFormats>${Object.entries(FORMATOS).map(([p, f]) => `<metadataFormat><metadataPrefix>${p}</metadataPrefix><schema>${f.schema}</schema><metadataNamespace>${f.ns}</metadataNamespace></metadataFormat>`).join("")}</ListMetadataFormats>`, pet);
  }
  if (verbo === "ListSets") {
    return respuesta(`<ListSets>${datos.sets.map((s) => `<set><setSpec>${esc(s.spec)}</setSpec><setName>${esc(s.nombre)}</setName></set>`).join("")}</ListSets>`, pet);
  }
  if (!FORMATOS[args.metadataPrefix]) return respuesta(error("cannotDisseminateFormat", "Formato no disponible. Use oai_dc o marc21."), pet);

  if (verbo === "GetRecord") {
    const o = buscar(args.identifier);
    if (!o) return respuesta(error("idDoesNotExist", "Identificador desconocido."), pet);
    return respuesta(`<GetRecord><record>${cabecera(o)}<metadata>${o[args.metadataPrefix]}</metadata></record></GetRecord>`, pet);
  }

  // ListIdentifiers y ListRecords.
  for (const k of ["from", "until"]) if (args[k] !== undefined && !FECHA.test(args[k])) return respuesta(error("badArgument", `Fecha no válida en ${k}: use AAAA-MM-DD.`));
  if (args.from && args.until && args.from > args.until) return respuesta(error("badArgument", "from es posterior a until."));
  if (args.set && !datos.sets.some((s) => s.spec === args.set)) return respuesta(error("noRecordsMatch", "Conjunto desconocido."), pet);
  const lista = obras.filter((o) => (!args.from || o.fecha >= args.from) && (!args.until || o.fecha <= args.until) && (!args.set || o.sets.includes(args.set)));
  if (!lista.length) return respuesta(error("noRecordsMatch", "Ningún registro coincide con la consulta."), pet);
  if (verbo === "ListIdentifiers") return respuesta(`<ListIdentifiers>${lista.map(cabecera).join("")}</ListIdentifiers>`, pet);
  return respuesta(`<ListRecords>${lista.map((o) => `<record>${cabecera(o)}<metadata>${o[args.metadataPrefix]}</metadata></record>`).join("")}</ListRecords>`, pet);
}

export async function onRequest({ request, env }) {
  if (!["GET", "POST", "HEAD"].includes(request.method)) return new Response("Método no permitido", { status: 405, headers: { Allow: "GET, POST" } });
  const url = new URL(request.url);
  let params = url.searchParams;
  if (request.method === "POST") params = new URLSearchParams(await request.text());
  const r = await env.ASSETS.fetch(new URL("/biblioteca/oai/datos.json", url.origin));
  if (!r.ok) return new Response("Datos no disponibles", { status: 503 });
  return responder(params, await r.json());
}
