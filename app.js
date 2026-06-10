// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════
const PREMIUM_EMAILS=['bhumikamahanth@gmail.com'];
const MOODS=[
  {e:"😤",l:"Overwhelmed",v:1,c:"#FF2D78"},
  {e:"😞",l:"Low",v:2,c:"#FF6B00"},
  {e:"😐",l:"Meh",v:3,c:"#FFD600"},
  {e:"🙂",l:"Okay",v:4,c:"#00FFB2"},
  {e:"😄",l:"Good",v:5,c:"#00E5FF"},
  {e:"⚡",l:"Energised",v:6,c:"#BF5FFF"},
];
const EX=[
  {id:1,t:"Box Breathing",cat:"Anxiety",dur:"4 min",icon:"🫁",c:"#00E5FF",desc:"Navy SEAL technique. Calms panic in 4 minutes.",steps:[{p:"Inhale",s:4,i:"Breathe in slowly"},{p:"Hold",s:4,i:"Hold gently"},{p:"Exhale",s:4,i:"Release slowly"},{p:"Hold",s:4,i:"Pause"}],cy:4,tags:["Anxiety","Focus"],pro:false,ai:"Box breathing: 4-4-4-4 pattern. Activates parasympathetic nervous system. Great for exam nerves and panic."},
  {id:2,t:"5-4-3-2-1 Grounding",cat:"Anxiety",dur:"3 min",icon:"✋",c:"#00FFB2",desc:"Use 5 senses to stop anxiety instantly.",steps:[{p:"See",s:15,i:"Name 5 things you see"},{p:"Touch",s:15,i:"Feel 4 things"},{p:"Hear",s:15,i:"Identify 3 sounds"},{p:"Smell",s:15,i:"Find 2 smells"},{p:"Taste",s:15,i:"Notice 1 taste"}],cy:1,tags:["Anxiety","Panic"],pro:false,ai:"5-4-3-2-1 uses senses to interrupt anxiety loops. Perfect for panic attacks."},
  {id:3,t:"Exam Anxiety Reset",cat:"Focus",dur:"5 min",icon:"🧠",c:"#BF5FFF",desc:"Built for JEE, NEET, and board exam nerves.",steps:[{p:"Acknowledge",s:30,i:"'I feel anxious — that's okay.'"},{p:"Release",s:30,i:"Tense then release all muscles"},{p:"Breathe",s:60,i:"6 slow deep breaths"},{p:"Affirm",s:30,i:"Name one thing you know"}],cy:2,tags:["Focus","Anxiety"],pro:false,ai:"Combines cognitive reframing and breathwork for Indian exam stress."},
  {id:4,t:"Body Scan",cat:"Sleep",dur:"5 min",icon:"🌙",c:"#FFD600",desc:"Release tension. Perfect before sleep.",steps:[{p:"Head",s:20,i:"Relax jaw, forehead, eyes"},{p:"Shoulders",s:20,i:"Drop shoulders down"},{p:"Chest",s:20,i:"Breathe naturally"},{p:"Belly",s:20,i:"Soften your stomach"},{p:"Legs",s:20,i:"Unclench legs and feet"}],cy:2,tags:["Sleep","Stress"],pro:true,ai:"Body scan activates rest-and-digest. Reduces physical tension from studying."},
  {id:5,t:"Loneliness Lift",cat:"Sadness",dur:"3 min",icon:"🤝",c:"#FF2D78",desc:"For when isolation hits hardest.",steps:[{p:"Feel It",s:30,i:"Don't push the feeling away"},{p:"Connect",s:30,i:"Visualise someone who cares"},{p:"Reach Out",s:60,i:"Send one message to anyone"},{p:"Self-care",s:30,i:"Do one kind thing for yourself"}],cy:1,tags:["Sadness","Loneliness"],pro:true,ai:"Uses visualization and self-compassion to reduce isolation in Indian hostel students."},
  {id:6,t:"Vent and Reflect",cat:"Sadness",dur:"5 min",icon:"✍️",c:"#FF6B00",desc:"Write your way to clarity.",steps:[{p:"Prompt 1",s:60,i:"What is actually bothering me?"},{p:"Prompt 2",s:60,i:"What would I tell a friend?"},{p:"Prompt 3",s:60,i:"One thing I can control today?"},{p:"Reflect",s:30,i:"Read what you wrote"}],cy:1,tags:["Sadness","Stress"],pro:true,ai:"Expressive writing reduces stress hormones. Pennebaker research proven method."},
];
const QUIZ=[
  {q:"What stresses you most?",opts:["JEE / NEET / Board exams","Parental pressure","Peer comparison","Career anxiety"]},
  {q:"How is your sleep lately?",opts:["Pretty good","Restless and broken","Barely sleeping","What is sleep?"]},
  {q:"When do you get time for yourself?",opts:["Between classes","Late at night","Weekends only","I barely do"]},
  {q:"What do you need most?",opts:["Calm my anxiety","Clear my head","Boost my mood","Feel less alone"]},
];
const QUOTES=[
  "You are not behind. You are on your own path. 🌱",
  "Rest is not giving up. Rest is moving forward wisely. 💙",
  "One small step today is better than a perfect plan tomorrow. ⚡",
  "Your worth is not your rank. Your worth is you. 🧡",
  "It is okay to not be okay. That is the first step. 🌸",
  "Breathe in strength. Breathe out fear. 🫁",
  "You survived 100% of your hard days so far. 💪",
  "Progress, not perfection. Always. ✨",
  "Asking for help is strength, not weakness. 🙏",
  "Today counts. Even the hard days count. 🔥",
];

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let CU=null,PIN=null;
let spStage='first',spFirst='',spEntry='',lpEntry='';
let app={
  tab:'home',
  moodToday:null,
  filter:'All',
  ventEntries:[],
  moodLogs:[],
  isPremium:false
};

