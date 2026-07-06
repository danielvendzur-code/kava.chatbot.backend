# KávaBot Concierge

Prémiový demo widget pre pražiareň alebo kávový e-shop. Je postavený ako samostatný `index.html`, takže sa dá otvoriť priamo v prehliadači alebo nasadiť ako statická stránka.

## Obsah

- hero demo stránka s kávovou fotografiou,
- plávajúci chatbot widget,
- poradenské flow pre domáci výber, firemný odber, darček a diagnostiku chuti,
- deterministické odporúčania z lokálneho katalógu,
- produktové karty s dôvodom zhody,
- porovnanie káv,
- lead formulár pripravený na napojenie do API alebo CRM.

## Spustenie

Stačí otvoriť `index.html`.

Pre lokálny preview server:

```powershell
python -m http.server 8788
```

Potom otvoriť:

```text
http://127.0.0.1:8788/index.html
```

## Backend napojenie

Aktuálne sú dáta v súbore v poli `products`. Pri reálnom nasadení sa oplatí vytiahnuť:

- `GET /api/products` pre katalóg,
- `POST /api/recommend` pre skórovanie alebo audit odporúčania,
- `POST /api/leads` pre odoslanie dopytu do CRM/e-mailu.

Logika je zámerne deterministická, aby bot neodporúčal produkty mimo katalógu.
