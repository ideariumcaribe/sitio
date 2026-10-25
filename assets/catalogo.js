// Buscador del catálogo: filtra las filas por título o autor, sin distinguir tildes ni mayúsculas.
(function () {
  var q = document.getElementById("cat-q");
  if (!q) return;
  var filas = Array.prototype.slice.call(document.querySelectorAll(".cat-tabla tbody tr"));
  var cuenta = document.querySelector(".cat-cuenta");
  var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  function filtrar() {
    var t = norm(q.value.trim()), n = 0;
    filas.forEach(function (f) { var ok = !t || f.dataset.buscar.indexOf(t) !== -1; f.hidden = !ok; if (ok) n++; });
    cuenta.innerHTML = '<span class="es">' + n + (n === 1 ? " obra" : " obras") + '</span><span class="en">' + n + (n === 1 ? " work" : " works") + "</span>";
  }
  q.addEventListener("input", filtrar);
})();
