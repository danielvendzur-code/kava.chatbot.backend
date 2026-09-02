(() => {
  'use strict';

  const DATA = window.JOLKA;
  if (!DATA?.demo || !Array.isArray(DATA.steps)) return;

  const byId = Object.fromEntries((DATA.products || []).map((product) => [product.id, product]));
  const advisor = document.querySelector('#advisor');
  const chat = document.querySelector('#chat');

  const now = () => new Intl.DateTimeFormat('sk-SK', {
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());

  function stampMessages() {
    if (!chat) return;
    chat.querySelectorAll('.bubble:not(.typing)').forEach((bubble) => {
      if (bubble.querySelector('.msg__time')) return;
      const time = document.createElement('small');
      time.className = 'msg__time';
      time.textContent = now();
      bubble.appendChild(time);
    });
  }

  function stabilizeAdvisorPhotos() {
    if (!advisor) return;
    const stepName = document.querySelector('#stepName')?.textContent?.trim();
    const step = DATA.steps.find((candidate) => candidate.name === stepName);
    if (!step) return;

    advisor.querySelectorAll('.option').forEach((button, index) => {
      const option = step.options[index];
      const img = button.querySelector('.option__visual img');
      if (!option || !img) return;
      const product = option.product ? byId[option.product] : null;
      const source = option.photo || product?.tile || product?.photo || DATA.demo.entryImage;
      if (source && img.getAttribute('src') !== source) img.setAttribute('src', source);
      img.loading = 'eager';
      img.decoding = 'async';
      img.style.transform = 'none';
      img.style.transition = 'none';
    });
  }

  const observer = new MutationObserver(() => {
    stampMessages();
    stabilizeAdvisorPhotos();
  });

  if (chat) observer.observe(chat, { childList: true, subtree: true });
  if (advisor) observer.observe(advisor, { childList: true, subtree: true });

  stampMessages();
  stabilizeAdvisorPhotos();
})();
