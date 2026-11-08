/* Séria 3 (447 € + 10 €/mes.): jedna adresa = jedna firma. Rozloženie, widget, typografia, karty a animácie
   sú zo schválenej ukážky Andreine (cosmetics.html + jej vrstvy); mení sa iba obsah, otázky, fotky, farby a logo.
   Káva: c2 jadro (n447/c2) v paneli Andreine (full-coffee-advisor.js). Kozmetika: katalóg v natívnom poradcovi Andreine. */
(async () => {
  const V = 's4-20261108-2';
  const REG = (window.S3_REG && window.S3_REG.demos) || {};
  const COFFEE = Object.keys(REG).filter((k) => REG[k].type === 'coffee');
  const COSMETICS = Object.fromEntries(Object.keys(REG).filter((k) => REG[k].type === 'cosmetics').map((k) => [k, '/catalogues/' + k + '.js']));
  const root = document.getElementById('cosmetics-root');
  if (root) { root.inert = true; root.setAttribute('aria-busy', 'true'); }
  const host = location.hostname.endsWith('.mojchatbot.sk') ? location.hostname.split('.')[0] : (location.hostname.match(/^([a-z0-9]+)-mojchatbot\.vercel\.app$/) || [])[1] || '';
  const slug = host || new URLSearchParams(location.search).get('demo') || '';
  const coffee = COFFEE.includes(slug);
  if (!coffee && !COSMETICS[slug]) throw Error('Unknown demo');
  const url = (file) => { const u = new URL(file, location.origin); u.searchParams.set('v', V); return u.pathname + u.search; };
  const load = (file) => new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = url(file); s.onload = resolve; s.onerror = reject; document.body.append(s); });
  const data = window.COSMETICS_DEMOS;
  /* Iba táto firma: iná adresa ani ?demo= nezobrazí cudziu ukážku. */
  for (const k of Object.keys(data.brands)) delete data.brands[k];
  if (coffee) {
    const compactStyle = document.createElement('link'); compactStyle.rel = 'stylesheet'; compactStyle.href = url('/n447/s3/compact-result.css'); document.head.append(compactStyle);
    for (const f of ['/n447/c2/engine-c2.js', '/n447/c2/reply-c2.js', '/n447/c2/data/' + slug + '.js']) await load(f);
  } else {
    await import(url(COSMETICS[slug]));
    if (REG[slug].segment === 'tea') await load('/n447/s3/tea-reply.js');
  }
  await load('/s3-brands.js');
  const shell = ['cosmetics.js', 'skincare-final-fix.js', 'skincare-launcher-logo-fix.js', 'skincare-routine-enhancer.js', 'kvitok-logo-final-fix.js', 'skincare-final-brand-marks.js', 'skincare-review-fixes-20260914.js', 'nove-znacky.js', 'ukazky-final.js'];
  const files = coffee
    ? [...shell, 'full-coffee-advisor.js', 'skincare-final-logo-qa.js', 'lang-cs.js', 'n447/s3/plus-chat.js', 'n447/s3/compare-chat.js']
    : ['held-reply.js', 'catalogue-config.js', ...shell, 'advisor-core.js', 'catalogue-reply-core.js', 'chat-brain.js', 'chat-adapters.js', 'care-result-guide.js', 'catalogue-advisor.js', 'skincare-final-logo-qa.js', 'lang-cs.js', 'n447/s3/plus-chat.js', ...(REG[slug].series === 's4' ? ['n447/s4/compare-native.js'] : [])];
  for (const f of files) await load('/' + f);
})().catch(() => { const r = document.querySelector('#cosmetics-root'); if (r && !r.textContent.trim()) r.textContent = 'Ukážka sa nenašla alebo sa nepodarilo načítať. Obnovte stránku.'; })
  .finally(() => { const r = document.getElementById('cosmetics-root'); if (r) { r.inert = false; r.removeAttribute('aria-busy'); } });
