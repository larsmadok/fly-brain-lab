// Shared experimental brain interface for Training 001.
import {PlasticSNN} from './PlasticSNN';
import {FafbRuntime} from './FafbRuntime';

export class TrainingBrain {
  constructor(mode='synthetic96',seed=101){
    this.mode=mode; this.seed=seed; this.synthetic=null; this.fafb=null;
    this.status=mode==='synthetic96'?'ready':'loading';
    this.readyPromise=Promise.resolve();
    if(mode==='synthetic96') this.synthetic=new PlasticSNN(seed);
    else {
      this.fafb=new FafbRuntime({plastic:mode==='fafbPlastic'});
      this.readyPromise=this.fafb.load().then(()=>{
        this.status=this.fafb.ready?'ready':'error';
      });
    }
  }
  decide(obs){
    if(this.synthetic) return this.synthetic.decide(obs);
    if(!this.fafb?.ready) return 'wait';
    // Closed-loop policy wiring is next: real FAFB activity will drive action.
    return 'wait';
  }
  learn(reward){ if(this.synthetic) this.synthetic.learn(reward); }
  endTrial(success){ if(this.synthetic) this.synthetic.endTrial(success); }
  snapshot(){
    if(this.synthetic) return {...this.synthetic.snapshot(),mode:this.mode,status:'ready'};
    const info=this.fafb?.info()||{};
    return {mode:this.mode,status:this.status,neurons:139255,plastic:this.mode==='fafbPlastic',
      runtime:info.runtime||null,io:info.io||null,error:info.error||null,
      message:this.status==='ready'?'FAFB v783 CSR + verified IO map loaded':'Loading verified FAFB runtime assets'};
  }
}
