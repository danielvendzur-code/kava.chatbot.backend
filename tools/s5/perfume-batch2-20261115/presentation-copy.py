"""Company-only localized entry/teaser copy. No runtime or shared styles are changed."""
from pathlib import Path
import json
B=Path(__file__).resolve().parent;R=B.parents[2]
def apply_to_package(slug):
 facts=json.load(open(B/f'candidate-packages/{slug}/verified-products.json'));cs=facts['lang']=='cs';purposes={p['source'].get('usagePurpose','personal-fragrance') for p in facts['products']}
 if purposes=={'laundry-fragrance'}:
  suffix='vůně na prádlo' if cs else 'vône na pranie';advisor='Poradce pro vůně na prádlo' if cs else 'Poradca vôní na pranie';small='VŮNĚ NA PRÁDLO' if cs else 'VÔNE NA PRANIE';question='Vyberte si vůni na prádlo' if cs else 'Vyberte si vôňu na pranie';note='Konkrétní balení a cena' if cs else 'Konkrétne balenie a cena'
 elif purposes=={'scented-candle'}:
  suffix='vůně svíčky' if cs else 'vône sviečky';advisor='Průvodce vůněmi svíček' if cs else 'Poradca vôní sviečok';small='VŮNĚ SVÍČEK' if cs else 'VÔNE SVIEČOK';question='Najděte vůni své svíčky' if cs else 'Nájdite vôňu svojej sviečky';note='Svíčky, balení a ceny' if cs else 'Sviečky, balenia a ceny'
 elif all(p.startswith('room-') for p in purposes):
  suffix='vůně do interiéru' if cs else 'vône do interiéru';advisor='Poradce pro vůně do interiéru' if cs else 'Poradca vôní do interiéru';small='VŮNĚ DO INTERIÉRU' if cs else 'VÔNE DO INTERIÉRU';question='Vyberte si vůni do interiéru' if cs else 'Vyberte si vôňu do interiéru';note='Tyčinkové vůně a oleje do aromalampy' if cs else 'Tyčinkové vône a oleje do aromalampy'
 else:
  suffix='vůně' if cs else 'vône';advisor='Průvodce výběrem vůně' if cs else 'Poradca pri výbere vône';small='VÝBĚR VŮNĚ' if cs else 'VÝBER VÔNE';question='Objevte vůni podle svého vkusu' if cs else 'Objavte vôňu podľa svojho vkusu';note='Konkrétní vůně, balení a cena' if cs else 'Konkrétna vôňa, balenie a cena'
 copy={'titleSuffix':('výběr ' if cs else 'výber ')+suffix,'tab':'Výběr vůně' if cs else 'Výber vône','advisorName':advisor,'entrySmall':small,'entryTitle':question,'placeholder':('Zeptejte se na charakter vůně, balení nebo cenu…' if cs else 'Opýtajte sa na charakter vône, balenie alebo cenu…'),'teaserAria':('Otevřít výběr ' if cs else 'Otvoriť výber ')+suffix,'teaserTitle':question,'teaserNote':note}
 for p in [B/f'candidate-packages/{slug}/config.json',R/f'n447/s5/perfume-fragments/{slug}.config.json',B/f'candidate-packages/{slug}/integration-review.json']:
  d=json.load(open(p));reg=d['registryObject'];reg['segmentText'].update(copy);reg['segmentText']['greeting']=reg['brand']['greeting'];p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 apply_variant_notices(slug)
 return copy
def apply_variant_notices(slug):
 p=B/f'candidate-packages/{slug}/verified-products.json';facts=json.load(open(p));changed=False
 for product in facts['products']:
  notice=''
  if slug in ['kvapkavoni','vonavepranie']:notice='Na e-shope zvoľte balenie 250 ml.'
  elif slug=='alma' and product['id']=='1':notice='Na e-shopu zvolte alkoholovou variantu 10 ml.'
  if not notice:continue
  product['source']['variantSelectionNotice']=notice
  if notice not in product['reason']:product['reason']+=' '+notice
  product['description']=product['reason'];changed=True
 if changed:
  for path in [p,R/f'n447/s5/sources/{slug}/verified-products.json']:path.write_text(json.dumps(facts,ensure_ascii=False,indent=2)+'\n')
  js='globalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES.'+slug+' = '+json.dumps(facts,ensure_ascii=False,indent=1)+';\n'
  for path in [B/f'candidate-packages/{slug}/catalogue.js',R/f'catalogues/{slug}.js']:path.write_text(js)
if __name__=='__main__':
 for p in sorted((B/'candidate-packages').glob('*/verified-products.json')):print(p.parent.name,apply_to_package(p.parent.name)['teaserTitle'])
