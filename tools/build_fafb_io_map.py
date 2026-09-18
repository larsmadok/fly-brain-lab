"""Build verified FAFB v783 sensor/output population mappings from official Codex exports.

Required:
  classification.csv.gz
  consolidated_cell_types.csv.gz
Optional:
  neurons.csv.gz (NT metadata only)

No fabricated root IDs.
"""
from pathlib import Path
import argparse,csv,gzip,json

def read_gz(path):
  with gzip.open(path,'rt',newline='',encoding='utf-8-sig') as f:
    return list(csv.DictReader(f))

def norm(s): return (s or '').strip()

def main():
  ap=argparse.ArgumentParser()
  ap.add_argument('--classification',required=True)
  ap.add_argument('--cell-types',required=True)
  ap.add_argument('--neurons')
  ap.add_argument('--out',default='public/data/fafb-v783/io-map.json')
  a=ap.parse_args()

  cls=read_gz(Path(a.classification))
  cts=read_gz(Path(a.cell_types))
  ct_by={int(r['root_id']):r for r in cts if r.get('root_id')}

  groups={'sensory':[],'optic':[],'visual_projection':[],'descending':[]}
  hero={k:[] for k in ('LPLC2','LC4','DNa01','DNa02','DNp01','DNp09','MDN')}

  by_id={}
  for r in cls:
    if not r.get('root_id'): continue
    rid=int(r['root_id']); by_id[rid]=r
    sc=norm(r.get('super_class')).lower()
    if sc in groups: groups[sc].append(rid)
    t=ct_by.get(rid,{})
    labels='|'.join([norm(t.get('primary_type')),norm(t.get('additional_type(s)'))])
    for h in hero:
      if h.lower() in labels.lower(): hero[h].append(rid)

  out={
    'dataset':'FAFB','release':'v783',
    'sources':['classification.csv.gz','consolidated_cell_types.csv.gz'],
    'groups':groups,'hero_types':hero,
    'classification_fields': list(cls[0].keys()) if cls else [],
    'cell_type_fields': list(cts[0].keys()) if cts else []
  }
  Path(a.out).parent.mkdir(parents=True,exist_ok=True)
  Path(a.out).write_text(json.dumps(out,indent=2),encoding='utf-8')
  print(json.dumps({
    'groups':{k:len(v) for k,v in groups.items()},
    'hero_types':{k:len(v) for k,v in hero.items()},
    'out':a.out
  },indent=2))

if __name__=='__main__': main()
