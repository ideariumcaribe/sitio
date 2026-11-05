// Buscador del catálogo: filtra las obras por título, autor o editorial, sin distinguir tildes ni mayúsculas,
// y por tema, década y situación de derechos.
// Conmutador de vista: portadas (por defecto) o lista (se recuerda en este navegador).
(function () {
  var q = document.getElementById("cat-q");
  if (!q) return;
  var filas = Array.prototype.slice.call(document.querySelectorAll(".cat-tabla tbody tr"));
  var fichas = Array.prototype.slice.call(document.querySelectorAll(".cat-portadas li"));
  var cuenta = document.querySelector(".cat-cuenta");
  var tabla = document.querySelector(".cat-tabla") && document.querySelector(".cat-tabla").closest(".ledger-wrap");
  var grid = document.querySelector(".cat-portadas");
  var botones = Array.prototype.slice.call(document.querySelectorAll(".cat-vista button"));
  var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
  var filtros = Array.prototype.slice.call(document.querySelectorAll("select[data-filtro]"));
  var limpiar = document.querySelector(".cat-limpiar");
  var valorFiltro = function (k) { var s = filtros.filter(function (x) { return x.dataset.filtro === k; })[0]; return s ? s.value : ""; };
  function pasa(el, t, tema, dec, der, lug) {
    var d = el.dataset;
    return (!t || d.buscar.indexOf(t) !== -1) && (!tema || (" " + d.mat + " ").indexOf(" " + tema + " ") !== -1) &&
      (!dec || d.dec === dec) && (!der || (" " + d.der + " ").indexOf(" " + der + " ") !== -1) && (!lug || d.lugar === lug);
  }
  function filtrar() {
    var t = norm(q.value.trim()), n = 0, tema = valorFiltro("tema"), dec = valorFiltro("decada"), der = valorFiltro("derechos"), lug = valorFiltro("lugar");
    filas.forEach(function (f) { var ok = pasa(f, t, tema, dec, der, lug); f.hidden = !ok; if (ok) n++; });
    fichas.forEach(function (f) { f.hidden = !pasa(f, t, tema, dec, der, lug); });
    if (limpiar) limpiar.hidden = !(tema || dec || der || lug);
    cuenta.innerHTML = '<span class="es">' + n + (n === 1 ? " obra" : " obras") + '</span><span class="en">' + n + (n === 1 ? " work" : " works") + "</span>";
  }
  function vista(v) {
    if (!grid || !tabla) return;
    grid.hidden = v !== "portadas"; tabla.hidden = v === "portadas";
    botones.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.vista === v ? "true" : "false"); });
    try { localStorage.setItem("cat-vista-2", v); } catch (e) {}
  }
  botones.forEach(function (b) { b.addEventListener("click", function () { vista(b.dataset.vista); }); });
  var guardada = null; try { guardada = localStorage.getItem("cat-vista-2"); } catch (e) {}
  if (guardada === "lista") vista("lista");
  // Orden: reordena a la vez las filas de la lista y las fichas de portadas.
  var selects = Array.prototype.slice.call(document.querySelectorAll("select[data-orden]"));
  var cmp = function (k) {
    return function (a, b) {
      var A = a.dataset, B = b.dataset, r = 0;
      if (k === "anio-asc" || k === "anio-desc") { r = (parseInt(A.anio, 10) || 9999) - (parseInt(B.anio, 10) || 9999); if (k === "anio-desc") r = -r; }
      else if (k === "recientes") return B.sig.localeCompare(A.sig);
      else if (k !== "signatura") r = (A[k] || "").localeCompare(B[k] || "", "es");
      return r || A.sig.localeCompare(B.sig);
    };
  };
  function ordenar(k) {
    [filas, fichas].forEach(function (lista) {
      if (!lista.length) return;
      var padre = lista[0].parentNode;
      lista.slice().sort(cmp(k)).forEach(function (el) { padre.appendChild(el); });
    });
    selects.forEach(function (s) { s.value = k; });
    try { localStorage.setItem("cat-orden", k); } catch (e) {}
  }
  selects.forEach(function (s) { s.addEventListener("change", function () { ordenar(s.value); }); });
  var ordenGuardado = null; try { ordenGuardado = localStorage.getItem("cat-orden"); } catch (e) {}
  var ordenUrl = null; try { ordenUrl = new URLSearchParams(location.search).get("orden"); } catch (e) {}
  var validos = selects.length ? Array.prototype.map.call(selects[0].options, function (o) { return o.value; }) : [];
  if (ordenUrl && validos.indexOf(ordenUrl) !== -1) ordenar(ordenUrl);
  else if (ordenGuardado && ordenGuardado !== "signatura" && validos.indexOf(ordenGuardado) !== -1) ordenar(ordenGuardado);
  // Filtros: los selectores en español y en inglés se mantienen sincronizados.
  var PARAM = { tema: "tema", decada: "decada", derechos: "derechos", lugar: "lugar" };
  filtros.forEach(function (s) {
    s.addEventListener("change", function () {
      filtros.forEach(function (o) { if (o !== s && o.dataset.filtro === s.dataset.filtro) o.value = s.value; });
      filtrar(); actualizar();
    });
  });
  if (limpiar) limpiar.addEventListener("click", function () { filtros.forEach(function (s) { s.value = ""; }); filtrar(); actualizar(); });
  // Enlaces compartibles: la búsqueda (q), los filtros, el orden y la vista quedan en la dirección.
  var url = new URLSearchParams(location.search);
  var hayFiltro = false;
  filtros.forEach(function (s) {
    var v = url.get(PARAM[s.dataset.filtro]);
    if (v && Array.prototype.some.call(s.options, function (o) { return o.value === v; })) { s.value = v; hayFiltro = true; }
  });
  if (url.get("vista") === "lista" || url.get("vista") === "portadas") vista(url.get("vista"));
  if (url.get("q")) q.value = url.get("q");
  if (url.get("q") || hayFiltro) filtrar();
  function actualizar() {
    var p = new URLSearchParams(location.search), t = q.value.trim();
    if (t) p.set("q", t); else p.delete("q");
    ["tema", "decada", "derechos", "lugar"].forEach(function (k) { var v = valorFiltro(k); if (v) p.set(PARAM[k], v); else p.delete(PARAM[k]); });
    var o = selects.length ? selects[0].value : "signatura"; if (o && o !== "signatura") p.set("orden", o); else p.delete("orden");
    var v = botones.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0];
    if (v && v.dataset.vista === "lista") p.set("vista", "lista"); else p.delete("vista");
    var s = p.toString(); history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash);
  }
  var espera; q.addEventListener("input", function () { filtrar(); clearTimeout(espera); espera = setTimeout(actualizar, 400); });
  selects.forEach(function (s) { s.addEventListener("change", actualizar); });
  botones.forEach(function (b) { b.addEventListener("click", actualizar); });
})();
