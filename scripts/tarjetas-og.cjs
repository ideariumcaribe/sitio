// Genera las imágenes para compartir (1200×630, JPEG) en assets/og/ a partir de _site/og/datos.json.
// Uso, tras compilar el sitio:  node scripts/tarjetas-og.cjs [--todas]
// Solo rehace las tarjetas nuevas o cuyo texto cambió (assets/og/indice.json guarda una huella de cada una).
// Requiere Playwright con Chromium.
const fs = require("fs"), path = require("path"), http = require("http"), crypto = require("crypto");
const { chromium } = require("playwright");
const RAIZ = path.resolve(__dirname, ".."), SITE = path.join(RAIZ, "_site"), DEST = path.join(RAIZ, "assets", "og");
const TIPOS = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };
const VERSION = "3"; // cambiar al modificar la plantilla, para rehacer todas

(async () => {
  const datos = JSON.parse(fs.readFileSync(path.join(SITE, "og", "datos.json"), "utf8"));
  const indicePath = path.join(DEST, "indice.json");
  const indice = fs.existsSync(indicePath) ? JSON.parse(fs.readFileSync(indicePath, "utf8")) : {};
  const huella = (d) => crypto.createHash("sha1").update(VERSION + JSON.stringify(d)).digest("hex").slice(0, 12);
  const todas = process.argv.includes("--todas");
  const pendientes = datos.filter((d) => todas || indice[d.archivo] !== huella(d) || !fs.existsSync(path.join(DEST, d.archivo)));
  console.log(`${pendientes.length} de ${datos.length} tarjetas por generar`);
  const plantilla = fs.readFileSync(path.join(__dirname, "og-plantilla.html"));
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split("?")[0]);
    if (u === "/__og.html") { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(plantilla); }
    const f = path.join(SITE, u);
    if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
  }).listen(0);
  const puerto = srv.address().port;
  const b = await chromium.launch();
  const trabajar = async (lote) => {
    const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
    await p.goto(`http://localhost:${puerto}/__og.html`, { waitUntil: "load" });
    for (const d of lote) {
      await p.evaluate((d) => window.pintar(d), d);
      const f = path.join(DEST, d.archivo); fs.mkdirSync(path.dirname(f), { recursive: true });
      await p.screenshot({ path: f, type: "jpeg", quality: 75 });
      indice[d.archivo] = huella(d);
    }
    await p.close();
  };
  const N = 4, lotes = Array.from({ length: N }, (_, i) => pendientes.filter((_, j) => j % N === i));
  await Promise.all(lotes.map(trabajar));
  await b.close(); srv.close();
  fs.mkdirSync(DEST, { recursive: true });
  fs.writeFileSync(indicePath, JSON.stringify(Object.fromEntries(Object.entries(indice).sort()), null, 0) + "\n");
  console.log("Listo.");
})();
