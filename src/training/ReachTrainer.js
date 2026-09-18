import {ReachPalletWorld} from './ReachPalletWorld';import {PlasticSNN} from '../brain/PlasticSNN';
export class ReachTrainer{
 constructor(){this.brain=new PlasticSNN(101);this.history=[];this.trial=0;this.newTrial()}
 newTrial(){this.world=new ReachPalletWorld(101+this.trial*13);this.steps=0;this.totalReward=0}
 step(){if(this.world.done||this.steps>=700){this.finish();return this.state()}const action=this.brain.decide(this.world.observe());const s=this.world.step(action);this.brain.learn(s.reward);this.steps++;this.totalReward+=s.reward;if(s.done)this.finish();return this.state()}
 finish(){const success=this.world.done;this.brain.endTrial(success);this.history.push({trial:this.trial+1,success,steps:this.steps,reward:this.totalReward});this.history=this.history.slice(-100);this.trial++;this.newTrial()}
 state(){return{trial:this.trial+1,steps:this.steps,world:this.world.state(),brain:this.brain.snapshot(),history:[...this.history]}}
}