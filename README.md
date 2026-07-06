# KávaBot widget demo

Kompaktný kávový poradca pripravený ako samostatný `index.html`.

## Čo je upravené

- bez veľkej falošnej landing stránky,
- malý popis k widgetu,
- launcher nastavený podľa MôjPlot merania: `130 x 130 px`,
- teaser nastavený podľa MôjPlot merania: približne `248 x 117 px`,
- funkčný výber kávy cez otázky,
- výsledky z lokálneho katalógu,
- funkčný demo dopyt formulár,
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

## Backend napojenie

Aktuálne sú produkty v poli `products` v `index.html`. Pri produkcii sa dá napojiť:

- `GET /api/products`
- `POST /api/recommend`
- `POST /api/leads`
