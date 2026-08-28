(() => {
  'use strict';

  const setImportant = (node, property, value) => node?.style?.setProperty(property, value, 'important');

  function enforceTabletPanel() {
    const width = window.innerWidth;
    if (width < 481 || width > 640) return;
    const slug = document.body.dataset.coffeeFinal;
    if (slug === 'kaffa') {
      const panel = document.querySelector('.kf-panel');
      if (!panel) return;
      setImportant(panel, 'position', 'absolute');
      setImportant(panel, 'inset', 'auto 12px 12px auto');
      setImportant(panel, 'top', 'auto');
      setImportant(panel, 'left', 'auto');
      setImportant(panel, 'right', '12px');
      setImportant(panel, 'bottom', '12px');
      setImportant(panel, 'width', 'min(452px, calc(100vw - 24px))');
      setImportant(panel, 'max-width', '452px');
      setImportant(panel, 'height', 'min(650px, calc(100dvh - 24px))');
      setImportant(panel, 'max-height', '650px');
      setImportant(panel, 'border-radius', '28px');
    }
    if (slug === 'concept') {
      const panel = document.querySelector('#widget.widget');
      if (!panel) return;
      setImportant(panel, 'position', 'fixed');
      setImportant(panel, 'inset', 'auto 12px 12px auto');
      setImportant(panel, 'top', 'auto');
      setImportant(panel, 'left', 'auto');
      setImportant(panel, 'right', '12px');
      setImportant(panel, 'bottom', '12px');
      setImportant(panel, 'width', 'min(456px, calc(100vw - 24px))');
      setImportant(panel, 'max-width', '456px');
      setImportant(panel, 'height', 'min(684px, calc(100dvh - 24px))');
      setImportant(panel, 'max-height', '684px');
      setImportant(panel, 'border-radius', '28px');
    }
  }

  function settleJolkaOrder() {
    if (document.body.dataset.coffeeFinal !== 'jolka') return;
    const screen = document.querySelector('#chatScreen');
    const chat = document.querySelector('#chat');
    const entry = document.querySelector('#entry');
    if (screen && chat && entry && chat.nextElementSibling !== entry) screen.insertBefore(chat, entry);
  }

  function settleKaffaChat() {
    if (document.body.dataset.coffeeFinal !== 'kaffa') return;
    const seed = document.querySelector('.kf-messages:not(.has-thread) .kf-chat-seed');
    if (seed) {
      /* An older Kaffa layer stretched the untouched seed to 100% height and
         pushed the welcome row down with margin-top:auto. That made a large empty
         hole appear between "Nájsť svoju kávu" and the first bot message. */
      setImportant(seed, 'min-height', '0');
      setImportant(seed, 'height', 'auto');
      setImportant(seed, 'flex', '0 0 auto');
      setImportant(seed, 'gap', '6px');

      const botRow = seed.querySelector('.kf-message-row--bot') ||
        [...seed.querySelectorAll('.kf-message-row')].find((row) => row.querySelector('.kf-message.bot'));
      if (botRow) setImportant(botRow, 'margin-top', '0');
    }

    /* Old Kaffa styles used content-box sizing on the composer. Combined with a
       later width:100% rule, its padding and border could spill two pixels past
       the right edge on the tablet-width floating panel. Keep the entire bottom
       tray geometrically inside the panel on every repaint. */
    const footer = document.querySelector('.kf-chat-footer');
    const composer = document.querySelector('.kf-composer');
    if (footer) {
      setImportant(footer, 'box-sizing', 'border-box');
      setImportant(footer, 'width', '100%');
      setImportant(footer, 'max-width', '100%');
    }
    if (composer) {
      setImportant(composer, 'box-sizing', 'border-box');
      setImportant(composer, 'width', '100%');
      setImportant(composer, 'max-width', '100%');
    }
  }

  function settleFinishedResults() {
    /* The historic shared polish added a temporary "Premýšľam…" note. Some
       brand runtimes repaint the result during that timeout, which could leave
       the note visible beside an already finished recommendation. A finished
       result must never look as if it is still loading. */
    document.querySelectorAll('.mcw-thinking-note').forEach((note) => note.remove());
    document.querySelectorAll('.mcw-thinking').forEach((result) => result.classList.remove('mcw-thinking'));
  }

  function settleLauncherMarks() {
    const slug = document.body.dataset.coffeeFinal;

    if (slug === 'concept') {
      const crop = document.querySelector('#openWidget .cfr-concept-launcher-crop');
      const img = crop?.querySelector('img');
      if (crop) {
        setImportant(crop, 'inset', '6px');
        setImportant(crop, 'display', 'grid');
        setImportant(crop, 'place-items', 'center');
        setImportant(crop, 'overflow', 'visible');
        setImportant(crop, 'background', 'transparent');
      }
      if (img) {
        setImportant(img, 'width', '52px');
        setImportant(img, 'height', 'auto');
        setImportant(img, 'max-width', '52px');
        setImportant(img, 'max-height', '46px');
        setImportant(img, 'object-fit', 'contain');
        setImportant(img, 'transform', 'none');
        setImportant(img, 'filter', 'brightness(0) invert(1)');
      }
    }

    if (slug === 'vitazov') {
      const img = document.querySelector('#openWidget .cfr-vitazov-launcher-logo');
      if (img) {
        setImportant(img, 'width', '54px');
        setImportant(img, 'height', 'auto');
        setImportant(img, 'max-width', '54px');
        setImportant(img, 'max-height', '38px');
        setImportant(img, 'object-fit', 'contain');
        setImportant(img, 'filter', 'brightness(0)');
      }
    }

    if (slug === 'diamonds') {
      const img = document.querySelector('#launcherButton img');
      if (img) {
        setImportant(img, 'width', '48px');
        setImportant(img, 'height', 'auto');
        setImportant(img, 'max-width', '48px');
        setImportant(img, 'max-height', '42px');
        setImportant(img, 'object-fit', 'contain');
        setImportant(img, 'filter', 'brightness(0) invert(1)');
      }
    }
  }

  function settleOwnerPrice() {
    if (document.body.dataset.coffeeFinal !== 'concept' || window.innerWidth > 480) return;
    const row = document.querySelector('.mcb-plan-price');
    if (!row) return;
    setImportant(row, 'flex-wrap', 'nowrap');
    setImportant(row, 'gap', '3px 4px');
    row.querySelectorAll('strong').forEach((node) => setImportant(node, 'font-size', '25px'));
    row.querySelectorAll('span').forEach((node) => {
      setImportant(node, 'font-size', '11px');
      setImportant(node, 'white-space', 'nowrap');
    });
    row.querySelectorAll('i').forEach((node) => {
      setImportant(node, 'font-size', '12px');
      setImportant(node, 'padding', '0 1px');
    });
  }

  function settle() {
    enforceTabletPanel();
    settleJolkaOrder();
    settleKaffaChat();
    settleFinishedResults();
    settleLauncherMarks();
    settleOwnerPrice();
  }

  /* Opening/mode scripts from older brand layers can rewrite geometry after
     initial boot. Reinforce only the final contracts after those interactions;
     phone full-screen mode itself remains untouched. */
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#launcher,#launcherButton,#openWidget,#open,.kf-switch,.mode,#modeSwitch')) return;
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 90);
    setTimeout(settle, 260);
    setTimeout(settle, 720);
  }, true);
  window.addEventListener('resize', settle, { passive:true });

  const observer = new MutationObserver(() => requestAnimationFrame(settle));
  observer.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['class','aria-hidden'] });

  setTimeout(() => {
    settle();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      settle();
      document.documentElement.dataset.coffeeReleaseReady = 'true';
    }));
  }, 380);
})();