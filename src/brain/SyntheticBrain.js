export class SyntheticBrain {
  constructor(seed = 1, neurons = 96) {
    this.seed = seed; this.n = neurons;
    this.v = new Float32Array(neurons);
    this.spikes = new Uint8Array(neurons);
    this.tick = 0;
  }
  noise(i) {
    const x = Math.sin((this.tick + 1) * 12.9898 + i * 78.233 + this.seed * 3.17) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }
  step(s) {
    this.tick++; this.spikes.fill(0);
    const inputs = [s.heat, s.energyLow, s.waterLow, s.danger, s.reward];
    for (let i=0;i<this.n;i++) {
      const drive = inputs[i % inputs.length] * 0.75 + this.noise(i) * 0.13;
      const recurrent = i > 0 && this.spikes[i-1] ? 0.32 : 0;
      this.v[i] = this.v[i] * 0.91 + drive + recurrent;
      if (this.v[i] > 1) { this.spikes[i] = 1; this.v[i] = 0; }
    }
    const band = (a,b) => { let z=0; for(let i=a;i<b;i++) z+=this.spikes[i]; return z/(b-a); };
    const scores = {
      cooling: band(50,60) + s.heat * .7,
      pump: band(60,70) + s.waterLow * .65,
      power: band(70,80) + s.energyLow * .65,
      wait: band(80,96) + .12,
    };
    return { action: Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0], spikes: Array.from(this.spikes), scores };
  }
}
