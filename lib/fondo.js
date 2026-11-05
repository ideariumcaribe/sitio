// Lectura del catálogo completo (fondo/catalogo.json) y de su parte visible.
import fs from "node:fs";
import { eeuuEfectivo } from "./plazos.js";
export const todas = () => JSON.parse(fs.readFileSync(new URL("../fondo/catalogo.json", import.meta.url), "utf8"));
// Las obras visibles llevan ya aplicado el vencimiento de su plazo en EE. UU. (lib/plazos.js).
export const visibles = () => todas().filter((o) => !o.oculta).map((o) => eeuuEfectivo(o));
export const ocultas = () => todas().filter((o) => o.oculta);
