export default {
  layout: "numero.njk",
  eleventyComputed: {
    permalink: (d) => `/colombeia/numero-${d.numero}/`,
    title: (d) => `Colombeia, n.º ${d.numero}: ${d.titulo} · Idearium Caribe`,
  },
};
