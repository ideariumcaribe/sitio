#!/usr/bin/env python3
"""Guarda en fondo/textos/{identificador}.json.gz el texto OCR de cada obra, página a página, para la búsqueda en el texto de toda la Biblioteca.

Fuente: los archivos *_hocr_searchtext.txt.gz, *_hocr_pageindex.json.gz y *_page_numbers.json que Internet Archive genera para cada obra.
Formato: [[índice de imagen, número impreso o "", texto], ...]; se omiten las páginas sin texto.

Uso (desde la raíz del sitio):  python3 scripts/textos-paginas.py [--todas]
Solo procesa las obras que aún no tienen archivo, salvo con --todas.
"""
import gzip, json, os, re, subprocess, sys, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DEST = RAIZ / "fondo" / "textos"

def bajar(url, binario=False):
    r = subprocess.run(["curl", "-sfL", "--retry", "3", "-m", "180", url], capture_output=True)
    return r.stdout if r.returncode == 0 else None

def limpiar(t):
    t = t.replace("­ ", "").replace("­", "").replace("¬ ", "")
    t = re.sub(r"(\w)- (\w)", r"\1\2", t)            # guiones de final de línea
    return re.sub(r"\s+", " ", t).strip()

CACHE = os.environ.get("OCR_CACHE")  # carpeta opcional con los archivos ya descargados ({identificador}_hocr_searchtext.txt.gz, etc.)

def local(ident, suf):
    f = CACHE and Path(CACHE) / f"{ident}{suf}"
    return f.read_bytes() if f and f.exists() else None

def procesar(ident):
    a, b, c = (local(ident, s) for s in ("_hocr_searchtext.txt.gz", "_hocr_pageindex.json.gz", "_page_numbers.json"))
    if a and b: return guardar(ident, a, b, c)
    meta = bajar(f"https://archive.org/metadata/{ident}/files")
    try: archivos = [f["name"] for f in json.loads(meta)["result"]]
    except Exception: return ident, "sin respuesta"
    buscar = lambda suf: next((n for n in archivos if n.endswith(suf)), None)
    st, pi, pn = buscar("_hocr_searchtext.txt.gz"), buscar("_hocr_pageindex.json.gz"), buscar("_page_numbers.json")
    if not st or not pi: return ident, "aún sin texto"
    url = lambda n: f"https://archive.org/download/{ident}/{urllib.parse.quote(n)}"
    a, b = bajar(url(st)), bajar(url(pi))
    if a is None or b is None: return ident, "descarga fallida"
    return guardar(ident, a, b, bajar(url(pn)) if pn else None)

def guardar(ident, a, b, c):
    texto = gzip.decompress(a).decode("utf-8", "replace")
    indice = json.loads(gzip.decompress(b))
    numeros = {}
    if c:
        try: numeros = {p["leafNum"]: p.get("pageNumber") or "" for p in json.loads(c)["pages"]}
        except Exception: numeros = {}
    paginas = []
    for i, (ini, fin, *_r) in enumerate(indice):
        t = limpiar(texto[ini:fin])
        if len(t) >= 3: paginas.append([i, numeros.get(i, ""), t])
    if not paginas: return ident, "sin texto"
    (DEST / f"{ident}.json.gz").write_bytes(gzip.compress(json.dumps(paginas, ensure_ascii=False, separators=(",", ":")).encode(), 9, mtime=0))
    return ident, "ok"

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    cat = json.loads((RAIZ / "fondo" / "catalogo.json").read_text(encoding="utf-8"))
    ids = [o["identificador"] for o in cat if "--todas" in sys.argv or not (DEST / f"{o['identificador']}.json.gz").exists()]
    print(f"{len(ids)} obras por procesar")
    with ThreadPoolExecutor(4) as ex:
        for ident, r in ex.map(procesar, ids):
            if r != "ok": print(f"  {ident}: {r}")
    print(f"{len(list(DEST.glob('*.json.gz')))} obras con texto por páginas")

if __name__ == "__main__":
    main()
