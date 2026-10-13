/* The advisor and chat use the same refreshed official product records. */
(()=>{
  /* Some shops refuse product photos requested from another site; sending no referrer loads them. */
  document.head.append(Object.assign(document.createElement('meta'),{name:'referrer',content:'no-referrer'}));
  const data=window.JOLKA,catalogue=globalThis.CX_COFFEE_CATALOGUES?.[data?.demo?.id];
  if(!data||!catalogue)return;
  /* Shop records are cleaned for display: a URL path is not a description, prices keep two
     decimals, a generic pack note is not shown, and one coffee appears once. */
  const money=v=>typeof v==='string'?v.replace(/(\d),(\d)(?!\d)/g,'$1,$20'):v,seen=new Set();
  /* The line under the name is a short category, not the shop's whole breadcrumb list. */
  const tidy=line=>{const parts=[...new Set(String(line||'').split(/\s*[·|]\s*/).map(s=>s.trim()).filter(s=>s&&!/^(káva|kava|e-shop|eshop|obchod)$/i.test(s)))];return parts.slice(0,2).join(' · ').slice(0,64);};
  const products=catalogue.products.filter(p=>p.available!==false).map(p=>({...p,line:/^\/|^https?:/.test(p.line||'')?'':tidy(p.line),price:money(p.price),priceFrom:money(p.priceFrom),priceUnit:/podľa e-shopu|podle e-shopu/i.test(p.priceUnit||'')?'':p.priceUnit})).filter(p=>{const key=String(p.name||'').trim().toLowerCase();if(seen.has(key))return false;seen.add(key);return true;});
  if(!products.length)return;
  data.products=products;data.fullOffer=catalogue.offer;data.demo.teaserText='Krátky výber · jedno odporúčanie';data.demo.entryText='Pár otázok · konkrétne odporúčanie';
  if(!products.some(p=>p.id===data.demo.heroProductId))data.demo.heroProductId=products.find(p=>p.photo)?.id||products[0].id;
  if(products.some(p=>p.decaf)&&products.some(p=>!p.decaf)&&!data.steps.some(s=>s.key==='caffeine'))data.steps.push({key:'caffeine',name:'Kofeín',title:'Má káva obsahovať kofeín?',options:[
    {value:'yes',title:'S kofeínom',detail:'Vyberiem bežnú kávu z ponuky',photo:'/assets/scenes/coffee-black.jpg'},
    {value:'no',title:'Bez kofeínu',detail:'Iba kávy označené ako bezkofeínové',photo:'/assets/scenes/coffee-decaf-cup.jpg'}
  ]});
})();
