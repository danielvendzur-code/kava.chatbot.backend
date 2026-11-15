from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,re,concurrent.futures,datetime,hashlib
B=Path(__file__).resolve().parent/'research';sources=[json.load(open(p)) for p in B.glob('*-discovery.json')];tasks=[]
for r in sources:
 if r.get('status')!=200:continue
 links=[u for u in r.get('legalLinks',[]) if any(x in u.lower() for x in ['podm','terms'])];links=links[:1] if links else [u for u in r.get('legalLinks',[]) if 'kontakt' in u][:1]
 for u in links:tasks.append((r['slug'],urljoin(r['finalUrl'],u)))
def run(it):
 slug,url=it;d={'slug':slug,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  f=urllib.request.urlopen(url,timeout=30);raw=f.read();ext='.pdf' if raw.startswith(b'%PDF') else '.html';p=B/(slug+'-legal'+ext);p.write_bytes(raw);d.update(status=f.status,sha256=hashlib.sha256(raw).hexdigest())
  if ext=='.pdf':
   import subprocess
   dest=p.with_suffix('.txt');subprocess.run(['pdftotext','-layout',str(p),str(dest)],check=True);text=dest.read_text()
  else:
   t=html.fromstring(raw)
   for x in t.xpath('//script|//style'):x.getparent().remove(x)
   text=' '.join(t.text_content().split())
  d['icoHints']=re.findall(r'IČO?\s*:?\s*([0-9][0-9 \u00a0]{6,15})',text,re.I)[:6];d['operatorSnippets']=[]
  for m in list(re.finditer(r's\.\s*r\.\s*o\.|IČO?\s*:',text,re.I))[:5]:d['operatorSnippets'].append(text[max(0,m.start()-100):m.start()+140])
 except Exception as e:d['error']=str(e)
 (B/(slug+'-legal.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2));return d
rows=list(concurrent.futures.ThreadPoolExecutor(5).map(run,tasks));(B/'legal-discovery.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(json.dumps(rows,ensure_ascii=False,indent=2))
