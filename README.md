# Sitio web de Idearium Caribe

Sitio estático de la fundación Idearium Caribe y de la revista *Colombeia* (ISSN 3069-7700), hecho con [Eleventy](https://www.11ty.dev/), publicado en Cloudflare Pages y editable con [Pages CMS](https://pagescms.org/).

## Cómo se publica

Cada cambio guardado en este repositorio (desde Pages CMS o desde GitHub) hace que Cloudflare Pages reconstruya el sitio en uno o dos minutos.

Configuración en Cloudflare Pages:

| Opción | Valor |
| --- | --- |
| Framework preset | Eleventy |
| Build command | `npx @11ty/eleventy` |
| Build output directory | `_site` |

## Dónde está cada cosa

| Qué | Archivo o carpeta | Se edita en Pages CMS como |
| --- | --- | --- |
| Páginas (Inicio, Fundación, Biblioteca, Colombeia, Apóyanos) | `paginas/` | Páginas |
| Artículos de Colombeia (ficha con título, autores, resumen, PDF…) | `colombeia/fichas/` | Artículos de Colombeia |
| PDF de los artículos | `colombeia/articulos/` | campo «PDF del artículo» |
| Números de Colombeia | `colombeia/numeros/` | Números de Colombeia |
| Portadas | `colombeia/portadas/` | campo «Portada» |
| Artículos del boletín en la portada | `_data/boletin.json` | Inicio: artículos del boletín |
| Obras destacadas de la Biblioteca | `_data/destacados.json` | Biblioteca: obras destacadas |
| Correo, dirección, redes, cifras | `_data/sitio.json` | Datos generales del sitio |
| Diseño común (cabecera, pie) | `_includes/base.njk` | — |
| Estilos | `assets/estilo.css` | — |
| Lector de PDF | `assets/lector.js` (usa PDF.js) | — |
| Cabeceras de seguridad | `_headers` | — |
| Redirecciones | `_redirects` | — |
| Configuración del editor | `.pages.yml` | — |

## Reglas para los artículos

- Cada artículo tiene su propia página, junto a su PDF, con los metadatos que pide Google Académico.
- El PDF debe pesar menos de 5 MB y tener texto seleccionable (no escaneado).
- La licencia «CC BY 4.0» solo corresponde a textos propios de la revista. En textos de terceros (inéditos y curados) el campo queda vacío.

## Antes de publicar en el dominio principal

1. En «Datos generales del sitio», confirme la dirección pública (`url`). Se usa en los metadatos de Google Académico y en el mapa del sitio.
2. El boletín, El Caribe Ilustrado, está en `www.elcaribeilustrado.com` (Substack; antes `ideariumcaribe.substack.com`). Las redirecciones de `_redirects` llevan allí los enlaces antiguos (`ideariumcaribe.com/p/...`).

## Trabajar en una computadora (opcional)

Requiere Node.js 22.

```
npm install
npm start
```

El sitio queda en http://localhost:8080 y se actualiza al guardar los archivos.

## Signaturas de la Biblioteca Digital

Las signaturas (`IC-0001`, `IC-0002`…) siguen el orden en que cada obra se subió al Internet Archive, de la más antigua a la más reciente (campo `addeddate` de la colección `idearium-caribe`). Cada obra nueva recibe el número siguiente al último. Los números de *Colombeia* no forman parte del catálogo: se consultan en la sección de la revista.

## Últimas incorporaciones y canal RSS

La página de la Biblioteca muestra las seis obras con signatura más alta (las últimas subidas a Internet Archive). El canal RSS `/biblioteca/novedades.xml` lista las 30 más recientes y usa el campo `incorporacion` (fecha de subida, AAAA-MM-DD) como fecha de publicación. Al añadir una obra en Pages CMS, complete «Fecha de incorporación».

## Registros MARC para bibliotecas

En cada compilación, `biblioteca/marc/marc.11ty.js` genera los registros MARC 21 de todas las obras de `_data/catalogo.json` (con la lógica de `lib/marc.js`) en tres formatos: `/biblioteca/marc/idearium-caribe.mrc` (binario), `.xml` (MARCXML) y `.mrk` (texto de MarcEdit). Se enlazan en la página de la Biblioteca, sección «Registros para bibliotecas». No hay que tocarlos a mano: se actualizan al añadir obras al catálogo. Si una obra no está en español o se publicó en una ciudad nueva, añada su código en `IDIOMAS` o `PAISES` dentro de `lib/marc.js`.

## Cosecha OAI-PMH, schema.org e IIIF

- `functions/oai.js` es una función de Cloudflare Pages que responde en `/oai` al protocolo OAI-PMH 2.0 (verbos Identify, ListMetadataFormats, ListSets, ListIdentifiers, ListRecords y GetRecord; formatos `oai_dc` y `marc21`; conjuntos = materias). Lee `/biblioteca/oai/datos.json`, que genera `biblioteca/marc/oai-datos.11ty.js` en cada compilación. La fecha de cada registro es la de incorporación.
- Cada página de obra lleva datos estructurados schema.org (`Book`, filtro `ldObra`) y el catálogo un `Collection`.
- Cada obra enlaza su manifiesto IIIF de Internet Archive (`https://iiif.archive.org/iiif/3/<identificador>/manifest.json`), también incluido en MARC y en Dublin Core.

## Identificadores persistentes (ARK)

`functions/ark/[[ruta]].js` resuelve los ARK de la Biblioteca: `ark:NAAN/IC-0001` → página de la obra (la signatura es el nombre base; guiones y mayúsculas no cuentan). Con `?info` devuelve la ficha ERC. La regla registrada en la ARK Alliance es `https://www.ideariumcaribe.com/ark/${content}`. Todo se activa al escribir el NAAN en `_data/sitio.json` (campo «NAAN de los identificadores ARK» en Pages CMS): la página de cada obra muestra el identificador, las citas lo usan y MARC, Dublin Core y schema.org lo incluyen. Las signaturas nunca se reasignan.

## Signposting

Las páginas de obra incluyen enlaces tipados (signposting.org, nivel 1) en `_includes/metas-obra.njk`: `cite-as` (ARK), `type` (schema.org), `describedby` (Dublin Core y MARCXML vía OAI-PMH), `item` (manifiesto IIIF) y `collection` (catálogo). Cuando se defina la declaración de derechos de cada obra, se añadirá `license`.

## Derechos de cada obra

Cada obra del catálogo lleva dos campos: `derechos_eeuu` (declaración de RightsStatements.org: `NoC-US`, `InC` o `UND`; etiquetas y enlaces en `_data/derechos.json`) y `derechos_venezuela` (nota pública con la situación en Venezuela y su fundamento legal). Se muestran en la página de la obra y se publican en MARC (campo 542, uno por país), Dublin Core (`dc:rights`), schema.org (`usageInfo`) y Signposting (`license`). Criterio: ley de 1962 (vida + 50 años), ley de 1993 (vida + 60, art. 142) y restauración estadounidense del 1 de enero de 1996. El campo `autorizacion` recoge al titular que autorizó la difusión.

## Registros de autoridad de los autores

`_data/autoridades.json` asocia cada autor del catálogo (por su nombre natural) con sus identificadores de Wikidata, VIAF, Biblioteca del Congreso (LCNAF) y Biblioteca Nacional de España. Se muestran en la página de cada autor, se añaden a schema.org (`sameAs`) y a MARC ($0 con LCNAF y VIAF, $1 con Wikidata en los campos 100/110/700/710). Los autores sin registro verificado no figuran en el archivo.

## Accesibilidad

El sitio se revisa con axe-core frente a WCAG 2.2 AA (y buenas prácticas) en escritorio y móvil. Reglas: un solo `h1` por página (el título de la primera sección), niveles de encabezado sin saltos (el pie usa `h2`), objetivos táctiles de al menos 24 px y ninguna región complementaria (`aside`) dentro de otra.

## Licencia de los metadatos

Los metadatos del catálogo (registros MARC, Dublin Core, OAI-PMH, datos del sitio) se publican bajo CC0 1.0, como exigen DPLA y Europeana. Se declara en la página de la Biblioteca, en la política de preservación y en la respuesta Identify del punto OAI (`rightsManifest` con `appliesTo` = metadatos). No se aplica a las obras, cuyos derechos van en `derechos_eeuu` y `derechos_venezuela`.

## Buscador del sitio

`/buscar.html` usa Pagefind (versión fija en package.json). El índice se genera al terminar cada compilación (evento `eleventy.after` en eleventy.config.js) en `_site/pagefind/`. Se indexa el contenido de `data-pagefind-body`, que base.njk pone en todas las páginas salvo el catálogo, los índices de autores y temas, la 404 y el propio buscador (o las que lleven `buscable: false`). Cada página lleva un filtro «tipo» (Obra, Autor, Tema, Colombeia, Página). El texto en inglés (`.en`) y los bloques repetitivos no se indexan. La CSP incluye `'wasm-unsafe-eval'`, que Pagefind necesita.

## Tipografías

EB Garamond (400, 500, 600 y cursiva 400) e IBM Plex Mono (400) se sirven desde el propio sitio (`assets/fonts/`, declaradas en `assets/fuentes.css`, subconjuntos latin y latin-ext), con sus licencias SIL OFL 1.1 al lado. El sitio no carga nada de Google Fonts y la CSP ya no lo permite.

## Canal RSS de Colombeia

`colombeia/rss.njk` genera `/colombeia/rss.xml` con todos los artículos, del número más reciente al más antiguo. La fecha de cada artículo es el primer día del bimestre de su número (filtro `fechaNumero`: n.º 1 = septiembre de 2025) y el PDF va como adjunto (`enclosure`). Se anuncia en todas las páginas y se enlaza junto a «Todos los números».

## Comodidades de lectura

- **Obras relacionadas** (filtro `relacionadas`): hasta seis obras del mismo autor o con temas en común, como máximo dos volúmenes por obra en varios tomos.
- **Fechas de los autores** (filtro `fechasAutor`), tomadas de `_data/autoridades.json`.
- **Citas descargables**: `/biblioteca/obras/<id>/cita.ris|.bib` y `/colombeia/citas/<archivo>.ris|.bib`. Las formas invertidas de autores de Colombeia sin forma de catálogo se deducen; las dudosas van en `FORMAS_COLOMBEIA` (eleventy.config.js).
- **Compartir** (`_includes/compartir.njk`): copiar enlace, WhatsApp, X y correo, sin código de terceros.
- **Catálogo**: la búsqueda (`q`), el orden y la vista quedan en la dirección.
- **Vistos recientemente**: `localStorage` del navegador (`ic-vistos`), mostrado en la página de la Biblioteca.
- **404 con buscador** (la CSP permite `form-action 'self'`), **volver arriba** e **impresión** limpia con el enlace permanente al pie.
