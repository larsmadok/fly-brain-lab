export const BRAINS={
 synthetic96:{id:'synthetic96',name:'Synthetic 96',neurons:96,status:'control'},
 synthetic1k:{id:'synthetic1k',name:'Synthetic 1K',neurons:1024,status:'control'},
 synthetic10k:{id:'synthetic10k',name:'Synthetic 10K',neurons:10240,status:'control'},
 fafb:{id:'fafb',name:'Drosophila FAFB v783',neurons:139255,status:'dataset'},
 fafbPlastic:{id:'fafbPlastic',name:'Drosophila FAFB + Plasticity',neurons:139255,status:'experimental'}
};
export function brainInfo(id){return BRAINS[id]||BRAINS.synthetic96}
