// Buscador del catálogo: filtra las obras por título, autor o editorial, sin distinguir tildes ni mayúsculas.
// Conmutador de vista: lista o portadas (se recuerda en este navegador).
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
  function filtrar() {
    var t = norm(q.value.trim()), n = 0;
    filas.forEach(function (f) { var ok = !t || f.dataset.buscar.indexOf(t) !== -1; f.hidden = !ok; if (ok) n++; });
    fichas.forEach(function (f) { f.hidden = !(!t || f.dataset.buscar.indexOf(t) !== -1); });
    cuenta.innerHTML = '<span class="es">' + n + (n === 1 ? " obra" : " obras") + '</span><span class="en">' + n + (n === 1 ? " work" : " works") + "</span>";
  }
  function vista(v) {
    if (!grid || !tabla) return;
    grid.hidden = v !== "portadas"; tabla.hidden = v === "portadas";
    botones.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.vista === v ? "true" : "false"); });
    try { localStorage.setItem("cat-vista", v); } catch (e) {}
  }
  botones.forEach(function (b) { b.addEventListener("click", function () { vista(b.dataset.vista); }); });
  var guardada = null; try { guardada = localStorage.getItem("cat-vista"); } catch (e) {}
  if (guardada === "portadas") vista("portadas");
  // Orden: reordena a la vez las filas de la lista y las fichas de portadas.
  var selects = Array.prototype.slice.call(document.querySelectorAll("select[data-orden]"));
  var cmp = function (k) {
    return function (a, b) {
      var A = a.dataset, B = b.dataset, r = 0;
      if (k === "anio-asc" || k === "anio-desc") { r = (parseInt(A.anio, 10) || 9999) - (parseInt(B.anio, 10) || 9999); if (k === "anio-desc") r = -r; }
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
  if (ordenGuardado && ordenGuardado !== "signatura") ordenar(ordenGuardado);
  q.addEventListener("input", filtrar);
})();
