/** Reglas deterministas en Node. No depende de Gemini ni de navegadores. */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const html=readFileSync(resolve(root,'index.html'),'utf8');
const experience=readFileSync(resolve(root,'ari-experience.js'),'utf8');
const habitat=readFileSync(resolve(root,'habitat.js'),'utf8');
assert(!/who\.int|\bOMS\b|Organización Mundial de la Salud/i.test(html+experience+habitat), 'La biblioteca usa algo distinto de NASA');
assert(html.includes('https://www.nasa.gov/hrp/hazards/') && html.includes('https://www.nasa.gov/hrp/risks/') && html.includes('https://www.nasa.gov/hrp/ongoing-hrp-research/'));
function fn(name,next){
  const begin=html.indexOf('function '+name+'(');
  const end=html.indexOf('\nfunction '+next+'(',begin);
  assert(begin>=0&&end>begin,'Falta función: '+name);
  return html.slice(begin,end);
}
const metricNames=['headache','dizziness','fatigue','stress'];
const day=(check)=>({checks:{morning:check},vision:[],events:[],drafts:{}});
const mk=(headache,others={})=>({headache,dizziness:others.dizziness??0,fatigue:others.fatigue??0,stress:others.stress??0,
  blurry:others.blurry??'no',mood:others.mood??'bien',time:'09:00'});
const a={id:'alice',name:'Alicia',days:{
  '2026-11-12':day(mk(2)), '2026-11-13':day(mk(4)),
  '2026-11-14':day(mk(6,{dizziness:2,stress:8,blurry:'yes',mood:'preocupado'}))
}};
const b={id:'bruno',name:'Bruno',days:{'2026-11-14':day(mk(0))}};
let active=a;
const shiftDay=(d,i)=>{const dt=new Date(d+'T12:00:00Z');dt.setUTCDate(dt.getUTCDate()+i);return dt.toISOString().slice(0,10);};
const dayOf=(p,d)=>p?.days?.[d]??null;
const lastCheck=(d)=>d?.checks?.afternoon??d?.checks?.morning??null;
const metricSample=(p,d,k)=>{const c=lastCheck(dayOf(p,d));return Number.isFinite(c?.[k])?{value:c[k],check:c}:null;};
const refs=['cefalea','vision','sueno','vestibular','salud_mental_nasa','hrp_riesgos_2026'].map(id=>({id,title:id,url:'https://www.nasa.gov/hrp/risks/'}));
const context={ARI_REFERENCES:refs,clock:()=>({day:'2026-11-14',time:'16:00'}),crew:()=>active,
  dayOf,lastCheck,metricSample,shiftDay,METRICS:Object.fromEntries(metricNames.map(x=>[x,x]))};
vm.createContext(context);
vm.runInContext(fn('assess','nextSlot')+'\n'+fn('historialParaGemini','resumenHistorialParaInicio'),context);
const history=context.historialParaGemini({dias:3});
assert.equal(history.tripulante,'Alicia');
assert.equal(history.datos[0].indicadores_ultimo_turno.headache,2);
assert.equal(history.datos[1].indicadores_ultimo_turno.headache,4);
assert.equal(history.datos[2].indicadores_ultimo_turno.headache,6);
const alert=context.assess(a,'2026-11-14');
assert.equal(alert.level,'priority');
assert(alert.signals.some(s=>s.title.includes('ascendente')));
assert(alert.signals.some(s=>s.title.includes('visual')));
assert(alert.references.every(r=>r.url.startsWith('https://www.nasa.gov/')));
assert.equal(context.assess(b,'2026-11-14'),null);
active=b;
const historyB=context.historialParaGemini({dias:3});
assert.equal(historyB.datos[2].indicadores_ultimo_turno.headache,0);
assert.equal(historyB.datos[0].indicadores_ultimo_turno,null);
assert.equal(historyB.tripulante,'Bruno');
assert.equal(context.assess(b,'2026-11-14'),null);
console.log('✓ Fuentes de NASA presentes, OMS ausente');
console.log('✓ Tres fechas y valores 2 → 4 → 6; faltantes ≠ cero');
console.log('✓ Cambio visual y tendencia: regla de revisión explicable');
console.log('✓ Dos tripulantes sin mezcla de historial');
console.log('✓ Hábitat original incluido (archivo existente)');
