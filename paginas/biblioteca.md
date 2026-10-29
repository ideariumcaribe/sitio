---
title: "Biblioteca · Idearium Caribe"
descripcion: "Biblioteca Digital de Idearium Caribe: libros y publicaciones de historia venezolana, de la Independencia al siglo XX, de lectura libre en línea."
---
<main>
  <section id="biblioteca">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Biblioteca y archivo</p><p class="label en">Library and archive</p>
        <h2 class="es">Lo que preservamos</h2><h2 class="en">What we preserve</h2></div></div>
      <div class="cards">
        <div class="card"><p class="label">Internet Archive</p>
          <h3 class="es">Biblioteca Digital</h3><h3 class="en">Digital Library</h3>
          <p class="es">{{ sitio.obras_biblioteca }} libros y publicaciones, desde la Independencia hasta el siglo XX, muchos agotados o difíciles de encontrar.</p>
          <p class="en">{{ sitio.obras_biblioteca }} books and periodicals, from independence to the twentieth century, many out of print or hard to find.</p>
          <a class="more" href="/biblioteca/catalogo/"><span class="es">Consultar el catálogo</span><span class="en">Browse the catalogue</span></a></div>
        <div class="card"><p class="label">Archive-It</p>
          <h3 class="es">Archivo web</h3><h3 class="en">Web archive</h3>
          <p class="es">Capturas de sitios, decretos y prensa digital venezolana en riesgo de desaparecer de internet.</p>
          <p class="en">Captures of Venezuelan websites, decrees and digital press at risk of disappearing from the web.</p>
          <a class="more" href="https://archive-it.org/organizations/4701" target="_blank" rel="noopener"><span class="es">Ver en Archive-It</span><span class="en">View on Archive-It</span></a></div>
        <div class="card"><p class="label">Vault</p>
          <h3 class="es">Preservación</h3><h3 class="en">Preservation</h3>
          <p class="es">Copias maestras de alta resolución, con al menos tres copias en dos ubicaciones y verificación de integridad.</p>
          <p class="en">High-resolution master copies, with at least three copies in two locations and integrity checks.</p></div>
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
        <h2 class="es">Consultar y publicar</h2><h2 class="en">Research and publish</h2></div></div>
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
        <div class="col">
          <h3 class="es">Publique con nosotros</h3><h3 class="en">Publish with us</h3>
          <p class="es">Recibimos ensayos, artículos, reseñas, poesía, cuento y folclore para <i>El Caribe Ilustrado</i> y para <i>Colombeia</i>. Consulte los requisitos de envío en el proceso de evaluación de la revista.</p>
          <p class="en">We welcome essays, articles, reviews, poetry, short fiction and folklore for <i>El Caribe Ilustrado</i> and for <i>Colombeia</i>. See the submission requirements in the journal's review process.</p>
          <a class="more" href="/colombeia.html#evaluacion"><span class="es">Proceso de evaluación</span><span class="en">Review process</span></a>
        </div>
      </div>
    </div>
  </section>
</main>
