/* The advisor and chat use the same refreshed official product records. */
(()=>{
  const data=window.JOLKA,catalogue=globalThis.CX_COFFEE_CATALOGUES?.[data?.demo?.id];
  if(!data||!catalogue)return;
  const products=catalogue.products.filter(p=>p.available!==false);
  if(!products.length)return;
  data.products=products;data.fullOffer=catalogue.offer;data.demo.teaserText='Krátky výber · jedno odporúčanie';
  if(!products.some(p=>p.id===data.demo.heroProductId))data.demo.heroProductId=products.find(p=>p.photo)?.id||products[0].id;
  if(products.some(p=>p.decaf)&&products.some(p=>!p.decaf)&&!data.steps.some(s=>s.key==='caffeine'))data.steps.push({key:'caffeine',name:'Kofeín',title:'Má káva obsahovať kofeín?',options:[
    {value:'yes',title:'S kofeínom',detail:'Vyberiem bežnú kávu z ponuky',photo:'/assets/scenes/coffee-black.jpg'},
    {value:'no',title:'Bez kofeínu',detail:'Iba kávy označené ako bezkofeínové',photo:'/assets/scenes/coffee-decaf-cup.jpg'}
  ]});
})();
