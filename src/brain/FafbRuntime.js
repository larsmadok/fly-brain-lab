import { CsrLifRuntime } from './CsrLifRuntime.js';

const RELEASE='https://github.com/larsmadok/fly-brain-lab/releases/download/fafb-v783-runtime';

export class FafbRuntime {
  constructor({plastic=false}={}){
    this.plastic=plastic;this.ready=false;this.neurons=139255;this.edges=0;this.synapses=0;this.error=null;this.engine=null;
    this.io=null;this.denseIo=null;this.lastSpikes=[];
  }
  async load(){
    try{
      const [mr,ir,dr]=await Promise.all([
        fetch(`${RELEASE}/csr-manifest.json`,{cache:'no-store'}),
        fetch(`${RELEASE}/io-map.json`,{cache:'no-store'}),
        fetch(`${RELEASE}/dense-io.json`,{cache:'no-store'})
      ]);
      if(!mr.ok)throw new Error('FAFB CSR manifest unavailable');
      if(!ir.ok)throw new Error('FAFB io-map unavailable');
      if(!dr.ok)throw new Error('FAFB dense-io unavailable');
      const [m,io,denseIo]=await Promise.all([mr.json(),ir.json(),dr.json()]);
      if(m.format!=='FBL-CSR1'||m.neurons!==139255||m.edges!==5342446||m.synapses!==50666648)throw new Error('Unexpected FAFB CSR manifest');
      if(denseIo.neurons!==139255||denseIo.ordering!=='sorted-root-id')throw new Error('Unexpected FAFB dense IO map');
      const [ob,pb,wb]=await Promise.all([
        fetch(`${RELEASE}/offsets.u32`).then(r=>{if(!r.ok)throw new Error('offsets unavailable');return r.arrayBuffer()}),
        fetch(`${RELEASE}/posts.u32`).then(r=>{if(!r.ok)throw new Error('posts unavailable');return r.arrayBuffer()}),
        fetch(`${RELEASE}/weights.i32`).then(r=>{if(!r.ok)throw new Error('weights unavailable');return r.arrayBuffer()})
      ]);
      const offsets=new Uint32Array(ob),posts=new Uint32Array(pb),weights=new Int32Array(wb);
      if(offsets.length!==m.neurons+1||posts.length!==m.edges||weights.length!==m.edges)throw new Error('CSR length mismatch');
      if(offsets[offsets.length-1]!==m.edges)throw new Error('CSR offset terminator mismatch');
      this.io=io;this.denseIo=denseIo;
      this.engine=new CsrLifRuntime({offsets,posts,weights,plastic:this.plastic});
      this.neurons=m.neurons;this.edges=m.edges;this.synapses=m.synapses;this.ready=true;this.error=null;return this;
    }catch(e){this.error=e.message;this.ready=false;return this}
  }
  step(input){if(!this.ready||!this.engine)return[];this.lastSpikes=this.engine.step(input);return this.lastSpikes}
  stimulateHero(type,amplitude=8){
    const ids=this.denseIo?.hero_types?.[type]||[];const m=new Map();for(const i of ids)m.set(i,amplitude);return m;
  }
  spikeCount(type){
    const ids=this.denseIo?.hero_types?.[type]||[];if(!ids.length||!this.lastSpikes.length)return 0;
    const s=new Set(this.lastSpikes);let n=0;for(const i of ids)if(s.has(i))n++;return n;
  }
  applyPlasticity(edgeIndex,delta){this.engine?.applyPlasticity(edgeIndex,delta)}
  info(){return{
    dataset:'FAFB',release:'v783',neurons:this.neurons,edges:this.edges,synapses:this.synapses,
    plastic:this.plastic,ready:this.ready,error:this.error,runtime:this.engine?'CSR-LIF':null,
    io:this.io?{
      sensory:this.io.groups?.sensory?.length||0,optic:this.io.groups?.optic?.length||0,
      visual_projection:this.io.groups?.visual_projection?.length||0,descending:this.io.groups?.descending?.length||0,
      LPLC2:this.io.hero_types?.LPLC2?.length||0,LC4:this.io.hero_types?.LC4?.length||0,
      DNa01:this.io.hero_types?.DNa01?.length||0,DNa02:this.io.hero_types?.DNa02?.length||0
    }:null
  }}
}
