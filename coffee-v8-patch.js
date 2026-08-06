(() => {
  const launcher = document.querySelector('#launcher');
  const teaser = document.querySelector('#launcherTeaser');
  if (!launcher || !teaser) return;

  const strayClose = launcher.querySelector(':scope > #closeTeaser');
  const strayTitle = launcher.querySelector(':scope > b');
  const strayText = launcher.querySelector(':scope > span:not(.launcher__status)');

  teaser.innerHTML = '<b>Neviete, ktorú kávu vybrať?</b><span>Odpoviem na otázky alebo ju nájdeme cez krátky chuťový kvíz.</span>';
  strayClose?.remove();
  strayTitle?.remove();
  strayText?.remove();
})();
