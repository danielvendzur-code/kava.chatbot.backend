(() => {
  'use strict';

  const chatScreen = document.querySelector('#chatScreen');
  const chat = document.querySelector('#chat');
  const entry = document.querySelector('#entry');
  const reset = document.querySelector('#reset');
  if (!chatScreen || !chat || !entry) return;

  // Remove technical/AI-demo copy from the owner-facing presentation.
  const flag = document.querySelector('.demo-flag');
  const heroTitle = document.querySelector('.hero h1');
  const heroHint = document.querySelector('.hero__hint');
  if (flag) flag.innerHTML = '<i class="dot"></i> Kávový poradca · ukážka';
  if (heroTitle) heroTitle.textContent = 'Vitajte vo vašom návrhu kávového poradcu pre Pražiareň Jolka.';
  if (heroHint) heroHint.textContent = '4 otázky · konkrétne odporúčanie · pridanie do košíka.';

  // Conversation comes first, so the welcome bubble sits above the optional
  // advisor handoff instead of being pushed down by it.
  chatScreen.insertBefore(chat, entry);

  // Any first customer message — free text or a quick chip — removes the
  // secondary advisor handoff. The persistent top switch remains the only way
  // to change modes after the conversation has started.
  const syncEntry = () => {
    entry.hidden = Boolean(chat.querySelector('.msg--user'));
  };
  new MutationObserver(syncEntry).observe(chat, { childList:true, subtree:true });
  reset?.addEventListener('click', () => requestAnimationFrame(syncEntry));
  syncEntry();
})();
