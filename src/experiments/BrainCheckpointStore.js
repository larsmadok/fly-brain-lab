export class BrainCheckpointStore{
 constructor(){this.items=[]}
 save({brainId,label,state,training={}}){const cp={id:`CP-${String(this.items.length+1).padStart(5,'0')}`,brainId,label:label||'checkpoint',training,createdAt:new Date().toISOString(),state};this.items.unshift(cp);return cp}
 list(brainId){return brainId?this.items.filter(x=>x.brainId===brainId):this.items}
}
export const brainCheckpoints=new BrainCheckpointStore();
