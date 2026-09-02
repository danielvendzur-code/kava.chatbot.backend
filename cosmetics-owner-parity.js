(() => {
  'use strict';

  const root = document.querySelector('#cosmetics-root');
  if (!root) return;

  const apply = () => {
    const teaser = root.querySelector('.cx-teaser');
    if (teaser) {
      const title = teaser.querySelector('b');
      const text = teaser.querySelector('span');
      if (title) title.textContent = 'Neviete, čo vybrať?';
      if (text) text.textContent = '4 otázky · jedno odporúčanie';
    }

    const status = root.querySelector('.cx-widget-brand > span');
    if (status) status.textContent = 'Online poradca';

    const kicker = root.querySelector('.cx-owner-kicker');
    if (kicker) kicker.textContent = 'PRODUKTOVÝ PORADCA NA VÁŠ WEB';

    const contact = root.querySelector('.cx-owner-contact');
    if (contact && !contact.dataset.copyReady) {
      const svg = contact.querySelector('svg')?.outerHTML || '';
      contact.innerHTML = `Mám záujem ${svg}`;
      contact.dataset.copyReady = 'true';
    }
  };

  apply();
  new MutationObserver(apply).observe(root, { childList: true, subtree: true });
})();
