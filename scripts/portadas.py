#!/usr/bin/env python3
"""Descarga las portadas de las obras del catálogo desde Internet Archive y las guarda en assets/portadas/<identificador>.webp.

Uso (desde la raíz del sitio):  python3 scripts/portadas.py [--todas]
Solo procesa las obras que aún no tienen portada local, salvo con --todas.
Usa la primera página a mayor resolución (360 px de ancho, para pantallas de alta densidad) cuando coincide con la
miniatura elegida en Internet Archive; si no coincide, conserva esa miniatura.
Requiere Pillow. Las obras sin portada local siguen mostrando la miniatura de Internet Archive.
"""
import io, json, sys, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "portadas"
ANCHO = 360

def bajar(url):
    r = subprocess.run(["curl", "-sfL", "-m", "90", url], capture_output=True)
    return Image.open(io.BytesIO(r.stdout)).convert("RGB") if r.returncode == 0 and r.stdout else None

def huella(img):
    return img.convert("L").resize((24, 36))

def procesar(ident):
    salida = DESTINO / f"{ident}.webp"
    miniatura = bajar(f"https://archive.org/services/img/{ident}")
    pagina = bajar(f"https://archive.org/download/{ident}/page/n0_w{ANCHO}.jpg")
    if pagina and miniatura:
        dif = ImageStat.Stat(ImageChops.difference(huella(miniatura), huella(pagina))).mean[0]
        img, fuente = (pagina, "página 1") if dif < 28 else (miniatura, f"miniatura (dif. {dif:.0f})")
    else:
        img, fuente = (miniatura or pagina), "miniatura" if miniatura else "página 1"
    if img is None:
        return ident, "sin imagen"
    if img.width > ANCHO:
        img = img.resize((ANCHO, round(img.height * ANCHO / img.width)), Image.LANCZOS)
    img.save(salida, "WEBP", quality=72, method=6)
    return ident, f"{fuente}, {img.width}×{img.height}, {salida.stat().st_size // 1024} kB"

def miniaturas():
    """Versión pequeña (120 px de ancho) de cada portada local, para la cronología."""
    mini = DESTINO / "mini"; mini.mkdir(exist_ok=True); n = 0
    for f in DESTINO.glob("*.webp"):
        m = mini / f.name
        if m.exists() and m.stat().st_mtime >= f.stat().st_mtime: continue
        img = Image.open(f).convert("RGB"); img = img.resize((120, round(img.height * 120 / img.width)), Image.LANCZOS)
        img.save(m, "WEBP", quality=70, method=6); n += 1
    print(f"{n} miniaturas nuevas")

def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    catalogo = json.loads((RAIZ / "fondo" / "catalogo.json").read_text(encoding="utf-8"))
    ids = [o["identificador"] for o in catalogo if "--todas" in sys.argv or not (DESTINO / f"{o['identificador']}.webp").exists()]
    print(f"{len(ids)} portadas por descargar")
    with ThreadPoolExecutor(8) as ex:
        for ident, nota in ex.map(procesar, ids):
            print(f"  {ident}: {nota}")

if __name__ == "__main__":
    main()
    miniaturas()
