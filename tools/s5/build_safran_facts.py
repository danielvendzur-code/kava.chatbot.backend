"""Reviewed representative Safran facts. Variant URLs are official schema links, never invented."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
from lxml import html
from PIL import Image,ImageDraw
import json,datetime,re
R=Path('n447/s5/sources/safran');A=Path('assets/s3/safran');A.mkdir(parents=True,exist_ok=True)
review={x['slug']:x for x in json.loads((R/'variant-review.json').read_text())}
captured={x['slug']:x for x in json.loads((R/'captured-products.json').read_text())}
# source slug, id, title, category, kind, pack, variant suffix, traits, factual description, focus, role
specs=[
('prirodni-dvoufazovy-odlicovac','face-remover','Dvoufázový odličovač','face','Dvoufázový odličovač','100 ml','prirodni-dvoufazovy-odlicovac-2-varianty',{'careUse':'cleansingCare','purpose':'makeupRemoval'},'Růžová voda, arganový a mandlový olej pro odlíčení pleti a očního okolí.','Růžová voda, arganový a mandlový olej','cleanser'),
('prirodni-pletove-mydlo-s-arganovym-olejem-a-hedvabim','face-soap','Pleťové mýdlo s arganovým olejem a hedvábím','face','Pleťové mýdlo','cca 90 g ± 5 % · bez obalu','prirodni-pletove-mydlo-s-arganovym-olejem-a-hedvabim-bez-obalu',{'careUse':'cleansingCare','purpose':'washing'},'Tuhé mýdlo na mytí pleti s arganovým olejem a hedvábím, bez parfemace a esenciálních olejů.','Bez parfemace, arganový olej a hedvábí','cleanser'),
('arganovy-olej','face-argan','BIO arganový olej','face','Pleťový olej','50 ml · pipeta','arganovy-olej-50-ml',{'careUse':'dailyCare','purpose':'moisturise','careVariant':'sVersatile'},'Jednodruhový arganový olej na pleť, nehtové okolí i vlasové délky; balení s pipetou.','Pleť, nehtové okolí a vlasové délky','oil'),
('bio-sipkovy-olej-lisovany-za-studena','face-rosehip','BIO šípkový olej','face','Pleťový olej','30 ml · pumpička','bio-sipkovy-olej-lisovany-za-studena',{'careUse':'dailyCare','purpose':'moisturise','careVariant':'sMature'},'Za studena lisovaný šípkový olej pro zjemnění suché a zralé pleti; balení s pumpičkou.','Jednodruhový olej pro suchou a zralou pleť','oil'),
('prirodni-mydlo-se-zelenym-jilem-a-aktivnim-uhlim','body-teatree','Mýdlo se zeleným jílem a aktivním uhlím','body','Tuhé mýdlo','cca 90 g ± 5 % · bez obalu','prirodni-mydlo-se-zelenym-jilem-a-aktivnim-uhlim-bez-obalu',{'careUse':'sBodyWash','purpose':'washing','careVariant':'sFresh'},'Mýdlo na ruce i tělo se zeleným jílem, aktivním uhlím a svěží bylinnou vůní tea tree.','Bylinná vůně tea tree','cleanser'),
('prirodni-100-olivove-mydlo','body-olive','100% olivové mýdlo','body','Tuhé mýdlo','cca 90 g ± 5 % · bez obalu','prirodni-100-olivove-mydlo-bez-obalu',{'careUse':'sBodyWash','purpose':'washing','careVariant':'withoutFragrance'},'Jednoduché olivové mýdlo pro mytí rukou i těla, bez parfemace a barviv.','Bez parfemace a barviv','cleanser'),
('sos-olej-na-zadery','hand-cuticle','SOS olej na nehtovou kůžičku','body','Olej na nehtovou kůžičku','5 ml · roll-on','sos-olej-na-zadery',{'careUse':'specificArea','purpose':'handCare'},'Olejová péče o suchou kůžičku kolem nehtů, v malém roll-on balení.','Cílená péče o nehtové okolí','oil'),
('zjemnujici-balzam-na-ztvrdlou-kuzi','foot-balm','Zjemňující balzám na paty','body','Balzám na paty','90 g','zjemnujici-balzam-na-paty-90-g',{'careUse':'specificArea','purpose':'footCare','careVariant':'sFootSoften','texture':'creamTexture'},'Balzám pro zjemnění suché a zrohovatělé pokožky pat.','Zjemnění suché pokožky pat','cream'),
('prirodni-peelingove-mydlo-s-pemzou-a-salveji','foot-soap','Peelingové mýdlo s pemzou a šalvějí','body','Peelingové mýdlo','cca 90 g ± 5 % · bez obalu','prirodni-peelingove-mydlo-s-pemzou-a-salveji-bez-obalu',{'careUse':'specificArea','purpose':'footCare','careVariant':'sFootWash'},'Mýdlo pro důkladné mytí chodidel, s pemzou a šalvějí.','Mytí chodidel s pemzou a šalvějí','cleanser'),
('sampuk-na-vlasy-s-ruzovym-jilem-a-geraniem','hair-geranium','Šampuk s růžovým jílem a geraniem','hair','Tuhý šampon','60 g · ovál','sampuk-na-vlasy-s-ruzovym-jilem-a-geraniem-60-oval',{'careUse':'cleansingCare','purpose':'hairWashing'},'Tuhý šampon s růžovým jílem, geraniem, keratinem a rýžovým proteinem pro mytí vlasů.','Růžový jíl, geranium a rýžový protein','shampoo'),
('prirodni-balzam-na-rty-s-rakytnikem','lip-seabuckthorn','Balzám na rty s rakytníkem','lips','Balzám na rty','cca 10 g','prirodni-balzam-na-rty-s-rakytnikem',{},'Balzám s rostlinnými másly, oleji a včelím voskem pro péči o rty.','Rakytník, rostlinná másla a včelí vosk','cream')]
products=[];tasks=[]
for slug,id,name,cat,kind,pack,suffix,traits,desc,focus,role in specs:
 v=next(x for x in review[slug]['variants'] if x['url'].rstrip('/').rsplit('/',1)[-1]==suffix); assert v['available']=='InStock'
 raw=captured[slug]; im=v.get('image') or raw['photo']; im=im[0] if isinstance(im,list) else im
 price=float(v['price']); path=A/(id+'.webp')
 source={'series':'s5','url':raw['url'],'verifiedAt':raw['checkedAt'],'captureDate':'2026-11-10','stock':'InStock','priceFrom':False,'categoryLocked':True,'kindLocked':True,'routineRoleVerified':True,'routineRole':role,'routineRoleEvidence':{'url':raw['url'],'form':kind},'selectionTraits':traits,'selectionTraitsEvidence':{'url':raw['url'],'facts':desc},'skinTypesListed':[],'focus':focus,'photoUrl':im,'priceEvidence':{'retailIncludingVAT':price,'officialVariant':v,'visibleRetailPriceCheck':'PENDING direct variant page confirmation'},'packEvidence':{'pack':pack,'officialVariantProperties':v.get('props',[]),'excerpts':review[slug]['packExcerpts']},'complementForProductUrls':[],'excludedClaims':['medical/healing','specific days until effect','SPF protection','allergy-safe guarantee','arbitrary skin type inference']}
 products.append({'id':id,'name':name,'url':v['url'],'priceAmount':price,'price':str(int(price))+' Kč','currency':'CZK','volume':pack,'variantLabel':'','category':cat,'kind':kind,'tags':[],'available':True,'isSample':False,'description':desc,'reason':desc,'photo':'/'+str(path),'source':source})
 tasks.append((id,im,path,v['url']))
small={'face-remover':('prirodni-dvoufazovy-odlicovac','prirodni-dvoufazovy-odlicovac-2-varianty2','50 ml'),'foot-balm':('zjemnujici-balzam-na-ztvrdlou-kuzi','zjemnujici-balzam-na-paty-45-g','45 g'),'hair-geranium':('sampuk-na-vlasy-s-ruzovym-jilem-a-geraniem','sampuk-na-vlasy-s-ruzovym-jilem-a-geraniem-15','15 g')}
for p in products:
 if p['id'] in small:
  slug,suffix,pack=small[p['id']];v=next(x for x in review[slug]['variants'] if x['url'].split('/')[-1]==suffix);assert v['available']=='InStock';p['source']['variants']=[{'label':pack,'price':float(v['price']),'url':v['url'],'available':True,'source':captured[slug]['url']}];tasks.append((p['id']+'-small',None,None,v['url']))
# Manufacturer explicitly pairs the foot wash with heel balm. Only this same-area cosmetic pair.
wash=next(p for p in products if p['id']=='foot-soap');balm=next(p for p in products if p['id']=='foot-balm');balm['source']['complementForProductUrls']=[wash['url']]
def fetch(task):
 id,im,path,url=task
 if im and not path.exists():
  data=urlopen(im,timeout=25).read();original=A/(id+'.source');original.write_bytes(data)
  Image.open(original).convert('RGB').save(path,quality=90)
 target=R/'variants'/ (id+'.html');target.parent.mkdir(exist_ok=True)
 if not target.exists():target.write_bytes(urlopen(url,timeout=25).read())
 t=html.fromstring(target.read_bytes());body=' '.join(t.text_content().split());h=' '.join(t.xpath('//h1//text()'))
 print(id,h[:100],flush=True)
 return {'id':id,'url':url,'title':h,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'text':body}
with ThreadPoolExecutor(max_workers=3) as pool: confirmations=list(pool.map(fetch,tasks))
(R/'variant-page-checks.json').write_text(json.dumps(confirmations,ensure_ascii=False,indent=2)+'\n')
t=html.fromstring((R/'contact.html').read_bytes());logo=next(x.get('src') for x in t.xpath('//img') if x.get('alt')=='Logo');fav=t.xpath('//link[contains(@rel,"icon")]/@href')[0]
for name,u in [('logo.png',logo),('favicon.ico',fav)]:
 dest=A/name
 if not dest.exists():dest.write_bytes(urlopen(urljoin('https://www.mydlarnasafran.cz/',u),timeout=25).read())
Image.open(A/'favicon.ico').convert('RGBA').save(A/'avatar.png')
(R/'verified-products.json').write_text(json.dumps({'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':'https://www.mydlarnasafran.cz/','collectionMethod':'Reviewed official Eshop-rychle product HTML and exact InStock variant schema links, VAT-inclusive retail prices. No cart/contact/model requests.','notes':['11 representative formulas; rosehip face peeling OutOfStock excluded.','15g shampoo and smaller45g heel/50ml remover are linked variants, not extra formulas.','All soap packaging variants except unwrapped are OutOfStock; use exact unwrapped URL/photo.','Claim times, pain/eczema/healing/SPF guarantees excluded.','Variant-page visible amount confirmation and visual photo review PENDING.'],'products':products},ensure_ascii=False,indent=2)+'\n')
canvas=Image.new('RGB',(1200,1000),'#eee');d=ImageDraw.Draw(canvas)
for i,p in enumerate(products):
 im=Image.open('.'+p['photo']).convert('RGB');im.thumbnail((285,270));x=(i%4)*300;y=(i//4)*330;canvas.paste(im,(x+(300-im.width)//2,y));d.text((x+8,y+275),p['id'],fill='black')
canvas.save(R/'packshot-review.jpg',quality=90)
print('Safran11 source products,3 smaller variants, photos captured. REVIEW PENDING.',flush=True)
