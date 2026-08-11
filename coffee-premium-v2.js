(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const choiceSelector = '.option[data-value],.answer-card[data-answer],.kf-option[data-value],.pz-option[data-value]';
  const chipContainers = '.chips,.quick-grid,.kf-chips,.pz-chips,.quick-questions';
  const time = () => new Intl.DateTimeFormat('sk-SK', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  const project = () => {
    if ($('.concept-page')) return 'concept';
    if ($('.demo-page')) return 'vitazov';
    if ($('.diamonds-page')) return 'diamonds';
    if ($('.kf-shell')) return 'kaffa';
    if ($('.pz-page,.pz-site')) return 'praziarnicka';
    if ($('.landing[aria-label*="Jolka"]')) return 'jolka';
    return '';
  };

  function iconFor(label, index) {
    const value = label.toLocaleLowerCase('sk');
    if (/bez|večer|kofe/.test(value)) return '🌙';
    if (/mlie|capp|latte/.test(value)) return '🥛';
    if (/filter|ovoc|nov|limit|vietnam/.test(value)) return '🌿';
    if (/automat|office|kancel/.test(value)) return '⚙️';
    return ['☕', '🌿', '🥛', '🌙'][index % 4];
  }

  function setLabel(element, label) {
    if (!element || element.dataset.mcLabel === label) return;
    const svg = element.querySelector(':scope > svg')?.cloneNode(true);
    element.textContent = label;
    if (svg) element.append(' ', svg);
    element.dataset.mcLabel = label;
  }

  function simplifyLanding() {
    const main = $('.concept-page,.demo-page,.diamonds-page,.kf-shell,.pz-page,.pz-site,.landing');
    if (!main || main.dataset.mcSimple) return;
    main.dataset.mcSimple = 'true';

    const copy = {
      concept: ['Káva, ktorá vám sadne.', 'Odpovedzte na štyri krátke otázky a vyberieme kávu podľa vašej chuti.'],
      vitazov: ['Káva, ktorú si obľúbite.', 'Štyri krátke odpovede stačia na konkrétne odporúčanie.'],
      diamonds: ['Káva, ktorá vám sadne.', 'Vyberte prípravu a chuť. O zvyšok sa postaráme.'],
      kaffa: ['Káva, ktorá vám sadne.', 'Povedzte nám, ako ju pripravujete a čo vám chutí.'],
      praziarnicka: ['Káva, na ktorú sa tešíte.', 'Krátky výber vás privedie ku káve podľa vašej chuti.'],
      jolka: ['Nájdite kávu, na ktorú sa budete tešiť.', 'Od klasiky po ovocný filter. Vyberieme kávu, ktorá vám sadne.']
    }[project()];

    if (copy) {
      const heading = $('h1', main);
      const lead = $('.hero-intro,.demo-copy>p,.owner-copy>p,.kf-lead,.pz-hero-copy>p,.hero__copy>p', main);
      if (heading) heading.textContent = copy[0];
      if (lead) lead.textContent = copy[1];
    }

    const primary = $('#heroOpen,#openAdvisor,.pz-primary,.primary-cta', main);
    setLabel(primary, 'Nájsť svoju kávu');

    $$('.advisor-entry b,.kf-advisor-entry b,.pz-advisor-cta b,.chat-advisor-cta b').forEach((label) => {
      label.textContent = 'Nájsť svoju kávu';
    });

    const footer = $('footer', main) || document.createElement('footer');
    footer.classList.add('mc-site-footer');
    footer.innerHTML = '<a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ↗</a>';
    if (!footer.parentElement) main.appendChild(footer);
  }

  function removeOnlineLabels() {
    $$('.widget-brand__copy small,.widget-brand__status,#widgetDescription,.kf-widget-brand__copy small,.pz-widget-brand small,.owner-context,.kf-head-note,.owner-preview__header>span').forEach((status) => {
      [...status.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && /online|poradca/i.test(node.textContent || '')) node.textContent = '';
      });
      status.setAttribute('aria-label', 'Poradca je dostupný');
    });

    $$('.message--fallback small').forEach((label) => { label.textContent = time(); });
    $$('.mode__button[data-mode="chat"] b,.mode-switch button[data-mode="chat"] b,.pz-mode-btn[data-mode="chat"] b').forEach((label) => { label.textContent = 'Chat'; });
    $$('.mode__button[data-mode="advisor"] b,.mode-switch button[data-mode="advisor"] b,.pz-mode-btn[data-mode="advisor"] b').forEach((label) => { label.textContent = 'Výber kávy'; });
  }

  function decorateChips() {
    $$(chipContainers).forEach((container) => {
      $$('button', container).forEach((button, index) => {
        button.classList.add('mc-chip');
        button.removeAttribute('data-mc-icon');
      });
    });
  }

  function decorateOptions() {
    $$('.options,.answers,.kf-options,.pz-options').forEach((container) => {
      const first = $(choiceSelector, container);
      if (first && !$('.mc-top', first)) first.insertAdjacentHTML('beforeend', '<span class="mc-top">TOP</span>');
    });
  }

  function messageTimestamp(row) {
    if (!row || row.dataset.mcTime || row.querySelector('.timestamp,.time,.mc-timestamp') || row.matches('#typingRow') || row.querySelector('.typing')) return;
    const bubble = row.matches('.kf-message.user,.pz-bubble-user') ? row : $('.chat-bubble,.kf-message,.pz-bubble,.message__bubble,.bubble', row);
    if (!bubble) return;

    const stack = document.createElement('div');
    const user = row.matches('.message--user,.chat-line--user,.kf-message.user,.pz-bubble-user') || bubble.matches('.user,.pz-bubble-user');
    stack.className = `mc-message-stack${user ? ' mc-message-stack--user' : ''}`;
    bubble.parentNode.insertBefore(stack, bubble);
    stack.appendChild(bubble);
    const stamp = document.createElement('time');
    stamp.className = 'mc-timestamp';
    stamp.dateTime = new Date().toISOString();
    stamp.textContent = time();
    stack.appendChild(stamp);
    row.dataset.mcTime = 'true';
  }

  function decorateMessages() {
    $$('.chat-line,.kf-message-row,.kf-message.user,.pz-message-row,.pz-bubble-user,.message').forEach(messageTimestamp);

    if (project() === 'vitazov') {
      $$('.message__avatar').forEach((avatar) => {
        if (avatar.dataset.mcLogo) return;
        avatar.innerHTML = '<span class="mc-vitazov-chat" aria-hidden="true">Victory</span>';
        avatar.dataset.mcLogo = 'true';
      });
    }

    if (project() === 'kaffa') {
      $$('.kf-bot-avatar,.kf-advisor-entry__mark').forEach((avatar) => {
        avatar.classList.add('mc-kaffa-avatar');
      });
    }
  }

  function promoteCheckout() {
    $$('.result-button--primary,.result-cta,.kf-result-cta,.pz-product-cta,.result-actions__primary').forEach((button) => setLabel(button, '🛒 Do košíka'));

    $$('.result-actions').forEach((actions) => {
      if (actions.dataset.mcMoved) return;
      const card = actions.closest('.result-card');
      const anchor = card && $('.result-photo,.result-main,.result-product', card);
      if (anchor) {
        anchor.insertAdjacentElement('afterend', actions);
        actions.dataset.mcMoved = 'true';
      }
    });

    $$('.kf-result-cta,.pz-product-cta').forEach((cta) => {
      if (cta.dataset.mcMoved) return;
      const result = cta.closest('.kf-result,.pz-result-scroll');
      const anchor = result && $('.kf-result-hero,.pz-result-hero', result);
      if (anchor) {
        anchor.insertAdjacentElement('afterend', cta);
        cta.dataset.mcMoved = 'true';
      }
    });
  }

  function enhance() {
    simplifyLanding();
    removeOnlineLabels();
    decorateChips();
    decorateOptions();
    decorateMessages();
    promoteCheckout();
  }

  let lastChoiceClick = 0;
  let lastChoiceTarget = null;
  document.addEventListener('click', (event) => {
    const target = event.target.closest(choiceSelector);
    if (!target) return;
    const now = performance.now();
    if (target === lastChoiceTarget && now - lastChoiceClick < 650) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    lastChoiceTarget = target;
    lastChoiceClick = now;
  }, true);

  let frame = 0;
  const observer = new MutationObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(enhance);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once: true });
  else enhance();
})();
