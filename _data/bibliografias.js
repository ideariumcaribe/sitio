// Conjuntos de obras con bibliografía descargable (RIS, BibTeX y CSV): cada tema, autor y obra en varios tomos.
import fs from "node:fs";
import { visibles } from "../lib/fondo.js";
import { colecciones } from "../lib/colecciones.js";
import autores from "./autoresBiblioteca.js";

export default function () {
  const cat = visibles();
  const mats = JSON.parse(fs.readFileSync(new URL("./materias.json", import.meta.url), "utf8"));
  const porSig = (l) => l.slice().sort((a, b) => a.signatura.localeCompare(b.signatura));
  const conjuntos = [
    ...mats.map((m) => ({ ruta: `/biblioteca/materias/${m.slug}/`, archivo: `tema-${m.slug}`, obras: porSig(cat.filter((o) => (o.materias || []).includes(m.slug))) })),
    ...autores().map((a) => ({ ruta: `/biblioteca/autores/${a.slug}/`, archivo: `autor-${a.slug}`, obras: a.obras })),
    ...colecciones(cat).map((c) => ({ ruta: `/biblioteca/colecciones/${c.slug}/`, archivo: `coleccion-${c.slug}`, obras: c.tomos })),
  ].filter((c) => c.obras.length);
  return conjuntos.flatMap((c) => ["ris", "bib", "csv"].map((formato) => ({ ...c, formato })));
}
