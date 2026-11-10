"""Public official source capture only; never reserve/register a company or contact a shop."""
import pathlib,json,re,datetime,urllib.request,urllib.parse,concurrent.futures,argparse,hashlib
from lxml import html
p=argparse.ArgumentParser();p.add_argument('--audit-root',required=True);a=p.parse_args();base=pathlib.Path(a.audit_root)
specs={
 'furiosa.cz':{'file':'furiosa.cz-perfume-collection-current.json','operator':'FURIOSA WORLD s.r.o.','ico':'02476029','select':None},
 'scentium.cz':{'file':'scentium.cz-perfume-collection-current.json','operator':'Scentium s.r.o.','ico':'24954748','select':['salt','vanilla-milk','kyoto','blanc-sesame-1','neroli-poet-100-ml','blanc-sesame','malkhut-109','ginger-tonic-fr-2018','farniente','tropical-dance','butterfly-mind','fanfarone-italiano']}}
def norm(text):return ' '.join(text.split())
def read(url):
 with urllib.request.urlopen(url,timeout=30) as r:return r.read(),r.status,r.url
jobs=[];feeds={}
for domain,spec in specs.items():
 feed=json.loads((base/spec['file']).read_text());feeds[domain]=feed;products=feed['data']['products']
 if spec['select']:products=[next(p for p in products if p['handle']==key) for key in spec['select']]
 else:products=[p for p in products if any(v['title']=='50 ml' for v in p['variants'])]
 for product in products:
  variants=[v for v in product['variants'] if v['available'] and re.search(r'\b(?:30|50|75|100)\s*ml\b',v['title'])];assert variants,(domain,product['handle'])
  variant=next((v for v in variants if v['title']=='50 ml'),variants[0]);jobs.append((domain,product,variant))
def capture(job):
 domain,p,v=job;at=datetime.datetime.now(datetime.timezone.utc).isoformat();url='https://'+domain+'/products/'+urllib.parse.quote(p['handle'],safe='');row={'name':p['title'],'vendor':p['vendor'],'sourceProductId':p['id'],'variantId':v['id'],'requestedUrl':url,'checkedAt':at}
 try:
  raw,status,final=read(url);doc=html.fromstring(raw);canonical=doc.xpath('//link[@rel="canonical"]/@href');h1=[norm(e.text_content()) for e in doc.xpath('//h1')];description=norm(' '.join(html.fromstring(p['body_html']).itertext()));m=re.search(r'HLAVA\s*:',description,re.I);notes=description[m.start():] if m else None
  assert notes,'Explicit official pyramid not found';head=re.search(r'HLAVA\s*:\s*(.*?)\s*SRDCE\s*:\s*(.*?)\s*Z[ÁA]KLAD\s*:\s*(.*)',notes,re.I);assert head,'Pyramid needs manual review'
  pyramid=dict(zip(['top','heart','base'],[x.strip() for x in head.groups()]));pyramid['base']=re.split(r'Charakter vůně|FURIOSA®',pyramid['base'],flags=re.I)[0].strip()
  main=doc.xpath('//main');maintext=norm(' '.join(main[0].xpath('.//text()[not(ancestor::script) and not(ancestor::style)]'))) if main else ''
  row.update({'status':status,'url':canonical[0] if canonical else final,'finalUrl':final,'h1':h1,'priceAmount':float(v['price']),'currency':'CZK','pack':v['title'],'available':v['available'],'sourceFeed':feeds[domain]['url'],'sourceFeedAt':feeds[domain]['verifiedAt'],'priceStockPackSource':'Exact official Shopify variant id, price and pack; not a starting-price inference.','photoUrls':[i['src'] for i in p['images'][:3]],'notePyramid':pyramid,'notesExcerpt':notes,'officialFamilies':[],'intensity':None,'occasion':None,'concentration':'UNKNOWN','taxTextOnPage':'Včetně daní' if 'Včetně daní' in maintext else None,'otherAvailablePacks':[{'pack':x['title'],'priceAmount':float(x['price']),'variantId':x['id']} for x in p['variants'] if x['available'] and x['id']!=v['id']],'needsMerchantPackSelection':len(p['variants'])>1,'photoDownloaded':False})
  if domain=='scentium.cz' and p['handle']=='salt':row['sourceCaveat']='Narrative mentions bergamot/coconut, final official pyramid differs. Use only recorded final pyramid; do not merge them or infer salt from the product name.'
  if domain=='scentium.cz' and p['handle']=='blanc-sesame':row['sourceCaveat']='Canonical merchant handle is blanc-sesame, but the official product title/vendor is Coco Santal / RAAW ALCHEMY. Do not construct a URL from the name.'
  if domain=='scentium.cz' and p['handle']=='malkhut-109':row['sourceCaveat']='30 ml variant unavailable in official feed. Selected source pack is available 50 ml / 1390 CZK, not lowest 30 ml / 990 CZK.'
 except Exception as e:row['error']=str(e)[:700]
 return domain,row
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:captures=list(pool.map(capture,jobs))
for domain,spec in specs.items():
 rows=[r for d,r in captures if d==domain];out={'domain':domain,'operator':spec['operator'],'ico':spec['ico'],'country':'CZ','status':'OFFICIAL_SOURCE_PREPARATION_NOT_RESERVED_NOT_LIVE_QA','reviewedFormulaCount':len(rows),'officialCollectionListingCount':len(feeds[domain]['data']['products']),'collectionUrl':feeds[domain]['url'],'countLimit':'Reviewed formulas only. Samples, travel sizes/refills and gift sets are not new formulas. Global storefront feed is paginated and not claimed fully counted.','revenue':'UNKNOWN','widget':'LIVE_QA_PENDING_NO_CALLABLE_SUPPORTED_BROWSER','operatorFreshReview':'PENDING_FRESH_OFFICIAL_LEGAL_AND_ARES','products':rows,'errors':[r for r in rows if 'error' in r]};f=base/(domain+'-next-source-preparation.json');f.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(domain,'captured',len(rows),'errors',len(out['errors']),flush=True)
