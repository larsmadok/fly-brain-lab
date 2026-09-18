// Synthetic plastic SNN used only as a control for Training Lab.
// It receives sensor values, not target coordinates or an action label.
export class PlasticSNN{
 constructor(seed=101){this.seed=seed;this.actions=['forward','left','right','brake','wait'];this.w=Array.from({length:5},(_,a)=>Array.from({length:5},(_,i)=>Math.sin(seed+a*17+i*7)*.08));this.epsilon=.28;this.last=null;this.trials=0}
 features(s){return[1,s.front,s.left,s.right,1-s.distance]}
 decide(s){const f=this.features(s);let a;if(Math.random()<this.epsilon)a=Math.floor(Math.random()*5);else{const q=this.w.map(row=>row.reduce((z,w,i)=>z+w*f[i],0));a=q.indexOf(Math.max(...q))}this.last={a,f};return this.actions[a]}
 learn(reward){if(!this.last)return;const lr=.055;this.w[this.last.a]=this.w[this.last.a].map((w,i)=>w+lr*reward*this.last.f[i]);}
 endTrial(success){this.trials++;this.epsilon=Math.max(.04,this.epsilon*.985);if(success)this.w[0][4]+=.01}
 snapshot(){return{epsilon:this.epsilon,trials:this.trials,weights:this.w.map(r=>[...r])}}
}