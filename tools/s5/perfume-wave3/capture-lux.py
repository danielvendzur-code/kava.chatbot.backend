"""Official read-only exact-variant snapshots; no forms/cart/widget messages."""
from pathlib import Path
from lxml import html
import urllib.request,json,datetime,hashlib,re,concurrent.futures
BASE=Path(__file__).resolve().parent;OUT=BASE/'research/luxparfum';OUT.mkdir(parents=True,exist_ok=True);paths=json.load(open('/workspace/work/perfume-audit/wave3-20261113/lux-chosen-paths.json'))
def get(pair):
 pid,path=pair;url='https://www.luxparfum.cz'+path;b=urllib.request.urlopen(url,timeout=30).read();(OUT/(pid+'.html')).write_bytes(b);t=html.fromstring(b.decode());text=lambda x:re.sub(r'\s+',' ',x.text_content()).strip();variants=[]
 for x in t.xpath('//*[@data-testid="productVariant"]'):
  pack=x.xpath('.//*[@data-testid="productVariantName"]');price=x.xpath('.//*[@data-testid="productVariantPrice"]');form=x.xpath('.//input[@name="priceId"]/@value');stock=x.xpath('.//*[@data-testid="numberAvailabilityAmount"]');variants.append({'pack':text(pack[0]),'price':text(price[0]),'priceId':form[0] if form else None,'visible':text(x),'stockQuantity':text(stock[0]) if stock else None})
 desc=t.xpath('//*[@id="description"]')[0];notes=[]
 for h in desc.xpath('.//*[self::h2 or self::h3 or self::h4 or self::strong]'):
  if text(h) in ['Hlava','Srdce','Základ']:
   nxt=h.getnext();notes.append({'stage':text(h),'notes':text(nxt) if nxt is not None else ''})
 imgs=t.xpath('//img[contains(@src,"/shop/big/")]/@src');photo=imgs[0] if imgs else None
 row={'id':pid,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'htmlSha256':hashlib.sha256(b).hexdigest(),'name':text(t.xpath('//h1')[0]),'variants':variants,'descriptionText':text(desc),'pyramid':notes,'photoUrl':photo,'logoUrl':t.xpath('//img[contains(@alt,"LUX PARFUM")]/@src')[0],'parameters':[(text(x.xpath('./th')[0]),text(x.xpath('./td')[0])) for x in t.xpath('//tr[th and td]')],'photoMeaning':'Official illustrative merchant composition image; inspired perfume is not the designer original.'}
 print(pid,variants,notes,flush=True);return row
rows=list(concurrent.futures.ThreadPoolExecutor(3).map(get,paths.items()));(OUT/'products.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2)+'\n')
