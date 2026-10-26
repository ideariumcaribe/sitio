export default {
  layout: "numero.njk",
  eleventyComputed: {
    permalink: (d) => `/colombeia/numero-${d.numero}/`,
    title: (d) => `Colombeia, n.º ${d.numero}: ${d.titulo} · Idearium Caribe`,
    descripcion: (d) => `Colombeia, n.º ${d.numero} (${d.fecha}): ${d.titulo}. Índice y artículos en acceso abierto, con resumen y PDF.`,
  },
};
