# KávaBot widget demo

Prémiový kávový poradca pripravený ako samostatný `index.html` — vhodný na prezentáciu klientovi aj na vloženie do webu.

## Čo je upravené

- prezentovateľná úvodná stránka s krátkym popisom a benefitmi,
- prémiový vizuál: serifová typografia (Fraunces), tmavozelená + zlatá paleta, jemné animácie,
- launcher nastavený podľa MôjPlot merania: `130 x 130 px`,
- teaser nastavený podľa MôjPlot merania: približne `248 x 117 px`,
- jednoduché ovládanie: 5 otázok klikaním, progres „Krok X z 5“, tlačidlo Späť,
- výsledky z lokálneho katalógu so zvýraznenou najlepšou zhodou a odstupňovaným skóre,
- funkčný demo dopyt formulár s predvyplneným výberom,
- textový vstup rozpozná napríklad `automat`, `firma`, `darček`, `filter`, `bez kofeínu`.

## Spustenie

Otvoriť `index.html` v prehliadači alebo spustiť statický server:

```powershell
python -m http.server 8788
```

Potom:

```text
http://127.0.0.1:8788/index.html
```

## GitHub Pages

Repo obsahuje `.nojekyll`, takže GitHub Pages nepúšťa Jekyll build a publikuje stránku ako čistý statický web.

Deploy rieši workflow `.github/workflows/pages.yml`:

- spustí sa pri každom pushi na `main`,
- nahrá celý statický web ako Pages artifact,
- nasadí ho cez oficiálnu akciu `actions/deploy-pages`.

V GitHube má byť v nastaveniach repozitára:

- Settings -> Pages
- Build and deployment -> Source: GitHub Actions

Live URL:

```text
https://danielvendzur-code.github.io/kava.chatbot.backend/
```

## Backend napojenie

Aktuálne sú produkty v poli `products` v `index.html`. Pri produkcii sa dá napojiť:

- `GET /api/products`
- `POST /api/recommend`
- `POST /api/leads`
