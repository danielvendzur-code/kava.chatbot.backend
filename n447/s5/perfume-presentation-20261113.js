/* Owner-requested visual polish for the fifteen reviewed, unsent fragrance demos. */
(() => {
 'use strict';
 const names='essentique fragrancesamples alexmonhart flakon orion inspirovane leparfumlechic vavavoom rafinad perfumeries1907 veelyn parfumeur beviro spacefluid vonya'.split(' ');
 const reg=window.S3_REG?.demos||{};
 const tidy=s=>typeof s==='string'?s.replace(/\b(?:doložených|uvedených|zverejnených|zveřejněných)\s+/gi,'').replace(/\b(?:Doložené|Uvedené|Zverejnené|Zveřejněné)\s+/g,'').trim():s;
 const helper=s=>typeof s==='string'&&/^Vyberte\s+(?:si\s+)?(?:podľa|podle)\b/i.test(s)?'':tidy(s);
 for(const slug of names){
  const r=reg[slug];if(r?.series!=='s5'||r.segment!=='fragrance')continue;
  r.fragrancePresentation={version:1,hideStepEstimate:true};
  if(r.fragranceResultExtras?.enabled)r.fragranceResultExtras.scentProfile={version:1,mode:'source-notes-no-numeric-strength'};
  for(const rows of [r.traitCopy,r.stepCopy])for(const row of Object.values(rows||{}))if(Array.isArray(row)){
   for(let i=0;i<row.length;i++)row[i]=(rows===r.stepCopy&&i===1||rows===r.traitCopy&&(i===1||i===3))?helper(row[i]):tidy(row[i]);
  }
  for(const block of [r.brand,r.segmentText])for(const key of Object.keys(block||{}))if(typeof block[key]==='string')block[key]=tidy(block[key]);
 }
 const host=location.hostname.endsWith('.mojchatbot.sk')?location.hostname.split('.')[0]:(location.hostname.match(/^([a-z0-9]+)-mojchatbot\.vercel\.app$/)||[])[1];
 if(names.includes(host||new URLSearchParams(location.search).get('demo')))document.body.dataset.fragranceProfile='visual-v1';
})();
