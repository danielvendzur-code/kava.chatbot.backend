import '../coffee-reply-core.js';
const slugs=new Set(['ajvencoffee','becafe','casadelcaffe','coffeein','coffeesheep','coffeeveronia','concept','diamonds','donfranko','ebenica','goriffee','grain','grandroastery','kaffa','kavavra','kavoholik','praziarnicka','readyafter','simplecoffee','vitazov','zlatezrnko','jolka']);
export async function fullCoffeeReply(slug,text,history=[]){if(!slugs.has(slug))return null;await import('../coffee-catalogues/'+slug+'.js');const c=globalThis.CX_COFFEE_CATALOGUES?.[slug];return c?globalThis.CXCoffeeReplyCore(c,text,history):null;}
