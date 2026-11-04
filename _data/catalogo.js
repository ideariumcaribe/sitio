// Catálogo visible de la Biblioteca Digital: fondo/catalogo.json (editable en Pages CMS) sin las obras
// marcadas como ocultas («oculta»: true), que dejan de mostrarse en todo el sitio sin perder su signatura.
import { visibles } from "../lib/fondo.js";
export default () => visibles();
