---
title: "Registro de cambios · Idearium Caribe"
descripcion: "Novedades del sitio web de Idearium Caribe Co.: nuevas obras de la Biblioteca Digital, servicios para investigadores y bibliotecas, la revista Colombeia y las políticas de la fundación."
---
{%- set fechas = cambios | fechasUnicas %}
{%- set secs = {"Biblioteca": ["Biblioteca", "Library"], "Colombeia": ["Colombeia", "Colombeia"], "Sitio web": ["Sitio web", "Website"], "El Caribe Ilustrado": ["El Caribe Ilustrado", "El Caribe Ilustrado"]} %}
<main>
  <section id="cambios">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Idearium Caribe Co.</p><p class="label en">Idearium Caribe Co.</p>
        <h1 class="es">Registro de cambios</h1><h1 class="en">Changelog</h1></div></div>
      <div class="aviso cambios">
        <p class="es">Las novedades del sitio web, la Biblioteca Digital y la revista <i>Colombeia</i>, de la más reciente a la más antigua.</p>
        <p class="en">What's new on the website, in the Digital Library and in the journal <i>Colombeia</i>, newest first.</p>
        {%- for f in fechas %}
        <section class="cambio-dia" aria-labelledby="d-{{ f }}">
          <h2 id="d-{{ f }}"><time datetime="{{ f }}"><span class="es">{{ f | fechaLarga("es") }}</span><span class="en">{{ f | fechaLarga("en") }}</span></time></h2>
          <ul class="cambio-lista">
            {%- for c in cambios %}{% if c.fecha == f %}
            <li><p class="label"><span class="es">{{ secs[c.seccion][0] if secs[c.seccion] else c.seccion }}</span><span class="en">{{ secs[c.seccion][1] if secs[c.seccion] else c.seccion }}</span></p>
              <p class="es">{{ c.es | cursivas | safe }}{% if c.enlace %} <a href="{{ c.enlace }}">Ver</a>{% endif %}</p>
              <p class="en">{{ c.en | cursivas | safe }}{% if c.enlace %} <a href="{{ c.enlace }}">View</a>{% endif %}</p></li>
            {%- endif %}{% endfor %}
          </ul>
        </section>
        {%- endfor %}
      </div>
    </div>
  </section>
</main>