// ═══════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════
const lk=k=>CU?`sz_${CU.uid}_${k}`:`sz_guest_${k}`;
const lg=(k,d)=>{try{const v=localStorage.getItem(lk(k));return v!==null?JSON.parse(v):d;}catch{return d;}};
const ls=(k,v)=>localStorage.setItem(lk(k),JSON.stringify(v));
function loadData(){
  app.ventEntries=lg('v',[]);
  app.moodLogs=lg('m',[]);
  app.isPremium=PREMIUM_EMAILS.includes(CU?.email?.toLowerCase())||lg('premium',false);
  if(PREMIUM_EMAILS.includes(CU?.email?.toLowerCase()))ls('premium',true);
  PIN=localStorage.getItem(`sz_pin_${CU?.uid||'guest'}`);
  
  // Check if mood logged today
  const today = new Date().toDateString();
  const todayLog = app.moodLogs.find(m => m.date === today);
  if(todayLog) app.moodToday = todayLog.val;
}

// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════
function showAuth(s){['welcome','signup','login','forgot'].forEach(id=>document.getElementById('auth-'+id).style.display=s===id?'flex':'none');}
function delay(ms){return new Promise(r=>setTimeout(r,ms));}
async function doSignup(){
  const n=document.getElementById('su-name').value.trim(),e=document.getElementById('su-email').value.trim(),p=document.getElementById('su-pass').value,p2=document.getElementById('su-pass2').value,err=document.getElementById('su-err');
  err.textContent='';
  if(!n){err.textContent='Enter your name.';return;}
  if(!e||!e.includes('@')){err.textContent='Enter a valid email.';return;}
  if(p.length<6){err.textContent='Password must be at least 6 characters.';return;}
  if(p!==p2){err.textContent='Passwords do not match.';return;}
  document.getElementById('su-btn').innerHTML='<div style="display:flex;align-items:center;justify-content:center;gap:8px;"><div style="width:16px;height:16px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite;"></div>Creating...</div>';
  await delay(1000);
  const users=JSON.parse(localStorage.getItem('sz_users')||'[]');
  if(users.find(u=>u.email===e)){err.textContent='Email already registered.';document.getElementById('su-btn').textContent='Create account →';return;}
  const uid='u_'+Math.random().toString(36).slice(2,10);
  users.push({uid,email:e,name:n,pass:btoa(p)});
  localStorage.setItem('sz_users',JSON.stringify(users));
  CU={uid,email:e,name:n};localStorage.setItem('sz_cu',JSON.stringify(CU));
  loadData();showAuth('none');showSetPin();
  document.getElementById('su-btn').textContent='Create account →';
}
async function doLogin(){
  const e=document.getElementById('li-email').value.trim(),p=document.getElementById('li-pass').value,err=document.getElementById('li-err');
  err.textContent='';if(!e||!p){err.textContent='Fill in all fields.';return;}
  document.getElementById('li-btn').innerHTML='<div style="display:flex;align-items:center;justify-content:center;gap:8px;"><div style="width:16px;height:16px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite;"></div>Logging in...</div>';
  await delay(900);
  const users=JSON.parse(localStorage.getItem('sz_users')||'[]');
  const u=users.find(x=>x.email===e);
  if(!u||u.pass!==btoa(p)){err.textContent='Incorrect email or password.';document.getElementById('li-btn').textContent='Log in →';return;}
  CU={uid:u.uid,email:u.email,name:u.name};localStorage.setItem('sz_cu',JSON.stringify(CU));
  loadData();showAuth('none');
  if(PIN)showLock();
  else if(!localStorage.getItem(`sz_ob_${CU.uid}`))showOB();
  else launch();
  document.getElementById('li-btn').textContent='Log in →';
}
async function doForgot(){
  const e=document.getElementById('fp-email').value.trim(),err=document.getElementById('fp-err'),ok=document.getElementById('fp-ok');
  err.textContent='';ok.textContent='';if(!e){err.textContent='Enter your email.';return;}
  await delay(700);
  const users=JSON.parse(localStorage.getItem('sz_users')||'[]');
  if(!users.find(u=>u.email===e)){err.textContent='No account with this email.';return;}
  ok.textContent='✓ Reset link sent! Check your inbox.';
}
function guestMode(){CU={uid:'guest',email:'',name:'Guest',isGuest:true};loadData();showAuth('none');if(!localStorage.getItem('sz_ob_guest'))showOB();else launch();}
function logout(){localStorage.removeItem('sz_cu');CU=null;PIN=null;document.getElementById('main').style.display='none';document.getElementById('lock').style.display='none';showAuth('welcome');}
function activatePremium(){app.isPremium=true;ls('premium',true);document.getElementById('sub-modal').style.display='none';renderAll();alert('🎉 Welcome to Premium! All features unlocked.');}

