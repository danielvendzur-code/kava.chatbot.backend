(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const forceFallback =
    new URLSearchParams(location.search).get("api") === "off";
  const { mark, icons, products, grinds, questions } = window.JOLKA_DATA || {};
  if (!mark || !icons || !products || !questions) {
    document.body.textContent = "Ukážku sa nepodarilo načítať.";
    return;
  }
  $$("[data-jolka-mark]").forEach((node) => {
    node.innerHTML = mark;
  });
  const productById = (id) => products.find((product) => product.id === id);
  const state = {
    mode: "advisor",
    step: 0,
    answers: {},
    stage: "question",
    selectedProduct: null,
    weight: null,
    grind: "beans",
    transitioning: false,
    chatHistory: [],
    lastFocused: null,
  };
  const widget = $("#widget");
  const launcher = $("#launcher");
  const teaser = $("#teaser");
  const advisor = $("#advisor");
  const advisorScreen = $("#advisorScreen");
  const chatScreen = $("#chatScreen");
  const modeSwitch = $("#modeSwitch");
  const chat = $("#chatMessages");
  function emit(name, detail = {}) {
    window.dispatchEvent(
      new CustomEvent("jolka-demo", { detail: { name, ...detail } }),
    );
    try {
      const events = JSON.parse(
        sessionStorage.getItem("jolka-demo-events") || "[]",
      );
      events.push({ name, detail, at: Date.now() });
      sessionStorage.setItem(
        "jolka-demo-events",
        JSON.stringify(events.slice(-60)),
      );
    } catch (_) {}
  }
  function openWidget(mode = "advisor") {
    state.lastFocused = document.activeElement;
    widget.classList.add("is-open");
    widget.setAttribute("aria-hidden", "false");
    $("#openWidget").setAttribute("aria-expanded", "true");
    launcher.hidden = true;
    document.body.classList.add("widget-open");
    teaser.classList.remove("is-visible");
    setMode(mode, false);
    window.setTimeout(
      () => $("#closeWidget").focus({ preventScroll: true }),
      reducedMotion.matches ? 0 : 180,
    );
    emit("widget_open", { mode });
  }
  function closeWidget() {
    widget.classList.remove("is-open");
    widget.setAttribute("aria-hidden", "true");
    $("#openWidget").setAttribute("aria-expanded", "false");
    document.body.classList.remove("widget-open");
    window.setTimeout(
      () => {
        launcher.hidden = false;
        if (state.lastFocused instanceof HTMLElement)
          state.lastFocused.focus({ preventScroll: true });
      },
      reducedMotion.matches ? 0 : 220,
    );
    emit("widget_close");
  }
  function setMode(mode, focus = true) {
    state.mode = mode;
    modeSwitch.classList.toggle("is-chat", mode === "chat");
    $$(".mode-switch__button").forEach((button) =>
      button.classList.toggle("is-active", button.dataset.mode === mode),
    );
    advisorScreen.classList.toggle("is-active", mode === "advisor");
    chatScreen.classList.toggle("is-active", mode === "chat");
    if (mode === "advisor") renderAdvisor();
    if (focus)
      window.setTimeout(
        () =>
          (mode === "chat"
            ? $("#chatInput")
            : $("#advisor button:not([disabled])")
          )?.focus({ preventScroll: true }),
        30,
      );
    emit("mode_change", { mode });
  }
  function scoreProduct(product) {
    const { intent, prep, drink, acidity } = state.answers;
    let score = 0;
    if (intent && product.intents.includes(intent)) score += 10;
    if (prep && product.prep.includes(prep)) score += 6;
    if (drink && product.drink.includes(drink)) score += 4;
    if (acidity && product.acidity.includes(acidity)) score += 6;
    if (intent === "experiment" && product.id === "vietnam") score += 9;
    if (intent === "fruity" && product.id === "sidamo") score += 8;
    if (intent === "milk" && product.id === "zmes-cokolada") score += 7;
    if (intent === "classic" && product.id === "zmes-jolka") score += 6;
    if (intent === "balanced" && product.id === "el-salvador") score += 8;
    if (prep === "filter" && product.id === "sidamo")
      score += intent === "fruity" ? 4 : 1;
    if (prep === "filter" && product.id === "vietnam")
      score += intent === "experiment" ? 5 : 0;
    if (drink === "milk" && !product.drink.includes("milk")) score -= 9;
    if (acidity === "low" && product.acidity.includes("bright")) score -= 8;
    if (acidity === "bright" && product.acidity.includes("low")) score -= 5;
    return score;
  }
  function ranking() {
    return products
      .map((product, index) => ({
        ...product,
        score: scoreProduct(product),
        index,
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  }
  function updateProgress() {
    const questionStage = state.stage === "question";
    $("#progressLabel").textContent = questionStage
      ? `${state.step + 1} / ${questions.length}`
      : state.stage === "result"
        ? "Výsledok"
        : state.stage === "package"
          ? "Dokončenie"
          : "Hotovo";
    $("#progressName").textContent = questionStage
      ? questions[state.step].name
      : state.stage === "result"
        ? "Vaša káva"
        : state.stage === "package"
          ? "Balenie a mletie"
          : "Prechod do e-shopu";
    $("#backButton").disabled = questionStage && state.step === 0;
    $("#progressSteps").innerHTML = questions
      .map(
        (_, index) =>
          `<i class="${!questionStage || index < state.step ? "is-done " : ""}${questionStage && index === state.step ? "is-active" : ""}"></i>`,
      )
      .join("");
  }
  function optionVisual(question, visualKey) {
    const contextualPhotos = {
      automatic: "/assets/jolka/prep-automatic.webp",
      espresso: "/assets/jolka/prep-lever.webp",
      moka: "/assets/jolka/prep-moka.webp",
      filter: "/assets/jolka/prep-filter.webp",
      black: "/assets/jolka/zmes-jolka.png",
      milk: "/assets/jolka/zmes-cokolada.png",
      both: "/assets/jolka/el-salvador.png",
      low: "/assets/jolka/zmes-jolka.png",
      medium: "/assets/jolka/el-salvador.png",
      bright: "/assets/jolka/sidamo.png",
    };
    const product = productById(visualKey);
    const src = product?.image || contextualPhotos[visualKey] || products[0].image;
    const cover = question.key === "prep" ? " option__visual--cover" : "";
    return `<span class="option__visual option__visual--photo${cover}"><img src="${src}" alt="" loading="lazy" onerror="this.hidden=true"></span>`;
  }
  function renderQuestion() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    advisor.innerHTML = `
      <div class="question-head"><small>${question.name}</small><h2>${question.title}</h2></div>
      <div class="options options--${question.options.length}">
        ${question.options.map(([value, label, description, visualKey], index) => `<button class="option ${selected === value ? "is-selected" : selected ? "is-muted" : ""}"type="button"data-value="${value}"style="--delay:${index * 55}ms">${optionVisual(question, visualKey)}<span class="option__copy"><b>${label}</b><small>${description}</small></span><span class="option__state">${selected === value ? icons.check : icons.next}</span></button>`).join("")}
      </div>`;
    $$(".option", advisor).forEach((button) =>
      button.addEventListener("click", () =>
        selectAnswer(button.dataset.value),
      ),
    );
  }
  function selectAnswer(value) {
    if (state.transitioning || state.stage !== "question") return;
    state.answers[questions[state.step].key] = value;
    state.transitioning = true;
    renderQuestion();
    emit("advisor_answer", { step: questions[state.step].key, value });
    window.setTimeout(
      () => {
        if (state.step < questions.length - 1) state.step += 1;
        else state.stage = "result";
        state.transitioning = false;
        renderAdvisor();
      },
      reducedMotion.matches ? 10 : 360,
    );
  }
  function productPhoto(product, extraClass = "") {
    return `<div class="product-photo ${extraClass}" data-fallback="jolka."><img src="${product.image}" alt="Balenie kávy ${product.name}" loading="eager" onerror="this.hidden=true"></div>`;
  }
  function renderResult() {
    const ranked = ranking();
    const best = ranked[0];
    const selected =
      ranked.find((item) => item.id === state.selectedProduct) || best;
    state.selectedProduct = selected.id;
    const alternative = ranked.find((item) => item.id !== selected.id);
    advisor.innerHTML = `
      <div class="result-head"><small>Osobné odporúčanie</small><h2>${selected.id === best.id ? "Táto káva vám sedí najviac" : "Alternatívna voľba"}</h2></div>
      <section class="result-card">
        <div class="result-card__meta">
          <div class="match"><span class="match__badge" aria-hidden="true">✓</span><span><b>Vybrané podľa 4 odpovedí</b><small>${selected.id === best.id ? "najlepšia voľba z ponuky" : "zvolená alternatíva"}</small></span></div>
          <b>${selected.price}</b>
        </div>
        <div class="result-product">${productPhoto(selected, "result-product__photo")}<div><h3>${selected.name}</h3><span class="result-product__origin">${selected.origin}</span><div class="taste-tags">${selected.tones.map((tone) => `<span>${tone}</span>`).join("")}</div></div></div>
        <div class="result-facts"><article><small>Acidita normálne</small><b>${selected.acidityText}</b></article><article><small>Najlepšia príprava</small><b>${selected.prepText}</b></article></div>
        <div class="result-reason"><b>Prečo práve táto</b><p>${selected.reason}</p></div>
        <div class="result-actions"><a class="result-actions__primary" href="${selected.url}" target="_blank" rel="noreferrer">🛒 Do košíka</a><button class="result-actions__secondary" id="choosePackage" type="button">Vybrať balenie</button></div>
        ${alternative ? `<div class="alternative-card"><div><small>Jedna alternatíva</small><b>${alternative.name}·${alternative.tones.slice(0, 2).join(" · ")}</b></div><button type="button"data-alternative="${alternative.id}">Porovnať</button></div>` : ""}
      </section>`;
    $("#choosePackage").addEventListener("click", () => {
      state.stage = "package";
      state.weight = null;
      renderAdvisor();
    });
    $("[data-alternative]", advisor)?.addEventListener("click", (event) => {
      state.selectedProduct = event.currentTarget.dataset.alternative;
      renderResult();
    });
    emit("recommendation_view", { product: selected.id });
  }
  const weightLabel = (weight) => (weight === 1000 ? "1 kg" : `${weight} g`);
  function renderPackage() {
    const product = productById(state.selectedProduct) || ranking()[0];
    advisor.innerHTML = `
      <div class="package-head"><h2>Balenie a mletie</h2><p>Voľba sa zobrazí v rekapitulácii. Aktuálnu cenu a dostupnosť potvrdí produktová stránka.</p></div>
      <div class="package-grid">${product.weights.map((weight) => `<button class="package-option ${state.weight === weight ? "is-selected" : ""}"type="button"data-weight="${weight}"><i></i><b>${weightLabel(weight)}</b><small>${weight <= 150 ? "na ochutnanie" : weight === 1000 ? "veľké balenie" : "bežná zásoba"}</small></button>`).join("")}</div>
      <div class="select-field"><label for="grindSelect">Mletie</label><select id="grindSelect">${grinds.map(([value, label]) => `<option value="${value}"${state.grind === value ? " selected" : ""}>${label}</option>`).join("")}</select></div>
      <div class="order-summary"><div><span>Káva</span><b>${product.name}</b></div><div><span>Balenie</span><b>${state.weight ? weightLabel(state.weight) : "vyberte"}</b></div><div><span>Mletie</span><b>${grinds.find(([value]) => value === state.grind)[1]}</b></div><div><span>Cena na webe</span><b>${product.price}</b></div></div>
      <button class="product-link" id="finishSelection" type="button" ${state.weight ? "" : "disabled"}>${icons.check} Dokončiť výber</button>
      <p class="package-note">Poradca nemení cenu ani sklad. Po dokončení otvorí konkrétny produkt Pražiarne Jolka.</p>`;
    $$(".package-option", advisor).forEach((button) =>
      button.addEventListener("click", () => {
        state.weight = Number(button.dataset.weight);
        renderPackage();
      }),
    );
    $("#grindSelect").addEventListener("change", (event) => {
      state.grind = event.target.value;
      renderPackage();
    });
    $("#finishSelection").addEventListener("click", () => {
      if (state.weight) {
        state.stage = "success";
        renderAdvisor();
      }
    });
  }
  function renderSuccess() {
    const product = productById(state.selectedProduct) || ranking()[0];
    const grind =
      grinds.find(([value]) => value === state.grind)?.[1] || "Zrnková";
    advisor.innerHTML = `
      <div class="success">
        <div class="success__icon">${icons.check}</div>
        <h2>Výber je pripravený</h2>
        <p><b>${product.name}</b><br>${weightLabel(state.weight)} · ${grind}</p>
        <a class="product-link" href="${product.url}" target="_blank" rel="noreferrer">${icons.shop} Otvoriť konkrétny produkt</a>
        <button class="result-actions__secondary" id="startAgain" type="button">Vybrať inú kávu</button>
      </div>`;
    $("#startAgain").addEventListener("click", resetAdvisor);
    emit("selection_complete", {
      product: product.id,
      weight: state.weight,
      grind: state.grind,
    });
  }
  function renderAdvisor() {
    updateProgress();
    if (state.stage === "question") renderQuestion();
    else if (state.stage === "result") renderResult();
    else if (state.stage === "package") renderPackage();
    else renderSuccess();
    advisor.scrollTop = 0;
  }
  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.stage = "question";
    state.selectedProduct = null;
    state.weight = null;
    state.grind = "beans";
    state.transitioning = false;
    renderAdvisor();
    emit("advisor_reset");
  }
  function addMessage(text, user = false) {
    const row = document.createElement("div");
    row.className = `message${user ? " message--user" : ""}`;
    if (!user) {
      const avatar = document.createElement("span");
      avatar.className = "message__avatar";
      avatar.innerHTML = mark;
      row.appendChild(avatar);
    }
    const bubble = document.createElement("div");
    bubble.className = "message__bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    chat.appendChild(row);
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
    });
  }
  function showTyping() {
    const row = document.createElement("div");
    row.id = "typingRow";
    row.className = "message";
    const avatar = document.createElement("span");
    avatar.className = "message__avatar";
    avatar.innerHTML = mark;
    const typing = document.createElement("div");
    typing.className = "message__bubble typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    row.append(avatar, typing);
    chat.appendChild(row);
    requestAnimationFrame(() => {
      chat.scrollTop = chat.scrollHeight;
    });
  }
  function fallbackAnswer(query) {
    const text = query.toLocaleLowerCase("sk");
    if (text.includes("vietnam") || text.includes("experiment"))
      return "Vietnam Lang Biang je najnetradičnejšia voľba: marakuja, pomaranč a vínna dochuť. Najlepšie vynikne na filtri, no dá sa skúsiť aj ako výrazné espresso.";
    if (
      text.includes("ovoc") ||
      text.includes("filter") ||
      text.includes("sidamo")
    )
      return "Na čistý ovocný filter by som zvolil Ethiopia SIDAMO. Je svieža, kvetinová a citrusová. Ak chcete ešte intenzívnejší experiment, alternatívou je Vietnam Lang Biang.";
    if (
      text.includes("mlie") ||
      text.includes("capp") ||
      text.includes("latte")
    )
      return "Do mlieka je najistejšia Zmes Čokoláda. Má plnšie telo, takmer žiadnu aciditu a v cappuccine zostane chuťovo čitateľná.";
    if (text.includes("kysl") || text.includes("acid"))
      return "Pri čo najnižšej acidite siahnite po Zmesi Jolka alebo Zmesi Čokoláda. Ovocná acidita pri Sidame a Vietname je zámerná sviežosť, nie chyba kávy.";
    if (text.includes("automat"))
      return "Do automatu je bezpečná Zmes Jolka: stabilná, čokoládovo-orechová a s veľmi nízkou aciditou.";
    return "Najpresnejší výsledok dá štvorotázkový výber. Rozlíši klasiku, kávu do mlieka, vyváženú arabiku, ovocný filter a experimentálny Vietnam.";
  }
  async function requestAI(text) {
    if (forceFallback || window.__JOLKA_FORCE_FALLBACK__)
      throw new Error("Forced fallback");
    state.chatHistory.push({ role: "user", content: text });
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        demoId: "jolka",
        messages: state.chatHistory.slice(-10),
      }),
    });
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    if (typeof data.reply !== "string" || !data.reply.trim())
      throw new Error("Empty response");
    state.chatHistory.push({ role: "assistant", content: data.reply });
    return data.reply;
  }
  async function sendChat(text, sourceButton = null) {
    const value = text.trim();
    if (!value) return;
    addMessage(value, true);
    $("#chatInput").value = "";
    showTyping();
    if (sourceButton) sourceButton.disabled = true;
    emit("chat_question", { text: value });
    try {
      const reply = await requestAI(value);
      $("#typingRow")?.remove();
      addMessage(reply);
    } catch (_) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, reducedMotion.matches ? 0 : 280),
      );
      $("#typingRow")?.remove();
      addMessage(fallbackAnswer(value));
      emit("chat_fallback", { text: value });
    } finally {
      if (sourceButton) sourceButton.disabled = false;
    }
  }
  function seedChat() {
    chat.innerHTML = "";
    state.chatHistory = [];
    addMessage(
      "Dobrý deň. Pomôžem vám vybrať medzi klasickou zmesou, vyváženou arabikou a ovocnou výberovou kávou Jolka.",
    );
  }
  function renderQuickQuestions() {
    const labels = [
      "Nízka acidita",
      "Káva do cappuccina",
      "Ovocný filter",
      "Chcem skúsiť Vietnam",
    ];
    $("#quickQuestions").innerHTML = labels
      .map((label) => `<button type="button">${label}</button>`)
      .join("");
    $$("#quickQuestions button").forEach((button) =>
      button.addEventListener("click", () =>
        sendChat(button.textContent, button),
      ),
    );
  }
  function resetAll() {
    resetAdvisor();
    seedChat();
    setMode("advisor", false);
    emit("reset_all");
  }
  function trapFocus(event) {
    if (event.key !== "Tab" || !widget.classList.contains("is-open")) return;
    const focusable = $$(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      widget,
    ).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  $("#heroOpen").addEventListener("click", () => openWidget("advisor"));
  $("#openWidget").addEventListener("click", () => openWidget("advisor"));
  $("#openFromTeaser").addEventListener("click", () => openWidget("advisor"));
  $("#chatAdvisorCta").addEventListener("click", () => setMode("advisor"));
  $("#closeTeaser").addEventListener("click", () => {
    teaser.classList.remove("is-visible");
    emit("teaser_close");
  });
  $("#closeWidget").addEventListener("click", closeWidget);
  $("#resetAll").addEventListener("click", resetAll);
  $("#backButton").addEventListener("click", () => {
    if (state.stage === "success") state.stage = "package";
    else if (state.stage === "package") state.stage = "result";
    else if (state.stage === "result") {
      state.stage = "question";
      state.step = questions.length - 1;
    } else if (state.step > 0) state.step -= 1;
    state.transitioning = false;
    renderAdvisor();
    emit("advisor_back", { stage: state.stage, step: state.step });
  });
  $$(".mode-switch__button").forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.mode)),
  );
  $("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    sendChat($("#chatInput").value);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("is-open"))
      closeWidget();
    trapFocus(event);
  });
  renderAdvisor();
  renderQuickQuestions();
  seedChat();
  window.setTimeout(
    () => teaser.classList.add("is-visible"),
    reducedMotion.matches ? 0 : 900,
  );
})();
