import '../coffee-reply-core.js';
import '../chat-brain.js';
import '../chat-adapters.js';
const slugs=new Set(['ajvencoffee','becafe','casadelcaffe','coffeein','coffeesheep','coffeeveronia','concept','diamonds','donfranko','ebenica','goriffee','grain','grandroastery','kaffa','kavavra','kavoholik','praziarnicka','readyafter','simplecoffee','vitazov','zlatezrnko','jolka']);
const adapters=new Map();
async function catalogue(slug){if(!slugs.has(slug))return null;await import('../coffee-catalogues/'+slug+'.js');return globalThis.CX_COFFEE_CATALOGUES?.[slug]||null;}
/* Conversation-aware answer (named products, comparisons, exclusions, budget changes); null when the question is general. */
export async function brainCoffeeReply(slug,text,history=[]){const c=await catalogue(slug);if(!c)return null;if(!adapters.has(slug))adapters.set(slug,globalThis.CXChatBrain.adapters.coffee(c));return globalThis.CXChatBrain.reply(adapters.get(slug),text,history);}
export async function fullCoffeeReply(slug,text,history=[]){const c=await catalogue(slug);if(!c)return null;return (await brainCoffeeReply(slug,text,history))||globalThis.CXCoffeeReplyCore(c,text,history);}
