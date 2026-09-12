(() => {
  const params = new URLSearchParams(location.search);
  const raw = Number(params.get('v') || 1);
  const v = Math.min(5, Math.max(1, Number.isFinite(raw) ? raw : 1));
  const proposal = document.getElementById('proposal');
  proposal.classList.add(`layout-${v}`);
  document.querySelectorAll('.proposal-switcher a').forEach((a) => {
    if (Number(a.dataset.v) === v) a.classList.add('active');
  });

  const drawer = document.getElementById('chatDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openChat = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  };
  const closeChat = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  };
  document.querySelectorAll('[data-chat]').forEach((el) => el.addEventListener('click', openChat));
  document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeChat));

  const dialog = document.getElementById('interestDialog');
  document.querySelectorAll('[data-interest]').forEach((el) => el.addEventListener('click', () => dialog.showModal()));
  document.querySelectorAll('[data-interest-close]').forEach((el) => el.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const r = dialog.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) dialog.close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeChat();
    if (dialog.open) dialog.close();
  });
})();
