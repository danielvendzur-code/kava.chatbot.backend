(() => {
  'use strict';

  const settleFinalOrder = () => {
    if (document.body.dataset.coffeeFinal !== 'jolka') return;
    const screen = document.querySelector('#chatScreen');
    const chat = document.querySelector('#chat');
    const entry = document.querySelector('#entry');
    if (screen && chat && entry && chat.nextElementSibling !== entry) {
      screen.insertBefore(chat, entry);
    }
  };

  // The final stylesheet is loaded immediately before this script. A short
  // settle window lets late brand mutations and the initial CSS transition
  // reach their final state before QA (or diagnostics) reads geometry/colors.
  setTimeout(() => {
    settleFinalOrder();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      settleFinalOrder();
      document.documentElement.dataset.coffeeReleaseReady = 'true';
    }));
  }, 380);
})();