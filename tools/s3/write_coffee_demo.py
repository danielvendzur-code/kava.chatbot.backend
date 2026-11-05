"""Séria 3 – stránka, značkové tokeny a chat pre kávovú ukážku (jadro c2 bez zmeny správania).
python3 -I tools/s3/write_coffee_demo.py SLUG [--invert-logo]
Zapíše SLUG.html (z nordbeans.html), n447/SLUG-jolka-theme.css, zaregistruje SLUG v api/chat-447c2.js a v zoznamoch tried n447/c2/c2-ui.css."""
import sys, json, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
slug = sys.argv[1]; invert = '--invert-logo' in sys.argv
import subprocess
D = json.loads(subprocess.run(['node', '-e', f'console.log(JSON.stringify(require("{ROOT}/n447/c2/data/{slug}.js")))'], capture_output=True, text=True).stdout)
b, th, cs = D['brand'], D['brand']['theme'], D['lang'] == 'cs'
def mix(h, w, t):  # zmiešanie farby s bielou (t=0..1 podiel bielej)
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) for i in (0, 2, 4)]; return '#' + ''.join(f'{round(x + (255 - x) * t):02x}' for x in c)
css = (f"/* {b['name']} – značkové tokeny na schválenom Jolka systéme (séria 3). */\n"
       f":root{{--ink:{th['ink']};--ink-2:{th['ink']};--ink-3:{mix(th['ink'],0,.18)};--paper:#ffffff;--surface:#fff;--surface-2:{th['soft']};--line:{mix(th['soft'],0,0) if False else '#e5e0d8'};--line-strong:#d3ccc1;"
       f"--kraft:{th['accent']};--kraft-deep:{th['accent']};--kraft-tint:{mix(th['accent'],0,.86)};--text:{th['ink']};--text-2:#4f4f4f;--text-3:#808080;--on-ink:#fff;--on-ink-2:rgba(255,255,255,.74)}}\n"
       f"body.{slug}-clean :is(.widget__brand>img,.msg__avatar img,.launcher__button img){{object-fit:contain{';filter:brightness(0) invert(1)' if invert else ''}}}\n"
       f"body.{slug}-clean .widget__brand>img{{width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important}}\n"
       f"body.{slug}-clean .msg__avatar img{{width:30px!important;height:30px!important}}\n"
       f"body.{slug}-clean .launcher__button img{{width:46px!important;height:46px!important}}\n")
open(f'{ROOT}/n447/{slug}-jolka-theme.css', 'w').write(css)
h = open(f'{ROOT}/nordbeans.html').read()
h = h.replace('<html lang="cs">', f'<html lang="{D["lang"]}">').replace('content="#1c1c1c"', f'content="{th["ink"]}"')
h = h.replace('<title>Nordbeans – kávový poradce</title>', f'<title>{b["name"]} – {"kávový poradce" if cs else "kávový poradca"}</title>')
h = h.replace('content="Ukázka kávového poradce připravená pro Nordbeans"', f'content="{"Ukázka kávového poradce připravená pro" if cs else "Ukážka kávového poradcu pripravená pre"} {b["name"]}"')
h = h.replace('/assets/nordbeans/logo.png', b['logo']).replace('/n447/nordbeans-jolka-theme.css', f'/n447/{slug}-jolka-theme.css')
h = h.replace('nordbeans-clean', f'{slug}-clean').replace("'nordbeans'", f"'{slug}'").replace('/n447/c2/data/nordbeans.js', f'/n447/c2/data/{slug}.js')
h = h.replace('<link rel="stylesheet" href="/n447/c2/c2-ui.css">', '<link rel="stylesheet" href="/n447/c2/c2-ui.css">\n<link rel="stylesheet" href="/n447/s3/c2-plus.css">').replace('</body>', '<script src="/n447/s3/plus-chat.js" defer></script>\n</body>')
if not cs: h = re.sub(r'\s*<script src="/lang-cs\.js[^"]*"></script>', '', h)
assert 'nordbeans' not in h.lower(), 'ostal Nordbeans'
open(f'{ROOT}/{slug}.html', 'w').write(h)
api = open(f'{ROOT}/api/chat-447c2.js').read()
var = re.sub(r'\W', '_', slug.upper())
if f"/data/{slug}.js'" not in api:
    api = api.replace("import NORDBEANS from '../n447/c2/data/nordbeans.js';", f"import NORDBEANS from '../n447/c2/data/nordbeans.js';\nimport {var} from '../n447/c2/data/{slug}.js';")
    api = re.sub(r'export const DEMOS = \{([^}]*)\};', lambda m: 'export const DEMOS = {' + m.group(1) + f', {slug}: {var}' + '};', api)
open(f'{ROOT}/api/chat-447c2.js', 'w').write(api)
ui = open(f'{ROOT}/n447/c2/c2-ui.css').read()
ui = re.sub(r':is\(([^)]*\.nordbeans-clean[^)]*)\)', lambda m: ':is(' + m.group(1) + ('' if f'.{slug}-clean' in m.group(1) else f',.{slug}-clean') + ')', ui)
open(f'{ROOT}/n447/c2/c2-ui.css', 'w').write(ui)
print('ok', slug)
