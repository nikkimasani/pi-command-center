(()=>{
  'use strict';
  const app=document.querySelector('#app');
  if(!app||!window.PI_LAB)return;
  const D=window.PI_LAB;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const storageKey='pi-lab-workspace-v1';
  let W={mode:'guided',readiness:{},verifications:{},notes:{},photoUrls:{},builderName:'',search:'',inventory:{},stationChecks:{},instructorNote:''};
  try{W={...W,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{}
  const save=()=>localStorage.setItem(storageKey,JSON.stringify(W));
  const currentCourse=()=>{
    const heading=app.querySelector('.course-banner .eyebrow')?.textContent?.trim();
    return D.courses.find(c=>c.title===heading);
  };
  const currentLessonIndex=()=>{
    const text=app.querySelector('.lesson-meta span')?.textContent||'';
    const found=text.match(/LESSON\s+(\d+)/i);
    return found?Number(found[1])-1:0;
  };
  const lessonKey=(c,index)=>`${c.id}:${index}`;
  const humanCommand=command=>{
    const text=String(command);
    if(/apt (update|install|upgrade|full-upgrade)/.test(text))return 'Uses the Raspberry Pi package manager to refresh software information or install a named package.';
    if(/systemctl/.test(text))return 'Asks systemd, Raspberry Pi OS’s service manager, to inspect or control a background service.';
    if(/ssh |scp /.test(text))return 'Uses the network connection you set up to work with files or a terminal on the Pi from another computer.';
    if(/python3|pip/.test(text))return 'Runs Python or installs a Python dependency. Type it exactly, including spaces and punctuation.';
    if(/mkdir|cd |ls |pwd|cat /.test(text))return 'Works with folders or files in your current Terminal location. Check the path before pressing Enter.';
    if(/sudo/.test(text))return 'Runs one command with administrator permission. Use it only because this specific step calls for it.';
    return 'Runs this command in Terminal. Copy it exactly, then compare the result with the expected outcome below.';
  };
  const readinessItems=c=>[...(c.materials||[]).slice(0,5),'A stable workspace with enough room for the lesson','The correct power supply and a backup plan before changing storage'];
  const fallbackTrouble=[
    ['The result does not match the lesson','Pause before moving on. Re-read the command or wiring instruction character by character, confirm the previous lesson is complete, then use the linked official source for your hardware or software version.'],
    ['Terminal shows “command not found” or “permission denied”','Do not add sudo at random. First check spelling, whether you are in the right folder, and whether the required package or virtual environment was installed in an earlier step.'],
    ['The hardware does not respond','Power the Pi down before changing wires. Compare each connection against the lesson visual and written pin names, then restart the check from the beginning.']
  ];
  const addLessonWorkspace=()=>{
    const c=currentCourse();
    const main=app.querySelector('.learning-layout main');
    if(!c||!main||main.querySelector('.workspace-readiness'))return;
    const index=currentLessonIndex(),lesson=c.lessons[index],id=lessonKey(c,index);
    const ready=W.readiness[id]||[],verified=!!W.verifications[id];
    const commandCards=[...main.querySelectorAll('.command')];
    commandCards.forEach(card=>{
      if(card.querySelector('.command-explainer'))return;
      const pre=card.querySelector('pre');
      if(pre)pre.insertAdjacentHTML('afterend',`<p class="command-explainer"><b>What this does:</b> ${esc(humanCommand(pre.textContent))}</p>`);
    });
    const existingTrouble=main.querySelector('.troubleshoot');
    if(!existingTrouble){
      const markup=`<section class="troubleshoot workspace-troubleshoot"><p class="eyebrow">Troubleshooting path</p>${fallbackTrouble.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;
      const checkpoint=main.querySelector('.checkpoint');
      checkpoint?.insertAdjacentHTML('beforebegin',markup);
    }
    const visual=main.querySelector('.lesson-photo,.diagram');
    const readiness=`<section class="workspace-readiness guided-only"><div><p class="eyebrow">Before you start</p><h2>Ready your bench</h2><p>Confirm the parts and conditions below before you make a change. This prevents most avoidable resets and rewiring.</p></div><div class="readiness-list">${readinessItems(c).map((item,i)=>`<label><input type="checkbox" data-workspace-ready="${i}" ${ready[i]?'checked':''}><span>${esc(item)}</span></label>`).join('')}</div></section>`;
    visual?.insertAdjacentHTML('beforebegin',readiness);
    const success=main.querySelector('.success');
    success?.insertAdjacentHTML('afterend',`<section class="workspace-verify"><p class="eyebrow">Evidence of success</p><h2>What you should see</h2><p>${esc(lesson.success)}</p><label><input type="checkbox" data-workspace-verify ${verified?'checked':''}> <span>I saw this result and can explain what I changed.</span></label></section>`);
    const nav=main.querySelector('.lesson-nav');
    nav?.insertAdjacentHTML('beforebegin',`<section class="workspace-journal"><div><p class="eyebrow">Build journal</p><h2>Capture the useful detail</h2><p>Leave a note for your future self: settings, a fix that worked, or a change from this guide. Add a hosted image link if you want it in your portfolio.</p></div><label>Notes<textarea data-workspace-note placeholder="What did you observe, change, or learn?">${esc(W.notes[id]||'')}</textarea></label><label>Photo URL <input type="url" data-workspace-photo placeholder="https://…" value="${esc(W.photoUrls[id]||'')}"></label>${W.photoUrls[id]?`<a class="journal-photo" href="${esc(W.photoUrls[id])}" target="_blank" rel="noopener">Open attached build photo ↗</a>`:''}</section>`);
    if(index===c.lessons.length-1){
      nav?.insertAdjacentHTML('beforebegin',`<section class="workspace-finish"><p class="eyebrow">Finish, pack up, and share</p><h2>Leave the build in a state someone else can use</h2><ol><li>Shut down the Pi cleanly before disconnecting power.</li><li>Save a photo and the final configuration or code location in your build journal.</li><li>Record the next improvement you would make after a real test.</li></ol></section>`);
    }
  };
  const completedCourses=()=>D.courses.filter(c=>c.status==='ready').filter(c=>{
    const old=JSON.parse(localStorage.getItem('pi-lab-v21')||'{}');
    return c.lessons.every((l,i)=>old.checks?.[`${c.id}:${i}`]?.every(Boolean)&&old.answers?.[`${c.id}:${i}`]===l.check.answer);
  });
  const dashboardPanel=()=>{
    const hero=app.querySelector('.hero');
    if(!hero||app.querySelector('.workspace-dashboard'))return;
    const ready=D.courses.filter(c=>c.status==='ready');
    const notes=Object.values(W.notes).filter(Boolean).length;
    hero.insertAdjacentHTML('afterend',`<section class="workspace-dashboard"><div><p class="eyebrow">My bench</p><h2>Build with a clear next action</h2><p>Use your readiness checks before starting, leave notes while you build, and collect proof of work as you finish.</p><button class="primary" data-workspace-view="progress">Open my build record</button></div><div class="bench-stats"><span><b>${ready.length}</b> available labs</span><span><b>${notes}</b> journal notes</span><span><b>${completedCourses().length}</b> labs completed</span></div></section>`);
  };
  const prerequisite=part=>/^(completed|foundation|required|new to pi|python fundamentals)/i.test(part)||/64-bit Raspberry Pi OS install/i.test(part);
  const componentFor=part=>{
    const t=String(part).toLowerCase();
    if(/raspberry pi 5/.test(t))return ['pi5','Raspberry Pi 5'];
    if(/27 w|usb-c supply|power supply/.test(t))return ['power','Official USB-C power supply'];
    if(/micro.?sd/.test(t))return ['microsd','microSD card (32 GB or larger)'];
    if(/keyboard.*mouse|keyboard/.test(t))return ['input','Keyboard and mouse'];
    if(/hdmi.*display|display.*hdmi|temporary hdmi/.test(t))return ['hdmi-display','HDMI display and cable'];
    if(/dsi ribbon|ribbon\/fpc/.test(t))return ['dsi-ribbon','Compatible DSI ribbon/FPC cable'];
    if(/dsi display/.test(t))return ['dsi-display','Compatible DSI display'];
    if(/two-way mirror|mirror acrylic/.test(t))return ['mirror','Two-way mirror acrylic or glass'];
    if(/frame|enclosure|case/.test(t))return ['enclosure','Project enclosure, frame, or case'];
    if(/breadboard/.test(t))return ['breadboard','Breadboard'];
    if(/jumper/.test(t))return ['jumpers','Jumper wires'];
    if(/led/.test(t))return ['leds','LEDs and resistors'];
    if(/pushbutton|button/.test(t))return ['button','Momentary pushbutton'];
    if(/bme280|sensor/.test(t))return ['sensor','Compatible sensor module'];
    if(/camera/.test(t))return ['camera','Raspberry Pi camera module'];
    if(/controller/.test(t))return ['controller','Game controller'];
    if(/battery|pisugar/.test(t))return ['battery','Compatible battery pack'];
    if(/photo/.test(t))return ['photos','Photo library'];
    return [t.replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),String(part).replace(/^a\s+/i,'')];
  };
  const prerequisiteMet=part=>{
    const completed=completedCourses();
    const requirements=[];
    if(/foundation|pi 5 setup|raspberry pi os/i.test(part))requirements.push(completed.some(c=>c.id==='foundation'));
    if(/electronics/i.test(part))requirements.push(completed.some(c=>c.id==='electronics-lab'));
    if(/python/i.test(part))requirements.push(completed.some(c=>c.id==='python-fundamentals'));
    return requirements.length?requirements.every(Boolean):false;
  };
  const missingFor=c=>[...new Map((c.materials||[]).map(part=>prerequisite(part)?[`prereq:${part}`,prerequisiteMet(part)?null:part]:componentFor(part)).filter(([,label])=>label).filter(([id])=>id.startsWith('prereq:')||!W.inventory[id])).values()];
  const inventoryMarkup=()=>{
    const labs=D.courses.filter(c=>c.status==='ready');
    const components=[...new Map(labs.flatMap(c=>(c.materials||[]).filter(part=>!prerequisite(part)).map(componentFor))).entries()].sort((a,b)=>a[1].localeCompare(b[1]));
    const selected=Object.values(W.inventory).filter(Boolean).length;
    const buildable=selected?labs.filter(c=>!missingFor(c).length):[];
    return `<section class="workspace-inventory standalone"><div class="inventory-copy"><p class="eyebrow">My inventory</p><h1>Build from the parts you have</h1><p>Choose real, reusable components—not repeated course descriptions. Lab Readiness stays empty until you select inventory, then lists only labs whose requirements are fully matched.</p><p class="inventory-selection-count"><b>${selected}</b> component${selected===1?'':'s'} selected</p><div class="inventory-actions"><button class="secondary" data-workspace-clear-inventory>Clear selections</button><button class="primary" data-workspace-open-buildable ${buildable.length?'':'disabled'}>${buildable.length?`View ${buildable.length} buildable lab${buildable.length===1?'':'s'}`:'No labs matched yet'}</button></div><div class="inventory-parts">${components.map(([id,label],index)=>`<label><input type="checkbox" data-workspace-inventory="${index}" ${W.inventory[id]?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div></div><div class="inventory-labs"><p class="eyebrow">Lab readiness</p>${!selected?'<p class="inventory-empty">Select the components you have to see labs that are ready to build.</p>':buildable.length?buildable.map(c=>`<div class="inventory-lab ready"><b>${esc(c.title)}</b><span>Materials and recorded prerequisites matched.</span><button data-workspace-open="${esc(c.id)}" data-workspace-lesson="0">Start lab →</button></div>`).join(''):'<p class="inventory-empty">No lab is fully matched yet. Keep selecting the parts on your bench; eligible labs will appear here automatically.</p>'}</div></section>`;
  };
  const addInventoryTab=()=>{
    const nav=app.querySelector('header nav');
    if(!nav||nav.querySelector('[data-workspace-inventory-nav]'))return;
    const labs=[...nav.querySelectorAll('[data-view="labs"]')][0];
    labs?.insertAdjacentHTML('afterend','<button data-workspace-inventory-nav>My inventory</button>');
  };
  const showInventory=()=>{
    const main=app.querySelector('main'); if(!main)return;
    main.innerHTML=`<section class="inventory-page-head"><p class="eyebrow">Planning workspace</p><h1>My inventory</h1><p>Choose the components on your bench, then use Pi Lab’s readiness results to decide what to build next.</p></section>${inventoryMarkup()}`;
    app.querySelectorAll('header nav button').forEach(button=>button.classList.toggle('active',button.hasAttribute('data-workspace-inventory-nav')));
  };
  const applyInventoryToLabCards=()=>{
    const all=D.courses.filter(c=>c.status==='ready');
    app.querySelectorAll('.card [data-open]').forEach(open=>{
      const c=all.find(item=>item.id===open.dataset.open),card=open.closest('.card');
      if(!c||!card||card.querySelector('.inventory-card-status'))return;
      const gaps=missingFor(c);
      card.classList.toggle('inventory-ready',!gaps.length);
      card.querySelector('.card-copy')?.insertAdjacentHTML('beforeend',`<p class="inventory-card-status ${gaps.length?'':'ready'}">${gaps.length?`${gaps.length} material${gaps.length===1?'':'s'} to match`:'Materials matched'}</p>`);
    });
  };
  const addSearch=()=>{
    const target=app.querySelector('.dashboard-head,.hero');
    if(!target||app.querySelector('.workspace-search'))return;
    target.insertAdjacentHTML('afterend',`<section class="workspace-search"><label><span>Search every lab, lesson, command, part, and troubleshooting note</span><input data-workspace-search value="${esc(W.search)}" placeholder="Try: SSH, GPIO, motion, autostart…"></label><div class="search-results"></div></section>`);
    renderSearch();
  };
  const searchEntries=q=>{
    const query=q.trim().toLowerCase(); if(!query)return[];
    const entries=[];
    D.courses.filter(c=>c.status==='ready').forEach(c=>c.lessons.forEach((l,i)=>{
      const hay=[c.title,c.short,...(c.materials||[]),l.title,l.goal,l.success,...l.actions.flat(),...(l.commands||[]).flat(),...(l.troubleshoot||[]).flat()].join(' ').toLowerCase();
      if(hay.includes(query))entries.push({c,i,l});
    }));
    return entries.slice(0,12);
  };
  const renderSearch=()=>{
    const results=app.querySelector('.search-results'); if(!results)return;
    const entries=searchEntries(W.search);
    results.innerHTML=W.search?entries.length?entries.map(({c,i,l})=>`<button data-workspace-open="${esc(c.id)}" data-workspace-lesson="${i}"><b>${esc(c.title)}</b><span>Lesson ${i+1}: ${esc(l.title)}</span></button>`).join(''):'<p>No matching lesson yet. Try a simpler term.</p>':'';
  };
  const progressPanel=()=>{
    const heading=app.querySelector('.dashboard-head');
    if(!heading||app.querySelector('.workspace-progress'))return;
    const completed=completedCourses();
    heading.insertAdjacentHTML('afterend',`<section class="workspace-progress"><div><p class="eyebrow">Portfolio & certificate</p><h2>Your completed builds</h2><p>${completed.length?`${completed.map(c=>esc(c.title)).join(' · ')}. Print this page when you want a compact record of your work.`:'Complete each lesson checklist and knowledge check to add a lab here.'}</p><label>Builder name <input data-workspace-name value="${esc(W.builderName)}" placeholder="Your name"></label><button class="secondary" data-workspace-certificate ${completed.length?'':'disabled'}>Print completion record</button></div><div><p class="eyebrow">Instructor tools</p><h2>Review one builder’s local record</h2><p>This browser-only starter keeps progress private on this device. Export it for a facilitator, or import it onto another browser.</p><label>Facilitator feedback<textarea data-workspace-instructor-note placeholder="Observed strengths, safety concerns, or a suggested next lab…">${esc(W.instructorNote||'')}</textarea></label><button class="secondary" data-workspace-export>Export progress + review</button><label class="import-label">Import progress<input type="file" data-workspace-import accept="application/json"></label><button class="danger-link" data-workspace-reset>Reset this browser</button><p class="sync-note">Cloud sync is intentionally unavailable until Pi Lab has an approved sign-in and privacy model.</p></div></section><section class="workspace-certificate print-only"><h1>Pi Lab build record</h1><p>This record recognizes ${esc(W.builderName||'a builder')} for completing ${completed.length} Pi Lab build${completed.length===1?'':'s'}.</p><ul>${completed.map(c=>`<li>${esc(c.title)}</li>`).join('')}</ul>${W.instructorNote?`<p><b>Facilitator note:</b> ${esc(W.instructorNote)}</p>`:''}<p>Created by Nikki</p></section>`);
  };
  const stationPanel=()=>{
    const page=app.querySelector('.dashboard-head');
    if(!page||app.querySelector('.workspace-station'))return;
    const items=['Save or export any builder notes needed for the next session','Close apps and run a clean shutdown before removing power','Wait until activity stops, then disconnect power and peripherals','Return the microSD card, power supply, display cable, and loose components to the labeled station','Visually check the bench is clear and report damaged or missing parts'];
    page.insertAdjacentHTML('afterend',`<section class="workspace-station"><div><p class="eyebrow">Lab station reset</p><h2>Return a Pi safely for the next builder</h2><p>Use this at the end of a supervised session. It is intentionally hardware-agnostic; individual labs may add their own shutdown or storage instructions.</p></div>${items.map((item,index)=>`<label><input type="checkbox" data-workspace-station="${index}" ${W.stationChecks[index]?'checked':''}><span>${esc(item)}</span></label>`).join('')}</section>`);
  };
  const setMode=()=>{document.documentElement.dataset.builderMode=W.mode; const label=app.querySelector('.student'); if(label&&label.dataset.workspaceMode!==W.mode){label.dataset.workspaceMode=W.mode;label.innerHTML=`${W.mode==='guided'?'Guided':'Builder'} mode <button class="mode-toggle" data-workspace-mode>Switch</button>`}};
  const enhance=()=>{
    setMode();
    addInventoryTab();
    addLessonWorkspace();
    dashboardPanel();
    applyInventoryToLabCards();
    addSearch();
    progressPanel();
    if(app.querySelector('.dashboard-head .eyebrow')?.textContent?.trim()==='Health')stationPanel();
  };
  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(app,{childList:true,subtree:true});
  app.addEventListener('change',event=>{
    if(event.target.matches('[data-workspace-inventory]')){const labs=D.courses.filter(c=>c.status==='ready');const components=[...new Map(labs.flatMap(c=>(c.materials||[]).filter(part=>!prerequisite(part)).map(componentFor))).entries()].sort((a,b)=>a[1].localeCompare(b[1]));W.inventory[components[Number(event.target.dataset.workspaceInventory)][0]]=event.target.checked;save();showInventory();return}
    if(event.target.matches('[data-workspace-station]')){W.stationChecks[Number(event.target.dataset.workspaceStation)]=event.target.checked;save();return}
    if(event.target.matches('[data-workspace-name]')){W.builderName=event.target.value;save();return}
    if(event.target.matches('[data-workspace-instructor-note]')){W.instructorNote=event.target.value;save();return}
    if(event.target.matches('[data-workspace-import]')){const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const imported=JSON.parse(reader.result);if(imported.piLabProgress)localStorage.setItem('pi-lab-v21',JSON.stringify(imported.piLabProgress));if(imported.workspace){W={...W,...imported.workspace};save()}location.reload()}catch{alert('That file is not a Pi Lab progress export.')}};reader.readAsText(file);return}
    const c=currentCourse(),index=currentLessonIndex(); if(!c)return;
    const id=lessonKey(c,index);
    if(event.target.matches('[data-workspace-ready]')){const values=W.readiness[id]||[];values[Number(event.target.dataset.workspaceReady)]=event.target.checked;W.readiness[id]=values;save()}
    if(event.target.matches('[data-workspace-verify]')){W.verifications[id]=event.target.checked;save()}
    if(event.target.matches('[data-workspace-note]')){W.notes[id]=event.target.value;save()}
    if(event.target.matches('[data-workspace-photo]')){W.photoUrls[id]=event.target.value;save();enhance()}
  });
  app.addEventListener('input',event=>{if(event.target.matches('[data-workspace-search]')){W.search=event.target.value;save();renderSearch()}});
  app.addEventListener('click',event=>{
    if(event.target.closest('[data-workspace-inventory-nav]')){showInventory();return}
    const open=event.target.closest('[data-workspace-open]');
    if(open){const id=open.dataset.workspaceOpen,lesson=Number(open.dataset.workspaceLesson);app.querySelector('[data-view="labs"]')?.click();setTimeout(()=>{app.querySelector(`[data-open="${CSS.escape(id)}"]`)?.click();setTimeout(()=>app.querySelector(`[data-lesson="${lesson}"]`)?.click(),40)},40);return}
    if(event.target.closest('[data-workspace-mode]')){W.mode=W.mode==='guided'?'builder':'guided';save();setMode();return}
    if(event.target.closest('[data-workspace-clear-inventory]')){W.inventory={};save();showInventory();return}
    if(event.target.closest('[data-workspace-open-buildable]')){app.querySelector('[data-view="labs"]')?.click();setTimeout(()=>{app.querySelectorAll('.card').forEach(card=>{const status=card.querySelector('.inventory-card-status');card.hidden=!!status&&!status.classList.contains('ready')})},30);return}
    if(event.target.closest('[data-workspace-view="progress"]')){app.querySelector('[data-view="progress"]')?.click();return}
    if(event.target.closest('[data-workspace-export]')){const payload={exportedAt:new Date().toISOString(),piLabProgress:JSON.parse(localStorage.getItem('pi-lab-v21')||'{}'),workspace:W};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='pi-lab-progress.json';a.click();URL.revokeObjectURL(a.href);return}
    if(event.target.closest('[data-workspace-reset]')&&confirm('Reset all Pi Lab progress, journal notes, and readiness checks in this browser?')){localStorage.removeItem('pi-lab-v21');localStorage.removeItem(storageKey);location.reload();return}
    if(event.target.closest('[data-workspace-certificate]'))window.print();
  });
  enhance();
})();
