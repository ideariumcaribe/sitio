#!/usr/bin/env python3
"""Anota en _data/textosIA.json el archivo de texto plano (OCR, *_djvu.txt) y el número de páginas de cada obra en Internet Archive.

Uso (desde la raíz del sitio):  python3 scripts/textos.py [--todas]
Solo consulta las obras que aún no figuran en el archivo, salvo con --todas.
"""
import json, subprocess, sys, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "_data" / "textosIA.json"

def consultar(ident):
    r = subprocess.run(["curl", "-sfL", "-m", "60", f"https://archive.org/metadata/{ident}"], capture_output=True, text=True)
    try:
        meta = json.loads(r.stdout)
        archivos = meta.get("files", [])
        paginas = int((meta.get("metadata") or {}).get("imagecount") or 0)
    except Exception:
        return ident, None
    if not paginas:
        pn = [f["name"] for f in archivos if f.get("name", "").endswith("_page_numbers.json")]
        if pn:
            r2 = subprocess.run(["curl", "-sfL", "-m", "60", f"https://archive.org/download/{ident}/{urllib.parse.quote(pn[0])}"], capture_output=True, text=True)
            try: paginas = len(json.loads(r2.stdout).get("pages", []))
            except Exception: paginas = 0
    txt = [f for f in archivos if f.get("name", "").endswith("_djvu.txt")]
    if not txt:
        return ident, ""
    mejor = max(txt, key=lambda f: int(f.get("size") or 0))
    return ident, {"archivo": mejor["name"], "bytes": int(mejor.get("size") or 0), "paginas": paginas}

def main():
    catalogo = json.loads((RAIZ / "fondo" / "catalogo.json").read_text(encoding="utf-8"))
    datos = json.loads(SALIDA.read_text(encoding="utf-8")) if SALIDA.exists() else {}
    ids = [o["identificador"] for o in catalogo if "--todas" in sys.argv or o["identificador"] not in datos]
    print(f"{len(ids)} obras por consultar")
    with ThreadPoolExecutor(8) as ex:
        for ident, res in ex.map(consultar, ids):
            if not res:
                print(f"  {ident}: {'sin respuesta' if res is None else 'aún sin texto (Internet Archive lo está procesando)'}")
                continue
            datos[ident] = res
    SALIDA.write_text(json.dumps(dict(sorted(datos.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{sum(1 for v in datos.values() if v)} obras con texto plano de {len(datos)}")

if __name__ == "__main__":
    main()
