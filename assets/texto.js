// Búsqueda en el texto de las obras (índice Pagefind propio en /biblioteca/texto/pagefind/). Admite ?q= y ?tema= en la dirección.
// Cada obra está indexada en tramos de veinte páginas: los resultados llegan por tramos y se agrupan aquí por obra.
(function () {
  var f = document.querySelector(".texto-buscar"); if (!f) return;
  var en = function () { return document.documentElement.lang === "en"; };
  var t = function (es, ing) { return en() ? ing : es; };
  var q = f.querySelector("#tx-q"), tema = f.querySelector("#tx-tema");
  var estado = document.querySelector(".tx-estado"), lista = document.querySelector(".tx-resultados"), mas = document.querySelector(".tx-mas");
  var pf = null, cargando = null, fichas = {}, resultados = [], mostrados = 0, POR_TANDA = 10, turno = 0, bloques = {};
  function cargar() {
    if (pf) return Promise.resolve(pf);
    if (!cargando) cargando = Promise.all([import("/biblioteca/texto/indice/0/pagefind.js"), fetch("/biblioteca/texto/indice/obras.json").then(function (r) { return r.json(); })]).then(function (x) {
      var m = x[0]; fichas = x[1];
      var n = parseInt(f.dataset.grupos, 10) || 1, extra = [];
      for (var g = 1; g < n; g++) extra.push(m.mergeIndex("/biblioteca/texto/indice/" + g + "/", { baseUrl: "/" }));
      return m.options({ baseUrl: "/", excerptLength: 34 }).then(function () { return Promise.all(extra); }).then(function () { return m.init(); }).then(function () { return m.filters(); }).then(function () { pf = m; return m; });
    });
    return cargando;
  }
  // Precarga el buscador en cuanto el lector se dispone a escribir.
  q.addEventListener("focus", function () { cargar().catch(function () {}); }, { once: true });
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // /biblioteca/obras/{id}/t3/#n37 → /biblioteca/obras/{id}/?pagina=n37
  function aPagina(u) { var p = u.split("#"), base = p[0].replace(/t\d+\/$/, ""); return p[1] ? base + "?pagina=" + p[1] : base; }
  function etiqueta(s) { return en() ? String(s).replace(/^imagen /, "image ") : s; }
  function bloque(d) {
    var k = (d.meta || {}).signatura || d.url;
    if (bloques[k]) return bloques[k];
    var m = fichas[k] || {};
    var li = document.createElement("li");
    li.innerHTML = '<a class="tx-obra" href="' + esc(aPagina(d.url)) + '">' + (m.i ? '<img src="' + esc(m.i) + '" alt="" width="40" height="54" loading="lazy">' : "") +
      '<span><span class="tx-titulo">' + esc(m.t || "") + '</span><span class="cat-pie">' + esc([m.a, m.y, k].filter(Boolean).join(" · ")) + '</span></span></a><ol class="tx-paginas"></ol>';
    var b = document.createElement("button"); b.type = "button"; b.className = "tx-todas cita-copiar"; b.hidden = true;
    b.addEventListener("click", function () { li.querySelectorAll(".tx-paginas [hidden]").forEach(function (x) { x.hidden = false; }); b.hidden = true; });
    li.appendChild(b); lista.appendChild(li);
    return (bloques[k] = { li: li, ol: li.querySelector(".tx-paginas"), boton: b, n: 0 });
  }
  function pintar(d) {
    var subs = (d.sub_results || []).filter(function (s) { return s.url.indexOf("#n") !== -1; });
    if (!subs.length) return;
    var B = bloque(d);
    subs.forEach(function (s) {
      var li = document.createElement("li"); if (B.n >= 3) li.hidden = true;
      li.innerHTML = '<a href="' + esc(aPagina(s.url)) + '"><span class="bt-pag">' + esc(etiqueta(s.title)) + '</span><span class="bt-txt">' + s.excerpt + "</span></a>";
      B.ol.appendChild(li); B.n++;
    });
    var ocultas = B.ol.querySelectorAll("[hidden]").length;
    B.boton.hidden = !ocultas; B.boton.textContent = t("Ver " + ocultas + (ocultas === 1 ? " página más" : " páginas más"), "Show " + ocultas + " more " + (ocultas === 1 ? "page" : "pages"));
  }
  function tanda() {
    var mi = turno, trozo = resultados.slice(mostrados, mostrados + POR_TANDA);
    mostrados += trozo.length; mas.hidden = true;
    return Promise.all(trozo.map(function (r) { return r.data(); })).then(function (ds) {
      if (mi !== turno) return;
      ds.forEach(pintar);
      mas.hidden = mostrados >= resultados.length;
    });
  }
  function buscar(guardar) {
    var termino = q.value.trim(); if (!termino) return;
    var mi = ++turno; lista.innerHTML = ""; bloques = {}; mas.hidden = true; mostrados = 0;
    estado.textContent = t("Buscando…", "Searching…");
    if (guardar) { try { var p = new URLSearchParams(); p.set("q", termino); if (tema.value) p.set("tema", tema.value); history.replaceState(null, "", "?" + p.toString()); } catch (e) {} }
    cargar().then(function (pf) {
      return pf.search(termino, tema.value ? { filters: { tema: tema.value } } : {});
    }).then(function (s) {
      if (mi !== turno) return;
      resultados = (s && s.results) || [];
      if (!resultados.length) { estado.textContent = t("No se encontraron resultados.", "No results found."); return; }
      var obras = Object.keys((s.filters && s.filters.obra) || {}).filter(function (k) { return s.filters.obra[k] > 0; }).length;
      estado.textContent = obras ? obras + " " + t(obras === 1 ? "obra con resultados" : "obras con resultados", obras === 1 ? "work with results" : "works with results") : "";
      return tanda();
    }).catch(function () { if (mi === turno) estado.textContent = t("No se pudo realizar la búsqueda. Inténtelo de nuevo más tarde.", "The search could not be completed. Please try again later."); });
  }
  f.addEventListener("submit", function (e) { e.preventDefault(); buscar(true); });
  mas.querySelector("button").addEventListener("click", tanda);
  try {
    var p = new URLSearchParams(location.search);
    if (p.get("tema")) tema.value = p.get("tema");
    if (p.get("q")) { q.value = p.get("q"); buscar(false); }
  } catch (e) {}
})();
