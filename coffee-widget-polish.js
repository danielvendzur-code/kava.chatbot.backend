/**
 * Widget-side polish shared by all six demos.
 *
 * Three things the per-brand runtimes each got slightly wrong:
 *
 * 1. The invitation above the launcher carried long, differently-worded copy
 *    that wrapped to four lines on a 290 px card. It is now one short pair of
 *    lines, the same shape everywhere, sized to fit on one line each.
 * 2. The panel header showed the brand at whatever size its own layer had left
 *    it. The lockup is now the largest thing in the header.
 * 3. Opening the panel presented the mode switch, a handoff card, a greeting
 *    and the chips as one undifferentiated stack. Each block now sits in a
 *    labelled section so a first-time visitor can see what is what.
 */
(() => {
  'use strict';

  const brand = window.__MCB_BRAND__;
  if (!brand) return;

  /* --------------------------------------------------- brand tokens on root */

  // coffee-no-black.css declares its --nb-* palette on
  // body[data-demo="praziarnicka"], but the attribute actually reads
  // "praziarnicka-v13" (coffee-final-entry.js), so those variables never
  // resolve on that demo. These are set from the brand record instead, which
  // works the same on all six including Jolka, which that layer never covers.
  function applyTokens() {
    const t = brand.theme;
    if (!t) return;
    const root = document.body;
    if (root.dataset.mcwTokens === 'true') return;
    root.dataset.mcwTokens = 'true';
    // body[data-demo] rules in coffee-widget-final.css outrank a plain
    // `html body` selector, so the polish layer hangs off a class instead.
    root.classList.add('mcw-on');
    root.style.setProperty('--mcw-ink', t.ink);
    root.style.setProperty('--mcw-brand', t.brand);
    root.style.setProperty('--mcw-accent', t.accent);
    root.style.setProperty('--mcw-soft', t.soft);
    root.style.setProperty('--mcw-paper', t.paper);
  }
  applyTokens();

  const attachStyle = () => {
    if (document.querySelector('link[data-mcb-widget-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-widget-polish.css';
    link.dataset.mcbWidgetStyle = 'true';
    link.dataset.mcOrder = '35';
    document.body.appendChild(link);
  };
  attachStyle();

  /* --------------------------------------------------- the invitation copy */

  // Short enough to stay on one line each at the new width. Every demo used to
  // write its own, from "Vyskúšajte AI poradcu" to a two-line question.
  const TEASER_TITLE = 'Nájdite svoju kávu';
  const TEASER_SUB = '4 otázky · jedno odporúčanie';

  const TEASERS = '#teaser, #launcherTeaser, .teaser, .launcher__teaser, .launcher-teaser, .kf-teaser, #pz13-preview';

  function normaliseTeaser() {
    document.querySelectorAll(TEASERS).forEach((teaser) => {
      const title = teaser.querySelector('b, strong');
      const sub = teaser.querySelector('span:not([class*="close"]):not([class*="icon"])');
      if (title && title.textContent.trim() !== TEASER_TITLE) title.textContent = TEASER_TITLE;
      if (sub && sub.textContent.trim() !== TEASER_SUB) sub.textContent = TEASER_SUB;
      teaser.dataset.mcbTeaser = 'true';
    });
  }

  /* ------------------------------------------------------------- the chips */

  // Four labels, written once per roastery. Every runtime sends the chip's own
  // text as the message (praziarnicka-v13.js:299, coffee-v8.js:199,
  // kaffa-editorial.js:171, jolka/jolka-app.js:600), so relabelling here also
  // changes the question that gets asked — nothing else has to move.
  //
  // Two of them ask what a visitor cannot read off the shop: where the coffee
  // comes from, and how two of them differ.
  const CHIP_ROWS = '.chips, #chips, #quickChips, .kf-chips, .quick-grid, .quick-questions';

  function relabelChips() {
    if (!Array.isArray(brand.chips)) return;
    document.querySelectorAll(CHIP_ROWS).forEach((row) => {
      // Whatever the row holds, in order, however many: Jolka keeps its chat
      // chips hidden until the visitor switches to the chat, and some rows
      // carry a fifth chip the stylesheet hides.
      const chips = [...row.children].filter((node) => node.tagName === 'BUTTON');
      chips.slice(0, brand.chips.length).forEach((chip, index) => {
        const label = brand.chips[index];
        if (chip.textContent.trim() !== label) chip.textContent = label;
      });
    });
  }

  /* -------------------------------------------------------------- the tray */

  // Prazarnicka, Kaffa and Jolka each wrap their chips and composer in a
  // container. The three v8-based demos do not, so the bottom of their panel
  // has nothing to carry a background. One is added around the existing nodes;
  // ids and listeners move with them untouched.
  const TRAY_HOSTS = '#chatScreen, .chat-screen';
  const TRAY_CHIPS = '.chips, #quickChips, .quick-grid, .quick-questions';
  const TRAY_FORM = '.composer, form#chatForm';

  function ensureTray() {
    document.querySelectorAll(TRAY_HOSTS).forEach((host) => {
      if (host.querySelector('.mcw-tray, .pz13-chat__bottom, .composer-area, .kf-chat-footer')) return;
      const chips = host.querySelector(`:scope > ${TRAY_CHIPS.split(', ').join(', :scope > ')}`);
      const form = host.querySelector(`:scope > ${TRAY_FORM.split(', ').join(', :scope > ')}`);
      if (!form) return;
      const tray = document.createElement('div');
      tray.className = 'mcw-tray';
      form.parentElement.insertBefore(tray, chips || form);
      if (chips) tray.appendChild(chips);
      tray.appendChild(form);
    });
  }

  /* ------------------------------------------------------------- the mark */

  // The launcher carries the roastery's mark, not a generic bubble, so the
  // bubble in the corner of their own site is recognisably theirs. Two demos
  // shipped a plain speech bubble because no mark had been wired up.
  const LAUNCHERS = '.launcher__button, .launcher-button, .kf-launcher, #launcherButton, #pz13-open';

  function markLauncher() {
    document.querySelectorAll(LAUNCHERS).forEach((node) => {
      node.classList.add('mcb-w-launcher');
      if (!brand.mark) return;

      // A letter mark rides on the button itself as a data attribute, drawn by
      // CSS. Injecting a child element lost the race with runtimes that rebuild
      // their launcher's contents; an attribute on the button survives that,
      // and the stylesheet hides whatever generic icon comes back inside it.
      if (brand.mark.text) {
        if (node.dataset.mcwMark !== brand.mark.text) {
          node.dataset.mcwMark = brand.mark.text;
          if (brand.mark.font) node.style.setProperty('--mcw-mark-font', brand.mark.font);
        }
        return;
      }

      if (node.querySelector('img')) return;
      node.querySelectorAll('svg').forEach((svg) => svg.remove());
      const img = document.createElement('img');
      img.src = brand.mark.src;
      img.alt = '';
      img.decoding = 'async';
      node.appendChild(img);
    });
  }

  /* ------------------------------------------------------------ liveliness */

  const MESSAGE_ROWS = '.pz13-message, .message, .msg, .chat-line, .kf-message-row';
  const USER_ROW = /--user|\buser\b|is-user/;

  const clock = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // A chat with no clock on it reads as a screenshot. The time is stamped once
  // per row and kept in the dataset, so a re-render does not shuffle it.
  function stampTimes() {
    document.querySelectorAll(MESSAGE_ROWS).forEach((row) => {
      if (row.dataset.mcwTime) {
        if (!row.querySelector('.mcw-time')) appendTime(row, row.dataset.mcwTime);
        return;
      }
      row.dataset.mcwTime = clock();
      appendTime(row, row.dataset.mcwTime);
    });
  }

  const BUBBLE = '.pz13-bubble, .bubble, .chat-bubble, .kf-message';

  function appendTime(row, value) {
    // Inside the bubble: appending to the row itself made the clock a stray
    // flex item that landed at the far edge of the panel.
    const bubble = row.querySelector(BUBBLE) || row;
    if (bubble.querySelector('.mcw-time')) return;
    const time = document.createElement('time');
    time.className = 'mcw-time';
    time.textContent = value;
    row.classList.add('mcw-row');
    if (USER_ROW.test(row.className)) row.classList.add('mcw-row--user');
    bubble.appendChild(time);
  }

  const dots = () => '<span class="mcw-dots" aria-hidden="true"><i></i><i></i><i></i></span>';

  // The reply used to appear fully formed the instant it was ready. A short
  // "typing" beat before it makes the exchange feel like one.
  function holdBotReply() {
    document.querySelectorAll(MESSAGE_ROWS).forEach((row) => {
      if (row.dataset.mcwTyped || USER_ROW.test(row.className)) return;
      row.dataset.mcwTyped = 'true';
      // The opening greeting is already on screen when the panel opens; only
      // replies that arrive during the conversation get the beat.
      if (!document.querySelector('.message--user, .chat-line--user, .kf-message-row--user, .msg--user, .pz13-message--user')) return;
      row.classList.add('mcw-typing');
      row.insertAdjacentHTML('beforeend', `<span class="mcw-typing-mask">${dots()}</span>`);
      setTimeout(() => {
        row.classList.remove('mcw-typing');
        row.querySelector('.mcw-typing-mask')?.remove();
      }, 700);
    });
  }

  // The recommendation is the moment the advisor earns its keep, so it lands
  // after a visible beat rather than snapping into place.
  const RESULTS = '.pz13-result, .kf-result, .result, #result, .result-card';

  // Only the first recommendation of a visit gets the beat. Repeating it every
  // time someone runs the advisor again turns a considered pause into a delay.
  let thoughtOnce = false;

  function holdResult() {
    document.querySelectorAll(RESULTS).forEach((result) => {
      if (result.dataset.mcwThought) return;
      result.dataset.mcwThought = 'true';
      if (thoughtOnce) return;
      thoughtOnce = true;
      result.classList.add('mcw-thinking');
      const note = document.createElement('p');
      note.className = 'mcw-thinking-note';
      note.innerHTML = `Premýšľam${dots()}`;
      result.parentElement?.insertBefore(note, result);
      setTimeout(() => {
        result.classList.remove('mcw-thinking');
        note.remove();
      }, 650);
    });
  }

  // The status dot is the one thing on a static header that can say "someone is
  // actually here".
  const STATUS_DOTS = '.status-dot, .kf-head-dot, ' +
    '.pz13-widget__brand small i, .widget-brand__copy small i, .kf-widget-brand__copy small i, ' +
    '.widget-brand small i, [class*="brand"] small i';

  function markStatus() {
    document.querySelectorAll(STATUS_DOTS).forEach((node) => node.classList.add('mcw-pulse'));
  }

  const run = () => {
    applyTokens();
    ensureTray();
    normaliseTeaser();
    relabelChips();
    markLauncher();
    stampTimes();
    holdBotReply();
    holdResult();
    markStatus();
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; run(); });
  });
  // characterData too: a runtime that rewrites the invitation's text in place
  // produces no childList record, and Kaffa does exactly that after its own
  // first paint.
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  run();
  // A runtime writing during the debounce window would otherwise get the last
  // word. These settle it.
  [200, 700, 1600, 3200].forEach((delay) => setTimeout(run, delay));
})();
