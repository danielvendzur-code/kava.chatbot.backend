(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const querySlug = params.get('demo') || location.hash.replace(/^#/, '');
  const parts = location.pathname.split('/').filter(Boolean);
  const pathSlug = parts.at(-1);
  const raw = querySlug || ((pathSlug && !['index.html', 'ukazka'].includes(pathSlug)) ? pathSlug : 'praziarnicka');
  const aliases = { 'kava-vitazov': 'vitazov', 'praziaren-jolka': 'jolka' };
  const slug = aliases[raw] || raw;
  const allowed = new Set(['praziarnicka','diamonds','kaffa','vitazov','concept','jolka']);
  const demo = allowed.has(slug) ? slug : 'praziarnicka';

  if (demo === 'jolka') {
    if (!location.pathname.endsWith('/jolka-final-v2.html')) location.replace('/jolka-final-v2.html');
    return;
  }

  const manifests = {
    praziarnicka: {
      title: 'Pražiarnička – návrh AI poradcu',
      theme: '#f7f6f0',
      styles: ['/praziarnicka-final.css'],
      scripts: ['/coffee-api-route.js','/coffee-local-api.js','/praziarnicka-final.js']
    },
    diamonds: {
      title: 'Diamonds Roastery – návrh AI poradcu',
      theme: '#0d0f0e',
      styles: ['/coffee-v8-diamonds-landing.css','/coffee-v8-diamonds-widget.css','/diamonds-director-final.css'],
      scripts: ['/coffee-api-route.js','/coffee-local-api.js','/coffee-configs.js','/diamonds-config.js','/diamonds-director.js','/coffee-v8-diamonds-foundation.js','/coffee-v8-diamonds-controller.js']
    },
    kaffa: {
      title: 'Kaffa Roastery – návrh AI poradcu',
      theme: '#f6f3ec',
      styles: ['/kaffa-editorial.css','/kaffa-widget.css','/kaffa-director.css','/kaffa-director-final.css'],
      scripts: ['/coffee-api-route.js','/coffee-local-api.js','/kaffa-data.js','/kaffa-editorial.js']
    },
    vitazov: {
      title: 'Káva Víťazov – návrh AI poradcu',
      theme: '#f7f9f2',
      styles: ['/coffee-v8.css'],
      scripts: ['/coffee-api-route.js','/coffee-local-api.js','/coffee-configs.js','/coffee-brand-overrides.js','/coffee-v8.js','/coffee-vitazov-brand.js']
    },
    concept: {
      title: 'Concept Coffee Roasters – návrh AI poradcu',
      theme: '#f6f2e8',
      styles: ['/concept-seasonal-foundation.css','/concept-seasonal-widget.css','/concept-seasonal-advisor.css','/concept-seasonal-responsive.css','/concept-director-final.css'],
      scripts: ['/coffee-api-route.js','/coffee-local-api.js','/concept-seasonal-config.js','/concept-seasonal-core.js','/concept-seasonal-shell.js','/concept-seasonal-shared.js','/concept-seasonal-score.js','/concept-seasonal-advisor-flow.js','/concept-seasonal-advisor-result.js','/concept-seasonal-advisor-completion.js','/concept-seasonal-chat.js','/concept-seasonal-init.js']
    }
  };

  window.COFFEE_DEMO_SLUG = demo;
  const manifest = manifests[demo];
  document.title = manifest.title;
  document.querySelector('meta[name="theme-color"]').content = manifest.theme;

  const loadStyle = (href) => new Promise((resolve, reject) => {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.onload = resolve; link.onerror = reject; document.head.appendChild(link);
  });
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = src; script.async = false; script.onload = resolve; script.onerror = reject; document.body.appendChild(script);
  });

  Promise.all(manifest.styles.map(loadStyle))
    .then(() => manifest.scripts.reduce((chain, src) => chain.then(() => loadScript(src)), Promise.resolve()))
    .catch((error) => {
      console.error('Coffee demo load failed', demo, error);
      document.body.innerHTML = '<main style="padding:32px;font:16px system-ui">Ukážku sa nepodarilo načítať.</main>';
    });
})();