// ═══════════════════════════════════════════════
// PIN
// ═══════════════════════════════════════════════
function showSetPin(){spStage='first';spFirst='';spEntry='';document.getElementById('sperr').textContent='';updateSPDots();document.getElementById('setpin').style.display='flex';buildKP('spkp',spPress);}
function skipPin(){document.getElementById('setpin').style.display='none';if(!localStorage.getItem(`sz_ob_${CU.uid}`))showOB();else launch();}
function updateSPDots(){document.querySelectorAll('#spdots .pdot').forEach((d,i)=>d.classList.toggle('on',i<spEntry.length));}
function spPress(k){
  if(k==='⌫')spEntry=spEntry.slice(0,-1);else if(spEntry.length<4)spEntry+=k;
  updateSPDots();
  if(spEntry.length===4){setTimeout(()=>{
    if(spStage==='first'){spFirst=spEntry;spEntry='';spStage='confirm';document.getElementById('sperr').textContent='Confirm your PIN';updateSPDots();}
    else if(spEntry===spFirst){localStorage.setItem(`sz_pin_${CU.uid}`,spEntry);PIN=spEntry;document.getElementById('setpin').style.display='none';if(!localStorage.getItem(`sz_ob_${CU.uid}`))showOB();else launch();}
    else{spEntry='';spFirst='';spStage='first';document.getElementById('sperr').textContent='PINs did not match. Try again.';updateSPDots();}
  },280);}
}
function showLock(){lpEntry='';document.getElementById('lock-email').textContent=CU.email||'';document.getElementById('lock').style.display='flex';buildKP('lkp',lpPress);}
function updateLDots(){document.querySelectorAll('#ldots .pdot').forEach((d,i)=>d.classList.toggle('on',i<lpEntry.length));}
function lpPress(k){
  if(k==='⌫')lpEntry=lpEntry.slice(0,-1);else if(lpEntry.length<4)lpEntry+=k;
  updateLDots();
  if(lpEntry.length===4){setTimeout(()=>{
    if(lpEntry===PIN){document.getElementById('lock').style.display='none';if(!localStorage.getItem(`sz_ob_${CU.uid}`))showOB();else launch();}
    else{lpEntry='';updateLDots();document.getElementById('lerr').textContent='Incorrect PIN.';const ld=document.getElementById('ldots');ld.classList.add('shake');setTimeout(()=>ld.classList.remove('shake'),400);}
  },280);}
}
function buildKP(id,fn){
  const kp=document.getElementById(id);kp.innerHTML='';
  [1,2,3,4,5,6,7,8,9,'',0,'⌫'].forEach(k=>{const b=document.createElement('button');b.className='pkey';b.style.cssText=k===''?'visibility:hidden;margin:0 auto;':'margin:0 auto;';b.textContent=k;if(k!=='')b.onclick=()=>fn(k);kp.appendChild(b);});
}

