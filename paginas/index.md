---
title: "Idearium Caribe · La memoria de Venezuela, abierta a todos"
descripcion: "Fundación cultural sin fines de lucro que digitaliza, preserva y publica en acceso abierto libros y documentos sobre la historia de Venezuela e Hispanoamérica."
---
<main>
  <section id="inicio">
    <div class="wrap">
      <div class="welcome welcome-img">
        <div class="text">
          <p class="label es">Bienvenido a Idearium Caribe</p><p class="label en">Welcome to Idearium Caribe</p>
          <h1 class="es">La memoria<br>de Venezuela,<br>abierta a todos</h1>
          <h1 class="en">The memory<br>of Venezuela,<br>open to all</h1>
          <p class="lede es">Somos una fundación cultural sin fines de lucro dedicada a seleccionar, curar y editar materiales sobre la historia de Venezuela e Hispanoamérica.</p>
          <p class="lede en">We are a nonprofit cultural foundation devoted to selecting, curating and editing materials on the history of Venezuela and Spanish America.</p>
          <p class="es">Digitalizamos libros, documentos y archivos en riesgo de desaparición. Los curamos y preservamos para ofrecerlos en acceso abierto a investigadores, estudiantes y comunidades en Venezuela, Hispanoamérica y el Caribe.</p>
          <p class="en">We digitize books, documents and archives at risk of disappearing. We curate and preserve them to make them openly available to researchers, students and communities in Venezuela, Latin America and the Caribbean.</p>
        </div>
        <figure class="collage-fig">
          <img class="collage" src="/assets/img/portada-collage.webp" srcset="/assets/img/portada-collage-800.webp 800w, /assets/img/portada-collage.webp 1360w" sizes="(max-width: 900px) 100vw, 680px" width="1360" height="784" alt="Collage de piezas de la Biblioteca: un busto en bronce, las portadas de «Historia de la rebelión popular de 1814», de Juan Uslar Pietri, y «Tapices de historia patria», de Mario Briceño-Iragorry, un grabado de perfil y una pintura religiosa.">
        </figure>
      </div>
      <div class="pillars">
        <a class="pillar" href="/biblioteca/catalogo/">
          <span class="num">{{ catalogo | length }}</span>
          <h2 class="es">Biblioteca Digital</h2><h2 class="en">Digital Library</h2>
          <p class="es">Libros y publicaciones de historia venezolana, de libre lectura y descarga en Internet Archive.</p>
          <p class="en">Books and periodicals on Venezuelan history, free to read and download on the Internet Archive.</p>
        </a>
        <a class="pillar" href="/colombeia.html">
          <span class="num">{{ collections.numeros | length }}</span>
          <h2>Colombeia</h2>
          <p class="es">Revista de historia y pensamiento venezolano e hispanoamericano, en acceso abierto.</p>
          <p class="en">An open-access journal of Venezuelan and Spanish American history and thought.</p>
        </a>
      </div>
    </div>
  </section>

  {%- set ultNum = (collections.numeros | sort(false, false, "data.numero") | last) %}
  {%- set artsUlt = collections.articulo | delNumero(ultNum.data.numero) %}
  {%- set recientes = catalogo | recientesAgrupadas(colecciones, 4) %}
  <section id="novedades" aria-labelledby="nov-t">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Lo más reciente</p><p class="label en">Latest</p>
        <h2 id="nov-t" class="es">Novedades</h2><h2 class="en">What's new</h2></div>
        <a class="more" href="/cambios.html"><span class="es">Registro de cambios</span><span class="en">Changelog</span></a></div>
      <div class="inicio-nov">
        <div class="inicio-bloque">
          <h3 class="label"><span class="es">Últimas incorporaciones</span><span class="en">Latest additions</span></h3>
          <ul class="inicio-portadas">
            {%- for o in recientes %}
            <li><a href="{{ o.url }}"><img src="{{ o.obra | portada }}" alt="" loading="lazy" decoding="async" width="120" height="160"><span><span class="es">{{ o.titulo }}</span><span class="en">{{ o.titulo_en }}</span></span></a></li>
            {%- endfor %}
          </ul>
          <a class="more" href="/biblioteca/catalogo/?orden=recientes"><span class="es">Ver el catálogo</span><span class="en">Browse the catalogue</span></a>
        </div>
        <div class="inicio-bloque">
          <h3 class="label"><span class="es">Último número de</span><span class="en">Latest issue of</span> <i>Colombeia</i></h3>
          <a class="inicio-numero" href="{{ ultNum.url }}"><img src="{{ ultNum.data.portada }}" alt="" loading="lazy" decoding="async" width="120" height="187"><span><b>N.º {{ ultNum.data.numero }}: {{ ultNum.data.titulo }}</b><span class="ref">{{ ultNum.data.fecha }}</span></span></a>
          <ul class="inicio-lista">
            {%- for a in artsUlt %}{% if loop.index <= 4 and a.data.titulo != "Presentación" %}
            <li><a href="{{ a.url | urlLimpia }}">{{ a.data.titulo }}</a>{% if a.data.autores and a.data.autores.length %} <span class="ref">· {{ a.data.autores | listaAutores }}</span>{% endif %}</li>
            {%- endif %}{% endfor %}
          </ul>
        </div>
        <div class="inicio-bloque">
          <h3 class="label"><span class="es">En el sitio</span><span class="en">On the website</span></h3>
          <ul class="inicio-lista">
            {%- for c in cambios.slice(0, 4) %}
            <li><time datetime="{{ c.fecha }}" class="ref"><span class="es">{{ c.fecha | fechaLarga("es") }}</span><span class="en">{{ c.fecha | fechaLarga("en") }}</span></time><span class="es">{{ c.es | cursivas | safe }}</span><span class="en">{{ c.en | cursivas | safe }}</span></li>
            {%- endfor %}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section id="actividad">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Nuestra actividad</p><p class="label en">Our activity</p>
        <h2 class="es">De El Caribe Ilustrado</h2><h2 class="en">From El Caribe Ilustrado</h2></div>
        <a class="more" href="{{ sitio.boletin }}/archive" target="_blank" rel="noopener"><span class="es">Ver todo el archivo</span><span class="en">See the full archive</span></a></div>
      <!-- La lista de artículos del boletín se edita en «Boletín: artículos destacados». -->
      {% include "boletin-lista.njk" %}
    </div>
  </section>

  {% include "suscripcion.njk" %}
</main>
