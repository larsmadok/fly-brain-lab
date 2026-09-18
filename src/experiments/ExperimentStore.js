export class ExperimentStore{
 constructor(){this.runs=[]}
 record(run){const item={id:`RUN-${String(this.runs.length+1).padStart(6,'0')}`,createdAt:new Date().toISOString(),...run};this.runs.unshift(item);this.runs=this.runs.slice(0,500);return item}
 list(){return this.runs}
 summary(){const n=this.runs.length;if(!n)return{runs:0,successRate:0,avgTicks:0,avgScore:0,deadlocks:0};const ok=this.runs.filter(r=>r.reason==='complete');return{runs:n,successRate:ok.length/n,avgTicks:this.runs.reduce((a,r)=>a+r.ticks,0)/n,avgScore:this.runs.reduce((a,r)=>a+r.score,0)/n,deadlocks:this.runs.filter(r=>r.reason==='deadlock').length}}
}
export const experimentStore=new ExperimentStore();
