from pathlib import Path
from lxml import html
import json,re
B=Path(__file__).resolve().parent;rs=json.load(open(B/'research/odeur/products.json'))['rows']
for r in rs:
 raw=(B/'research/odeur'/(r['id']+'.html')).read_text();t=html.fromstring(raw);match=re.search(r"dataLayer.push\(\{'shoptet'\s*:\s*",raw);pub=json.JSONDecoder().raw_decode(raw[match.end():])[0];r['publicProduct']=pub['product'];r['name']=re.sub(r'\s+',' ',t.xpath('//h1')[0].text_content()).strip();r['visibleStock']=' '.join(t.xpath('//*[contains(@class,"availability-value")]//text()')).strip();r['visiblePack']=' '.join(t.xpath('//*[contains(@class,"p-short-description")]//text()')).strip();r['sourceText']=re.sub(r'\s+',' ',t.text_content());assert r['publicProduct']['hasVariants']==False and len(r['publicProduct']['codes'])==1;assert float(r['priceMeta'][0]['content'])==19.99;print(r['id'],r['publicProduct']['codes'],r['visibleStock'])
(B/'research/odeur/verified-input.json').write_text(json.dumps({'rows':rs},ensure_ascii=False,indent=2))
