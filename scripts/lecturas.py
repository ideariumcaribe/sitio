#!/usr/bin/env python3
"""Anota en _data/lecturas.json las consultas de cada obra en Internet Archive (total y últimos treinta días).

Lo ejecuta cada semana .github/workflows/lecturas.yml. Uso manual (desde la raíz del sitio):  python3 scripts/lecturas.py
"""
import json, sys, urllib.request, datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "_data" / "lecturas.json"
URL = "https://archive.org/advancedsearch.php?q=collection%3Aidearium-caribe&fl%5B%5D=identifier&fl%5B%5D=downloads&fl%5B%5D=month&rows=2000&output=json"

def main():
    with urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "ideariumcaribe.com (lecturas)"}), timeout=120) as r:
        docs = json.load(r)["response"]["docs"]
    if not docs:
        sys.exit("Internet Archive no devolvió obras; no se modifica el archivo.")
    obras = {d["identifier"]: {"total": int(d.get("downloads") or 0), "mes": int(d.get("month") or 0)} for d in docs}
    anterior = json.loads(SALIDA.read_text(encoding="utf-8")) if SALIDA.exists() else {}
    if anterior.get("obras") == obras:
        print("Sin cambios."); return
    datos = {"fecha": datetime.date.today().isoformat(), "obras": dict(sorted(obras.items()))}
    SALIDA.write_text(json.dumps(datos, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(obras)} obras, {sum(o['total'] for o in obras.values())} consultas en total.")

if __name__ == "__main__":
    main()
