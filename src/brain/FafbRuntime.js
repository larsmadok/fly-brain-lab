// FAFB v783 runtime scaffold.
// Connectivity and transmitter metadata are loaded as external versioned assets;
// do not commit the full connectome into Git.
export class FafbRuntime {
  constructor({plastic=false, manifest=null}={}){this.plastic=plastic;this.manifest=manifest;this.ready=false;this.neurons=139255;this.edges=0;this.error=null}
  async load(){
    try{
      // Browser runtime intentionally waits for a prepared compact asset manifest.
      // The adapter API is stable so rooms do not need to change when the full graph is attached.
      if(!this.manifest) throw new Error('FAFB compact graph not installed');
      this.ready=true;return this;
    }catch(e){this.error=e.message;this.ready=false;return this}
  }
  info(){return{dataset:'FAFB',release:'v783',neurons:this.neurons,edges:this.edges,plastic:this.plastic,ready:this.ready,error:this.error}}
}
