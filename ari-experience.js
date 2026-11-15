"use strict";
/* A lightweight presentation layer. State, Gemini Live and the mission log remain in index.html. */
(() => {
  window.ariImmersive = true;
  let countdown = null;
  let audioCtx = null;
  let flashTimer = null;
  const oldRoot = document.querySelector("body > .topbar");
  const shell = document.createElement("div");
  shell.id = "cosmic-backdrop";
  shell.setAttribute("aria-hidden", "true");
  shell.innerHTML = '<canvas id="ari-stars"></canvas><div class="cosmic-nebula cosmic-nebula--one"></div><div class="cosmic-nebula cosmic-nebula--two"></div><div class="cosmic-planet"></div><div class="cosmic-vignette"></div>';
  document.body.insertBefore(shell, oldRoot);

  const stage = document.createElement("div");
  stage.id = "ari-experience";
  stage.innerHTML = `
    <header class="ari-top">
      <a class="ari-mark" href="#hoy" aria-label="ARI, inicio"><span class="ari-mark-symbol" aria-hidden="true">✧</span><span class="ari-mark-text">ARI<small>ELARIS DEVELOPMENT</small></span></a>
      <div class="ari-top-actions"><div class="ari-connection"><span id="ari-signal-dot" class="ari-status-dot"></span><span id="ari-link-label">Tierra conectada</span></div><button class="ari-small-button" type="button" id="ari-profile">Perfil</button></div>
    </header>
    <section class="ari-home ari-page" id="ari-home" aria-label="Hablar con ARI">
      <div class="ari-overline">Mission intelligence · voice interface</div>
      <h1 class="ari-intro-title" id="ari-welcome">Tu misión. Tu bienestar.</h1>
      <p class="ari-intro-sub" id="ari-subtitle">Estoy aquí para escucharte y acompañarte durante la misión.</p>
      <div class="ari-orb-wrap" id="ari-orb-wrap">
        <div class="ari-orb-glow"></div><div class="ari-ring ari-ring--outer"></div><div class="ari-ring ari-ring--middle"></div><div class="ari-ring ari-ring--inner"></div>
        <button class="ari-orb-button" id="ari-talk" type="button" aria-label="Iniciar conversación con ARI" title="Hablar con ARI"><span class="ari-orb-halo"></span><span class="ari-orb-core"></span></button>
        <div class="ari-waveform" aria-hidden="true">${Array.from({length:13},()=>'<span></span>').join("")}</div>
      </div>
      <p id="ari-session-state" class="ari-session-state" role="status">HABLÁ CON ARI POR VOZ</p>
      <div class="ari-live-area" aria-live="polite" aria-atomic="false">
        <div id="ari-live-subtitle" class="ari-live-subtitle">Podés hablar conmigo con naturalidad.</div>
        <div id="ari-heard" class="ari-heard"></div>
      </div>
      <p class="ari-start-hint" id="ari-helper">Gemini Live · La misma voz durante todo el chequeo</p>
      <div class="ari-wake-panel" aria-label="Activación por voz">
        <button id="ari-wake-toggle" class="ari-action ari-action--strong" type="button" aria-pressed="false">Activar «Hola, ARI»</button>
        <p id="ari-wake-status" role="status">Activá una vez el micrófono y después decí «Hola, ARI» para conversar sin tocar el núcleo. Funciona con esta pestaña abierta.</p>
        <button class="ari-action" id="ari-sound-toggle" type="button" hidden>Alternativa: iniciar al detectar voz</button>
        <p id="ari-sound-note" hidden>Esta alternativa no distingue la frase «Hola, ARI»: puede activarse con cualquier voz cercana y abrir una sesión Gemini que utiliza cuota. Solo funciona con la pestaña abierta.</p>
      </div>
      <section class="ari-evidence" id="ari-evidence" aria-label="Fuentes científicas que consultó ARI" hidden><div class="ari-evidence-title">REFERENCIAS NASA · BIBLIOTECA LOCAL</div><div id="ari-evidence-links" class="ari-evidence-links"></div><p>Las referencias dan contexto científico. Las sugerencias de ARI no son instrucciones médicas oficiales.</p></section>
      <div class="ari-live-actions"><button id="ari-end" class="ari-action" type="button" hidden>Terminar conversación</button><button id="ari-review" class="ari-action" type="button" hidden>Reintentar Gemini</button><button id="ari-fallback" class="ari-action" type="button" hidden>Ver respaldo manual (opcional)</button></div>
      <section class="ari-crew-section" aria-label="Tripulación y sus indicadores">
        <div class="ari-crew-heading"><div><span class="ari-crew-overline">TRIPULACIÓN DE MISIÓN</span><h2 id="ari-crew-title">2 tripulantes previstos</h2></div><button type="button" class="ari-crew-config" id="ari-crew-config">Configurar</button></div>
        <div class="ari-indicators" id="ari-live-indicators" aria-label="Indicadores por miembro de la tripulación"></div>
        <section class="ari-health-brief" id="ari-health-brief" aria-label="Seguimiento de salud observado" hidden>
          <p class="ari-health-brief-label">SEGUIMIENTO EXPLICABLE · DATOS SINTÉTICOS</p>
          <h3 id="ari-health-brief-title"></h3><p id="ari-health-brief-detail"></p>
          <p id="ari-health-brief-action"></p><div id="ari-health-brief-sources"></div>
        </section>
        <p class="ari-crew-help">Seleccioná un tripulante para conversar con ARI y registrar sus chequeos por separado.</p>
      </section>
      <p class="ari-minimal-note">Prototipo de misión · datos de demostración · no sustituye atención médica</p>
    </section>
    <section id="ari-simulation" class="ari-page" hidden>
      <div class="ari-panel-heading"><small>Control de prueba · ARI</small><h1>Simular un turno de misión</h1><p>Elegí un horario y observá cómo ARI pasa de cinco segundos antes del turno a la notificación exacta. No tenés que ajustar relojes ni completar formularios.</p></div>
      <div class="ari-sim-grid">
        <article class="ari-sim-card"><div class="ari-sim-icon" aria-hidden="true">☀</div><h2>Chequeo de las 09:00</h2><p>ARI prepara su saludo matutino y el chequeo de sueño, ánimo y síntomas.</p><button type="button" data-ari-sim="morning">Simular las 08:59:55</button></article>
        <article class="ari-sim-card"><div class="ari-sim-icon" aria-hidden="true">☾</div><h2>Chequeo de las 16:00</h2><p>ARI inicia el chequeo vespertino y revisa cambios durante el día.</p><button type="button" data-ari-sim="afternoon">Simular las 15:59:55</button></article>
        <article class="ari-sim-monitor"><div class="ari-monitor-label">RELOJ DE MISIÓN · DEMOSTRACIÓN</div><div class="ari-clock-big" id="ari-demo-clock">--:--:--</div><div class="ari-clock-message" id="ari-demo-message">Elegí un horario para iniciar la cuenta regresiva.</div><div class="ari-countdown-track"><div id="ari-countdown-progress" class="ari-countdown-progress"></div></div></article>
      </div>
      <div class="ari-sim-helper"><span>Esta simulación usa el día de misión actual. No cambia el reloj del sistema operativo.</span><button id="ari-real-clock" type="button">Volver a hora real</button><button id="ari-open-protocols" type="button">Ver procedimientos</button></div>
    </section>
  `;
  document.body.insertBefore(stage,document.querySelector("body > .wrap"));

  const nav = document.createElement("nav");
  nav.className = "ari-bottom-nav";
  nav.setAttribute("aria-label", "Navegación de ARI");
  const icons = {
    hoy:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9l2.1 2.1m10 10 2.1 2.1M19.1 4.9 17 7m-10 10-2.1 2.1"/>',
    historial:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M8 15h4m-4 3h8"/>',
    mision:'<path d="m12 2 9 4-9 4-9-4 9-4Zm-9 4v11l9 5 9-5V6m-9 4v12"/>',
    tierra:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>',
    simulacion:'<path d="m8 5 12 7-12 7z"/><path d="M4 5v14"/>'
  };
  for (const [key,name] of [["hoy","ARI"],["mision","Hábitat"],["historial","Historial"],["tierra","Tierra"],["simulacion","Horarios"]]) {
    const a = document.createElement("a");
    a.href = "#"+key;
    a.className = "ari-tab";
    a.dataset.ariTab = key;
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg><span>${name}</span>`;
    nav.append(a);
  }
  document.body.append(nav);

  const flash = document.createElement("div");
  flash.className = "ari-floating-alert";
  flash.id = "ari-flash";
  flash.hidden = true;
  flash.setAttribute("role", "status");
  document.body.append(flash);

  const el = id => document.getElementById(id);
  const liveOrb = el("ari-orb-wrap");
  let started = false;
  let checkActive = false;
  function mood(name,label) {
    liveOrb.classList.remove("is-listening","is-speaking","is-connecting","is-error");
    if (name) liveOrb.classList.add("is-"+name);
    el("ari-session-state").textContent = label || (wakeEnabled ? "DECÍ «HOLA, ARI»" : "ACTIVÁ «HOLA, ARI» O TOCÁ EL NÚCLEO");
  }
  function message(text) {
    el("ari-live-subtitle").textContent = text || "Podés hablar conmigo con naturalidad.";
  }
  function heard(text) { el("ari-heard").textContent = text ? 'Escuchado: “'+text.slice(0,190)+'”' : ''; }
  function status(text) {
    if (!text) return;
    if (/conectando|comprobando|esperando permiso/i.test(text)) mood("connecting","CONECTANDO · GEMINI LIVE");
    else if (/voz (?:de Gemini )?conectada/i.test(text)) {
      mood("listening","GEMINI LIVE · EN LÍNEA");started=true;
      el("ari-review").hidden=true;el("ari-fallback").hidden=true;
    }
    else if (/voz detectada/i.test(text)) mood("listening","ESCUCHANDO");
    else if (/error|rechaz|falló|cerró|límite|no pudo|sin conexión|inactividad/i.test(text)) { mood("error","NO SE PUDO CONECTAR"); message(text); el("ari-fallback").hidden=false; }
  }
  function flashNotice(text) {
    flash.textContent = text;
    flash.hidden = false;
    clearTimeout(flashTimer);
    flashTimer=setTimeout(()=>{flash.hidden=true},5000);
  }
  function showEvidence(references = []) {
    const panel=el("ari-evidence"),links=el("ari-evidence-links");
    links.replaceChildren();
    const allowed=(references||[]).filter(ref=>{
      try { const url=new URL(ref.url); return url.protocol==="https:" && ["www.nasa.gov","nasa.gov"].includes(url.hostname); } catch{return false;}
    }).slice(0,3);
    panel.hidden=!allowed.length;
    for (const ref of allowed) {
      const anchor=document.createElement("a");anchor.href=ref.url;anchor.target="_blank";anchor.rel="noopener noreferrer";
      const badge=document.createElement("strong");badge.textContent=ref.agency;
      const headline=document.createElement("span");headline.textContent=ref.title;
      anchor.append(badge,headline);links.append(anchor);
    }
  }
  const symptomKeys = [["headache","Cabeza"],["dizziness","Mareo"],["fatigue","Cansancio"],["stress","Estrés"]];
  function renderMetrics() {
    const members = typeof crewList==="function" ? crewList() : Object.values(state.crew);
    const seats = typeof crewSeats==="function" ? crewSeats() : Math.max(2,members.length);
    const currentDay = clock().day;
    const node = el("ari-live-indicators");
    node.replaceChildren();
    el("ari-crew-title").textContent = members.length+" de "+seats+" tripulantes registrados";
    for(let i=0;i<seats;i++){
      const person=members[i];
      const card=document.createElement("article");
      card.className="ari-crew-card"+(person?.id===state.active?" is-current":"")+(!person?" is-vacant":"");
      card.dataset.crewId=person?.id||"";
      const select=document.createElement("button");
      select.type="button";select.className="ari-crew-select";
      select.setAttribute("aria-label",person ? "Seleccionar a "+person.name : "Añadir tripulante "+(i+1));
      select.innerHTML='<span class="ari-crew-avatar" aria-hidden="true">'+String(i+1).padStart(2,"0")+'</span><span class="ari-crew-info"><strong></strong><small></small></span><span class="ari-crew-chevron" aria-hidden="true">↗</span>';
      select.querySelector(".ari-crew-info strong").textContent=person?.name || "Tripulante "+(i+1);
      select.querySelector(".ari-crew-info small").textContent=person ? (person.id===state.active?"Perfil activo · chequear":"Seleccionar para chequear") : "Pendiente de registrar · añadir";
      select.addEventListener("click",()=>window.ariCrew?.choose?.(i));
      card.append(select);
      if(person){
        const today=dayOf(person,currentDay);
        const live={...(today?.checks?.afternoon??today?.checks?.morning??{})};
        if(checkContext?.id===person.id && el("check-dialog")?.open && el("check-form")?.elements){
          for(const [k] of symptomKeys){
            const val=el("check-form").elements[k]?.value;
            if(val!==undefined && val!=="")live[k]=Number(val);
          }
        }
        const row=document.createElement("div");row.className="ari-crew-metrics";
        for(const [k,label] of symptomKeys){
          const metric=document.createElement("div");metric.className="ari-crew-metric";metric.dataset.metric=k;
          const keyval=live[k];
          metric.innerHTML='<small></small><strong></strong>';
          metric.querySelector("small").textContent=label;
          metric.querySelector("strong").textContent=typeof keyval==="number" ? keyval+"/10":"—";
          row.append(metric);
        }
        card.append(row);
        const note=document.createElement("p");note.className="ari-crew-check-status";
        const count=Object.keys(today?.checks??{}).length;
        note.textContent=count+" de 2 chequeos registrados hoy";
        card.append(note);
      }else{
        const note=document.createElement("p");note.className="ari-crew-check-status";
        note.textContent="Sin síntomas ni chequeos hasta registrar a esta persona.";
        card.append(note);
      }
      node.append(card);
    }
    const person=crew();
    const brief=el("ari-health-brief"), currentSignal=person && typeof assess==="function" ? assess(person,currentDay):null;
    brief.hidden=!currentSignal;
    if(currentSignal){
      el("ari-health-brief-title").textContent=currentSignal.title;
      el("ari-health-brief-detail").textContent=currentSignal.reason;
      el("ari-health-brief-action").textContent="Sugerencia de ARI: "+currentSignal.suggestion;
      const links=el("ari-health-brief-sources");links.replaceChildren();
      const prefix=document.createElement("span");prefix.textContent="Contexto NASA: ";links.append(prefix);
      for(const r of currentSignal.references||[]){
        const a=document.createElement("a");a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=r.titulo;links.append(a);
      }
    }
    el("ari-welcome").textContent=person?"Hola, "+person.name+".":"Bienvenida, tripulación.";
    el("ari-profile").textContent="Tripulación · "+members.length+"/"+seats;
  }
  function setCheckActive(value){
    checkActive=!!value;
    el("ari-review").hidden=true;
    el("ari-fallback").hidden=true;
    el("ari-end").hidden=!value;
    if(value){
      window.ariWake?.pause();
      mood("connecting","INICIANDO CHEQUEO CON GEMINI");
      message("ARI te hará las preguntas en voz alta. Respondé normalmente.");
      heard("");
    } else if(!el("chat-dialog").open){
      started=false;
      mood(null);
      setTimeout(()=>window.ariWake?.resume(),250);
    }
  }
  function voiceError(text) {
    message(text);
    mood("error","REVISÁ LA CONEXIÓN CON GEMINI");
    el("ari-review").hidden=false;
    el("ari-fallback").hidden=false;
    el("ari-end").hidden=false;
  }
  function showMetric(k,value) {
    const active=Array.from(document.querySelectorAll(".ari-crew-card")).find(n=>n.dataset.crewId===state.active);
    const card=Array.from(active?.querySelectorAll("[data-metric]")||[]).find(n=>n.dataset.metric===k);
    if (card) { card.querySelector("strong").textContent=value+"/10";card.style.animation="none";void card.offsetHeight;card.style.animation="ari-rise .45s both"; }
    const title = {headache:"Dolor de cabeza",dizziness:"Mareo",fatigue:"Cansancio",stress:"Estrés",mood:"Ánimo",sleep:"Sueño",blurry:"Visión"}[k]||k;
    if (!card) flashNotice(title+": "+value+(Object.hasOwn(METRICS,k)?"/10":"")+" · Registro de voz");
  }
  function onSpeaking(flag) {
    if (flag) mood("speaking","ARI ESTÁ HABLANDO");
    else if (started) mood("listening","ESCUCHANDO");
  }
  function closeConversation() {
    window.ariRealtime?.close();
    const chat=el("chat-dialog"),check=el("check-dialog");
    if(chat.open) chat.close();
    if(check.open) check.close();
    started=false;
    checkActive=false;el("ari-review").hidden=true;
    mood(null,"TOCÁ EL NÚCLEO PARA HABLAR");
    el("ari-end").hidden=true;
    message("Podés hablar conmigo con naturalidad.");
    heard("");
    setTimeout(()=>window.ariWake?.resume(),300);
  }
  function startConversation() {
    if (started || el("chat-dialog").open || el("check-dialog").open) return closeConversation();
    window.ariWake?.pause();
    showEvidence([]);
    if (location.hash !== "#hoy") location.hash="#hoy";
    el("ari-fallback").hidden=true;
    el("ari-end").hidden=false;
    mood("connecting","CONECTANDO · GEMINI LIVE");
    message(crew()?"Estoy preparando nuestra conversación…":"Hola. ¿Cómo te llamás?");
    try { connectRealtimeChat(); } catch (error) { status(String(error)); }
  }
  el("ari-talk").addEventListener("click",startConversation);
  el("ari-end").addEventListener("click",closeConversation);
  function revealCheckFallback() {
    const dialog=el("check-dialog");
    if (!dialog.open) return;
    window.ariRealtime?.close();
    dialog.classList.remove("ari-headless");
    dialog.close();
    dialog.showModal();
    showLocalCheck(false);
    checkActive=true;el("ari-review").hidden=true;
    flashNotice("Podés revisar las respuestas que se alcanzaron a registrar.");
  }
  el("ari-review").addEventListener("click",()=>{
    if (!el("check-dialog").open) return;
    el("ari-review").hidden=true;
    el("ari-fallback").hidden=true;
    mood("connecting","RECONECTANDO · GEMINI LIVE");
    startRealtimeCheck();
  });
  el("ari-fallback").addEventListener("click",()=>{
    if(el("check-dialog").open){revealCheckFallback();return;}
    closeConversation();
    const dialog=el("profile-dialog");
    if(!crew()) baselineEditor("new");
    else { const chat=el("chat-dialog");chat.classList.remove("ari-headless");openLocalChat(); }
    if(!dialog.open && !el("chat-dialog").open) flashNotice("Podés usar el perfil o la bitácora sin Gemini Live.");
  });
  el("ari-profile").addEventListener("click",()=>baselineEditor(crew()?"edit":"new"));
  el("ari-crew-config").addEventListener("click",()=>baselineEditor(crew()?"edit":"new"));
  el("ari-real-clock").addEventListener("click",()=>{
    stopCountdown();
    change(s=>{s.clock={mode:"real",day:localClock().day};s.voiceClockChosen=true;});
    el("ari-demo-clock").textContent="--:--:--";
    el("ari-demo-message").textContent="Hora de misión real restaurada.";
    el("ari-countdown-progress").style.width="0%";
  });
  el("ari-open-protocols").addEventListener("click",()=>{location.hash="procedimientos";});

  function stopCountdown(){if(countdown!==null){clearInterval(countdown);countdown=null;}}
  function ensureProfileForSimulation(){
    if(crew()) return;
    loadDemo({quiet:true});
    flashNotice("Modo demostración: se ha creado el perfil ficticio de Alicia.");
  }
  function chime() {
    try {
      audioCtx??=new (window.AudioContext||window.webkitAudioContext)();
      audioCtx.resume();
      const t=audioCtx.currentTime;
      for(const [i,freq] of [740,987,1244].entries()) {
        const osc=audioCtx.createOscillator(),amp=audioCtx.createGain();
        osc.type="sine";osc.frequency.value=freq;
        amp.gain.setValueAtTime(0,t+i*.19);
        amp.gain.linearRampToValueAtTime(.085,t+i*.19+.02);
        amp.gain.exponentialRampToValueAtTime(.001,t+i*.19+.45);
        osc.connect(amp);amp.connect(audioCtx.destination);
        osc.start(t+i*.19);osc.stop(t+i*.19+.46);
      }
    } catch { /* Visual notification remains available. */ }
  }
  function simulate(slot) {
    window.ariWake?.pause();
    stopCountdown();
    if(el("reminder-dialog").open) el("reminder-dialog").close();
    closeConversation();
    ensureProfileForSimulation();
    window.ariRealtime?.play()?.catch(()=>{});
    const target = slot === "morning" ? "09" : "16";
    const hour = slot === "morning" ? "08" : "15";
    const startedAt = performance.now();
    const display = el("ari-demo-clock");
    const progress = el("ari-countdown-progress");
    const description = el("ari-demo-message");
    display.textContent=hour+":59:55";progress.style.width="0%";
    if (window.innerWidth<760) el("ari-demo-clock").closest(".ari-sim-monitor")?.scrollIntoView({behavior:"smooth",block:"center"});
    description.textContent="ARI está preparando el aviso de las "+target+":00…";
    const step = () => {
      const elapsed=performance.now()-startedAt;
      const passed=Math.min(5,Math.floor(elapsed/1000));
      if(passed<5){display.textContent=hour+":59:"+String(55+passed).padStart(2,"0");progress.style.width=Math.min(100,elapsed/50)+"%";return;}
      stopCountdown();
      display.textContent=target+":00:00";
      progress.style.width="100%";
      description.textContent="¡Son las "+target+":00! ARI inició el recordatorio.";
      change(s=>{s.clock={mode:slot,day:clock().day};s.voiceClockChosen=true;});
      chime();
      flashNotice("ARI · Son las "+target+":00. Hora del chequeo de misión.");
      showScheduledReminder(slot,false).catch(()=>flashNotice("Aviso de misión de las "+target+":00"));
    };
    countdown=setInterval(step,70);
  }
  for(const button of document.querySelectorAll('[data-ari-sim]'))button.addEventListener("click",()=>simulate(button.dataset.ariSim));
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&countdown!==null){/* elapsed time anchored to performance.now */}});
  function route() {
    const page=location.hash.slice(1)||"hoy";
    stage.hidden=!(["hoy","simulacion","mision"].includes(page));
    el("ari-home").hidden=page!=="hoy";
    el("ari-simulation").hidden=page!=="simulacion";
    const mission=document.getElementById("ari-mission-builder");if(mission)mission.hidden=page!=="mision";
    for(const a of nav.querySelectorAll("a")){
      if(a.dataset.ariTab===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
    }
    if(page==="hoy") window.ariWake?.resume();
    else window.ariWake?.pause();
  }
  window.addEventListener("hashchange",route);
  window.ariUI={mood,message,heard,status,flashNotice,renderMetrics,showMetric,showEvidence,onSpeaking,closeConversation,setCheckActive,voiceError,route};
  // Suppress legacy dialogue windows while maintaining their internal data/voice behavior.
  el("chat-dialog").classList.add("ari-headless");
  el("check-dialog").classList.add("ari-headless");
  // Wake-phrase activation is opt-in. SpeechRecognition may rely on a cloud service
  // in Chrome and cannot start automatically before a user grants mic access.
  const WakeRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const wakeButton = el("ari-wake-toggle");
  const wakeStatus = el("ari-wake-status");
  let wakeEnabled=false;
  let wakeRecognition=null;
  let wakeRetry=null;
  let wakeRetries=0;
  let wakeSession=0;
  let wakeSpeechTimer=null;
  const soundButton=el("ari-sound-toggle");
  const soundNote=el("ari-sound-note");
  let soundStream=null,soundContext=null,soundInterval=null,soundSource=null;
  function stopSoundWatch(){
    if(soundInterval)clearInterval(soundInterval);soundInterval=null;
    try{soundSource?.disconnect();}catch{}
    soundSource=null;
    soundStream?.getTracks().forEach(track=>track.stop());soundStream=null;
    if(soundContext){soundContext.close().catch(()=>{});soundContext=null;}
    soundButton.textContent="Alternativa: iniciar al detectar voz";
  }
  async function startSoundWatch(){
    if(soundInterval){stopSoundWatch();wakeText("Escucha por sonido desactivada.");return;}
    wakeOff("Activación por frase suspendida para escuchar por sonido.");
    try{
      soundStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
      soundContext=new (window.AudioContext||window.webkitAudioContext)();
      await soundContext.resume();
      soundSource=soundContext.createMediaStreamSource(soundStream);
      const analyzer=soundContext.createAnalyser();analyzer.fftSize=1024;soundSource.connect(analyzer);
      const data=new Uint8Array(analyzer.fftSize);
      let samples=0,quiet=0.006,streak=0;
      soundButton.textContent="Desactivar activación por sonido";
      wakeText("Calibrando el ruido ambiente… Cuando termine, hablá para iniciar Gemini.");
      soundInterval=setInterval(()=>{
        if(document.hidden || started || el("chat-dialog").open || el("check-dialog").open || location.hash!=="#hoy")return;
        analyzer.getByteTimeDomainData(data);
        let sum=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;sum+=v*v;}
        const rms=Math.sqrt(sum/data.length);samples++;
        if(samples<15){quiet=quiet*0.78+rms*0.22;return;}
        const active=rms>Math.max(0.020,quiet*2.9);
        streak=active?streak+1:Math.max(0,streak-1);
        if(streak>=4){
          stopSoundWatch();
          wakeText("Detecté voz, pero no puedo confirmar las palabras. Iniciando Gemini. Cuando esté conectado, hablá con ARI.");
          flashNotice("Activación por sonido · Gemini Live");
          startConversation();
        }
      },120);
      soundNote.hidden=false;
    }catch(error){stopSoundWatch();wakeText("No se pudo activar el respaldo por sonido: "+(error.message||"sin acceso al micrófono"));}
  }
  soundButton.addEventListener("click",startSoundWatch);
  const normalizeWake = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
  // Some Spanish recognizers transcribe ARI as "Harry", "Ari" or separated letters.
  const wakePhrase = /\b(?:hola|ola|oye|hey|ey|buenas)\s+(?:a\s*ri|ari|arry|harry|arri|ariy)\b/;
  const wakeOnly = /^(?:ari|arry|harry)$/;
  let wakeLastHeard = "";
  function wakeAvailable(){
    return wakeEnabled && !!WakeRecognition && !document.hidden &&
      (el("reminder-dialog").open || !location.hash || location.hash==="#hoy") &&
      !started && !el("chat-dialog").open && !el("check-dialog").open &&
      !el("vision-dialog").open &&
      !el("profile-dialog").open;
  }
  function wakeText(text){ wakeStatus.textContent=text; }
  function wakeButtonUpdate(){
    wakeButton.textContent=wakeEnabled?'Desactivar «Hola, ARI»':'Activar «Hola, ARI»';
    wakeButton.setAttribute('aria-pressed',String(wakeEnabled));
    wakeButton.classList.toggle("is-enabled",wakeEnabled);
  }
  function wakePause() {
    clearTimeout(wakeRetry);wakeRetry=null;
    clearTimeout(wakeSpeechTimer);wakeSpeechTimer=null;
    ++wakeSession;
    const rec=wakeRecognition;wakeRecognition=null;
    if(rec){rec.onend=null;rec.onerror=null;rec.onresult=null;try{rec.abort();}catch{}}
    if(wakeEnabled && started) wakeText("ARI está conversando. La frase de activación se reanudará al terminar.");
  }
  function wakeOff(reason){
    wakeEnabled=false;wakePause();wakeButtonUpdate();
    wakeText(reason || 'Activación por voz desactivada. Podés iniciarla cuando quieras.');
    if(!started && !el("check-dialog").open) mood(null);
  }
  function wakeArm(){
    clearTimeout(wakeRetry);wakeRetry=null;
    if(!wakeAvailable() || wakeRecognition) return;
    const token=++wakeSession;
    const rec=new WakeRecognition();wakeRecognition=rec;
    rec.lang='es-MX';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=5;
    rec.onstart=()=>{
      if(token!==wakeSession)return;
      wakeRetries=0;
      wakeText(el("reminder-dialog").open
        ? 'Reconocimiento de Chrome listo · Decí «Comenzar chequeo» o «Ahora no».'
        : 'Reconocimiento de Chrome listo. Decí «Hola, ARI». Mostraré aquí lo que entienda.');
      if(!el("reminder-dialog").open)mood(null,'ESPERANDO «HOLA, ARI»');
    };
    rec.onaudiostart=()=>{if(token===wakeSession)wakeText('Chrome está recibiendo sonido. Decí «Hola, ARI».');};
    rec.onspeechstart=()=>{
      if(token!==wakeSession)return;
      wakeText('Detecté voz. Esperando la transcripción de Chrome…');
      clearTimeout(wakeSpeechTimer);
      wakeSpeechTimer=setTimeout(()=>{
        if(token!==wakeSession || wakeLastHeard)return;
        wakeText('Chrome capta sonido, pero no entrega ninguna palabra. Gemini funciona al tocar el núcleo; el fallo está en el servicio de transcripción de Chrome. Podés probar la alternativa por sonido, que no verifica «Hola, ARI».');
        soundButton.hidden=false;soundNote.hidden=false;
      },5600);
    };
    rec.onresult=(event)=>{
      if(token!==wakeSession)return;
      for(let i=event.resultIndex;i<event.results.length;i++){
        const alternatives=Array.from(event.results[i]||[]);
        const original=String(alternatives[0]?.transcript||'').trim().slice(0,100);
        const spoken=alternatives.map(a=>normalizeWake(a.transcript||''));
        // Status now exposes exactly what Chrome recognized, instead of assuming it heard the trigger.
        if(original && original!==wakeLastHeard){
          clearTimeout(wakeSpeechTimer);wakeSpeechTimer=null;
          wakeLastHeard=original;
          wakeText('Chrome entendió: «'+original+'». '+(event.results[i]?.isFinal ? 'Frase registrada.' : 'Interpretando…'));
        }
        if(el("reminder-dialog").open){
          if(spoken.some(t=>/\b(?:comenzar|empezar|iniciar|hagamos|adelante)\b.*\b(?:chequeo|revision|ahora)\b|^si(?: vamos| comencemos| empecemos)?$|^comencemos$|^empecemos$|^comenzar chequeo$/.test(t))){
            wakePause();wakeText('Chequeo aceptado por voz. Iniciando Gemini…');
            el('reminder-start').click();return;
          }
          if(spoken.some(t=>/\b(?:ahora no|mas tarde|posponer|todavia no|despues)\b/.test(t))){
            wakePause();el('reminder-dialog').close();flashNotice('Chequeo pendiente. ARI puede retomarlo después.');return;
          }
          // A reminder must never turn into an unrelated chat session by mistake.
          continue;
        }
        if(spoken.some(t=>wakePhrase.test(t) || (event.results[i]?.isFinal && wakeOnly.test(t)))){
          wakePause();
          wakeText('«Hola, ARI» detectado. Iniciando Gemini Live…');
          flashNotice('Hola, ARI · Activación por voz');
          setTimeout(()=>{ if(wakeEnabled)startConversation(); },140);
          return;
        }
      }
    };
    rec.onerror=(event)=>{
      if(token!==wakeSession)return;
      const type=event.error||'';
      if(['not-allowed','service-not-allowed','audio-capture','language-not-supported','network'].includes(type)){
        const why=type==='network'?'El reconocimiento de Chrome necesita conexión.':'Chrome no pudo activar el micrófono o reconocer la frase.';
        wakeOff(why+' Revisá el permiso en el ícono de micrófono de Chrome. Podés seguir tocando el núcleo.');
        soundButton.hidden=false;soundNote.hidden=false;
      } else if(type==='no-speech'){wakeText('Chrome no detectó palabras. Reintentando. Hablá cerca del micrófono.');}
      else if(type==='aborted'){wakeText('Escucha pausada.');}
    };
    rec.onend=()=>{
      if(token!==wakeSession)return;
      wakeRecognition=null;
      if(!wakeAvailable())return;
      wakeRetries+=1;
      if(wakeRetries>1 && !wakeLastHeard) wakeText('Sin transcripción todavía. Chrome reinicia el reconocimiento; podés probar otra vez «Hola, ARI».');
      // Rate-limit restarts in browsers that stop recognition after short silence.
      const delay=Math.min(4000,Math.max(750,wakeRetries*450));
      wakeRetry=setTimeout(wakeArm,delay);
    };
    try{rec.start();}catch(error){
      wakeRecognition=null;
      wakeOff('No se pudo iniciar la activación por voz: '+(error.message||'error de micrófono'));
    }
  }
  window.ariWake={pause:wakePause,resume:()=>{if(wakeEnabled)wakeArm();},disable:wakeOff};
  wakeButton.addEventListener('click',()=>{
    if(wakeEnabled){wakeOff();return;}
    stopSoundWatch();
    if(!WakeRecognition){
      wakeText('Este navegador no admite activación por frase. Probá Chrome en Windows o usá el núcleo.');return;
    }
    wakeEnabled=true;wakeRetries=0;wakeLastHeard='';wakeButtonUpdate();
    // Unlock browser audio while a direct user gesture is available, so the voice can play after a wake phrase.
    window.ariRealtime?.play?.()?.catch(()=>{});
    wakeText('Activando reconocimiento de Chrome. El audio puede usar servicios en línea; ARI no escucha con la pestaña cerrada.');
    wakeArm();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stopSoundWatch();wakePause();if(wakeEnabled)wakeText('En pausa mientras la pestaña no esté visible.');}
    else if(wakeEnabled)wakeArm();
  });
  renderMetrics();route();
  const originalRender=window.render;
  if(typeof originalRender==="function") {
    window.render=()=>{originalRender();renderMetrics();const dot=el("ari-signal-dot"),lab=el("ari-link-label");dot.classList.toggle("offline",!state.link);lab.textContent=state.link?"Tierra conectada":"Enlace interrumpido";};
  }
  const dot=el("ari-signal-dot");dot.classList.toggle("offline",!state.link);
  el("ari-link-label").textContent=state.link?"Tierra conectada":"Enlace interrumpido";

  function paintStars() {
    const canvas=el("ari-stars");
    const w=window.innerWidth,h=window.innerHeight,dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
    const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
    let seed=1234567;
    const rand=()=>{ seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const total=Math.min(340,Math.round((w*h)/3200));
    for(let i=0;i<total;i++){
      const x=rand()*w,y=rand()*h,r=.25+rand()*.85,alpha=.12+rand()*.68;
      ctx.fillStyle=`rgba(${200+Math.floor(rand()*50)},${212+Math.floor(rand()*35)},255,${alpha})`;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      if(i%51===0){const g=ctx.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,"rgba(169,204,255,.3)");g.addColorStop(1,"rgba(169,204,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);ctx.fill();}
    }
  }
  paintStars();
  window.addEventListener("resize",()=>{clearTimeout(window.ariStarsTimer);window.ariStarsTimer=setTimeout(paintStars,130);});
})();
