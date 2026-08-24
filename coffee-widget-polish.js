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

  /* --------------------------------------------------------- panel sections */

  // Each block gets a quiet caption so the panel reads as three parts rather
  // than one pile: what the advisor does, the conversation, and the shortcuts.
  const SWITCHES = '.mode-switch, .mode, .kf-switch, .pz13-mode';
  const ENTRIES = '#openAdvisor, .advisor-entry, .kf-advisor-entry, #advisorEntry, .pz13-advisor-entry, #entry';
  const CHIPS = '.chips, #chips, .kf-chips, .pz13-chips, .quick-replies';

  function label(node, text, key) {
    if (!node || node.dataset[key] === 'true') return;
    node.dataset[key] = 'true';
    node.classList.add('mcb-w-block');
    const caption = document.createElement('span');
    caption.className = 'mcb-w-caption';
    caption.textContent = text;
    node.parentElement?.insertBefore(caption, node);
  }

  function sectionPanel() {
    document.querySelectorAll(SWITCHES).forEach((node) => node.classList.add('mcb-w-switch'));
    document.querySelectorAll(ENTRIES).forEach((node) => {
      if (node.offsetParent === null) return;
      label(node, 'Rýchly výber', 'mcbEntry');
    });
    document.querySelectorAll(CHIPS).forEach((node) => {
      if (!node.children.length) return;
      label(node, 'Časté otázky', 'mcbChips');
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
      if (!brand.mark || node.dataset.mcbMark === 'true') return;
      if (node.querySelector('img')) return;
      node.dataset.mcbMark = 'true';
      node.querySelectorAll('svg').forEach((svg) => svg.remove());
      if (brand.mark.src) {
        const img = document.createElement('img');
        img.src = brand.mark.src;
        img.alt = '';
        img.decoding = 'async';
        node.appendChild(img);
        return;
      }
      const letter = document.createElement('span');
      letter.className = 'mcb-w-letter';
      letter.textContent = brand.mark.text;
      letter.style.fontFamily = brand.mark.font || 'inherit';
      node.appendChild(letter);
    });
  }

  const run = () => {
    normaliseTeaser();
    sectionPanel();
    markLauncher();
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
