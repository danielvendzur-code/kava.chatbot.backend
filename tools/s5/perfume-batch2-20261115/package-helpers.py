from pathlib import Path
from PIL import Image
from lxml import html
import json,urllib.request,hashlib,datetime,importlib.util
B=Path(__file__).resolve().parent
imp=importlib.util.spec_from_file_location('factory',B/'package-factory.py');factory=importlib.util.module_from_spec(imp);imp.loader.exec_module(factory)
def photo(slug,pid,url):
 out=B/'candidate-packages'/slug/'assets';out.mkdir(parents=True,exist_ok=True);raw=urllib.request.urlopen(url,timeout=40).read();ext='.svg' if b'<svg' in raw[:400] else '.png' if raw.startswith(b'\x89PNG') else '.jpg';file=pid+ext;(out/file).write_bytes(raw);d={'id':pid,'file':file,'url':url,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'originalBytes':True,'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 if ext!='.svg':
  with Image.open(out/file) as im:d.update(width=im.width,height=im.height)
 return d
def marks(slug,logo,initial,color):
 d={'logo':photo(slug,'logo',logo)};out=B/'candidate-packages'/slug/'assets';(out/'avatar.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="{color}"/><text x="48" y="64" text-anchor="middle" font-size="52" font-family="Georgia,serif" fill="white">{initial}</text></svg>');d['avatar']={'file':'avatar.svg','role':'Factual initial avatar; not official brand mark'};return d
def source(r,kind,pack,price,stock,notes,original,photoEvidence,extra=None):
 fr={'notes':notes,'officialFamilies':[],'intensity':None,'occasion':None,'concentrationDisplay':kind,'notesEvidence':{'url':r['url'],'sourceText':original,'originalSourceText':original,'sourceLanguage':'sk' if '.sk/' in r['url'] else 'cs','scope':'Published product sensory descriptors only, not INCI or inferred ingredient percentages.'}}
 d={'series':'s5','url':r['url'],'verifiedAt':r['checkedAt'],'sourceSha256':r['sourceSha256'],'stock':'InStock','stockEvidence':stock,'priceFrom':False,'priceEvidence':{'amount':price,'currency':stock['currency'],'vatSource':r['url'],'vatEvidence':'Exact public VAT-inclusive selected SKU price, not sample minimum.'},'packEvidence':{'pack':pack,'scope':'Explicit published product pack, not shipping weight.'},'variantSelectionRequired':stock.get('variantSelectionRequired',False),'categoryLocked':True,'kindLocked':True,'photoUrl':photoEvidence['url'],'photoEvidence':photoEvidence,'fragrance':fr,'complementForProductUrls':[],'excludedClaims':['No medicinal/skin/allergy/safety/duration guarantees, numerical note strength, invented budget or cart integration.']}
 if extra:d.update(extra)
 return d
def record(pid,name,url,pack,price,currency,kind,profile,photoPath,source):
 return {'id':pid,'name':name,'url':url,'priceAmount':price,'price':(f'{price:.2f}'.replace('.',',')+' €') if currency=='EUR' else f'{price:g} Kč','currency':currency,'volume':pack,'category':'fragrance','kind':kind,'tags':[],'available':True,'isSample':False,'description':profile+'.','reason':profile+'.','photo':photoPath,'source':source}
def logo_url(raw):
 t=html.fromstring(raw.decode('utf8'));ls=t.xpath('//img[contains(@src,"/user/logos/")]/@src');return ls[0] if ls else None
def patch_alternatives(slug,products):
 # Single-question small catalogues still compare two genuinely different products.
 alt={p['id']:products[(i+1)%len(products)]['id'] for i,p in enumerate(products)}
 for p in [B/f'candidate-packages/{slug}/config.json',B.parents[2]/f'n447/s5/perfume-fragments/{slug}.config.json']:
  j=json.load(open(p));j['registryObject']['fragranceResultExtras']['alternatives']=alt;factory.save(p,j)
 p=B/f'candidate-packages/{slug}/integration-review.json';j=json.load(open(p));j['registryObject']['fragranceResultExtras']['alternatives']=alt;factory.save(p,j)
