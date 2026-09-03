(() => {
  'use strict';
  const valid=['praziarnicka','diamonds','kaffa','vitazov','concept'];
  const slug=window.__COFFEE_DEMO_SLUG__||window.COFFEE_DEMO_SLUG||document.body.dataset.demo||new URLSearchParams(location.search).get('demo')||location.pathname.split('/').filter(Boolean).at(-1);
  if(!valid.includes(slug))return;
  document.body.dataset.demo=slug;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const set=(s,v,r=document)=>{const n=$(s,r);if(n&&n.textContent.trim()!==v)n.textContent=v;return n};
  const rootSel={praziarnicka:'.pz-page',diamonds:'.diamonds-page',kaffa:'.kf-shell',vitazov:'.demo-page',concept:'.concept-page'};
  const strips={
    praziarnicka:[['Poradí 24/7','Pomôže s výberom aj večer.'],['Rozumie chuti','Preloží kyslosť aj praženie.'],['Vyberie produkt','Odporučí konkrétnu kávu.'],['Vedie ku košíku','Balenie aj produkt jedným krokom.']],
    diamonds:[['Poradí 24/7','Bez preklikávania katalógu.'],['Zúži výber','Chuť a príprava v štyroch krokoch.'],['Ukáže dôvod','Zákazník vie, prečo káva sedí.'],['Vedie ku košíku','Balenie a ochutnávka na konci.']],
    kaffa:[['Poradí 24/7','Pomôže aj bez znalosti odrôd.'],['Vysvetlí chuť','Ovocnosť a acidita zrozumiteľne.'],['Vyberie kávu','Konkrétny produkt podľa prípravy.'],['Vedie ku košíku','Balenie aj doplnok bez hľadania.']],
    vitazov:[['Domov aj do firmy','Výber podľa reálneho použitia.'],['Menej otázok','Štyri rýchle voľby.'],['Konkrétna káva','Nie zoznam podobných produktov.'],['Vedie ku košíku','Balenie a doplnok na jednom mieste.']],
    concept:[['Sezónny výber','Zúži aktuálnu ponuku.'],['Podľa prípravy','Espresso, filter aj mlieko.'],['Podľa chuti','Od čokolády po ovocné profily.'],['Vedie ku káve','Výsledok smeruje na produkt.']]
  };
  function css(){
    if(!$('link[data-jolka-parity]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/coffee-jolka-parity.css?v=7db35e83';l.dataset.jolkaParity='true';document.head.append(l)}
    if(!$('link[data-jolka-parity-polish]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/coffee-jolka-parity-polish.css?v=4f7e364d';l.dataset.jolkaParityPolish='true';document.head.append(l)}
    if(!$('link[data-jolka-parity-final]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/coffee-jolka-parity-final.css?v=8a2ee71a';l.dataset.jolkaParityFinal='true';document.head.append(l)}
  }
  function stylesReady(){return Boolean($('link[data-jolka-parity]')?.sheet&&$('link[data-jolka-parity-polish]')?.sheet&&$('link[data-jolka-parity-final]')?.sheet)}
  function strip(){const p=$(rootSel[slug]);if(!p||$('.parity-bottom',p))return;const s=document.createElement('section');s.className='parity-bottom';s.setAttribute('aria-label','Čo poradca zákazníkovi uľahčí');s.innerHTML=strips[slug].map(([a,b])=>`<div class="parity-bottom__item"><i class="parity-bottom__dot" aria-hidden="true"></i><span class="parity-bottom__copy"><b>${a}</b><span>${b}</span></span></div>`).join('');p.append(s)}
  function pz(){
    const p=$('.pz-page');if(!p)return;
    set('.pz-owner-copy h1','Káva, ktorá vám sadne.');set('.pz-owner-lead','Stačia štyri krátke voľby podľa prípravy a chuti. Poradca vyberie konkrétnu kávu z ponuky Pražiarničky a dovedie zákazníka priamo k produktu.');
    const c=$('.pz-primary');if(c&&!c.dataset.parityCopy){const svg=c.querySelector('svg')?.outerHTML||'';c.innerHTML=`Nájsť svoju kávu ${svg}`;c.dataset.parityCopy='1'}
    const built=$('.pz-built-by span');if(built&&built.textContent!=='Kávový poradca')built.textContent='Kávový poradca';
    const t=$('#pz-preview');if(t){set('b','Nájdite svoju kávu',t);set('span','4 otázky · konkrétne odporúčanie',t)}
    if(!$('.parity-pz-showcase',p)){const v=document.createElement('aside');v.className='parity-pz-showcase';v.setAttribute('aria-label','Výber z ponuky Pražiarničky');v.innerHTML=`<figure class="parity-pz-showcase__main"><img src="/assets/praziarnicka/official-paganini.jpg" alt="Paganini blend Pražiarnička"><figcaption class="parity-pz-showcase__caption"><small>Odporúčanie podľa chuti</small><b>Paganini blend</b><span>čokoláda · mandle · orechy</span></figcaption></figure><div class="parity-pz-showcase__rail"><figure class="parity-pz-showcase__tile"><img src="/assets/praziarnicka/official-brazil.jpg" alt="Brazil Santos"><span>Brazil Santos</span></figure><figure class="parity-pz-showcase__tile"><img src="/assets/praziarnicka/official-cuba.jpg" alt="Cuba Serrano Lavado"><span>Cuba Serrano</span></figure></div>`;p.append(v)}
  }
  function vit(){set('.owner-note','KÁVA VÍŤAZOV · DOMOV AJ DO FIRMY');set('.demo-tag span','Kávový poradca');const t=$('#launcherTeaser');if(t){set('b','Nájdite svoju kávu',t);set('span','4 otázky · jedno odporúčanie',t)}const e=$('#openAdvisor');if(e){set('b','Nájsť svoju kávu',e);const d=e.querySelector('em');if(d&&d.textContent!=='4 otázky · výber podľa chuti a použitia')d.textContent='4 otázky · výber podľa chuti a použitia'}}
  function dia(){set('.diamonds-eyebrow','DIAMONDS ROASTERY · VÝBER PODĽA CHUTI');const t=$('#teaser');if(t){set('strong','Nájdite svoju kávu',t);set('span','4 otázky · jedno odporúčanie',t)}const e=$('#openAdvisor');if(e){set('b','Nájsť svoju kávu',e);const d=e.querySelector('em');if(d&&d.textContent!=='4 otázky · konkrétna káva')d.textContent='4 otázky · konkrétna káva'}}
  function con(){set('.hero-eyebrow','CONCEPT COFFEE ROASTERS · SEZÓNNA PONUKA');const t=$('#launcherTeaser');if(t){set('b','Nájdite svoju kávu',t);set('span','4 otázky · jedno odporúčanie',t)}const e=$('#openAdvisor');if(e){set('b','Nájsť svoju kávu',e);const d=e.querySelector('em,.advisor-entry__copy span');if(d&&d.textContent!=='4 otázky · sezónny výber')d.textContent='4 otázky · sezónny výber'}}
  function kaf(){
    set('.kf-final-eyebrow','KAFFA ROASTERY · VÝBEROVÁ KÁVA');
    const ownerCopy=$('.kf-brand-copy');if(ownerCopy){set('strong','Kaffa Roastery',ownerCopy);set('small','Výberová káva',ownerCopy)}
    const widgetCopy=$('.kf-widget-brand__copy');if(widgetCopy){set('strong','Kaffa Roastery',widgetCopy);set('small','Online',widgetCopy)}
    const teaser=$('#teaser');if(teaser){set('b','Nájdite svoju kávu',teaser);set('span','4 otázky · jedno odporúčanie',teaser)}
    const e=$('.kf-advisor-entry');if(e)set('.kf-advisor-entry__copy b','Nájsť svoju kávu',e)
  }
  // Víťazov used to have Jolka's brewing photos pasted over every answer, so the
  // taste step offered "čokoláda a orechy" behind a picture of an espresso
  // machine. Its own choice sprite already carries flavour imagery, so the
  // override is gone and each answer shows what it actually means.
  function choices(){}
  function scrub(){const rules=[[/^Návrh AI chatbota.*$/i,'Kávový poradca'],[/^Návrh AI poradcu.*$/i,'Kávový poradca'],[/^Interaktívny návrh.*$/i,'Kávový poradca'],[/^Ukážka riešenia$/i,'Kávový poradca'],[/^Vyskúšajte AI poradcu$/i,'Nájdite svoju kávu']];const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);nodes.forEach(n=>{const raw=n.nodeValue?.trim();if(!raw)return;let next=raw;rules.forEach(([r,v])=>{if(r.test(next))next=v});if(/Funguje s reálnou ponukou|overenou 8\. 8\. 2026/i.test(next))next='';if(next!==raw)n.nodeValue=n.nodeValue.replace(raw,next)})}
  function enhance(){if(!$(rootSel[slug]))return false;css();strip();({praziarnicka:pz,vitazov:vit,diamonds:dia,concept:con,kaffa:kaf}[slug])();choices();scrub();if(stylesReady())document.documentElement.dataset.jolkaParity='ready';return true}
  let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;choices();if(slug==='kaffa')kaf();if(stylesReady())document.documentElement.dataset.jolkaParity='ready'})}).observe(document.documentElement,{childList:true,subtree:true});
  let tries=0;const timer=setInterval(()=>{tries++;if(enhance()&&stylesReady()&&tries>5)clearInterval(timer);if(tries>80)clearInterval(timer)},75);enhance();
})();
