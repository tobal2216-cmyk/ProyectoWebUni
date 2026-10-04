/* VitaMente — interacciones */
(function(){
const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const toastEl=$('#toast');let tt;
function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2600)}

/* font size */
let fs=store.get('vm-fs',0);
function applyFs(){document.documentElement.classList.remove('fs1','fs2');if(fs)document.documentElement.classList.add('fs'+fs)}
applyFs();
$('#fontBtn').addEventListener('click',()=>{fs=(fs+1)%3;applyFs();store.set('vm-fs',fs);toast(['Letra normal','Letra grande','Letra extra grande'][fs])});

/* bars */
const areas=[['Fuerza',38,78],['Equilibrio',42,80],['Flexibilidad',45,76],['Capacidad cognitiva',50,82],['Independencia',40,85]];
const bars=$('#bars');
bars.innerHTML=areas.map(a=>`<div class="bar"><span>${a[0]}</span><div class="track"><div class="fill" style="width:${a[1]}%"></div></div></div>`).join('');
function setBars(on){bars.classList.toggle('on',on);[...bars.querySelectorAll('.fill')].forEach((f,i)=>f.style.width=areas[i][on?2:1]+'%');$('#tgOn').setAttribute('aria-pressed',on);$('#tgOff').setAttribute('aria-pressed',!on)}
$('#tgOn').onclick=()=>setBars(true);$('#tgOff').onclick=()=>setBars(false);

/* kit */
const items={
 bands:{name:'Ligas de resistencia',tag:'Fuerza',pos:[9,9,35,30],desc:'Cinco ligas con distinta tensión. Se usan para brazos, espalda y piernas, sentado o de pie.',uses:['Remo sentado para la espalda','Abrir brazos al frente para hombros','Separar rodillas para cadera'],levels:true},
 ball:{name:'Pelota mediana',tag:'Coordinación',pos:[44,10,22,29],desc:'Ligera y suave, ideal para pases, apretar entre rodillas y ejercicios de coordinación mano‑ojo.',uses:['Pasarla alrededor de la cintura','Apretarla entre las rodillas','Lanzar y atrapar a dos manos']},
 small:{name:'Pelota de mano',tag:'Concentración',pos:[67,14,11,20],desc:'Pelota pequeña para fortalecer la mano y combinar movimiento con retos de memoria.',uses:['Apretar y soltar 10 veces por mano','Pasarla de mano en mano contando hacia atrás','Seguir una secuencia de colores o números']},
 cones:{name:'Conos',tag:'Equilibrio',pos:[79,7,13,32],desc:'Marcan recorridos cortos en casa para caminar en zigzag, rodear y cambiar de dirección con control.',uses:['Zigzag lento entre 4 conos','Tocar un cono y regresar','Caminar talón‑punta junto a la línea']},
 book:{name:'Cuadernillo de Estimulación Cognitiva',tag:'Concentración',pos:[9,42,29,34],desc:'Actividades de memoria, atención y lenguaje para hacer después del ejercicio físico.',uses:['Sopas de letras y series','Ejercicios de memoria visual','Retos de cálculo sencillo']},
 bags:{name:'Costales de ½ kg (2 piezas)',tag:'Fuerza',pos:[41,40,37,35],desc:'Pesos de tela rellenos de arena. Cómodos de sujetar y sin riesgo si se caen.',uses:['Curl de bíceps sentado','Elevaciones laterales cortas','Sujetar al hacer sentadilla a la silla']},
 long:{name:'Liga de estiramiento',tag:'Flexibilidad',pos:[78,40,15,36],desc:'Liga larga para ampliar el rango de movimiento de hombros, espalda y piernas sin forzar.',uses:['Estiramiento de hombros por arriba','Estirar la parte de atrás de la pierna sentado','Rotación suave de tronco']},
 cards:{name:'Tarjetas ilustradas de ejercicios',tag:'Guía',extra:true,desc:'Cada tarjeta muestra un ejercicio con dibujos paso a paso, repeticiones y el material que necesitas.',uses:['Una tarjeta por ejercicio','Indicaciones grandes y claras','Se pueden ordenar para armar tu rutina']},
 cal:{name:'Calendario de seguimiento',tag:'Constancia',extra:true,desc:'Para marcar cada día que entrenas y ver tu avance semana con semana.',uses:['Marca tus días activos','Anota la liga que usaste','Celebra tus semanas completas']},
 manual:{name:'Cuadernillo de instrucciones',tag:'Guía',extra:true,desc:'Explica cómo usar cada pieza, cómo progresar y recomendaciones de seguridad.',uses:['Postura correcta','Cuándo subir de nivel de liga','Consejos de seguridad']}
};
const levels=[['--b-green','Verde','Muy ligera, para empezar'],['--b-blue','Azul','Ligera'],['--b-yellow','Amarilla','Media'],['--b-red','Roja','Fuerte'],['--b-black','Negra','Muy fuerte']];
const icons={cards:'<path d="M6 8h14v18H6z M12 4h14v18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',cal:'<rect x="4" y="7" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4 13h24M10 4v6M22 4v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',manual:'<path d="M6 5h16l4 4v18H6z M11 13h10M11 18h10M11 23h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>'};
const box=$('#box');
Object.entries(items).forEach(([k,it])=>{
  if(it.extra){const b=document.createElement('button');b.type='button';b.className='extra';b.dataset.k=k;b.innerHTML=`<svg viewBox="0 0 32 32">${icons[k]}</svg>${it.name}`;b.onclick=()=>showItem(k);$('#extras').appendChild(b);return}
  const b=document.createElement('button');b.type='button';b.className='hs';b.dataset.k=k;b.setAttribute('aria-label',it.name);
  const [x,y,w,h]=it.pos;Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});b.onclick=()=>showItem(k);box.appendChild(b)});