// ═══════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════
let obStep=0;
function showOB(){document.getElementById('ob').style.display='flex';obStep=0;renderOB();}
function renderOB(){
  document.getElementById('obprog').style.width=((obStep+1)/(QUIZ.length+2)*100)+'%';
  const c=document.getElementById('obcontent');
  if(obStep===0){c.innerHTML=`<div class="fu" style="text-align:center;"><div style="font-size:70px;margin-bottom:16px;">🧘</div><div style="font-size:34px;font-weight:900;margin-bottom:8px;" class="gr">Hi, ${CU.name?.split(' ')[0]||'there'}!</div><div style="font-size:15px;color:#aaa;line-height:1.7;margin-bottom:32px;">Let us personalise MindGap for you. Just 4 quick questions.</div><button class="btn btn-primary" style="background:var(--pink);" onclick="obNext()">Let's go →</button></div>`;}
  else if(obStep>=1&&obStep<=QUIZ.length){const q=QUIZ[obStep-1];c.innerHTML=`<div class="fu"><div style="font-size:10px;color:var(--pink);font-weight:700;letter-spacing:2px;margin-bottom:10px;">QUESTION ${obStep} OF ${QUIZ.length}</div><div style="font-size:20px;font-weight:800;margin-bottom:22px;line-height:1.3;">${q.q}</div><div style="display:flex;flex-direction:column;gap:10px;">${q.opts.map(o=>`<button class="qopt" onclick="obPick()">${o}</button>`).join('')}</div></div>`;}
  else{c.innerHTML=`<div class="fu" style="text-align:center;"><div style="font-size:64px;margin-bottom:16px;">✅</div><div style="font-size:24px;font-weight:800;margin-bottom:10px;">You are all set!</div><div style="font-size:14px;color:#aaa;margin-bottom:32px;line-height:1.7;">Remember: asking for help is strength, not weakness.</div><button class="btn btn-primary" style="background:linear-gradient(135deg,var(--pink),var(--purple));" onclick="obFinish()">Enter MindGap →</button></div>`;}
}
function obNext(){obStep++;renderOB();}
function obPick(){setTimeout(obNext,200);}
function obFinish(){localStorage.setItem(`sz_ob_${CU.uid}`,'1');document.getElementById('ob').style.display='none';launch();}

// ═══════════════════════════════════════════════
// BOOT & ROUTER
// ═══════════════════════════════════════════════
function boot(){
  setTimeout(()=>{
    document.getElementById('splash').style.display='none';
    const saved=localStorage.getItem('sz_cu');
    if(saved){CU=JSON.parse(saved);loadData();if(PIN)showLock();else if(!localStorage.getItem(`sz_ob_${CU.uid}`))showOB();else launch();}
    else showAuth('welcome');
  },1600);
}
function launch(){document.getElementById('main').style.display='flex';go('home');}
function go(tab){
  app.tab = tab;
  ['home','exercises','journal','tools','account'].forEach(t=>{
    document.getElementById(`sc-${t}`).style.display = (t===tab) ? 'block' : 'none';
  });
  document.querySelectorAll('.nb').forEach(b=>{
    b.classList.toggle('on', b.dataset.t === tab);
  });
  renderAll();
}
function renderAll(){
  if(app.tab==='home') renderHome();
  if(app.tab==='exercises') renderExercises();
  if(app.tab==='journal') renderJournal();
  if(app.tab==='tools') renderTools();
  if(app.tab==='account') renderAccount();
  
  // Render sub features
  const f = document.getElementById('sub-features');
  if(f) {
      f.innerHTML = [['✓','All 6 guided exercises'],['✓','Unlimited journal entries'],['✓','Vent Space'],['✓','Full progress analytics'],['✓','Priority Zen AI'],['✓','Sleep tracker'],['✓','Study timer'],['✓','Habit tracker'],['✓','Meditation music'],['✓','Leaderboard & friend chat'],['✓','Weekly wellness report'],['✓','Exam countdown']].map(([s,fx])=>`<div class="prow"><span style="color:var(--yellow);font-weight:800;">${s}</span>${fx}</div>`).join('');
  }
}

