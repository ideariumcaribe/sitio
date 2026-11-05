#!/usr/bin/env python3
"""Primera página de cada artículo de Colombeia como miniatura (assets/colombeia/paginas/<archivo>.webp), para la franja de la página de la revista.

Uso (desde la raíz del sitio):  python3 scripts/colombeia-paginas.py   — solo genera las que faltan. Requiere pdftoppm (poppler) y Pillow.
"""
import subprocess, tempfile
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "colombeia" / "paginas"

def main():
    DESTINO.mkdir(parents=True, exist_ok=True); n = 0
    for pdf in sorted((RAIZ / "colombeia" / "articulos").glob("*.pdf")):
        salida = DESTINO / (pdf.stem + ".webp")
        if salida.exists() and salida.stat().st_mtime >= pdf.stat().st_mtime: continue
        with tempfile.TemporaryDirectory() as t:
            subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-r", "60", "-png", str(pdf), f"{t}/p"], check=True)
            png = next(Path(t).glob("p*.png"))
            img = Image.open(png).convert("RGB")
            img = img.resize((300, round(img.height * 300 / img.width)), Image.LANCZOS)
            img.save(salida, "WEBP", quality=74, method=6); n += 1
    print(f"{n} páginas nuevas")

if __name__ == "__main__":
    main()
