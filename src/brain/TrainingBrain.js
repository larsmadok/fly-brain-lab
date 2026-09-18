// Shared experimental brain interface for Training 001.
import {PlasticSNN} from './PlasticSNN';
import {FafbRuntime} from './FafbRuntime';

export class TrainingBrain {
  constructor(mode='synthetic96',seed=101){
    this.mode=mode; this.seed=seed; this.synthetic=null; this.fafb=null;
    this.status=mode==='synthetic96'?'ready':'loading';this.last={action:'wait',dNa01:0,dNa02:0};
    this.readyPromise=Promise.resolve();
    if(mode==='synthetic96') this.synthetic=new PlasticSNN(seed);
    else {
      this.fafb=new FafbRuntime({plastic:mode==='fafbPlastic'});
      this.readyPromise=this.fafb.load().then(()=>{this.status=this.fafb.ready?'ready':'error';});
    }
  }
  decide(obs){
    if(this.synthetic) return this.synthetic.decide(obs);
    if(!this.fafb?.ready) return 'wait';

    // Training 001 currently exposes left/right/front target sensors.
    // We stimulate verified loom-sensitive visual populations and let activity
    // propagate through the full FAFB CSR graph. Steering is read only from
    // verified DNa01/DNa02 output populations.
    const left=Number(obs?.left||0),right=Number(obs?.right||0),front=Number(obs?.front||0);
    const input=new Map();
    const add=(type,amp)=>{for(const [i,v] of this.fafb.stimulateHero(type,amp))input.set(i,(input.get(i)||0)+v)};
    if(front>0) add('LPLC2',4+8*front);
    if(left>0||right>0) add('LC4',3+6*Math.max(left,right));

    // Several 1 ms-equivalent reference steps allow activity to traverse the network.
    for(let k=0;k<6;k++) this.fafb.step(k===0?input:new Map());

    const a=this.fafb.spikeCount('DNa01'),b=this.fafb.spikeCount('DNa02');
    let action='forward';
    if(a>b) action='left';
    else if(b>a) action='right';
    this.last={action,dNa01:a,dNa02:b};
    return action;
  }
  learn(reward){ if(this.synthetic) this.synthetic.learn(reward); }
  endTrial(success){ if(this.synthetic) this.synthetic.endTrial(success); }
  snapshot(){
    if(this.synthetic) return {...this.synthetic.snapshot(),mode:this.mode,status:'ready'};
    const info=this.fafb?.info()||{};
    return {mode:this.mode,status:this.status,neurons:139255,plastic:this.mode==='fafbPlastic',
      runtime:info.runtime||null,io:info.io||null,error:info.error||null,last:this.last,
      message:this.status==='ready'?'FAFB v783 closed-loop runtime loaded':'Loading verified FAFB runtime assets'};
  }
}
