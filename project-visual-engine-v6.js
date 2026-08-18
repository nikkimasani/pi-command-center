(()=>{
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const PROJECT={
 dashboard:{name:'Personal Dashboard',accent:'#7c5cff',labels:['Today','Fitness','Focus','Photos','Devices','Settings']},
 'ai-terminal':{name:'Mini AI Terminal',accent:'#4bd49b',labels:['AI Terminal','You: How can I improve this build?','Assistant: Start with the display test.','New Chat','Send','Server API']},
 cyberdeck:{name:'Portable Cyberdeck',accent:'#4d8fff',labels:['7-inch display','Mini keyboard','Raspberry Pi 5','Power bank','Ventilation','Cable slack']},
 'home-panel':{name:'Home Assistant Panel',accent:'#45a8ff',labels:['Living Room','Bedroom','Focus Scene','Sleep Scene','Lights ON','Climate']},
 'electronics-lab':{name:'Electronics Lab',accent:'#f1c85b',labels:['GPIO17','220–330Ω','LED +','LED −','GND','GPIO27 Button']},
 pomodoro:{name:'Pomodoro Station',accent:'#ff7d91',labels:['25:00','Start','Pause','Reset','Focus','Short Break']},
 glance:{name:'Desk Info Center',accent:'#56d6c9',labels:['8:34 AM','78° Weather','Next Event 10:00','Pi Online','Today','Status']},
 'photo-frame':{name:'Digital Photo Frame',accent:'#c985ff',labels:['Landscape photo','Portrait photo','Previous','Next','Auto advance','Full screen']},
 'magic-frame':{name:'Magic Mirror Frame',accent:'#9cb5ff',labels:['Mirror mode','Photo reveal','Sleep','Wake','Sensor trigger','Black background']}
};
const detail={
 'dashboard/phase-1/step-1.png':['Six-card information architecture','Today','Fitness','Focus','Photos','Devices','Settings'],
 'dashboard/phase-1/step-2.png':['7-inch touch layout','2-column grid','44px+ targets','Large type','Status header','No horizontal scroll','1024×600'],
 'dashboard/phase-1/step-3.png':['Project shell','Home page','Responsive CSS','GitHub repo','npm run dev','Static first','Commit baseline'],
 'ai-terminal/phase-1/step-1.png':['Chat layout','Header','Message history','Input field','Send','Scrollable','Touch keyboard safe'],
 'ai-terminal/phase-1/step-2.png':['Interaction states','Mock reply','Loading','Send disabled','Empty blocked','Error state','Retry'],
 'ai-terminal/phase-1/step-3.png':['Server API boundary','Browser','/api/chat','Server env var','AI provider','No client secret','Structured response'],
 'cyberdeck/phase-1/step-1.jpg':['Loose hardware test','Display','Pi 5','Keyboard','Power','Wi-Fi','Boot OK'],
 'cyberdeck/phase-2/step-2.jpg':['Internal component placement','Pi 5','Power bank','Port access','Airflow','No LCD pressure','Removable power'],
 'cyberdeck/phase-2/step-3.jpg':['Cable routing','Broad curves','Slack','No pinches','Service loop','Case closes','Connectors relaxed'],
 'home-panel/phase-1/step-2.png':['Dedicated Home view','Living Room','Bedroom','Scenes','Large tiles','Clear ON/OFF','No admin clutter'],
 'home-panel/phase-3/step-1.jpg':['Mount dry-fit','7-inch display','Pi 5','USB-C path','Ventilation','Wall/desk mount','No cable pressure'],
 'electronics-lab/phase-1/step-1.jpg':['GPIO orientation','Physical pin 11','GPIO17','Physical pin 6','GND','Power OFF','Verify before wiring'],
 'electronics-lab/phase-1/step-2.jpg':['Breadboard continuity','Center gap','Five-hole group','Separate rows','LED area','No rails yet','Trace rows'],
 'electronics-lab/phase-2/step-2.jpg':['LED circuit','GPIO17','Resistor','LED +','LED −','GND','Power OFF'],
 'electronics-lab/phase-3/step-1.jpg':['Button placement','Center gap','Paired legs','GPIO side','GND side','Opposite sides','Power OFF'],
 'pomodoro/phase-1/step-1.png':['Timer state machine','Idle','Running','Paused','Complete','30s dev test','No negative time'],
 'pomodoro/phase-1/step-2.png':['Touch controls','25:00','Start','Pause','Reset','Complete','Large targets'],
 'pomodoro/phase-3/step-1.jpg':['Physical start button','GPIO input','Button','GND','gpiozero','Debounce','Power OFF'],
 'glance/phase-1/step-1.png':['Four-card glance screen','Time','Weather','Next Event','Pi Status','No scrolling','Priority first'],
 'glance/phase-2/step-3.png':['Independent data cards','Calendar API','Pi status','Server boundary','Token protected','Per-card errors','Other cards stay live'],
 'photo-frame/phase-1/step-2.png':['Slideshow viewport','Photo area','Black background','Contain / cover','Previous','Next','No stretching'],
 'photo-frame/phase-3/step-2.jpg':['Frame assembly','Display','Pi 5','Cable path','Ventilation','No LCD pressure','Power access'],
 'magic-frame/phase-1/step-1.jpg':['Proven base mirror','Two-way acrylic','Display','Pi 5','Black pixels hide','Touch works','Wi-Fi works'],
 'magic-frame/phase-2/step-1.png':['Reveal states','Mirror','Photo view','On-screen switch','Black surround','Repeated switching','No reload'],
 'magic-frame/phase-3/step-1.jpg':['Optional trigger wiring','Sensor / button','GPIO','GND','Standalone test','Power OFF','Reliable events'],
 'magic-frame/phase-4/step-1.jpg':['Final dry-fit','Sensor field','Cable path','Ventilation','Display clearance','Mirror layers','Back panel']
};
function parse(id){const p=id.split('/')[0];const m=id.match(/phase-(\d+)\/step-(\d+)/);return{p,phase:+(m?.[1]||1),step:+(m?.[2]||1),hardware:/\.jpg$/i.test(id)}}
function meta(id){const x=parse(id),base=PROJECT[x.p]||{name:x.p,accent:'#7c5cff',labels:[]};const d=detail[id]||[`${base.name} · Phase ${x.phase} Step ${x.step}`,...base.labels];return{...x,...base,title:d[0],items:d.slice(1,7)}}
function svg(id){const m=meta(id),items=[...m.items];while(items.length<6)items.push(`Check ${items.length+1}`);const cards=items.map((t,i)=>{const col=i%2,row=Math.floor(i/2),x=54+col*330,y=154+row*92;return `<g><rect x="${x}" y="${y}" width="298" height="68" rx="12" fill="#111d2b" stroke="#30445c"/><circle cx="${x+24}" cy="${y+34}" r="10" fill="${m.accent}"/><text x="${x+46}" y="${y+29}" fill="#f4f7fb" font-size="16" font-weight="700">${esc(t).slice(0,28)}</text><text x="${x+46}" y="${y+49}" fill="#8fa4bb" font-size="11">${m.hardware?'physical check':'screen / behavior check'}</text></g>`}).join('');
return `<svg viewBox="0 0 720 470" role="img" aria-label="${esc(m.title)}" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="470" rx="22" fill="#050b12"/><rect x="22" y="22" width="676" height="426" rx="18" fill="#09131f" stroke="#2b4058"/><rect x="42" y="42" width="636" height="82" rx="14" fill="#0e1b2a"/><circle cx="66" cy="64" r="7" fill="${m.accent}"/><text x="84" y="69" fill="#9eb2c9" font-size="12" font-weight="800">${esc(m.hardware?'GENERATED BUILD DIAGRAM':'PROJECT-SPECIFIC SCREEN REFERENCE')}</text><text x="54" y="99" fill="#f4f7fb" font-size="24" font-weight="800">${esc(m.title).slice(0,44)}</text>${cards}<text x="54" y="430" fill="#7f94aa" font-size="11">${esc(m.name)} · Phase ${m.phase} · Step ${m.step} · Visual ID: ${esc(id)}</text></svg>`}
function render(card,code,id){if(card.dataset.pc6VisualBound==='1')return;card.dataset.pc6VisualBound='1';const m=meta(id);const wrap=document.createElement('figure');wrap.className='pc6-generated-visual';wrap.innerHTML=`${svg(id)}<figcaption><b>${esc(m.title)}</b><span>${m.hardware?'Generated build diagram for this exact step. Use it for layout and connection logic. An exact physical photo remains preferable where hardware orientation is delicate.':'Project-specific screen reference for this exact step. Live text and data can differ, but the structure and behavior should match.'}</span></figcaption>`;card.replaceWith(wrap)}
function bind(){if(!document.body.classList.contains('pc6-active'))return;document.querySelectorAll('#pc6Root .pc6-screen code,#pc6Root .pc6-photo code').forEach(code=>{const id=code.textContent.trim(),card=code.closest('.pc6-screen,.pc6-photo');if(id&&card)render(card,code,id)})}
const style=document.createElement('style');style.textContent=`.pc6-generated-visual{margin:14px 0;border:1px solid #3a5068;border-radius:14px;overflow:hidden;background:#050b12}.pc6-generated-visual svg{width:100%;height:auto;display:block}.pc6-generated-visual figcaption{display:grid;gap:4px;padding:11px 13px;background:#09131f}.pc6-generated-visual figcaption b{color:#eef4ff}.pc6-generated-visual figcaption span{color:#94a8bd;font-size:12px;line-height:1.45}`;document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setTimeout(bind,450);
})();