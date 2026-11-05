---
title: "Biblioteca · Idearium Caribe"
descripcion: "Biblioteca Digital de Idearium Caribe: libros y publicaciones de historia venezolana, de la Independencia al siglo XX, de lectura libre en línea."
---
<main>
  <section id="biblioteca">
    <div class="wrap stack">
      {%- set banda = ["mario-briceno-iragorry-tapices-de-historia-patria", "arturo-uslar-pietri-golpe-y-estado-en-venezuela", "indalecio-lievano-aguirre-bolivar-2da-edicion", "mario-briceno-iragorry-el-caballo-de-ledesma", "augusto-mijares-el-libertador", "mario-briceno-iragorry-casa-leon-y-su-tiempo", "mariano-picon-salas-miranda", "arturo-uslar-pietri-del-hacer-y-deshacer-de-venezuela", "ramon-j.-velasquez-la-caida-del-liberalismo-amarillo", "juan-uslar-pietri-historia-de-la-rebelion-popular-de-1814", "antonio-perez-vivas-hegemonia-andina-y-perez-jimenez", "laureano-vallenilla-lanz-cesarismo-democratico", "arturo-uslar-pietri-los-libros-de-miranda", "gloria-henriquez-uzcategui-los-papeles-de-francisco-de-miranda"] %}
      <div class="banda-portadas" aria-hidden="true">
        {%- for id in banda %}<img src="/assets/portadas/{{ id }}.webp" alt="" width="165" height="236" decoding="async"{% if loop.index > 7 %} loading="lazy"{% endif %}>{% endfor %}
      </div>
      <div class="sec-title"><div><p class="label es">Biblioteca y archivo</p><p class="label en">Library and archive</p>
        <h1 class="es">Lo que preservamos</h1><h1 class="en">What we preserve</h1></div></div>
      <div class="cards">
        <div class="card"><p class="label">Internet Archive</p>
          <h2 class="es">Biblioteca Digital</h2><h2 class="en">Digital Library</h2>
          <p class="es">{{ catalogo | length }} libros y publicaciones, desde la Independencia hasta el siglo XX, muchos agotados o difíciles de encontrar.</p>
          <p class="en">{{ catalogo | length }} books and periodicals, from independence to the twentieth century, many out of print or hard to find.</p>
          <p class="card-enlaces"><a class="more" href="/biblioteca/catalogo/"><span class="es">Consultar el catálogo</span><span class="en">Browse the catalogue</span></a> <a class="more" href="/cifras.html"><span class="es">La Biblioteca en cifras</span><span class="en">The Library in figures</span></a></p></div>
        <div class="card"><p class="label">Archive-It</p>
          <h2 class="es">Archivo web</h2><h2 class="en">Web archive</h2>
          <p class="es">Capturas de sitios, decretos y prensa digital venezolana en riesgo de desaparecer de internet.</p>
          <p class="en">Captures of Venezuelan websites, decrees and digital press at risk of disappearing from the web.</p>
          <a class="more" href="https://archive-it.org/organizations/4701" target="_blank" rel="noopener"><span class="es">Ver en Archive-It</span><span class="en">View on Archive-It</span></a></div>
        <div class="card"><p class="label">Vault</p>
          <h2 class="es">Preservación</h2><h2 class="en">Preservation</h2>
          <p class="es">Copias maestras en TIFF y JPG, conservadas en tres ubicaciones independientes: Internet Archive, Vault y almacenamiento en la nube (Backblaze B2) con bloqueo contra borrado. La integridad de cada archivo se verifica mediante sumas SHA-256.</p>
          <p class="en">Master copies in TIFF and JPG, kept in three independent locations: the Internet Archive, Vault and cloud storage (Backblaze B2) with deletion protection. File integrity is verified with SHA-256 checksums.</p>
          <a class="more" href="/preservacion.html"><span class="es">Política de preservación</span><span class="en">Preservation policy</span></a></div>
      </div>
      <div class="stack recientes">
        <div class="sec-title"><div><p class="label es">Novedades</p><p class="label en">New additions</p>
          <h2 class="es">Últimas incorporaciones</h2><h2 class="en">Latest additions</h2></div>
          <div class="recientes-enlaces"><a class="more" href="/biblioteca/catalogo/?orden=recientes"><span class="es">Ver todas</span><span class="en">See all</span></a><a class="rss" href="/biblioteca/novedades.xml" title="RSS">RSS</a></div></div>
        <ul class="portadas portadas-recientes">
          {%- for e in catalogo | recientesAgrupadas(colecciones, 6) %}
          <li><a href="{{ e.url }}"><img src="{{ e.obra | portada }}" alt="" loading="lazy" decoding="async" width="180" height="240"><span class="t"><span class="es">{{ e.titulo }}</span><span class="en">{{ e.titulo_en }}</span></span><span class="s">{{ e.obra.signatura }}{% if e.obra.anio %} · {{ e.obra.anio }}{% endif %}</span></a></li>
          {%- endfor %}
        </ul>
      </div>
      <div class="stack recientes vistos" id="vistos" hidden>
        <div class="sec-title"><div><p class="label es">En este navegador</p><p class="label en">In this browser</p>
          <h2 class="es">Vistos recientemente</h2><h2 class="en">Recently viewed</h2></div>
          <div class="recientes-enlaces"><button type="button" class="lb" id="vistos-borrar"><span class="es">Borrar</span><span class="en">Clear</span></button></div></div>
        <ul class="portadas portadas-recientes" id="vistos-lista"></ul>
      </div>
      <div class="ledger-wrap">
        <table class="ledger">
          <thead><tr>
            <th><span class="es">Signatura</span><span class="en">Call no.</span></th>
            <th><span class="es">Obras destacadas</span><span class="en">Selected works</span></th>
            <th><span class="es">Autor</span><span class="en">Author</span></th>
            <th><span class="es">Año</span><span class="en">Year</span></th>
          </tr></thead>
          <!-- Las filas de esta tabla se editan en «Biblioteca: obras destacadas». -->
          {% include "destacados.njk" %}
        </table>
      </div>
    </div>
  </section>

  <section id="acceso">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Acceso, derechos y lineamientos</p><p class="label en">Access, rights and guidelines</p>
        <h2 class="es">Acceso y registros</h2><h2 class="en">Access and records</h2></div></div>
      <div class="cols">
        <div class="col">
          <h3 class="es">Acceso y derechos</h3><h3 class="en">Access and rights</h3>
          <ul class="es">
            <li>Los fondos digitalizados se consultan en todo momento, sin costo ni afiliación académica.</li>
            <li>Los originales están disponibles para investigadores con cita previa, y las piezas no digitalizadas pueden digitalizarse a petición.</li>
            <li>Publicamos obras de dominio público, obras propias y obras autorizadas por escrito por sus titulares.</li>
            <li>Si es titular de derechos sobre una obra y desea su retirada, escríbanos a {{ sitio.email_biblioteca }}: restringiremos el acceso mientras estudiamos la solicitud y responderemos por escrito.</li>
          </ul>
          <ul class="en">
            <li>Digitized holdings can be consulted at any time, free of charge and with no academic affiliation.</li>
            <li>Originals are available to researchers by appointment, and items not yet digitized can be scanned on request.</li>
            <li>We publish works in the public domain, our own works, and works authorized in writing by their rights holders.</li>
            <li>If you hold rights to a work and want it removed, write to {{ sitio.email_biblioteca }}: we will restrict access while we review the request and reply in writing.</li>
          </ul>
        </div>
        <div class="col para-bibliotecas" id="registros-marc">
          <h3 class="es">Registros para bibliotecas</h3><h3 class="en">Records for libraries</h3>
          <p class="es">Ofrecemos los registros catalográficos de las {{ catalogo | length }} obras de la Biblioteca Digital en formato MARC 21 (RDA), para que cualquier biblioteca pueda incorporarlas a su catálogo. Cada registro describe la reproducción electrónica e incluye los enlaces de lectura. Los archivos se actualizan con cada nueva incorporación.</p>
          <p class="en">Catalogue records for all {{ catalogo | length }} works in the Digital Library are available in MARC 21 (RDA), so any library can add them to its catalogue. Each record describes the electronic reproduction and includes the reading links. The files are updated with every new addition.</p>
          <div class="descargas-marc">
            <a class="more" href="/biblioteca/marc/idearium-caribe.mrc" download>MARC 21 (.mrc)</a>
            <a class="more" href="/biblioteca/marc/idearium-caribe.xml">MARCXML (.xml)</a>
            <a class="more" href="/biblioteca/marc/idearium-caribe.mrk" download>MarcEdit (.mrk)</a>
          </div>
          <p class="es">El catálogo completo también puede descargarse como conjunto de datos, con signaturas, identificadores ARK, autores, temas y derechos de cada obra:</p>
          <p class="en">The full catalogue can also be downloaded as a dataset, with each work's call number, ARK identifier, authors, subjects and rights:</p>
          <div class="descargas-marc">
            <a class="more" href="/biblioteca/datos/catalogo.csv" download="idearium-caribe-catalogo.csv">CSV (.csv)</a>
            <a class="more" href="/biblioteca/datos/catalogo.json">JSON (.json)</a>
          </div>
          <p class="es">Los agregadores y repositorios pueden cosechar la colección mediante OAI-PMH, en Dublin Core (<code>oai_dc</code>) o MARCXML (<code>marc21</code>), con las materias y la revista <i>Colombeia</i> como conjuntos: <a href="/oai?verb=Identify">https://www.ideariumcaribe.com/oai</a>. Cada obra ofrece además su manifiesto IIIF. Los metadatos del catálogo se publican bajo la licencia <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.es" rel="license">CC0 1.0</a>: pueden reutilizarse libremente y sin condiciones. Esta licencia se aplica a los datos descriptivos, no a las obras.</p>
          <p class="en">Aggregators and repositories can harvest the collection via OAI-PMH, in Dublin Core (<code>oai_dc</code>) or MARCXML (<code>marc21</code>), with subjects and the journal <i>Colombeia</i> as sets: <a href="/oai?verb=Identify">https://www.ideariumcaribe.com/oai</a>. Each work also provides its IIIF manifest. Catalogue metadata are released under the <a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="license">CC0 1.0</a> license and may be reused freely and without conditions. This license applies to the descriptive data, not to the works.</p>
        </div>
      </div>
    </div>
  </section>
</main>
