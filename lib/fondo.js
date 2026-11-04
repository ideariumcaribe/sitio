// Lectura del catálogo completo (fondo/catalogo.json) y de su parte visible.
import fs from "node:fs";
export const todas = () => JSON.parse(fs.readFileSync(new URL("../fondo/catalogo.json", import.meta.url), "utf8"));
export const visibles = () => todas().filter((o) => !o.oculta);
export const ocultas = () => todas().filter((o) => o.oculta);
