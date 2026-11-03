---
title: "Biblioteca · Idearium Caribe"
descripcion: "Biblioteca Digital de Idearium Caribe: libros y publicaciones de historia venezolana, de la Independencia al siglo XX, de lectura libre en línea."
---
<main>
  <section id="biblioteca">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Biblioteca y archivo</p><p class="label en">Library and archive</p>
        <h1 class="es">Lo que preservamos</h1><h1 class="en">What we preserve</h1></div></div>
      <div class="cards">
        <div class="card"><p class="label">Internet Archive</p>
          <h2 class="es">Biblioteca Digital</h2><h2 class="en">Digital Library</h2>
          <p class="es">{{ sitio.obras_biblioteca }} libros y publicaciones, desde la Independencia hasta el siglo XX, muchos agotados o difíciles de encontrar.</p>
          <p class="en">{{ sitio.obras_biblioteca }} books and periodicals, from independence to the twentieth century, many out of print or hard to find.</p>
          <a class="more" href="/biblioteca/catalogo/"><span class="es">Consultar el catálogo</span><span class="en">Browse the catalogue</span></a></div>
        <div class="card"><p class="label">Archive-It</p>
          <h2 class="es">Archivo web</h2><h2 class="en">Web archive</h2>
          <p class="es">Capturas de sitios, decretos y prensa digital venezolana en riesgo de desaparecer de internet.</p>
          <p class="en">Captures of Venezuelan websites, decrees and digital press at risk of disappearing from the web.</p>
          <a class="more" href="https://archive-it.org/organizations/4701" target="_blank" rel="noopener"><span class="es">Ver en Archive-It</span><span class="en">View on Archive-It</span></a></div>
        <div class="card"><p class="label">Vault</p>
          <h2 class="es">Preservación</h2><h2 class="en">Preservation</h2>
          <p class="es">Copias maestras en TIFF y JPG, conservadas en tres ubicaciones independientes: Internet Archive, Vault y almacenamiento en la nube (Backblaze B2) con bloqueo contra borrado. La integridad de cada archivo se verifica mediante sumas SHA-256.</p>
          <p class="en">Master copies in TIFF and JPG, kept in three independent locations: the Internet Archive, Vault and cloud storage (Backblaze B2) with deletion protection. File integrity is verified with SHA-256 checksums.</p></div>
      </div>
      <div class="stack recientes">
        <div class="sec-title"><div><p class="label es">Novedades</p><p class="label en">New additions</p>
          <h2 class="es">Últimas incorporaciones</h2><h2 class="en">Latest additions</h2></div>
          <div class="recientes-enlaces"><a class="more" href="/biblioteca/catalogo/?orden=recientes"><span class="es">Ver todas</span><span class="en">See all</span></a><a class="rss" href="/biblioteca/novedades.xml" title="RSS">RSS</a></div></div>
        {%- set lista = catalogo | recientes(6) %}{% set clase = "portadas-recientes" %}{% set oculta = false %}
        {% include "portadas-grid.njk" %}
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
          <p class="es">Ofrecemos los registros catalográficos de las {{ sitio.obras_biblioteca }} obras de la Biblioteca Digital en formato MARC 21 (RDA), para que cualquier biblioteca pueda incorporarlas a su catálogo. Cada registro describe la reproducción electrónica e incluye los enlaces de lectura. Los archivos se actualizan con cada nueva incorporación.</p>
          <p class="en">Catalogue records for all {{ sitio.obras_biblioteca }} works in the Digital Library are available in MARC 21 (RDA), so any library can add them to its catalogue. Each record describes the electronic reproduction and includes the reading links. The files are updated with every new addition.</p>
          <div class="descargas-marc">
            <a class="more" href="/biblioteca/marc/idearium-caribe.mrc" download>MARC 21 (.mrc)</a>
            <a class="more" href="/biblioteca/marc/idearium-caribe.xml">MARCXML (.xml)</a>
            <a class="more" href="/biblioteca/marc/idearium-caribe.mrk" download>MarcEdit (.mrk)</a>
          </div>
          <p class="es">Los agregadores y repositorios pueden cosechar la colección mediante OAI-PMH, en Dublin Core (<code>oai_dc</code>) o MARCXML (<code>marc21</code>), con las materias como conjuntos: <a href="/oai?verb=Identify">https://www.ideariumcaribe.com/oai</a>. Cada obra ofrece además su manifiesto IIIF.</p>
          <p class="en">Aggregators and repositories can harvest the collection via OAI-PMH, in Dublin Core (<code>oai_dc</code>) or MARCXML (<code>marc21</code>), with subjects as sets: <a href="/oai?verb=Identify">https://www.ideariumcaribe.com/oai</a>. Each work also provides its IIIF manifest.</p>
        </div>
      </div>
    </div>
  </section>
</main>
