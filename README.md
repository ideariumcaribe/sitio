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
2. Si el boletín de Substack pasa a `boletin.ideariumcaribe.com`, cambie también el campo «Dirección del boletín» y active las redirecciones de `_redirects`.

## Trabajar en una computadora (opcional)

Requiere Node.js 22.

```
npm install
npm start
```

El sitio queda en http://localhost:8080 y se actualiza al guardar los archivos.
