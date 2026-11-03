---
title: "Política de preservación · Idearium Caribe"
descripcion: "Política de preservación digital de Idearium Caribe Co.: copias, formatos, integridad, control de acceso y metadatos de la Biblioteca Digital, según los niveles de la NDSA."
---
<main>
  <section id="preservacion">
    <div class="wrap stack">
      <div class="sec-title"><div><p class="label es">Biblioteca y archivo</p><p class="label en">Library and archive</p>
        <h1 class="es">Política de preservación</h1><h1 class="en">Preservation policy</h1></div></div>
      <div class="aviso">
        <p class="es">Idearium Caribe Co. se compromete a conservar a largo plazo, y a mantener accesibles, los materiales que digitaliza, archiva y publica. Esta política sigue los Niveles de Preservación Digital de la National Digital Stewardship Alliance (NDSA) y las directrices técnicas de digitalización de FADGI.</p>
        <p class="en">Idearium Caribe Co. is committed to preserving over the long term, and keeping accessible, the materials it digitizes, archives and publishes. This policy follows the National Digital Stewardship Alliance (NDSA) Levels of Digital Preservation and the FADGI technical guidelines for digitization.</p>

        <section id="alcance">
          <h2 class="es">Alcance</h2><h2 class="en">Scope</h2>
          <ol class="es aviso-lista">
            <li>Las obras de la Biblioteca Digital y sus copias maestras.</li>
            <li>Las colecciones de archivo web reunidas mediante Archive-It.</li>
            <li>Los números y artículos de la revista <i>Colombeia</i>.</li>
            <li>Los metadatos del catálogo y la documentación de la fundación sobre derechos y autorizaciones.</li>
          </ol>
          <ol class="en aviso-lista">
            <li>The works of the Digital Library and their master copies.</li>
            <li>The web archive collections gathered through Archive-It.</li>
            <li>The issues and articles of the journal <i>Colombeia</i>.</li>
            <li>The catalogue metadata and the foundation's records on rights and permissions.</li>
          </ol>
        </section>

        <section id="copias">
          <h2 class="es">Copias y ubicaciones</h2><h2 class="en">Copies and locations</h2>
          <p class="es">Cada obra se conserva en tres copias con funciones distintas: una copia maestra de preservación, que no se modifica; una copia de trabajo, que permite rehacer las versiones de consulta; y una copia de difusión, que se publica. Las copias maestras se guardan en tres ubicaciones independientes:</p>
          <p class="en">Each work is kept in three copies with distinct roles: a preservation master, which is never modified; a working copy, from which access versions can be remade; and an access copy, which is published. Master copies are stored in three independent locations:</p>
          <ol class="es aviso-lista">
            <li><b>Backblaze B2</b>, almacenamiento en la nube con bloqueo contra borrado y sobrescritura (Object Lock).</li>
            <li><b>Vault</b>, el servicio de preservación digital de Internet Archive, que mantiene varias copias y verifica su integridad.</li>
            <li><b>Internet Archive</b>, donde cada obra se publica junto con sus archivos originales.</li>
          </ol>
          <ol class="en aviso-lista">
            <li><b>Backblaze B2</b>, cloud storage protected against deletion and overwriting (Object Lock).</li>
            <li><b>Vault</b>, the Internet Archive's digital preservation service, which keeps multiple copies and checks their integrity.</li>
            <li><b>Internet Archive</b>, where each work is published together with its original files.</li>
          </ol>
        </section>

        <section id="formatos">
          <h2 class="es">Formatos</h2><h2 class="en">Formats</h2>
          <ol class="es aviso-lista">
            <li>Copias maestras: TIFF con compresión sin pérdida, a la máxima resolución del equipo de digitalización. Las obras digitalizadas antes de noviembre de 2026 tienen copias maestras en JPG de máxima calidad, que se conservan tal como se generaron.</li>
            <li>Copias de difusión: PDF, con visor y texto con búsqueda en Internet Archive.</li>
            <li>Metadatos: MARC 21, MARCXML y Dublin Core, además del catálogo del sitio web.</li>
            <li>Se prefieren formatos abiertos y documentados. Si alguno corre riesgo de quedar obsoleto, las copias se migran a un formato vigente y se conserva el original.</li>
          </ol>
          <ol class="en aviso-lista">
            <li>Master copies: TIFF with lossless compression, at the highest resolution of the digitization equipment. Works digitized before November 2026 have master copies in highest-quality JPG, which are kept exactly as created.</li>
            <li>Access copies: PDF, with a viewer and searchable text on the Internet Archive.</li>
            <li>Metadata: MARC 21, MARCXML and Dublin Core, in addition to the website catalogue.</li>
            <li>Open, documented formats are preferred. If a format is at risk of obsolescence, copies are migrated to a current format and the original is kept.</li>
          </ol>
        </section>

        <section id="integridad">
          <h2 class="es">Integridad</h2><h2 class="en">Integrity</h2>
          <ol class="es aviso-lista">
            <li>Al terminar la digitalización de cada obra se calcula una suma de verificación SHA-256 de cada archivo, que se guarda junto a la obra.</li>
            <li>Las sumas se comprueban en cada transferencia entre ubicaciones y, al menos, una vez al año.</li>
            <li>Si una copia no coincide con su suma de verificación, se sustituye por otra copia íntegra.</li>
            <li>La copia maestra solo conserva las correcciones geométricas automáticas del escáner (enderezado, recorte y aplanado) y no altera, de manera alguna, el contenido de la obra.</li>
          </ol>
          <ol class="en aviso-lista">
            <li>When the digitization of a work is completed, a SHA-256 checksum is calculated for each file and stored with the work.</li>
            <li>Checksums are verified on every transfer between locations and at least once a year.</li>
            <li>If a copy does not match its checksum, it is replaced with another intact copy.</li>
            <li>The master copy keeps only the scanner's automatic geometric corrections (straightening, cropping and flattening) and does not alter the content of the work in any way.</li>
          </ol>
        </section>

        <section id="acceso">
          <h2 class="es">Control de acceso</h2><h2 class="en">Access control</h2>
          <ol class="es aviso-lista">
            <li>Las cuentas de almacenamiento están protegidas con verificación en dos pasos.</li>
            <li>El personal de digitalización accede mediante claves limitadas a la carga de archivos, sin la contraseña de la cuenta.</li>
            <li>Las copias maestras no se modifican ni se eliminan; el bloqueo contra borrado lo impide también ante errores o ataques.</li>
          </ol>
          <ol class="en aviso-lista">
            <li>Storage accounts are protected with two-factor authentication.</li>
            <li>Digitization staff access storage through keys limited to uploading files, without the account password.</li>
            <li>Master copies are neither modified nor deleted; deletion protection also prevents this in case of errors or attacks.</li>
          </ol>
        </section>

        <section id="metadatos">
          <h2 class="es">Metadatos e identificadores</h2><h2 class="en">Metadata and identifiers</h2>
          <ol class="es aviso-lista">
            <li>Cada obra tiene una signatura estable (IC-0001) que nunca se reasigna, y un identificador persistente ARK (ark:{{ sitio.naan }}/IC-0001).</li>
            <li>Cada obra lleva metadatos descriptivos, una declaración de derechos según la legislación venezolana y la estadounidense, y un registro de digitalización con la fecha, el responsable y las características técnicas.</li>
            <li>Los metadatos se publican en acceso abierto mediante registros MARC y el punto de cosecha OAI-PMH de la Biblioteca.</li>
          </ol>
          <ol class="en aviso-lista">
            <li>Each work has a stable call number (IC-0001) that is never reassigned, and a persistent ARK identifier (ark:{{ sitio.naan }}/IC-0001).</li>
            <li>Each work carries descriptive metadata, a rights statement under Venezuelan and U.S. law, and a digitization record with the date, the person responsible and the technical characteristics.</li>
            <li>Metadata are openly published through MARC records and the Library's OAI-PMH endpoint.</li>
          </ol>
        </section>

        <section id="responsabilidades">
          <h2 class="es">Responsabilidades y revisión</h2><h2 class="en">Responsibilities and review</h2>
          <p class="es">La Dirección de Preservación Digital y la Coordinación de la Biblioteca Digital aplican esta política. La Junta Directiva la revisa una vez al año, o antes si cambian los medios técnicos o las ubicaciones de almacenamiento.</p>
          <p class="en">The Director of Digital Preservation and the Digital Library Coordinator apply this policy. The Board of Directors reviews it once a year, or sooner if the technical means or storage locations change.</p>
          <p class="es">Última revisión: noviembre de 2026.</p>
          <p class="en">Last reviewed: November 2026.</p>
        </section>
      </div>
    </div>
  </section>
</main>
