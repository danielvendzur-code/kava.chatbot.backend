(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const icon=(body,view='0 0 24 24')=>`<svg viewBox="${view}" fill="none" aria-hidden="true">${body}</svg>`;
const path=(d,extra='')=>`<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const icons={
 brand:`<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 12.5A7.5 7.5 0 0 1 15.5 5h17A7.5 7.5 0 0 1 40 12.5v14A7.5 7.5 0 0 1 32.5 34H25l-8.2 7v-7h-1.3A7.5 7.5 0 0 1 8 26.5v-14Z" fill="currentColor" opacity=".22"/><path d="M16.5 22.5c0-7 4.3-12 9.7-12 4.2 0 7.4 3.2 7.4 7.7 0 6.7-5.1 12.5-11.1 13.1-3.4.3-6-3.2-6-8.8Z" stroke="currentColor" stroke-width="2.7"/><path d="M21.4 28.8c5.4-4 7.5-9.2 7.2-15.2" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/></svg>`,
 refresh:icon(path('M20 11a8 8 0 1 0-2.3 5.7')+path('M20 5v6h-6')), close:icon(path('m6 6 12 12M18 6 6 18')), back:icon(path('m15 18-6-6 6-6')), next:icon(path('m9 18 6-6-6-6')), send:icon(path('m4 4 16 8-16 8 3-8-3-8Z')+path('M7 12h13')),
 bag:icon(path('M7 4h10l2 4-1.2 13H6.2L5 8l2-4Z')+path('M5.5 8h13M9 4c0 2 1.3 3 3 3s3-1 3-3')+`<path d="M9 13c0-2.4 1.4-4 3.2-4 1.5 0 2.6 1.1 2.6 2.7 0 2.3-1.7 4.3-3.8 4.5-1.2.1-2-1-2-3.2Z" stroke="currentColor" stroke-width="1.6"/><path d="M10.7 15.3c1.9-1.4 2.6-3.2 2.5-5.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
 check:icon(path('m5 12 4 4L19 6')),
 machine:icon(`<rect x="4" y="3" width="16" height="15" rx="3" stroke="currentColor" stroke-width="1.9"/>`+path('M8 7h8M8 11h5v3H8zM7 21h10M17 10v5')),
 lever:icon(path('M5 20h14M7 20V9h10v11M9 9V5h6v4M15 12h4M19 12v5')+`<path d="M9 14h6v3H9z" stroke="currentColor" stroke-width="1.9"/>`),
 moka:icon(path('m8 3 8 1 2 6-2 11H8L6 10l2-7Z')+path('M7 10h10M9 5h6M18 8h2.5v6H18')),
 filter:icon(path('M6 4h12l-2 10H8L6 4Z')+path('M9 18h6M12 14v4M8 4l4 10 4-10')),
 gentle:icon(path('M4 14c4-1 4-7 8-8 4-1 4 5 8 4M5 18h14')),
 balanced:icon(path('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
 strong:icon(path('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
 unsure:icon(`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>`+path('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01')),
 black:icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2')),
 milk:icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
 both:icon(`<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>`+path('M6 9h3M15 9h3M6 13h3M15 13h3')),
 classic:icon(path('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
 decaf:icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
 either:icon(path('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'))
};
const mascot=()=>`<span class="mascot"><svg viewBox="0 0 72 72" fill="none" aria-hidden="true"><ellipse cx="36" cy="64" rx="19" ry="4" fill="#153e35" opacity=".12"/><path d="M21 37c0-17 10-29 23-29 10 0 18 8 18 19 0 16-12 30-27 31-8 .7-14-8-14-21Z" fill="#6b3d28"/><path d="M27 42c0-12 7-20 16-20 7 0 12 5 12 13 0 11-8 20-18 21-6 .4-10-5-10-14Z" fill="#9e5c38"/><path d="M28 50c7-4 14-4 21 0v9c-8 5-16 5-21 0v-9Z" fill="#ef7447"/><path d="M35 18c8 7 12 15 10 25" stroke="#f3c867" stroke-width="3" stroke-linecap="round" opacity=".9"/><g class="eye"><circle cx="35" cy="34" r="2.2" fill="#fff"/><circle cx="48" cy="34" r="2.2" fill="#fff"/><circle cx="35" cy="34" r="1" fill="#183f35"/><circle cx="48" cy="34" r="1" fill="#183f35"/></g><path d="M38 41c2.5 2 5 2 7.5 0" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M23 43c-7 1-9 5-7 9M57 43c6 1 8 5 6 9" stroke="#6b3d28" stroke-width="4" stroke-linecap="round"/><path d="M31 59v5M47 59v5" stroke="#6b3d28" stroke-width="4" stroke-linecap="round"/></svg></span>`;
const products=[
 {id:'paganini',name:'Paganini blend',short:'PAGANINI',origin:'75 % Arabica · 25 % Robusta',price:{250:11.9,500:21.5,1000:39.9},prep:['automatic','lever','moka'],taste:['balanced','unsure'],drink:['milk','black','both'],caffeine:['classic','either'],tags:['čokoláda','mandle','krémová'],reason:'Vyvážená a univerzálna káva, ktorá funguje čierna aj s mliekom.'},
 {id:'brazil',name:'Brazil Santos',short:'BRAZIL',origin:'100 % Arabica',price:{250:9.9,500:18.5,1000:34.9},prep:['automatic','lever','moka','filter'],taste:['gentle','unsure'],drink:['black','both'],caffeine:['classic','either'],tags:['kakao','sladká','nízka acidita'],reason:'Jemná a sladšia arabica s minimálnou kyslosťou.'},
 {id:'puccini',name:'Puccini blend',short:'PUCCINI',origin:'60 % Arabica · 40 % Robusta',price:{250:11.5,500:20.9,1000:38.9},prep:['automatic','lever','moka'],taste:['strong','balanced'],drink:['milk','both'],caffeine:['classic','either'],tags:['tmavá čokoláda','silná','hustá kréma'],reason:'Výrazná zmes, ktorá sa nestratí ani v cappuccine.'},
 {id:'cuba',name:'Cuba Serrano',short:'CUBA',origin:'100 % Arabica',price:{250:12.9,500:23.5,1000:43.9},prep:['lever','moka','filter'],taste:['gentle','balanced'],drink:['black'],caffeine:['classic','either'],tags:['kakao','orechy','bez acidity'],reason:'Plná arabica bez výraznej acidity pre čiernu kávu.'},
 {id:'decaf',name:'Bezkofeínová Brazil',short:'DECAF',origin:'100 % Arabica · bez kofeínu',price:{250:12.9,500:23.9,1000:44.9},prep:['automatic','lever','moka','filter'],taste:['gentle','balanced','unsure'],drink:['black','milk','both'],caffeine:['decaf'],tags:['bez kofeínu','jemná','na večer'],reason:'Chuť kávy bez povzbudivého účinku, vhodná aj večer.'}
];
const questions=[
 {key:'prep',name:'Príprava',title:'Ako kávu najčastejšie pripravujete?',help:'Vyberte zariadenie, ktoré používate najviac.',guide:'Začnime prípravou. Tá ovplyvní, ktorá káva sa rozvinie najlepšie.',options:[['automatic','machine','Automatický kávovar','Stlačím tlačidlo a káva je hotová'],['lever','lever','Pákový kávovar','Espresso pripravujem ručne'],['moka','moka','Moka kanvička','Výrazná domáca káva na sporáku'],['filter','filter','Filter alebo zalievanie','V60, French press alebo klasické zalievanie']]},
 {key:'taste',name:'Chuť',title:'Aká chuť vám sedí najviac?',help:'Nemusíte poznať odborné názvy. Stačí pocit.',guide:'Teraz doladíme chuť. Neexistuje zlá odpoveď.',options:[['gentle','gentle','Jemná a sladšia','Čokoláda, kakao, minimum horkosti'],['balanced','balanced','Vyvážená','Plná chuť bez extrémov'],['strong','strong','Silná a výrazná','Hustá kréma a intenzívnejší dojem'],['unsure','unsure','Neviem to pomenovať','Vyberte mi bezpečnú univerzálnu voľbu']]},
 {key:'drink',name:'Nápoj',title:'Ako ju pijete najčastejšie?',help:'Mlieko môže prekryť jemnejšie chuťové tóny.',guide:'Mlieko vie odporúčanie dosť zmeniť.',options:[['black','black','Čiernu','Espresso, lungo alebo filtrovanú'],['milk','milk','S mliekom','Cappuccino, flat white alebo latte'],['both','both','Striedam oboje','Potrebujem univerzálnu kávu']]},
 {key:'caffeine',name:'Kofeín',title:'Klasickú alebo bezkofeínovú?',help:'Posledná odpoveď a odporúčanie je hotové.',guide:'Už iba posledná drobnosť.',options:[['classic','classic','Klasickú','Bežná káva s kofeínom'],['decaf','decaf','Bezkofeínovú','Na večer alebo bez povzbudenia'],['either','either','Je mi to jedno','Rozhodnite hlavne podľa chuti']]}
];
window.BeanoData={$, $$, icons, mascot, products, questions};
$$('[data-brand]').forEach(el=>el.innerHTML=icons.brand);
$$('[data-icon]').forEach(el=>el.innerHTML=icons[el.dataset.icon]||'');
})();
