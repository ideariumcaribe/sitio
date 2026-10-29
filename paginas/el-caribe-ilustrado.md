---
title: "El Caribe Ilustrado · Idearium Caribe"
descripcion: "El Caribe Ilustrado, semanario cultural independiente editado por Idearium Caribe Co. desde 2026. Ensayos, crónicas, reseñas y entrevistas de libre acceso."
---
<main>
  <section id="el-caribe-ilustrado">
    <div class="wrap stack" style="gap:64px">
      <div class="ci-intro">
        <div>
          <p class="label es">Semanario</p><p class="label en">Weekly</p>
          <h2><i>El Caribe Ilustrado</i></h2>
        </div>
        <p class="es"><i>El Caribe Ilustrado</i> surge en 2026 a iniciativa de la fundación Idearium Caribe Co., que es su sociedad editora, como semanario cultural independiente. Pretende, a través de sus contenidos, ofrecer a sus lectores instrumentos para su perfeccionamiento intelectual, cultivando, además, el pensamiento crítico.</p>
        <p class="en"><i>El Caribe Ilustrado</i> was founded in 2026 on the initiative of the Idearium Caribe Co. foundation, its publisher, as an independent cultural weekly. Through its content, it seeks to offer readers tools for their intellectual development while also cultivating critical thinking.</p>
        <div class="btns">
          <a class="btn" href="{{ sitio.boletin }}" target="_blank" rel="noopener"><span class="es">Leer el semanario</span><span class="en">Read the weekly</span></a>
          <a class="btn outline" href="{{ sitio.boletin }}/subscribe" target="_blank" rel="noopener"><span class="es">Suscribirse</span><span class="en">Subscribe</span></a>
          <a class="btn outline" href="{{ sitio.boletin }}/colaboraciones" target="_blank" rel="noopener"><span class="es">Colaboraciones</span><span class="en">Contributions</span></a>
        </div>
      </div>
      <div class="stack">
        <div class="sec-title"><div><p class="label es">Archivo</p><p class="label en">Archive</p>
          <h2 class="es">Textos destacados</h2><h2 class="en">Featured pieces</h2></div>
          <a class="more" href="{{ sitio.boletin }}/archive" target="_blank" rel="noopener"><span class="es">Ver todo el archivo</span><span class="en">See the full archive</span></a></div>
        {% include "boletin-lista.njk" %}
      </div>
      <div class="col-meta">
        <div class="col" id="principios">
          <h3 class="es">Principios editoriales</h3><h3 class="en">Editorial principles</h3>
          <ol class="es principios">
            <li><b>Independencia editorial.</b> <i>El Caribe Ilustrado</i> no responde a los intereses de partidos, gobiernos o compañías. La línea es definida solamente por los editores.</li>
            <li><b>Honestidad.</b> Sabemos que los hombres defienden posturas, y nuestros escritores no están al margen de este impulso. Brindamos tribuna libre a los nuestros, siempre que se practique la honestidad intelectual.</li>
            <li><b>Opinión firmada.</b> Como damos tribuna a nuestros colaboradores, estos firman con su nombre y apellido. Sus opiniones les pertenecen, de modo que la opinión del autor no tiene que comprometer al semanario.</li>
            <li><b>Rectificación.</b> Corregimos lo que haya que corregir, de forma fechada y visible.</li>
            <li><b>Financiación transparente.</b> No publicamos publicidad. Nuestro principal sostén consiste en lectores: amigos y mecenas de <i>El Caribe Ilustrado</i>, así como los donativos a Idearium Caribe Co., nuestra sociedad editora. Las donaciones mejoran nuestra infraestructura, pero no influyen en nuestra línea editorial.</li>
            <li><b>Acceso libre.</b> La democratización del conocimiento es uno de los pilares de nuestro proyecto editorial. Todo nuestro contenido es de libre acceso y lectura.</li>
            <li><b>Derecho de réplica.</b> Quien pudiese considerarse aludido goza en esta tribuna de derecho a réplica. Publicaremos su réplica en nuestra sección de Cartas a la redacción.</li>
          </ol>
          <ol class="en principios">
            <li><b>Editorial independence.</b> <i>El Caribe Ilustrado</i> does not answer to the interests of parties, governments or companies. Its line is set by its editors alone.</li>
            <li><b>Honesty.</b> We know that people take positions, and our writers are no exception. We offer our contributors a free platform, provided they practise intellectual honesty.</li>
            <li><b>Signed opinion.</b> Because we give our contributors a platform, they sign with their full name. Their opinions are their own and need not commit the weekly.</li>
            <li><b>Corrections.</b> We correct whatever needs correcting, in a dated and visible way.</li>
            <li><b>Transparent funding.</b> We carry no advertising. We are sustained mainly by readers, the friends and patrons of <i>El Caribe Ilustrado</i>, and by donations to Idearium Caribe Co., our publisher. Donations improve our infrastructure but do not influence our editorial line.</li>
            <li><b>Open access.</b> Making knowledge available to all is one of the pillars of our publishing project. All our content is free to access and read.</li>
            <li><b>Right of reply.</b> Anyone who may consider themselves referred to has a right of reply in these pages. We will publish replies in our Letters section.</li>
          </ol>
          <p class="es ref-codigos">Tomamos como referencia el Código de Ética de la Society of Professional Journalists y el Código Deontológico de la Federación de Asociaciones de Periodistas de España (FAPE).</p>
          <p class="en ref-codigos">We take as our reference the Code of Ethics of the Society of Professional Journalists and the Code of Ethics of the Federation of Journalists' Associations of Spain (FAPE).</p>
        </div>
        <div class="col">
          <h3 class="es">Ficha</h3><h3 class="en">Masthead</h3>
          <dl class="team">
            <dt class="es">Editor</dt><dt class="en">Editor</dt><dd>José Alfredo Paniagua Núñez</dd>
            <dt class="es">Entidad editora</dt><dt class="en">Publisher</dt><dd>Idearium Caribe Co., Georgia, <span class="es">Estados Unidos</span><span class="en">United States</span></dd>
            <dt class="es">Periodicidad</dt><dt class="en">Frequency</dt><dd><span class="es">Semanal</span><span class="en">Weekly</span></dd>
            <dt class="es">Acceso</dt><dt class="en">Access</dt><dd><span class="es">Libre y gratuito</span><span class="en">Free and open</span></dd>
            <dt class="es">Sitio</dt><dt class="en">Website</dt><dd><a href="{{ sitio.boletin }}" target="_blank" rel="noopener">{{ sitio.boletin | replace("https://", "") }}</a></dd>
            <dt class="es">Contacto</dt><dt class="en">Contact</dt><dd>{{ sitio.email_comunicaciones }}</dd>
          </dl>
          <h3 class="es">Amigos y mecenas</h3><h3 class="en">Friends and patrons</h3>
          <p class="es">Todo el contenido de <i>El Caribe Ilustrado</i> es de libre acceso. Quienes deseen sostenerlo pueden hacerse Amigos o Mecenas desde la página de suscripción del semanario.</p>
          <p class="en">All of <i>El Caribe Ilustrado</i> is free to read. Those who wish to support it can become Friends or Patrons through the weekly's subscription page.</p>
          <div class="btns"><a class="btn outline" href="{{ sitio.boletin }}/subscribe" target="_blank" rel="noopener"><span class="es">Hacerme Amigo</span><span class="en">Become a Friend</span></a></div>
        </div>
      </div>
    </div>
  </section>
  {% include "suscripcion.njk" %}
</main>
