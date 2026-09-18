// Shared experimental brain interface for Training 001.
// Synthetic is live. FAFB modes expose the same contract but must not claim a
// real connectome run until a verified v783 compact graph is installed.
import {PlasticSNN} from './PlasticSNN';
import {FafbRuntime} from './FafbRuntime';

export class TrainingBrain {
  constructor(mode='synthetic96',seed=101){
    this.mode=mode; this.seed=seed; this.synthetic=null; this.fafb=null;
    this.status=mode==='synthetic96'?'ready':'dataset-required';
    if(mode==='synthetic96') this.synthetic=new PlasticSNN(seed);
    else this.fafb=new FafbRuntime({plastic:mode==='fafbPlastic'});
  }
  decide(obs){
    if(this.synthetic) return this.synthetic.decide(obs);
    // No fake biological decisions: unavailable until the verified graph is loaded.
    return 'wait';
  }
  learn(reward){ if(this.synthetic) this.synthetic.learn(reward); }
  endTrial(success){ if(this.synthetic) this.synthetic.endTrial(success); }
  snapshot(){
    if(this.synthetic) return {...this.synthetic.snapshot(),mode:this.mode,status:'ready'};
    return {mode:this.mode,status:this.status,neurons:139255,plastic:this.mode==='fafbPlastic',
      message:'FAFB v783 compact runtime graph not installed yet'};
  }
}
