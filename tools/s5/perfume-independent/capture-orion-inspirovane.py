"""Exact official public product capture AFTER claims8da593b; no merchant submissions."""
import pathlib,json,re,urllib.request,urllib.parse,datetime,hashlib,concurrent.futures
from lxml import html
BASE=pathlib.Path(__file__).resolve().parents[3]/'tools/s5/perfume-independent';OUT=BASE/'reports/orion-inspirovane-20261111';RAW=pathlib.Path('/workspace/work/perfume-audit/orion-inspirovane-20261111');NOW=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat();CLAIM='8da593b16063e64660af29506cfb25fdff4affbd'
def text(e):return ' '.join(e.text_content().split())
def get(u):
 with urllib.request.urlopen(u,timeout=35) as r:return r.read(),r.url
ids=['p137008','p129062','p22265','p67840','p122810','p127072','p125061','p115189','p133760','p360','p18465','p118584'];lst=json.loads((RAW/'orion-listing-candidates.json').read_text());links={x['url'].rsplit('/',1)[-1]:x['url'] for x in lst};assert all(x in links for x in ids);jobs=[('orion',links[x]) for x in ids]+[('inspirovane','https://www.inspirovaneparfemy.cz/lanoir-'+x+'-parfum/') for x in ['h137-mens','h136-mens','h109-mens','f040-womens','f047-womens','f023-womens','u083-unisex','f036-womens','u093-unisex','u089-unisex','u084-unisex','u079-unisex']]
def capture(job):
 slug,u=job;pid=u.rstrip('/').rsplit('/',1)[-1];row={'id':pid,'url':u,'checkedAt':NOW()}
 try:
  raw,final=get(u);(RAW/(slug+'-'+pid+'-source.html')).write_bytes(raw);doc=html.fromstring(raw);row.update(name=text(doc.xpath('//h1')[0]),finalUrl=final,sourceSha256=hashlib.sha256(raw).hexdigest(),currency='EUR' if slug=='orion' else 'CZK',sample=False,available=True);params={}
  if slug=='orion':
   for e in doc.xpath('//*[@id="divProductDetailAttributes"]/*'):
    name=e.xpath('.//*[contains(@class,"divProductParameterTxt")]/span');v=e.xpath('.//span[contains(@class,"param_text_value")]')
    if name and v:params[text(name[0])]=text(v[0])
   volume=params.get('Objem');assert volume and re.fullmatch(r'\d+(?:[.,]\d+)?\s*ml',volume,re.I),'No exact single bottle volume';stock=text(doc.xpath('//*[@id="block_product_stock-data"]')[0]);assert 'na predajni' in stock or stock.lower()=='skladom','Not physically in-store stock';amount=float(text(doc.xpath('//*[@id="span_productPriceVAT"]')[0]).replace(' ', '').replace(',','.'));photo=urllib.parse.urljoin(u,doc.xpath('//*[@id="productMainImage"]/@href')[0]);desc=text(doc.xpath('//*[@id="tab_productDescription"]')[0]);code=text(doc.xpath('//*[@id="product-detail-code"]')[0]);row.update(pack=re.sub(r'\s*ml',' ml',volume,flags=re.I),priceAmount=amount,stock=stock,tester=params.get('Tester')=='Áno',variantId=pid,variantCode=code,taxEvidence='Exact span_productPriceVAT; simultaneous separate exVAT amount not used',photoUrl=photo,description=desc,parameters=params)
   # Broad descriptive conflicts are held for manual review, never auto-resolved from product name.
   row['descriptionVolumeMentions']=re.findall(r'\b\d+(?:[.,]\d+)?\s*ml\b',desc,re.I)
  else:
   options=doc.xpath('//select[@id="simple-variants-select"]/option');v=next(v for v in options if re.match(r'50\s*ml\b',text(v),re.I));assert 'Skladem' in text(v),'Exact50ml unavailable';assert v.get('data-customerprice'),'Missing exact price';desc=doc.xpath('//*[contains(@class,"basic-description")]');assert desc,'No official formula prose';photo=doc.xpath('//a[contains(@class,"p-main-image")]/@data-href') or doc.xpath('//a[contains(@class,"p-main-image")]/@href');assert photo
   for tr in doc.xpath('//table[contains(@class,"detail-parameters")]//tr'):
    th=tr.xpath('./th');td=tr.xpath('./td')
    if th and td:params[text(th[0]).strip(': ')]=text(td[0])
   row.update(pack='50 ml',priceAmount=float(v.get('data-customerprice')),stock='Skladem',variantId=v.get('value'),variantOption=text(v),taxEvidence='Official terms total final price includesVAT; no tax rate inferred',photoUrl=photo[0],description=text(desc[0]),parameters=params,productIdentity='Merchant INSPIRACE composition, not original referenced designer perfume',staticBadgeCaveat='Static100ML badge is not selected pack evidence. Exact50ml option and price used.',giftWrap='Optional surcharge excluded, no cart/preselection integration')
 except Exception as e:row['error']=str(e)
 return slug,row
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:rows=list(pool.map(capture,jobs))
for s in ['orion','inspirovane']:
 ps=[p for ss,p in rows if s==ss];(OUT/(s+'-source-captures.json')).write_text(json.dumps({'claimCommit':CLAIM,'scope':'Exact official HTTPS product variant/pack/price/stock/photo/prose; source capture, not extra live merchant or Preview QA.','products':ps},ensure_ascii=False,indent=2)+'\n');print(s,len(ps),'errors',[(x['id'],x['error']) for x in ps if 'error' in x],flush=True)
 for p in ps:print(p['id'],p.get('name'),p.get('pack'),p.get('priceAmount'),p.get('stock'),p.get('descriptionVolumeMentions'),p.get('parameters'),p.get('description','')[-1600:])
