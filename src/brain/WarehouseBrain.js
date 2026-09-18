export class WarehouseBrain{
 constructor(seed=71){this.seed=seed;this.tick=0;this.spikes=new Uint8Array(96)}
 step(s){this.tick++;this.spikes.fill(0);let action='wait';if(s.carrying){if(!s.atDock){action=s.targetDx!==0?'right':'down'}else action='drop'}else if(s.atTarget)action='pick';else if(s.targetDx<0)action='left';else if(s.targetDx>0)action='right';else if(s.targetDy<0)action='up';else if(s.targetDy>0)action='down';for(let i=0;i<96;i++){const drive=((i%7)===(this.tick%7)?0.65:0)+(action.charCodeAt(0)%11)/20;const z=Math.sin(this.tick*1.37+i*2.11+this.seed);if(drive+z*.25>.72)this.spikes[i]=1}return{action,spikes:Array.from(this.spikes)}}
}
