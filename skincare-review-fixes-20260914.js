(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  if (slug !== 'cyprianus') return;

  const launcher = document.querySelector('#cx-open');
  if (!launcher) return;

  const buildEmblem = async () => {
    const response = await fetch('/assets/cosmetics/cyprianus-logo.svg', { cache: 'force-cache' });
    if (!response.ok) throw new Error('Cyprianus logo asset failed');
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const sourcePath = doc.querySelector('#Path_1');
    if (!sourcePath) throw new Error('Cyprianus emblem path missing');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 35 35');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('cx-cyprianus-emblem');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', sourcePath.getAttribute('d') || '');
    /* Path_1 sits inside translate(-892.598 -546) and itself has
       translate(890 547), so this is the exact combined transform. */
    path.setAttribute('transform', 'translate(-2.598 1)');
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    return svg;
  };

  const syncAvatars = (template) => {
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      avatar.replaceChildren(template.cloneNode(true));
    });
  };

  buildEmblem().then((emblem) => {
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark');
    launcher.classList.add('cx-launcher-has-image-logo');
    launcher.replaceChildren(emblem.cloneNode(true));
    syncAvatars(emblem);

    const root = document.querySelector('#cosmetics-root');
    if (root) {
      const observer = new MutationObserver(() => syncAvatars(emblem));
      observer.observe(root, { childList: true, subtree: true });
    }
  }).catch(() => {
    /* Keep the existing preview untouched rather than replacing it with text. */
  });
})();
