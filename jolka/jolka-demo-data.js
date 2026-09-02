/* Adapts verified Jolka catalogue data to the shared clean coffee runtime. */
(() => {
  'use strict';
  if (!window.JOLKA) return;
  window.JOLKA.demo = {
    id:'jolka',
    rootId:'jolka-root',
    pageClass:'jolka-page',
    heroProductId:'zmes-jolka',
    logoInk:'/assets/jolka/logo-ink.webp',
    logoBadge:'/assets/jolka/logo-badge.webp',
    logoHeader:'/assets/jolka/logo-ink.webp',
    logoAvatar:'/assets/jolka/logo-badge.webp',
    heroImage:'/assets/jolka/hero-bags.webp',
    entryImage:'/assets/jolka/zmes-jolka.webp',
    eyebrow:'Pre tím Pražiarne Jolka',
    heroTitle:'Vitajte vo vašom návrhu kávového poradcu pre Pražiareň Jolka.',
    heroLead:'Poradca odpovie na pôvod, chuť aj prípravu a cez štyri krátke otázky odporučí jednu konkrétnu kávu.',
    heroHint:'Používa reálny katalóg a chuťové profily Pražiarne Jolka.',
    heroImageAlt:'Kávy Pražiarne Jolka',
    ownerCredit:'ukážka pre Pražiareň Jolka',
    teaserTitle:'Nájdite svoju kávu',
    teaserText:'4 otázky · jedno odporúčanie',
    dialogLabel:'Kávový poradca Pražiareň Jolka',
    advisorLabel:'Online poradca',
    entryKicker:'Kávový výber',
    entryTitle:'Nájdite svoju kávu',
    entryText:'4 otázky · jedno odporúčanie'
  };
})();
