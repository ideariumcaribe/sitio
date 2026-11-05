---
title: "La Biblioteca en cifras · Idearium Caribe"
descripcion: "La Biblioteca Digital de Idearium Caribe en cifras: obras, autores, temas, crecimiento de la colección, décadas de edición y situación de derechos. Se actualiza con cada incorporación."
---
{%- set k = catalogo | cifras(materias, colecciones, collections.articulo, collections.numeros) %}
<main>
  <section id="cifras">
    <div class="wrap stack" style="gap:36px">
      <nav class="migas" aria-label="Ruta"><a href="/biblioteca.html"><span class="es">Biblioteca</span><span class="en">Library</span></a><span aria-hidden="true"> › </span><span class="es">En cifras</span><span class="en">In figures</span></nav>
      <div class="sec-title"><div><p class="label es">Biblioteca Digital</p><p class="label en">Digital Library</p>
        <h1 class="es">La Biblioteca en cifras</h1><h1 class="en">The Library in figures</h1></div></div>
      <p class="es cat-intro">Datos de la colección a la fecha de la última actualización del sitio. Se recalculan con cada obra incorporada.</p>
      <p class="en cat-intro">Collection data as of the website's latest update. They are recalculated with every new addition.</p>

      <ul class="cifras-tiles">
        <li><a href="/biblioteca/catalogo/"><span class="n">{{ k.total | miles }}</span><span class="es">obras de libre lectura</span><span class="en">works free to read</span></a></li>
        <li><a href="/biblioteca/autores/"><span class="n">{{ k.autores }}</span><span class="es">autores</span><span class="en">authors</span></a></li>
        <li><a href="/biblioteca/materias/"><span class="n">{{ k.temas }}</span><span class="es">temas</span><span class="en">subjects</span></a></li>
        <li><a href="/biblioteca/colecciones/"><span class="n">{{ k.colecciones }}</span><span class="es">obras en varios tomos ({{ k.tomos }} volúmenes)</span><span class="en">multi-volume works ({{ k.tomos }} volumes)</span></a></li>
        <li><span class="n">{{ k.desde }}–{{ k.hasta }}</span><span class="es">años de edición</span><span class="en">publication years</span></li>
        <li><a href="/colombeia.html"><span class="n">{{ k.articulos }}</span><span class="es">artículos de <i>Colombeia</i> en {{ k.numeros }} números</span><span class="en"><i>Colombeia</i> articles in {{ k.numeros }} issues</span></a></li>
      </ul>

      <section class="cifra" aria-labelledby="c-crec">
        <h2 id="c-crec"><span class="es">Crecimiento de la colección</span><span class="en">Collection growth</span></h2>
        <p class="cifra-nota es">Obras acumuladas al final de cada mes, según la fecha de incorporación.</p><p class="cifra-nota en">Cumulative works at the end of each month, by date added.</p>
        {{ k.serieMes | grafLinea("Crecimiento de la colección: obras acumuladas por mes") | safe }}
        <details class="cifra-tabla"><summary><span class="es">Ver los datos</span><span class="en">View the data</span></summary>
          <table class="ledger"><thead><tr><th><span class="es">Mes</span><span class="en">Month</span></th><th><span class="es">Nuevas</span><span class="en">New</span></th><th><span class="es">Total</span><span class="en">Total</span></th></tr></thead><tbody>
          {%- for d in k.serieMes %}<tr><td>{{ d.etiqueta }}</td><td class="yr">{{ d.nuevas }}</td><td class="yr">{{ d.n }}</td></tr>{% endfor %}</tbody></table></details>
      </section>

      <section class="cifra" aria-labelledby="c-dec">
        <h2 id="c-dec"><span class="es">Obras por década de edición</span><span class="en">Works by decade of publication</span></h2>
        <p class="cifra-nota es">Año de la edición digitalizada. Cada barra enlaza con las obras de esa década en el catálogo.</p><p class="cifra-nota en">Year of the digitized edition.</p>
        {{ k.decadas | grafColumnas("Obras por década de edición") | safe }}
        <details class="cifra-tabla"><summary><span class="es">Ver los datos</span><span class="en">View the data</span></summary>
          <table class="ledger"><thead><tr><th><span class="es">Década</span><span class="en">Decade</span></th><th><span class="es">Obras</span><span class="en">Works</span></th></tr></thead><tbody>
          {%- for d in k.decadas %}<tr><td>{% if d.n %}<a href="/biblioteca/catalogo/?decada={{ d.etiqueta }}">{{ d.etiqueta }}-{{ (d.etiqueta | int) + 9 }}</a>{% else %}{{ d.etiqueta }}-{{ (d.etiqueta | int) + 9 }}{% endif %}</td><td class="yr">{{ d.n }}</td></tr>{% endfor %}</tbody></table></details>
      </section>

      <section class="cifra" aria-labelledby="c-tem">
        <h2 id="c-tem"><span class="es">Obras por tema</span><span class="en">Works by subject</span></h2>
        <p class="cifra-nota es">Una obra puede tener varios temas. Cada barra enlaza con la página del tema.</p><p class="cifra-nota en">A work may have several subjects. Each bar links to the subject page.</p>
        {{ k.porTema | grafBarras("Obras por tema") | safe }}
      </section>

      <section class="cifra" aria-labelledby="c-der">
        <h2 id="c-der"><span class="es">Situación de derechos</span><span class="en">Rights status</span></h2>
        <p class="cifra-nota es">Según la legislación estadounidense (RightsStatements.org). Las obras publicadas con autorización se cuentan además en su categoría.</p><p class="cifra-nota en">Under U.S. law (RightsStatements.org). Works published with permission are also counted in their category.</p>
        {{ k.derechos | grafBarras("Situación de derechos de las obras", 300) | safe }}
      </section>
    </div>
  </section>
</main>