let lvl=0;
function showItem(k){
  const it=items[k];
  document.querySelectorAll('.hs,.extra').forEach(e=>e.classList.toggle('active',e.dataset.k===k));
  let html=`<span class="tag">${it.tag}</span><h3>${it.name}</h3><p style="color:var(--muted)">${it.desc}</p><div><p style="font-weight:800;margin-bottom:6px">Ideas de uso</p><ul>${it.uses.map(u=>`<li>${u}</li>`).join('')}</ul></div>`;
  if(it.levels){html+=`<div><p style="font-weight:800;margin-bottom:8px">Progresión sugerida</p><div class="levels">${levels.map((l,i)=>`<button type="button" data-l="${i}" aria-pressed="${i===lvl}" aria-label="Liga ${l[1]}" style="background:var(${l[0]})"></button>`).join('')}</div><p class="lvl-txt" id="lvlTxt" style="margin-top:8px"></p></div>`}
  const info=$('#info');info.innerHTML=html;
  if(it.levels){const upd=()=>{$('#lvlTxt').textContent=`Liga ${levels[lvl][1]}: ${levels[lvl][2]}`;info.querySelectorAll('.levels button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.l===lvl))};upd();info.querySelectorAll('.levels button').forEach(b=>b.onclick=()=>{lvl=+b.dataset.l;upd()})}
}
showItem('bands');

/* pillars */
const pillars={
 Fuerza:{c:'--b-red',ex:[['Curl de bíceps con costales','Costales ½ kg','2 × 10','Sentado, codos pegados al cuerpo. Sube los costales hacia los hombros y baja despacio.'],['Remo con liga','Liga de resistencia','2 × 12','Liga alrededor de los pies, jala hacia la cintura juntando los omóplatos.'],['Sentadilla a la silla','Silla firme','2 × 8','Siéntate y levántate sin usar las manos, con los pies separados al ancho de la cadera.']]},
 Flexibilidad:{c:'--b-green',ex:[['Hombros por arriba','Liga de estiramiento','3 × 20 s','Toma la liga con ambas manos y súbela sobre la cabeza sin forzar.'],['Pierna estirada sentado','Liga de estiramiento','3 × 20 s por pierna','Pasa la liga por la planta del pie y estira la pierna al frente con suavidad.'],['Giro de cuello','Sin material','5 por lado','Gira la cabeza lentamente hacia un lado y al otro, respirando profundo.']]},
 Equilibrio:{c:'--b-blue',ex:[['Zigzag entre conos','Conos','3 vueltas','Coloca 4 conos en línea y camina rodeándolos despacio.'],['Apoyo en un pie','Silla de apoyo','3 × 10 s por pierna','Con una mano en el respaldo, levanta un pie unos centímetros.'],['Talón‑punta','Conos como guía','2 tramos','Camina en línea recta poniendo el talón justo delante de la punta del otro pie.']]},
 Concentración:{c:'--b-yellow',ex:[['Pase y cuenta','Pelota mediana','1 min','Pasa la pelota de mano en mano mientras cuentas hacia atrás de 3 en 3 desde 60.'],['Aprieta la secuencia','Pelota de mano','1 min','Aprieta la pelota siguiendo un patrón: 1, 2, 1, 3… y repítelo de memoria.'],['Página del cuadernillo','Cuadernillo cognitivo','5 min','Resuelve una actividad de memoria o atención después de moverte.']]}
};
const tabs=$('#tabs');
Object.keys(pillars).forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='tab';b.setAttribute('role','tab');b.setAttribute('aria-selected',i===0);b.innerHTML=`<span class="dot" style="background:var(${pillars[p].c})"></span>${p}`;b.onclick=()=>pick(p);tabs.appendChild(b)});
function pick(p){[...tabs.children].forEach(b=>b.setAttribute('aria-selected',b.textContent===p));$('#exGrid').innerHTML=pillars[p].ex.map(e=>`<article class="ex"><div class="meta"><span class="pill" style="box-shadow:inset 3px 0 0 var(${pillars[p].c})">${e[1]}</span><span class="pill">${e[2]}</span></div><h3>${e[0]}</h3><p>${e[3]}</p></article>`).join('')}
pick('Fuerza');

/* routine */
const pool=[];Object.entries(pillars).forEach(([p,v])=>v.ex.forEach(e=>pool.push({p,name:e[0],mat:e[1],how:e[3]})));
const order=['Fuerza','Equilibrio','Flexibilidad','Concentración'];
const cfg={5:[4,60],10:[7,75],15:[9,90]};
let plan=[],idx=0,left=0,timer=null,dur=10;
function build(min){
  dur=min;const [n,sec]=cfg[min];plan=[{p:'Calentamiento',name:'Marcha en el lugar',mat:'Sin material',how:'Marcha suave moviendo los brazos para preparar el cuerpo.',s:sec}];
  for(let i=0;i<n;i++){const p=order[i%4];const opts=pool.filter(x=>x.p===p);plan.push({...opts[Math.floor(i/4)%opts.length],s:sec})}
  idx=0;stop();left=plan[0].s;render();
}
function fmt(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function render(){
  const cur=plan[idx];$('#nowStep').textContent=`Ejercicio ${idx+1} de ${plan.length} · ${cur.p}`;$('#nowName').textContent=cur.name;$('#nowHow').textContent=cur.how;$('#tLeft').textContent=fmt(left);
  $('#ringFg').style.strokeDashoffset=326.7*(1-left/cur.s);
  $('#steps').innerHTML=plan.map((x,i)=>`<li class="${i<idx?'done':i===idx?'cur':''}"><span class="nm">${x.name}<small>${x.p} · ${x.mat}</small></span><span class="sec">${fmt(x.s)}</span></li>`).join('');
}
function stop(){clearInterval(timer);timer=null;$('#playBtn').textContent='▶ Empezar'}
function next(){if(idx<plan.length-1){idx++;left=plan[idx].s;render()}else{stop();left=0;render();toast('¡Rutina completa! Márcala en tu calendario.')}}
$('#playBtn').onclick=()=>{if(timer){stop();$('#playBtn').textContent='▶ Continuar';return}
  if(left<=0){idx=0;left=plan[0].s}
  $('#playBtn').textContent='❚❚ Pausa';timer=setInterval(()=>{left--;if(left<=0){next();if(!timer)return}render()},1000)};
$('#nextBtn').onclick=()=>{next()};$('#resetBtn').onclick=()=>build(dur);
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));build(+b.dataset.min)});
build(10);

