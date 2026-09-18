// Whole-brain CSR LIF reference runtime.
// Inputs are neuron-index -> stimulation. Outputs are spike indices.
// Canonical weights are immutable; optional plastic deltas are separate.
export class CsrLifRuntime{
 constructor({offsets,posts,weights,plastic=false}){
  this.offsets=offsets;this.posts=posts;this.weights=weights;this.n=offsets.length-1;this.plastic=plastic;
  this.v=new Float32Array(this.n);this.g=new Float32Array(this.n);this.v.fill(-52);
  this.delta=plastic?new Map():null;this.tick=0;
 }
 step(input=new Map()){
  this.tick++;for(const [i,x] of input)if(i>=0&&i<this.n)this.v[i]+=x;
  const spikes=[];
  for(let i=0;i<this.n;i++){this.g[i]*=.8;let nv=this.v[i]+(-52-this.v[i]+this.g[i])/20;if(nv>-45){spikes.push(i);nv=-52}this.v[i]=nv}
  const next=new Float32Array(this.n);
  for(const pre of spikes)for(let j=this.offsets[pre];j<this.offsets[pre+1];j++){const d=this.delta?.get(j)||0;next[this.posts[j]]+=(this.weights[j]+d)*.275}
  this.g=next;return spikes;
 }
 applyPlasticity(edgeIndex,delta){if(!this.plastic)return;this.delta.set(edgeIndex,(this.delta.get(edgeIndex)||0)+delta)}
}
