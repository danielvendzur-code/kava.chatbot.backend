(() => {
  'use strict';

  const root = document.querySelector('#coffee-demo-root');
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPath = pathParts.at(-1) || 'concept';
  const slug = lastPath === 'index.html' || lastPath === 'ukazka' ? 'concept' : lastPath;

  const addStyle = (href) => new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Nenačítal sa štýl ${href}`));
    document.head.appendChild(link);
  });

  const addScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Nenačítal sa skript ${src}`));
    document.body.appendChild(script);
  });

  async function bootConcept() {
    document.documentElement.dataset.coffeeDemo = 'concept';
    await addStyle('/concept-seasonal-foundation.css?v=c304a63a');
    await addStyle('/concept-seasonal-widget.css?v=abcd59f3');
    await addStyle('/concept-seasonal-advisor.css?v=3b69383c');
    await addStyle('/concept-seasonal-responsive.css?v=3604a807');
    await addStyle('/concept-jolka-scale.css?v=d41c8676');
    await addStyle('/coffee-premium-v2.css?v=3bb684bb');
    await addStyle('/concept-final.css?v=e940b200');
    await addScript('/concept-seasonal-config.js?v=6c431227');
    for (const src of [
      '/concept-seasonal-core.js?v=2e489527',
      '/concept-seasonal-shell.js?v=b77765a8',
      '/concept-seasonal-shared.js?v=20fea82e',
      '/concept-seasonal-score.js?v=554efbd7',
      '/concept-seasonal-advisor-flow.js?v=b4128c25',
      '/concept-seasonal-advisor-result.js?v=a6a65cf7',
      '/concept-seasonal-advisor-completion.js?v=c540ac42',
      '/concept-seasonal-chat.js?v=6495444f',
      '/concept-seasonal-init.js?v=a5152016'
    ]) await addScript(src);
  }

  async function bootLegacy() {
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap';
    document.head.appendChild(fonts);
    await Promise.all([addStyle('/coffee-v8.css?v=795138f1'), addStyle('/coffee-v8-refine.css')]);
    await addStyle('/coffee-premium-v2.css?v=3bb684bb');
    await addScript('/coffee-configs.js?v=7e1d14e5');
    await addScript('/coffee-brand-overrides.js?v=571b43e6');
    await addScript('/coffee-v8.js?v=5ad102d3');
    await addScript('/coffee-v8-patch.js');
    await addScript('/coffee-premium-v2.js?v=d2020d02');
  }

  (slug === 'concept' ? bootConcept() : bootLegacy()).catch((error) => {
    console.error(error);
    if (root) {
      root.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font:600 16px/1.5 system-ui;color:#191a18;background:#f3f0e8;text-align:center">Ukážku sa nepodarilo načítať. Obnovte stránku alebo ju skúste neskôr.</main>';
    }
  });
})();
