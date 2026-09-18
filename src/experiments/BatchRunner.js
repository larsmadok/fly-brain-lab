import {WarehouseV2} from '../rooms/WarehouseV2';
export function runWarehouseBatch({count=10,flies=4,startSeed=2026,maxTicks=5000}={}){
 const runs=[];for(let i=0;i<count;i++){const room=new WarehouseV2(startSeed+i,flies);let lastProgress=0,lastCompleted=0;while(!room.finished&&room.t<maxTicks){room.step();if(room.completed!==lastCompleted){lastCompleted=room.completed;lastProgress=room.t}if(room.t-lastProgress>1200)break}const reason=room.finished?'complete':room.t>=maxTicks?'timeout':'deadlock';runs.push({seed:startSeed+i,flies,ticks:room.t,completed:room.completed,total:room.orders.length,score:room.score,collisions:room.collisions,reason})}return runs;
}
