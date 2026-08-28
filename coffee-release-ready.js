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

    /* Grid items with width:100% can still overflow their padded grid area when
       old Kaffa layers leave intrinsic/content-box sizing behind. Let the grid
       stretch the footer and composer instead of forcing a percentage width. */
    const footer = document.querySelector('.kf-chat-footer');
    const composer = document.querySelector('.kf-composer');
    if (footer) {
      setImportant(footer, 'box-sizing', 'border-box');
      setImportant(footer, 'width', 'auto');
      setImportant(footer, 'min-width', '0');
      setImportant(footer, 'max-width', 'none');
      setImportant(footer, 'justify-self', 'stretch');
    }
    if (composer) {
      setImportant(composer, 'box-sizing', 'border-box');
      setImportant(composer, 'width', 'auto');
      setImportant(composer, 'min-width', '0');
      setImportant(composer, 'max-width', 'none');
      setImportant(composer, 'justify-self', 'stretch');
      setImportant(composer, 'align-self', 'stretch');
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
      const launcher = document.querySelector('#openWidget.launcher__button');
      const img = launcher?.querySelector('.cfr-vitazov-launcher-logo');
      if (launcher) launcher.removeAttribute('data-mcw-mark');
      if (img) {
        setImportant(img, 'display', 'block');
        setImportant(img, 'visibility', 'visible');
        setImportant(img, 'opacity', '1');
        setImportant(img, 'position', 'relative');
        setImportant(img, 'z-index', '2');
        setImportant(img, 'width', '54px');
        setImportant(img, 'height', 'auto');
        setImportant(img, 'max-width', '54px');
        setImportant(img, 'max-height', '38px');
        setImportant(img, 'object-fit', 'contain');
        setImportant(img, 'filter', 'brightness(0)');
      }
      launcher?.querySelectorAll('.launcher__status').forEach((node) => node.remove());
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