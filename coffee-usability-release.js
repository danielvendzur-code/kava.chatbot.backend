(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || (location.pathname.includes('jolka') ? 'jolka' : '');
  const normalized = String(slug).replace('-v13', '');
  if (!['praziarnicka','diamonds','kaffa','vitazov','concept','jolka'].includes(normalized)) return;

  document.documentElement.dataset.coffeeRelease = 'client-ready';
  document.body.dataset.coffeeRelease = normalized;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/coffee-client-ready.css';
  css.dataset.coffeeClientReady = 'true';
  document.body.appendChild(css);
  const keepCssLast = () => { if (document.body.lastElementChild !== css) document.body.appendChild(css); };

  const brand = {
    praziarnicka:{ name:'Pražiarnička', logo:'<img src="/brand/praziarnicka-logo-official.png" alt="Pražiarnička">' },
    diamonds:{ name:'Diamonds Roastery' },
    kaffa:{ name:'Kaffa Roastery', logo:'<span class="mc-owner-wordmark"><b>KAFFA</b><small>SPECIALITY COFFEE BEANS</small></span>' },
    vitazov:{ name:'Káva Víťazov' },
    concept:{ name:'Concept Coffee Roasters' },
    jolka:{ name:'Pražiareň Jolka', logo:'<span class="mc-owner-jolka"><img src="/assets/jolka/logo-ink.webp" alt="Pražiareň Jolka"><b>Pražiareň Jolka</b></span>' }
  }[normalized];

  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow:icon('M5 12h13m-5-6 6 6-6 6'),
    chat:icon('M5 5h14v10H9l-4 4V5Z'),
    picker:icon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2'),
    check:icon('m5 12 4 4L19 6')
  };

  function existingLockup(){
    if (brand.logo) return brand.logo;
    const old = document.querySelector('[data-owner-page="true"] .op-lockup,.mc-owner .mc-owner-lockup');
    if (old?.innerHTML?.trim()) return old.innerHTML;
    if (normalized === 'concept') return '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters">';
    if (normalized === 'diamonds') return '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">';
    if (normalized === 'vitazov') return '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov">';
    return `<b>${brand.name}</b>`;
  }

  function ownerTarget(){
    if (normalized === 'praziarnicka') return document.querySelector('.pz13-site');
    if (normalized === 'jolka') return document.querySelector('.page');
    return document.querySelector('[data-owner-page="true"]');
  }

  function ownerMarkup(){
    return `
      <header class="mc-owner-head"><div class="mc-owner-lockup">${existingLockup()}</div></header>
      <section class="mc-owner-hero">
        <div class="mc-owner-copy">
          <span class="mc-owner-eyebrow">Pomoc pri výbere priamo na webe</span>
          <h1>Menej hľadania.<br>Rýchlejšie ku káve.</h1>
          <p>Chat odpovie na otázku. Výber kávy prevedie zákazníka štyrmi jednoduchými krokmi ku konkrétnemu produktu.</p>
          <div class="mc-owner-actions">
            <button type="button" data-release-open="advisor">Vyskúšať Výber kávy ${icons.arrow}</button>
            <button class="is-secondary" type="button" data-release-open="chat">Skúsiť Chat ${icons.chat}</button>
          </div>
        </div>
        <div class="mc-owner-demo" aria-label="Ako pomoc funguje">
          <article class="mc-owner-demo-card"><span class="mc-owner-demo-icon">${icons.chat}</span><div><small>CHAT</small><b>Zákazník sa normálne opýta.</b><p>„Čo by ste mi odporučili, keď nechcem príliš kyslú kávu?“</p></div></article>
          <article class="mc-owner-demo-card"><span class="mc-owner-demo-icon">${icons.picker}</span><div><small>VÝBER KÁVY</small><b>Štyri kliknutia ku konkrétnemu produktu.</b><ol><li><i>1</i>Príprava</li><li><i>2</i>Chuť</li><li><i>3</i>Nápoj</li><li><i>4</i>Výber</li></ol></div></article>
        </div>
      </section>
      <section class="mc-owner-benefits">
        <div>${icons.check}<span><b>Menej opakovaných otázok</b><small>Zákazník dostane odpoveď hneď.</small></span></div>
        <div>${icons.check}<span><b>Jednoduchší výber</b><small>Štyri jasné kroky bez zbytočného hľadania.</small></span></div>
        <div>${icons.check}<span><b>Konkrétny produkt</b><small>Výber prirodzene končí pri vhodnej káve.</small></span></div>
      </section>`;
  }

  const launchers = {praziarnicka:'#pz13-open',diamonds:'#launcherButton',kaffa:'#launcher',vitazov:'#openWidget',concept:'#openWidget',jolka:'#open'};
  const advisorButtons = {
    praziarnicka:'.pz13-mode button[data-mode="advisor"]', diamonds:'.mode-switch button[data-mode="advisor"]', kaffa:'.kf-switch button[data-view="advisor"],.kf-switch button[data-mode="advisor"]', vitazov:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', concept:'.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]', jolka:'.mode__button[data-mode="advisor"]'
  };
  const chatButtons = {
    praziarnicka:'.pz13-mode button[data-mode="chat"]', diamonds:'.mode-switch button[data-mode="chat"]', kaffa:'.kf-switch button[data-view="chat"],.kf-switch button[data-mode="chat"]', vitazov:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', concept:'.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]', jolka:'.mode__button[data-mode="chat"]'
  };

  const visibleControl = selector => [...document.querySelectorAll(selector)].find(node => node.offsetParent !== null && getComputedStyle(node).visibility !== 'hidden');
  function openMode(mode){
    const launcher = document.querySelector(launchers[normalized]);
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => visibleControl(mode === 'advisor' ? advisorButtons[normalized] : chatButtons[normalized])?.click()));
  }

  function applyOwnerGeometry(){
    const target = ownerTarget();
    if (!target?.classList.contains('mc-owner')) return;
    const hero = target.querySelector('.mc-owner-hero');
    const copy = target.querySelector('.mc-owner-copy');
    const benefits = target.querySelector('.mc-owner-benefits');
    target.style.setProperty('position','relative','important');
    target.style.setProperty('z-index','0','important');
    target.style.setProperty('isolation','isolate','important');
    const mobile = matchMedia('(max-width:760px)').matches;
    if (mobile) {
      target.style.setProperty('grid-template-rows','68px minmax(0,1fr)','important');
      hero?.style.setProperty('display','block','important');
      hero?.style.setProperty('height','auto','important');
      hero?.style.setProperty('min-height','0','important');
      hero?.style.setProperty('padding','14px 0 120px','important');
      hero?.style.setProperty('margin','0','important');
      copy?.style.setProperty('position','static','important');
      copy?.style.setProperty('transform','none','important');
      copy?.style.setProperty('margin','0','important');
      copy?.style.setProperty('padding','0','important');
      copy?.style.setProperty('align-self','start','important');
      benefits?.style.setProperty('display','none','important');
    } else {
      target.style.removeProperty('grid-template-rows');
      hero?.style.removeProperty('display'); hero?.style.removeProperty('height'); hero?.style.removeProperty('min-height'); hero?.style.removeProperty('padding'); hero?.style.removeProperty('margin');
      copy?.style.removeProperty('position'); copy?.style.removeProperty('transform'); copy?.style.removeProperty('margin'); copy?.style.removeProperty('padding'); copy?.style.removeProperty('align-self');
      benefits?.style.removeProperty('display');
    }
  }

  function renderOwner(){
    const target = ownerTarget();
    if (!target || target.dataset.clientReadyOwner === 'true') { applyOwnerGeometry(); return; }
    target.dataset.clientReadyOwner = 'true';
    target.classList.add('mc-owner');
    target.innerHTML = ownerMarkup();
    const primary = target.querySelector('[data-release-open="advisor"]');
    if (primary) primary.id = normalized === 'praziarnicka' ? 'pz13-hero-open' : 'heroOpen';
    target.querySelectorAll('[data-release-open]').forEach(button => button.addEventListener('click', () => openMode(button.dataset.releaseOpen)));
    applyOwnerGeometry();
  }

  function fixChatOrder(){
    if (normalized === 'jolka') {
      const screen = document.querySelector('#chatScreen'), entry = document.querySelector('#entry'), chat = document.querySelector('#chat');
      if (screen && entry && chat && entry.nextElementSibling !== chat) screen.insertBefore(entry, chat);
      return;
    }
    if (normalized === 'diamonds') {
      const screen = document.querySelector('#chatScreen'), entry = screen?.querySelector('.advisor-entry'), messages = screen?.querySelector('.chat-messages');
      if (screen && entry && messages && entry.nextElementSibling !== messages) screen.insertBefore(entry, messages);
      return;
    }
    if (normalized === 'kaffa') {
      document.querySelectorAll('.kf-chat-editorial').forEach(node => node.remove());
      const seed = document.querySelector('.kf-chat-seed'), entry = seed?.querySelector('.kf-advisor-entry'), welcome = seed?.querySelector('.kf-message-row');
      if (seed && entry && welcome && entry.nextElementSibling !== welcome) seed.insertBefore(entry, welcome);
      return;
    }
    if (normalized === 'concept' || normalized === 'vitazov') {
      const screen = document.querySelector('#chatScreen'), entry = screen?.querySelector('.advisor-entry,#openAdvisor'), messages = screen?.querySelector('#chatMessages,.chat-messages,.chat');
      if (screen && entry && messages && entry.nextElementSibling !== messages) screen.insertBefore(entry, messages);
    }
  }

  function cleanGenericHeader(){
    const brandNode = document.querySelector('.widget-brand');
    if (!brandNode || brandNode.dataset.clientReadyBrand === 'true') return;
    if (normalized === 'diamonds') {
      brandNode.dataset.clientReadyBrand = 'true';
      brandNode.innerHTML = '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery" style="display:block;max-width:154px;max-height:42px;object-fit:contain;filter:brightness(0) invert(1)"><span class="widget-brand__copy"><small style="color:#fff"><i></i> Online</small></span>';
    } else if (normalized === 'vitazov') {
      brandNode.dataset.clientReadyBrand = 'true';
      brandNode.innerHTML = '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov" style="display:block;max-width:108px;max-height:45px;object-fit:contain;filter:brightness(0) invert(1)"><span class="widget-brand__copy"><small style="color:#fff"><i></i> Online</small></span>';
    } else if (normalized === 'concept') {
      brandNode.dataset.clientReadyBrand = 'true';
      brandNode.innerHTML = '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters" style="display:block;max-width:148px;max-height:46px;object-fit:contain"><span class="widget-brand__copy"><small style="color:#406b68"><i></i> Online</small></span>';
    }
  }

  function fixVisualStability(){
    const panel = normalized === 'kaffa' ? document.querySelector('.kf-panel') : normalized === 'praziarnicka' ? document.querySelector('#pz13-widget') : document.querySelector('#widget');
    const wrapper = normalized === 'kaffa' ? document.querySelector('.kf-widget') : panel;
    const open = Boolean(wrapper?.classList.contains('is-open'));
    if (panel) {
      panel.style.setProperty('background','#fff','important');
      panel.style.setProperty('z-index','2147483500','important');
      if (open) {
        panel.style.setProperty('opacity','1','important');
        panel.style.setProperty('visibility','visible','important');
        panel.style.setProperty('transform','none','important');
        panel.style.setProperty('transition','transform .18s ease, visibility 0s','important');
      } else {
        panel.style.removeProperty('opacity'); panel.style.removeProperty('visibility'); panel.style.removeProperty('transform'); panel.style.removeProperty('transition');
      }
    }
    document.querySelectorAll('.stage,.widget-stage,#chatScreen,#advisorScreen,.chat-screen,.advisor-screen,.kf-view,.pz13-stage').forEach(node => {
      node.style.setProperty('background','#fff','important');
      node.style.setProperty('position','relative','important');
      node.style.setProperty('z-index','1','important');
    });

    cleanGenericHeader();
    if (normalized === 'kaffa') {
      const header = document.querySelector('.kf-panel-head'), lockup = document.querySelector('.kf-widget-brand');
      if (header) { header.style.setProperty('overflow','hidden','important'); header.style.setProperty('padding','8px 12px 8px 16px','important'); header.style.setProperty('align-items','center','important'); }
      if (lockup && lockup.dataset.clientReadyKaffa !== 'true') {
        lockup.dataset.clientReadyKaffa = 'true';
        lockup.innerHTML = '<span aria-hidden="true" style="font-family:Georgia,serif;font-size:22px;letter-spacing:.16em;font-weight:700;line-height:1">KAFFA</span><span class="kf-widget-brand__copy"><strong>Kaffa Roastery</strong><small><i></i>Online</small></span>';
      }
      if (lockup) { lockup.style.setProperty('display','flex','important'); lockup.style.setProperty('align-items','center','important'); lockup.style.setProperty('gap','10px','important'); lockup.style.setProperty('height','100%','important'); lockup.style.setProperty('overflow','hidden','important'); }
    }
  }

  function victoryFallback(text){
    const q = String(text || '').toLocaleLowerCase('sk');
    if (/automat|kancel/.test(q)) return 'Do automatu sa zvyčajne hodí plnšia a menej kyslá káva. Vo Výbere kávy to spresníme podľa vašej chuti.';
    if (/mliek|capp|latte/.test(q)) return 'Do mliečnych nápojov sa hodí plnšia káva, ktorá sa v mlieku nestratí. Vo Výbere kávy ju zúžime podľa chuti.';
    if (/filter|v60|ovoc|sviež/.test(q)) return 'Na filter sa dá ísť jemnejším aj ovocnejším smerom. Výber kávy to zúži podľa toho, čo chcete cítiť v šálke.';
    return 'Pomôžem vám. Napíšte, ako kávu pripravujete a čo vám chutí, alebo prejdite krátky Výber kávy.';
  }

  function ensureVictoryComposerSafety(){
    if (normalized !== 'vitazov') return;
    const form = document.querySelector('#chatForm'), input = document.querySelector('#chatInput'), chat = document.querySelector('#chatMessages');
    if (!form || !input || !chat || form.dataset.clientReadySafety === 'true') return;
    form.dataset.clientReadySafety = 'true';
    form.addEventListener('submit', () => {
      const text = input.value.trim();
      if (!text) return;
      const before = chat.querySelectorAll('.message:not(.message--user)').length;
      setTimeout(() => {
        const current = chat.querySelectorAll('.message:not(.message--user)').length;
        if (current > before) return;
        const row = document.createElement('div');
        row.className = 'message message--fallback';
        row.innerHTML = `<div class="bubble">${victoryFallback(text)}</div>`;
        chat.appendChild(row);
        chat.scrollTop = chat.scrollHeight;
      }, 6200);
    }, true);
  }

  function removeDemoBranding(){
    document.querySelectorAll('a[href*="mojchatbot.sk"]').forEach(node => node.remove());
    document.querySelectorAll('.solution-brand,.demo-flag,.op-flag,.owner-note,.demo-tag').forEach(node => { if (/AI|demo|ukážka|mojchatbot|návrh/i.test(node.textContent || '')) node.remove(); });
    document.querySelectorAll('.launcher-teaser__open b,.teaser b,.kf-teaser b,.launcher__teaser b').forEach(node => { if (/AI/i.test(node.textContent || '')) node.textContent = 'Nájsť svoju kávu'; });
    document.querySelectorAll('.launcher-teaser__open span,.teaser span,.kf-teaser span,.launcher__teaser span').forEach(node => { if (/AI|chat aj/i.test(node.textContent || '')) node.textContent = 'Chat alebo 4 krátke otázky.'; });
    document.querySelectorAll('[class*="version"],[data-version]').forEach(node => node.remove());
  }

  function cleanResults(){
    document.querySelectorAll('.result__badge').forEach(badge => { if (/\d+\s*%/.test(badge.textContent || '')) badge.textContent = 'Odporúčanie pre vás'; });
    document.querySelectorAll('.alt__card small,.result small,.result-card small').forEach(node => { if (/\d+\s*%\s*zhoda/i.test(node.textContent || '')) node.textContent = (node.textContent || '').replace(/\s*·?\s*\d+\s*%\s*zhoda/ig,''); });
  }

  function finaliseDom(){ renderOwner(); fixChatOrder(); fixVisualStability(); ensureVictoryComposerSafety(); removeDemoBranding(); cleanResults(); keepCssLast(); }

  const upstreamFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (!(url === '/api/chat' || url.endsWith('/api/chat'))) return upstreamFetch(input, init);
    let timer;
    try {
      return await Promise.race([upstreamFetch(input, init),new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('coffee-chat-timeout')), 5200); })]);
    } catch (_) {
      let text = '';
      try { const payload = JSON.parse(init?.body || '{}'); text = String(payload.messages?.filter(m => m?.role === 'user').at(-1)?.content || ''); } catch {}
      return new Response(JSON.stringify({ reply:victoryFallback(text), fallback:true }), { status:200, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'} });
    } finally { clearTimeout(timer); }
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; finaliseDom(); });
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('resize', applyOwnerGeometry, { passive:true });
  finaliseDom();
})();
