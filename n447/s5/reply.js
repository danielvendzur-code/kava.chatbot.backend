/* Shared S5 catalogue intents: exact product IDs from per-company configuration, no model calls. */
(function(g){'use strict';
 const norm=s=>String(s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 const rules={nutt:[{match:'kokos',ids:['organicke-bambucke-maslo-s-kokosovym-olejem']},{match:'levand|vanilk',ids:['bambucke-maslo-levandule-vanilka']},{match:'tuh|sprch',ids:['sprchove-tuhe-bambucke-maslo-tangerine-neroli','sprchove-tuhe-bambucke-maslo-teatree-lime']}]};
 function reply(slug,cat,text){const q=norm(text);if(/nechci|alerg|nesmi|bez kokos|bez levand|bez vanil/.test(q))return null;
 const rule=(rules[slug]||[]).find(r=>new RegExp(r.match).test(q));if(!rule)return null;
 const products=rule.ids.map(id=>(cat.products||[]).find(p=>p.id===id&&p.available!==false)).filter(Boolean);if(!products.length)return null;
 return products.map(p=>`${p.name} — ${p.volume} za ${p.price}.\n${p.url}`).join('\n\n');}
 g.S5CatalogueReply={reply};if(typeof module!=='undefined'&&module.exports)module.exports=g.S5CatalogueReply;
})(globalThis);
