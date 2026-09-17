export class ControlRoom {
  constructor(seed=1){ this.seed=seed; this.reset(); }
  reset(){ this.t=0; this.temp=31; this.energy=78; this.water=68; this.integrity=100; this.cooling=false; this.pump=false; this.log=[]; }
  sensors(){ return { heat:Math.max(0,(this.temp-24)/16), energyLow:Math.max(0,(55-this.energy)/55), waterLow:Math.max(0,(45-this.water)/45), danger:Math.max(0,(60-this.integrity)/60), reward:this.integrity/100 }; }
  step(action){
    this.t++;
    if(action==='cooling') this.cooling=!this.cooling;
    if(action==='pump') this.pump=!this.pump;
    if(action==='power') this.energy=Math.min(100,this.energy+3);
    const disturbance=Math.sin(this.t/17)*.16 + (this.t%97===0?2.8:0);
    this.temp += .075 + disturbance - (this.cooling?.28:0);
    this.energy -= .035 + (this.cooling?.08:0) + (this.pump?.05:0);
    this.water += (this.pump?.12:-.025); this.water=Math.max(0,Math.min(100,this.water));
    if(this.temp>38) this.integrity-=.22*(this.temp-38); if(this.energy<8) this.integrity-=.25; if(this.water<5) this.integrity-=.18;
    this.integrity=Math.max(0,this.integrity);
    const state={t:this.t,temp:this.temp,energy:this.energy,water:this.water,integrity:this.integrity,cooling:this.cooling,pump:this.pump,action};
    this.log.push(state); return state;
  }
}
