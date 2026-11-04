// Resolutor de identificadores persistentes ARK de la Biblioteca Digital.
// N2T.net (y arks.org) redirigen ark:NAAN/IC-0001 a https://www.ideariumcaribe.com/ark/NAAN/IC-0001
// (regla registrada: https://www.ideariumcaribe.com/ark/${content}).
// - Sin inflexión: redirección 302 a la página de la obra (cualquier sufijo se ignora).
// - Con «?info» (o «?»): ficha ERC en texto plano, según la especificación ARK.
// El NAAN se toma de _data/sitio.json («naan»); mientras esté vacío, el resolutor responde 404.

const SITIO = "https://www.ideariumcaribe.com";
// En ARK los guiones no son significativos y la signatura no distingue mayúsculas.
const norma = (s) => String(s || "").replace(/-/g, "").toUpperCase();

export async function resolver(url, datos) {
  const partes = url.pathname.replace(/^\/ark\/?/, "").split("/").filter(Boolean);
  const [naan, nombre] = partes;
  const texto = (cuerpo, estado = 200) => new Response(cuerpo, { status: estado, headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
  if (!datos.naan || naan !== datos.naan) return texto("ARK desconocido.\n", 404);
  if (!nombre) return Response.redirect(`${SITIO}/biblioteca/catalogo/`, 302);
  const o = datos.obras.find((x) => norma(x.id) === norma(nombre));
  if (!o) return texto(`ark:${naan}/${nombre}: identificador no asignado.\n`, 404);
  if (o.oculta) return texto(`ark:${naan}/${o.id}: esta obra no está disponible temporalmente en la Biblioteca Digital de Idearium Caribe.\nark:${naan}/${o.id}: this work is temporarily unavailable in the Idearium Caribe Digital Library.\n`, 404);
  const ark = `ark:${datos.naan}/${o.id}`;
  const destino = SITIO + o.ruta;
  const q = url.search;
  if (q === "?" || q === "??" || q === "?info") {
    const autores = String(o.autor || "").split(";").map((s) => s.trim()).filter(Boolean).join("; ") || "(:unav)";
    return texto(`erc:\nwho: ${autores}\nwhat: ${o.titulo}\nwhen: ${o.anio || "(:unav)"}\nwhere: ${ark} (${destino})\nhow: (:mtype text) libro digitalizado, acceso abierto\npersistence: Idearium Caribe Co. se compromete a mantener este identificador y el acceso a la obra.\n`);
  }
  return Response.redirect(destino, 302);
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const r = await env.ASSETS.fetch(new URL("/biblioteca/oai/datos.json", url.origin));
  if (!r.ok) return new Response("Datos no disponibles", { status: 503 });
  return resolver(url, await r.json());
}
