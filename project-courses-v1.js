(() => {
  'use strict';

  const VERSION='1.0';
  const projects=()=>window.PI_PROJECTS||[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byTitle=title=>projects().find(p=>p.title===title);

  const FILES=[
    {name:'kiosk.desktop',project:'Dashboard / Mirror / Glance / Photos',description:'Chromium kiosk autostart entry',code:'[Desktop Entry]\nType=Application\nName=Pi Command Center Kiosk\nExec=chromium --kiosk --noerrdialogs --disable-infobars https://pi-command-center.vercel.app\nX-GNOME-Autostart-enabled=true'},
    {name:'mirror-config.js',project:'Smart Mirror',description:'Minimal MagicMirror-style module layout starter',code:"module.exports = {\n  address: 'localhost',\n  port: 8080,\n  language: 'en',\n  timeFormat: 12,\n  units: 'imperial',\n  modules: [\n    { module: 'clock', position: 'top_left' },\n    { module: 'calendar', position: 'top_right' },\n    { module: 'weather', position: 'bottom_left' }\n  ]\n};"},
    {name:'gpio-led.py',project:'Electronics Lab',description:'Safe GPIO17 LED blink starter',code:'from gpiozero import LED\nfrom time import sleep\n\nled = LED(17)\nwhile True:\n    led.on()\n    sleep(1)\n    led.off()\n    sleep(1)'},
    {name:'gpio-button.py',project:'Electronics Lab / Pomodoro',description:'Button input with gpiozero internal pull-up',code:"from gpiozero import Button\nfrom signal import pause\n\nbutton = Button(2, pull_up=True, bounce_time=0.08)\nbutton.when_pressed = lambda: print('Pressed')\npause()"},
    {name:'pi-status.sh',project:'Dashboard / Cyberdeck',description:'Quick Pi health check commands',code:"echo 'Temperature:'\nvcgencmd measure_temp\necho 'Memory:'\nfree -h\necho 'Storage:'\ndf -h /\necho 'IP:'\nhostname -I"}
  ];

  function styles(){
    if(document.getElementById('project-courses-v1-styles'))return;
    const s=document.createElement('style');s.id='project-courses-v1-styles';s.textContent=`
    .pcv-hero{width:100%;background:#07101b;border-radius:12px;overflow:hidden}.pcv-hero svg{width:100%;height:auto;display:block}.pcv-caption{padding:11px 14px;border-top:1px solid var(--line);color:var(--muted);font-size:11px;line-height:1.55;background:var(--panel)}
    .completion-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:18px 0 24px}.completion-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.completion-card strong{display:block;font-size:12px;margin-bottom:8px}.completion-value{font-size:28px;font-weight:800}.completion-sub{font-size:11px;color:var(--muted);margin-top:4px}.completion-list{display:grid;gap:10px}.completion-row{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px}.completion-row-head{display:flex;align-items:center;gap:10px}.completion-row-title{font-size:13px;font-weight:700;flex:1}.completion-row-meta{font-size:11px;color:var(--muted)}.completion-track{height:6px;background:var(--line);border-radius:99px;overflow:hidden;margin-top:10px}.completion-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--green));border-radius:99px}.project-files{display:grid;gap:14px}.project-file{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden}.project-file-head{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line)}.project-file-name{font:700 13px ui-monospace,monospace}.project-file-meta{font-size:10px;color:var(--muted);margin-top:3px}.project-file-copy{margin-left:auto;padding:7px 10px;border-radius:8px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font-size:11px}.project-file pre{margin:0;padding:16px;overflow:auto;background:#06090f;color:#8ee7bc;font:11px/1.6 ui-monospace,monospace;white-space:pre}.pcv-progress-link .nav-icon{color:var(--green)}
    @media(max-width:760px){.completion-grid{grid-template-columns:1fr}.completion-row-head{flex-wrap:wrap}.pcv-caption{font-size:10.5px}}`;
    document.head.appendChild(s);
  }

  const iconFor=(p)=>({dashboard:'▦','ai-terminal':'⌨',cyberdeck:'▱','home-panel':'⌂','electronics-lab':'⚡',pomodoro:'◷',glance:'◎','photo-frame':'▣','magic-frame':'✦'}[p.id]||'◈');

  function diagram(p,step,index){
    const title=step.title;
    const acts=(step.actions||[]).slice(0,4);
    const low=(title+' '+step.summary).toLowerCase();
    let mode='flow';
    if(low.includes('power')||low.includes('battery'))mode='power';
    else if(low.includes('gpio')||low.includes('led')||low.includes('button'))mode='gpio';
    else if(low.includes('screen')||low.includes('layout')||low.includes('interface')||low.includes('dashboard')||low.includes('slideshow'))mode='screen';
    else if(low.includes('cool')||low.includes('temperature')||low.includes('airflow'))mode='thermal';
    else if(low.includes('secure')||low.includes('credential')||low.includes('server')||low.includes('api'))mode='security';
    else if(low.includes('kiosk')||low.includes('autostart')||low.includes('boot'))mode='boot';
    const W=960,H=540;
    const header=`<text x="48" y="62" fill="#65d482" font-family="Inter,Arial" font-size="18" font-weight="800">${esc(p.title.toUpperCase())} · STEP ${index+1}</text><text x="48" y="108" fill="#fff" font-family="Inter,Arial" font-size="34" font-weight="800">${esc(title)}</text>`;
    const footer=`<text x="48" y="505" fill="#8fa0b5" font-family="Inter,Arial" font-size="16">Visual reference · follow the written actions beside this diagram</text>`;
    let body='';
    if(mode==='screen'){
      body=`<rect x="105" y="155" width="750" height="285" rx="24" fill="#152233" stroke="#3d5570" stroke-width="3"/><rect x="135" y="182" width="690" height="225" rx="14" fill="#08111d"/><rect x="160" y="205" width="210" height="78" rx="14" fill="#18283b"/><rect x="390" y="205" width="190" height="78" rx="14" fill="#18283b"/><rect x="600" y="205" width="200" height="78" rx="14" fill="#18283b"/><rect x="160" y="305" width="640" height="78" rx="14" fill="#10271f"/><text x="182" y="252" fill="#fff" font-size="20" font-family="Inter,Arial">Primary</text><text x="412" y="252" fill="#9ccaff" font-size="20" font-family="Inter,Arial">Status</text><text x="622" y="252" fill="#ffe6a0" font-size="20" font-family="Inter,Arial">Action</text><text x="182" y="353" fill="#65d482" font-size="20" font-family="Inter,Arial">Touch-first content area</text>`;
    }else if(mode==='gpio'){
      body=`<rect x="120" y="175" width="720" height="220" rx="24" fill="#e9edf2"/><g stroke="#b9c4cf" stroke-width="2">${Array.from({length:12},(_,i)=>`<line x1="150" y1="${200+i*15}" x2="810" y2="${200+i*15}"/>`).join('')}</g><rect x="185" y="230" width="130" height="72" rx="12" fill="#2d9c6b"/><text x="250" y="272" text-anchor="middle" fill="#fff" font-size="18" font-family="Inter,Arial" font-weight="800">GPIO</text><path d="M315 266h100" stroke="#55a6ff" stroke-width="7"/><rect x="415" y="246" width="130" height="40" rx="8" fill="#d7b54a"/><text x="480" y="272" text-anchor="middle" fill="#17202b" font-size="16" font-family="Inter,Arial" font-weight="800">220–330 Ω</text><path d="M545 266h80" stroke="#55a6ff" stroke-width="7"/><circle cx="665" cy="266" r="34" fill="#ff6b6b"/><path d="M699 266h70" stroke="#3b4653" stroke-width="7"/><text x="790" y="272" fill="#17202b" font-size="17" font-family="Inter,Arial" font-weight="800">GND</text>`;
    }else if(mode==='power'){
      body=`<rect x="90" y="205" width="210" height="135" rx="22" fill="#18283b" stroke="#46617d"/><text x="195" y="260" text-anchor="middle" fill="#fff" font-size="22" font-family="Inter,Arial" font-weight="800">USB-C PD</text><text x="195" y="294" text-anchor="middle" fill="#9fb0c6" font-size="17" font-family="Inter,Arial">Power source</text><path d="M310 272h150" stroke="#65d482" stroke-width="8"/><path d="M440 252l30 20-30 20" fill="#65d482"/><rect x="475" y="185" width="210" height="175" rx="22" fill="#245c42" stroke="#65d482"/><text x="580" y="250" text-anchor="middle" fill="#fff" font-size="23" font-family="Inter,Arial" font-weight="800">Raspberry Pi 5</text><text x="580" y="286" text-anchor="middle" fill="#bcefd2" font-size="17" font-family="Inter,Arial">Stable 5V supply</text><path d="M695 272h95" stroke="#55a6ff" stroke-width="8"/><circle cx="820" cy="272" r="38" fill="#10243b" stroke="#55a6ff" stroke-width="3"/><text x="820" y="280" text-anchor="middle" fill="#9ccaff" font-size="18" font-family="Inter,Arial" font-weight="800">LOAD</text>`;
    }else if(mode==='thermal'){
      body=`<rect x="325" y="190" width="310" height="180" rx="24" fill="#303a46" stroke="#8998aa" stroke-width="3"/><text x="480" y="270" text-anchor="middle" fill="#fff" font-size="24" font-family="Inter,Arial" font-weight="800">Pi 5 + metal case</text><path d="M110 280h180" stroke="#55a6ff" stroke-width="10"/><path d="M270 255l35 25-35 25" fill="#55a6ff"/><text x="120" y="245" fill="#9ccaff" font-size="18" font-family="Inter,Arial">COOL AIR IN</text><path d="M670 280h180" stroke="#ff8f6b" stroke-width="10"/><path d="M830 255l35 25-35 25" fill="#ff8f6b"/><text x="690" y="245" fill="#ffc0aa" font-size="18" font-family="Inter,Arial">WARM AIR OUT</text>`;
    }else if(mode==='security'){
      body=`<rect x="70" y="205" width="220" height="130" rx="22" fill="#18283b"/><text x="180" y="260" text-anchor="middle" fill="#fff" font-size="21" font-family="Inter,Arial" font-weight="800">Browser UI</text><text x="180" y="294" text-anchor="middle" fill="#9fb0c6" font-size="16" font-family="Inter,Arial">No secrets</text><path d="M300 270h115" stroke="#55a6ff" stroke-width="7"/><path d="M395 252l28 18-28 18" fill="#55a6ff"/><rect x="430" y="185" width="240" height="170" rx="22" fill="#10243b" stroke="#55a6ff"/><text x="550" y="252" text-anchor="middle" fill="#fff" font-size="21" font-family="Inter,Arial" font-weight="800">Server route</text><text x="550" y="288" text-anchor="middle" fill="#9ccaff" font-size="16" font-family="Inter,Arial">Environment secret</text><path d="M680 270h90" stroke="#65d482" stroke-width="7"/><path d="M750 252l28 18-28 18" fill="#65d482"/><rect x="785" y="215" width="110" height="110" rx="55" fill="#245c42"/><text x="840" y="278" text-anchor="middle" fill="#fff" font-size="18" font-family="Inter,Arial" font-weight="800">API</text>`;
    }else if(mode==='boot'){
      body=`<g font-family="Inter,Arial">${['Power on','Raspberry Pi OS','Autostart','Kiosk app'].map((x,i)=>`<rect x="${75+i*215}" y="215" width="170" height="115" rx="20" fill="${i===3?'#245c42':'#18283b'}" stroke="${i===3?'#65d482':'#3d5570'}"/><text x="${160+i*215}" y="280" text-anchor="middle" fill="#fff" font-size="19" font-weight="800">${x}</text>${i<3?`<path d="M${250+i*215} 272h35" stroke="#55a6ff" stroke-width="6"/><path d="M275 ${258}l20 14-20 14" fill="#55a6ff"/>`:''}`).join('')}</g>`;
    }else{
      body=`<g font-family="Inter,Arial">${acts.map((a,i)=>{const x=55+i*220;return `<rect x="${x}" y="190" width="190" height="190" rx="24" fill="${i===acts.length-1?'#10271f':'#18283b'}" stroke="${i===acts.length-1?'#65d482':'#3d5570'}" stroke-width="2"/><circle cx="${x+95}" cy="230" r="20" fill="#65d482"/><text x="${x+95}" y="237" text-anchor="middle" fill="#07101b" font-size="18" font-weight="800">${i+1}</text><text x="${x+18}" y="278" fill="#fff" font-size="16" font-weight="700">${esc(a.slice(0,22))}</text><text x="${x+18}" y="306" fill="#9fb0c6" font-size="13">${esc(a.slice(22,50))}</text><text x="${x+18}" y="330" fill="#9fb0c6" font-size="13">${esc(a.slice(50,78))}</text></rect>`}).join('')}</g>`;
    }
    return `<div class="pcv-hero"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} visual reference"><rect width="960" height="540" rx="22" fill="#07101b"/><circle cx="810" cy="95" r="120" fill="#8257ff" opacity=".08"/>${header}${body}${footer}</svg><div class="pcv-caption">${esc(step.summary)} This diagram is specific to this project step and stays sharp at any screen size.</div></div>`;
  }

  function detect(){
    const view=document.querySelector('#stepView.active');if(!view)return;
    const crumb=view.querySelector('.breadcrumb');
    const titleArea=view.querySelector('.step-title-area h1');
    if(!crumb||!titleArea)return;
    const crumbText=crumb.textContent||'';
    const p=projects().find(x=>crumbText.includes(x.title));
    if(!p||p.id==='smart-mirror')return;
    const chip=view.querySelector('.step-chip span');
    const index=Math.max(0,(Number(chip?.textContent)||1)-1);
    const step=p.steps[index];if(!step)return;
    const hero=view.querySelector('#stepHero,.step-hero');
    if(hero&&!hero.dataset.pcvApplied){hero.dataset.pcvApplied='1';hero.classList.remove('has-photo');hero.innerHTML=diagram(p,step,index);}
    const hw=view.querySelector('.step-hardware');
    if(hw){hw.style.display='none';}
    const ql=view.querySelector('.step-quicklinks');
    if(ql){ql.style.display='none';}
  }

  function nav(){
    const side=document.querySelector('.side-nav');if(!side||side.querySelector('[data-view="progress"]'))return;
    const projectsLink=side.querySelector('[data-view="projects"]');
    const b=document.createElement('button');b.className='side-link pcv-progress-link';b.dataset.view='progress';b.innerHTML='<span class="nav-icon">◔</span> Progress';
    projectsLink?.insertAdjacentElement('afterend',b);
    b.addEventListener('click',renderProgress);

    const actions=document.querySelector('.quick-actions-grid');
    if(actions&&!actions.querySelector('[data-action="projectFiles"]')){
      const f=document.createElement('button');f.className='qa-btn';f.dataset.action='projectFiles';f.innerHTML='<span class="qa-icon">⌘</span> Project Files';f.addEventListener('click',renderFiles);actions.appendChild(f);
    }
  }

  function activateSimple(navName){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    const simple=document.querySelector('#simpleView');if(simple)simple.classList.add('active');
    document.querySelector('#bottomNav')?.classList.remove('visible');
    document.querySelectorAll('.side-link').forEach(x=>x.classList.toggle('active',x.dataset.view===navName));
    document.querySelector('#sidebar')?.classList.remove('open');document.querySelector('#sidebarOverlay')?.classList.remove('show');
    window.scrollTo({top:0,behavior:'smooth'});return simple;
  }

  function renderProgress(){
    const host=activateSimple('progress');if(!host)return;
    const data=projects().map(p=>{const done=p.steps.reduce((n,_,i)=>n+(JSON.parse(localStorage.getItem('pi-build-progress-v4')||'{}')[p.id+'-'+i]?1:0),0);return{p,done,total:p.steps.length,pct:Math.round(done/p.steps.length*100)}});
    const total=data.reduce((n,x)=>n+x.total,0),done=data.reduce((n,x)=>n+x.done,0),pct=total?Math.round(done/total*100):0,started=data.filter(x=>x.done>0).length,complete=data.filter(x=>x.done===x.total).length;
    host.innerHTML=`<div class="breadcrumb"><button class="text-link" id="pcvHome">Home</button> / Progress</div><div class="panel-page" style="max-width:900px"><span class="eyebrow">Build progress</span><h1>Project Progress</h1><p>One view of every project, completed step, and next build.</p><div class="completion-grid"><div class="completion-card"><strong>Overall</strong><div class="completion-value">${pct}%</div><div class="completion-sub">${done} of ${total} project steps</div></div><div class="completion-card"><strong>Started</strong><div class="completion-value">${started}</div><div class="completion-sub">of ${data.length} projects</div></div><div class="completion-card"><strong>Completed</strong><div class="completion-value">${complete}</div><div class="completion-sub">finished builds</div></div></div><div class="completion-list">${data.map(x=>`<div class="completion-row"><div class="completion-row-head"><span style="font-size:20px">${esc(x.p.icon)}</span><div class="completion-row-title">${esc(x.p.title)}</div><div class="completion-row-meta">${x.done}/${x.total} steps · ${x.pct}%</div></div><div class="completion-track"><div class="completion-fill" style="width:${x.pct}%"></div></div></div>`).join('')}</div><div style="text-align:right;color:var(--muted);font-size:10px;margin-top:16px">Completion Layer V${VERSION}</div></div>`;
    host.querySelector('#pcvHome')?.addEventListener('click',()=>window.renderHome?.());
  }

  function renderFiles(){
    const host=activateSimple('');if(!host)return;
    host.innerHTML=`<div class="breadcrumb"><button class="text-link" id="pcvFilesHome">Home</button> / Project Files</div><div class="panel-page" style="max-width:920px"><span class="eyebrow">Reference files</span><h1>Project Files</h1><p>Copy-ready starter files for the builds in Pi Command Center. Secrets and credentials are intentionally excluded.</p><div class="project-files">${FILES.map((f,i)=>`<article class="project-file"><div class="project-file-head"><div><div class="project-file-name">${esc(f.name)}</div><div class="project-file-meta">${esc(f.project)} · ${esc(f.description)}</div></div><button class="project-file-copy" data-pcv-copy="${i}">Copy</button></div><pre><code>${esc(f.code)}</code></pre></article>`).join('')}</div><div style="text-align:right;color:var(--muted);font-size:10px;margin-top:16px">Project Files V${VERSION}</div></div>`;
    host.querySelector('#pcvFilesHome')?.addEventListener('click',()=>window.renderHome?.());
    host.querySelectorAll('[data-pcv-copy]').forEach(b=>b.addEventListener('click',async()=>{const f=FILES[Number(b.dataset.pcvCopy)];try{await navigator.clipboard.writeText(f.code);b.textContent='Copied ✓';setTimeout(()=>b.textContent='Copy',1200);}catch{b.textContent='Select text';}}));
  }

  styles();nav();detect();
  new MutationObserver(()=>{nav();detect();}).observe(document.body,{subtree:true,childList:true});
})();