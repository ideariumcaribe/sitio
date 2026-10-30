// Página de obra: búsqueda en el texto (OCR de Internet Archive) y botones para copiar las citas.
(function () {
  var en = function () { return document.documentElement.lang === "en"; };
  var t = function (es, ing) { return en() ? ing : es; };

  // ---- Copiar citas (con cursivas cuando el destino las admite) ----
  Array.prototype.forEach.call(document.querySelectorAll(".cita-copiar"), function (b) {
    b.addEventListener("click", function () {
      var p = b.parentNode.querySelector(".cita-txt");
      var listo = function () { var o = b.innerHTML; b.textContent = t("Copiada", "Copied"); setTimeout(function () { b.innerHTML = o; }, 1600); };
      var plano = function () {
        var r = document.createRange(); r.selectNodeContents(p);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand("copy"); listo(); } catch (e) {}
      };
      try {
        if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
          navigator.clipboard.write([new ClipboardItem({
            "text/html": new Blob([p.innerHTML], { type: "text/html" }),
            "text/plain": new Blob([p.textContent], { type: "text/plain" })
          })]).then(listo, plano);
        } else if (navigator.clipboard) { navigator.clipboard.writeText(p.textContent).then(listo, plano); }
        else plano();
      } catch (e) { plano(); }
    });
  });

  // ---- Búsqueda en el texto ----
  var f = document.querySelector(".buscar-texto");
  if (!f || !window.fetch) return;
  var id = f.dataset.ia, q = f.querySelector("input"), estado = f.querySelector(".bt-estado"), lista = f.querySelector(".bt-resultados");
  var visor = document.getElementById("visor-ia");
  var info = null, paginas = null;
  f.hidden = false;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function cargarInfo() {
    if (info) return Promise.resolve(info);
    return fetch("https://archive.org/metadata/" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (m) {
      var x = (m.files || []).filter(function (a) { return /_djvu\.xml$/.test(a.name); })[0];
      if (!x || !m.server || !m.dir) throw new Error("sin-texto");
      info = { server: m.server, dir: m.dir, doc: x.name.replace(/_djvu\.xml$/, "") };
      var pn = (m.files || []).filter(function (a) { return a.name === info.doc + "_page_numbers.json"; })[0];
      if (!pn) return info;
      // Numeración impresa de las páginas (si Internet Archive la detectó).
      return fetch("https://" + info.server + info.dir + "/" + encodeURIComponent(pn.name)).then(function (r) { return r.json(); })
        .then(function (j) { paginas = {}; (j.pages || []).forEach(function (p) { if (p.pageNumber) paginas[p.leafNum] = p.pageNumber; }); })
        .catch(function () {}).then(function () { return info; });
    });
  }
  // Fragmento de unas 240 letras alrededor de la primera coincidencia.
  function recorte(s) {
    var A = "<IA_FTS_MATCH>", i = s.indexOf(A);
    if (s.length <= 260 || i < 0) return s;
    var ini = Math.max(0, i - 110), fin = Math.min(s.length, i + 150);
    while (ini > 0 && s.charAt(ini - 1) !== " ") ini--;
    while (fin < s.length && s.charAt(fin) !== " ") fin++;
    var trozo = s.slice(ini, fin);
    var abiertas = (trozo.match(/<IA_FTS_MATCH>/g) || []).length, cerradas = (trozo.match(/<\/IA_FTS_MATCH>/g) || []).length;
    if (abiertas > cerradas) trozo += "</IA_FTS_MATCH>";
    return (ini > 0 ? "… " : "") + trozo + (fin < s.length ? " …" : "");
  }
  function etiqueta(n) { return paginas && paginas[n] ? t("p. ", "p. ") + paginas[n] : t("imagen ", "image ") + (n + 1); }
  function ir(n, termino) {
    if (!visor) return;
    visor.src = "https://archive.org/embed/" + encodeURIComponent(id) + "/page/n" + n + "?q=" + encodeURIComponent(termino);
    visor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var termino = q.value.trim();
    if (termino.length < 3) return;
    lista.innerHTML = ""; estado.textContent = t("Buscando…", "Searching…");
    cargarInfo().then(function (i) {
      var u = "https://" + i.server + "/fulltext/inside.php?item_id=" + encodeURIComponent(id) + "&doc=" + encodeURIComponent(i.doc) + "&path=" + encodeURIComponent(i.dir) + "&q=" + encodeURIComponent(termino);
      return fetch(u).then(function (r) { return r.json(); });
    }).then(function (j) {
      var ms = (j && j.matches) || [];
      if (!ms.length) { estado.textContent = t("No se encontraron resultados. El texto proviene de reconocimiento óptico y puede contener errores; pruebe con otra forma de la palabra.", "No results. The text comes from optical character recognition and may contain errors; try another form of the word."); return; }
      estado.textContent = ms.length + t(ms.length === 1 ? " resultado" : " resultados", ms.length === 1 ? " result" : " results") + (ms.length >= 50 ? t(" (se muestran los primeros)", " (first ones shown)") : "");
      ms.slice(0, 50).forEach(function (m) {
        var n = m.par && m.par[0] ? m.par[0].page : 0;
        var txt = esc(recorte(m.text || "")).replace(/&lt;IA_FTS_MATCH&gt;/g, "<mark>").replace(/&lt;\/IA_FTS_MATCH&gt;/g, "</mark>");
        var li = document.createElement("li");
        var b = document.createElement("button"); b.type = "button";
        b.innerHTML = '<span class="bt-pag">' + esc(etiqueta(n)) + "</span><span class=\"bt-txt\">" + txt + "</span>";
        b.addEventListener("click", function () { ir(n, termino); });
        li.appendChild(b); lista.appendChild(li);
      });
    }).catch(function (e) {
      estado.textContent = e && e.message === "sin-texto"
        ? t("Esta obra todavía no tiene texto reconocido en Internet Archive.", "This work does not yet have recognised text on the Internet Archive.")
        : t("No se pudo consultar el texto en este momento. Inténtelo de nuevo más tarde.", "The text could not be searched right now. Please try again later.");
    });
  });
})();
