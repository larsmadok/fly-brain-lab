"""Build Fly Brain Lab compact FAFB v783 runtime assets.

Input directory must contain Codex/FlyWire v783:
  neurons.csv.gz
  connections_princeton.csv.gz
(or the documented no-threshold alternate).

Output is intentionally not committed automatically because it is derived FlyWire data.
"""
from pathlib import Path
import argparse, gzip, json, struct, csv

def open_text(p):
    return gzip.open(p,'rt',newline='') if p.suffix=='.gz' else p.open('r',newline='')

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--input',required=True)
    ap.add_argument('--output',default='public/data/fafb-v783')
    args=ap.parse_args(); src=Path(args.input); out=Path(args.output); out.mkdir(parents=True,exist_ok=True)
    nf=src/'neurons.csv.gz'
    candidates=[src/'connections_princeton.csv.gz',src/'connections_princeton_no_threshold.csv.gz',src/'connections_princeton_no_threshold.csv']
    cf=next((p for p in candidates if p.exists()),None)
    if not nf.exists() or cf is None: raise SystemExit('Missing neurons.csv.gz or Princeton connectivity file')
    ids=[]; nts={}
    with open_text(nf) as f:
        r=csv.DictReader(f)
        for row in r:
            rid=row.get('root_id') or row.get('id') or row.get('root')
            if not rid: continue
            ids.append(int(rid)); nts[int(rid)]=row.get('nt_type') or row.get('top_nt') or ''
    ids=sorted(set(ids)); index={v:i for i,v in enumerate(ids)}
    nt_sign={'ACH':1,'acetylcholine':1,'GLUT':-1,'glutamate':-1,'GABA':-1}
    edges=[]; synapses=0
    with open_text(cf) as f:
        r=csv.DictReader(f)
        for row in r:
            pre=int(row.get('pre_root_id') or row.get('pre_pt_root_id')); post=int(row.get('post_root_id') or row.get('post_pt_root_id'))
            if pre not in index or post not in index: continue
            n=int(row.get('syn_count') or row.get('weight') or 1); synapses+=n
            nt=row.get('nt_type') or nts.get(pre,''); sign=nt_sign.get(nt,1)
            edges.append((index[pre],index[post],n*sign))
    with (out/'graph.bin').open('wb') as g:
        g.write(b'FBL1');g.write(struct.pack('<IIQ',len(ids),len(edges),synapses))
        for a,b,w in edges:g.write(struct.pack('<IIi',a,b,w))
    (out/'manifest.json').write_text(json.dumps({'dataset':'FAFB','release':'v783','neurons':len(ids),'edges':len(edges),'synapses':synapses,'graph':'graph.bin','format':'FBL1'},indent=2))
    print(json.dumps({'neurons':len(ids),'edges':len(edges),'synapses':synapses,'output':str(out)},indent=2))
if __name__=='__main__': main()
