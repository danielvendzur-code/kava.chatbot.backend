/**
 * Fills the empty half of the chat with the roastery's own coffees.
 *
 * Every demo opened on a welcome message followed by 300–400 px of blank
 * space (more on a phone), which reads as a widget that failed to finish
 * loading. It is also the most valuable space in the window: the customer is
 * looking straight at it before they have typed anything.
 *
 * Three coffees from that roastery go there — photo, name, tasting note and
 * price — each linking to their shop. The strip is removed as soon as the
 * customer says something, so it never sits on top of a live conversation.
 */
(() => {
  'use strict';

  const brand = window.__MCB_BRAND__;
  if (!brand || !Array.isArray(brand.shelf) || !brand.shelf.length) return;
  if (document.querySelector('.mcs-starter')) return;

  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const LOGS = '#chatMessages, .chat-messages, .kf-messages, #pz13-messages, .pz13-chat__messages, #chat, .chat__log, .messages';
  const USER = '.message--user, .chat-line--user, .kf-message.user, .kf-message-row.user, .message.is-user, .pz13-message--user, .msg--user';
  // The strip goes directly after the greeting rather than at the end of the
  // log: some runtimes lay the opening block out with its own positioning, and
  // an extra last child there pushed the greeting out of the panel.
  const GREETING = '.kf-message.bot, .chat-line:not(.chat-line--user) .chat-bubble, ' +
    '.message:not(.message--user) .bubble, .pz13-message--assistant, .message.is-bot, ' +
    '.msg:not(.msg--user)';

  const style = document.createElement('style');
  style.dataset.mcsStarter = 'true';
  style.textContent = `
    /* Opacity is pinned: some runtimes run their own reveal transition over
       anything added to the log, which left the offer permanently half-faded.
       The entrance here is a translate only, so nothing can wash it out. */
    html body .mcs-starter{--mcs-line:color-mix(in srgb,currentColor 14%,transparent);display:grid;gap:9px;margin:12px 0 4px;opacity:1!important;filter:none!important;animation:mcs-in .45s cubic-bezier(.22,1,.36,1) both}
    @keyframes mcs-in{from{transform:translateY(10px)}to{transform:none}}
    .mcs-starter-label{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:color-mix(in srgb,currentColor 58%,transparent)}
    .mcs-starter-label::after{content:"";flex:1;height:1px;background:var(--mcs-line)}
    .mcs-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}
    .mcs-item{display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:11px;align-items:center;padding:8px;border:1px solid var(--mcs-line);border-radius:15px;color:inherit;text-decoration:none;background:color-mix(in srgb,#fff 62%,transparent);transition:transform .22s cubic-bezier(.22,1,.36,1),border-color .22s ease,box-shadow .22s ease}
    .mcs-item:hover{transform:translateY(-2px);border-color:color-mix(in srgb,currentColor 32%,transparent);box-shadow:0 14px 26px -20px color-mix(in srgb,currentColor 70%,transparent)}
    .mcs-item img{width:46px;height:46px;border-radius:11px;object-fit:cover;background:color-mix(in srgb,currentColor 7%,transparent)}
    .mcs-item div{min-width:0;display:grid;gap:2px}
    .mcs-item b{font-size:12.5px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mcs-item small{font-size:11px;line-height:1.25;color:color-mix(in srgb,currentColor 60%,transparent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mcs-item em{font-style:normal;font-size:11.5px;font-weight:850;white-space:nowrap}
    .mcs-starter-note{margin:1px 0 0;font-size:11px;line-height:1.35;color:color-mix(in srgb,currentColor 56%,transparent)}
    /* An empty log is laid out bottom-up (justify-content:flex-end) so the
       greeting hugs the composer. Once there is more content than height, flex
       overflows upward and the overflow is unreachable by scrolling — the
       greeting simply disappears above the panel. With the strip in place the
       log fills from the top and scrolls normally. */
    html body .mcs-log{justify-content:flex-start!important}
    /* A scrollable flex column must not shrink its rows. Kaffa's opening block
       was being squashed from 200 px of content down to 55 px, so the greeting
       spilled out of its own box and printed over the offer below it. */
    html body .mcs-log>*{flex:0 0 auto!important;min-height:auto!important}
    /* Kaffa additionally stretches its opening block to the full height and
       pins the greeting to its bottom edge. */
    html body .kf-messages.mcs-log .kf-chat-seed{min-height:0!important;flex:0 0 auto!important}
    html body .kf-messages.mcs-log .kf-chat-seed .kf-message-row--bot{margin-top:0!important}
    @media (prefers-reduced-motion:reduce){.mcs-starter,.mcs-item{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const item = (product) => `
    <li><a class="mcs-item" href="${esc(product.url || brand.shop || '#')}" target="_blank" rel="noreferrer">
      <img src="${esc(product.photo)}" alt="" loading="lazy" decoding="async">
      <div><b>${esc(product.name)}</b><small>${esc(product.note)}</small></div>
      <em>${esc(product.price)}</em>
    </a></li>`;

  const build = () => {
    const wrap = document.createElement('div');
    wrap.className = 'mcs-starter';
    wrap.dataset.mcsStarter = 'true';
    // Explicit ink: Concept tints its whole log with a muted colour, which the
    // offer inherited and rendered almost unreadable.
    if (brand.theme?.ink) wrap.style.color = brand.theme.ink;
    wrap.innerHTML = `
      <span class="mcs-starter-label">Z ponuky ${esc(brand.name)}</span>
      <ul class="mcs-list">${brand.shelf.slice(0, 2).map(item).join('')}</ul>
      <p class="mcs-starter-note">Alebo mi napíšte, ako kávu pripravujete.</p>`;
    return wrap;
  };

  const sync = () => {
    const log = document.querySelector(LOGS);
    if (!log) return;
    const started = Boolean(log.querySelector(USER));
    const existing = log.querySelector('.mcs-starter');

    if (started) {
      existing?.remove();
      log.classList.remove('mcs-log');
      return;
    }
    if (existing) return;

    // Nothing to fill yet if the greeting has not been printed.
    const greeting = [...log.querySelectorAll(GREETING)].pop();
    if (!greeting) return;

    // Anchor on the greeting's own row, so the strip inherits the same flow.
    let anchor = greeting;
    while (anchor.parentElement && anchor.parentElement !== log) anchor = anchor.parentElement;
    log.classList.add('mcs-log');
    // Set inline with priority: several demos pin `justify-content: flex-end`
    // with !important, and a bottom-aligned flex column overflows upward once
    // its content is taller than the log — an overflow that cannot be scrolled
    // back into view.
    log.style.setProperty('justify-content', 'flex-start', 'important');
    anchor.insertAdjacentElement('afterend', build());
    // Some runtimes scroll the log to the bottom whenever it grows. The greeting
    // is the first thing the customer should read, so put it back in view.
    requestAnimationFrame(() => { log.scrollTop = 0; });
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; sync(); });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  sync();
})();
