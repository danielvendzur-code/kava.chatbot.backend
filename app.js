(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const products = {
    brazil: {
      id: "brazil",
      name: "Brazil Santos",
      packName: "BRAZIL",
      composition: "100 % Arabica",
      symbol: "☼",
      tag: "Najjemnejšia každodenná voľba",
      price: "od 9,90 €",
      description: "Sladšia a jemná káva s tónmi mlieka, sladu, čokolády a kakaa. Má iba minimálnu aciditu.",
      notes: ["čokoláda", "kakao", "slad"],
      taste: { "Sladkosť": 8, "Horkosť": 3, "Kyslosť": 2, "Kréma": 7 },
      strength: 1,
      prep: ["automatic", "lever", "moka", "pour"],
      milk: ["black", "milk"],
      decaf: false,
      url: "https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica",
      intro: "Jemná, zrozumiteľná a veľmi bezpečná voľba na každý deň."
    },
    cuba: {
      id: "cuba",
      name: "Cuba Serrano Lavado",
      packName: "CUBA",
      composition: "100 % Arabica",
      symbol: "◆",
      tag: "Sladká arabica bez acidity",
      price: "od 12,90 €",
      description: "Plná kubánska arabica s kakaovou pastou, kakaovými bôbmi, tabakom a dochuťou vlašských orechov.",
      notes: ["kakao", "tabak", "vlašský orech"],
      taste: { "Sladkosť": 9, "Horkosť": 4, "Kyslosť": 0, "Kréma": 9 },
      strength: 2,
      prep: ["lever", "moka", "pour", "automatic"],
      milk: ["black"],
      decaf: false,
      url: "https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica",
      intro: "Výrazná, ale stále sladká káva pre človeka, ktorý nechce kyslosť."
    },
    paganini: {
      id: "paganini",
      name: "Paganini blend",
      packName: "PAGANINI",
      composition: "75 % Arabica · 25 % Robusta",
      symbol: "♫",
      tag: "Najuniverzálnejšia voľba",
      price: "od 11,90 €",
      description: "Vyvážená zmes s kandizovaným ovocím, čokoládou, mandľami, lieskovými orechmi a jemným korením.",
      notes: ["čokoláda", "mandle", "oriešky"],
      taste: { "Sladkosť": 9, "Horkosť": 6, "Kyslosť": 1, "Kréma": 9 },
      strength: 2,
      prep: ["automatic", "lever", "moka"],
      milk: ["milk", "black"],
      decaf: false,
      url: "https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta",
      intro: "Veľmi bezpečná voľba, najmä ak striedate espresso a mliečne nápoje."
    },
    puccini: {
      id: "puccini",
      name: "Puccini blend",
      packName: "PUCCINI",
      composition: "60 % Arabica · 40 % Robusta",
      symbol: "♪",
      tag: "Silnejšia káva s hustou krémou",
      price: "od 11,50 €",
      description: "Sladšia, výraznejšia zmes s tmavou čokoládou, orieškami a stopou marhúľ, prakticky bez acidity.",
      notes: ["tmavá čokoláda", "oriešky", "marhuľa"],
      taste: { "Sladkosť": 8, "Horkosť": 4, "Kyslosť": 1, "Kréma": 9 },
      strength: 3,
      prep: ["automatic", "lever", "moka"],
      milk: ["milk", "black"],
      decaf: false,
      url: "https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta",
      intro: "Správna voľba, keď chcete viac sily, krémy a chuť, ktorá sa nestratí v mlieku."
    },
    decaf: {
      id: "decaf",
      name: "Bezkofeínová Brazil",
      packName: "DECAF",
      composition: "100 % Arabica · bez kofeínu",
      symbol: "◐",
      tag: "Káva na večer a bez kofeínu",
      price: "od 12,90 €",
      description: "Brazílska arabica bez kofeínu, vhodná na večer alebo vždy, keď chcete chuť kávy bez povzbudivého účinku.",
      notes: ["brazílska arabica", "nízka acidita", "bez kofeínu"],
      taste: { "Sladkosť": 4, "Horkosť": 6, "Kyslosť": 1, "Kréma": 3 },
      strength: 1,
      prep: ["automatic", "lever", "moka", "pour"],
      milk: ["black", "milk"],
      decaf: true,
      url: "https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia",
      intro: "Jednoznačný výber, ak je pre vás dôležitá káva bez kofeínu."
    },
    gift: {
      id: "gift",
      name: "Degustačné darčekové balenie",
      packName: "4 × 250 G",
      composition: "Brazil · Paganini · Puccini · Cuba",
      symbol: "◎",
      tag: "Darček bez tipovania chuti",
      price: "39,90 €",
      description: "Štyri 250 g balenia v darčekovej krabičke: dve 100 % arabiky a dve vyvážené espresso zmesi.",
      notes: ["4 rôzne kávy", "1 kg spolu", "darčeková krabička"],
      taste: { "Rozmanitosť": 10, "Jemnosť": 8, "Intenzita": 8, "Kréma": 9 },
      strength: 2,
      prep: ["automatic", "lever", "moka", "pour"],
      milk: ["black", "milk"],
      decaf: false,
      url: "https://praziarnicka.sk/produkt/degustacne-darcekove-balenie",
      intro: "Najistejší darček: obdarovaný si porovná štyri odlišné kávy a nájde si favorita."
    }
  };

  const questions = [
    {
      key: "prep",
      kicker: "Spôsob prípravy",
      title: "Ako kávu najčastejšie pripravujete?",
      help: "Vyberte zariadenie, ktoré používate najviac.",
      beano: "Začnime tým najdôležitejším.",
      answers: [
        { value: "automatic", icon: "▣", title: "Automatický kávovar", text: "stlačím tlačidlo a káva je hotová" },
        { value: "lever", icon: "◒", title: "Pákový kávovar", text: "espresso pripravujem ručne" },
        { value: "moka", icon: "▲", title: "Moka kanvička", text: "výrazná domáca káva na sporáku" },
        { value: "pour", icon: "▽", title: "Zalievam alebo filtrujem", text: "French press, V60 alebo klasické zalievanie" }
      ]
    },
    {
      key: "taste",
      kicker: "Chuť",
      title: "Aká káva vám chutí najviac?",
      help: "Všetky odporúčané kávy majú nízku aciditu.",
      beano: "Teraz doladíme chuťový charakter.",
      answers: [
        { value: "gentle", icon: "○", title: "Jemná a sladšia", text: "čokoláda, kakao, minimum horkosti" },
        { value: "balanced", icon: "◐", title: "Vyvážená", text: "plná chuť bez extrémov" },
        { value: "strong", icon: "●", title: "Silná a výrazná", text: "hustá kréma a intenzívnejší dojem" },
        { value: "unsure", icon: "?", title: "Neviem to pomenovať", text: "vyberte mi bezpečnú univerzálnu voľbu" }
      ]
    },
    {
      key: "drink",
      kicker: "Nápoj",
      title: "Ako ju pijete najčastejšie?",
      help: "Mlieko dokáže prekryť jemnejšie chuťové tóny.",
      beano: "Mlieko vie odporúčanie dosť zmeniť.",
      answers: [
        { value: "black", icon: "●", title: "Čiernu", text: "espresso, lungo alebo čierna káva" },
        { value: "milk", icon: "◌", title: "S mliekom", text: "cappuccino, flat white alebo latte" },
        { value: "both", icon: "◑", title: "Striedam oboje", text: "potrebujem univerzálnu kávu" },
        { value: "sweet", icon: "+", title: "S mliekom aj cukrom", text: "chuť kávy musí zostať výrazná" }
      ]
    },
    {
      key: "caffeine",
      kicker: "Kofeín",
      title: "Chcete klasickú alebo bezkofeínovú?",
      help: "Posledná odpoveď a odporúčanie je hotové.",
      beano: "Už len posledná drobnosť.",
      answers: [
        { value: "classic", icon: "⚡", title: "Klasickú", text: "bežná káva s kofeínom" },
        { value: "decaf", icon: "☾", title: "Bezkofeínovú", text: "na večer alebo bez povzbudenia" },
        { value: "either", icon: "≈", title: "Je mi to jedno", text: "rozhodnite hlavne podľa chuti", wide: true }
      ]
    }
  ];

  const helpAnswers = {
    mletie: "Pri objednávke si môžete zvoliť mletie podľa spôsobu prípravy. Ak máte vlastný mlynček, najlepšiu arómu si zachová zrnková káva zomletá tesne pred prípravou.",
    doprava: "Packeta stojí 3,80 €, pri nákupe nad 60 € je doprava zdarma. Osobný odber v kaviarni Pražiarnička v Trenčíne je bezplatný.",
    cerstvost: "Káva má najlepšiu chuť približne 4 až 6 týždňov od praženia. Skladujte ju vo vzduchotesnej nádobe, v tme a pri izbovej teplote.",
    odoslanie: "Objednávky Pražiarnička expeduje najneskôr nasledujúci pracovný deň. Doručenie cez Packetu zvyčajne trvá 1 až 2 pracovné dni."
  };

  const state = {
    step: 0,
    answers: {},
    ranked: [],
    current: null,
    lastView: "view-start",
    teaserDismissed: false
  };

  const widget = $("#coffee-widget");
  const launcher = $("#widget-launcher");
  const teaser = $("#widget-teaser");

  function setPose(pose) {
    $$('[data-beano]').forEach((sprite) => {
      sprite.dataset.pose = pose;
    });
  }

  function showView(id) {
    $$(".view", widget).forEach((view) => view.classList.toggle("active", view.id === id));
    state.lastView = id;
  }

  function openWidget(view = null) {
    widget.classList.add("open");
    widget.setAttribute("aria-hidden", "false");
    launcher.classList.add("hidden");
    teaser.classList.remove("show");
    document.documentElement.classList.add("widget-open");
    if (view) showView(view);
    setPose(state.current ? "happy" : "wave");
  }

  function closeWidget() {
    widget.classList.remove("open");
    widget.setAttribute("aria-hidden", "true");
    launcher.classList.remove("hidden");
    document.documentElement.classList.remove("widget-open");
    setPose("idle");
  }

  function resetQuiz() {
    state.step = 0;
    state.answers = {};
    state.ranked = [];
    state.current = null;
    $("#alternatives-list").classList.remove("open");
    $("#toggle-alternatives").textContent = "Zobraziť";
    $("#toggle-alternatives").setAttribute("aria-expanded", "false");
    showView("view-start");
    setPose("wave");
  }

  function renderQuestion() {
    const question = questions[state.step];
    const progress = ((state.step + 1) / questions.length) * 100;

    $("#progress-label").textContent = `Otázka ${state.step + 1} zo ${questions.length}`;
    $("#progress-percent").textContent = `${Math.round(progress)} %`;
    $("#progress-fill").style.width = `${progress}%`;
    $("#question-kicker").textContent = question.kicker;
    $("#question-title").textContent = question.title;
    $("#question-help").textContent = question.help;
    $("#beano-line").textContent = question.beano;

    const answerGrid = $("#answer-grid");
    answerGrid.innerHTML = question.answers.map((answer) => `
      <button class="answer-card${answer.wide ? " wide" : ""}" type="button" data-answer="${answer.value}">
        <span class="answer-icon" aria-hidden="true">${answer.icon}</span>
        <b>${answer.title}</b>
        <span>${answer.text}</span>
      </button>
    `).join("");

    $$('[data-answer]', answerGrid).forEach((button) => {
      button.addEventListener("click", () => selectAnswer(question.key, button.dataset.answer));
    });

    setPose("point");
  }

  function selectAnswer(key, value) {
    state.answers[key] = value;
    setPose("happy");

    if (state.step < questions.length - 1) {
      window.setTimeout(() => {
        state.step += 1;
        renderQuestion();
      }, 180);
      return;
    }

    window.setTimeout(showRecommendation, 260);
  }

  function rankProducts() {
    if (state.answers.caffeine === "decaf") return [{ ...products.decaf, score: 99 }, { ...products.brazil, score: 79 }, { ...products.paganini, score: 74 }];

    const candidates = [products.brazil, products.cuba, products.paganini, products.puccini];
    const scored = candidates.map((product) => {
      let score = 40;

      if (product.prep.includes(state.answers.prep)) score += 15;
      else score -= 6;

      if (state.answers.taste === "gentle") {
        if (product.id === "brazil") score += 24;
        if (product.id === "cuba") score += 13;
        if (product.id === "paganini") score += 5;
        if (product.id === "puccini") score -= 3;
      }

      if (state.answers.taste === "balanced" || state.answers.taste === "unsure") {
        if (product.id === "paganini") score += 23;
        if (product.id === "cuba") score += 13;
        if (product.id === "brazil") score += 10;
        if (product.id === "puccini") score += 8;
      }

      if (state.answers.taste === "strong") {
        if (product.id === "puccini") score += 26;
        if (product.id === "paganini") score += 16;
        if (product.id === "cuba") score += 7;
        if (product.id === "brazil") score -= 5;
      }

      if (state.answers.drink === "milk") {
        if (product.id === "paganini") score += 18;
        if (product.id === "puccini") score += 20;
        if (product.id === "brazil") score += 5;
        if (product.id === "cuba") score -= 2;
      }

      if (state.answers.drink === "sweet") {
        if (product.id === "puccini") score += 22;
        if (product.id === "paganini") score += 18;
        if (product.id === "brazil") score -= 4;
      }

      if (state.answers.drink === "black") {
        if (product.id === "cuba") score += 18;
        if (product.id === "brazil") score += 15;
        if (product.id === "paganini") score += 8;
      }

      if (state.answers.drink === "both") {
        if (product.id === "paganini") score += 19;
        if (product.id === "puccini") score += 12;
        if (product.id === "brazil") score += 9;
      }

      if (state.answers.prep === "pour") {
        if (product.id === "brazil") score += 15;
        if (product.id === "cuba") score += 11;
        if (product.id === "puccini") score -= 8;
      }

      if (state.answers.prep === "automatic") {
        if (product.id === "paganini") score += 12;
        if (product.id === "puccini") score += 12;
      }

      return { product, score: Math.min(98, Math.max(66, score)) };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(({ product, score }) => ({ ...product, score }));
  }

  function buildReasons() {
    const prepLabels = {
      automatic: "automatický kávovar",
      lever: "pákový kávovar",
      moka: "moka kanvičku",
      pour: "filter alebo zalievanie"
    };

    const tasteLabels = {
      gentle: "jemnejšiu chuť",
      balanced: "vyváženú chuť",
      strong: "výraznejšiu chuť",
      unsure: "bezpečnú univerzálnu voľbu"
    };

    const drinkLabels = {
      black: "čiernu kávu",
      milk: "mliečne nápoje",
      both: "čiernu aj mliečnu kávu",
      sweet: "mlieko a cukor"
    };

    return [
      { icon: "✓", title: "Sedí k príprave", text: prepLabels[state.answers.prep] || "váš spôsob prípravy" },
      { icon: "◇", title: "Sedí k chuti", text: tasteLabels[state.answers.taste] || "váš chuťový profil" },
      { icon: "☕", title: "Sedí k nápoju", text: drinkLabels[state.answers.drink] || "váš obľúbený nápoj" }
    ];
  }

  function renderProduct(product, score = 95) {
    state.current = product;
    $("#match-score").textContent = `${score || 95} % zhoda`;
    $("#result-intro").textContent = product.intro;
    $("#product-tag").textContent = product.tag;
    $("#product-name").textContent = product.name;
    $("#product-description").textContent = product.description;
    $("#product-price").textContent = product.price;
    $("#product-symbol").textContent = product.symbol;
    $("#product-pack-name").textContent = product.packName;
    $("#product-pack-composition").textContent = product.composition;
    $("#product-cta").href = product.url;
    $("#product-cta").firstChild.textContent = `Pozrieť ${product.name} `;

    const pack = $("#product-pack");
    pack.className = `product-pack ${product.id}`;

    const reasons = product.id === "gift"
      ? [
          { icon: "4", title: "Štyri rôzne kávy", text: "dve arabiky a dve zmesi" },
          { icon: "1", title: "Kilogram kávy", text: "4 × 250 g balenie" },
          { icon: "◎", title: "Hotový darček", text: "vrátane darčekovej krabičky" }
        ]
      : buildReasons();

    $("#reason-list").innerHTML = reasons.map((reason) => `
      <div class="reason"><i>${reason.icon}</i><b>${reason.title}</b><span>${reason.text}</span></div>
    `).join("");

    $("#taste-bars").innerHTML = Object.entries(product.taste).map(([name, value]) => `
      <div class="taste-bar" style="--value:${value * 10}%">
        <span>${name}</span><i></i><b>${value}/10</b>
      </div>
    `).join("");

    const alternatives = state.ranked.filter((item) => item.id !== product.id).slice(0, 2);
    $("#alternatives-list").innerHTML = alternatives.map((item) => `
      <div class="alternative">
        <div><b>${item.name}</b><span>${item.tag} · ${item.price}</span></div>
        <button type="button" data-alternative="${item.id}">Porovnať</button>
      </div>
    `).join("");

    $$('[data-alternative]').forEach((button) => {
      button.addEventListener("click", () => {
        const item = state.ranked.find((candidate) => candidate.id === button.dataset.alternative) || products[button.dataset.alternative];
        renderProduct(item, item.score || 88);
        $(".result-scroll").scrollTo({ top: 0, behavior: "smooth" });
        setPose("happy");
      });
    });

    showView("view-result");
    setPose("happy");
  }

  function showRecommendation() {
    setPose("thinking");
    state.ranked = rankProducts();
    const best = state.ranked[0];
    window.setTimeout(() => renderProduct(best, best.score), 420);
  }

  function showGift() {
    state.ranked = [{ ...products.gift, score: 99 }, { ...products.paganini, score: 90 }, { ...products.brazil, score: 86 }];
    renderProduct(state.ranked[0], 99);
  }

  function addHelpMessage(text, who = "bot") {
    const thread = $("#help-thread");
    const message = document.createElement("div");
    message.className = `help-message ${who}`;
    message.innerHTML = who === "bot"
      ? `<span class="beano-sprite chat-beano" data-pose="idle" aria-hidden="true"></span><p>${text}</p>`
      : `<p>${text}</p>`;
    thread.appendChild(message);
    thread.scrollTop = thread.scrollHeight;
  }

  function resolveHelpQuery(query) {
    const normalized = query.toLowerCase();
    if (/mlet|zrn|hrub/.test(normalized)) return helpAnswers.mletie;
    if (/doprav|packet|odber|pošt|post/.test(normalized)) return helpAnswers.doprava;
    if (/čerst|cerst|sklad|vydrž|vydrz/.test(normalized)) return helpAnswers.cerstvost;
    if (/odoš|odos|doruč|doruc|kedy/.test(normalized)) return helpAnswers.odoslanie;
    if (/bezko|kofe/.test(normalized)) return "V ponuke je Bezkofeínová Brazil – 100 % arabica od 12,90 €. Poradca ju odporučí automaticky, keď v poslednej otázke zvolíte bezkofeínovú kávu.";
    if (/darč|darc/.test(normalized)) return "Najistejší darček je degustačné balenie za 39,90 €: obsahuje Brazil, Paganini, Puccini a Cuba, každú v 250 g balení.";
    if (/siln|výraz|vyraz/.test(normalized)) return "Na výraznejšiu kávu je vhodný Puccini blend s 40 % robusty. Ak chcete vyváženejšiu chuť, zvoľte Paganini blend s 25 % robusty.";
    return "Na túto otázku nemám v deme spoľahlivú odpoveď. Najrýchlejšie bude kontaktovať Pražiarničku na info@praziarnicka.sk alebo +421 917 502 991.";
  }

  $$('[data-open-widget]').forEach((button) => button.addEventListener("click", () => openWidget()));
  launcher.addEventListener("click", () => openWidget());
  launcher.addEventListener("mouseenter", () => setPose("wave"));
  launcher.addEventListener("mouseleave", () => { if (!widget.classList.contains("open")) setPose("idle"); });
  $("#widget-close").addEventListener("click", closeWidget);

  teaser.addEventListener("click", () => openWidget());
  teaser.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWidget();
    }
  });
  $("#teaser-close").addEventListener("click", (event) => {
    event.stopPropagation();
    teaser.classList.remove("show");
    state.teaserDismissed = true;
  });

  $$('[data-intent]').forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.intent === "gift") {
        showGift();
        return;
      }
      state.step = 0;
      state.answers = {};
      showView("view-quiz");
      renderQuestion();
    });
  });

  $$('[data-open-help]').forEach((button) => button.addEventListener("click", () => showView("view-help")));
  $("#help-back").addEventListener("click", () => showView(state.current ? "view-result" : "view-start"));
  $("#quiz-back").addEventListener("click", () => {
    if (state.step === 0) {
      showView("view-start");
      setPose("wave");
      return;
    }
    state.step -= 1;
    renderQuestion();
  });
  $("#result-back").addEventListener("click", () => {
    if (!Object.keys(state.answers).length) {
      resetQuiz();
      return;
    }
    state.step = questions.length - 1;
    showView("view-quiz");
    renderQuestion();
  });
  $("#result-restart").addEventListener("click", resetQuiz);

  $("#toggle-alternatives").addEventListener("click", (event) => {
    const list = $("#alternatives-list");
    const isOpen = list.classList.toggle("open");
    event.currentTarget.textContent = isOpen ? "Skryť" : "Zobraziť";
    event.currentTarget.setAttribute("aria-expanded", String(isOpen));
  });

  $$('[data-question]').forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent.trim();
      addHelpMessage(label, "user");
      window.setTimeout(() => addHelpMessage(helpAnswers[button.dataset.question], "bot"), 260);
    });
  });

  $("#help-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#help-input");
    const value = input.value.trim();
    if (!value) return;
    addHelpMessage(value, "user");
    input.value = "";
    window.setTimeout(() => addHelpMessage(resolveHelpQuery(value), "bot"), 320);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("open")) closeWidget();
  });

  window.setInterval(() => {
    if (widget.classList.contains("open")) return;
    $$('[data-beano][data-pose="idle"]').forEach((sprite) => {
      sprite.dataset.pose = "blink";
      window.setTimeout(() => { sprite.dataset.pose = "idle"; }, 170);
    });
  }, 3600);

  window.setTimeout(() => {
    if (!state.teaserDismissed && !widget.classList.contains("open")) teaser.classList.add("show");
  }, 900);
})();
