// Datos de las imágenes para compartir (Open Graph): /og/datos.json, que lee scripts/tarjetas-og.cjs.
// Cada entrada lleva su archivo de destino (assets/og/...) y el texto de la tarjeta.
const MOSAICO = ["mario-briceno-iragorry-tapices-de-historia-patria", "arturo-uslar-pietri-golpe-y-estado-en-venezuela", "indalecio-lievano-aguirre-bolivar-2da-edicion", "mario-briceno-iragorry-el-caballo-de-ledesma", "augusto-mijares-el-libertador", "mario-briceno-iragorry-casa-leon-y-su-tiempo"];
const PAGINAS = {
  biblioteca: ["Biblioteca Digital", "Libros y publicaciones sobre la historia de Venezuela, de libre lectura"],
  colombeia: ["Colombeia", "Revista académica de acceso abierto · ISSN 3069-7700"],
  fundacion: ["La Fundación", "Fundación cultural sin fines de lucro para la memoria de Venezuela"],
  cambios: ["Registro de cambios", "Novedades de la Biblioteca Digital, Colombeia y el sitio web"],
  preservacion: ["Política de preservación", "Tres copias de cada obra, según los niveles de la NDSA"],
  accesibilidad: ["Declaración de accesibilidad", "Pautas WCAG 2.2, nivel AA"],
  privacidad: ["Política de privacidad", "Sin cookies, sin publicidad y sin ceder datos personales"],
  buscar: ["Buscar", "Obras, autores, temas y artículos de Colombeia"],
  "aviso-legal": ["Aviso legal", "Uso de inteligencia artificial y criterios de digitalización"],
  apoyanos: ["Apóyanos", "Contribuya a digitalizar y preservar la memoria de Venezuela"],
  catalogo: ["Catálogo de la Biblioteca Digital", "Búsqueda y filtros por tema, década y derechos"],
  autores: ["Autores de la Biblioteca Digital", "Índice alfabético de autores"],
  temas: ["Temas de la Biblioteca Digital", "La colección organizada por temas"],
  colecciones: ["Obras en varios tomos", "Obras completas, epistolarios y colecciones documentales"],
};
const portadaObra = (o) => `/assets/portadas/${o.identificador}.webp`;
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

export default class {
  data() { return { permalink: "/og/datos.json", eleventyExcludeFromCollections: true }; }
  render(d) {
    const naan = d.sitio.naan;
    const out = [];
    for (const o of d.catalogo || []) {
      out.push({ archivo: `obras/${o.identificador}.jpg`, tipo: "obra", marca: "Biblioteca Digital", etiqueta: o.signatura, titulo: o.titulo,
        autor: String(o.autor || "").split(";").map((s) => s.trim()).filter(Boolean).join(", "),
        detalle: [o.pie_de_imprenta, o.anio].filter(Boolean).join(", "), pie: naan ? `ark:${naan}/${o.signatura}` : "ideariumcaribe.com", portadas: [portadaObra(o)] });
    }
    const numeros = ((d.collections && d.collections.numeros) || []).map((n) => n.data);
    for (const p of (d.collections && d.collections.articulo) || []) {
      const a = p.data; const num = numeros.find((n) => n.numero === a.numero) || {};
      out.push({ archivo: `articulos/${p.page.fileSlug}.jpg`, tipo: "articulo", marca: "Colombeia", etiqueta: `N.º ${a.numero} · ${num.fecha || ""}`.trim(),
        titulo: a.titulo + (a.subtitulo ? ": " + a.subtitulo : (a.titulo === "Presentación" ? `, n.º ${a.numero}` : "")),
        autor: (a.autores || []).join(", "), detalle: a.editor ? `Edición de ${a.editor}` : (a.seccion || ""), pie: `ISSN ${d.sitio.issn}`, portadas: num.portada ? [num.portada] : [] });
    }
    for (const au of d.autoresBiblioteca || []) {
      out.push({ archivo: `autores/${au.slug}.jpg`, tipo: "coleccion", marca: "Biblioteca Digital", etiqueta: "Autor", titulo: au.nombre,
        detalle: plural(au.obras.length, "obra", "obras") + " de libre lectura", pie: "ideariumcaribe.com", portadas: au.obras.slice(0, 3).map(portadaObra) });
    }
    for (const m of d.materias || []) {
      const obras = (d.catalogo || []).filter((o) => (o.materias || []).includes(m.slug)).sort((a, b) => a.signatura.localeCompare(b.signatura));
      if (!obras.length) continue;
      const elegidas = [obras[0], obras[Math.floor(obras.length / 2)], obras[obras.length - 1]].filter((o, i, l) => l.indexOf(o) === i);
      out.push({ archivo: `temas/${m.slug}.jpg`, tipo: "coleccion", marca: "Biblioteca Digital", etiqueta: "Tema", titulo: m.nombre,
        detalle: plural(obras.length, "obra", "obras") + " de libre lectura", pie: "ideariumcaribe.com", portadas: elegidas.map(portadaObra) });
    }
    for (const c of d.colecciones || []) {
      const l = c.tomos; const elegidas = [l[0], l[Math.floor(l.length / 2)], l[l.length - 1]].filter((o, i, x) => x.indexOf(o) === i);
      out.push({ archivo: `colecciones/${c.slug}.jpg`, tipo: "coleccion", marca: "Biblioteca Digital", etiqueta: "Obra en varios tomos", titulo: c.titulo,
        autor: String(c.autor || "").split(";").map((s) => s.trim()).join(", "), detalle: `${c.tomos.length} tomos${c.anios ? " · " + c.anios : ""}`, pie: "ideariumcaribe.com", portadas: elegidas.map(portadaObra) });
    }
    for (const [k, [t, s]] of Object.entries(PAGINAS)) {
      const portadas = k === "colombeia" ? numeros.slice().sort((a, b) => a.numero - b.numero).map((n) => n.portada).filter(Boolean) : MOSAICO.map((id) => `/assets/portadas/${id}.webp`);
      out.push({ archivo: `paginas/${k}.jpg`, tipo: "pagina", marca: k === "colombeia" ? "Colombeia" : "Idearium Caribe", etiqueta: "", titulo: t, detalle: s, pie: "ideariumcaribe.com", portadas });
    }
    return JSON.stringify(out);
  }
}
