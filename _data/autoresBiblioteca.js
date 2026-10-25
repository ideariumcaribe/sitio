// Lista de autores de la Biblioteca, calculada a partir del catálogo.
// La forma de catálogo («Apellidos, Nombre») sale de _data/autores.json;
// si un autor nuevo no está allí, se usa el nombre tal como aparece.
import fs from "node:fs";
import { slugAutor } from "../lib/slug.js";

const sinTildes = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function () {
  const leer = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), "utf8"));
  const catalogo = leer("./catalogo.json");
  const formas = Object.fromEntries(leer("./autores.json").map((a) => [a.nombre, a.forma_catalogo]));
  const mapa = new Map();
  for (const obra of catalogo) {
    for (const nombre of String(obra.autor || "").split(";").map((s) => s.trim()).filter(Boolean)) {
      if (!mapa.has(nombre)) {
        const forma = formas[nombre] || nombre;
        mapa.set(nombre, { nombre, forma, slug: slugAutor(nombre), inicial: sinTildes(forma).charAt(0).toUpperCase(), obras: [] });
      }
      mapa.get(nombre).obras.push(obra);
    }
  }
  const autores = [...mapa.values()];
  for (const a of autores) {
    a.obras.sort((x, y) => (x.anio || "").localeCompare(y.anio || "") || x.titulo.localeCompare(y.titulo, "es"));
  }
  // Orden de biblioteca, palabra por palabra: «Pérez, Ana» va antes que «Pérez Jiménez».
  const clave = (a) => a.forma.replace(/,/g, "  ");
  return autores.sort((a, b) => clave(a).localeCompare(clave(b), "es", { sensitivity: "base" }));
}
