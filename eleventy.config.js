// Configuración de Eleventy para el sitio de Idearium Caribe.
export default function (eleventyConfig) {
  // Archivos que se copian tal cual al sitio publicado.
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "_includes/logo.svg": "assets/logo.svg" });
  eleventyConfig.addPassthroughCopy("colombeia/articulos");
  eleventyConfig.addPassthroughCopy("colombeia/portadas");
  eleventyConfig.addPassthroughCopy({ "_headers": "_headers", "_redirects": "_redirects" });
  // Lector de PDF (PDF.js), tomado del paquete instalado.
  eleventyConfig.addPassthroughCopy({
    "node_modules/pdfjs-dist/legacy/build/pdf.min.mjs": "assets/pdfjs/pdf.min.mjs",
    "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs": "assets/pdfjs/pdf.worker.min.mjs",
  });

  eleventyConfig.addGlobalData("anio_actual", () => new Date().getFullYear());

  // Números de Colombeia, del primero al último.
  eleventyConfig.addCollection("numeros", (api) =>
    api.getFilteredByGlob("colombeia/numeros/*.md").sort((a, b) => a.data.numero - b.data.numero)
  );

  const porOrden = (a, b) => (a.data.orden ?? 0) - (b.data.orden ?? 0) || a.data.titulo.localeCompare(b.data.titulo, "es");
  eleventyConfig.addFilter("delNumero", (arts, n) => (arts || []).filter((a) => Number(a.data.numero) === Number(n)).sort(porOrden));
  eleventyConfig.addFilter("numeroPorId", (nums, n) => (nums || []).find((x) => Number(x.data.numero) === Number(n)) || { data: {} });
  eleventyConfig.addFilter("porSeccion", (arts) => {
    const grupos = [];
    for (const a of arts || []) {
      const ult = grupos[grupos.length - 1];
      if (ult && ult.seccion === a.data.seccion) ult.items.push(a);
      else grupos.push({ seccion: a.data.seccion, items: [a] });
    }
    return grupos;
  });
  eleventyConfig.addFilter("posicion", (arts, url) => {
    const i = (arts || []).findIndex((a) => a.url === url);
    return { anterior: i > 0 ? arts[i - 1] : null, siguiente: i >= 0 && i < arts.length - 1 ? arts[i + 1] : null };
  });
  eleventyConfig.addFilter("listaAutores", (autores) => {
    const l = (Array.isArray(autores) ? autores : [autores]).filter(Boolean);
    return l.length < 2 ? l.join("") : l.slice(0, -1).join(", ") + " y " + l[l.length - 1];
  });
  eleventyConfig.addFilter("urlLimpia", (u) => String(u).replace(/index\.html$/, "").replace(/\.html$/, ""));

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
