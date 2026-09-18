"""Build dense-index I/O map for the exact FBL1 ordering.
The FBL1 builder sorts all neuron root_ids ascending, so this converts verified
root IDs to the dense indices used by CSR-LIF.
"""
from pathlib import Path
import argparse,csv,gzip,json

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--neurons',required=True);ap.add_argument('--io-map',required=True);ap.add_argument('--out',required=True);a=ap.parse_args()
 ids=[]
 with gzip.open(a.neurons,'rt',newline='',encoding='utf-8-sig') as f:
  for r in csv.DictReader(f):
   x=r.get('root_id') or r.get('id') or r.get('root')
   if x: ids.append(int(x))
 ids=sorted(set(ids));idx={v:i for i,v in enumerate(ids)}
 io=json.loads(Path(a.io_map).read_text(encoding='utf-8'))
 conv=lambda xs:[idx[x] for x in xs if x in idx]
 out={'dataset':'FAFB','release':'v783','ordering':'sorted-root-id','neurons':len(ids),
      'groups':{k:conv(v) for k,v in io.get('groups',{}).items()},
      'hero_types':{k:conv(v) for k,v in io.get('hero_types',{}).items()}}
 Path(a.out).write_text(json.dumps(out,indent=2),encoding='utf-8')
 print(json.dumps({'groups':{k:len(v) for k,v in out['groups'].items()},'hero_types':{k:len(v) for k,v in out['hero_types'].items()},'out':a.out},indent=2))
if __name__=='__main__':main()
