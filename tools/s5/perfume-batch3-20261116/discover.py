from pathlib import Path
from lxml import html
from urllib.parse import urljoin
import urllib.request,json,datetime,hashlib,concurrent.futures,re
B=Path(__file__).resolve().parent;O=B/'research';O.mkdir(exist_ok=True)
LEADS={'lavona':'https://lavona.sk/','otuleni':'https://www.otuleni.cz/','ncn':'https://ncncandlefactory.cz/','messina':'https://www.messina-svicky.cz/','lunarium':'https://lunarium.cz/','maami':'https://www.maami.cz/','nepali':'https://www.nepali.cz/','koloco':'https://www.koloco.cz/'}
def fetch(item):
 slug,url=item;r={'slug':slug,'url':url,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'OfficialHTML discovery only, notlivewidgetQA','tlsVerified':True}
 try:
  f=urllib.request.urlopen(url,timeout=35);raw=f.read();(O/(slug+'-home.html')).write_bytes(raw);t=html.fromstring(raw);r.update(status=f.status,finalUrl=f.url,sha256=hashlib.sha256(raw).hexdigest(),title=t.xpath('string(//title)'),links=[{'text':' '.join(a.text_content().split())[:95],'url':urljoin(f.url,a.get('href'))} for a in t.xpath('//a[@href]') if not a.get('href').startswith(('#','javascript:'))],emails=sorted(set(re.findall(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',raw.decode('utf8','replace')))))
 except Exception as e:r['error']=str(e)
 (O/(slug+'-discovery.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(slug,r.get('status'),r.get('error'),flush=True)
 return r
if __name__=='__main__':list(concurrent.futures.ThreadPoolExecutor(4).map(fetch,LEADS.items()))
