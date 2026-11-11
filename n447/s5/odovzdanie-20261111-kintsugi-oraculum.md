# Kintsugi Perfumes a ORACULUM

Rezervácia oboch firiem je v `coord/s5-claims` na `97bab0bcdca7ca1bf3944a109d69ab259f75c92b`. Scentisimo je štrnásta overená ukážka. Nezávislý živý report je v `7ea625d912b9ceea02387f189bd9810056250d2d` na vetve `codex/s5-perfume-20261110`.

| Ukážka | Kompozície | Lokálne výsledky pri 320, 390 a 1280 px | Snímky otázok |
|---|---:|---:|---:|
| Kintsugi Perfumes | 12 | 36 | 15 |
| ORACULUM | 6 | 18 | 9 |

Kintsugi používa oficiálne fotografie a ceny v CZK podľa dostupných Shopify variantov. TEMPO sa zobrazuje ako balenie 2 × 8 ml za 1 190 Kč a počíta sa ako jedna kompozícia. Podmienky obchodu uvádzajú ceny s DPH.

ORACULUM používa konečné ceny z oficiálnych ponúk. Päť dostupných 10 ml balení je v rozbaľovacích detailoch. Pre MIO DIO je doložené balenie 30 ml. Podmienky predajcu uvádzajú, že predajca nie je platiteľom DPH.

Na oboch ukážkach prešli tri odpovede v chate pri každej šírke, porovnanie dvoch kompozícií a kontrola štyroch 40 px čipov. Backend prešiel troma mock odpoveďami na firmu. Platené volania 0. Snímky a zdroje ostávajú v cestách vylúčených cez `.vercelignore`.

## Živé Preview QA

Vercel READY na `dbc488457a8715b95dd3bce2c16893a53b42515f`, nasadenie `dpl_FGvdnSXTepVjsZ5d94SBc61q5VJv`.

- Kintsugi 12/12 výsledkov, všetkých päť strán otázok, porovnanie a štyri 40 px čipy. [Preview](https://kava-chatbot-backend-h45wv6v20-danielvendzur-codes-projects.vercel.app/s5.html?demo=kintsugi)
- ORACULUM 6/6 výsledkov, všetky tri strany otázok, päť 10 ml alternatív, porovnanie a štyri 40 px čipy. [Preview](https://kava-chatbot-backend-h45wv6v20-danielvendzur-codes-projects.vercel.app/s5.html?demo=oraculum)

Na každej živej trase sa načítala fotografia, sedelo balenie, cena a cieľ produktového odkazu. Rozsah QA chatových odpovedí je lokálny mock. Spolu 16 ukážok overených na Preview. 102 lokálnych snímok oboch ukážok je v 26 ZIP archívoch s kontrolnými súčtami.
