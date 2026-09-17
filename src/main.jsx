import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SyntheticBrain} from './brain/SyntheticBrain';
import {ControlRoom} from './rooms/ControlRoom';
import './style.css';

function App(){
 const brain=useRef(new SyntheticBrain(42)); const room=useRef(new ControlRoom(42));
 const [running,setRunning]=useState(false),[speed,setSpeed]=useState(80),[state,setState]=useState(room.current.step('wait')),[neural,setNeural]=useState({spikes:[],action:'wait'}),[events,setEvents]=useState([]);
 const step=()=>{const b=brain.current.step(room.current.sensors()); const s=room.current.step(b.action); setNeural(b);setState(s);setEvents(e=>[`#${s.t}  ${b.action.toUpperCase()}  T ${s.temp.toFixed(1)}°  integrity ${s.integrity.toFixed(1)}%`,...e].slice(0,14)); if(s.integrity<=0)setRunning(false)};
 useEffect(()=>{if(!running)return;const id=setInterval(step,speed);return()=>clearInterval(id)},[running,speed]);
 const reset=()=>{room.current=new ControlRoom(42);brain.current=new SyntheticBrain(42);setState(room.current.step('wait'));setNeural({spikes:[],action:'wait'});setEvents([]);setRunning(false)};
 return <main><header><div><small>EXPERIMENTAL COMPUTATIONAL NEUROSCIENCE</small><h1>FLY BRAIN LAB</h1></div><div className="status"><i/> SYNTHETIC SNN · 96 NEURONS</div></header>
 <section className="toolbar"><button onClick={()=>setRunning(!running)}>{running?'PAUSE':'RUN EXPERIMENT'}</button><button onClick={step}>STEP</button><button onClick={reset}>RESET</button><label>speed <input type="range" min="20" max="400" value={speed} onChange={e=>setSpeed(+e.target.value)}/></label><b>RUN #0001 / SEED 42</b></section>
 <div className="grid"><section className="panel room"><h2>ROOM 01 — STATION CONTROL</h2><div className="machine"><div className="tank">COOLING<br/><strong>{state.cooling?'ON':'OFF'}</strong></div><div className="core">THERMAL CORE<br/><strong>{state.temp.toFixed(1)}°C</strong><span style={{height:`${Math.min(100,state.temp*2)}%`}}/></div><div className="tank">WATER PUMP<br/><strong>{state.pump?'ON':'OFF'}</strong></div></div><div className="meters"><Meter n="ENERGY" v={state.energy}/><Meter n="WATER" v={state.water}/><Meter n="INTEGRITY" v={state.integrity}/></div><p className="action">BRAIN ACTION → <strong>{neural.action?.toUpperCase()}</strong></p></section>
 <section className="panel"><h2>NEURAL ACTIVITY</h2><div className="neurons">{Array.from({length:96},(_,i)=><i key={i} className={neural.spikes?.[i]?'fire':''}/>)}</div><p className="legend">Each dot = one simulated spiking neuron. Bright = spike this tick.</p></section>
 <section className="panel log"><h2>EXPERIMENT RECORDER</h2>{events.map((x,i)=><code key={i}>{x}</code>)}</section><section className="panel"><h2>PROTOCOL</h2><p>The brain receives normalized sensor signals only. It does not receive room rules or target actions.</p><p><b>Goal:</b> keep station integrity above zero under continuous disturbances.</p><p className="warn">PHASE A: synthetic LIF-like network. This is not yet a Drosophila connectome.</p></section></div>
 </main>}
function Meter({n,v}){return <div><label>{n}<b>{Math.max(0,v).toFixed(1)}%</b></label><span><i style={{width:`${Math.max(0,v)}%`}}/></span></div>}
createRoot(document.getElementById('root')).render(<App/>);