/* simon */
const colors=['--b-green','--b-blue','--b-yellow','--b-red','--b-black'];const freqs=[262,330,392,494,587];
const pads=$('#pads');colors.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='pad';b.style.background=`var(${c})`;b.setAttribute('aria-label','Liga '+levels[i][1]);b.disabled=true;b.onclick=()=>press(i);pads.appendChild(b)});
let seq=[],inp=0,busy=false,ac=null,best=store.get('vm-best',0);$('#best').textContent=best;
function beep(i){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=freqs[i];o.type='sine';g.gain.setValueAtTime(.12,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.35);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.36)}catch(e){}}
function flash(i,ms){const p=pads.children[i];p.classList.add('lit');beep(i);return new Promise(r=>setTimeout(()=>{p.classList.remove('lit');setTimeout(r,220)},ms))}
const setPads=on=>[...pads.children].forEach(p=>p.disabled=!on);
async function playSeq(){busy=true;setPads(false);$('#gameMsg').textContent='Observa…';await new Promise(r=>setTimeout(r,600));for(const i of seq)await flash(i,Math.max(380,700-seq.length*25));busy=false;inp=0;setPads(true);$('#gameMsg').textContent='Tu turno: repite la secuencia.'}
function round(){seq.push(Math.floor(Math.random()*5));$('#lvl').textContent=seq.length;playSeq()}
function press(i){if(busy)return;flash(i,200);if(seq[inp]!==i){setPads(false);const r=seq.length-1;if(r>best){best=r;store.set('vm-best',best);$('#best').textContent=best}$('#gameMsg').textContent=`Casi. Llegaste a ${r} ${r===1?'ronda':'rondas'} completas. ¡Inténtalo otra vez!`;$('#gameBtn').textContent='Jugar de nuevo';return}
  inp++;if(inp===seq.length){setPads(false);$('#gameMsg').textContent='¡Muy bien!';setTimeout(round,700)}}
