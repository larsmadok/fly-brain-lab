"""Convert FBL1 edge records to CSR arrays for fast whole-brain stepping.
Usage: python tools/build_fafb_csr.py public/data/fafb-v783/graph.bin public/data/fafb-v783/csr
"""
from pathlib import Path
import argparse, mmap, struct, array, json

def main():
 ap=argparse.ArgumentParser();ap.add_argument('graph');ap.add_argument('out');a=ap.parse_args()
 p=Path(a.graph);out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 with p.open('rb') as f:
  mm=mmap.mmap(f.fileno(),0,access=mmap.ACCESS_READ)
  if mm[:4]!=b'FBL1':raise SystemExit('invalid FBL1')
  n,e,s=struct.unpack_from('<IIQ',mm,4);counts=array.array('I',[0])*(n+1)
  for i in range(e):
   pre,post,w=struct.unpack_from('<IIi',mm,20+i*12);counts[pre+1]+=1
  for i in range(n):counts[i+1]+=counts[i]
  cursor=array.array('I',counts[:-1]);posts=array.array('I',[0])*e;weights=array.array('i',[0])*e
  for i in range(e):
   pre,post,w=struct.unpack_from('<IIi',mm,20+i*12);j=cursor[pre];posts[j]=post;weights[j]=w;cursor[pre]+=1
  mm.close()
 for name,arr in [('offsets.u32',counts),('posts.u32',posts),('weights.i32',weights)]:
  with (out/name).open('wb') as g:arr.tofile(g)
 (out/'manifest.json').write_text(json.dumps({'format':'FBL-CSR1','neurons':n,'edges':e,'synapses':s,'offsets':'offsets.u32','posts':'posts.u32','weights':'weights.i32'},indent=2))
 print(json.dumps({'neurons':n,'edges':e,'synapses':s,'out':str(out)},indent=2))
if __name__=='__main__':main()
