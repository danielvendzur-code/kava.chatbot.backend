"""ruz.py IČO… – tržby (čistý obrat) z registeruz.sk API, posledné závierky."""
import sys, json, urllib.request
R = 'https://www.registeruz.sk/cruz-public/api/'
g = lambda p: json.load(urllib.request.urlopen(R + p, timeout=30))
for ico in sys.argv[1:]:
    ids = g(f'uctovne-jednotky?zmenene-od=2000-01-01&ico={ico}')['id']
    if not ids: print(ico, 'nenájdené'); continue
    u = g(f'uctovna-jednotka?id={ids[0]}')
    zs = sorted((g(f'uctovna-zavierka?id={z}') for z in u.get('idUctovnychZavierok', [])[-12:]), key=lambda z: z.get('obdobieDo', ''))
    out = []
    for z in zs[-2:]:
        for v in z.get('idUctovnychVykazov', []):
            d = g(f'uctovny-vykaz?id={v}'); t = d.get('obsah', {}).get('tabulky', [])
            for tab in t:
                nm = json.dumps(tab.get('nazov', ''), ensure_ascii=False)
                if 'ziskov' in nm.lower():
                    dat = tab.get('data', [])
                    out.append((z.get('obdobieDo'), dat[:4]))
    print(ico, u.get('nazovUJ'), u.get('skNace'), u.get('mesto'), '|', out)
