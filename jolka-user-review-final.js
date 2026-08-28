(() => {
  'use strict';
  if (document.body.dataset.coffeeFinal !== 'jolka') return;

  const $ = (selector, root = document) => root.querySelector(selector);

  function firstAdvisorStep() {
    return /^Krok\s+1\s+zo\s+4$/i.test($('#stepTitle')?.textContent?.trim() || '');
  }

  function settleBack() {
    const back = $('#back');
    if (!back) return;
    if (firstAdvisorStep()) {
      back.disabled = false;
      back.setAttribute('aria-label', 'Späť do chatu');
    } else {
      back.setAttribute('aria-label', 'Predchádzajúci krok');
    }
  }

  function settleChatOrder() {
    const screen = $('#chatScreen');
    const entry = $('#entry');
    const chat = $('#chat');
    const composerArea = screen?.querySelector('.composer-area');
    if (!screen || !entry || !chat || !composerArea) return;

    if (screen.firstElementChild !== entry) screen.insertBefore(entry, screen.firstElementChild);
    if (entry.nextElementSibling !== chat) screen.insertBefore(chat, entry.nextElementSibling);
    if (screen.lastElementChild !== composerArea) screen.appendChild(composerArea);
  }

  document.addEventListener('click', (event) => {
    const back = event.target.closest('#back');
    if (back && firstAdvisorStep()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelector('.mode__button[data-mode="chat"]')?.click();
      requestAnimationFrame(() => {
        settleChatOrder();
        settleBack();
      });
      return;
    }

    if (event.target.closest('#entry,.mode__button,#open,#heroOpen,#teaserOpen,#reset')) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        settleChatOrder();
        settleBack();
      }));
    }
  }, true);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => {
      settleChatOrder();
      settleBack();
    });
  });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class','disabled','aria-hidden'] });

  settleChatOrder();
  settleBack();
  setTimeout(() => {
    settleChatOrder();
    settleBack();
  }, 500);
})();