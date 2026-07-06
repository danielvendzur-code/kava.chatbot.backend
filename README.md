# KávaBot widget demo

Prémiový kávový chatbot pripravený ako samostatný `index.html` — vhodný na prezentáciu klientovi aj na vloženie do webu.

## Čo je upravené

- chatbot sa **otvorí automaticky** po načítaní stránky (vypnutie: `?open=0`),
- skutočný chat zážitok: bubliny, avatar, „píše…“ indikátor, konverzačné reakcie bota,
- v uvítaní je hlavné CTA **„Vybrať kávu podľa kvízu“** + skratky (firma, darček, automat),
- kvíz beží priamo v konverzácii: 5 otázok s emoji možnosťami, progres „Krok X z 5“, Späť / Odznova,
- prémiový vizuál: serifová typografia (Fraunces), tmavozelená + zlatá paleta, jemné animácie,
- výsledky v chate so zvýraznenou najlepšou zhodou a odstupňovaným skóre,
- dopyt formulár priamo v chate s predvyplneným výberom a potvrdením,
- textový vstup rozpozná napríklad `automat`, `firma`, `darček`, `filter`, `bez kofeínu`, `dopyt`, pozdrav,
- launcher podľa MôjPlot merania: `130 x 130 px` (zobrazí sa po zavretí chatu).

## Spustenie

Otvoriť `index.html` v prehliadači alebo spustiť statický server:

```powershell
python -m http.server 8788
```

Potom:

```text
http://127.0.0.1:8788/index.html
```

## Backend napojenie

Aktuálne sú produkty v poli `products` v `index.html`. Pri produkcii sa dá napojiť:

- `GET /api/products`
- `POST /api/recommend`
- `POST /api/leads`
