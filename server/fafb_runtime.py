"""Server-side FBL1 loader and sparse LIF stepping core."""
from dataclasses import dataclass
from pathlib import Path
import mmap, struct, array

@dataclass
class Meta:
    neurons:int; edges:int; synapses:int

class FBL1Graph:
    def __init__(self,path):
        self.path=Path(path);self.f=self.path.open('rb');self.mm=mmap.mmap(self.f.fileno(),0,access=mmap.ACCESS_READ)
        if self.mm[:4]!=b'FBL1': raise ValueError('invalid FBL1')
        n,e,s=struct.unpack_from('<IIQ',self.mm,4);self.meta=Meta(n,e,s);self.offset=20
    def edge(self,i): return struct.unpack_from('<IIi',self.mm,self.offset+i*12)
    def close(self): self.mm.close();self.f.close()

class SparseLIF:
    """Reference CPU stepping core. Anatomical weights are immutable."""
    def __init__(self,graph):
        self.g=graph; n=graph.meta.neurons
        self.v=array.array('f',[-52.0])*n; self.syn=array.array('f',[0.0])*n
        self.threshold=-45.0; self.reset=-52.0; self.rest=-52.0
    def step(self,external=None):
        # Reference implementation prioritizes correctness; optimized CSR runtime follows.
        if external:
            for i,x in external.items():
                if 0<=i<len(self.v): self.v[i]+=float(x)
        spikes=[]
        for i,v in enumerate(self.v):
            nv=v+(self.rest-v+self.syn[i])/20.0; self.syn[i]*=.8
            if nv>self.threshold: spikes.append(i);nv=self.reset
            self.v[i]=nv
        return spikes
