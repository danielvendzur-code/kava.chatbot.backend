(() => {
  'use strict';

  if (document.body?.dataset?.cosmeticsDemo !== 'kvitok') return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914f';
  const launcher = document.querySelector('#cx-open');
  if (!launcher) return;

  /* Final fail-safe: use the real repository asset directly.
     Do not process, recolour or generate a substitute mark. */
  const mark = document.createElement('img');
  mark.src = src;
  mark.alt = 'Kvitok';
  mark.className = 'cx-kvitok-direct-mark';
  mark.decoding = 'async';

  launcher.classList.remove(
    'is-image-logo',
    'cx-launcher-has-wordmark',
    'cx-kvitok-processing',
    'cx-kvitok-logo-ready'
  );
  launcher.classList.add('cx-launcher-has-image-logo');
  launcher.replaceChildren(mark);

  /* Existing assistant messages are also normalized to the real logo.
     Future messages already receive the same asset from the preload config. */
  document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Kvitok';
    img.className = 'cx-kvitok-message-mark';
    img.decoding = 'async';
    avatar.replaceChildren(img);
  });
})();
