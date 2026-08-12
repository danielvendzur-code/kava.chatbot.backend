(() => {
  'use strict';

  const chatScreen = document.querySelector('#chatScreen');
  const chat = document.querySelector('#chat');
  const entry = document.querySelector('#entry');
  const composer = document.querySelector('#composer');
  const reset = document.querySelector('#reset');
  if (!chatScreen || !chat || !entry || !composer) return;

  // Remove technical/AI-demo copy from the owner-facing presentation.
  const flag = document.querySelector('.demo-flag');
  const heroTitle = document.querySelector('.hero h1');
  const heroHint = document.querySelector('.hero__hint');
  if (flag) flag.innerHTML = '<i class="dot"></i> Kávový poradca · ukážka';
  if (heroTitle) heroTitle.textContent = 'Vitajte vo vašom návrhu kávového poradcu pre Pražiareň Jolka.';
  if (heroHint) heroHint.textContent = '4 otázky · konkrétne odporúčanie · priamy odkaz na produkt.';

  // Conversation comes first, so the welcome bubble sits above the optional
  // advisor handoff instead of being pushed down by it.
  chatScreen.insertBefore(chat, entry);

  // Once the customer sends a free-text message, the only mode change is the
  // persistent top Chat / Výber kávy switch. Reset restores the initial handoff.
  composer.addEventListener('submit', () => {
    entry.hidden = true;
  });
  reset?.addEventListener('click', () => {
    entry.hidden = false;
  });
})();
