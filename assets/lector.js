// Lector de PDF de Colombeia, basado en PDF.js (Mozilla).
// Dibuja cada página cuando entra en pantalla y añade una capa de texto
// para que se pueda seleccionar, copiar y buscar con Ctrl+F.
import * as pdfjsLib from "/assets/pdfjs/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdfjs/pdf.worker.min.mjs";

const caja = document.querySelector(".lector");
if (caja) iniciar(caja);

async function iniciar(caja) {
  const url = caja.dataset.pdf;
  const zona = caja.querySelector(".lector-paginas");
  const estado = caja.querySelector(".lector-estado");
  const en = () => document.body.getAttribute("data-lang") === "en";
  // La barra del lector se queda fija justo debajo de la cabecera del sitio.
  const cab = document.querySelector("header.top");
  const fijarBarra = () => caja.style.setProperty("--alto-cab", `${cab ? cab.offsetHeight : 0}px`);
  fijarBarra();
  const decir = (es, ing) => { estado.textContent = en() ? ing : es; };

  decir("Cargando…", "Loading…");
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ url, isEvalSupported: false }).promise;
  } catch (e) {
    decir("No se pudo abrir el lector. Use «Descargar PDF».", "The reader could not open. Use “Download PDF”.");
    return;
  }

  const primera = await pdf.getPage(1);
  const base = primera.getViewport({ scale: 1 });
  let zoom = 1; // 1 = ajustado al ancho disponible
  const paginas = [];
  const dibujadas = new Map();

  const anchoDisponible = () => {
    const cs = getComputedStyle(zona);
    return Math.max(240, zona.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
  };
  const escala = () => (anchoDisponible() / base.width) * zoom;

  for (let n = 1; n <= pdf.numPages; n++) {
    const p = document.createElement("div");
    p.className = "lector-pagina";
    p.dataset.n = n;
    p.setAttribute("aria-label", `Página ${n}`);
    zona.appendChild(p);
    paginas.push(p);
  }

  function dimensionar() {
    const s = escala();
    for (const p of paginas) {
      p.style.width = `${Math.floor(base.width * s)}px`;
      p.style.height = `${Math.floor(base.height * s)}px`;
    }
  }

  async function dibujar(p) {
    const n = Number(p.dataset.n);
    const s = escala();
    if (dibujadas.get(n) === s) return;
    dibujadas.set(n, s);
    const page = n === 1 ? primera : await pdf.getPage(n);
    const vp = page.getViewport({ scale: s });
    const ratio = window.devicePixelRatio || 1;
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.floor(vp.width * ratio);
    lienzo.height = Math.floor(vp.height * ratio);
    lienzo.style.width = `${Math.floor(vp.width)}px`;
    lienzo.style.height = `${Math.floor(vp.height)}px`;
    const ctx = lienzo.getContext("2d");
    await page.render({ canvasContext: ctx, canvas: lienzo, viewport: vp, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null }).promise;
    if (dibujadas.get(n) !== s) return; // cambió el zoom mientras se dibujaba
    const capa = document.createElement("div");
    capa.className = "textLayer";
    p.style.setProperty("--scale-factor", s);
    p.style.setProperty("--total-scale-factor", s);
    p.replaceChildren(lienzo, capa);
    try {
      await new pdfjsLib.TextLayer({ textContentSource: page.streamTextContent(), container: capa, viewport: vp }).render();
    } catch (e) { /* la página se ve igual aunque falle la capa de texto */ }
  }

  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) dibujar(e.target);
  }, { rootMargin: "600px 0px" });

  function actualizarEstado() {
    const arriba = zona.getBoundingClientRect().top;
    let actual = 1;
    const mitad = window.innerHeight / 2;
    for (const p of paginas) { if (p.getBoundingClientRect().top <= mitad) actual = Number(p.dataset.n); }
    if (arriba > 0) actual = 1;
    decir(`Página ${actual} de ${pdf.numPages}`, `Page ${actual} of ${pdf.numPages}`);
  }

  function redibujar() {
    dimensionar();
    for (const p of paginas) {
      const r = p.getBoundingClientRect();
      if (r.bottom > -600 && r.top < window.innerHeight + 600) dibujar(p);
    }
  }

  dimensionar();
  paginas.forEach((p) => observador.observe(p));
  actualizarEstado();
  window.addEventListener("scroll", actualizarEstado, { passive: true });

  caja.querySelectorAll("[data-acc]").forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.acc;
    if (a === "mas") zoom = Math.min(3, zoom * 1.25);
    if (a === "menos") zoom = Math.max(0.5, zoom / 1.25);
    if (a === "ajustar") zoom = 1;
    redibujar();
  }));

  let espera;
  window.addEventListener("resize", () => { clearTimeout(espera); espera = setTimeout(() => { fijarBarra(); redibujar(); }, 200); });
  document.querySelectorAll(".langs button").forEach((b) => b.addEventListener("click", actualizarEstado));
}
