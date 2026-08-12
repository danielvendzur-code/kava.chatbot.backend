(() => {
  'use strict';

  const chatScreen = document.querySelector('#chatScreen');
  const chat = document.querySelector('#chat');
  const entry = document.querySelector('#entry');
  const composerArea = document.querySelector('.composer-area');
  if (!chatScreen || !chat || !entry || !composerArea) return;

  // Keep the actual conversation visually first. The optional advisor handoff
  // sits below it until the customer starts chatting.
  chatScreen.insertBefore(chat, entry);

  const syncEntry = () => {
    entry.hidden = Boolean(chat.querySelector('.msg--user'));
  };

  const observer = new MutationObserver(syncEntry);
  observer.observe(chat, { childList:true, subtree:true });
  syncEntry();
})();
