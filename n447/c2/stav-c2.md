# BLACK a Nordbeans – c2 z primárnych údajov (stav 2026-10-30)

Vetva `claude/n447-coffee-primary-20261030` (z `claude/n447-black-20261022`), commit `8395a53`, Preview https://kava-chatbot-backend-dnqb8ogcn-danielvendzur-codes-projects.vercel.app (/black.html, /nordbeans.html). Izolované kópie: `n447/c2/` (jadro, chat, poradca, dáta, štýly) a `api/chat-447c2.js`.
Odoslané ukážky (n447/engine.js, n447/reply.js, api/chat-447.js, ich dáta a stránky) sa nemenia. Cena služby 447 € + 10 €/mes., bez trialu.
Produkcia, aliasy, zákaznícke subdomény ani e-maily nie sú nasadené ani odoslané.

| Firma | Stav | Stránka | Produkty / overené balenia | Cesty výberu | Testy |
|---|---|---|---|---|---|
| BLACK. (pražiareň black.) | READY_FOR_REVIEW | /black.html | 16 káv + drippin. / 76 objednateľných kombinácií (75 káva + 1 drip) | 41 ciest, 1–5 krokov (priemer 4,2) | `node tools/c2/test-c2.mjs` PASS |
| Nordbeans | READY_FOR_REVIEW | /nordbeans.html | 21 káv + set Výběr baristy / 40 variantov (39 káva + 1 set), všetky „Skladem“ | 116 ciest, 2–7 krokov (priemer 5,7) | `node tools/c2/test-c2.mjs` PASS |

## Zdroj údajov
- Primárne údaje z bežného verejného UI e-shopov zozbieral Codex (BLACK 29. 10., Nordbeans 29.–30. 10.): bez košíka, prihlásenia, obchádzania ochrany a plateného API.
  Súbory: `black-primary-ui-2026-10-30.json`, `nordbeans-primary-ui-2026-10-30.json` (mimo repozitára, priložené v konverzácii).
- Generátory: `tools/c2/build_black.mjs`, `tools/c2/parse_nordbeans.py` + `tools/c2/build_nordbeans.mjs` → `n447/c2/data/{black,nordbeans}.js`.

## Konkrétne limity – BLACK
- Cena platí iba pre mletie **Zrnková**; cenu iného mletia nemáme overenú. Výsledok to uvádza pri každej káve („Overená cena platí pre zrnkovú kávu…“), chat tiež.
- **Akcie** ako ich e-shop 29. 10. zobrazil: black sheep 200 g aj 500 g za 10 € (500 g bežne 22,50 €), gundikhan −10 %, honduras el paraíso −10 %.
  Dátum konca akcie e-shop neuvádza – výsledok to hovorí. Menšie balenie za rovnakú cenu ako väčšie sa neodporúča (black sheep → 500 g).
- **Vyradené kombinácie** (neobjednateľné v UI, ich cenu nepoužívame): colombia • diego bermudez 1 kg; drippin. burundi • rumbagabanga.
- **Rozpočet** sa pri BLACK nepýta: v rámci rovnakej prípravy a chuti stoja najlacnejšie balenia 10–11 € (čokoládové), 12,60–16 € (plné ovocné) a 13,50–18 € (svieže na filter);
  zmysluplné dve hranice (aspoň tretina káv pod dolnou, odstup ≥ 15 %) neexistujú, takže otázka by výber nezmenila. Cena celej zostavy sa aj tak zobrazuje pri každom balení.
- **Doplnok ani hotový set**: v primárnych údajoch nie sú (iba káva a drip) → vo výsledku sa neukazujú.
- Pomôcka na filter (V60 / AeroPress / French press) sa nepýta, lebo vedie k rovnakým kávam; výsledok ukáže mletie pre všetky tri a recept pražiarne na V60.
- Doprava zdarma nad 40 € (SK, CZ) – z úvodnej stránky; iné ceny dopravy sme znova nečítali.

## Konkrétne limity – Nordbeans
- Iba viditeľné spotrebiteľské balenia (250 g / 1000 g) so stavom „Skladem“; skryté veľkoobchodné veľkosti nie sú vo výbere. Nie je to tvrdenie o celom sortimente.
- CTA otvorí presnú URL zvolenej varianty (napr. `horizont_z15/#403`) v rovnakej karte.
- **BOLD DEER**: samostatne iba 1000 g (1 363 Kč); 250 g je len v sete Výběr baristy – samostatné 250 g sa neodvodzuje.
  Recept zo zdroja (18 g / 40 ml / 1:2,7) je nekonzistentný → nepreberá sa. Ostatné recepty espressa prešli kontrolou dávka × pomer ≈ nápoj (± 3).
- **Hotový set** Výběr baristy 4 × 250 g za 1 150 Kč (BOLD DEER, HORIZONT, GUATEMALA, HOUSE BLEND) sa ukáže pri týchto kávach na espresso iba keď sa zmestí do rozpočtu.
  Bežnú cenu setu neuvádzame (BOLD DEER 250 g sa samostatne nepredáva, súčet nie je overiteľný).
- **Doplnky** z „Přibalte si také“ (filtre APRIL, šálka, lattiera, podložka) sa neodporúčajú: nie sú viazané na zvolenú pomôcku (napr. filtre APRIL nesedia na V60).
- Chuťová skupina podľa „Intenzita kyselosti“ pražiarne: nízká/nižší → čokoládová, střední → vyvážená s ovocem, vyšší/vysoká → svěží a ovocná (Keramo, Chelbesa, El Cambalache preradené z vyváženej do svieže podľa „Vyšší“).
- Fotky Cocondo Natural, Vara Blanca Honey a Jizerky: CDN e-shopu vrátilo 403 → vo výsledku sa načíta priamo z e-shopu; ak sa nenačíta, nahradí ju scéna zŕn (žiadne obchádzanie).
- Nordbeans už má vlastného sprievodcu výberom aj chatbota Talabot – ponuka ani chat netvrdia opak (ukážka je doplnok).

## Pravidlá výberu (overené testom pre každý uzol stromu)
- Každá otázka má ≥ 2 voľby a nie všetky voľby vedú k rovnakému výsledku.
- Žiadna voľba neukazuje názov produktu (SKU); posledný krok volí podľa chuťových tónov s pôvodom a spracovaním.
- Chuť je samostatne od kofeínu (kofeín sa pýta iba keď sú medzi vhodnými kávami obe možnosti).
- Rozpočet = cena celého nákupu (balenie + prípadný doplnok; set iba v limite). Hranica sa zaokrúhli nahor na okrúhlu sumu (50 Kč / 1 €), iba ak tým nezahrnie všetky kávy;
  káva s balením presne na hranici je v rozpočte, o halier nižšia hranica ju vylúči. Každá káva s balením v limite ostane dosiahnuteľná.
- Fotky volieb sú scény a chuťové tóny (žiadne vrecúška); produktová fotka iba vo výsledku.

## Testy (bez siete, bez Sonnet/plateného API)
- `node tools/c2/test-c2.mjs` – strom otázok, SKU v voľbách, dosiahnuteľnosť, rozpočty a hranice, presné ceny z primárnych údajov, CTA URL, recept BOLD DEER,
  4 rýchle voľby chatu cez `api/chat-447c2.js` s mockom (0 platených volaní).
- Prehliadač (Playwright): všetky obrazovky otázok na 320×568, 390×650, 560×600, 1280×800 – orezaný text volieb a pretečenie poradcu, chyby konzoly.
