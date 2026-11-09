# QA skripty (séria 4+)

Všetky bežia proti lokálnemu serveru (`node tools/s3a/serve.mjs <repo> 8997`), alebo `BASE=<url>`.
Spúšťaj s `NODE_PATH=$(npm root -g)` (Playwright je globálne).

| Skript | Použitie | Čo robí |
|---|---|---|
| `shots3.cjs` | `node shots3.cjs <slug> <outdir> "0,2,1" "1,1,1" "2,1,0"` | 3 odlišné cesty poradcom × 320/390/1280 px → `<slug>-cesta{1,2,3}-{w}.png` + výpis výsledku |
| `tree.cjs` | `node tree.cjs <slug>` | celý strom otázok a možností (kontrola pravdivosti volieb a fotiek) |
| `res4.cjs` | `node res4.cjs <slug> "0,1" <out.png> [full]` | jedna cesta do výsledku, snímka |
| `cmpn.cjs` | `node cmpn.cjs <slug> <out.png>` | čip „Porovnať“ v chate → 2 produkty → tabuľka |
| `follow.cjs` | `node follow.cjs <slug> "0,0,0"` | z výsledku do chatu → kontrola nadväzujúcej vety |
| `ask.cjs` | `node ask.cjs <slug> "otázka" ...` | otázky do chatu (offline/mock), odpoveď + počet kariet |
| `chips-off.cjs` | `node chips-off.cjs <slug>` | každý zo 4 čipov offline musí vrátiť produkt |
| `svg2png.cjs` | `node svg2png.cjs in.svg out.png w h [bg]` | logo zo SVG cez Playwright |
| `ruz.py` | `python3 ruz.py <IČO>…` | tržby (čistý obrat) SK firiem z registeruz.sk API |
