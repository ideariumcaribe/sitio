// Configuración de Eleventy para el sitio de Idearium Caribe.
import fs from "node:fs";
import { slugAutor } from "./lib/slug.js";
import * as CIFRAS from "./lib/cifras.js";
const DERECHOS = JSON.parse(fs.readFileSync(new URL("./_data/derechos.json", import.meta.url), "utf8"));
const AUTORIDADES = JSON.parse(fs.readFileSync(new URL("./_data/autoridades.json", import.meta.url), "utf8"));
// Enlaces de autoridad de un autor (Wikidata, VIAF, Biblioteca del Congreso, BNE).
const enlacesAutor = (n) => { const a = AUTORIDADES[n] || {}; return [
  a.wikidata && { nombre: "Wikidata", url: `https://www.wikidata.org/wiki/${a.wikidata}` },
  a.viaf && { nombre: "VIAF", url: `https://viaf.org/viaf/${a.viaf}` },
  a.lc && { nombre: "Biblioteca del Congreso", nombre_en: "Library of Congress", url: `https://id.loc.gov/authorities/names/${a.lc}` },
  a.bne && { nombre: "Biblioteca Nacional de España", nombre_en: "National Library of Spain", url: `https://datos.bne.es/resource/${a.bne}` },
].filter(Boolean); };
const formasAutor = Object.fromEntries(JSON.parse(fs.readFileSync(new URL("./_data/ordenAutores.json", import.meta.url), "utf8")).map((a) => [a.nombre, a.forma_catalogo]));
// ORCID de los autores de Colombeia (_data/orcid.json, editable en Pages CMS).
const ORCID = Object.fromEntries(JSON.parse(fs.readFileSync(new URL("./_data/orcid.json", import.meta.url), "utf8")).filter((a) => a.nombre && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(String(a.orcid || "").trim())).map((a) => [a.nombre.trim(), a.orcid.trim()]));
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
  // security.txt: caduca un año después de cada compilación (RFC 9116).
  eleventyConfig.addGlobalData("expira_seguridad", () => new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d{3}Z$/, ".000Z"));
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
  // Datos estructurados (schema.org) de una obra de la Biblioteca.
  eleventyConfig.addFilter("ldObra", (o, url, mats, naan) => {
    const autores = String(o.autor || "").split(";").map((x) => x.trim()).filter(Boolean);
    const { editorial } = pieDe(o.pie_de_imprenta);
    const ld = {
      "@context": "https://schema.org", "@type": "Book", "@id": url, url, name: o.titulo,
      author: autores.map((n) => { const e = enlacesAutor(n).map((x) => x.url); return { "@type": corporativo(formaDe(n)) ? "Organization" : "Person", name: n, ...(e.length ? { sameAs: e } : {}) }; }),
      datePublished: o.anio || undefined, publisher: editorial ? { "@type": "Organization", name: editorial } : undefined,
      inLanguage: o.signatura === "IC-0211" ? "it" : "es", identifier: naan ? [o.signatura, `https://n2t.net/ark:${naan}/${o.signatura}`] : o.signatura,
      about: (o.materias || []).map((s) => (mats || []).find((m) => m.slug === s)).filter(Boolean).map((m) => m.nombre),
      image: fs.existsSync(new URL(`./assets/portadas/${o.identificador}.webp`, import.meta.url)) ? `https://www.ideariumcaribe.com/assets/portadas/${o.identificador}.webp` : "https://archive.org/services/img/" + o.identificador,
      sameAs: "https://archive.org/details/" + o.identificador,
      isAccessibleForFree: true, bookFormat: "https://schema.org/EBook",
      usageInfo: DERECHOS[o.derechos_eeuu] ? DERECHOS[o.derechos_eeuu].uri : undefined,
      isPartOf: { "@type": "Collection", name: "Biblioteca Digital de Idearium Caribe", url: "https://www.ideariumcaribe.com/biblioteca/catalogo/" },
      provider: { "@type": "Organization", name: "Idearium Caribe Co.", url: "https://www.ideariumcaribe.com/" },
    };
    if (o.primera_edicion && o.primera_edicion !== o.anio) ld.description ="Primera edición: " + o.primera_edicion + ".";
    return JSON.stringify(ld).replace(/</g, "\\u003c");
  });
  eleventyConfig.addFilter("enlacesAutor", enlacesAutor);
  // Portada de una obra: copia local (assets/portadas, generada con scripts/portadas.py) o, si falta, la miniatura de Internet Archive.
  eleventyConfig.addFilter("portada", (o, absoluta) => {
    const id = o && o.identificador; if (!id) return "";
    return fs.existsSync(new URL(`./assets/portadas/${id}.webp`, import.meta.url)) ? (absoluta ? "https://www.ideariumcaribe.com" : "") + `/assets/portadas/${id}.webp` : `https://archive.org/services/img/${id}`;
  });
  // Datos para los filtros del catálogo: década, situación de derechos y temas de cada obra.
  eleventyConfig.addFilter("decada", (a) => { const n = parseInt(a, 10); return n ? String(Math.floor(n / 10) * 10) : ""; });
  eleventyConfig.addFilter("decadas", (lista) => { const c = {}; for (const o of lista || []) { const n = parseInt(o.anio, 10); if (n) { const d = Math.floor(n / 10) * 10; c[d] = (c[d] || 0) + 1; } } return Object.keys(c).sort().map((d) => ({ d, n: c[d] })); });
  eleventyConfig.addFilter("derechoCat", (o) => (o.autorizacion ? "autorizada " : "") + (o.derechos_eeuu || ""));
  eleventyConfig.addFilter("cuentaFiltro", (lista, campo, valor) => (lista || []).filter((o) => campo === "materia" ? (o.materias || []).includes(valor) : campo === "autorizada" ? !!o.autorizacion : o[campo] === valor).length);
  // Registro de cambios: fechas distintas (de la más reciente a la más antigua), fecha larga y cursivas con *asteriscos*.
  eleventyConfig.addFilter("fechasUnicas", (l) => [...new Set((l || []).map((c) => c.fecha))].sort().reverse());
  eleventyConfig.addFilter("fechaLarga", (f, idi) => { const [a, m, d] = String(f).split("-").map(Number); const fecha = new Date(Date.UTC(a, m - 1, d));
    return idi === "en" ? fecha.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : `${d} de ${fecha.toLocaleDateString("es-ES", { month: "long", timeZone: "UTC" })} de ${a}`; });
  eleventyConfig.addFilter("cursivas", (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*([^*]+)\*/g, "<i>$1</i>"));
  // Imagen para compartir generada con scripts/tarjetas-og.cjs (assets/og/...), si existe.
  eleventyConfig.addFilter("ogImagen", (archivo) => (archivo && fs.existsSync(new URL(`./assets/og/${archivo}`, import.meta.url)) ? `https://www.ideariumcaribe.com/assets/og/${archivo}` : ""));
  // Texto plano (OCR) de una obra en Internet Archive (_data/textosIA.json, generado con scripts/textos.py).
  const TEXTOS = JSON.parse(fs.readFileSync(new URL("./_data/textosIA.json", import.meta.url), "utf8"));
  eleventyConfig.addFilter("textoIA", (id) => { const t = TEXTOS[id]; return t && t.archivo ? { url: `https://archive.org/download/${id}/${encodeURIComponent(t.archivo)}`, mb: (t.bytes / 1048576).toFixed(1).replace(".", ",") } : null; });
  // Colección (obra en varios tomos) a la que pertenece una obra, con su número de tomo.
  eleventyConfig.addFilter("coleccionDe", (o, cols) => { for (const c of cols || []) { const t = c.tomos.find((x) => x.identificador === o.identificador); if (t) { const ed = c.ediciones.find((e) => e.tomos.some((x) => x.identificador === o.identificador)); return { c, tomo: t.tomo, total: ed.tomos.length, varias: c.ediciones.length > 1 }; } } return null; });
  // Últimas incorporaciones para la portada: los tomos de una misma colección cuentan como una sola entrada.
  eleventyConfig.addFilter("recientesAgrupadas", (cat, cols, n = 4) => {
    const out = [], vistas = new Set();
    for (const o of (cat || []).slice().sort((a, b) => b.signatura.localeCompare(a.signatura))) {
      const c = (cols || []).find((x) => x.tomos.some((t) => t.identificador === o.identificador));
      if (c) { if (vistas.has(c.slug)) continue; vistas.add(c.slug); out.push({ obra: o, url: `/biblioteca/colecciones/${c.slug}/`, titulo: `${c.titulo} (${c.tomos.length} tomos)`, titulo_en: `${c.titulo} (${c.tomos.length} volumes)` }); }
      else out.push({ obra: o, url: `/biblioteca/obras/${o.identificador}/`, titulo: o.titulo, titulo_en: o.titulo });
      if (out.length >= n) break;
    }
    return out;
  });
  eleventyConfig.addFilter("coleccionesDeAutor", (cols, n) => (cols || []).filter((c) => String(c.autor || "").split(";").map((x) => x.trim()).includes(n)));
  // La Biblioteca en cifras (lib/cifras.js).
  eleventyConfig.addFilter("cifras", (cat, mats, cols, arts, nums) => CIFRAS.datos(cat, mats, cols, arts, nums));
  // Cada gráfico se genera en dos tamaños (escritorio y móvil) para que el texto sea legible en ambos.
  const dos = (d, m) => `<div class="graf-d">${d}</div><div class="graf-m">${m}</div>`;
  eleventyConfig.addFilter("grafColumnas", (serie, titulo) => dos(CIFRAS.columnas(serie, { titulo }), CIFRAS.columnas(serie, { titulo, ancho: 360, alto: 220, saltar: 2 })));
  eleventyConfig.addFilter("grafBarras", (serie, titulo, etiqueta) => dos(CIFRAS.barras(serie, { titulo, etiqueta: etiqueta || 250 }), CIFRAS.barras(serie, { titulo, ancho: 360, apilado: true })));
  eleventyConfig.addFilter("grafLinea", (serie, titulo) => dos(CIFRAS.linea(serie, { titulo }), CIFRAS.linea(serie, { titulo, ancho: 360, alto: 220, etiquetas: 3 })));
  eleventyConfig.addFilter("miles", (n) => CIFRAS.fmt(n));
  eleventyConfig.addFilter("orcid", (n) => ORCID[String(n || "").trim()] || "");
  // Fecha AAAA-MM-DD a partir de una fecha YAML (objeto Date) o de un texto.
  eleventyConfig.addFilter("fechaIso", (f) => (f instanceof Date ? f.toISOString().slice(0, 10) : String(f || "").slice(0, 10)));
  // Datos estructurados (schema.org) de un artículo de Colombeia.
  eleventyConfig.addFilter("ldArticulo", (d, url, num, sitio) => {
    const autores = (d.autores || []).filter(Boolean);
    const ld = {
      "@context": "https://schema.org", "@type": "ScholarlyArticle", "@id": url, url,
      headline: d.titulo + (d.subtitulo ? ": " + d.subtitulo : ""),
      author: autores.map((n) => n === "Consejo editorial" ? { "@type": "Organization", name: n } : { "@type": "Person", name: n, ...(ORCID[n] ? { sameAs: "https://orcid.org/" + ORCID[n] } : {}) }),
      ...(d.editor ? { editor: { "@type": "Person", name: d.editor } } : {}),
      datePublished: num && num.data ? String(num.data.anio) : undefined,
      inLanguage: "es", isAccessibleForFree: true,
      abstract: d.resumen || undefined, keywords: (d.palabras_clave || []).join(", ") || undefined,
      pageStart: d.pagina_inicial || undefined, pageEnd: d.pagina_final || undefined,
      ...(d.doi ? { identifier: "https://doi.org/" + d.doi, sameAs: "https://doi.org/" + d.doi } : {}),
      ...(d.licencia === "CC BY 4.0" ? { license: "https://creativecommons.org/licenses/by/4.0/" } : {}),
      encoding: d.pdf ? { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: sitio.url + d.pdf } : undefined,
      isPartOf: { "@type": "PublicationIssue", issueNumber: String(d.numero), ...(num && num.url ? { url: sitio.url + num.url } : {}),
        isPartOf: { "@type": "Periodical", name: "Colombeia", issn: sitio.issn, url: sitio.url + "/colombeia.html" } },
      publisher: { "@type": "Organization", name: sitio.nombre, url: sitio.url + "/" },
    };
    return JSON.stringify(ld).replace(/</g, "\\u003c");
  });
  // Canal RSS de Colombeia: artículos del número más reciente primero; fecha = primer día del bimestre del número (n.º 1 = septiembre de 2025).
  eleventyConfig.addFilter("articulosRecientes", (arts) => (arts || []).slice().sort((a, b) => b.data.numero - a.data.numero || (a.data.orden ?? 0) - (b.data.orden ?? 0)));
  eleventyConfig.addFilter("fechaNumero", (n) => { const m = 8 + 2 * (Number(n) - 1); return `${2025 + Math.floor(m / 12)}-${String((m % 12) + 1).padStart(2, "0")}-01`; });
  eleventyConfig.addFilter("tamanoArchivo", (ruta) => { try { return fs.statSync(new URL("." + ruta, import.meta.url)).size; } catch { return 0; } });
  // Obras relacionadas: mismo autor primero, luego temas en común; como máximo dos volúmenes de una misma obra.
  eleventyConfig.addFilter("relacionadas", (lista, o, n = 6) => {
    const aut = new Set(String(o.autor || "").split(";").map((x) => x.trim()).filter(Boolean));
    const mats = new Set(o.materias || []);
    const base = (t) => String(t || "").split(/\. (Vol|Tomo)\b/)[0].trim();
    const puntuadas = (lista || []).filter((x) => x.identificador !== o.identificador).map((x) => {
      const comunesA = String(x.autor || "").split(";").map((y) => y.trim()).filter((y) => aut.has(y)).length;
      const comunesM = (x.materias || []).filter((m) => mats.has(m)).length;
      return { x, p: comunesA * 3 + comunesM };
    }).filter((r) => r.p > 0).sort((a, b) => b.p - a.p || a.x.signatura.localeCompare(b.x.signatura));
    // Como máximo dos volúmenes por obra en varios tomos (incluida la propia).
    const out = []; const vistos = {};
    for (const r of puntuadas) {
      const k = base(r.x.titulo).toLowerCase(); vistos[k] = (vistos[k] || 0) + 1;
      if (vistos[k] > 2) continue;
      out.push(r.x); if (out.length >= n) break;
    }
    return out;
  });
  // Fechas de vida de un autor (Wikidata): «(1897–1958)», «(n. 1948)» o vacío.
  eleventyConfig.addFilter("fechasAutor", (nombre) => { const a = AUTORIDADES[nombre] || {}; return a.nace && a.muere ? `${a.nace}–${a.muere}` : a.nace ? `n. ${a.nace}` : a.muere ? `m. ${a.muere}` : ""; });
  // Citas descargables para gestores bibliográficos (RIS y BibTeX).
  const bibEsc = (s) => String(s || "").replace(/([&%$#_])/g, "\\$1");
  const risL = (k, v) => (v ? `${k}  - ${String(v).replace(/\s+/g, " ").trim()}\r\n` : "");
  const bibAut = (formas) => formas.map((f) => (corporativo(f) ? `{${bibEsc(f)}}` : bibEsc(f))).join(" and ");
  const urlObra = (o, naan) => (naan ? `https://n2t.net/ark:${naan}/${o.signatura}` : `https://www.ideariumcaribe.com/biblioteca/obras/${o.identificador}/`);
  eleventyConfig.addFilter("risObra", (o, mats, naan) => {
    const { lugar, editorial } = pieDe(o.pie_de_imprenta);
    const autores = String(o.autor || "").split(";").map((x) => x.trim()).filter(Boolean).map(formaDe);
    const temas = (o.materias || []).map((s) => ((mats || []).find((m) => m.slug === s) || {}).nombre).filter(Boolean);
    return "TY  - BOOK\r\n" + autores.map((a) => risL("AU", a)).join("") + risL("TI", o.titulo) + risL("PY", o.anio) + risL("CY", lugar) + risL("PB", editorial)
      + risL("LA", o.signatura === "IC-0211" ? "ita" : "spa") + temas.map((t) => risL("KW", t)).join("") + risL("N1", o.primera_edicion && o.primera_edicion !== o.anio ? `Primera edición: ${o.primera_edicion}.` : "")
      + risL("DB", "Biblioteca Digital de Idearium Caribe") + risL("AN", o.signatura) + risL("UR", urlObra(o, naan)) + "ER  - \r\n";
  });
  eleventyConfig.addFilter("bibObra", (o, mats, naan) => {
    const { lugar, editorial } = pieDe(o.pie_de_imprenta);
    const autores = String(o.autor || "").split(";").map((x) => x.trim()).filter(Boolean).map(formaDe);
    const temas = (o.materias || []).map((s) => ((mats || []).find((m) => m.slug === s) || {}).nombre).filter(Boolean);
    const c = [["author", bibAut(autores)], ["title", `{${bibEsc(o.titulo)}}`], ["year", o.anio], ["address", bibEsc(lugar)], ["publisher", bibEsc(editorial)],
      ["language", o.signatura === "IC-0211" ? "italian" : "spanish"], ["keywords", bibEsc(temas.join(", "))], ["url", urlObra(o, naan)], ["note", `Biblioteca Digital de Idearium Caribe, ${o.signatura}`]];
    return `@book{${o.signatura.replace("-", "")},\n` + c.filter(([, v]) => v).map(([k, v]) => `  ${k} = {${v}}`).join(",\n") + "\n}\n";
  });
  // Autores de Colombeia sin forma de catálogo: «Leonardo L. González Contreras» → «González Contreras, Leonardo L.».
  const CORPORATIVOS = ["Consejo editorial"];
  const FORMAS_COLOMBEIA = { "Luis Alejandro Niebles": "Niebles, Luis Alejandro", "José Alfredo Paniagua": "Paniagua, José Alfredo", "José Gregorio Sáez": "Sáez, José Gregorio",
    "Ramón de Basterra": "Basterra, Ramón de", "Ramiro Guerra y Sánchez": "Guerra y Sánchez, Ramiro" };
  const invertir = (n) => {
    if (formasAutor[n]) return formasAutor[n];
    if (FORMAS_COLOMBEIA[n]) return FORMAS_COLOMBEIA[n];
    if (CORPORATIVOS.includes(n)) return n;
    const t = String(n).trim().split(/\s+/); if (t.length < 2) return n;
    let k = t.length >= 3 && !/\.$/.test(t[t.length - 2]) ? t.length - 2 : t.length - 1;
    while (k > 1 && /^(de|del|la|las|los|y)$/i.test(t[k - 1])) k--;
    return t.slice(k).join(" ") + ", " + t.slice(0, k).join(" ");
  };
  const anioNumero = (n) => { const m = 8 + 2 * (Number(n) - 1); return String(2025 + Math.floor(m / 12)); };
  eleventyConfig.addFilter("risArticulo", (a, url, issn) => {
    const d = a.data; const t = d.titulo + (d.subtitulo ? ": " + d.subtitulo : "");
    return "TY  - JOUR\r\n" + (d.autores || []).map((x) => risL("AU", invertir(x))).join("") + risL("TI", t) + risL("JO", "Colombeia") + risL("SN", issn)
      + risL("IS", d.numero) + risL("PY", anioNumero(d.numero)) + risL("SP", d.pagina_inicial) + risL("EP", d.pagina_final) + risL("AB", d.resumen)
      + (d.palabras_clave || []).map((k) => risL("KW", k)).join("") + risL("DO", d.doi) + risL("LA", "spa") + risL("UR", url)
      + risL("L1", d.pdf ? "https://www.ideariumcaribe.com" + d.pdf : "") + "ER  - \r\n";
  });
  eleventyConfig.addFilter("bibArticulo", (a, url, issn) => {
    const d = a.data; const t = d.titulo + (d.subtitulo ? ": " + d.subtitulo : "");
    const pags = d.pagina_inicial ? `${d.pagina_inicial}--${d.pagina_final}` : "";
    const c = [["author", bibAut((d.autores || []).map(invertir))], ["title", `{${bibEsc(t)}}`], ["journal", "Colombeia"], ["number", d.numero], ["year", anioNumero(d.numero)],
      ["pages", pags], ["issn", issn], ["doi", d.doi], ["url", url], ["keywords", bibEsc((d.palabras_clave || []).join(", "))], ["language", "spanish"]];
    return `@article{${a.page.fileSlug.replace(/[^a-z0-9]/gi, "")},\n` + c.filter(([, v]) => v).map(([k, v]) => `  ${k} = {${v}}`).join(",\n") + "\n}\n";
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
  // Autores de Colombeia que figuran con otro nombre en el catálogo de la Biblioteca.
  const EQUIV_COLOMBEIA = { "J. E. Casariego": "Jesús Evaristo Casariego" };
  const enBiblioteca = (n) => EQUIV_COLOMBEIA[String(n || "").trim()] || String(n || "").trim();
  eleventyConfig.addFilter("deAutor", (arts, nombre) => (arts || []).filter((a) => (a.data.autores || []).map(enBiblioteca).includes(nombre) || enBiblioteca(a.data.editor) === nombre));
  // Obras de la Biblioteca de los autores de un artículo de Colombeia: [{ nombre, slug, obras }].
  eleventyConfig.addFilter("obrasDeAutores", (autores, catalogo) => (autores || []).map(enBiblioteca).map((n) => {
    const obras = (catalogo || []).filter((o) => String(o.autor || "").split(";").map((x) => x.trim()).includes(n)).sort((a, b) => a.signatura.localeCompare(b.signatura));
    return { nombre: n, slug: slugAutor(n), obras };
  }).filter((x) => x.obras.length));
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

  // Buscador del sitio (Pagefind): se indexa _site al terminar cada compilación.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const pagefind = await import("pagefind");
    const { index } = await pagefind.createIndex({
      forceLanguage: "es",
      excludeSelectors: [".en", ".obras-relacionadas", ".compartir", ".cita-descargas", ".solo-impresion", ".obra-ark", ".obra-derechos", ".obra-permiso", ".sig-label", ".migas", ".art-nav", ".obra-nav", ".como-citar", ".buscar-texto", ".visor", ".obra-acciones", ".obra-materias .label", ".aut-retrato", ".aut-wiki", ".art-biblioteca", ".en-colombeia", ".senalar-error", ".solicitar", ".saltar", "nav", "script"],
    });
    await index.addDirectory({ path: dir.output });
    await index.writeFiles({ outputPath: dir.output + "/pagefind" });
    await pagefind.close();
    const { revisarEnlaces } = await import("./lib/enlaces.js");
    revisarEnlaces(dir.output);
  });

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html", "11ty.js"],
  };
}
