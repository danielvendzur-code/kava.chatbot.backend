const byId = id => document.getElementById(id);
const make = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
};
const action = (text, run, className) => {
  const button = make('button', text, className);
  button.type = 'button';
  button.onclick = run;
  return button;
};
const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const slug = new URLSearchParams(location.search).get('demo');
const safeSlug = /^[a-z0-9-]+$/.test(slug || '');
try {
  if (!safeSlug) throw Error('Unknown shop');
  const response = await fetch('/n447/s5/shops/' + slug + '.json');
  if (!response.ok) throw Error('Unknown shop');
  init(await response.json());
} catch {
  document.querySelector('main').replaceChildren(make('p', 'Táto ukážka sa nenačítala.'));
}

function init(config) {
  const {brand, web, lang, products, groups, copy, theme, currency, budgets, avatar} = config;
  const cs = lang === 'cs';
  const t = (sk, cz) => cs ? cz : sk;
  const asMoney = new Intl.NumberFormat(lang, {style:'currency',currency,maximumFractionDigits:2}).format;
  const compare = new Set();
  const prefs = {};
  const conversation = {};
  let step = 0;
  document.documentElement.lang = lang;
  document.title = brand + ' – ' + copy.advisor;
  for (const [key,value] of Object.entries(theme)) document.documentElement.style.setProperty('--'+key,value);
  const brandLink = byId('brand');
  brandLink.href = web;
  if (config.logo) {
    const logo = make('img');
    logo.src = config.logo;
    logo.alt = brand;
    brandLink.append(logo);
    logo.onerror = () => { brandLink.textContent = brand; };
  } else brandLink.textContent = brand;
  byId('shop').href = web;
  byId('shop').textContent = t('Navštíviť e-shop','Navštívit e-shop');
  byId('hero').src = config.hero || products[0].photo;
  byId('headline').textContent = copy.headline;
  byId('lead').textContent = copy.lead;
  byId('advisor-title').textContent = copy.advisor;
  byId('guide-mode').textContent = t('Sprievodca','Průvodce');
  byId('begin').textContent = t('Spustiť výber','Spustit výběr');
  byId('begin').onclick = () => { switchMode(false); byId('advisor').scrollIntoView(); };
  byId('chat-mode').onclick = () => { switchMode(true); byId('query').focus(); };
  byId('guide-mode').onclick = () => switchMode(false);
  byId('query-label').textContent = t('Vaša otázka','Vaše otázka');
  byId('query').placeholder = config.prompts[0];
  byId('send').textContent = t('Odoslať','Odeslat');

  function switchMode(chat) {
    byId('guide').hidden = chat;
    byId('chat').hidden = !chat;
    byId('guide-mode').setAttribute('aria-pressed', String(!chat));
    byId('chat-mode').setAttribute('aria-pressed', String(chat));
  }
  function match({group,budget,keyword} = {}) {
    return products.filter(p =>
      (!group || p.group === group) &&
      (budget === undefined || p.priceAmount <= budget) &&
      (!keyword || normalize([p.name,p.kind,...p.notes].join(' ')).includes(keyword))
    );
  }
  function grid(results) {
    const list = make('div', undefined, 'products');
    for (const p of results) {
      const card = make('article', undefined, 'product');
      const img = make('img');
      img.src = p.photo;
      img.loading = 'lazy';
      img.alt = p.name;
      const body = make('div');
      const details = [p.kind,p.volume,...p.notes].filter(Boolean).join(' · ');
      const link = make('a',t('Otvoriť v e-shope','Otevřít v e-shopu'));
      link.href = p.url;
      const button = action('',() => {
        if (compare.has(p)) compare.delete(p);
        else if (compare.size < 2) compare.add(p);
        updateCompare();
        if (compare.size === 2) byId('compare').focus();
      });
      button.dataset.compare = p.id;
      body.append(make('h3',p.name), make('p',details,'detail'), make('strong',asMoney(p.priceAmount)), link, button);
      card.append(img, body);
      list.append(card);
    }
    return list;
  }
  function updateCompare() {
    const node = byId('compare');
    node.hidden = compare.size === 0;
    node.tabIndex = -1;
    node.replaceChildren();
    if (compare.size) {
      node.append(make('h2', t('Porovnanie produktov','Porovnání produktů')), grid([...compare]));
    }
    for (const el of document.querySelectorAll('[data-compare]')) {
      const chosen = [...compare].some(p => p.id === el.dataset.compare);
      el.textContent = chosen ? t('Odobrať','Odebrat') : t('Pridať na porovnanie','Přidat k porovnání');
      el.disabled = !chosen && compare.size === 2;
      el.setAttribute('aria-pressed', String(chosen));
    }
  }
  function render(focus = false) {
    const node = byId('guide');
    const rows = match(prefs);
    const knownNotes = [...new Set(rows.flatMap(p=>p.notes))].slice(0,7);
    const keys = ['group','budget','keyword'];
    const general = t('Všetky možnosti','Všechny možnosti');
    const options = step === 0
      ? [[null,general],...Object.entries(groups).map(([key,g])=>[key,g.label,g.scene])]
      : step === 1
        ? [[undefined,t('Bez limitu','Bez limitu')],...budgets.filter(n=>rows.some(p=>p.priceAmount<=n)).map(n=>[n,t('Do ','Do ')+asMoney(n)])]
        : [[null,t('Bez ďalšej preferencie','Bez další preference')],...knownNotes.map(note=>[normalize(note),note])];
    const title = make('h3',step<3 ? copy.questions[step] : t('Váš výber','Váš výběr'),'question');
    title.tabIndex = -1;
    node.replaceChildren(make('p',step < 3 ? (step+1)+' / 3' : t('Počet výsledkov: ','Počet výsledků: ')+rows.length,'progress'),title);
    if (step < 3) {
      const choices = make('div',undefined,'options');
      for (const [value,label,scene] of options) {
        const button = action(undefined,()=>{prefs[keys[step]]=value;step++;render(true);},'option');
        if (scene) {
          const visual = make('img');
          visual.src = scene;
          visual.alt = '';
          button.append(visual);
        }
        button.append(make('span',label));
        choices.append(button);
      }
      node.append(choices);
    } else node.append(rows.length ? grid(rows) : make('p',copy.empty));
    const controls = make('div',undefined,'controls');
    if(step>0) controls.append(action(t('Späť','Zpět'),()=>{step--;delete prefs[keys[step]];render(true);}));
    if(step===3) controls.append(action(t('Začať odznova','Začít znovu'),()=>{for(const k of keys)delete prefs[k];step=0;render(true);}));
    node.append(controls);
    updateCompare();
    if (focus) title.focus();
  }
  function addMessage(text,user=false) {
    const block = make('div',undefined,'message'+(user?' user':''));
    if (avatar && !user) {
      const image = make('img');
      image.src = avatar;
      image.alt = '';
      block.append(image);
    }
    block.append(make('p',text));
    byId('messages').append(block);
  }
  function submit(value) {
    if (!value.trim()) return;
    const q = normalize(value);
    addMessage(value,true);
    const category = Object.entries(groups).find(([,g])=>g.keywords.some(k=>q.includes(normalize(k))));
    const price = q.match(/\b(?:do|pod|max(?:imalne)?)\.?\s+(\d+(?:[ \u00a0]\d{3})*(?:[.,]\d{1,2})?)/);
    if (/odznova|znovu/.test(q)) for (const key of Object.keys(conversation)) delete conversation[key];
    if (/bez limitu/.test(q)) delete conversation.budget;
    if (category) {
      conversation.group = category[0];
      delete conversation.keyword;
    }
    if (price) conversation.budget=Number(price[1].replace(/\s/g,'').replace(',','.'));
    const term = products.flatMap(p=>p.notes).filter(n=>n.length>=4).sort((a,b)=>b.length-a.length)
      .find(n=>q.includes(normalize(n)));
    if (term) conversation.keyword=normalize(term);
    const named = products.find(p=>q.includes(normalize(p.name)));
    const active = price || category || term || named || /odporuc|doporuc|ukaz|porovna|bez limitu|odznova|znovu/.test(q);
    if (!active) addMessage(copy.help);
    else {
      const rows=named?match(conversation).filter(p=>p===named):match(conversation).slice(0,3);
      addMessage(rows.length ? copy.match : copy.empty);
      if(rows.length) byId('messages').append(grid(rows));
      if (/porovna/.test(q) && rows.length >= 2) {
        compare.clear();
        rows.slice(0,2).forEach(p=>compare.add(p));
      }
      updateCompare();
    }
    byId('messages').scrollTop=byId('messages').scrollHeight;
  }
  byId('chat-form').onsubmit = event => {
    event.preventDefault();
    submit(byId('query').value);
    byId('query').value='';
  };
  byId('suggestions').append(...config.prompts.map(prompt=>action(prompt,()=>submit(prompt))));
  addMessage(copy.greeting);
  render();
}
