"""Official exact sample-variant capture after claims d0be27d. GET only."""
import pathlib,json,urllib.request,urllib.parse,datetime,re,concurrent.futures,hashlib
from lxml import html
ROOT=pathlib.Path(__file__).resolve().parents[3];OUT=ROOT/'tools/s5/perfume-independent/reports/essentique-fragrancesamples-20261111';RAW=pathlib.Path('/workspace/work/perfume-audit/essentique-fragrancesamples-20261111/sources');RAW.mkdir(parents=True,exist_ok=True)
paths={'essentique':['bois-imperial','ganymede','guidance','angels-share','delina-exclusif','not-a-perfume','the-ghost-in-the-shell','orange-x-santal','hundred-silent-ways','divine-vanille','cherry-ink','eilish-no-2'],'fragrancesamples':['mancera-french-riviera','note-de-yuzu','parfums-de-marly-percival-edp','mancera-cedrat-boise','spicebomb-extreme-od-viktor-rolf','zimaya-sharaf-blend-edp','versace-bright-crystal-absolu','jean-paul-gaultier-scandal-eau-de-parfum','lancome-la-vie-est-belle','ysl-libre','burberry-goddess-intense','prada-candy-eau-de-parfum']}
def text(e):return ' '.join(e.text_content().split())
def capture(job):
 slug,handle=job;domain='www.'+slug+('.sk' if slug=='essentique' else '.cz');url='https://'+domain+'/'+handle+'/';at=datetime.datetime.now(datetime.timezone.utc).isoformat();row={'id':handle,'url':url,'checkedAt':at}
 try:
  with urllib.request.urlopen(url,timeout=35) as r:raw=r.read();status=r.status;final=r.url
  (RAW/(slug+'-'+handle+'.html')).write_bytes(raw);doc=html.fromstring(raw);script='\n'.join(doc.xpath('//script/text()'));m=re.search(r'shoptet\.variantsSplit\.necessaryVariantData\s*=\s*',script);assert m,'No exact variant data';variants=json.JSONDecoder().raw_decode(script[m.end():])[0]
  selects=doc.xpath('//select[@data-parameter-id]');assert len(selects)==1,'Ambiguous multi-parameter variants';sel=selects[0];opt=next((e for e in sel.xpath('./option') if re.fullmatch(r'2\s*ml',text(e),re.I)),None);assert opt is not None,'No 2 ml variant';key=sel.get('data-parameter-id')+'-'+opt.get('value');v=variants[key];assert v['isNotSoldOut'] and v.get('availabilityName') in ['Skladom','Skladem'],'Selected variant not explicitly in stock'
  short=doc.xpath('//*[contains(@class,"p-short-description")]');basic=doc.xpath('//*[contains(@class,"basic-description")]');params={}
  for tr in doc.xpath('//table[contains(@class,"detail-parameters")]//tr'):
   th=tr.xpath('./th');td=tr.xpath('./td')
   if th and td:params[text(th[0]).strip(': ')]=text(td[0])
  picture=v.get('variantImage',{}).get('big');assert picture,'Missing official variant image'
  row.update({'status':status,'finalUrl':final,'name':text(doc.xpath('//h1')[0]),'priceAmount':v['priceUnformatted'],'priceDisplay':v['price'],'currency':'EUR' if slug=='essentique' else 'CZK','pack':'2 ml','sample':True,'available':True,'stock':v['availabilityName'],'variantKey':key,'variantId':v['id'],'variantCode':v['code'],'variantOptionValue':opt.get('value'),'merchantVariantParameter':sel.get('data-parameter-id'),'canonicalUrl':(doc.xpath('//link[@rel="canonical"]/@href') or [final])[0],'sourceSha256':hashlib.sha256(raw).hexdigest(),'shortDescription':text(short[0]) if short else '', 'description':text(basic[0]) if basic else '', 'parameters':params,'photoUrl':picture,'descriptionImages':[(e.get('src'),e.get('alt')) for block in short+basic for e in block.xpath('.//img')],'otherVariants':[{'key':k,'id':vv['id'],'code':vv['code'],'price':vv['priceUnformatted'],'stock':vv.get('availabilityName'),'available':vv['isNotSoldOut']} for k,vv in variants.items()]})
 except Exception as e:row['error']=str(e)
 return slug,row
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(capture,[(s,h) for s,hs in paths.items() for h in hs]))
report={'scope':'Official HTTPS HTML exact embedded Shoptet variant and label mapping after reservation. Merchant stock statements, not a cart verification. One2ml sample per distinct formula.','claimCommit':'d0be27da162949b45960ae76085e8f2f527fe356','paidModelCalls':0,'companies':{s:[r for ss,r in rows if ss==s] for s in paths}}
(OUT/'selected-variant-source-captures.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
for s,ps in report['companies'].items():print(s,'captured',len(ps),'errors',[(p['id'],p['error']) for p in ps if 'error' in p],flush=True)
