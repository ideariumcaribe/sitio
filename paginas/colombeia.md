---
title: "Colombeia · Idearium Caribe"
descripcion: "Colombeia (ISSN 3069-7700), revista bimestral de acceso abierto sobre historia y pensamiento venezolano e hispanoamericano, editada por Idearium Caribe."
---
<main>
  <section id="colombeia">
    <div class="wrap stack" style="gap:64px">
      {#- Franja de cabecera: portada de cada número seguida de la primera página de dos de sus artículos (scripts/colombeia-paginas.py). #}
      <div class="banda-portadas banda-colombeia" aria-hidden="true">
        {%- for n in collections.numeros | sort(true, false, "data.numero") %}
        <img src="{{ n.data.portada }}" alt="" width="165" height="257" decoding="async">
        {%- for a in collections.articulo | delNumero(n.data.numero) %}{% if a.data.titulo != "Presentación" and loop.index <= 3 %}
        <img src="/assets/colombeia/paginas/{{ a.page.fileSlug }}.webp" alt="" width="165" height="257" decoding="async" loading="lazy" class="pagina">
        {%- endif %}{% endfor %}
        {%- endfor %}
      </div>
      <div class="feature">
        <!-- La portada se toma automáticamente del último número publicado. -->
        {% include "colombeia-portada.njk" %}
        <div class="text">
          <div class="col-cab">
            <img class="colombeia-logo" src="/assets/img/colombeia-logo.svg" alt="Logo de Colombeia" width="73" height="100">
            <div>
              <p class="label es">Revista</p><p class="label en">Journal</p>
              <h1 class="es">Colombeia, nuestra columna vertebral</h1>
              <h1 class="en">Colombeia, our backbone</h1>
            </div>
          </div>
          <p class="es">Entre 2024 y 2025, como sabrán nuestros lectores, publicamos más de una centena de artículos y ensayos, contando además boletines y otras formas literarias seleccionadas por nuestro Consejo editorial. En 2025 incursionamos en la publicación periódica. No conformes con nuestro trabajo, del que bien podríamos enorgullecernos por su calidad y diversificación literaria, decidimos que <i>Colombeia</i> podía influir en el debate contemporáneo y servir como un referente intelectual en tiempos donde hay una notoria orfandad del espíritu, un abandono de la literatura y los espacios académicos se vacían. No nos consideramos maestros de nada, ni creemos tener la potestad de la enseñanza, ni autoridad de ningún tipo, pero sí unas grandes ansias de trabajar por el desarrollo de nuestra nación y de nuestra civilización, que mejores tiempos ha visto.</p>
          <p class="en">Between 2024 and 2025, as our readers will know, we published more than a hundred articles and essays, in addition to newsletters and other literary forms selected by our Editorial Council. In 2025 we ventured into periodical publishing. Not content with our work, of which we could well be proud for its quality and literary range, we decided that <i>Colombeia</i> could influence contemporary debate and serve as an intellectual point of reference at a time of notable spiritual orphanhood, when literature is abandoned and academic spaces are emptying. We do not consider ourselves masters of anything, nor do we believe we hold the power to teach or any kind of authority, but we do have a great eagerness to work for the development of our nation and of our civilization, which has seen better times.</p>
          <p class="es">El primer número de <i>Colombeia</i> coincidió con el mes de octubre, pues se cumplía otro aniversario del descubrimiento de América. Dedicamos nuestro primer gran esfuerzo intelectual al hecho fundante, a la etnogénesis de nuestros pueblos con opiniones muy diversas pero no por ello contradictorias; pues todos, a su manera, rendían homenaje al nacimiento de las Indias, de las Américas, de este Caribe nuestro. <i>Colombeia</i>, aquel término mirandino y americanista, sirve como un recordatorio de nuestras aspiraciones espirituales y morales, del ennoblecimiento de nuestras naciones. He aquí nuestro primer gran esfuerzo.</p>
          <p class="en">The first issue of <i>Colombeia</i> coincided with the month of October, marking another anniversary of the discovery of America. We devoted our first great intellectual effort to the founding event, to the ethnogenesis of our peoples, with very diverse but not contradictory opinions; for all of them, in their own way, paid tribute to the birth of the Indies, of the Americas, of this Caribbean of ours. <i>Colombeia</i>, that Mirandine and <i>americanista</i> term, serves as a reminder of our spiritual and moral aspirations, of the ennoblement of our nations. Here is our first great effort.</p>
          <!-- Los botones y la lista de números se generan automáticamente a partir de «Números de Colombeia». -->
          {% include "colombeia-botones.njk" %}
          <p class="es" style="font-size:.95rem">También en <a href="https://zenodo.org/communities/ideariumcaribe" target="_blank" rel="noopener">Zenodo</a> y <a href="https://hcommons.org/groups/idearium-caribe/" target="_blank" rel="noopener">Knowledge Commons</a>.</p><p class="en" style="font-size:.95rem">Also on <a href="https://zenodo.org/communities/ideariumcaribe" target="_blank" rel="noopener">Zenodo</a> and <a href="https://hcommons.org/groups/idearium-caribe/" target="_blank" rel="noopener">Knowledge Commons</a>.</p>
        </div>
      </div>
      {% include "colombeia-numeros.njk" %}
      <div class="sec-title"><div><p class="label es">La revista</p><p class="label en">The journal</p>
        <h2 class="es">Sobre <i>Colombeia</i></h2><h2 class="en">About <i>Colombeia</i></h2></div></div>
      <div class="col-meta">
        <div class="col">
          <h3 class="es">Revista de acceso abierto</h3><h3 class="en">Open-access journal</h3>
          <p class="es"><i>Colombeia</i> (ISSN 3069-7700) es una revista de acceso abierto que se publica en Senoia, Georgia, EEUU. Todos sus contenidos están disponibles de forma libre y gratuita para el lector, sin necesidad de suscripción ni pago. Los artículos se publican bajo una licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0), que permite compartir y adaptar el material siempre que se cite la autoría original. La revista no cobra tasas por publicación (APC) ni por lectura ni por el envío de manuscritos. <i>Colombeia</i> es editada por Idearium Caribe Co.</p>
          <p class="en"><i>Colombeia</i> (ISSN 3069-7700) is an open-access journal published in Senoia, Georgia, USA. All its content is freely available to readers at no cost, with no subscription or payment required. Articles are published under a Creative Commons Attribution 4.0 International license (CC BY 4.0), which allows the material to be shared and adapted provided the original authorship is credited. The journal charges no fees for publication (APCs), reading or manuscript submission. <i>Colombeia</i> is published by Idearium Caribe Co.</p>
          <p class="es">Los autores conservan los derechos de autor de sus trabajos. Los contenidos se distribuyen bajo licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).</p>
          <p class="en">Authors retain the copyright to their work. Content is distributed under a Creative Commons Attribution 4.0 International license (CC BY 4.0).</p>
        </div>
        <div class="col">
          <h3 class="es">Equipo editorial</h3><h3 class="en">Editorial team</h3>
          <dl class="team">
            <dt class="es">Director</dt><dt class="en">Editor-in-chief</dt><dd class="comite"><span class="miembro">Alejandro Perdomo Fermin <span class="afil">Idearium Caribe Co., <span class="es">Estados Unidos</span><span class="en">United States</span></span></span></dd>
            <dt class="es">Consejo editorial</dt><dt class="en">Editorial council</dt><dd class="comite"><span class="miembro">Daniel García Ayaach <span class="afil">Idearium Caribe Co., <span class="es">Estados Unidos</span><span class="en">United States</span></span></span><span class="miembro">Jonhangel Sánchez Utrera <span class="afil">Idearium Caribe Co., <span class="es">Estados Unidos</span><span class="en">United States</span></span></span><span class="miembro">Alejandra Martínez Canchica <span class="afil">Universidad Francisco Marroquín, Guatemala</span></span><span class="miembro">Leonardo L. González Contreras <span class="afil"><span class="es">Investigador independiente</span><span class="en">Independent researcher</span>, Venezuela</span></span></dd>
            <dt class="es">Comité científico</dt><dt class="en">Scientific committee</dt><dd class="comite"><span class="miembro">Miguel Ayuso Torres <span class="afil">Universidad Pontificia Comillas, <span class="es">España</span><span class="en">Spain</span></span></span><span class="miembro">Guillermo Tell Aveledo Coll <span class="afil">Universidad Metropolitana, <span class="es">Venezuela</span><span class="en">Venezuela</span></span></span><span class="miembro">Joseph Dager Alva <span class="afil">Pontificia Universidad Católica del Perú, <span class="es">Perú</span><span class="en">Peru</span></span></span><span class="miembro">Daniel González Acurero <span class="afil">Universidad de Piura, <span class="es">Perú</span><span class="en">Peru</span></span></span></dd>
            <dt class="es">Entidad editora</dt><dt class="en">Publisher</dt><dd>Idearium Caribe Co., Senoia, Georgia, <span class="es">Estados Unidos</span><span class="en">United States</span></dd>
            <dt class="es">Biblioteca del Congreso</dt><dt class="en">Library of Congress</dt><dd><a href="https://lccn.loc.gov/{{ sitio.lccn_colombeia }}" rel="noopener" target="_blank">LCCN {{ sitio.lccn_colombeia }}</a></dd>
            <dt class="es">Contacto editorial</dt><dt class="en">Editorial contact</dt><dd>{{ sitio.email_editorial }}</dd>
            <dt>X</dt><dd><a href="{{ sitio.x_colombeia }}" rel="me noopener" target="_blank">@{{ sitio.x_colombeia | replace("https://x.com/", "") }}</a></dd>
          </dl>
          <h3 class="es">Periodicidad</h3><h3 class="en">Frequency</h3>
          <p class="es"><i>Colombeia</i> se publica con periodicidad bimestral. El primer número corresponde al bimestre septiembre-octubre de 2025. En casos donde por causas mayores haya retrasos en la publicación de los números, se notificará a los contribuyentes.</p>
          <p class="en"><i>Colombeia</i> is published bimonthly. The first issue covers September–October 2025. Should publication be delayed for reasons beyond our control, contributors will be notified.</p>
        </div>
      </div>
      <div class="col" id="evaluacion">
        <div class="sec-title"><div><p class="label es">Normas para autores</p><p class="label en">Guidelines for authors</p>
          <h2 class="es">Proceso de evaluación</h2><h2 class="en">Review process</h2></div></div>
        <ol class="es">
          <li>La recepción del material a publicarse se hará mediante nuestra dirección de correo electrónico: {{ sitio.email_editorial }}.</li>
          <li>Todos los correos enviados a nuestra dirección deberán estar titulados para facilitar la labor de recepción. Escriba de título el nombre de su publicación.</li>
          <li>Los archivos adjuntos deben estar en formato .doc o .docx y deben llevar también el título de su publicación. Preferimos la recepción de archivos en formato .doc o .docx porque nos permite trabajar sobre el texto. Si, por alguna razón, hubiera que hacer ajustes al texto, notificaremos al autor. Desaconsejamos profundamente el uso de PDF, ya que haría complicado el trabajo de edición.</li>
          <li>Asegúrese de llenar la siguiente información en el cuerpo de texto del correo que pretende dirigirnos con su futura publicación. Por ejemplo, i) el nombre del autor y de ser posible, una breve reseña del autor ii) el título del texto a publicar, iii) el género literario y iv) un resumen o abstract no mayor a 250 palabras.</li>
          <li>El tiempo de respuesta o recepción será de dos a cinco días hábiles. Le haremos saber de la recepción y de la publicación del mismo.</li>
          <li><i>Colombeia</i> recibe artículos de investigación y ensayos académicos sobre la historia, la cultura, la sociedad y el pensamiento de Venezuela y América Latina, que se someten a arbitraje doble ciego. Recibe también reseñas académicas de obras publicadas recientemente, que se someten a revisión editorial. Los textos de opinión y de creación literaria pueden dirigirse a nuestro semanario, El Caribe Ilustrado.</li>
          <li>Todos los ensayos, cuya publicación siempre aconsejamos y buscamos promover, estarán regidos por el formato Chicago (18ª ed). Las mismas normas aplican a los artículos académicos, científicos o de investigación comúnmente conocidos como <i>papers</i>. Dedicaremos un apartado propio a los lineamientos relacionados al estilo del género ensayístico.</li>
        </ol>
        <ol class="en">
          <li>Submissions are received at our email address: {{ sitio.email_editorial }}.</li>
          <li>All emails sent to our address must have a subject line to make receiving them easier. Use the title of your work as the subject.</li>
          <li>Attachments must be in .doc or .docx format and must also bear the title of your work. We prefer .doc or .docx files because they allow us to work on the text. If the text needs any adjustments, we will notify the author. We strongly advise against PDF, as it would make editing difficult.</li>
          <li>Make sure to include the following information in the body of the email containing your proposed publication: i) the author's name and, if possible, a short bio; ii) the title of the text; iii) the literary genre; and iv) a summary or abstract of no more than 250 words.</li>
          <li>The response time will be two to five business days. We will let you know when your work has been received and when it is published.</li>
          <li><i>Colombeia</i> accepts research articles and scholarly essays on the history, culture, society and thought of Venezuela and Latin America, which undergo double-blind peer review. It also accepts scholarly reviews of recently published works, which undergo editorial review. Opinion pieces and creative writing may be submitted to our weekly, El Caribe Ilustrado.</li>
          <li>All essays, whose publication we always encourage and seek to promote, will follow the Chicago format (18th ed.). The same rules apply to academic, scientific or research articles, commonly known as papers. We will devote a separate section to style guidelines for the essay genre.</li>
        </ol>
      </div>
      <div class="col" id="arbitraje">
        <div class="sec-title"><div><p class="label es">Política editorial</p><p class="label en">Editorial policy</p>
          <h2 class="es">Arbitraje</h2><h2 class="en">Peer review</h2></div></div>
        <ol class="es">
          <li><b>Revisión editorial previa.</b> En un plazo de hasta quince días, el equipo editorial comprueba que el texto se ajuste al ámbito de la revista, a las normas de presentación y a los principios de originalidad. Los textos que no los cumplan se devuelven al autor sin pasar a evaluación.</li>
          <li><b>Doble ciego.</b> Los artículos y ensayos de investigación se someten a la evaluación de dos especialistas externos al equipo editorial, en la modalidad de doble ciego: ni los autores conocen la identidad de los evaluadores ni estos la de los autores. El autor debe enviar una versión anonimizada de su texto, sin su nombre ni referencias que lo identifiquen.</li>
          <li><b>Criterios.</b> Los evaluadores consideran la originalidad y pertinencia del tema, el rigor en el uso de las fuentes, la coherencia de la argumentación, la estructura y la calidad de la redacción, y la actualidad de la bibliografía.</li>
          <li><b>Dictamen.</b> Cada evaluador recomienda aceptar el texto, aceptarlo con cambios menores, solicitar cambios mayores y una nueva evaluación, o rechazarlo. Si los dictámenes son contradictorios, se recurre a un tercer evaluador.</li>
          <li><b>Plazos.</b> La evaluación se completa en un plazo aproximado de cuatro a seis semanas. El autor dispone de quince días para introducir cambios menores y de treinta para cambios mayores.</li>
          <li><b>Decisión.</b> La decisión final corresponde a la dirección de la revista, a la vista de los dictámenes y con el parecer del consejo editorial. El autor recibe los informes de evaluación, sin datos que identifiquen a los evaluadores.</li>
          <li><b>Reseñas.</b> Las reseñas académicas se someten a revisión editorial, no a arbitraje externo.</li>
          <li><b>Reconsideración.</b> El autor puede solicitar, de forma razonada, la reconsideración de una decisión. La solicitud se resuelve con la intervención de un evaluador distinto de los anteriores.</li>
        </ol>
        <ol class="en">
          <li><b>Initial editorial review.</b> Within fifteen days, the editorial team checks that the text fits the journal's scope, submission guidelines and originality principles. Texts that do not are returned to the author without being sent for review.</li>
          <li><b>Double-blind review.</b> Research articles and essays are evaluated by two specialists from outside the editorial team, in a double-blind process: authors do not know the reviewers' identities, and reviewers do not know the authors'. Authors must submit an anonymized version of their text, without their name or identifying references.</li>
          <li><b>Criteria.</b> Reviewers assess the originality and relevance of the topic, rigor in the use of sources, coherence of the argument, structure and quality of the writing, and currency of the bibliography.</li>
          <li><b>Recommendation.</b> Each reviewer recommends acceptance, acceptance with minor revisions, major revisions and a new review, or rejection. If the reports conflict, a third reviewer is consulted.</li>
          <li><b>Timeline.</b> Review is completed in approximately four to six weeks. Authors have fifteen days for minor revisions and thirty for major revisions.</li>
          <li><b>Decision.</b> The final decision rests with the journal's director, in light of the reports and with the advice of the editorial board. Authors receive the review reports, without information identifying the reviewers.</li>
          <li><b>Reviews.</b> Scholarly reviews undergo editorial review, not external peer review.</li>
          <li><b>Reconsideration.</b> Authors may submit a reasoned request for reconsideration of a decision. The request is resolved with the involvement of a reviewer different from the previous ones.</li>
        </ol>
        <h3 class="es">Preservación</h3><h3 class="en">Preservation</h3>
        <p class="es">Para garantizar su conservación a largo plazo, cada número y cada artículo de <i>Colombeia</i> se deposita en Internet Archive y en la comunidad de la fundación en Zenodo, además de conservarse en su sitio web.</p>
        <p class="en">To ensure long-term preservation, every issue and article of <i>Colombeia</i> is deposited in the Internet Archive and in the foundation's Zenodo community, in addition to being kept on its website.</p>
      </div>
      <div class="col" id="etica">
        <div class="sec-title"><div><p class="label es">Política editorial</p><p class="label en">Editorial policy</p>
          <h2 class="es">Ética de publicación</h2><h2 class="en">Publication ethics</h2></div></div>
        <p class="es">La revista <i>Colombeia</i> se adhiere a los principios del Committee on Publication Ethics (COPE) e impone las mismas responsabilidades por cumplir a autores, evaluadores y editores derivadas del cumplimiento de las siguientes normas.</p>
        <p class="en"><i>Colombeia</i> adheres to the principles of the Committee on Publication Ethics (COPE) and holds authors, reviewers and editors alike to the following standards.</p>
        <h3 class="es">Autores</h3><h3 class="en">Authors</h3>
        <ol class="es">
          <li><b>Originalidad.</b> Todos los textos deben ser originales e inéditos. Si son dirigidos a nuestra revista, no pueden estar en evaluación en otro medio. Si un texto ha aparecido antes en otro medio, el autor debe indicarlo al enviarlo.</li>
          <li><b>Plagio.</b> Toda cita, idea o dato ajeno debe atribuirse a su fuente original. El plagio, sea total o parcial, lleva al rechazo del texto y, en el caso extremo de que haya sido publicado, a su retractación.</li>
          <li><b>Autoría.</b> Figuran como autores aquellos que hayan contribuido en el trabajo de forma sustancial.</li>
          <li><b>Conflictos de interés.</b> El autor está obligado a declarar cualquier relación personal, profesional o económica que pueda influir, de alguna manera, en su trabajo.</li>
          <li><b>Inteligencia artificial.</b> Fiel a nuestra línea editorial, y al sistema de revisión empleado por la revista, rechazamos textos generados por inteligencia artificial. Si se hubiese empleado inteligencia artificial de forma supletoria, en casos como traducción o corrección, debe declararse.</li>
        </ol>
        <ol class="en">
          <li><b>Originality.</b> All texts must be original and unpublished. Texts submitted to our journal may not be under review elsewhere. If a text has previously appeared in another outlet, the author must say so on submission.</li>
          <li><b>Plagiarism.</b> Every quotation, idea or piece of data taken from others must be attributed to its original source. Plagiarism, whether total or partial, leads to rejection of the text and, in the extreme case that it has already been published, to its retraction.</li>
          <li><b>Authorship.</b> Only those who have contributed substantially to the work are listed as authors.</li>
          <li><b>Conflicts of interest.</b> Authors must declare any personal, professional or financial relationship that might in any way influence their work.</li>
          <li><b>Artificial intelligence.</b> In keeping with our editorial line and our review system, we reject texts generated by artificial intelligence. Any supplementary use of artificial intelligence, such as for translation or proofreading, must be declared.</li>
        </ol>
        <h3 class="es">Evaluadores</h3><h3 class="en">Reviewers</h3>
        <ol class="es">
          <li><b>Confidencialidad.</b> Los textos evaluados son confidenciales. No puede usarse esta información en provecho o beneficio propio.</li>
          <li><b>Imparcialidad.</b> La evaluación de los textos debe ser objetiva y fundamentada. Si hubiera conflicto de interés con el texto o el autor, deberá el evaluador inhibirse de la evaluación.</li>
        </ol>
        <ol class="en">
          <li><b>Confidentiality.</b> Texts under review are confidential. This information may not be used for personal gain or benefit.</li>
          <li><b>Impartiality.</b> Reviews must be objective and well founded. Reviewers with a conflict of interest regarding the text or its author must recuse themselves.</li>
        </ol>
        <h3 class="es">Editores</h3><h3 class="en">Editors</h3>
        <ol class="es">
          <li>Todas las decisiones editoriales se toman por mérito académico, sin consideración de la nacionalidad, el credo, la afiliación política o cualquier condición del autor.</li>
          <li>Los editores no evaluarán textos en los que tengan un conflicto de interés. Los artículos de miembros del equipo editorial se someten al mismo sistema de evaluación que los demás aspirantes.</li>
        </ol>
        <ol class="en">
          <li>All editorial decisions are made on academic merit, without regard to the author's nationality, creed, political affiliation or any other condition.</li>
          <li>Editors will not evaluate texts in which they have a conflict of interest. Articles by members of the editorial team undergo the same review process as all other submissions.</li>
        </ol>
        <h3 class="es">Correcciones y retractaciones</h3><h3 class="en">Corrections and retractions</h3>
        <p class="es">Si se detectaran errores en un artículo después de su publicación, todas las correcciones se harán mediante una nota fechada y visible. Si, por otro lado, hubiera un plagio comprobado, una publicación duplicada o datos falsificados, el artículo será retractado.</p>
        <p class="en">If errors are found in an article after publication, all corrections will be made through a dated and visible note. If, on the other hand, plagiarism, duplicate publication or falsified data is proven, the article will be retracted.</p>
        <h3 class="es">Reclamaciones</h3><h3 class="en">Complaints</h3>
        <p class="es">Las reclamaciones sobre cualquier aspecto del proceso editorial pueden dirigirse a {{ sitio.email_editorial }}, y serán atendidas por el equipo editorial.</p>
        <p class="en">Complaints about any aspect of the editorial process may be sent to {{ sitio.email_editorial }} and will be handled by the editorial team.</p>
      </div>
    </div>
  </section>
</main>
