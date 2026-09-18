export class ScalableSyntheticBrain{
 constructor(n=1024,seed=42){this.n=n;this.seed=seed;this.tick=0;this.v=new Float32Array(n);this.spikes=new Uint8Array(n)}
 step(input=[0,0,0,0]){this.tick++;this.spikes.fill(0);for(let i=0;i<this.n;i++){const x=input[i%input.length]||0;const noise=Math.sin(this.tick*.31+i*1.73+this.seed)*.08;this.v[i]=this.v[i]*.92+x*.55+noise;if(this.v[i]>1){this.spikes[i]=1;this.v[i]=0}}return this.spikes}
 summary(){let n=0;for(const s of this.spikes)n+=s;return{neurons:this.n,active:n,rate:n/this.n}}
}
