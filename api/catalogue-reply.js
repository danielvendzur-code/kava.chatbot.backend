import '../catalogue-data.js';
import '../catalogue-reply-core.js';
const catalogues=globalThis.CX_CATALOGUES || {};
export const catalogueReply=(slug,text)=>globalThis.CXCatalogueReplyCore(catalogues,slug,text);
