(() => {
  "use strict";
  const mark = `
    <svg class="jolka-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path class="jolka-mark__body" d="M32 5.7C17.7 5.7 7 15.7 7 29.2c0 8.1 4.1 15 10.8 19.2L15.5 58l10.7-5.4c1.9.4 3.8.6 5.8.6 14.3 0 25-10.3 25-24S46.3 5.7 32 5.7Z"/>
      <path class="jolka-mark__j" d="M40.2 18.1c.1 10-1.2 18.2-5.8 23.4-3.1 3.5-8.7 3.7-11.5.3-2.4-2.9-1.1-7.2 2.3-8.6 6-2.4 11.1-7.3 15-15.1Z"/>
    </svg>`;
  const icon = (path) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}"/></svg>`;
  const icons = {
    next: icon("m9 18 6-6-6-6"),
    check: icon("m5 12 4 4L19 6"),
    classic: icon(
      "M6 8h10v7a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V8Zm10 2h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1.5 1 2.5M12 4c0 1 1 1.5 1 2.5",
    ),
    milk: icon("M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"),
    balanced: icon("M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"),
    fruity: icon(
      "M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5",
    ),
    experiment: icon(
      "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M8 15h8",
    ),
    automatic: icon("M5 4h14v16H5zM8 7h8M8 11h8M9 15h6M17 2v2M7 2v2"),
    espresso: icon(
      "M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2",
    ),
    moka: icon("M8 3h8l2 6-2 12H8L6 9l2-6ZM6 9h12M9 13h6"),
    filter: icon("M5 4h14l-5 8v7l-4 2v-9L5 4ZM8 7h8"),
    black: icon("M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8"),
    both: icon("M4 7h7v11H4zM13 7h7v11h-7zM6 10h3M15 10h3"),
    low: icon("M4 15c4-6 12-6 16 0M7 17h10"),
    medium: icon("M4 15c4-8 12-8 16 0M7 18h10"),
    bright: icon(
      "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    ),
    info: icon("M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"),
    shop: icon("M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3"),
  };
  const products = [
    {
      id: "zmes-jolka",
      name: "Zmes Jolka",
      origin: "80 % Arabica · 20 % Robusta",
      price: "od 5,90 €",
      url: "https://www.praziarenjolka.sk/produkt/zmes-jolka/",
      image: "/assets/jolka/zmes-jolka.png",
      intents: ["classic", "milk"],
      prep: ["automatic", "espresso", "moka"],
      drink: ["black", "milk", "both"],
      acidity: ["low"],
      tones: ["čokoláda", "orechy", "karamel"],
      acidityText: "Veľmi nízka — v šálke pôsobí skôr sladko a plno než kyslo.",
      prepText: "automat · espresso · moka",
      reason:
        "Najistejšia domáca klasika s plným telom. Funguje samostatne aj v cappuccine a nevyžaduje chuť na ovocnú aciditu.",
      weights: [75, 150, 250, 500, 1000],
    },
    {
      id: "zmes-cokolada",
      name: "Zmes Čokoláda",
      origin: "70 % Arabica · 30 % Robusta",
      price: "od 5,90 €",
      url: "https://www.praziarenjolka.sk/produkt/zmes-cokolada/",
      image: "/assets/jolka/zmes-cokolada.png",
      intents: ["milk", "classic"],
      prep: ["automatic", "espresso", "moka"],
      drink: ["milk", "both", "black"],
      acidity: ["low"],
      tones: ["čokoláda", "orechy", "krémové telo"],
      acidityText:
        "Takmer žiadna — chuť stojí na čokoláde, orechoch a hutnejšom tele.",
      prepText: "automat · espresso · moka",
      reason:
        "Výraznejšia zmes do mlieka. Vyšší podiel robusty pomáha, aby káva zostala čitateľná aj v cappuccine alebo latte.",
      weights: [75, 150, 250, 500, 1000],
    },
    {
      id: "el-salvador",
      name: "El Salvador SHG EP",
      origin: "El Salvador · 100 % Arabica",
      price: "od 5,90 €",
      url: "https://www.praziarenjolka.sk/produkt/el-salvador-shg-ep/",
      image: "/assets/jolka/el-salvador.png",
      intents: ["balanced", "classic"],
      prep: ["espresso", "moka", "filter", "automatic"],
      drink: ["black", "both"],
      acidity: ["low", "medium"],
      tones: ["čokoláda", "marhuľa", "karamel"],
      acidityText:
        "Jemná a uhladená — pridáva sviežosť, ale nepôsobí ostro ani citrónovo.",
      prepText: "espresso · moka · filter",
      reason:
        "Pokojný prechod medzi tradičnou čokoládovou chuťou a ľahšou výberovou kávou. Dobrá voľba bez extrémov.",
      weights: [75, 150, 250, 500, 1000],
    },
    {
      id: "sidamo",
      name: "Ethiopia SIDAMO GR.2",
      origin: "Etiópia · svetlé praženie",
      price: "od 5,90 €",
      url: "https://www.praziarenjolka.sk/produkt/ethiopia-sidamo/",
      image: "/assets/jolka/sidamo.png",
      intents: ["fruity"],
      prep: ["filter"],
      drink: ["black"],
      acidity: ["medium", "bright"],
      tones: ["citrus", "jazmín", "bergamot"],
      acidityText:
        "Svieža a ovocná — podobná šťavnatosti citrusov, nie pokazenej alebo trpkej káve.",
      prepText: "filter · V60 · French press",
      reason:
        "Čistá aromatická voľba pre človeka, ktorý chce vo filtri cítiť pôvod, kvetinovosť a prirodzenú ovocnosť.",
      weights: [75, 150, 250],
    },
    {
      id: "vietnam",
      name: "Vietnam Lang Biang – Anaerobic Natural",
      origin: "Vietnam · anaeróbne spracovanie",
      price: "od 6,50 €",
      url: "https://www.praziarenjolka.sk/produkt/vietnam-lang-biang-anaerobic-natural/",
      image: "/assets/jolka/vietnam.png",
      intents: ["experiment"],
      prep: ["filter", "espresso"],
      drink: ["black"],
      acidity: ["medium", "bright"],
      tones: ["marakuja", "pomaranč", "vínna dochuť"],
      acidityText:
        "Výrazná a šťavnatá — je súčasťou experimentálneho ovocného profilu, nie chybou praženia.",
      prepText: "filter · V60 · espresso",
      reason:
        "Najodvážnejšia voľba v tejto zostave. Anaeróbne spracovanie dáva intenzívnejšiu arómu a netradičnú vínnu dochuť.",
      weights: [75, 150, 250],
    },
  ];
  const grinds = [
    ["beans", "Zrnková"],
    ["turkish", "Džezva / turecká"],
    ["espresso", "Espresso"],
    ["aeropress", "Aeropress"],
    ["moka", "Moka"],
    ["filter", "Filter"],
    ["french", "French press"],
  ];
  const questions = [
    {
      key: "intent",
      name: "Smer",
      title: "Aký zážitok od kávy čakáte?",
      note: "Toto je hlavné rozdelenie. Ďalšie odpovede už iba spresnia konkrétnu kávu.",
      options: [
        [
          "classic",
          "Bezpečná klasika",
          "Sladká, plná a bez ovocných prekvapení",
          "zmes-jolka",
        ],
        [
          "milk",
          "Výrazná do mlieka",
          "Aby sa nestratila v cappuccine alebo latte",
          "zmes-cokolada",
        ],
        [
          "balanced",
          "Jemná a vyvážená",
          "Čistá chuť bez prílišnej horkosti či ovocnosti",
          "el-salvador",
        ],
        [
          "fruity",
          "Ovocná výberovka",
          "Svieža, aromatická a najlepšia na filter",
          "sidamo",
        ],
        [
          "experiment",
          "Netradičný experiment",
          "Intenzívna aróma a nezvyčajná dochuť",
          "vietnam",
        ],
      ],
    },
    {
      key: "prep",
      name: "Príprava",
      title: "Ako ju pripravujete najčastejšie?",
      note: "Správna príprava je pri odporúčaní dôležitejšia než farba obalu alebo krajina pôvodu.",
      options: [
        [
          "automatic",
          "Automatický kávovar",
          "Jedným tlačidlom doma alebo v kancelárii",
          "automatic",
        ],
        [
          "espresso",
          "Pákový kávovar",
          "Espresso pripravujete ručne",
          "espresso",
        ],
        ["moka", "Moka kanvička", "Výrazná domáca príprava", "moka"],
        [
          "filter",
          "Filter alebo zalievanie",
          "V60, Chemex, Aeropress či French press",
          "filter",
        ],
      ],
    },
    {
      key: "drink",
      name: "Nápoj",
      title: "Ako kávu pijete?",
      note: "Mlieko zjemní aciditu, ale zároveň prekryje príliš jemnú kávu.",
      options: [
        [
          "black",
          "Najmä čiernu",
          "Espresso, lungo alebo filter bez mlieka",
          "black",
        ],
        [
          "milk",
          "Najmä s mliekom",
          "Cappuccino, flat white alebo latte",
          "milk",
        ],
        ["both", "Striedam oboje", "Potrebujem univerzálnejšiu kávu", "both"],
      ],
    },
    {
      key: "acidity",
      name: "Acidita",
      title: "Koľko sviežosti vám vyhovuje?",
      note: "Acidita neznamená pokazenú kyslú kávu. Pri výberovke môže pripomínať ovocnú šťavnatosť.",
      options: [
        ["low", "Čo najnižšia", "Čokoládová a pokojná chuť", "low"],
        ["medium", "Jemná a vyvážená", "Trochu sviežosti, nič ostré", "medium"],
        [
          "bright",
          "Ovocná a výrazná",
          "Svieža výberová káva je vítaná",
          "bright",
        ],
      ],
    },
  ];
  window.JOLKA_DATA = { mark, icons, products, grinds, questions };
})();
