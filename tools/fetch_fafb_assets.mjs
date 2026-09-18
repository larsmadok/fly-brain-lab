import {mkdir,writeFile} from 'node:fs/promises';
const base='https://github.com/larsmadok/fly-brain-lab/releases/download/fafb-v783-runtime';
const names=['csr-manifest.json','io-map.json','dense-io.json','offsets.u32','posts.u32','weights.i32'];
await mkdir('public/data/fafb-v783/runtime',{recursive:true});
for(const name of names){
  const r=await fetch(base+'/'+name,{redirect:'follow'});
  if(!r.ok)throw new Error(name+' download failed: '+r.status);
  const b=Buffer.from(await r.arrayBuffer());
  await writeFile('public/data/fafb-v783/runtime/'+name,b);
  console.log(name,b.length);
}
