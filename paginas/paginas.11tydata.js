export default {
  layout: "base.njk",
  // El contenido es HTML: se procesa con Nunjucks y no con Markdown.
  templateEngineOverride: "njk",
  eleventyComputed: {
    // index.md es la portada; las demás conservan su nombre (fundacion.html, etc.).
    permalink: (d) => (/\/index\.md$/.test(d.page.inputPath) ? "/index.html" : `/${d.page.fileSlug}.html`),
  },
};
