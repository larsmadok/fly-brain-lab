// Adapter boundary for the real FAFB v783 connectome.
// It deliberately refuses to masquerade as a working fly brain until a validated
// graph, neurotransmitter signs, sensory mappings and descending-neuron outputs exist.
export class FafbBrainAdapter{
 constructor(manifest){this.manifest=manifest;this.ready=false;this.reason='FAFB graph runtime not loaded'}
 async init(){this.ready=false;return this}
 step(){throw new Error('FAFB runtime is not active yet')}
 status(){return{ready:this.ready,reason:this.reason,neurons:this.manifest?.neurons||139255}}
}
