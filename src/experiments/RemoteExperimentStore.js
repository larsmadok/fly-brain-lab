const API=import.meta.env.VITE_API_URL||'';
export async function saveBatch(runs,brain){if(!API)return{saved:0,offline:true};const payload=runs.map(r=>({...r,brain,config:{source:'warehouse-v2'}}));const res=await fetch(API+'/api/runs/batch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('Experiment API '+res.status);return res.json()}
export async function getRemoteSummary(){if(!API)return null;const r=await fetch(API+'/api/summary');return r.ok?r.json():null}
