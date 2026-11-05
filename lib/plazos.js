// Plazos de protección en Estados Unidos para las obras de la Biblioteca (todas extranjeras, restauradas por la URAA):
// 95 años desde la publicación, contados hasta el 31 de diciembre. Base: el año de la edición digitalizada («anio»),
// igual que la clasificación original de derechos.
// - eeuuEfectivo: una obra protegida o indeterminada pasa a NoC-US el 1 de enero siguiente al vencimiento.
//   La compilación lo aplica sola; el Worker archivo-wayback reconstruye el sitio cada 1 de enero.
// - ultimos20: obras en los últimos veinte años de protección, candidatas a la sección 108(h) (17 U.S.C. § 108(h)).
// - amparo108h: la investigación razonable exigida por la ley está documentada en «investigacion_108h» y es favorable.
export const anioActual = () => new Date().getUTCFullYear();
const anio = (o) => parseInt(o && o.anio, 10) || 0;
const protegida = (o) => o.derechos_eeuu === "InC" || o.derechos_eeuu === "UND";
export const finProteccion = (o) => (anio(o) ? anio(o) + 95 : 0);
export function eeuuEfectivo(o, hoy = anioActual()) {
  if (protegida(o) && anio(o) && finProteccion(o) < hoy) return { ...o, derechos_eeuu: "NoC-US", derechos_eeuu_vencido: finProteccion(o) + 1, derechos_eeuu_original: o.derechos_eeuu };
  return o;
}
export const ultimos20 = (o, hoy = anioActual()) => protegida(o) && !o.autorizacion && anio(o) > 0 && finProteccion(o) >= hoy && finProteccion(o) - 19 <= hoy;
export function amparo108h(o, hoy = anioActual()) {
  const i = o.investigacion_108h;
  return ultimos20(o, hoy) && !!(i && i.fecha && i.comercializada === "No" && i.precio_razonable === "No" && i.aviso_titular === "No");
}
