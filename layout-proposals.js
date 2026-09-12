(() => {
  const proposal = document.getElementById('proposal');
  proposal.classList.remove('layout-2','layout-3','layout-4','layout-5');
  proposal.classList.add('layout-1');

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
