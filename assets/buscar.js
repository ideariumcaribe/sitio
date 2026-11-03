// Buscador del sitio (Pagefind). Admite ?q=término en la dirección.
(function () {
  if (!window.PagefindUI) return;
  var en = document.documentElement.lang === "en";
  var ui = new PagefindUI({
    element: "#buscador",
    showImages: true,
    showSubResults: true,
    resetStyles: false,
    excerptLength: 26,
    translations: en ? { placeholder: "Search the site", zero_results: "No results for [SEARCH_TERM]" } : { placeholder: "Buscar en el sitio", zero_results: "No hay resultados para [SEARCH_TERM]", filters_label: "Filtrar", load_more: "Ver más resultados" },
  });
  // Asocia la etiqueta visible al campo que crea Pagefind.
  (function enlazar(n) {
    var i = document.querySelector("#buscador input[type=text], #buscador input");
    if (i) { i.id = "q-sitio"; i.removeAttribute("title"); return; }
    if (n < 50) setTimeout(function () { enlazar(n + 1); }, 60);
  })(0);
  var q = new URLSearchParams(location.search).get("q");
  if (q) ui.triggerSearch(q);
})();
