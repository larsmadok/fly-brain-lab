// Browser loader for Fly Brain Lab FBL1 compact FAFB graph.
// Runtime graph remains immutable; plasticity deltas are separate.
export class FafbRuntime {
  constructor({plastic=false, manifestUrl='/data/fafb-v783/manifest.json'}={}){
    this.plastic=plastic;this.manifestUrl=manifestUrl;this.ready=false;this.neurons=139255;this.edges=0;this.synapses=0;this.error=null;this.graph=null;
  }
  async load(){
    try{
      const mr=await fetch(this.manifestUrl,{cache:'no-store'});if(!mr.ok)throw new Error('FAFB manifest unavailable');
      const m=await mr.json();if(m.dataset!=='FAFB'||m.release!=='v783'||m.format!=='FBL1')throw new Error('Unexpected FAFB manifest');
      const graphUrl=new URL(m.graph,new URL(this.manifestUrl,location.href)).href;
      const gr=await fetch(graphUrl,{cache:'force-cache'});if(!gr.ok)throw new Error('FAFB graph unavailable');
      const buf=await gr.arrayBuffer();const dv=new DataView(buf);
      if(String.fromCharCode(...new Uint8Array(buf,0,4))!=='FBL1')throw new Error('Invalid FBL1 graph');
      const n=dv.getUint32(4,true),e=dv.getUint32(8,true);const syn=Number(dv.getBigUint64(12,true));
      if(n!==m.neurons||e!==m.edges||syn!==m.synapses)throw new Error('Manifest/graph count mismatch');
      this.neurons=n;this.edges=e;this.synapses=syn;this.graph=buf;this.ready=true;this.error=null;return this;
    }catch(e){this.error=e.message;this.ready=false;return this}
  }
  info(){return{dataset:'FAFB',release:'v783',neurons:this.neurons,edges:this.edges,synapses:this.synapses,plastic:this.plastic,ready:this.ready,error:this.error}}
}
