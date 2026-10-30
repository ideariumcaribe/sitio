// Configuración de Eleventy para el sitio de Idearium Caribe.
import fs from "node:fs";
import { slugAutor } from "./lib/slug.js";
const formasAutor = Object.fromEntries(JSON.parse(fs.readFileSync(new URL("./_data/ordenAutores.json", import.meta.url), "utf8")).map((a) => [a.nombre, a.forma_catalogo]));
const llave = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[«»"“”¿¡]/g, "").trim();
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
  // Versión de compilación: se añade a las URL de CSS y JS para que los navegadores no usen copias viejas.
  eleventyConfig.addGlobalData("version", () => Date.now().toString(36));

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
  eleventyConfig.addFilter("sinTildes", (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  eleventyConfig.addFilter("vecinosObra", (lista, id) => {
    const i = (lista || []).findIndex((o) => o.identificador === id);
    return { anterior: i > 0 ? lista[i - 1] : null, siguiente: i >= 0 && i < lista.length - 1 ? lista[i + 1] : null };
  });
  eleventyConfig.addFilter("slugAutor", slugAutor);
  // Materias de la Biblioteca.
  // Cómo citar una obra de la Biblioteca (Chicago y APA, adaptados al español).
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const formaDe = (n) => formasAutor[n] || n;
  const corporativo = (f) => f.indexOf(",") === -1;
  const unirY = (l) => l.length <= 1 ? (l[0] || "") : l.slice(0, -1).join(", ") + " y " + l[l.length - 1];
  const fin = (s) => /[.?!]$/.test(s) ? s : s + ".";
  const iniciales = (nombres) => nombres.replace(/\(.*?\)/g, "").trim().split(/\s+/).map((w) => /^[A-ZÁÉÍÓÚÑÜ]/.test(w) ? w.split("-").map((p) => p.charAt(0) + ".").join("-") : w).join(" ");
  const pieDe = (p) => { const s = String(p || ""); const i = s.indexOf(","); return i >= 0 ? { lugar: s.slice(0, i).trim(), editorial: s.slice(i + 1).trim() } : { lugar: "", editorial: s.trim() }; };
  eleventyConfig.addFilter("formaAutor", formaDe);
  eleventyConfig.addFilter("editorialDe", (p) => pieDe(p).editorial);
  eleventyConfig.addFilter("citas", (o, url) => {
    const autores = String(o.autor || "").split(";").map((x) => x.trim()).filter(Boolean);
    const formas = autores.map(formaDe);
    const anio = o.anio || "s. f.";
    const { lugar, editorial } = pieDe(o.pie_de_imprenta);
    const titulo = "<i>" + esc(fin(o.titulo)) + "</i>";
    const fuente = "Biblioteca Digital de Idearium Caribe, " + esc(o.signatura) + ". " + esc(url);
    // Chicago (bibliografía): primer autor invertido, los demás en orden natural.
    const chiAut = formas.length ? fin(unirY(formas.map((f, i) => i === 0 || corporativo(f) ? f : autores[i]))) : "";
    const chicago = (chiAut ? esc(chiAut) + " " : "") + titulo + " " + esc((lugar ? lugar + ": " : "") + editorial + ", " + anio) + ". " + fuente + ".";
    // APA 7: apellidos e iniciales; la editorial se omite si coincide con el autor.
    const apaAut = formas.map((f) => {
      if (corporativo(f)) return f;
      const nombres = f.split(",").slice(1).join(",").replace(/\(.*?\)/g, "").trim().split(/\s+/);
      const particulas = nombres.filter((w) => /^[a-zà-ÿ]/.test(w));
      const propios = nombres.filter((w) => !/^[a-zà-ÿ]/.test(w)).join(" ");
      return (particulas.length ? particulas.join(" ") + " " : "") + f.split(",")[0].trim() + ", " + iniciales(propios);
    });
    const apaEd = editorial && !formas.includes(editorial) ? " " + esc(fin(editorial)) : "";
    const apa = (apaAut.length ? esc(fin(unirY(apaAut))) + " " : "") + "(" + esc(anio) + "). " + titulo + apaEd + " " + esc(url);
    return { chicago, apa };
  });
  eleventyConfig.addFilter("recientes", (lista, n) => (lista || []).slice().sort((a, b) => b.signatura.localeCompare(a.signatura)).slice(0, n || 6));
  eleventyConfig.addFilter("fechaRss", (f) => { const d = new Date(String(f || "") + "T12:00:00Z"); return isNaN(d) ? "" : d.toUTCString(); });
  eleventyConfig.addFilter("deMateria", (lista, slug) => (lista || []).filter((o) => (o.materias || []).includes(slug)).sort((a, b) => a.signatura.localeCompare(b.signatura)));
  eleventyConfig.addFilter("materia", (todas, slug) => (todas || []).find((m) => m.slug === slug) || { slug, nombre: slug, nombre_en: slug });
  // Claves de orden del catálogo: título sin artículo inicial, primer autor por apellido, editorial sin la ciudad.
  eleventyConfig.addFilter("claveTitulo", (t) => llave(t).replace(/^(el|la|los|las|lo|un|una|unos|unas)\s+/, ""));
  eleventyConfig.addFilter("claveAutor", (a) => { const n = String(a || "").split(";")[0].trim(); return llave((formasAutor[n] || n).replace(/,/g, "  ")); });
  eleventyConfig.addFilter("claveEditorial", (p) => { const s = String(p || ""); const i = s.indexOf(","); return llave(i >= 0 ? s.slice(i + 1) : s); });
  eleventyConfig.addFilter("split", (s, sep) => String(s || "").split(sep).map((x) => x.trim()).filter(Boolean));
  eleventyConfig.addFilter("otrosAutores", (s, nombre) => String(s || "").split(";").map((x) => x.trim()).filter((x) => x && x !== nombre).join(", "));
  eleventyConfig.addFilter("deAutor", (arts, nombre) => (arts || []).filter((a) => (a.data.autores || []).includes(nombre) || a.data.editor === nombre));
  eleventyConfig.addFilter("porInicial", (autores) => {
    const grupos = [];
    for (const a of autores || []) {
      const ult = grupos[grupos.length - 1];
      if (ult && ult.letra === a.inicial) ult.autores.push(a);
      else grupos.push({ letra: a.inicial, autores: [a] });
    }
    return grupos;
  });
  eleventyConfig.addFilter("urlLimpia", (u) => String(u).replace(/index\.html$/, "").replace(/\.html$/, ""));

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
