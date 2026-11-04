// Obras en varios tomos de la Biblioteca visible (lib/colecciones.js).
import { visibles } from "../lib/fondo.js";
import { colecciones } from "../lib/colecciones.js";
export default () => colecciones(visibles());
