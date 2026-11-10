"""Main owner integration of reviewed, reserved perfume firms; no engine edits here."""
from pathlib import Path
import json
P='/assets/s3/scenes-k2/'
maps={
 'adoraniche':{'green':'citrus','clean':'rose','gourmand':'cocoa','adam':'rose','paper-soap':'hand-wash','nature':'lemon-tree','bain':'coconut','chai':'black-tea','cloud':'milk','blond':'chocolate'},
 'nicheandglow':{'green':'matcha','floral':'jasmine','gourmand':'coffee-beans','wood':'sandalwood','santalist':'sandalwood','helenist':'coconut','crispy':'coconut','skin-fetish':'incense','nectarina':'grapes','float':'jasmine','matcha':'matcha','croissant':'coffee-beans'}
}
notes={
 'adoraniche':{'green':'Od citrusov cez figu až po liči.','clean':'Ruža, mydlový dojem alebo mliečny púder.','gourmand':'Čajové, kokosové či dezertné akordy.','wood':'Drevitý, zemitý a jemne kožený charakter.'},
 'nicheandglow':{'green':'Fíkové, ovocné nebo čajové akordy.','floral':'Pivoňka, jasmín a pomerančový květ.','gourmand':'Kávové akordy s kokosem nebo tonkou.','wood':'Od santalu přes vetiver až po oud.'}
}
registry=Path('n447/s5/registry.js');text=registry.read_text()
for slug in maps:
 c=json.loads(Path(f'n447/s5/perfume-fragments/{slug}.config.json').read_text())
 raw=Path(f'n447/s5/perfume-fragments/{slug}.registry.js').read_text();reg=json.loads(raw[raw.index(' = {')+3:].strip().removesuffix(';'))
 catraw=Path(f'catalogues/{slug}.js').read_text();cat=json.loads(catraw[catraw.index(' = {')+3:].strip().removesuffix(';'))
 byid={p['id']:p for p in cat['products']}
 for key,note in notes[slug].items():reg['traitCopy'][key][1]=note;reg['traitCopy'][key][3]=note
 photos={k:[P+v+'.jpg'] for k,v in maps[slug].items()}
 for product in cat['products']:
  key=product['source']['selectionTraits']['fragranceProfile']
  photos.setdefault(key,[product['photo']])
 if slug=='adoraniche':photos['wood']=[byid['nucleus']['photo']]
 reg['choicePhotos']=photos;reg['compareProductIds']=c['compareProductIds'];reg['compareFocus']=True;reg['upsellFocus']={}
 reg['segmentText']={'entryNote':'Tóny vône · konkrétny profil · porovnanie' if slug=='adoraniche' else 'Tóny vůně · konkrétní profil · porovnání'}
 for key,value in reg['stepCopy'].items():value.append('Tóny vône' if slug=='adoraniche' else 'Tóny vůně')
 for ps in photos.values():
  for p in ps:assert Path('.'+p).is_file(),p
 assert 'demos.'+slug+'=' not in text,'Already registered; preserve WIP'
 text=text.replace('\n})();','\n window.S3_REG.demos.'+slug+'='+json.dumps(reg,ensure_ascii=False,separators=(',',':'))+';\n\n})();')
 Path(f'n447/s5/perfume-fragments/{slug}.integrated-config.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
registry.write_text(text)
p=Path('lib/cosmetics-chat.js');s=p.read_text()
for slug in maps:
 c=json.loads(Path(f'n447/s5/perfume-fragments/{slug}.config.json').read_text());assert f"import '../catalogues/{slug}.js';" not in s
 s=f"import '../catalogues/{slug}.js';\n"+s
 s=s.replace('export const BRANDS = {','export const BRANDS = {'+slug+':'+json.dumps({'brand':c['brand']['name'],'web':c['brand']['website'],'family':'cosmetics'},ensure_ascii=False)+',')
p.write_text(s)
p=Path('n447/s5/reply.js');s=p.read_text();rules={
 'adoraniche':[{'match':'citrus.*mat|mat.*citrus','ids':['nature']},{'match':'cierny.*caj|caj.*koren','ids':['chai']},{'match':'such.*oud','ids':['nucleus']}],
 'nicheandglow':[{'match':'fikov.*kokos|kokos.*fik','ids':['helenist']},{'match':'kav.*tonk|tonk.*kav','ids':['croissant']},{'match':'kolinsk.*vetiver|vetiver','ids':['vetiver']}]}
for slug,rows in rules.items():s=s.replace('const rules={','const rules={'+slug+':'+json.dumps(rows,ensure_ascii=False)+',')
p.write_text(s)
p=Path('tools/s3a/serve.mjs');s=p.read_text();s=s.replace("'rubens','safran'","'rubens','safran','adoraniche','nicheandglow'");p.write_text(s)
p=Path('tools/s3a/registry.json');j=json.loads(p.read_text())
for slug in maps:j['demos'][slug]={'series':'s5','type':'cosmetics'}
p.write_text(json.dumps(j,ensure_ascii=False,indent=1)+'\n')
print('Integrated two reserved perfume catalogues. UI/Preview QA pending; no completed count increase.')
