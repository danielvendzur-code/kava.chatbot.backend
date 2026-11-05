/* séria 3: kópia vino-plus/plus/plus-chat.js, odkazy otvára v rovnakej karte.
   PLUS chat (podľa Langr): karty produktov v odpovedi, tri bodky počas čakania, postupné vypísanie a jemný príchod správy.
   Doplnok k existujúcemu chatu – jeho logiku ani odpovede nemení, iba zobrazenie hotovej bubliny.
   Kozmetika (cosmetics-k2.js): .cx-message--assistant .cx-bubble, katalóg COSMETICS_DEMOS.brands[slug].catalogue.
   Káva (coffee-jolka-app-c2.js): #chat-log .msg .bubble, katalóg N447_DATA[slug].products. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const cs = () => (doc.lang || '').toLowerCase().startsWith('cs');
  const esc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const norm = (u) => String(u || '').replace(/&amp;/g, '&').replace(/[.,;:)]+$/, '').replace(/\/$/, '').toLowerCase();
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /* --- znak značky (kozmetika) --- */
  /* znaky sú uložené pri tomto skripte (rovnaký priečinok), nie na stránke firmy */
  const BASE = new URL('.', document.currentScript?.src || location.href).href;
  const MARKS = {tarani: {mark: '/assets/s3/tarani/logo.png'}, musk: {mark: BASE + 'marks/musk-mark.svg'}, malinna: {mark: BASE + 'marks/malinna-mark.png'}, bohemikus: {mark: BASE + 'marks/bohemikus-mark.png', avatar: BASE + 'marks/bohemikus-flower.png'}};
  const cosmeticSlug = String(window.N447_COSMETICS_SLUG || '');
  /* séria 3 (Andreine): kruh správy biely s logom firmy vo farbách – logo je vždy viditeľné, aj tmavé (problém Plenéra). */
  const s3 = window.CX_S3_MARK;
  if (s3 && s3.avatar) {
    doc.style.setProperty('--plus-avatar', `url("${s3.avatar}")`);
    doc.dataset.plusAvatar = 'light';
    if (s3.cover) doc.dataset.plusAvatarFit = 'cover';
  } else if (MARKS[cosmeticSlug]) {
    const m = MARKS[cosmeticSlug];
    doc.style.setProperty('--plus-mark', `url("${m.mark}")`);
    doc.style.setProperty('--plus-avatar', `url("${m.avatar || m.mark}")`);
    doc.dataset.plusAvatar = m.avatar ? 'light' : 'mark';
    /* bublina v rohu: MusK a MALINNA° majú ikonu chatu (ostáva), Bohemikus mal nečitateľné celé logo → znak */
    if (m.avatar) doc.dataset.plusLauncher = 'mark';
  }

  /* --- katalóg --- */
  let byUrl = null, shopHost = '';
  function catalogue() {
    if (byUrl && byUrl.size) return byUrl;
    byUrl = new Map();
    let list = [];
    if (cosmeticSlug) list = window.COSMETICS_DEMOS?.brands?.[cosmeticSlug]?.catalogue || window.CX_CATALOGUES?.[cosmeticSlug]?.products || [];
    else {
      const slug = String(window.COFFEE_DEMO_SLUG || '');
      const d = window.N447_DATA?.[slug];
      const money = window.N447Engine?.money;
      list = (d?.products || []).map((p) => ({...p, price: p.price || (p.priceFrom != null ? (cs() ? 'od ' : 'od ') + (money ? money(p.priceFrom, p.currency) : p.priceFrom) : ''), coffee: true}));
    }
    for (const p of list) if (p && p.url && p.available !== false) byUrl.set(norm(p.url), p);
    try { shopHost = new URL(list.find((p) => p.url)?.url || '').hostname.replace(/^www\./, ''); } catch (_) { shopHost = ''; }
    return byUrl;
  }

  /* --- text bubliny späť na riadky s adresami (odkaz „Pozrieť v e-shope“ → jeho adresa) --- */
  function plainLines(bubble) {
    const box = document.createElement('div');
    box.innerHTML = bubble.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    box.querySelectorAll('a[href]').forEach((a) => a.replaceWith(document.createTextNode(' ' + a.getAttribute('href') + ' ')));
    box.querySelectorAll('b,strong').forEach((b) => b.replaceWith(document.createTextNode(b.textContent)));
    return box.textContent.replace(/[ \t]+\n/g, '\n').split('\n');
  }

  function parts(lines) {
    const map = catalogue(), out = [], seen = new Set();
    if (!map.size) return null;
    for (const line of lines) {
      const urls = line.match(/https?:\/\/[^\s<>]+/g) || [];
      const hits = urls.map((u) => map.get(norm(u))).filter((p) => p && !seen.has(p.id || p.url));
      if (!hits.length) { out.push({text: line}); continue; }
      let rest = line;
      for (const u of urls) rest = rest.split(u).join('');
      for (const p of hits) { seen.add(p.id || p.url); rest = rest.split(p.name).join(''); if (p.price) rest = rest.split(p.price).join(''); }
      rest = rest.replace(/\*\*/g, '').replace(/\([^)]*\)?/g, '').replace(/\s*[—–-]\s*\./g, '.').replace(/^\s*(\d+[.)]|[*•])\s*/, '').replace(/^[\s\-–—•:,.()·]+/, '').replace(/[\s:–—-]+$/, '').replace(/\s{2,}/g, ' ').trim();
      /* káva bez AI: „názov — gramáž za cenu“ na riadku nad adresou → presná cena karty */
      let header = '';
      if (hits.length === 1 && !rest) {
        const prev = out[out.length - 1], name = hits[0].name.toLowerCase();
        if (prev && prev.text !== undefined && prev.text.trim().toLowerCase().startsWith(name)) { header = prev.text.trim().slice(name.length).replace(/^[\s—–-]+/, '').trim(); out.pop(); }
      }
      if (rest) rest = rest.charAt(0).toLocaleUpperCase() + rest.slice(1);
      hits.forEach((p, i) => out.push({product: p, header: i === 0 ? header : '', note: i === 0 && hits.length === 1 && rest.length >= 40 && !/€|Kč/.test(rest) ? rest : ''}));
    }
    for (let i = 0; i < out.length - 1; i++) {
      const a = out[i], b = out[i + 1];
      if (a.product && !a.note && b.text !== undefined && /^\((V chuti|Chuť)/i.test(b.text.trim())) { a.note = b.text.trim().replace(/^\(|\)$/g, ''); out.splice(i + 1, 1); }
    }
    if (!out.some((x) => x.product)) return null;
    while (out.length && out[out.length - 1].text !== undefined && !out[out.length - 1].text.trim()) out.pop();
    while (out.length && out[0].text !== undefined && !out[0].text.trim()) out.shift();
    return out;
  }

  const linkText = (t) => esc(t).replace(/https?:\/\/[^\s<>]+/g, (raw) => {
    const url = raw.replace(/[.,;:)]+$/, ''), tail = raw.slice(url.length);
    let host = ''; try { host = new URL(url.replace(/&amp;/g, '&')).hostname.replace(/^www\./, ''); } catch (_) {}
    return shopHost && host && host.endsWith(shopHost.split('.').slice(-2).join('.')) ? `<a href="${url}">${cs() ? 'Více informací ↗' : 'Viac informácií ↗'}</a>${tail}` : raw;
  }).replace(/\n/g, '<br>');

  function card(p, note, header, i) {
    const meta = p.coffee
      ? [p.origin, /chuti|chuť/i.test(note || '') ? '' : (p.notes || []).slice(0, 3).join(', ')].filter(Boolean).join(' · ')
      : [p.kind, [p.volume, p.variantLabel].filter((v, k, all) => v && all.indexOf(v) === k).join(' · ')].filter(Boolean).join(' · ');
    const price = header || p.price || '';
    return `<a class="lg-wine-card" style="--lg-i:${i}" href="${esc(p.url)}"><span class="lg-wine-photo"><img src="${esc(p.photo || '')}" alt="" loading="eager" decoding="async" onerror="${p.coffee ? "this.onerror=null;this.src='/assets/scenes/coffee-beans.jpg'" : "this.parentNode.setAttribute('data-image-failed','true')"}"></span><span class="lg-wine-copy"><b>${esc(p.name)}</b>${meta ? `<small>${esc(meta)}</small>` : ''}${note ? `<em>${esc(note)}</em>` : ''}<span class="lg-wine-foot"><strong${header ? ' class="is-offer"' : ''}>${esc(price)}</strong><span class="lg-wine-go">${cs() ? 'Zobrazit ↗' : 'Zobraziť ↗'}</span></span></span></a>`;
  }

  function render(list) {
    let html = '', run = [], n = 0, buf = [];
    const flushT = () => { const t = buf.join('\n').replace(/^\n+|\n+$/g, ''); if (t.trim()) html += `<span class="lg-text">${linkText(t)}</span>`; buf = []; };
    const flushC = () => { if (run.length) html += `<span class="lg-wine-list">${run.join('')}</span>`; run = []; };
    for (const x of list) { if (x.product) { flushT(); run.push(card(x.product, x.note, x.header, n++)); } else { flushC(); buf.push(x.text); } }
    flushT(); flushC();
    return html;
  }

  const PENDING = /^(Overujem odpoveď v ponuke…|Ověřuji odpověď v nabídce…)$/;
  const TYPING = () => `<span class="lg-typing" role="status" aria-label="${cs() ? 'Poradce píše' : 'Poradca píše'}"><i></i><i></i><i></i></span>`;

  /* postupné vypísanie prvého textu bubliny (asi 0,9 s), karty sa potom vysunú */
  function reveal(bubble) {
    const lead = bubble.querySelector('.lg-text') || (bubble.children.length ? null : bubble);
    if (!lead || reduced()) return;
    const full = lead.innerHTML;
    if (/<a\s/i.test(full)) return;
    const text = lead.textContent;
    if (text.length < 2) return;
    const rest = [...bubble.children].filter((c) => c !== lead);
    rest.forEach((c) => { c.style.visibility = 'hidden'; });
    const step = Math.max(2, Math.ceil(text.length / 45));
    let shown = 0;
    lead.textContent = '';
    const tick = () => {
      if (!bubble.isConnected) return;
      shown = Math.min(text.length, shown + step);
      lead.textContent = text.slice(0, shown);
      const box = bubble.closest('#cx-messages, #chat'); if (box) box.scrollTop = box.scrollHeight;
      if (shown < text.length) setTimeout(tick, 20);
      else { lead.innerHTML = full; rest.forEach((c) => { c.style.visibility = ''; }); if (box) box.scrollTop = box.scrollHeight; }
    };
    setTimeout(tick, 20);
  }

  const seen = new WeakSet();
  let lastCount = 0, pendingActive = false;
  function enhance(bubble, fresh) {
    if (bubble.dataset.plusDone === bubble.innerHTML.length + ':' + bubble.textContent.slice(0, 40)) return;
    const text = bubble.textContent.trim();
    if (PENDING.test(text)) { bubble.innerHTML = TYPING(); bubble.dataset.plusDone = bubble.innerHTML.length + ':' + bubble.textContent.slice(0, 40); return; }
    if (bubble.classList.contains('typing') || bubble.querySelector('.lg-typing, .lg-wine-card')) return;
    const list = parts(plainLines(bubble));
    const row = bubble.closest('.cx-message, .msg');
    if (list) { bubble.innerHTML = render(list); row?.classList.add('lg-has-wines'); }
    bubble.dataset.plusDone = bubble.innerHTML.length + ':' + bubble.textContent.slice(0, 40);
    if (fresh) { row?.classList.add('lg-fresh'); reveal(bubble); }
  }

  let queued = false;
  function scan() {
    queued = false;
    const bubbles = [...document.querySelectorAll('.cx-message--assistant .cx-bubble, #chat .msg:not(.msg--user) .bubble')];
    const users = document.querySelectorAll('.cx-message--user, .msg--user').length;
    const count = bubbles.length + users;
    const grew = count > lastCount;
    const lastB = bubbles[bubbles.length - 1];
    const lastPending = !!lastB && (lastB.classList.contains('typing') || PENDING.test(lastB.textContent.trim()) || !!lastB.querySelector('.lg-typing'));
    bubbles.forEach((b, i) => {
      const isLast = i === bubbles.length - 1;
      /* nová správa, alebo odpoveď, ktorá práve nahradila bodky */
      const fresh = isLast && !lastPending && ((!seen.has(b) && lastCount > 0 && grew) || pendingActive);
      enhance(b, fresh);
      seen.add(b);
    });
    if (lastB && lastPending) lastB.closest('.cx-message, .msg')?.classList.add('lg-fresh');
    pendingActive = lastPending;
    const usersEls = [...document.querySelectorAll('.cx-message--user, .msg--user')];
    const lastU = usersEls[usersEls.length - 1];
    if (lastU && !seen.has(lastU) && grew && lastCount > 0) lastU.classList.add('lg-fresh');
    usersEls.forEach((u) => seen.add(u));
    lastCount = count;
  }
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(scan); } }).observe(doc, {childList: true, subtree: true, characterData: true});
})();
