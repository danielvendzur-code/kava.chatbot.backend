/* Verified merchant catalogues in the shared S5 layout. */
(() => {
  const demos = {
  "bylinkokraska": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "BylinkoKráska",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/bylinkokraska/logo.jpg",
      "header": "/assets/s5/bylinkokraska/logo.jpg",
      "avatar": "/assets/s5/bylinkokraska/avatar.svg"
    },
    "brand": {
      "name": "BylinkoKráska",
      "domain": "bylinkokraska.cz",
      "website": "https://www.bylinkokraska.cz/",
      "lang": "cs",
      "fullName": "BylinkoKráska",
      "url": "https://www.bylinkokraska.cz/",
      "logo": "/assets/s5/bylinkokraska/logo.jpg",
      "mark": "/assets/s5/bylinkokraska/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "quickChips": [
        "Citronová tráva",
        "Jablko a skořice",
        "Pivoňková vůně",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#6d613c",
        "accent": "#c3a24d",
        "soft": "#f6f3ee",
        "paper": "#fff",
        "ink": "#302d28",
        "line": "#e5ddd0"
      },
      "hero": "/assets/s5/bylinkokraska/citrus.webp"
    },
    "traitCopy": {
      "bright": [
        "Citrusová nebo květinová vůně",
        "",
        "Citrusová nebo květinová vůně",
        ""
      ],
      "citrus": [
        "Citronová tráva, limetka a zázvor",
        "",
        "Citronová tráva, limetka a zázvor",
        ""
      ],
      "peony": [
        "Růže Taif, pivoňka a pralinky",
        "",
        "Růže Taif, pivoňka a pralinky",
        ""
      ],
      "apple": [
        "Jablko, skořice a pomeranč",
        "",
        "Jablko, skořice a pomeranč",
        ""
      ],
      "mulled": [
        "Pomerančová kůra, skořice a hnědý cukr",
        "",
        "Pomerančová kůra, skořice a hnědý cukr",
        ""
      ],
      "gourmand": [
        "Oříšky nebo karamelový základ",
        "",
        "Oříšky nebo karamelový základ",
        ""
      ],
      "nuts": [
        "Lískový oříšek, káva a vanilka",
        "",
        "Lískový oříšek, káva a vanilka",
        ""
      ],
      "pumpkin": [
        "Muškátový oříšek, zázvor a karamel",
        "",
        "Muškátový oříšek, zázvor a karamel",
        ""
      ],
      "spiced-fruit": [
        "Jablko a hřejivé koření",
        "",
        "Jablko a hřejivé koření",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "bright": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "citrus": [
        "/assets/s3/scenes-k2/lemongrass.jpg"
      ],
      "peony": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "apple": [
        "/assets/s3/scenes-k2/cinnamon.jpg"
      ],
      "mulled": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ],
      "gourmand": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "nuts": [
        "/assets/s3/scenes-k2/almonds.jpg"
      ],
      "pumpkin": [
        "/assets/s3/scenes-k2/cloves.jpg"
      ],
      "spiced-fruit": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ]
    },
    "compareProductIds": [
      "citrus",
      "peony"
    ],
    "segmentText": {
      "entryNote": "Vonné svíčky · přesné balení · porovnání",
      "titleSuffix": "výběr vůně svíčky",
      "tab": "Výběr vůně",
      "advisorName": "Průvodce vůněmi svíček",
      "entrySmall": "VŮNĚ SVÍČEK",
      "entryTitle": "Najděte vůni své svíčky",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi vybrat vůni svíčky podle jeho vkusu.",
      "lead": "Podle odpovědí zobrazí konkrétní svíčku s fotografií, vonným profilem, balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Vonné tóny, balení a ceny vybraných svíček.",
      "includedAdvisor": "Výběr vůně svíčky a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "teaserTitle": "Najděte vůni své svíčky",
      "teaserNote": "Svíčky, balení a ceny",
      "teaserAria": "Otevřít výběr vůně svíčky",
      "source": "bylinkokraska-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "citrus": "peony",
        "peony": "citrus",
        "apple": "mulled",
        "mulled": "apple",
        "nuts": "pumpkin",
        "pumpkin": "nuts"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "citronov|limetk",
        "includeNotes": true,
        "ids": [
          "citrus"
        ]
      },
      {
        "match": "jablk|skoric",
        "includeNotes": true,
        "ids": [
          "apple"
        ]
      },
      {
        "match": "pivon|pralink",
        "includeNotes": true,
        "ids": [
          "peony"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "citrus",
          "peony"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "candle"
  },
  "candella": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "Candella",
    "country": "SK",
    "logos": {
      "landing": "/assets/s5/candella/logo.jpg",
      "header": "/assets/s5/candella/logo.jpg",
      "avatar": "/assets/s5/candella/avatar.svg"
    },
    "brand": {
      "name": "Candella",
      "domain": "candella.sk",
      "website": "https://www.candella.sk/",
      "lang": "sk",
      "fullName": "Candella",
      "url": "https://www.candella.sk/",
      "logo": "/assets/s5/candella/logo.jpg",
      "mark": "/assets/s5/candella/avatar.svg",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône sviečok, ich balenia a ceny.",
      "quickChips": [
        "Pomaranč a pomelo",
        "Eukalyptus a rozmarín",
        "Škorica a kardamóm",
        "Porovnať dve vône"
      ],
      "theme": {
        "brand": "#614c3c",
        "accent": "#d6b57b",
        "soft": "#f8f3ed",
        "paper": "#fff",
        "ink": "#332b26",
        "line": "#e7dbcf"
      },
      "hero": "/assets/s5/candella/orange.jpg"
    },
    "traitCopy": {
      "fruit": [
        "Ovocné a citrusové vône",
        "",
        "Ovocné a citrusové vône",
        ""
      ],
      "orange": [
        "Pomaranč, pomelo a hrejivé korenie",
        "",
        "Pomaranč, pomelo a hrejivé korenie",
        ""
      ],
      "peach": [
        "Svieža ovocná vôňa s broskyňou",
        "",
        "Svieža ovocná vôňa s broskyňou",
        ""
      ],
      "gin": [
        "Limeta, gin a jalovec",
        "",
        "Limeta, gin a jalovec",
        ""
      ],
      "warm": [
        "Bylinky, korenie alebo vanilka",
        "",
        "Bylinky, korenie alebo vanilka",
        ""
      ],
      "herbs": [
        "Eukalyptus, rozmarín a živicové tóny",
        "",
        "Eukalyptus, rozmarín a živicové tóny",
        ""
      ],
      "spice": [
        "Škorica, klinček a kardamóm",
        "",
        "Škorica, klinček a kardamóm",
        ""
      ],
      "vanilla": [
        "Krémová vanilka, santal a pižmo",
        "",
        "Krémová vanilka, santal a pižmo",
        ""
      ],
      "citrus-twist": [
        "Svieže citrusy",
        "",
        "Svieže citrusy",
        ""
      ],
      "orchard": [
        "Šťavnaté sadové ovocie",
        "",
        "Šťavnaté sadové ovocie",
        ""
      ],
      "herbal": [
        "Bylinková vôňa",
        "",
        "Bylinková vôňa",
        ""
      ],
      "sweet-spice": [
        "Sladké korenie alebo vanilka",
        "",
        "Sladké korenie alebo vanilka",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Aká vôňa je vám blízka?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Ktorá kombinácia vás láka?",
        "",
        "Vonné tóny"
      ],
      "fragranceFacet": [
        "Ktorý charakter vône vám viac sedí?",
        "",
        "Charakter vône"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "fruit": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ],
      "orange": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ],
      "peach": [
        "/assets/s3/scenes-k2/apricots.jpg"
      ],
      "gin": [
        "/assets/s3/scenes-k2/juniper.jpg"
      ],
      "warm": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "herbs": [
        "/assets/s3/scenes-k2/rosemary.jpg"
      ],
      "spice": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ],
      "vanilla": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "citrus-twist": [
        "/assets/s3/scenes-k2/citrus.jpg"
      ],
      "orchard": [
        "/assets/s3/scenes-k2/apricots.jpg"
      ],
      "herbal": [
        "/assets/s3/scenes-k2/rosemary.jpg"
      ],
      "sweet-spice": [
        "/assets/s3/scenes-k2/cinnamon.jpg"
      ]
    },
    "compareProductIds": [
      "orange",
      "vanilla"
    ],
    "segmentText": {
      "entryNote": "Vonné sviečky · konkrétne balenie · porovnanie",
      "titleSuffix": "výber vône sviečky",
      "tab": "Výber vône",
      "advisorName": "Poradca vôní sviečok",
      "entrySmall": "VÔNE SVIEČOK",
      "entryTitle": "Nájdite vôňu svojej sviečky",
      "placeholder": "Opýtajte sa na charakter vône, balenie alebo cenu…",
      "heading": "Pomôžte zákazníkovi vybrať vôňu sviečky podľa jeho vkusu.",
      "lead": "Výber ukáže konkrétnu sviečku s fotografiou, charakterom vône, balením, cenou a odkazom. Dve odlišné vône možno porovnať.",
      "includedChat": "Charakter vôní sviečok, balenia a ceny.",
      "includedAdvisor": "Výber vône sviečky a porovnanie dvoch kompozícií.",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône sviečok, ich balenia a ceny.",
      "teaserTitle": "Nájdite vôňu svojej sviečky",
      "teaserNote": "Sviečky, balenia a ceny",
      "teaserAria": "Otvoriť výber vône sviečky",
      "source": "candella-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "orange": "peach",
        "peach": "gin",
        "gin": "orange",
        "herbs": "spice",
        "spice": "vanilla",
        "vanilla": "herbs"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "pomaranc|pomelo",
        "includeNotes": true,
        "ids": [
          "orange"
        ]
      },
      {
        "match": "eukalypt|rozmarin",
        "includeNotes": true,
        "ids": [
          "herbs"
        ]
      },
      {
        "match": "skoric|kardamom",
        "includeNotes": true,
        "ids": [
          "spice"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "orange",
          "vanilla"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "candle"
  },
  "esodrogeria": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "EsoDrogéria",
    "country": "SK",
    "logos": {
      "landing": "/assets/s5/esodrogeria/logo.png",
      "header": "/assets/s5/esodrogeria/logo.png",
      "avatar": "/assets/s5/esodrogeria/avatar.svg"
    },
    "brand": {
      "name": "EsoDrogéria",
      "domain": "esodrogeria.eu",
      "website": "https://www.esodrogeria.eu/",
      "lang": "sk",
      "fullName": "EsoDrogéria",
      "url": "https://www.esodrogeria.eu/",
      "logo": "/assets/s5/esodrogeria/logo.png",
      "mark": "/assets/s5/esodrogeria/avatar.svg",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané interiérové vône, ich použitie, balenia a ceny.",
      "quickChips": [
        "Drevo a citrusy",
        "Frézia a hruška",
        "Olej s pačuli",
        "Porovnať dve vône"
      ],
      "theme": {
        "brand": "#125061",
        "accent": "#d9bb78",
        "soft": "#eef7f9",
        "paper": "#fff",
        "ink": "#213940",
        "line": "#d6e6e9"
      },
      "hero": "/assets/s5/esodrogeria/wood.jpg"
    },
    "traitCopy": {
      "reeds": [
        "Hotová vôňa s tyčinkami",
        "",
        "Hotová vôňa s tyčinkami",
        ""
      ],
      "wood": [
        "Drevo, jantár a citrusy",
        "",
        "Drevo, jantár a citrusy",
        ""
      ],
      "pear": [
        "Frézia a hruška",
        "",
        "Frézia a hruška",
        ""
      ],
      "apple": [
        "Jablko, frézia a škorica",
        "",
        "Jablko, frézia a škorica",
        ""
      ],
      "oil": [
        "Vonný olej do aromalampy",
        "",
        "Vonný olej do aromalampy",
        ""
      ],
      "patchouli": [
        "Pačuli do aromalampy",
        "",
        "Pačuli do aromalampy",
        ""
      ],
      "yogurt": [
        "Hruškový jogurt do aromalampy",
        "",
        "Hruškový jogurt do aromalampy",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Akú formu vône chcete?",
        "",
        "Vône do interiéru"
      ],
      "fragranceProfile": [
        "Ktorá kombinácia vás láka?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "reeds": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ],
      "wood": [
        "/assets/s3/scenes-k2/oak.jpg"
      ],
      "pear": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "apple": [
        "/assets/s3/scenes-k2/geranium.jpg"
      ],
      "oil": [
        "/assets/s3/scenes-k2/incense.jpg"
      ],
      "patchouli": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ],
      "yogurt": [
        "/assets/s3/scenes-k2/yogurt.jpg"
      ]
    },
    "compareProductIds": [
      "wood",
      "pear"
    ],
    "segmentText": {
      "entryNote": "Vône do interiéru · konkrétne balenie · porovnanie",
      "titleSuffix": "výber vône do interiéru",
      "tab": "Výber vône",
      "advisorName": "Poradca vôní do interiéru",
      "entrySmall": "VÔNE DO INTERIÉRU",
      "entryTitle": "Vyberte si vôňu do interiéru",
      "placeholder": "Opýtajte sa na charakter vône, balenie alebo cenu…",
      "heading": "Pomôžte zákazníkovi vybrať vôňu do interiéru.",
      "lead": "Výber rozlišuje hotovú vôňu s tyčinkami a olej do aromalampy. Ukáže konkrétnu fotografiu, charakter vône, presné balenie, cenu a odkaz.",
      "includedChat": "Typy interiérových vôní, balenia a ceny.",
      "includedAdvisor": "Výber formy interiérovej vône a porovnanie kompozícií.",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané interiérové vône, ich použitie, balenia a ceny.",
      "teaserTitle": "Vyberte si vôňu do interiéru",
      "teaserNote": "Tyčinkové vône a oleje do aromalampy",
      "teaserAria": "Otvoriť výber vône do interiéru",
      "source": "esodrogeria-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "wood": "pear",
        "pear": "apple",
        "apple": "wood",
        "patchouli": "yogurt",
        "yogurt": "patchouli"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "drevo|citrus",
        "includeNotes": true,
        "ids": [
          "wood"
        ]
      },
      {
        "match": "frezi|hrusk",
        "includeNotes": true,
        "ids": [
          "pear"
        ]
      },
      {
        "match": "olej|pacul",
        "includeNotes": true,
        "ids": [
          "patchouli"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "wood",
          "pear"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "room",
    "textQuestions": [
      "fragranceDirection"
    ]
  },
  "vunebis": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "Vůně BIS",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/vunebis/logo.svg",
      "header": "/assets/s5/vunebis/logo.svg",
      "avatar": "/assets/s5/vunebis/avatar.svg"
    },
    "brand": {
      "name": "Vůně BIS",
      "domain": "vunebis.cz",
      "website": "https://www.vunebis.cz/",
      "lang": "cs",
      "fullName": "Vůně BIS",
      "url": "https://www.vunebis.cz/",
      "logo": "/assets/s5/vunebis/logo.svg",
      "mark": "/assets/s5/vunebis/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně na prádlo, jejich balení a ceny.",
      "quickChips": [
        "Pižmo a vanilka",
        "Lilie a pačuli",
        "Kosatec a pižmo",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#244c43",
        "accent": "#d5b66f",
        "soft": "#f1f7f4",
        "paper": "#fff",
        "ink": "#23392f",
        "line": "#d9e6df"
      },
      "hero": "/assets/s5/vunebis/musk.png"
    },
    "traitCopy": {
      "soft": [
        "Květiny a pižmový základ",
        "",
        "Květiny a pižmový základ",
        ""
      ],
      "musk": [
        "Bílý květ, pižmo a vanilka",
        "",
        "Bílý květ, pižmo a vanilka",
        ""
      ],
      "flowers": [
        "Bílé květiny, frézie a růže",
        "",
        "Bílé květiny, frézie a růže",
        ""
      ],
      "iris": [
        "Kosatec, vanilka a pižmo",
        "",
        "Kosatec, vanilka a pižmo",
        ""
      ],
      "wood": [
        "Zelená vůně, jantar a santal",
        "",
        "Zelená vůně, jantar a santal",
        ""
      ],
      "lily": [
        "Bílá lilie, pačuli a cedr",
        "",
        "Bílá lilie, pačuli a cedr",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "soft": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "musk": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "flowers": [
        "/assets/s3/scenes-k2/lavender-bunch.jpg"
      ],
      "iris": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "wood": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ],
      "lily": [
        "/assets/s3/scenes-k2/jasmine.jpg"
      ]
    },
    "compareProductIds": [
      "musk",
      "lily"
    ],
    "segmentText": {
      "entryNote": "Vůně na prádlo · konkrétní balení · porovnání",
      "titleSuffix": "výběr vůně na prádlo",
      "tab": "Výběr vůně",
      "advisorName": "Poradce pro vůně na prádlo",
      "entrySmall": "VŮNĚ NA PRÁDLO",
      "entryTitle": "Vyberte si vůni na prádlo",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi vybrat vůni na prádlo podle jeho vkusu.",
      "lead": "Výběr ukáže konkrétní parfém na prádlo s fotografií, charakterem vůně, přesným balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Vonné profily, balení a ceny parfémů na prádlo.",
      "includedAdvisor": "Výběr vůně na prádlo a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně na prádlo, jejich balení a ceny.",
      "teaserTitle": "Vyberte si vůni na prádlo",
      "teaserNote": "Konkrétní balení a cena",
      "teaserAria": "Otevřít výběr vůně na prádlo",
      "source": "vunebis-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "musk": "flowers",
        "flowers": "iris",
        "iris": "musk",
        "lily": "wood",
        "wood": "lily"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "pizmo|vanilk",
        "includeNotes": true,
        "ids": [
          "musk"
        ]
      },
      {
        "match": "lili|pacul",
        "includeNotes": true,
        "ids": [
          "lily"
        ]
      },
      {
        "match": "kosat",
        "includeNotes": true,
        "ids": [
          "iris"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "musk",
          "lily"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "laundry"
  },
  "kvapkavoni": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "Kvapka vôní",
    "country": "SK",
    "logos": {
      "landing": "/assets/s5/kvapkavoni/logo.png",
      "header": "/assets/s5/kvapkavoni/logo.png",
      "avatar": "/assets/s5/kvapkavoni/avatar.svg"
    },
    "brand": {
      "name": "Kvapka vôní",
      "domain": "kvapkavoni.eu",
      "website": "https://www.kvapkavoni.eu/",
      "lang": "sk",
      "fullName": "Kvapka vôní",
      "url": "https://www.kvapkavoni.eu/",
      "logo": "/assets/s5/kvapkavoni/logo.png",
      "mark": "/assets/s5/kvapkavoni/avatar.svg",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône na pranie, ich balenia a ceny.",
      "quickChips": [
        "Citrusy a ihličie",
        "Pižmo a biele kvety",
        "Morské tóny",
        "Porovnať dve vône"
      ],
      "theme": {
        "brand": "#28536a",
        "accent": "#dfbc73",
        "soft": "#edf5f7",
        "paper": "#fff",
        "ink": "#203641",
        "line": "#d7e3e8"
      },
      "hero": "/assets/s5/kvapkavoni/1.png"
    },
    "traitCopy": {
      "fresh": [
        "Sviežosť a drevitý základ",
        "",
        "Sviežosť a drevitý základ",
        ""
      ],
      "1": [
        "Citrusy, ihličie a drevitý základ",
        "",
        "Citrusy, ihličie a drevitý základ",
        ""
      ],
      "6": [
        "Morské tóny, bergamot a santal",
        "",
        "Morské tóny, bergamot a santal",
        ""
      ],
      "flower": [
        "Kvety alebo pižmo",
        "",
        "Kvety alebo pižmo",
        ""
      ],
      "2": [
        "Biele pižmo, mach a biele kvety",
        "",
        "Biele pižmo, mach a biele kvety",
        ""
      ],
      "4": [
        "Exotické kvety, grapefruit a ananás",
        "",
        "Exotické kvety, grapefruit a ananás",
        ""
      ],
      "5": [
        "Citrusy a pomarančové kvety",
        "",
        "Citrusy a pomarančové kvety",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Aká vôňa je vám blízka?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Ktorá kombinácia vás láka?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "fresh": [
        "/assets/s3/scenes-k2/ocean-wave.jpg"
      ],
      "1": [
        "/assets/s3/scenes-k2/pine.jpg"
      ],
      "6": [
        "/assets/s3/scenes-k2/ocean-wave.jpg"
      ],
      "flower": [
        "/assets/s3/scenes-k2/jasmine.jpg"
      ],
      "2": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "4": [
        "/assets/s3/scenes-k2/grapefruit.jpg"
      ],
      "5": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ]
    },
    "compareProductIds": [
      "1",
      "4"
    ],
    "segmentText": {
      "entryNote": "Vône na pranie · konkrétne balenie · porovnanie",
      "titleSuffix": "výber vône na pranie",
      "tab": "Výber vône",
      "advisorName": "Poradca vôní na pranie",
      "entrySmall": "VÔNE NA PRANIE",
      "entryTitle": "Vyberte si vôňu na pranie",
      "placeholder": "Opýtajte sa na charakter vône, balenie alebo cenu…",
      "heading": "Pomôžte zákazníkovi vybrať vôňu na pranie podľa jeho vkusu.",
      "lead": "Výber ukáže konkrétny parfum na pranie s fotografiou, profilom vône, balením, cenou a odkazom. Dve odlišné vône možno porovnať.",
      "includedChat": "Vonné profily, balenia a ceny parfumov na pranie.",
      "includedAdvisor": "Výber vône na pranie a porovnanie dvoch kompozícií.",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône na pranie, ich balenia a ceny.",
      "teaserTitle": "Vyberte si vôňu na pranie",
      "teaserNote": "Konkrétne balenie a cena",
      "teaserAria": "Otvoriť výber vône na pranie",
      "source": "kvapkavoni-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "1": "6",
        "6": "1",
        "2": "4",
        "4": "5",
        "5": "2"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "citrus|ihlic",
        "includeNotes": true,
        "ids": [
          "1"
        ]
      },
      {
        "match": "pizmo|mach",
        "includeNotes": true,
        "ids": [
          "2"
        ]
      },
      {
        "match": "morsk|bergamot",
        "includeNotes": true,
        "ids": [
          "6"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "1",
          "4"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "laundry"
  },
  "totap": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "toTap",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/totap/logo.svg",
      "header": "/assets/s5/totap/logo.svg",
      "avatar": "/assets/s5/totap/avatar.svg"
    },
    "brand": {
      "name": "toTap",
      "domain": "totap.cz",
      "website": "https://www.totap.cz/",
      "lang": "cs",
      "fullName": "toTap",
      "url": "https://www.totap.cz/",
      "logo": "/assets/s5/totap/logo.svg",
      "mark": "/assets/s5/totap/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně, jejich tóny, balení a ceny.",
      "quickChips": [
        "Pižmo a jablko",
        "Růže a oud",
        "Káva a vanilka",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#6a520c",
        "accent": "#e8c237",
        "soft": "#fff9dd",
        "paper": "#fff",
        "ink": "#312c1d",
        "line": "#e8dfbd"
      },
      "hero": "/assets/s5/totap/1.png"
    },
    "traitCopy": {
      "flowers": [
        "Pižmo nebo růže",
        "",
        "Pižmo nebo růže",
        ""
      ],
      "1": [
        "Hruška, jablko a pižmo",
        "",
        "Hruška, jablko a pižmo",
        ""
      ],
      "2": [
        "Růže, oud a vanilka",
        "",
        "Růže, oud a vanilka",
        ""
      ],
      "unusual": [
        "Káva nebo zemitý charakter",
        "",
        "Káva nebo zemitý charakter",
        ""
      ],
      "4": [
        "Růže, káva a vanilka",
        "",
        "Růže, káva a vanilka",
        ""
      ],
      "3": [
        "Řepa, růže a vetiver",
        "",
        "Řepa, růže a vetiver",
        ""
      ],
      "resin": [
        "Pryskyřice, dřevo a koření",
        "",
        "Pryskyřice, dřevo a koření",
        ""
      ],
      "5": [
        "Pryskyřice, kadidlo a ambra",
        "",
        "Pryskyřice, kadidlo a ambra",
        ""
      ],
      "6": [
        "Koření, květiny a santalové dřevo",
        "",
        "Koření, květiny a santalové dřevo",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "flowers": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "1": [
        "/assets/s3/scenes-k2/lemon-tree.jpg"
      ],
      "2": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "unusual": [
        "/assets/s3/scenes-k2/coffee-beans.jpg"
      ],
      "4": [
        "/assets/s3/scenes-k2/coffee-beans.jpg"
      ],
      "3": [
        "/assets/s3/scenes-k2/geranium.jpg"
      ],
      "resin": [
        "/assets/s3/scenes-k2/incense.jpg"
      ],
      "5": [
        "/assets/s3/scenes-k2/incense.jpg"
      ],
      "6": [
        "/assets/s3/scenes-k2/cinnamon.jpg"
      ]
    },
    "compareProductIds": [
      "1",
      "4"
    ],
    "segmentText": {
      "entryNote": "Vonné tóny · konkrétní vůně · porovnání",
      "titleSuffix": "výběr vůně",
      "tab": "Výběr vůně",
      "advisorName": "Průvodce výběrem vůně",
      "entrySmall": "VÝBĚR VŮNĚ",
      "entryTitle": "Objevte vůni podle svého vkusu",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi objevit vůni podle jeho vkusu.",
      "lead": "Výběr ukáže konkrétní vůni s fotografií, profilem tónů, přesným balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Vonné tóny, balení, ceny a porovnání vybraných vůní.",
      "includedAdvisor": "Výběr vůně, její profil a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně, jejich tóny, balení a ceny.",
      "teaserTitle": "Objevte vůni podle svého vkusu",
      "teaserNote": "Konkrétní vůně, balení a cena",
      "teaserAria": "Otevřít výběr vůně",
      "source": "totap-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "1": "2",
        "2": "1",
        "4": "3",
        "3": "4",
        "5": "6",
        "6": "5"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "pizmo|jablk",
        "includeNotes": true,
        "ids": [
          "1"
        ]
      },
      {
        "match": "ruze|oud",
        "includeNotes": true,
        "ids": [
          "2"
        ]
      },
      {
        "match": "kav|vanilk",
        "includeNotes": true,
        "ids": [
          "4"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "1",
          "4"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "personal"
  },
  "ketts": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "KETT’S CANDLES",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/ketts/logo.jpg",
      "header": "/assets/s5/ketts/logo.jpg",
      "avatar": "/assets/s5/ketts/avatar.svg"
    },
    "brand": {
      "name": "KETT’S CANDLES",
      "domain": "kettscandles.com",
      "website": "https://www.kettscandles.com/",
      "lang": "cs",
      "fullName": "KETT’S CANDLES",
      "url": "https://www.kettscandles.com/",
      "logo": "/assets/s5/ketts/logo.jpg",
      "mark": "/assets/s5/ketts/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "quickChips": [
        "Mandarinka a limetka",
        "Švestka a skořice",
        "Santalová vůně",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#383633",
        "accent": "#c3a067",
        "soft": "#f5f1eb",
        "paper": "#fff",
        "ink": "#332d27",
        "line": "#e4dbcf"
      },
      "hero": "/assets/s5/ketts/ginger.jpg"
    },
    "traitCopy": {
      "fresh": [
        "Citrusy a zelené bylinky",
        "",
        "Citrusy a zelené bylinky",
        ""
      ],
      "citrus": [
        "Mandarinka a limetka",
        "",
        "Mandarinka a limetka",
        ""
      ],
      "herbs": [
        "Citrónová bazalka, šalvěj a rajčatové listy",
        "",
        "Citrónová bazalka, šalvěj a rajčatové listy",
        ""
      ],
      "warm": [
        "Ovoce nebo hřejivé koření",
        "",
        "Ovoce nebo hřejivé koření",
        ""
      ],
      "plum": [
        "Švestkový koláč, skořice a hřebíček",
        "",
        "Švestkový koláč, skořice a hřebíček",
        ""
      ],
      "ginger": [
        "Zázvor, patchouli a pomerančová kůra",
        "",
        "Zázvor, patchouli a pomerančová kůra",
        ""
      ],
      "depth": [
        "Růže nebo santalové dřevo",
        "",
        "Růže nebo santalové dřevo",
        ""
      ],
      "rose": [
        "Orientální vůně damašské růže",
        "",
        "Orientální vůně damašské růže",
        ""
      ],
      "sandal": [
        "Výrazná orientální vůně santalu",
        "",
        "Výrazná orientální vůně santalu",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "fresh": [
        "/assets/s3/scenes-k2/citrus.jpg"
      ],
      "citrus": [
        "/assets/s3/scenes-k2/mandarin.jpg"
      ],
      "herbs": [
        "/assets/s3/scenes-k2/tomatoes.jpg"
      ],
      "warm": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ],
      "plum": [
        "/assets/s3/scenes-k2/plums.jpg"
      ],
      "ginger": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ],
      "depth": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ],
      "rose": [
        "/assets/s3/scenes-k2/rose.jpg"
      ],
      "sandal": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ]
    },
    "compareProductIds": [
      "citrus",
      "sandal"
    ],
    "segmentText": {
      "entryNote": "Vonné svíčky · konkrétní balení · porovnání",
      "titleSuffix": "výběr vůně svíčky",
      "tab": "Výběr vůně",
      "advisorName": "Průvodce vůněmi svíček",
      "entrySmall": "VŮNĚ SVÍČEK",
      "entryTitle": "Najděte vůni své svíčky",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi vybrat vůni svíčky podle jeho vkusu.",
      "lead": "Výběr ukáže konkrétní svíčku s fotografií, charakterem vůně, přesným balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Charakter vůní svíček, balení a ceny.",
      "includedAdvisor": "Výběr vůně svíčky a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "teaserTitle": "Najděte vůni své svíčky",
      "teaserNote": "Svíčky, balení a ceny",
      "teaserAria": "Otevřít výběr vůně svíčky",
      "source": "ketts-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "citrus": "herbs",
        "herbs": "citrus",
        "plum": "ginger",
        "ginger": "plum",
        "rose": "sandal",
        "sandal": "rose"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "mandarink|limetk",
        "includeNotes": true,
        "ids": [
          "citrus"
        ]
      },
      {
        "match": "svestk|skoric",
        "includeNotes": true,
        "ids": [
          "plum"
        ]
      },
      {
        "match": "santal",
        "includeNotes": true,
        "ids": [
          "sandal"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "citrus",
          "sandal"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "candle"
  },
  "rozvoneno": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "Rozvoněno",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/rozvoneno/logo.png",
      "header": "/assets/s5/rozvoneno/logo.png",
      "avatar": "/assets/s5/rozvoneno/avatar.svg"
    },
    "brand": {
      "name": "Rozvoněno",
      "domain": "rozvoneno.cz",
      "website": "https://www.rozvoneno.cz/",
      "lang": "cs",
      "fullName": "Rozvoněno",
      "url": "https://www.rozvoneno.cz/",
      "logo": "/assets/s5/rozvoneno/logo.png",
      "mark": "/assets/s5/rozvoneno/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "quickChips": [
        "Eukalyptus a citron",
        "Zázvor a cedr",
        "Kadidlo a myrha",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#67543b",
        "accent": "#d7ad69",
        "soft": "#f5f1eb",
        "paper": "#fff",
        "ink": "#332d27",
        "line": "#e4dbcf"
      },
      "hero": "/assets/s5/rozvoneno/winter.jpg"
    },
    "traitCopy": {
      "citrusy": [
        "Citrusy a svěžest",
        "",
        "Citrusy a svěžest",
        ""
      ],
      "fresh": [
        "Eukalyptus a citron",
        "",
        "Eukalyptus a citron",
        ""
      ],
      "citrus": [
        "Grep, limetka a bergamot",
        "",
        "Grep, limetka a bergamot",
        ""
      ],
      "warm": [
        "Hřejivé kořeněné tóny",
        "",
        "Hřejivé kořeněné tóny",
        ""
      ],
      "winter": [
        "Pomeranč, hřebíček a skořice",
        "",
        "Pomeranč, hřebíček a skořice",
        ""
      ],
      "ginger": [
        "Zázvor, citron a cedr",
        "",
        "Zázvor, citron a cedr",
        ""
      ],
      "depth": [
        "Květiny nebo pryskyřice",
        "",
        "Květiny nebo pryskyřice",
        ""
      ],
      "flower": [
        "Geránie, pomeranč a pačuli",
        "",
        "Geránie, pomeranč a pačuli",
        ""
      ],
      "resin": [
        "Kadidlo a myrha",
        "",
        "Kadidlo a myrha",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "citrusy": [
        "/assets/s3/scenes-k2/citrus.jpg"
      ],
      "fresh": [
        "/assets/s3/scenes-k2/eucalyptus.jpg"
      ],
      "citrus": [
        "/assets/s3/scenes-k2/grapefruit.jpg"
      ],
      "warm": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ],
      "winter": [
        "/assets/s3/scenes-k2/cloves.jpg"
      ],
      "ginger": [
        "/assets/s3/scenes-k2/lemon-tree.jpg"
      ],
      "depth": [
        "/assets/s3/scenes-k2/incense.jpg"
      ],
      "flower": [
        "/assets/s3/scenes-k2/geranium.jpg"
      ],
      "resin": [
        "/assets/s3/scenes-k2/incense.jpg"
      ]
    },
    "compareProductIds": [
      "fresh",
      "resin"
    ],
    "segmentText": {
      "entryNote": "Vonné svíčky · konkrétní balení · porovnání",
      "titleSuffix": "výběr vůně svíčky",
      "tab": "Výběr vůně",
      "advisorName": "Průvodce vůněmi svíček",
      "entrySmall": "VŮNĚ SVÍČEK",
      "entryTitle": "Najděte vůni své svíčky",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi vybrat vůni svíčky podle jeho vkusu.",
      "lead": "Výběr ukáže konkrétní svíčku s fotografií, charakterem vůně, přesným balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Charakter vůní svíček, balení a ceny.",
      "includedAdvisor": "Výběr vůně svíčky a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "teaserTitle": "Najděte vůni své svíčky",
      "teaserNote": "Svíčky, balení a ceny",
      "teaserAria": "Otevřít výběr vůně svíčky",
      "source": "rozvoneno-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "fresh": "citrus",
        "citrus": "fresh",
        "winter": "ginger",
        "ginger": "winter",
        "flower": "resin",
        "resin": "flower"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "eukalypt|citron",
        "includeNotes": true,
        "ids": [
          "fresh"
        ]
      },
      {
        "match": "zazvor|cedr",
        "includeNotes": true,
        "ids": [
          "ginger"
        ]
      },
      {
        "match": "kadidl|myrh",
        "includeNotes": true,
        "ids": [
          "resin"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "fresh",
          "resin"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "candle"
  },
  "aromis": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "AROMIS",
    "country": "CZ",
    "logos": {
      "landing": "/assets/s5/aromis/logo.jpg",
      "header": "/assets/s5/aromis/logo.jpg",
      "avatar": "/assets/s5/aromis/avatar.svg"
    },
    "brand": {
      "name": "AROMIS",
      "domain": "aromis.eu",
      "website": "https://www.aromis.eu/",
      "lang": "cs",
      "fullName": "AROMIS",
      "url": "https://www.aromis.eu/",
      "logo": "/assets/s5/aromis/logo.jpg",
      "mark": "/assets/s5/aromis/avatar.svg",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "quickChips": [
        "Káva a karamel",
        "Čisté prádlo a pižmo",
        "Levandulová vůně",
        "Porovnat dvě vůně"
      ],
      "theme": {
        "brand": "#3c4b3d",
        "accent": "#ceb076",
        "soft": "#f0f3ec",
        "paper": "#fff",
        "ink": "#29332a",
        "line": "#dce3d6"
      },
      "hero": "/assets/s5/aromis/bella.jpg"
    },
    "traitCopy": {
      "sweet": [
        "Vanilka nebo pražená káva",
        "",
        "Vanilka nebo pražená káva",
        ""
      ],
      "bella": [
        "Květiny, vanilka a dřevitý nádech",
        "",
        "Květiny, vanilka a dřevitý nádech",
        ""
      ],
      "coffee": [
        "Pražená káva, karamel a vanilka",
        "",
        "Pražená káva, karamel a vanilka",
        ""
      ],
      "fresh": [
        "Čisté prádlo nebo levandule",
        "",
        "Čisté prádlo nebo levandule",
        ""
      ],
      "linen": [
        "Čisté prádlo, květiny a pižmo",
        "",
        "Čisté prádlo, květiny a pižmo",
        ""
      ],
      "lavender": [
        "Levandule se zelenými podtóny",
        "",
        "Levandule se zelenými podtóny",
        ""
      ],
      "warm": [
        "Kořenité a hřejivé vůně",
        "",
        "Kořenité a hřejivé vůně",
        ""
      ],
      "desert": [
        "Kořenité tóny, ambra a dřevo",
        "",
        "Kořenité tóny, ambra a dřevo",
        ""
      ],
      "winter": [
        "Pomerančová kůra a vánoční koření",
        "",
        "Pomerančová kůra a vánoční koření",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Jaká vůně je vám blízká?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Která kombinace vás láká?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "sweet": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "bella": [
        "/assets/s3/scenes-k2/vanilla.jpg"
      ],
      "coffee": [
        "/assets/s3/scenes-k2/coffee-beans.jpg"
      ],
      "fresh": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "linen": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "lavender": [
        "/assets/s3/scenes-k2/lavender-bunch.jpg"
      ],
      "warm": [
        "/assets/s3/scenes-k2/xmas-spices.jpg"
      ],
      "desert": [
        "/assets/s3/scenes-k2/sandalwood.jpg"
      ],
      "winter": [
        "/assets/s3/scenes-k2/cloves.jpg"
      ]
    },
    "compareProductIds": [
      "coffee",
      "lavender"
    ],
    "segmentText": {
      "entryNote": "Vonné svíčky · konkrétní balení · porovnání",
      "titleSuffix": "výběr vůně svíčky",
      "tab": "Výběr vůně",
      "advisorName": "Průvodce vůněmi svíček",
      "entrySmall": "VŮNĚ SVÍČEK",
      "entryTitle": "Najděte vůni své svíčky",
      "placeholder": "Zeptejte se na charakter vůně, balení nebo cenu…",
      "heading": "Pomozte zákazníkovi vybrat vůni svíčky podle jeho vkusu.",
      "lead": "Výběr ukáže konkrétní svíčku s fotografií, charakterem vůně, přesným balením, cenou a odkazem. Dvě odlišné vůně lze porovnat.",
      "includedChat": "Charakter vůní svíček, konkrétní balení a ceny.",
      "includedAdvisor": "Výběr vůně svíčky a porovnání dvou kompozic.",
      "greeting": "Dobrý den. Pomohu vám porovnat vybrané vůně svíček, jejich balení a ceny.",
      "teaserTitle": "Najděte vůni své svíčky",
      "teaserNote": "Svíčky, balení a ceny",
      "teaserAria": "Otevřít výběr vůně svíčky",
      "source": "aromis-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "bella": "coffee",
        "coffee": "bella",
        "linen": "lavender",
        "lavender": "linen",
        "desert": "winter",
        "winter": "desert"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "kav|karamel",
        "includeNotes": true,
        "ids": [
          "coffee"
        ]
      },
      {
        "match": "pradl|pizmo",
        "includeNotes": true,
        "ids": [
          "linen"
        ]
      },
      {
        "match": "levand",
        "includeNotes": true,
        "ids": [
          "lavender"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "coffee",
          "lavender"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "candle"
  },
  "vonavepranie": {
    "series": "s5",
    "type": "cosmetics",
    "segment": "fragrance",
    "name": "Voňavé pranie",
    "country": "SK",
    "logos": {
      "landing": "/assets/s5/vonavepranie/logo.svg",
      "header": "/assets/s5/vonavepranie/logo.svg",
      "avatar": "/assets/s5/vonavepranie/avatar.svg"
    },
    "brand": {
      "name": "Voňavé pranie",
      "domain": "vonavepranie.sk",
      "website": "https://www.vonavepranie.sk/",
      "lang": "sk",
      "fullName": "Voňavé pranie",
      "url": "https://www.vonavepranie.sk/",
      "logo": "/assets/s5/vonavepranie/logo.svg",
      "mark": "/assets/s5/vonavepranie/avatar.svg",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône na pranie, ich balenia a ceny.",
      "quickChips": [
        "Pižmo a jazmín",
        "Lotos a ylang ylang",
        "Ruža a kosatec",
        "Porovnať dve vône"
      ],
      "theme": {
        "brand": "#46727a",
        "accent": "#d9bb7b",
        "soft": "#edf5f4",
        "paper": "#fff",
        "ink": "#243d42",
        "line": "#d9e5e3"
      },
      "hero": "/assets/s5/vonavepranie/1.jpg"
    },
    "traitCopy": {
      "clean": [
        "Pižmo a čisté kvetinové tóny",
        "",
        "Pižmo a čisté kvetinové tóny",
        ""
      ],
      "1": [
        "Biele pižmo, jazmín a ruža",
        "",
        "Biele pižmo, jazmín a ruža",
        ""
      ],
      "2": [
        "Kvet bavlny, ľan a pižmo",
        "",
        "Kvet bavlny, ľan a pižmo",
        ""
      ],
      "flowers": [
        "Lotos a biele kvety",
        "",
        "Lotos a biele kvety",
        ""
      ],
      "3": [
        "Lotosový kvet a ylang ylang",
        "",
        "Lotosový kvet a ylang ylang",
        ""
      ],
      "4": [
        "Magnólia, orgován a jazmín",
        "",
        "Magnólia, orgován a jazmín",
        ""
      ],
      "warm": [
        "Ruža alebo citrusy s vanilkou",
        "",
        "Ruža alebo citrusy s vanilkou",
        ""
      ],
      "5": [
        "Ruža, kosatec a vanilka",
        "",
        "Ruža, kosatec a vanilka",
        ""
      ],
      "6": [
        "Pomaranč a vanilkový kvet",
        "",
        "Pomaranč a vanilkový kvet",
        ""
      ]
    },
    "stepCopy": {
      "fragranceDirection": [
        "Aká vôňa je vám blízka?",
        "",
        "Vonné tóny"
      ],
      "fragranceProfile": [
        "Ktorá kombinácia vás láka?",
        "",
        "Vonné tóny"
      ]
    },
    "compareFocus": true,
    "upsellFocus": {},
    "choicePhotos": {
      "clean": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "1": [
        "/assets/s3/scenes-k2/citrus.jpg"
      ],
      "2": [
        "/assets/s3/scenes-k2/neroli-blossom.jpg"
      ],
      "flowers": [
        "/assets/s3/scenes-k2/jasmine.jpg"
      ],
      "3": [
        "/assets/s3/scenes-k2/jasmine.jpg"
      ],
      "4": [
        "/assets/s3/scenes-k2/white-rose.jpg"
      ],
      "warm": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ],
      "5": [
        "/assets/s3/scenes-k2/citrus.jpg"
      ],
      "6": [
        "/assets/s3/scenes-k2/orange-slices.jpg"
      ]
    },
    "compareProductIds": [
      "1",
      "6"
    ],
    "segmentText": {
      "entryNote": "Vône na pranie · balenia · porovnanie",
      "titleSuffix": "výber vône na pranie",
      "tab": "Výber vône",
      "advisorName": "Poradca vôní na pranie",
      "entrySmall": "VÔNE NA PRANIE",
      "entryTitle": "Vyberte si vôňu na pranie",
      "placeholder": "Opýtajte sa na charakter vône, balenie alebo cenu…",
      "heading": "Pomôžte zákazníkovi nájsť vôňu na pranie podľa jeho vkusu.",
      "lead": "Výber ukáže parfum na pranie s fotografiou, profilom vône, presným balením, cenou a odkazom. Možno pridať 20 ml vzorku rovnakej vône a porovnať dve odlišné kompozície.",
      "includedChat": "Vonné tóny parfumov na pranie, balenia a ceny.",
      "includedAdvisor": "Výber vône na pranie, voliteľná vzorka a porovnanie.",
      "greeting": "Dobrý deň. Pomôžem vám porovnať vybrané vône na pranie, ich balenia a ceny.",
      "teaserTitle": "Vyberte si vôňu na pranie",
      "teaserNote": "Konkrétne balenie a cena",
      "teaserAria": "Otvoriť výber vône na pranie",
      "source": "vonavepranie-demo"
    },
    "fragranceResultExtras": {
      "version": 1,
      "enabled": true,
      "alternatives": {
        "1": "2",
        "2": "1",
        "3": "4",
        "4": "3",
        "5": "6",
        "6": "5"
      },
      "scentProfile": {
        "version": 1,
        "mode": "source-notes-no-numeric-strength"
      }
    },
    "fragrancePresentation": {
      "version": 1,
      "hideStepEstimate": true
    },
    "localReplyRules": [
      {
        "match": "pizmo|jazmin",
        "includeNotes": true,
        "ids": [
          "1"
        ]
      },
      {
        "match": "lotos|ylang",
        "includeNotes": true,
        "ids": [
          "3"
        ]
      },
      {
        "match": "ruza|kosatec",
        "includeNotes": true,
        "ids": [
          "5"
        ]
      },
      {
        "match": "^porovnat dv[ea] v[ou]ne[.!?]?$",
        "ids": [
          "1",
          "6"
        ],
        "includeNotes": true
      }
    ],
    "usageFamily": "laundry"
  }
};
  globalThis.S5_REVIEWED_FRAGRANCE_DEMOS = demos;
  if (typeof window !== 'undefined' && window.S3_REG) Object.assign(window.S3_REG.demos, demos);
})();