// ═══════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════
function renderHome(){
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const ex = EX[Math.floor(Math.random() * EX.length)];
  
  let moodHtml = '';
  if(app.moodToday) {
    const m = MOODS.find(x=>x.v===app.moodToday);
    moodHtml = `<div class="card"><div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:4px;">Mood logged today!</div><div style="display:flex;align-items:center;gap:10px;"><div style="font-size:24px;">${m.e}</div><div style="font-size:16px;font-weight:800;color:${m.c};">${m.l}</div></div></div>`;
  } else {
    moodHtml = `
      <div class="card">
        <div style="font-size:14px;font-weight:800;margin-bottom:12px;">How are you feeling today?</div>
        <div style="display:flex;gap:6px;">
          ${MOODS.map(m=>`<div class="mdot" onclick="logMood(${m.v})"><div class="me">${m.e}</div><div class="ml">${m.l}</div></div>`).join('')}
        </div>
      </div>
    `;
  }

  document.getElementById('sc-home').innerHTML = `
    <div class="fu">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-top:10px;">
        <div>
          <div style="font-size:12px;color:var(--muted);font-weight:700;">GOOD ${(new Date().getHours() < 12) ? 'MORNING' : 'EVENING'}</div>
          <div style="font-size:24px;font-weight:800;">${CU.name?.split(' ')[0]||'Guest'} 👋</div>
        </div>
        <button class="btn" style="background:linear-gradient(135deg,var(--pink),var(--purple));padding:8px 14px;border-radius:20px;color:#000;font-size:12px;font-weight:700;" onclick="openAI()">🤖 Zen AI</button>
      </div>

      ${moodHtml}

      <div style="margin:20px 0;">
        <div style="font-size:13px;font-style:italic;color:var(--muted);text-align:center;">"${quote}"</div>
      </div>

      <div style="font-size:14px;font-weight:800;margin-bottom:10px;color:var(--pink);">Recommended for you</div>
      <div class="card card-tap" style="border-color:${ex.c};background:linear-gradient(135deg,rgba(0,0,0,0),rgba(255,255,255,0.02));" onclick="startEx(${ex.id})">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;">${ex.icon}</div>
          <div style="flex:1;">
            <div style="font-size:15px;font-weight:800;margin-bottom:2px;">${ex.t}</div>
            <div style="font-size:12px;color:var(--muted);">${ex.dur} • ${ex.cat}</div>
          </div>
          <div style="color:${ex.c};">▶</div>
        </div>
      </div>
      
      <div class="card card-tap" style="margin-top:20px;background:#1a1a1a;border-color:var(--purple);" onclick="openVent()">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="font-size:28px;">✍️</div>
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--purple);">Vent Space</div>
            <div style="font-size:11px;color:var(--muted);">Write out your thoughts privately</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function logMood(v){
  app.moodToday = v;
  const today = new Date().toDateString();
  const idx = app.moodLogs.findIndex(m => m.date === today);
  if(idx >= 0) app.moodLogs[idx].val = v;
  else app.moodLogs.push({date: today, val: v});
  ls('m', app.moodLogs);
  renderHome();
}

function renderExercises(){
  document.getElementById('sc-exercises').innerHTML = `
    <div class="fu">
      <div style="font-size:24px;font-weight:800;margin-bottom:16px;">Exercises</div>
      <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;margin-bottom:12px;">
        ${['All', 'Anxiety', 'Focus', 'Sleep', 'Sadness'].map(t=>`<div class="chip ${app.filter===t?'on':''}" onclick="app.filter='${t}';renderExercises()">${t}</div>`).join('')}
      </div>
      
      <div>
        ${EX.filter(e => app.filter==='All' || e.cat===app.filter).map(e=>`
          <div class="ex-item" onclick="startEx(${e.id})">
            <div class="ex-icon" style="background: ${e.c}20; color: ${e.c}; border: 1px solid ${e.c}40;">${e.icon}</div>
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:800;margin-bottom:2px;display:flex;align-items:center;gap:6px;">
                ${e.t}
                ${e.pro ? `<span style="font-size:9px;background:linear-gradient(135deg,#FFD600,#FF9F00);color:#000;padding:2px 6px;border-radius:10px;font-weight:900;">PRO</span>` : ''}
              </div>
              <div style="font-size:11px;color:var(--muted);">${e.dur} • ${e.cat}</div>
            </div>
            <div style="color:var(--faint);">▶</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderJournal(){
  // Calculate 7-day mood chart
  const today = new Date();
  const days = [];
  for(let i=6; i>=0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ dateStr: d.toDateString(), dayName: d.toLocaleDateString('en-US', {weekday:'short'}) });
  }
  
  let chartHtml = '<div style="display:flex;justify-content:space-between;align-items:flex-end;height:100px;margin-bottom:10px;padding-top:10px;">';
  days.forEach(d => {
    const log = app.moodLogs.find(m => m.date === d.dateStr);
    const val = log ? log.val : 0;
    const height = val > 0 ? (val / 6) * 100 : 5;
    const color = val > 0 ? MOODS.find(m=>m.v===val).c : '#222';
    chartHtml += `
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;width:12%;">
        <div style="width:100%;height:80px;background:#111;border-radius:6px;position:relative;overflow:hidden;border:1px solid #1a1a1a;">
          <div style="position:absolute;bottom:0;left:0;right:0;height:${height}%;background:${color};border-radius:6px;transition:height 0.5s;"></div>
        </div>
        <div style="font-size:10px;color:var(--muted);font-weight:700;">${d.dayName[0]}</div>
      </div>
    `;
  });
  chartHtml += '</div>';

  const entriesHtml = app.ventEntries.length === 0 
    ? `<div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:13px;">Your journal is empty.<br><br><button class="btn btn-primary" style="background:var(--purple);font-size:13px;padding:10px;" onclick="openVent()">Write your first entry</button></div>`
    : app.ventEntries.map((v, i) => `
        <div class="card" style="border-left:3px solid var(--purple);cursor:pointer;" onclick="openJEntry(${i})">
          <div style="font-size:10px;color:var(--muted);margin-bottom:6px;font-weight:700;">${new Date(v.d).toLocaleString()}</div>
          <div style="font-size:13px;line-height:1.5;">${v.t.substring(0, 80)}${v.t.length>80?'...':''}</div>
        </div>
      `).reverse().join('');

  document.getElementById('sc-journal').innerHTML = `
    <div class="fu">
      <div style="font-size:24px;font-weight:800;margin-bottom:12px;">My Progress</div>
      <div class="card">
        <div style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:10px;">WEEKLY MOOD</div>
        ${chartHtml}
      </div>
      <div style="font-size:20px;font-weight:800;margin:24px 0 16px;">My Journal</div>
      ${entriesHtml}
    </div>
  `;
}

function renderTools(){
  document.getElementById('sc-tools').innerHTML = `
    <div class="fu">
      <div style="font-size:24px;font-weight:800;margin-bottom:20px;">Tools</div>
      <div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:13px;background:var(--hi);border-radius:16px;">
        <div style="font-size:32px;margin-bottom:12px;">🚧</div>
        Habit Tracker, Sleep Analytics, and Study Timer are coming soon in Phase 2!
      </div>
    </div>
  `;
}

function renderAccount(){
  document.getElementById('sc-account').innerHTML = `
    <div class="fu">
      <div style="font-size:24px;font-weight:800;margin-bottom:20px;">Account</div>
      <div class="card" style="text-align:center;padding:30px 16px;">
        <div class="av" style="width:64px;height:64px;font-size:24px;margin:0 auto 12px;">${CU.name?CU.name[0].toUpperCase():'G'}</div>
        <div style="font-size:18px;font-weight:800;">${CU.name||'Guest'}</div>
        <div style="font-size:12px;color:var(--muted);">${CU.email||'Not logged in'}</div>
        ${app.isPremium ? '<div style="margin-top:10px;font-size:11px;color:#000;background:linear-gradient(135deg,#FFD600,#FF9F00);display:inline-block;padding:4px 12px;border-radius:20px;font-weight:800;">⭐ Premium Member</div>' : '<button class="btn" style="margin-top:12px;font-size:11px;color:var(--yellow);border:1px solid var(--yellow);background:transparent;padding:4px 12px;border-radius:20px;" onclick="document.getElementById(\'sub-modal\').style.display=\'flex\'">Upgrade to Premium</button>'}
      </div>
      
      <button class="btn" style="width:100%;padding:14px;background:var(--hi);border-radius:12px;text-align:left;color:#fff;margin-bottom:10px;font-weight:600;display:flex;justify-content:space-between;" onclick="showSetPin()">
        <span>🔒 Reset PIN</span> <span>→</span>
      </button>

      <button class="btn" style="width:100%;padding:14px;background:var(--hi);border-radius:12px;text-align:left;color:#fff;margin-bottom:10px;font-weight:600;display:flex;justify-content:space-between;" onclick="enableNotifications()">
        <span>🔔 Enable Daily Reminders</span> <span>→</span>
      </button>

      <button class="btn" style="width:100%;padding:14px;background:var(--hi);border-radius:12px;text-align:left;color:var(--pink);margin-bottom:10px;font-weight:600;" onclick="logout()">
        Log out
      </button>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// VENT SPACE
// ═══════════════════════════════════════════════
function openVent(){
  document.getElementById('vent').style.display = 'flex';
  document.getElementById('venttxt').value = '';
  document.getElementById('vwc').textContent = '0 words';
  
  document.getElementById('vmtags').innerHTML = ['😤 Overwhelmed','😞 Low','😰 Anxious','😢 Sad','🤯 Burnt out','😶 Numb'].map(m=>`<div style="padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(191,95,255,.1);color:var(--purple);cursor:pointer;border:1px solid transparent;" onclick="this.style.borderColor=this.style.borderColor?'':'var(--purple)'">${m}</div>`).join('');
  
  document.getElementById('vprompts').innerHTML = `
    <div style="font-size:11px;color:var(--purple);font-weight:700;margin-bottom:6px;">💡 AI Writing Prompts</div>
    ${["What happened today that's still on your mind?","What are you pretending is fine?","What do you wish someone would say to you?"].map(p=>`<div style="font-size:12px;color:var(--muted);padding:6px 0;border-bottom:1px solid #111;cursor:pointer;" onclick="document.getElementById('venttxt').value+=(document.getElementById('venttxt').value?'\\n\\n':'')+this.textContent.slice(2)">→ ${p}</div>`).join('')}
  `;
}

function closeVent(){
  document.getElementById('vent').style.display = 'none';
}

function saveVent(){
  const t = document.getElementById('venttxt').value.trim();
  if(!t) return closeVent();
  app.ventEntries.push({d: Date.now(), t});
  ls('v', app.ventEntries);
  closeVent();
  if(app.tab === 'journal') renderJournal();
}

function openJEntry(i) {
  const v = app.ventEntries[i];
  document.getElementById('jmod-c').innerHTML = `
    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;font-weight:700;">${new Date(v.d).toLocaleString()}</div>
    <div style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin-bottom:20px;color:#fff;">${v.t}</div>
    <button class="btn btn-primary" style="background:var(--hi);color:#fff;width:100%;" onclick="document.getElementById('jmod').style.display='none'">Close</button>
  `;
  document.getElementById('jmod').style.display = 'flex';
}

// ═══════════════════════════════════════════════
// EXERCISE PLAYER
// ═══════════════════════════════════════════════
function startEx(id) {
  const e = EX.find(x=>x.id===id);
  if(e.pro && !app.isPremium) {
    document.getElementById('sub-modal').style.display = 'flex';
    return;
  }
  app.pEx = e;
  const p = document.getElementById('player');
  p.style.display = 'flex';
  p.innerHTML = `
    <div id="ph">
      <button class="btn" style="background:none;color:var(--muted);font-size:24px;padding:0;" onclick="closeEx()">×</button>
      <div style="flex:1;text-align:center;font-size:14px;font-weight:800;">${e.t}</div>
      <div style="width:24px;"></div>
    </div>
    <div id="pb">
      <div style="font-size:72px;margin-bottom:20px;animation:bounce 2s infinite;">${e.icon}</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:10px;text-align:center;">Ready to start?</div>
      <div style="font-size:14px;color:var(--muted);text-align:center;margin-bottom:40px;line-height:1.6;max-width:80%;">${e.desc}</div>
      <button class="btn btn-primary" style="background:${e.c};color:#000;" onclick="runExPhase(0)">Begin Exercise →</button>
    </div>
  `;
}

function closeEx() {
  document.getElementById('player').style.display = 'none';
  clearInterval(app.pInt);
}

function runExPhase(stepIdx) {
  const e = app.pEx;
  if(stepIdx >= e.steps.length) {
    // Finished
    document.getElementById('pb').innerHTML = `
      <div style="font-size:72px;margin-bottom:20px;">✅</div>
      <div style="font-size:24px;font-weight:800;margin-bottom:10px;text-align:center;">Great job!</div>
      <div style="font-size:14px;color:var(--muted);text-align:center;margin-bottom:40px;">You just took 5 minutes for your mind.</div>
      <button class="btn btn-primary" style="background:var(--green);color:#000;" onclick="closeEx()">Complete</button>
    `;
    return;
  }
  
  const step = e.steps[stepIdx];
  let left = step.s;
  
  const pb = document.getElementById('pb');
  pb.innerHTML = `
    <div style="font-size:24px;font-weight:800;margin-bottom:10px;color:${e.c};">${step.p}</div>
    <div style="font-size:16px;color:var(--muted);text-align:center;margin-bottom:40px;">${step.i}</div>
    <div style="font-size:64px;font-weight:900;font-variant-numeric: tabular-nums;" id="extimer">${left}</div>
  `;
  
  app.pInt = setInterval(() => {
    left--;
    document.getElementById('extimer').textContent = left;
    if(left <= 0) {
      clearInterval(app.pInt);
      runExPhase(stepIdx + 1);
    }
  }, 1000);
}

// ═══════════════════════════════════════════════
// ZEN AI MOCK
// ═══════════════════════════════════════════════
function openAI() {
  document.getElementById('aisc').style.display = 'flex';
  const msgs = document.getElementById('ai-msgs');
  if(msgs.innerHTML === '') {
    msgs.innerHTML = `<div class="aib ai">Hi ${CU.name?.split(' ')[0]||''}. I'm Zen AI. I know studying in India is incredibly stressful. Whether it's JEE panic, hostel loneliness, or just feeling burnt out—I'm here to listen. What's on your mind?</div>`;
  }
}

function closeAI() {
  document.getElementById('aisc').style.display = 'none';
}

function sendAI() {
  const inp = document.getElementById('ai-inp');
  const text = inp.value.trim();
  if(!text) return;
  
  inp.value = '';
  const msgs = document.getElementById('ai-msgs');
  msgs.innerHTML += `<div class="aib usr">${text}</div>`;
  msgs.scrollTop = msgs.scrollHeight;
  
  const typingId = 't_' + Date.now();
  msgs.innerHTML += `<div class="aib ai" id="${typingId}"><div class="dtdot"><span></span><span></span><span></span></div></div>`;
  msgs.scrollTop = msgs.scrollHeight;
  
  // Mock AI response logic
  setTimeout(() => {
    document.getElementById(typingId).remove();
    let reply = "I hear you. That sounds really tough. Taking a deep breath can help center you right now.";
    const lower = text.toLowerCase();
    
    if(lower.includes('exam') || lower.includes('jee') || lower.includes('neet') || lower.includes('test')) {
      reply = "Exam pressure is immense. Remember that your worth isn't defined by a rank or a score. If you're panicking right now, try the 'Exam Anxiety Reset' exercise on the Home tab. It takes 5 minutes.";
    } else if(lower.includes('sleep') || lower.includes('can\'t sleep') || lower.includes('insomnia')) {
      reply = "Racing thoughts at night are the worst. Try the 'Body Scan' exercise before bed—it helps tell your nervous system that it's safe to rest.";
    } else if(lower.includes('lonely') || lower.includes('alone') || lower.includes('hostel')) {
      reply = "Hostel life can be incredibly isolating, even when you're surrounded by people. You aren't the only one feeling this way. The 'Loneliness Lift' exercise might help ease that heavy feeling.";
    } else if(lower.includes('parents') || lower.includes('pressure') || lower.includes('expectations')) {
      reply = "Carrying the weight of parental expectations is exhausting. It's okay to feel overwhelmed by it. Try writing out your frustrations in the Vent Space—getting it out of your head helps.";
    }
    
    msgs.innerHTML += `<div class="aib ai">${reply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 1500);
}

// ═══════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════
function enableNotifications() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
  } else if (Notification.permission === "granted") {
    new Notification("MindGap", { body: "You're all set! We'll remind you to check in daily." });
    alert("Notifications are already enabled!");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("MindGap", { body: "You're all set! We'll remind you to check in daily." });
      }
    });
  }
}

// INITIALIZE
boot();
