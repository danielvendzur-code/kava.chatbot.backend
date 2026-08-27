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

  function settle() {
    enforceTabletPanel();
    settleJolkaOrder();
  }

  /* Opening/mode scripts from older brand layers can rewrite geometry after
     initial boot. Reinforce only the final tablet/Jolka contract after those
     interactions; this intentionally does not affect phone full-screen mode. */
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#launcher,#openWidget,#open,.kf-switch,.mode,#modeSwitch')) return;
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 90);
    setTimeout(settle, 260);
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