"use strict";
/* ARI Habitat Lab v25. Independent scenario data; no changes to Gemini Live or medical records. */
(() => {
  const stage = document.getElementById("ari-experience");
  if (!stage) return;
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
  const KEY="ari.habitat-lab.v25";
  const SOURCES={
    travel:{title:"NASA · How Long Does it Take to Get to the Moon… Mars?",url:"https://www.nasa.gov/directorates/smd/how-long-does-it-take-to-get-to-the-moon-mars-jupiter-we-asked-a-nasa-expert-episode-51/"},
    radiation:{title:"NASA · Artemis as a Testbed for Mars",url:"https://www.nasa.gov/humans-in-space/step-3-artemis-moon-missions-as-an-astronaut-testbed-for-mars/"},
    life:{title:"NASA · Environmental Control and Life Support System",url:"https://www.nasa.gov/wp-content/uploads/2025/08/g-657270-59-hp-environmental-control-and-life-support-system-eclss.pdf"},
    crew:{title:"NASA · Designing Space Exploration With the Human in Mind",url:"https://www.nasa.gov/general/designing-space-exploration-with-the-human-in-mind/"},
    cost:{title:"GAO · Artemis cost-estimate limitations",url:"https://www.gao.gov/products/gao-24-107249"},
    hazards:{title:"NASA · Human Spaceflight Hazards",url:"https://www.nasa.gov/ochmo-hmta-human-spaceflight-hazards/"},
    pureflow:{title:"NASA · 2025 Global Winners: PureFlow",url:"https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/"}
  };
  const WORLD={
    orbit:{name:"Órbita terrestre baja",icon:"◉",duration:"Depende del lanzamiento y encuentro orbital",transit:0.5,difficulty:"Complejidad logística moderada (escala didáctica)",radiation:"Radiación superior a superficie terrestre; protección parcial de magnetosfera",comm:"Retardo habitualmente pequeño; cobertura y enlace variables",terrain:"Plataforma en órbita (representación artística)",class:"ms-orbit",stays:30},
    moon:{name:"Superficie lunar",icon:"☾",duration:"Varios días; ~3 días en trayectos rápidos tipo Apollo",transit:3,difficulty:"Complejidad logística elevada (escala didáctica)",radiation:"Entorno de espacio profundo, sin magnetosfera lunar global",comm:"Retardo por distancia de ~1,3 s en un sentido (variable)",terrain:"Regolito lunar estilizado",class:"ms-moon",stays:14},
    mars:{name:"Superficie de Marte",icon:"◌",duration:"~7 a 10 meses en un trayecto habitual",transit:240,difficulty:"Complejidad logística muy elevada (escala didáctica)",radiation:"Tránsito interplanetario más expuesto; atmósfera marciana delgada",comm:"Varios minutos por trayecto; varía con distancia orbital",terrain:"Paisaje marciano ilustrativo",class:"ms-mars",stays:180}
  };
  const VEHICLES={
    orbit:["Cápsula de transporte + estación", "Nave orbital de mantenimiento"],
    moon:["Cápsula + módulo de descenso", "Transporte + base lunar modular"],
    mars:["Vehículo interplanetario + aterrizador", "Transporte + hábitat integrado"]
  };
  const MODULES={
    core:{name:"Núcleo central",short:"NÚC",hex:"#6c9cf1",height:0.88,detail:"Pasillo principal y espacio común"},
    crew:{name:"Dormitorios",short:"DORM",hex:"#be96f3",height:0.83,detail:"Zona privada y descanso de tripulantes"},
    air:{name:"Aire y oxígeno",short:"O₂",hex:"#52c4b3",height:0.96,detail:"Soporte atmosférico simulado"},
    water:{name:"Recuperación de agua",short:"AGUA",hex:"#4ba9db",height:0.82,detail:"Purificación y recuperación ilustrativas"},
    power:{name:"Energía",short:"ENER",hex:"#e4b560",height:0.67,detail:"Suministro energético simulado"},
    comm:{name:"Comunicaciones",short:"COM",hex:"#e693ae",height:1.1,detail:"Enlace y almacenamiento de mensajes"},
    med:{name:"Atención de salud",short:"MED",hex:"#76d7a4",height:0.78,detail:"Espacio para revisión y ARI"},
    shelter:{name:"Refugio de tormentas",short:"RAD",hex:"#e99470",height:0.68,detail:"Zona de resguardo; blindaje no certificado"},
    stores:{name:"Almacén",short:"ALM",hex:"#9daec5",height:0.72,detail:"Reservas, suministros y herramientas"},
    lab:{name:"Laboratorio",short:"LAB",hex:"#92c8ed",height:0.84,detail:"Investigación de misión"}
  };
  const INCIDENTS={
    nominal:{title:"Operación normal",icon:"✧",desc:"Comprobar qué necesita el hábitat para su funcionamiento básico."},
    solar:{title:"Evento de partículas solares",icon:"☀",desc:"Evaluar la presencia de un área de resguardo ante un evento solar hipotético."},
    power:{title:"Interrupción de energía",icon:"⚡",desc:"Observar si existen módulos energéticos redundantes."},
    water:{title:"Fallo de recuperación de agua",icon:"≈",desc:"Comprobar si existe respaldo del sistema de agua."},
    link:{title:"Enlace con Tierra interrumpido",icon:"⌁",desc:"Comprobar capacidades locales y mensajes pendientes."}
  };
  const defaultLayout=[{x:3,z:3,type:"core"},{x:4,z:3,type:"crew"},{x:3,z:4,type:"power"}];
  const plain=()=>({destination:"moon",vehicle:"Cápsula + módulo de descenso",crew:2,stay:14,budget:"",incident:"nominal",module:"air",step:1,layout:defaultLayout.map(o=>({...o})),yaw:.72,pitch:.72,zoom:1,selected:null,seeded:true});
  let s=plain();
  try{
    const v=JSON.parse(localStorage.getItem(KEY)||"null");
    if(v&&typeof v==="object"){
      const fresh=plain();
      s={...fresh,...v};
      s.destination=WORLD[s.destination]?s.destination:"moon";
      s.vehicle=VEHICLES[s.destination].includes(s.vehicle)?s.vehicle:VEHICLES[s.destination][0];
      s.crew=Math.max(2,Math.min(12,Number(s.crew)||2));
      s.stay=Math.max(1,Math.min(700,Number(s.stay)||14));
      s.incident=INCIDENTS[s.incident]?s.incident:"nominal";
      s.module=MODULES[s.module]?s.module:"air";
      s.step=Math.max(1,Math.min(4,Number(s.step)||1));
      s.layout=Array.isArray(s.layout)?s.layout.filter(m=>MODULES[m.type]&&Number.isInteger(m.x)&&Number.isInteger(m.z)&&m.x>=0&&m.x<8&&m.z>=0&&m.z<8).slice(0,64):defaultLayout;
      s.yaw=Number.isFinite(Number(s.yaw))?Number(s.yaw):.72;
      s.pitch=Math.max(.36,Math.min(1.12,Number(s.pitch)||.72));
      s.zoom=Math.max(.6,Math.min(1.75,Number(s.zoom)||1));
    }
  } catch {}
  const root=document.createElement("section");
  root.id="ari-mission-builder";
  root.className="ari-page ms-root";
  root.hidden=true;
  root.setAttribute("aria-label","Simulador de hábitat de misión espacial");
  root.innerHTML=`
    <div class="ms-hero">
      <div class="ms-eyebrow"><span class="ms-live-dot"></span> ARI / MISSION DESIGN LAB <span class="ms-tag">SIMULACIÓN EDUCATIVA</span></div>
      <h1>Diseñá una misión.<br><em>Ponela a prueba.</em></h1>
      <p>Elegí un destino, prepará un hogar para tu tripulación y observá cómo responde a situaciones espaciales. Sin experiencia previa.</p>
      <div class="ms-guide"><span class="ms-guide-icon">✦</span><span id="ms-guide-text">Empezá por elegir adónde viajará tu tripulación.</span></div>
    </div>
    <nav class="ms-steps" aria-label="Pasos del simulador">
      <button type="button" data-ms-step="1"><b>01</b><span>Elegir misión</span></button>
      <button type="button" data-ms-step="2"><b>02</b><span>Construir</span></button>
      <button type="button" data-ms-step="3"><b>03</b><span>Probar riesgos</span></button>
      <button type="button" data-ms-step="4"><b>04</b><span>Resultados</span></button>
    </nav>
    <div id="ms-step-1" class="ms-step">
      <div class="ms-section-heading"><div><span class="ms-kicker">PASO 1 · CONFIGURACIÓN</span><h2>¿Cuál es tu destino?</h2><p>Las referencias de viaje proceden de NASA; las categorías de dificultad son una interpretación didáctica.</p></div></div>
      <div class="ms-destination-grid">
        <button type="button" class="ms-destination" data-ms-dest="orbit"><span class="ms-dest-visual ms-dest-orbit"><span></span></span><small>01 / EN ÓRBITA</small><strong>Órbita terrestre</strong><em>Protección parcial terrestre</em></button>
        <button type="button" class="ms-destination" data-ms-dest="moon"><span class="ms-dest-visual ms-dest-moon"><span></span></span><small>02 / LUNA</small><strong>Superficie lunar</strong><em>Viaje de varios días</em></button>
        <button type="button" class="ms-destination" data-ms-dest="mars"><span class="ms-dest-visual ms-dest-mars"><span></span></span><small>03 / MARTE</small><strong>Superficie marciana</strong><em>Tránsito de meses</em></button>
      </div>
      <div class="ms-fact-panel"><div><span class="ms-kicker">PERFIL DEL DESTINO</span><h3 id="ms-dest-title"></h3><div id="ms-dest-facts" class="ms-facts"></div></div><div class="ms-fact-sources"><a href="${SOURCES.travel.url}" target="_blank" rel="noopener noreferrer">NASA · Tiempos de viaje ↗</a><a href="${SOURCES.radiation.url}" target="_blank" rel="noopener noreferrer">NASA · Radiación ↗</a></div></div>
      <div class="ms-config-grid">
        <label class="ms-field">Tripulantes en el escenario (mínimo 2)<span class="ms-field-control"><button type="button" id="ms-minus" aria-label="Restar un tripulante">−</button><output id="ms-crew-output">2</output><button type="button" id="ms-plus" aria-label="Añadir un tripulante">+</button></span></label>
        <label class="ms-field">Días de estancia en destino <input id="ms-stay" type="number" min="1" max="700" step="1" inputmode="numeric"/><span class="ms-field-note">Estancia configurable; la duración total suma el viaje de ida y vuelta de referencia.</span></label>
      </div>
      <div class="ms-vehicle-panel"><div><span class="ms-kicker">¿EN QUÉ VIAJAN?</span><h3>Elegí un tipo de nave</h3><p>Conceptos de transporte para tu escenario, sin afirmar modelos ni prestaciones reales.</p></div><div id="ms-vehicle-options" class="ms-vehicle-options"></div></div>
      <div class="ms-crew-panel"><span class="ms-kicker">QUIÉNES VIAJAN</span><div id="ms-crew-names"></div><p>Usamos los nombres de los perfiles disponibles en ARI. Los espacios adicionales son personajes ficticios del simulador; no se crean nuevos historiales médicos.</p></div>
      <div class="ms-journey-card"><div><span class="ms-kicker">ESTIMACIÓN DIDÁCTICA DE MISIÓN</span><strong id="ms-journey"></strong><small id="ms-journey-note"></small></div><div class="ms-journey-icon" aria-hidden="true">✧</div></div>
      <div class="ms-actions"><button type="button" class="ms-primary" data-ms-go="2">Continuar: construir hábitat <span>→</span></button></div>
    </div>
    <div id="ms-step-2" class="ms-step" hidden>
      <div class="ms-section-heading"><div><span class="ms-kicker">PASO 2 · CONSTRUCCIÓN INTERACTIVA</span><h2>Construí tu hábitat en 3D</h2><p>Elegí un módulo y después tocá una casilla libre. Arrastrá el escenario para girarlo; usá la rueda del mouse o los botones para acercarte.</p></div><button id="ms-autobuild" class="ms-secondary" type="button">✦ Crear ejemplo completo</button></div>
      <div class="ms-build-layout">
        <div class="ms-canvas-col">
          <div class="ms-canvas-top"><div><span class="ms-scene-dot"></span><strong id="ms-scene-title">HÁBITAT / LUNA</strong></div><span>VISTA 3D INTERACTIVA · MAQUETA</span></div>
          <div id="ms-scene" class="ms-scene ms-moon"><canvas id="ms-canvas" tabindex="0" role="img" aria-label="Maqueta tridimensional interactiva del hábitat. Elegí módulos en la lista y seleccioná celdas de la cuadrícula para construir."></canvas><div class="ms-scene-hint" id="ms-scene-hint">Seleccioná un módulo → tocá el suelo</div><div class="ms-scene-tools"><button type="button" id="ms-zoom-in" title="Acercar" aria-label="Acercar">+</button><button type="button" id="ms-zoom-out" title="Alejar" aria-label="Alejar">−</button><button type="button" id="ms-camera-reset" title="Reiniciar cámara" aria-label="Reiniciar cámara">↻</button></div></div>
          <div class="ms-selected-bar"><div id="ms-selected-label">Elegí un módulo y colocálo en una casilla.</div><button id="ms-remove" type="button" class="ms-danger" disabled>Quitar seleccionado</button></div>
          <p class="ms-canvas-footnote">Modelo tridimensional conceptual hecho para ARI, no planos estructurales ni cálculo de blindaje certificado.</p>
        </div>
        <aside class="ms-palette"><div class="ms-palette-head"><span class="ms-kicker">CATÁLOGO DE MÓDULOS</span><strong>¿Qué querés colocar?</strong></div><div class="ms-module-list" id="ms-module-list"></div><div class="ms-palette-footer"><button id="ms-undo" type="button">↶ Deshacer último</button><button id="ms-clear" type="button">Restablecer</button></div></aside>
      </div>
      <div class="ms-live-check"><div><span class="ms-kicker">PREPARACIÓN DEL DISEÑO</span><strong id="ms-ready-title">Calculando estructura…</strong><p id="ms-ready-sub"></p></div><div class="ms-progressbar"><span id="ms-progress"></span></div></div>
      <div class="ms-actions ms-actions-split"><button class="ms-secondary" type="button" data-ms-go="1">← Volver</button><button class="ms-primary" type="button" data-ms-go="3">Probar situaciones <span>→</span></button></div>
    </div>
    <div id="ms-step-3" class="ms-step" hidden>
      <div class="ms-section-heading"><div><span class="ms-kicker">PASO 3 · PRUEBAS DEL ESCENARIO</span><h2>¿Y si algo sale mal?</h2><p>Elegí una situación ficticia. ARI analiza qué sistemas agregaste y explica qué falta; no calcula probabilidades clínicas ni certifica seguridad.</p></div></div>
      <div id="ms-incidents" class="ms-incident-grid"></div>
      <div class="ms-risk-result" id="ms-risk-result" aria-live="polite"></div>
      <div class="ms-actions ms-actions-split"><button class="ms-secondary" type="button" data-ms-go="2">← Editar hábitat</button><button class="ms-primary" type="button" data-ms-go="4">Ver informe de misión <span>→</span></button></div>
    </div>
    <div id="ms-step-4" class="ms-step" hidden>
      <div class="ms-section-heading"><div><span class="ms-kicker">PASO 4 · INFORME EXPLICADO</span><h2>El resultado de tu misión</h2><p>Comprobaciones de cobertura funcional para este juego. No indican la probabilidad real de supervivencia ni cumplimiento normativo de NASA.</p></div></div>
      <div class="ms-report-top"><div><span class="ms-kicker">COBERTURA DE FUNCIONES DE LA MAQUETA</span><strong id="ms-report-score">0%</strong><small>Proporción de funciones representadas en el diseño, no seguridad real.</small></div><div><span class="ms-kicker">ESTADO DEL ESCENARIO</span><strong id="ms-report-status"></strong><small id="ms-report-recommendation"></small></div></div>
      <div id="ms-report-list" class="ms-report-list"></div>
      <div class="ms-cost-box"><div><span class="ms-kicker">PRESUPUESTO · DATO OPCIONAL DEL USUARIO</span><h3>¿Querés anotar tu propia estimación de costo?</h3><p>No existe un precio único NASA aplicable a una misión. Este campo no calcula presupuestos oficiales ni atribuye cifras a la agencia.</p></div><label>Costo hipotético de tu escenario (USD)<input type="number" id="ms-budget" min="0" step="1000" placeholder="Opcional · sin calcular" /></label><a href="${SOURCES.cost.url}" target="_blank" rel="noopener noreferrer">Por qué no mostramos un «costo oficial» inventado ↗</a></div>
      <div class="ms-actions ms-actions-split ms-export-actions"><button class="ms-secondary" type="button" data-ms-go="2">← Seguir construyendo</button><button class="ms-secondary" type="button" id="ms-reset-scenario">Nueva misión</button><button class="ms-primary" type="button" id="ms-export">↓ Descargar informe JSON</button></div>
    </div>
    <div class="ms-sources"><span class="ms-kicker">FUENTES Y LÍMITES DEL MODELO</span><p>Se usaron referencias públicas de NASA para los tiempos aproximados, peligros y tipos de sistemas. Las reglas de módulos, categorías y escenarios son un ejercicio de software de ARI, no una simulación física ni una validación de la NASA. Los datos se guardan solo en este navegador.</p><div id="ms-source-links"></div></div>
  `;
  stage.append(root);
  const inRoot=q=>$(q,root), all=q=>$$(q,root);
  inRoot("#ms-source-links").replaceChildren(...Object.values(SOURCES).map(item=>{const a=document.createElement("a");a.href=item.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=item.title+" ↗";return a}));
  const lastMoves=[];
  function save(){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}}
  function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
  function esc(value){return String(value).replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function counts(){const c={};for(const m of s.layout)c[m.type]=(c[m.type]||0)+1;return c;}
  function requirements(){
    const c=counts();const scale=Math.ceil(s.crew/4);
    const desired=[
      ["core",1,"Conexión entre áreas comunes"],
      ["crew",scale,"Descanso para la tripulación"],
      ["air",scale,"Gestión de aire y oxígeno"],
      ["water",scale,"Recuperación y acceso a agua"],
      ["power",scale,"Suministro energético"],
      ["comm",1,"Comunicación y registro de mensajes"],
      ["med",1,"Área de salud y seguimiento con ARI"],
      ...(s.destination!=="orbit"?[["shelter",1,"Zona de resguardo para eventos solares"]]:[]),
      ["stores",1,"Reserva de suministros"]
    ];
    return desired.map(([type,needed,explain])=>({type,needed,has:c[type]||0,ok:(c[type]||0)>=needed,explain}));
  }
  function summary(){const r=requirements();return {r,ok:r.filter(a=>a.ok).length,percentage:Math.round(100*r.filter(a=>a.ok).length/r.length)};}
  function getCrew(){try{return window.ariCrew?.list?.()||[];}catch{return []}}
  function members(){const registered=getCrew();return Array.from({length:s.crew},(_,i)=>registered[i]?.name||"Tripulante de demo "+(i+1));}
  function profile(){return WORLD[s.destination];}
  function needCount(type){return Math.ceil(s.crew/4) * (["crew","air","water","power"].includes(type)?1:0) || 1;}
  function setMessage(message){inRoot("#ms-guide-text").textContent=message;}
  function setStep(n){s.step=clamp(Number(n)||1,1,4);save();render();if(location.hash==="#mision")root.scrollIntoView({block:"start",behavior:"smooth"});}
  function render(){
    all(".ms-step").forEach((e,i)=>e.hidden=i+1!==s.step);
    all("[data-ms-step]").forEach((e,i)=>{e.classList.toggle("is-active",i+1===s.step);e.classList.toggle("is-done",i+1<s.step);e.setAttribute("aria-current",i+1===s.step?"step":"false")});
    const tips={1:"Empezá por elegir el destino y los tripulantes; después presioná «Continuar».",2:"Elegí un módulo de la derecha, después tocá el suelo para construir. También podés generar un ejemplo completo.",3:"Elegí una situación y mirá qué cambia. Si hace falta algo, volvé a construirlo.",4:"Este informe explica qué funciones cubriste y qué podrías mejorar. Podés descargarlo."};
    setMessage(tips[s.step]);
    if(s.step===1)renderSetup();
    if(s.step===2){renderPalette();renderChecks();resizeScene();}
    if(s.step===3)renderIncidents();
    if(s.step===4)renderReport();
  }
  function renderSetup(){
    all("[data-ms-dest]").forEach(button=>{button.classList.toggle("is-selected",button.dataset.msDest===s.destination);button.setAttribute("aria-pressed",String(button.dataset.msDest===s.destination))});
    const w=profile();
    inRoot("#ms-dest-title").textContent=w.name;
    inRoot("#ms-dest-facts").innerHTML=`<div><small>TIEMPO DE IDA · REFERENCIA</small><strong>${esc(w.duration)}</strong></div><div><small>COMPLEJIDAD</small><strong>${esc(w.difficulty)}</strong></div><div><small>RADIACIÓN · DESCRIPCIÓN</small><strong>${esc(w.radiation)}</strong></div><div><small>COMUNICACIÓN</small><strong>${esc(w.comm)}</strong></div>`;
    inRoot("#ms-vehicle-options").innerHTML=VEHICLES[s.destination].map(v=>`<button type="button" data-ms-vehicle="${esc(v)}" class="${s.vehicle===v?"is-selected":""}" aria-pressed="${s.vehicle===v}">${esc(v)}</button>`).join("");
    inRoot("#ms-crew-output").textContent=s.crew;
    inRoot("#ms-stay").value=s.stay;
    inRoot("#ms-crew-names").innerHTML=members().map((name,i)=>`<span class="ms-crew-name"><b>${i+1}</b>${esc(name)}</span>`).join("");
    const days=s.destination==="orbit"?s.stay:Math.round(2*w.transit+s.stay);
    inRoot("#ms-journey").textContent=s.destination==="orbit"?`${s.stay} días en órbita · escenario`:`≈ ${days} días de misión completa`;
    inRoot("#ms-journey-note").textContent=s.destination==="mars"?`Modelo: ~240 días por trayecto como valor ilustrativo dentro del rango NASA de 7–10 meses, más ${s.stay} días de estancia.`:s.destination==="moon"?`Modelo: ~3 días por trayecto como ejemplo, más ${s.stay} días de estancia. La trayectoria real puede variar.`:"Se trata de la duración elegida para la estancia; no se calcula aquí el tiempo real de lanzamiento o encuentro orbital.";
  }
  function renderPalette(){
    inRoot("#ms-module-list").innerHTML=Object.entries(MODULES).map(([key,m])=>`<button type="button" data-ms-module="${key}" class="ms-module ${s.module===key?"is-picked":""}"><span class="ms-module-color" style="--mod-color:${m.hex}">${esc(m.short)}</span><span><strong>${esc(m.name)}</strong><small>${esc(m.detail)}</small></span><span class="ms-module-count">${counts()[key]||0}</span></button>`).join("");
    inRoot("#ms-scene").className="ms-scene "+profile().class;
    inRoot("#ms-scene-title").textContent="ESCENARIO / "+profile().name.toUpperCase();
    const selected=s.selected&&s.layout.find(m=>m.x===s.selected.x&&m.z===s.selected.z);
    inRoot("#ms-selected-label").textContent=selected?"Seleccionado: "+MODULES[selected.type].name+" · casilla "+(selected.x+1)+","+(selected.z+1):"Agregá un módulo a una casilla libre. Si tocás uno existente, podés quitarlo.";
    inRoot("#ms-remove").disabled=!selected;
    inRoot("#ms-scene-hint").textContent=`Colocando: ${MODULES[s.module].name} · tocá una casilla libre`;
    inRoot("#ms-undo").disabled=lastMoves.length===0;
    if(root.hidden===false)drawScene();
  }
  function renderChecks(){
    const r=summary();
    inRoot("#ms-ready-title").textContent=r.ok+" de "+r.r.length+" funciones representadas";
    inRoot("#ms-ready-sub").textContent=r.ok===r.r.length?"Se han representado las funciones previstas por el juego. Esto NO certifica seguridad ni viabilidad espacial.":"Faltan: "+r.r.filter(x=>!x.ok).slice(0,3).map(x=>MODULES[x.type].name).join(", ")+(r.r.filter(x=>!x.ok).length>3?" y otros módulos.":".");
    inRoot("#ms-progress").style.width=r.percentage+"%";
  }
  function risk(){
    const c=counts(),req=summary();let severity="info",headline="Operación normal · evaluación funcional",detail="La tripulación necesita aire, agua, energía, descanso y comunicación. ARI comprobará cuáles están representados en la maqueta.", suggestions=[];
    const need=(type)=>((c[type]||0)<needCount(type));
    if(s.incident==="solar"){
      if(s.destination==="orbit"){
        severity="warn";headline="Revisar planes de protección y dosimetría";detail="La órbita baja tiene protección parcial de la magnetosfera, pero no está libre de radiación. Un evento solar hipotético requiere evaluación operacional y seguimiento de dosis; esta maqueta no calcula blindaje.";suggestions=["Revisar procedimiento de radiación y alertas de misión","Consultar lecturas reales de dosímetros si estuvieran disponibles"];
      }else if(!c.shelter){severity="critical";headline="Falta el módulo de refugio";detail="En este escenario de Luna o Marte no hay una zona de resguardo identificada. Agregá un módulo para representar esa función. La presencia de un módulo no demuestra blindaje suficiente.";suggestions=["Añadir refugio de tormentas en Construir","Validar el blindaje y el protocolo con especialistas de misión"]}
      else {severity="warn";headline="Refugio representado; protección no validada";detail="La maqueta incluye una zona de resguardo. No podemos calcular si protege de un evento solar: faltan geometría, materiales, dosis y datos de exposición.";suggestions=["Realizar análisis de blindaje especializado","Conservar procedimientos, alertas y mediciones de dosis"]}
    } else if(s.incident==="power"){
      if(!c.power){severity="critical";headline="No se representó suministro energético";detail="El escenario carece del módulo básico de energía.";suggestions=["Añadir módulos de energía","Definir redundancia de alimentación en un diseño real"]}
      else if(need("power")||c.power<=needCount("power")){severity="warn";headline="No hay capacidad redundante en el juego";detail="El diseño cuenta con la capacidad básica de energía del escenario, pero una falla de un módulo puede dejar recursos sin respaldo.";suggestions=["Añadir un módulo de energía adicional","Priorizar soporte vital con redundancia verificada"]}
      else{headline="Respaldo de energía representado";detail="La maqueta cuenta con módulos extra de energía. No calcula potencia real, autonomía de baterías ni fiabilidad.";suggestions=["Probar consumo, autonomía y conmutación en un modelo de ingeniería"]}
    } else if(s.incident==="water"){
      if(!c.water){severity="critical";headline="No hay sistema de recuperación de agua";detail="El diseño no representa una función imprescindible de gestión de agua.";suggestions=["Añadir recuperación de agua","Planificar reservas y tratamientos seguros"]}
      else if(c.water<=needCount("water")){severity="warn";headline="Sin recuperación redundante en el escenario";detail="Hay capacidad básica de recuperación, pero una avería puede dejar el sistema sin respaldo representado.";suggestions=["Añadir un segundo módulo de recuperación de agua","Consultar principios ECLSS de NASA"]}
      else{headline="Redundancia de agua representada";detail="Hay más de un módulo de agua. La maqueta no modela litros reales, pureza ni porcentajes de recuperación.";suggestions=["Verificar balances de agua con datos y equipos reales"]}
    } else if(s.incident==="link"){
      severity=c.comm?"warn":"critical";headline=c.comm?"Enlace interrumpido · comunicaciones previstas":"Falta módulo de comunicaciones";detail=c.comm?"Se representa una unidad de comunicaciones, pero en este incidente ficticio el enlace no está disponible. ARI puede mantener la bitácora local y enviar después, sin que esto implique comunicación real con Tierra.":"No se ha colocado un módulo de comunicaciones. Un corte ficticio puede dejar informes pendientes de transmitir.";suggestions=["Mantener registros locales", "Reanudar sincronización al restablecer enlace", "Considerar el retardo según el destino"];
    } else {
      if(req.ok<req.r.length){severity="warn";headline="Faltan funciones de soporte en el diseño";detail="El hábitat cubre "+req.ok+" de "+req.r.length+" funciones del juego. No es una evaluación de salud o seguridad real.";suggestions=req.r.filter(x=>!x.ok).map(x=>"Añadir: "+MODULES[x.type].name).slice(0,4);}
      else {headline="Funciones representadas en la maqueta";detail="El modelo contiene todos los módulos requeridos por las reglas didácticas de ARI. Aún faltarían validaciones de ingeniería, salud, operaciones y factores humanos.";suggestions=["Revisar redundancias de soporte vital","Evaluar procedimientos y riesgos reales con expertos"]}
    }
    return {severity,headline,detail,suggestions};
  }
  function renderIncidents(){
    inRoot("#ms-incidents").innerHTML=Object.entries(INCIDENTS).map(([key,i])=>`<button type="button" class="ms-incident ${key===s.incident?"is-active":""}" data-ms-incident="${key}" aria-pressed="${key===s.incident}"><span>${i.icon}</span><strong>${i.title}</strong><small>${i.desc}</small></button>`).join("");
    const q=risk();
    inRoot("#ms-risk-result").innerHTML=`<div class="ms-risk-head"><span class="ms-risk-pill ms-${q.severity}">${q.severity==="critical"?"ATENCIÓN EN EL ESCENARIO":q.severity==="warn"?"REQUIERE REVISIÓN":"INFORMACIÓN"}</span><span>ANÁLISIS EXPLICABLE · ARI</span></div><h3>${esc(q.headline)}</h3><p>${esc(q.detail)}</p><h4>Siguiente paso sugerido</h4><ul>${q.suggestions.map(item=>`<li>${esc(item)}</li>`).join("")}</ul><small>Resultado de reglas predefinidas de simulación, no de una evaluación clínica ni del modelo Gemini.</small>`;
  }
  function renderReport(){
    const r=summary(),q=risk();
    inRoot("#ms-report-score").textContent=r.percentage+"%";
    inRoot("#ms-report-status").textContent=r.ok===r.r.length?"Funciones completas en maqueta":"Diseño aún incompleto";
    inRoot("#ms-report-recommendation").textContent=r.ok===r.r.length?"Pasá a pruebas de validación de ingeniería.":"Agregá los módulos que faltan para representar lo esencial.";
    inRoot("#ms-report-list").innerHTML=r.r.map(item=>`<div class="ms-report-item"><span class="ms-report-icon ${item.ok?"yes":"no"}">${item.ok?"✓":"!"}</span><div><strong>${esc(MODULES[item.type].name)}</strong><small>${esc(item.explain)}</small></div><span>${item.has} / ${item.needed}</span></div>`).join("");
    inRoot("#ms-budget").value=s.budget;
  }
  function exportData(){
    const record={app:"ARI · Mission Design Lab",version:25,generatedAt:new Date().toISOString(),disclaimer:"SIMULACIÓN DIDÁCTICA. NO NASA OFICIAL. NO valida habitabilidad, seguridad, radiación, presupuestos ni salud.",destination:profile().name,vehicleConcept:s.vehicle,crewCount:s.crew,crewNames:members(),destinationStayDays:s.stay,indicativeTransitDays:s.destination==="orbit"?null:profile().transit,approximateTotalDays:s.destination==="orbit"?null:s.stay+2*profile().transit,modules:s.layout.map(m=>({...m,name:MODULES[m.type].name})),coverage:summary(),incident:INCIDENTS[s.incident].title,incidentAssessment:risk(),hypotheticalUserBudgetUSD:s.budget?Number(s.budget):null,sources:Object.values(SOURCES)};
    const data=new Blob([JSON.stringify(record,null,2)],{type:"application/json"});const url=URL.createObjectURL(data);const a=document.createElement("a");a.download="ARI-escenario-"+s.destination+".json";a.href=url;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function newMission(){if(!confirm("¿Reiniciar el simulador? Se perderán los módulos de este escenario (no los datos médicos de ARI)."))return;s=plain();lastMoves.length=0;save();setStep(1);}
  // Conceptual 3D renderer. No external libraries, independent of the Gemini engine.
  const canvas=inRoot("#ms-canvas");const ctx=canvas.getContext("2d");
  let cw=800,ch=460,hover=null,originX=0,originY=0,unit=40;let drag=null;
  function resizeScene(){
    const container=inRoot("#ms-scene");if(!container||container.clientWidth===0)return;
    cw=Math.max(280,container.clientWidth);ch=Math.max(300,container.clientHeight);const ratio=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(cw*ratio);canvas.height=Math.round(ch*ratio);canvas.style.width=cw+"px";canvas.style.height=ch+"px";ctx.setTransform(ratio,0,0,ratio,0,0);
    originX=cw*.5;originY=ch*.55;unit=Math.min(cw/14.4,ch/9.3)*s.zoom;
    drawScene();
  }
  function project(x,y,z){
    const dx=x-4,dz=z-4;
    const horizontal=Math.cos(s.yaw)*dx-Math.sin(s.yaw)*dz;
    const distance=Math.sin(s.yaw)*dx+Math.cos(s.yaw)*dz;
    return {x:originX+horizontal*unit,y:originY+(distance*Math.sin(s.pitch)-y*Math.cos(s.pitch))*unit};
  }
  function poly(points,fill,stroke,width=1){ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
  function rgba(hex,a){const h=hex.replace("#","");return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`}
  function background(){
    const grad=ctx.createLinearGradient(0,0,0,ch);if(s.destination==="mars"){grad.addColorStop(0,"#05070c");grad.addColorStop(.65,"#17121a");grad.addColorStop(1,"#42291f")}else if(s.destination==="moon"){grad.addColorStop(0,"#02050b");grad.addColorStop(.72,"#10131e");grad.addColorStop(1,"#222734")}else{grad.addColorStop(0,"#02050c");grad.addColorStop(1,"#071522")};ctx.fillStyle=grad;ctx.fillRect(0,0,cw,ch);
    let seed=41321;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    for(let i=0;i<150;i++){const x=rnd()*cw,y=rnd()*ch*.83,r=rnd()*.85+.2;ctx.fillStyle=`rgba(223,238,255,${.15+rnd()*.55})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
    if(s.destination==="orbit"){
      const x=cw*.80,y=ch*.06,r=Math.min(cw*.24,ch*.45);const g=ctx.createRadialGradient(x-r*.35,y-r*.3,5,x,y,r);g.addColorStop(0,"#519ad4");g.addColorStop(.45,"#1d668b");g.addColorStop(.83,"#082c5b");g.addColorStop(1,"#04101a");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(128,201,251,.48)";ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle="rgba(147,211,194,.2)";ctx.beginPath();ctx.ellipse(x-r*.22,y-r*.15,r*.45,r*.1,-.7,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle=s.destination==="mars"?"rgba(226,155,117,.21)":"rgba(192,206,228,.22)";ctx.beginPath();ctx.arc(cw*.84,ch*.13,Math.min(35,cw*.06),0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle="rgba(226,239,255,.46)";ctx.font="10px Segoe UI, sans-serif";ctx.textAlign="left";ctx.fillText((profile().terrain+" · representación artística").toUpperCase(),16,ch-16);
  }
  const cells=[];
  function drawScene(){if(!ctx)return;ctx.clearRect(0,0,cw,ch);background();cells.length=0;
    const list=[];
    for(let z=0;z<8;z++)for(let x=0;x<8;x++)list.push({x,z,depth:Math.sin(s.yaw)*(x+.5)+Math.cos(s.yaw)*(z+.5)});
    list.sort((a,b)=>a.depth-b.depth);
    for(const cell of list){const {x,z}=cell;const points=[project(x,0,z),project(x+1,0,z),project(x+1,0,z+1),project(x,0,z+1)];cells.push({x,z,points});
      const isHover=hover?.x===x&&hover?.z===z;const selected=s.selected?.x===x&&s.selected?.z===z;
      const accent=s.destination==="mars"?"#b47d63":s.destination==="moon"?"#7d90a8":"#427c9a";
      poly(points,isHover?"rgba(137,226,239,.24)":selected?"rgba(137,226,239,.17)":rgba(accent,(x+z)%2===0?.18:.115),isHover?"rgba(139,237,247,.8)":"rgba(159,198,233,.19)",isHover?1.3:.7);
    }
    for(const cell of list){const model=s.layout.find(m=>m.x===cell.x&&m.z===cell.z);if(model)drawModule(model)}
    ctx.textAlign="right";ctx.font="10px Segoe UI, sans-serif";ctx.fillStyle="rgba(215,235,251,.52)";ctx.fillText(`${s.layout.length} MÓDULOS  ·  MAQUETA CONCEPTUAL`,cw-17,20);
  }
  function drawModule(m){const info=MODULES[m.type];const x=m.x+.10,z=m.z+.10,size=.8,h=info.height;
    const base=[project(x,0,z),project(x+size,0,z),project(x+size,0,z+size),project(x,0,z+size)];const top=[project(x,h,z),project(x+size,h,z),project(x+size,h,z+size),project(x,h,z+size)];
    const chosen=s.selected?.x===m.x&&s.selected?.z===m.z;
    ctx.shadowColor=rgba(info.hex,chosen?.6:.2);ctx.shadowBlur=chosen?22:8;
    poly([base[0],base[1],top[1],top[0]],rgba(info.hex,.58),rgba(info.hex,.7));
    poly([base[1],base[2],top[2],top[1]],rgba(info.hex,.24),rgba(info.hex,.65));
    poly([base[2],base[3],top[3],top[2]],rgba(info.hex,.4),rgba(info.hex,.7));
    poly([base[3],base[0],top[0],top[3]],rgba(info.hex,.18),rgba(info.hex,.64));
    poly(top,rgba(info.hex,.83),chosen?"#e9fdff":"rgba(255,255,255,.6)",chosen?2:1);
    ctx.shadowBlur=0;
    const center=project(m.x+.5,h+.06,m.z+.5);
    ctx.font=`${Math.max(9,Math.min(13,unit*.23))}px Segoe UI, sans-serif`;
    ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#07131d";ctx.fillText(info.short,center.x,center.y);
    if(chosen){ctx.strokeStyle="rgba(235,252,255,.86)";ctx.lineWidth=1.6;ctx.strokeRect(center.x-26,center.y-12,52,24)}
  }
  function pointInside(x,y,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if(((a.y>y)!==(b.y>y))&&(x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x))c=!c}return c;}
  function pick(clientX,clientY){const rect=canvas.getBoundingClientRect();const px=clientX-rect.left,py=clientY-rect.top;return [...cells].reverse().find(c=>pointInside(px,py,c.points))||null;}
  function remember(){lastMoves.push(s.layout.map(x=>({...x})));if(lastMoves.length>30)lastMoves.shift();}
  function put(x,z){const existing=s.layout.find(m=>m.x===x&&m.z===z);
    if(existing){s.selected={x,z};inRoot("#ms-scene-hint").textContent="Seleccionaste "+MODULES[existing.type].name+". Podés quitarlo o agregar módulos en casillas libres."}
    else{remember();s.layout.push({x,z,type:s.module});s.selected={x,z};inRoot("#ms-scene-hint").textContent=MODULES[s.module].name+" agregado. Elegí otra casilla o módulo."}
    save();renderPalette();renderChecks();
  }
  function autoBuild(){remember();const types=["core","crew","air","water","power","comm","med","shelter","stores","lab"];
    const positions=[[3,3],[4,3],[3,4],[4,4],[2,3],[5,3],[2,4],[5,4],[3,2],[4,2],[2,2],[5,2],[2,5],[5,5],[3,5],[4,5],[1,3],[6,3],[1,4],[6,4]];
    let i=0;const added=[];for(const type of types){if(type==="shelter"&&s.destination==="orbit")continue;const need=["crew","air","water","power"].includes(type)?Math.ceil(s.crew/4):1;for(let n=0;n<need;n++){if(i>=positions.length)break;added.push({...{x:positions[i][0],z:positions[i][1]},type});i++}}s.layout=added;s.selected=null;save();renderPalette();renderChecks();setMessage("Ejemplo creado. Podés girar el hábitat, quitar módulos o poner a prueba un incidente. Esto no certifica el diseño.");}
  canvas.addEventListener("pointerdown",ev=>{if(root.hidden)return;canvas.setPointerCapture?.(ev.pointerId);drag={x:ev.clientX,y:ev.clientY,yaw:s.yaw,pitch:s.pitch,moved:false}});
  canvas.addEventListener("pointermove",ev=>{if(root.hidden)return;if(drag){const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;if(Math.hypot(dx,dy)>7)drag.moved=true;if(drag.moved){s.yaw=drag.yaw+dx*.009;s.pitch=clamp(drag.pitch+dy*.003,.38,1.1);drawScene()}}else{const hit=pick(ev.clientX,ev.clientY);if(hit?.x!==hover?.x||hit?.z!==hover?.z){hover=hit;drawScene()}}});
  canvas.addEventListener("pointerup",ev=>{if(!drag)return;if(!drag.moved){const hit=pick(ev.clientX,ev.clientY);if(hit)put(hit.x,hit.z)}drag=null;save()});
  canvas.addEventListener("pointercancel",()=>{drag=null});
  canvas.addEventListener("pointerleave",()=>{if(!drag){hover=null;drawScene()}});
  canvas.addEventListener("wheel",ev=>{ev.preventDefault();s.zoom=clamp(s.zoom+(ev.deltaY>0?-.08:.08),.58,1.7);save();resizeScene()},{passive:false});
  canvas.addEventListener("keydown",ev=>{if(ev.key==="ArrowLeft"){s.yaw-=.14;ev.preventDefault()}else if(ev.key==="ArrowRight"){s.yaw+=.14;ev.preventDefault()}else if(ev.key==="ArrowUp"){s.zoom=clamp(s.zoom+.1,.58,1.7);ev.preventDefault()}else if(ev.key==="ArrowDown"){s.zoom=clamp(s.zoom-.1,.58,1.7);ev.preventDefault()}else{return}save();resizeScene()});
  inRoot("#ms-module-list").addEventListener("click",e=>{const b=e.target.closest("[data-ms-module]");if(!b)return;s.module=b.dataset.msModule;s.selected=null;save();renderPalette()});
  inRoot("#ms-autobuild").addEventListener("click",autoBuild);
  inRoot("#ms-remove").addEventListener("click",()=>{if(!s.selected)return;remember();s.layout=s.layout.filter(m=>m.x!==s.selected.x||m.z!==s.selected.z);s.selected=null;save();renderPalette();renderChecks()});
  inRoot("#ms-undo").addEventListener("click",()=>{if(!lastMoves.length)return;s.layout=lastMoves.pop();s.selected=null;save();renderPalette();renderChecks()});
  inRoot("#ms-clear").addEventListener("click",()=>{if(!confirm("¿Dejar solo el núcleo de ejemplo?"))return;remember();s.layout=[{type:"core",x:3,z:3}];s.selected=null;save();renderPalette();renderChecks()});
  inRoot("#ms-zoom-in").addEventListener("click",()=>{s.zoom=clamp(s.zoom+.16,.58,1.7);save();resizeScene()});
  inRoot("#ms-zoom-out").addEventListener("click",()=>{s.zoom=clamp(s.zoom-.16,.58,1.7);save();resizeScene()});
  inRoot("#ms-camera-reset").addEventListener("click",()=>{s.yaw=.72;s.pitch=.72;s.zoom=1;save();resizeScene()});
  root.addEventListener("click",e=>{const step=e.target.closest("[data-ms-step], [data-ms-go]");if(step){setStep(step.dataset.msStep||step.dataset.msGo);return}const dest=e.target.closest("[data-ms-dest]");if(dest){s.destination=dest.dataset.msDest;s.vehicle=VEHICLES[s.destination][0];s.stay=WORLD[s.destination].stays;s.incident="nominal";save();renderSetup();return}const vehicle=e.target.closest("[data-ms-vehicle]");if(vehicle){s.vehicle=vehicle.dataset.msVehicle;save();renderSetup();return}const event=e.target.closest("[data-ms-incident]");if(event){s.incident=event.dataset.msIncident;save();renderIncidents();return}});
  inRoot("#ms-minus").addEventListener("click",()=>{s.crew=clamp(s.crew-1,2,12);save();renderSetup()});
  inRoot("#ms-plus").addEventListener("click",()=>{s.crew=clamp(s.crew+1,2,12);save();renderSetup()});
  inRoot("#ms-stay").addEventListener("change",e=>{s.stay=clamp(Math.round(Number(e.target.value)||1),1,700);save();renderSetup()});
  inRoot("#ms-budget").addEventListener("change",e=>{s.budget=e.target.value===""?"":String(clamp(Number(e.target.value)||0,0,1e15));save();renderReport()});
  inRoot("#ms-reset-scenario").addEventListener("click",newMission);
  inRoot("#ms-export").addEventListener("click",exportData);
  function refreshRoute(){if(location.hash==="#mision"){root.hidden=false;render();setTimeout(resizeScene,60)}else root.hidden=true;}
  window.addEventListener("hashchange",refreshRoute);
  window.addEventListener("resize",()=>{if(location.hash==="#mision")resizeScene()});
  if(typeof ResizeObserver!=="undefined")new ResizeObserver(()=>{if(location.hash==="#mision"&&s.step===2)resizeScene()}).observe(inRoot("#ms-scene"));
  // Avoid touching the current mission profile or medical log; scenario starts with same crew size when no previous configuration.
  if(!localStorage.getItem(KEY)){s.crew=clamp(Number(window.ariCrew?.seats?.()||2),2,12);save()}
  render();window.ariUI?.route?.();refreshRoute();
  window.ariHabitat={open:()=>{location.hash="mision"},getState:()=>structuredClone(s),requirements,autoBuild};
})();
