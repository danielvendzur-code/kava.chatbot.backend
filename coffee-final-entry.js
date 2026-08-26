(() => {
  'use strict';

  const VALID = new Set(['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka']);
  const params = new URLSearchParams(location.search);
  const parts = location.pathname.split('/').filter(Boolean);
  const pathSlug = parts.at(-1);
  const hostnameSlug = location.hostname.toLowerCase().endsWith('.mojchatbot.sk')
    ? location.hostname.toLowerCase().split('.')[0]
    : '';
  const requested = params.get('demo') || (VALID.has(hostnameSlug) ? hostnameSlug : '') || location.hash.replace(/^#/, '') || pathSlug;
  const normalized = requested === 'index.html' || requested === 'ukazka' || !requested ? 'praziarnicka' : requested;
  const slug = VALID.has(normalized) ? normalized : 'praziarnicka';

  if (slug === 'jolka') {
    if (location.pathname !== '/jolka.html') location.replace('/jolka.html');
    return;
  }

  window.COFFEE_DEMO_SLUG = slug;
  window.__COFFEE_DEMO_SLUG__ = slug === 'praziarnicka' ? 'praziarnicka-v13' : slug;
  window.__KAFFA_EDITORIAL__ = slug === 'kaffa';
  document.documentElement.dataset.coffeeDemo = slug;
  document.body.dataset.demo = slug === 'praziarnicka' ? 'praziarnicka-v13' : slug;

  const meta = {
    praziarnicka: ['Pražiarnička – kávový poradca', 'Ukážka predajného poradcu pre jednoduchší výber kávy Pražiarnička.', '#123f35', '/brand/praziarnicka-icon-official.svg'],
    diamonds: ['Diamonds Roastery – kávový poradca', 'Jednoduchý výber kávy Diamonds Roastery podľa chuti a prípravy.', '#0d0f0e', 'data:,'],
    kaffa: ['Kaffa Roastery – nájdite svoju kávu', 'Nájdite kávu Kaffa podľa svojej chuti a spôsobu prípravy.', '#f6f3ec', 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23111111%22/%3E%3Ctext x=%2232%22 y=%2241%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22Georgia%22 font-size=%2228%22%3EK%3C/text%3E%3C/svg%3E'],
    vitazov: ['Káva Víťazov – kávový poradca', 'Jednoduchý výber kávy domov, do kancelárie aj do automatu.', '#123f35', 'data:,'],
    concept: ['Concept Coffee Roasters – kávový poradca', 'Jednoduchý výber kávy Concept Coffee Roasters podľa chuti a prípravy.', '#f4f1e9', 'data:,']
  }[slug];

  document.title = meta[0];
  document.querySelector('#pageDescription').content = meta[1];
  document.querySelector('#themeColor').content = meta[2];
  document.querySelector('#pageIcon').href = meta[3];

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
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Nenačítal sa skript ${src}`));
    document.body.appendChild(script);
  });

  const loadAll = async (items, loader) => {
    for (const item of items) await loader(item);
  };

  const commonScripts = ['/coffee-api-route.js', '/coffee-local-api.js'];
  const manifests = {
    praziarnicka: {
      styles: ['/praziarnicka-v13.css'],
      scripts: ['/praziarnicka-v13.js']
    },
    concept: {
      styles: [
        '/concept-seasonal-foundation.css',
        '/concept-seasonal-widget.css',
        '/concept-seasonal-advisor.css',
        '/concept-seasonal-responsive.css',
        '/concept-jolka-scale.css',
        '/coffee-premium-v2.css',
        '/concept-final.css'
      ],
      scripts: [
        '/concept-seasonal-config.js',
        '/concept-seasonal-core.js',
        '/concept-seasonal-shell.js',
        '/concept-seasonal-shared.js',
        '/concept-seasonal-score.js',
        '/concept-seasonal-advisor-flow.js',
        '/concept-seasonal-advisor-result.js',
        '/concept-seasonal-advisor-completion.js',
        '/concept-seasonal-chat.js',
        '/concept-seasonal-init.js'
      ]
    },
    kaffa: {
      styles: [
        '/kaffa-editorial.css',
        '/kaffa-widget.css',
        '/kaffa-jolka-scale.css',
        '/coffee-premium-v2.css',
        '/kaffa-final.css'
      ],
      scripts: ['/kaffa-data.js', '/kaffa-editorial.js', '/coffee-premium-v2.js', '/kaffa-final.js']
    },
    vitazov: {
      styles: ['/coffee-v8.css', '/coffee-premium-v2.css', '/coffee-vitazov-final.css'],
      scripts: [
        '/coffee-configs.js',
        '/coffee-brand-overrides.js',
        '/coffee-vitazov-overrides.js',
        '/coffee-v8.js',
        '/coffee-vitazov-brand.js',
        '/coffee-vitazov-final.js'
      ]
    },
    diamonds: {
      styles: [
        '/coffee-v8-diamonds-landing.css',
        '/coffee-v8-diamonds-widget.css',
        '/coffee-v8-diamonds-jolka.css',
        '/coffee-premium-v2.css',
        '/coffee-diamonds-final.css'
      ],
      scripts: [
        '/coffee-configs.js',
        '/coffee-brand-overrides.js',
        '/diamonds-director.js',
        '/coffee-v8-diamonds-foundation.js',
        '/coffee-v8-diamonds-controller.js',
        '/coffee-diamonds-final.js'
      ]
    }
  };

  const finalScripts = ['/coffee-owner-page.js', '/coffee-widget-final.js'];

  const boot = async () => {
    const manifest = manifests[slug];
    await loadAll(manifest.styles, addStyle);
    await loadAll(commonScripts, addScript);
    await loadAll(manifest.scripts, addScript);
    if (slug !== 'praziarnicka') await loadAll(finalScripts, addScript);
    await addScript('/coffee-usability-release.js');
    await addStyle('/coffee-review-pass.css');
    await addStyle('/coffee-review-corrections.css');
    await addScript('/coffee-review-pass.js');
    await addStyle('/coffee-final-tune.css');
    await addStyle('/coffee-final-qa.css');
    await addScript('/coffee-final-tune.js');
  };

  boot().catch((error) => {
    console.error('Coffee demo failed to load', error);
    document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font:600 16px/1.5 system-ui;color:#191a18;background:#f7f6f2;text-align:center">Ukážku sa nepodarilo načítať. Obnovte stránku alebo ju skúste neskôr.</main>';
  });
})();
