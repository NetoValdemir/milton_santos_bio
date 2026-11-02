# Compara duas pastas geradas por capturar.cjs: estados das interações e capturas pixel a pixel.
# Uso: python3 tools/regressao/comparar.py <pasta-referencia> <pasta-nova>
import json, sys
from PIL import Image, ImageChops
ref, new = sys.argv[1], sys.argv[2]
R=json.load(open(f'{ref}/log.json')); N=json.load(open(f'{new}/log.json'))
ok=True
for v in R:
    for k in R[v]:
        if R[v][k]!=N[v][k]:
            ok=False; print('DIFERENTE', v, k, str(R[v][k])[:200], '=>', str(N[v][k])[:200])
import glob, os
for f in sorted(glob.glob(f'{ref}/*.png')):
    if not os.path.exists(f.replace(ref,new)): continue
    a=Image.open(f).convert('RGB'); b=Image.open(f.replace(ref,new)).convert('RGB')
    if a.size!=b.size: ok=False; print('TAMANHO', os.path.basename(f), a.size, b.size); continue
    d=ImageChops.difference(a,b); bbox=d.getbbox()
    n=sum(1 for p in d.getdata() if p!=(0,0,0)) if bbox else 0
    print(f'{os.path.basename(f):22s} {a.size}  pixels diferentes: {n}' + (f'  área {bbox}' if bbox else ''))
    if n: ok=False
print('RESULTADO:', 'IDÊNTICO' if ok else 'HÁ DIFERENÇAS')
