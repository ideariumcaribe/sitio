// Búsqueda en el texto de las obras (índice Pagefind propio en /biblioteca/texto/pagefind/). Admite ?q= y ?tema= en la dirección.
(function () {
  var f = document.querySelector(".texto-buscar"); if (!f) return;
  var en = function () { return document.documentElement.lang === "en"; };
  var t = function (es, ing) { return en() ? ing : es; };
  var q = f.querySelector("#tx-q"), tema = f.querySelector("#tx-tema");
  var estado = document.querySelector(".tx-estado"), lista = document.querySelector(".tx-resultados"), mas = document.querySelector(".tx-mas");
  var pf = null, resultados = [], mostrados = 0, POR_TANDA = 8, turno = 0;
  function cargar() {
    if (pf) return Promise.resolve(pf);
    return import("/biblioteca/texto/pagefind/pagefind.js").then(function (m) { pf = m; return pf.options({ baseUrl: "/", excerptLength: 34 }).then(function () { return pf; }); });
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // /biblioteca/obras/{id}/#n37 → /biblioteca/obras/{id}/?pagina=n37
  function aPagina(u) { var p = u.split("#"); return p[1] ? p[0] + "?pagina=" + p[1] : p[0]; }
  function etiqueta(s) { return en() ? String(s).replace(/^imagen /, "image ") : s; }
  function pintar(r) {
    var d = r.data, m = d.meta || {}, subs = (d.sub_results || []).filter(function (s) { return s.url.indexOf("#n") !== -1; });
    var li = document.createElement("li");
    var cab = '<a class="tx-obra" href="' + esc(d.url) + '">' + (m.image ? '<img src="' + esc(m.image) + '" alt="" width="40" height="54" loading="lazy">' : "") +
      '<span><span class="tx-titulo">' + esc(m.title || "") + '</span><span class="cat-pie">' + esc([m.autor, m.anio, m.signatura].filter(Boolean).join(" · ")) + "</span></span></a>";
    var n = subs.length;
    var cuenta = n ? '<p class="tx-cuenta">' + n + " " + t(n === 1 ? "página con coincidencias" : "páginas con coincidencias", n === 1 ? "page with matches" : "pages with matches") + "</p>" : "";
    var pags = subs.map(function (s, i) {
      return '<li' + (i >= 3 ? " hidden" : "") + '><a href="' + esc(aPagina(s.url)) + '"><span class="bt-pag">' + esc(etiqueta(s.title)) + '</span><span class="bt-txt">' + s.excerpt + "</span></a></li>";
    }).join("");
    li.innerHTML = cab + cuenta + (n ? '<ol class="tx-paginas">' + pags + "</ol>" : '<p class="bt-txt">' + d.excerpt + "</p>") +
      (n > 3 ? '<button type="button" class="tx-todas cita-copiar">' + t("Ver las " + n + " páginas", "Show all " + n + " pages") + "</button>" : "");
    var b = li.querySelector(".tx-todas");
    if (b) b.addEventListener("click", function () { li.querySelectorAll(".tx-paginas [hidden]").forEach(function (x) { x.hidden = false; }); b.remove(); });
    lista.appendChild(li);
  }
  function tanda() {
    var mi = turno, trozo = resultados.slice(mostrados, mostrados + POR_TANDA);
    mostrados += trozo.length; mas.hidden = true;
    return Promise.all(trozo.map(function (r) { return r.data(); })).then(function (ds) {
      if (mi !== turno) return;
      ds.forEach(function (d) { pintar({ data: d }); });
      mas.hidden = mostrados >= resultados.length;
    });
  }
  function buscar(guardar) {
    var termino = q.value.trim(); if (!termino) return;
    var mi = ++turno; lista.innerHTML = ""; mas.hidden = true; mostrados = 0;
    estado.textContent = t("Buscando…", "Searching…");
    if (guardar) { try { var p = new URLSearchParams(); p.set("q", termino); if (tema.value) p.set("tema", tema.value); history.replaceState(null, "", "?" + p.toString()); } catch (e) {} }
    cargar().then(function (pf) {
      return pf.search(termino, tema.value ? { filters: { tema: tema.value } } : {});
    }).then(function (s) {
      if (mi !== turno) return;
      resultados = (s && s.results) || [];
      if (!resultados.length) { estado.textContent = t("No se encontraron resultados.", "No results found."); return; }
      estado.textContent = resultados.length + " " + t(resultados.length === 1 ? "obra con resultados" : "obras con resultados", resultados.length === 1 ? "work with results" : "works with results");
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
