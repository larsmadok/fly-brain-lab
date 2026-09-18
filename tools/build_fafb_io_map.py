"""Build verified FAFB v783 sensor/output population mappings from Codex neurons.csv.gz.

Uses only annotation fields present in the official dataset. No fabricated root IDs.
"""
from pathlib import Path
import argparse,csv,gzip,json

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--neurons',required=True);ap.add_argument('--out',default='public/data/fafb-v783/io-map.json');a=ap.parse_args()
 p=Path(a.neurons);groups={'sensory':[],'optic':[],'visual_projection':[],'descending':[]}
 hero={'LPLC2':[],'LC4':[],'DNa01':[],'DNa02':[],'DNp01':[],'DNp09':[],'MDN':[]}
 with gzip.open(p,'rt',newline='') as f:
  r=csv.DictReader(f)
  fields=r.fieldnames or []
  for row in r:
   rid=row.get('root_id') or row.get('id');sc=(row.get('super_class') or '').lower()
   if not rid:continue
   if sc in groups:groups[sc].append(int(rid))
   labels='|'.join(str(row.get(k) or '') for k in ('cell_type','hemibrain_type','flow','class','sub_class'))
   for h in hero:
    if h in labels:hero[h].append(int(rid))
 out={'dataset':'FAFB','release':'v783','source':'Codex neurons.csv.gz','fields':fields,'groups':groups,'hero_types':hero}
 Path(a.out).parent.mkdir(parents=True,exist_ok=True);Path(a.out).write_text(json.dumps(out,indent=2))
 print(json.dumps({'groups':{k:len(v) for k,v in groups.items()},'hero_types':{k:len(v) for k,v in hero.items()},'out':a.out},indent=2))
if __name__=='__main__':main()
