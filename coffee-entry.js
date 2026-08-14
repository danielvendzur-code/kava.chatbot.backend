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
    await addStyle('/concept-seasonal-foundation.css');
    await addStyle('/concept-seasonal-widget.css');
    await addStyle('/concept-seasonal-advisor.css');
    await addStyle('/concept-seasonal-responsive.css');
    await addStyle('/concept-jolka-scale.css');
    await addStyle('/coffee-premium-v2.css');
    await addStyle('/concept-final.css');
    await addScript('/concept-seasonal-config.js');
    for (const src of [
      '/concept-seasonal-core.js',
      '/concept-seasonal-shell.js',
      '/concept-seasonal-shared.js',
      '/concept-seasonal-score.js',
      '/concept-seasonal-advisor-flow.js',
      '/concept-seasonal-advisor-result.js',
      '/concept-seasonal-advisor-completion.js',
      '/concept-seasonal-chat.js',
      '/concept-seasonal-init.js'
    ]) await addScript(src);
  }

  async function bootLegacy() {
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap';
    document.head.appendChild(fonts);
    await Promise.all([addStyle('/coffee-v8.css'), addStyle('/coffee-v8-refine.css')]);
    await addStyle('/coffee-premium-v2.css');
    await addScript('/coffee-configs.js');
    await addScript('/coffee-brand-overrides.js');
    await addScript('/coffee-v8.js');
    await addScript('/coffee-v8-patch.js');
    await addScript('/coffee-premium-v2.js');
  }

  (slug === 'concept' ? bootConcept() : bootLegacy()).catch((error) => {
    console.error(error);
    if (root) {
      root.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font:600 16px/1.5 system-ui;color:#191a18;background:#f3f0e8;text-align:center">Ukážku sa nepodarilo načítať. Obnovte stránku alebo ju skúste neskôr.</main>';
    }
  });
})();
