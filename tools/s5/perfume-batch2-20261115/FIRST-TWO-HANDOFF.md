# DEWS + SI·LU — zdroje a lokálne QA

Vlastník PERFUME_WORKER, vetva `codex/s5-perfume-batch2-20261115`. Stav **LOCAL_FIXTURE_QA_COMPLETE_NOT_INTEGRATED_NOT_PREVIEW**. Dve firmy z ďalšieho cieľa15, nie15 hotových.

Každá má šesť odlišných vôní na pranie, presné250ml balenie, originálne fotografie a samostatný zdrojový balík. DEWS12,99€, SI·LU15,99€ podľa konkrétnych oficiálnych produktov15.11.2026. Žiadne nafukovanie variantmi, zdravotné či predajné garancie, percentá tónov alebo vymyslené doplnky.

- Konfigurácie: `n447/s5/perfume-fragments/{dews,siluvone}.config.json` a `.selection-model.json`.
- Fakty: `n447/s5/sources/{dews,siluvone}/verified-products.json`.
- Katalógy: `catalogues/{dews,siluvone}.js`.
- Originálne fotografie a logá: `assets/s5/{dews,siluvone}/`.
- Presný import/registry/backend-rule/CSS návrh: `tools/s5/perfume-batch2-20261115/candidate-packages/{dews,siluvone}/integration-review.json`.
- Zdrojové HTML, účtovné výkazy a časové záznamy: `research/`.
- Strom: `engine-qa.json`;12/12 dosiahnuteľných výsledkov, jadro c9e4da0 nezmenené.
- UI: `first-two-ui-qa.json`;36/36 výsledkov320/390/1280, foto/cena/balenie/CTA/reset/progress/chips/hover/reduced-motion/porovnanie, offline chat zo zdrojových ID, paid0. Všetky výsledkové snímky vizuálne prezreté.
- Dôkazy: `evidence/dews-siluvone-local-qa.zip`, `evidence/dews-siluvone-merchant-live.zip`. Nástroje/dôkazy sú vylúčené z Vercelu existujúcim pravidlom tools/.

MAIN musí začleniť nové firemné fragmenty a overiť laundry-brand backend pravidlá, opt-in `body.dataset.fragranceProfile=visual-v1`, spoločné presentation includes a vykonať živé Preview QA. Pracovník spoločné súbory nemenil. Lokálne snímky nie sú dôkaz živého Preview. Cena447+10 nezmenená, pošta/produkcia/DNS/platené volania0.

Veľkosť: DEWS WAJDA SK55473911 oficiálne tržby2025=120686EUR. SI.LU56438761 tržby2025=19548EUR (18279+1269), nie19578 prevádzkové výnosy. Plné výkazy a IČO/rok/jednotky overené. Oficiálny kontakt SI.LU info@siluvone.sk; pri DEWS zatiaľ len operator privacy kontakt info@wajda.sk, obchodný kontakt doplniť z kontaktnej stránky. Záujem firiem neoverený.
