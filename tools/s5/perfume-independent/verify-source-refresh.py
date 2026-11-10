"""Read-only price/pack/stock recheck of the 36 reserved official source pages."""
import pathlib,json,re,datetime,urllib.request,concurrent.futures,argparse
from lxml import html
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--retry-report');p.add_argument('--retry-scope',action='store_true');a=p.parse_args();root=pathlib.Path(__file__).resolve().parents[3]
jobs=[]
for slug in ['adoraniche','nicheandglow','scentisimo']:
 d=json.loads((root/f'n447/s5/sources/{slug}/verified-products.json').read_text());jobs.extend((slug,x) for x in d['products'])
previous=json.loads(pathlib.Path(a.retry_report).read_text()) if a.retry_report else None
if previous:
 retry={(r['slug'],r['id']) for r in previous['rows'] if r.get('packSourceScope') not in ['VARIANT_ROW','PRODUCT_TITLE_AND_DESCRIPTION']} if a.retry_scope else {(r['slug'],r['id']) for r in previous['reviewRequired']};jobs=[j for j in jobs if (j[0],j[1]['id']) in retry]
def norm(t):return ' '.join(t.split())
def amount(t):return float(re.search(r'\d+(?:[.,]\d+)?',t.replace(' ','').replace('\u00a0','')).group().replace(',','.'))
def verify(job):
 slug,p=job;result={'slug':slug,'id':p['id'],'url':p['url'],'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'expectedPrice':p['priceAmount'],'expectedPack':p['volume']}
 try:
  with urllib.request.urlopen(p['url'],timeout=30) as r:raw=r.read();result.update({'status':r.status,'finalUrl':r.url})
  d=html.fromstring(raw);form=d.xpath('//*[@id="product-detail-form"]')[0];offers=form.xpath('.//*[@itemtype="https://schema.org/Offer"]');variants=d.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," variant-name-wrapper ")]')
  if variants:
   result['packSourceScope']='VARIANT_ROW'
   target=[(i,e.getparent()) for i,e in enumerate(variants) if re.search(r'Objem:\s*'+p['volume'].split()[0]+r'\s*ml\b',e.text_content())];assert len(target)==1,'Exact pack row not found'
   index,row=target[0];visible=row.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," price-final ")]')[0];offer=offers[index];stockText=norm(row.text_content());packText=stockText
  else:
   result['packSourceScope']='PRODUCT_TITLE_AND_DESCRIPTION'
   assert len(offers)==1,'Multiple offers require explicit pack review';offer=offers[0];visible=form.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," price-final ")]')[0];stockText=' | '.join(norm(e.text_content()) for e in form.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," availability-value ")]'));packText=norm(' '.join(' '.join(e.itertext()) for e in d.xpath('//h1 | //*[contains(@class,"p-short-description")] | //*[@id="description"]')))
  price=amount(norm(visible.text_content()));schema=float(offer.xpath('.//meta[@itemprop="price"]/@content')[0]);stock=offer.xpath('.//link[@itemprop="availability"]/@href')[0];currency=offer.xpath('.//meta[@itemprop="priceCurrency"]/@content')[0]
  packFound=bool(re.search(r'\b'+p['volume'].split()[0]+r'\s*ml\b',packText,re.I));result.update({'visiblePrice':norm(visible.text_content()),'priceAmount':price,'schemaAmount':schema,'currency':currency,'stockSchema':stock,'stockText':stockText,'packFound':packFound,'unchangedPricePackAvailable':price==schema==p['priceAmount'] and currency==p['currency'] and stock.endswith('/InStock') and packFound})
 except Exception as e:result.update({'unchangedPricePackAvailable':False,'error':str(e)[:700]})
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(verify,jobs))
if previous:
 changes={(r['slug'],r['id']):r for r in rows};rows=[changes.get((r['slug'],r['id']),r) for r in previous['rows']]
out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Official HTTPS HTML/microdata refresh; not rendered merchant widget or Preview QA. No messages/cart/model calls.','rows':rows,'checked':len(rows),'unchanged':sum(r['unchangedPricePackAvailable'] for r in rows),'reviewRequired':[r for r in rows if not r['unchangedPricePackAvailable']],'paidModelCalls':0};dest=pathlib.Path(a.output);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'checked':out['checked'],'unchanged':out['unchanged'],'reviewRequired':out['reviewRequired']},ensure_ascii=False))
