// Lugares de edición: forma normalizada de la ciudad del pie de imprenta, país y coordenadas (longitud, latitud).
// Si una obra nueva trae una ciudad que no figura aquí, se muestra con su nombre tal cual y sin punto en el mapa.
export const CIUDADES = {
  "Caracas": { nombre: "Caracas", pais: "Venezuela", c: [-66.9, 10.49] },
  "Valencia": { nombre: "Valencia", pais: "Venezuela", c: [-68.0, 10.16] },
  "Maracaibo": { nombre: "Maracaibo", pais: "Venezuela", c: [-71.64, 10.65] },
  "Mérida": { nombre: "Mérida", pais: "Venezuela", c: [-71.14, 8.59] },
  "San Cristóbal": { nombre: "San Cristóbal", pais: "Venezuela", c: [-72.23, 7.77] },
  "Madrid": { nombre: "Madrid", pais: "España", c: [-3.7, 40.42] },
  "Barcelona": { nombre: "Barcelona", pais: "España", c: [2.17, 41.39] },
  "Oviedo": { nombre: "Oviedo", pais: "España", c: [-5.84, 43.36] },
  "New York": { nombre: "Nueva York", pais: "Estados Unidos", c: [-74.01, 40.71] },
  "París": { nombre: "París", pais: "Francia", c: [2.35, 48.86] },
  "Choisy-le-Roi": { nombre: "Choisy-le-Roi", pais: "Francia", c: [2.41, 48.76] },
  "México D.F.": { nombre: "Ciudad de México", pais: "México", c: [-99.13, 19.43] },
  "Méjico": { nombre: "Ciudad de México", pais: "México", c: [-99.13, 19.43] },
  "Bogotá": { nombre: "Bogotá", pais: "Colombia", c: [-74.07, 4.71] },
  "Buenos Aires": { nombre: "Buenos Aires", pais: "Argentina", c: [-58.38, -34.6] },
  "Santiago de Chile": { nombre: "Santiago de Chile", pais: "Chile", c: [-70.67, -33.45] },
  "Ciudad Trujillo": { nombre: "Ciudad Trujillo (Santo Domingo)", pais: "República Dominicana", c: [-69.93, 18.49] },
  "Bruselas": { nombre: "Bruselas", pais: "Bélgica", c: [4.35, 50.85] },
  "Roma": { nombre: "Roma", pais: "Italia", c: [12.5, 41.9] },
  "Tokio": { nombre: "Tokio", pais: "Japón", c: [139.69, 35.69] },
};
// Punto y etiqueta de cada país en el mapa del mundo (capital o ciudad principal; desplazamiento de la etiqueta).
export const PAISES = {
  "Venezuela": { c: [-66.9, 10.49], dx: 10, dy: 22, a: "start" },
  "España": { c: [-3.7, 40.42], dx: -12, dy: 16, a: "end" },
  "Estados Unidos": { c: [-74.01, 40.71], dx: -12, dy: -6, a: "end" },
  "Francia": { c: [2.35, 48.86], dx: -8, dy: -16, a: "end" },
  "México": { c: [-99.13, 19.43], dx: -12, dy: 4, a: "end" },
  "Colombia": { c: [-74.07, 4.71], dx: -12, dy: 8, a: "end" },
  "Argentina": { c: [-58.38, -34.6], dx: 10, dy: 5, a: "start" },
  "Chile": { c: [-70.67, -33.45], dx: -10, dy: 5, a: "end" },
  "República Dominicana": { c: [-69.93, 18.49], dx: 10, dy: -6, a: "start" },
  "Bélgica": { c: [4.35, 50.85], dx: 8, dy: -12, a: "start" },
  "Italia": { c: [12.5, 41.9], dx: 10, dy: 6, a: "start" },
  "Japón": { c: [139.69, 35.69], dx: -10, dy: -10, a: "end" },
};
const ISO = { "Venezuela": "862", "España": "724", "Estados Unidos": "840", "Francia": "250", "México": "484", "Colombia": "170", "Argentina": "032", "Chile": "152", "República Dominicana": "214", "Bélgica": "056", "Italia": "380", "Japón": "392" };
export const isoPais = (p) => ISO[p];
export const ciudadRaw = (pie) => String(pie || "").split(",")[0].trim();
export const lugar = (pie) => { const r = ciudadRaw(pie); return CIUDADES[r] || (r ? { nombre: r, pais: "", c: null } : null); };
