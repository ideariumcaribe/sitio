export default {
  layout: "articulo.njk",
  tags: ["articulo"],
  esArticulo: true,
  eleventyComputed: {
    // La página del artículo vive junto a su PDF (lo exige Google Académico).
    permalink: (d) => (d.pdf ? d.pdf.replace(/\.pdf$/i, ".html") : `/colombeia/articulos/${d.page.fileSlug}.html`),
    title: (d) => `${d.titulo}${d.subtitulo ? ": " + d.subtitulo : ""} · Colombeia`,
    descripcion: (d) => d.resumen,
  },
};
