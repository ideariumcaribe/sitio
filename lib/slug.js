// Convierte un nombre en una dirección web: «Mario Briceño-Iragorry» → «mario-briceno-iragorry».
export const slugAutor = (s) =>
  String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
