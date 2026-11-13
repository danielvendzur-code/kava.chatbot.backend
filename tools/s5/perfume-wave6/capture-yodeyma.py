from pathlib import Path
from lxml import html
import urllib.request,json,re,datetime,hashlib
B=Path(__file__).resolve().parent;O=B/'research/yodeymaparfemy';O.mkdir(exist_ok=True);home=html.fromstring((B/'research/initial-audit/yodeyma.raw').read_bytes());links=list(dict.fromkeys(home.xpath('//a[@href]/@href')));links+=html.parse('/workspace/work/perfume-audit/wave6-20261113/merchant-live/yodeymaparfemy-product.html').xpath('//a[@href]/@href');chosen=['iris','cheante','kara','caribbean','power','root'];rows=[]
for pid in chosen:
 if (O/(pid+'.json')).exists():rows.append(json.load(open(O/(pid+'.json'))));continue
 urls=[x for x in links if re.search('/(?:yodeyma-)?'+pid+'(?:-|/)',x)];assert urls,(pid,links[:8]);url='https://www.yodeymaparfemy.cz'+urls[0] if urls[0].startswith('/') else urls[0]
 with urllib.request.urlopen(url,timeout=30) as f:raw=f.read();assert f.status==200
 t=html.fromstring(raw);(O/(pid+'.html')).write_bytes(raw);offers=[]
 for e in t.xpath('//*[@itemtype="https://schema.org/Offer"]'):
  offers.append({i.get('itemprop'):i.get('content') or i.get('href') for i in e.xpath('./meta|./link')})
 variants=[]
 for v in t.xpath('//input[@type="radio" and @name="priceId" and @value!=""]'):
  label=v.getparent();titles=label.xpath('.//*[@title]/@title');variants.append({'priceId':v.get('value'),'label':titles[0] if titles else '', 'attributes':dict(v.attrib)})
 detail=t.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," basic-description ")]');detail=detail[0] if detail else t.xpath('//*[@id="description"]')[0];text=re.sub(r'\s+',' ',detail.text_content()).strip();row={'id':pid,'name':'Yodeyma '+pid.capitalize(),'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceSha256':hashlib.sha256(raw).hexdigest(),'offers':offers,'variants':variants,'description':text};rows.append(row);(O/(pid+'.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2));print(pid,[(v['priceId'],v['label'],v['attributes'].get('data-customerprice')) for v in variants],text[-1600:],flush=True)
(O/'products.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2))
