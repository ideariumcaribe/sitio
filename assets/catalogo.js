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
  q.addEventListener("input", filtrar);
})();
