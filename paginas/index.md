---
title: "Idearium Caribe"
---
<main>
  <section id="inicio">
    <div class="wrap">
      <div class="welcome">
        <div>
          <p class="label es">Bienvenido a Idearium Caribe</p><p class="label en">Welcome to Idearium Caribe</p>
          <h1 class="es">La memoria documental de Venezuela, abierta a todos.</h1>
          <h1 class="en">Venezuela's documentary memory, open to all.</h1>
        </div>
        <div class="text">
          <img class="collage" src="/assets/img/portada-collage.webp" srcset="/assets/img/portada-collage-800.webp 800w, /assets/img/portada-collage.webp 1360w" sizes="(max-width: 900px) 100vw, 540px" width="1360" height="784" alt="Collage de piezas de la Biblioteca: un busto en bronce, las portadas de «Historia de la rebelión popular de 1814», de Juan Uslar Pietri, y «Tapices de historia patria», de Mario Briceño-Iragorry, un grabado de perfil y una pintura religiosa.">
          <p class="lede es">Somos una fundación cultural sin fines de lucro dedicada a seleccionar, curar y editar materiales sobre la historia de Venezuela e Hispanoamérica.</p>
          <p class="lede en">We are a nonprofit cultural foundation devoted to selecting, curating and editing materials on the history of Venezuela and Spanish America.</p>
          <p class="es">Digitalizamos libros y documentos raros o en riesgo, los preservamos y los ofrecemos en acceso abierto a investigadores, estudiantes y comunidades en Venezuela, el Caribe y la diáspora.</p>
          <p class="en">We digitize rare and at-risk books and documents, preserve them, and make them openly available to researchers, students and communities in Venezuela, the Caribbean and the diaspora.</p>
        </div>
      </div>
      <div class="pillars">
        <a class="pillar" href="{{ sitio.biblioteca_digital }}" target="_blank" rel="noopener">
          <span class="num">{{ sitio.obras_biblioteca }}</span>
          <h3 class="es">Biblioteca Digital</h3><h3 class="en">Digital Library</h3>
          <p class="es">Libros y publicaciones de historia venezolana, de libre lectura y descarga en Internet Archive.</p>
          <p class="en">Books and periodicals on Venezuelan history, free to read and download on the Internet Archive.</p>
        </a>
        <a class="pillar" href="/colombeia.html">
          <span class="num">{{ collections.numeros | length }}</span>
          <h3>Colombeia</h3>
          <p class="es">Revista de historia y pensamiento venezolano e hispanoamericano, en acceso abierto.</p>
          <p class="en">An open-access journal of Venezuelan and Spanish American history and thought.</p>
        </a>
      </div>
    </div>
  </section>

  <section id="actividad">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Nuestra actividad</p><p class="label en">Our activity</p>
        <h2 class="es">Del boletín</h2><h2 class="en">From the newsletter</h2></div>
        <a class="more" href="{{ sitio.boletin }}/archive" target="_blank" rel="noopener"><span class="es">Ver todo el archivo</span><span class="en">See the full archive</span></a></div>
      <!-- La lista de artículos del boletín se edita en «Boletín: artículos destacados». -->
      {% include "boletin-lista.njk" %}
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <div><h2 class="es">Suscríbase al boletín</h2><h2 class="en">Subscribe to the newsletter</h2>
        <p class="es">Ensayos, novedades de la Biblioteca y nuevos números de Colombeia. Más de 1.000 lectores.</p>
        <p class="en">Essays, Library news and new issues of Colombeia. Over 1,000 readers.</p></div>
      <a class="btn" href="{{ sitio.boletin }}/subscribe" target="_blank" rel="noopener"><span class="es">Suscribirse</span><span class="en">Subscribe</span></a>
    </div>
  </section>
</main>