$('#gameBtn').onclick=()=>{seq=[];$('#gameBtn').textContent='Reiniciar';round()};

/* calendar */
const days=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];let done=store.get('vm-cal',[true,true,false,true,false,false,false]);
const cal=$('#cal');
function renderCal(){cal.innerHTML=days.map((d,i)=>`<button type="button" class="day" data-i="${i}" aria-pressed="${!!done[i]}">${d}<i>${done[i]?'✓':''}</i></button>`).join('');
  const n=done.filter(Boolean).length;$('#calProg').style.width=(n/7*100)+'%';
  $('#calMsg').textContent=n===7?'¡Semana completa! Tu vitamina diaria, cumplida.':`${n} de 7 días esta semana${n>=4?'. ¡Vas excelente!':'.'}`;
  cal.querySelectorAll('.day').forEach(b=>b.onclick=()=>{done[+b.dataset.i]=!done[+b.dataset.i];store.set('vm-cal',done);renderCal()})}
renderCal();

/* counters */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window && !reduce){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target,to=+el.dataset.count,suf=el.dataset.suf||'';const t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/1100);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.6});document.querySelectorAll('[data-count]').forEach(el=>io.observe(el))}

/* buy */
let q=1;const money=n=>'$'+n.toLocaleString('es-MX');
function upQ(){$('#qOut').textContent=q;$('#qTotal').textContent=money(q*369)}
$('#qMinus').onclick=()=>{if(q>1){q--;upQ()}};$('#qPlus').onclick=()=>{if(q<10){q++;upQ()}};
$('#reserveBtn').onclick=()=>{const c=$('#confirm');c.hidden=false;c.textContent=`Apartaste ${q} ${q===1?'kit':'kits'} por ${money(q*369)} MXN${$('#gift').checked?' con envoltura de regalo':''}. Este sitio es un prototipo del Equipo 13-E: no se realizó ningún cobro.`;toast('Kit apartado')};
})();
