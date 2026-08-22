(()=>{
'use strict';
if(window.PI_PHOTOS_V14)return;
const REF=(src,label,caption,kind='Exact reference')=>({src,label,caption,kind});
const SETUP=[
 REF('/assets/reference/pi5-board.svg?v=14.0.0','Raspberry Pi 5 port map','Identify USB-C power, micro-HDMI, USB, GPIO, MIPI and the underside microSD slot.'),
 REF('/assets/reference/imager-download.svg?v=14.0.0','Raspberry Pi Imager download','Use the official Raspberry Pi software page, install Imager, then open it before choosing storage.'),
 REF('/assets/reference/imager-flow.svg?v=14.0.0','Raspberry Pi Imager workflow','Choose Raspberry Pi 5, Raspberry Pi OS 64-bit Desktop, and only the intended microSD card.'),
 REF('/assets/reference/imager-customize.svg?v=14.0.0','Imager OS customization','Configure hostname, username, Wi-Fi, locale and SSH before writing the card.'),
 REF('/assets/reference/imager-write.svg?v=14.0.0','Write, verify and eject','Write the OS, wait for verification, eject cleanly, then insert the card only while the Pi is powered off.'),
 REF('/assets/reference/first-boot.svg?v=14.0.0','Raspberry Pi OS first boot','Reach the desktop, test input, connect Wi-Fi, and confirm the Pi is stable before continuing.'),
 REF('/assets/reference/software-tools.svg?v=14.0.0','Common Raspberry Pi software tools','Update Raspberry Pi OS and install Git, curl, Python, pip/venv and Chromium.'),
 REF('/assets/reference/health-check.svg?v=14.0.0','Final Pi health check','Verify IP, temperature, storage, SSH, clean shutdown and a true cold boot.')
];
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));}
function dataSvg(svg){return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);}
function actionRows(phase){
 return (phase.actions||[]).slice(0,4).map((a,i)=>{
  const title=esc(a.title||a.text||`Step ${i+1}`).slice(0,40);
  const detail=esc(a.detail||a.description||'Follow the written step below.').slice(0,70);
  return {title,detail};
 });
}
function makeSoftwareSvg(course,phase){
 const commands=(phase.commands||[]).slice(0,4);
 const rows=commands.map((c,i)=>`<text x="94" y="${238+i*72}" fill="#7ce3b2" font-family="ui-monospace,monospace" font-size="18">$ ${esc(c.code).slice(0,90)}</text><text x="94" y="${264+i*72}" fill="#9fb0c5" font-family="Arial,sans-serif" font-size="15">Expected: ${esc(c.result).slice(0,92)}</text>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
 <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101a"/><stop offset="1" stop-color="#111827"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter></defs>
 <rect width="1200" height="675" fill="url(#bg)"/><rect x="36" y="34" width="1128" height="607" rx="30" fill="#0d1824" stroke="#31445c" stroke-width="3" filter="url(#shadow)"/>
 <text x="74" y="92" fill="#a78bfa" font-family="Arial,sans-serif" font-size="23" font-weight="700">${esc(course.title)} • software reference</text>
 <text x="74" y="136" fill="#f8fafc" font-family="Arial,sans-serif" font-size="30" font-weight="700">${esc(phase.title).slice(0,70)}</text>
 <rect x="72" y="168" width="1056" height="382" rx="22" fill="#04080d" stroke="#526981" stroke-width="3"/>
 <circle cx="105" cy="197" r="7" fill="#f87171"/><circle cx="129" cy="197" r="7" fill="#fbbf24"/><circle cx="153" cy="197" r="7" fill="#34d399"/>${rows}
 <text x="74" y="610" fill="#dbe7f3" font-family="Arial,sans-serif" font-size="18">Run the commands in this phase exactly as written. Fix errors before continuing.</text></svg>`;
 return dataSvg(svg);
}
function sceneKind(course,phase){
 const t=(phase.title||'').toLowerCase();
 if(/wire|breadboard|gpio|sensor|led|button|circuit|cable|power/.test(t))return 'wiring';
 if(/mirror|frame|mount|dry-fit|enclosure|panel|rear|stack|close/.test(t))return 'frame';
 if(/dashboard|screen|display|viewer|photo|timer|kiosk|interface|layout|rotate|night/.test(t))return 'display';
 if(/cyberdeck|terminal|keyboard|launcher|portable/.test(t))return 'terminal';
 if(/final|validation|finished|document|test|verify/.test(t))return 'final';
 if(course.id==='electronics-lab')return 'wiring';
 if(['smart-mirror','magic-frame','photo-frame'].includes(course.id))return 'frame';
 if(['dashboard','home-panel','pomodoro','glance'].includes(course.id))return 'display';
 if(['ai-terminal','cyberdeck'].includes(course.id))return 'terminal';
 return 'hardware';
}
function sceneArt(kind,course){
 const accent={
  'smart-mirror':'#a78bfa','dashboard':'#38bdf8','ai-terminal':'#34d399','cyberdeck':'#f59e0b','home-panel':'#22d3ee',
  'electronics-lab':'#f97316','pomodoro':'#ef4444','glance':'#60a5fa','photo-frame':'#84cc16','magic-frame':'#c084fc'
 }[course.id]||'#22c55e';
 const common=`<defs><linearGradient id="desk" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b5e3c"/><stop offset=".5" stop-color="#6b442b"/><stop offset="1" stop-color="#4a2f22"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#213247"/><stop offset=".45" stop-color="#090f17"/><stop offset="1" stop-color="#17283d"/></linearGradient><filter id="ds"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".45"/></filter><pattern id="grain" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 8 C8 2 20 14 32 7M0 24 C10 17 20 30 32 21" fill="none" stroke="#d6a779" stroke-opacity=".12" stroke-width="2"/></pattern></defs>`;
 const pi=`<g filter="url(#ds)"><rect x="182" y="242" width="250" height="160" rx="18" fill="#16834f" stroke="#67e8a8" stroke-width="4"/><rect x="218" y="278" width="78" height="72" rx="10" fill="#26374c"/><rect x="326" y="268" width="58" height="52" rx="8" fill="#24344a"/><rect x="194" y="254" width="226" height="20" rx="4" fill="#d6b847"/><g fill="#cbd5e1"><rect x="429" y="260" width="30" height="35" rx="4"/><rect x="429" y="310" width="30" height="35" rx="4"/><rect x="429" y="360" width="30" height="28" rx="4"/></g><text x="306" y="385" text-anchor="middle" fill="#d1fae5" font-family="Arial" font-size="18" font-weight="700">Raspberry Pi 5</text></g>`;
 if(kind==='wiring')return common+`<rect x="0" y="0" width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/>${pi}<g filter="url(#ds)"><rect x="680" y="235" width="330" height="220" rx="18" fill="#f8fafc"/><g stroke="#cbd5e1" stroke-width="2">${Array.from({length:10},(_,i)=>`<line x1="${705+i*28}" y1="255" x2="${705+i*28}" y2="432"/>`).join('')}</g><g stroke="#fb7185" stroke-width="8" fill="none"><path d="M420 300 C540 225 620 230 720 315"/><path d="M420 340 C560 390 610 350 772 390"/></g><g stroke="#60a5fa" stroke-width="8" fill="none"><path d="M420 370 C590 480 670 405 840 285"/></g><circle cx="860" cy="346" r="16" fill="#ef4444"/><rect x="855" y="362" width="10" height="46" rx="4" fill="#475569"/></g>`;
 if(kind==='frame')return common+`<rect width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/><g filter="url(#ds)"><rect x="490" y="136" width="430" height="390" rx="10" fill="#5b3624"/><rect x="530" y="176" width="350" height="310" rx="5" fill="url(#glass)" stroke="#94a3b8" stroke-width="4"/><rect x="590" y="230" width="230" height="160" rx="8" fill="#020617"/><text x="705" y="302" text-anchor="middle" fill="#fff" font-family="Arial" font-size="36" font-weight="700">10:42</text><text x="705" y="338" text-anchor="middle" fill="${accent}" font-family="Arial" font-size="18">72° • Friday</text></g>${pi}<g stroke="#111827" stroke-width="14" fill="none"><path d="M426 332 C475 332 500 350 540 382"/></g>`;
 if(kind==='display')return common+`<rect width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/>${pi}<g filter="url(#ds)"><rect x="520" y="145" width="470" height="330" rx="22" fill="#1f2937"/><rect x="548" y="173" width="414" height="272" rx="12" fill="#030712"/><rect x="585" y="210" width="160" height="88" rx="12" fill="#0f172a" stroke="${accent}" stroke-width="3"/><rect x="765" y="210" width="160" height="88" rx="12" fill="#0f172a" stroke="#334155" stroke-width="3"/><rect x="585" y="318" width="340" height="84" rx="12" fill="#0f172a" stroke="#334155" stroke-width="3"/><text x="605" y="248" fill="#f8fafc" font-family="Arial" font-size="24" font-weight="700">10:42</text><text x="605" y="280" fill="${accent}" font-family="Arial" font-size="17">Ready</text></g>`;
 if(kind==='terminal')return common+`<rect width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/><g filter="url(#ds)"><rect x="410" y="132" width="590" height="390" rx="24" fill="#1f2937"/><rect x="448" y="166" width="514" height="270" rx="10" fill="#020617"/><text x="478" y="218" fill="#34d399" font-family="monospace" font-size="20">$ pi-hub ready</text><text x="478" y="258" fill="#a7f3d0" font-family="monospace" font-size="18">system: online</text><text x="478" y="294" fill="#a7f3d0" font-family="monospace" font-size="18">network: connected</text><rect x="500" y="462" width="370" height="36" rx="7" fill="#111827"/><g fill="#334155">${Array.from({length:12},(_,i)=>`<rect x="${520+i*27}" y="470" width="20" height="18" rx="3"/>`).join('')}</g></g>${pi}`;
 if(kind==='final')return common+`<rect width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/><g filter="url(#ds)"><rect x="400" y="124" width="540" height="420" rx="30" fill="#182231" stroke="${accent}" stroke-width="4"/><rect x="446" y="168" width="448" height="280" rx="14" fill="#030712"/><circle cx="670" cy="500" r="30" fill="#14532d" stroke="#4ade80" stroke-width="4"/><path d="M654 500 l12 12 24-30" fill="none" stroke="#86efac" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`;
 return common+`<rect width="1200" height="675" fill="url(#desk)"/><rect width="1200" height="675" fill="url(#grain)"/>${pi}<g filter="url(#ds)"><rect x="520" y="190" width="260" height="180" rx="22" fill="#111827"/><rect x="820" y="210" width="150" height="120" rx="18" fill="#d1d5db"/><rect x="530" y="420" width="400" height="30" rx="15" fill="#0f172a"/></g>`;
}
function makePhysicalSvg(course,phase){
 const kind=sceneKind(course,phase), actions=actionRows(phase);
 const chips=actions.map((a,i)=>`<g><rect x="${70+i*270}" y="555" width="250" height="66" rx="16" fill="#0b1320" stroke="#526981" stroke-width="2"/><circle cx="${99+i*270}" cy="588" r="18" fill="#5b4cc4"/><text x="${99+i*270}" y="594" text-anchor="middle" fill="#fff" font-family="Arial" font-size="15" font-weight="700">${i+1}</text><text x="${128+i*270}" y="582" fill="#f8fafc" font-family="Arial" font-size="14" font-weight="700">${a.title}</text><text x="${128+i*270}" y="604" fill="#9fb0c5" font-family="Arial" font-size="11">${a.detail}</text></g>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
 ${sceneArt(kind,course)}
 <rect x="38" y="28" width="1124" height="76" rx="22" fill="#07101a" fill-opacity=".88" stroke="#31445c" stroke-width="2"/>
 <text x="70" y="60" fill="#a78bfa" font-family="Arial,sans-serif" font-size="17" font-weight="700">SCALABLE BUILD RENDER • ${esc(course.title)}</text>
 <text x="70" y="89" fill="#f8fafc" font-family="Arial,sans-serif" font-size="24" font-weight="700">${esc(phase.title).slice(0,76)}</text>
 <rect x="48" y="535" width="1104" height="104" rx="22" fill="#07101a" fill-opacity=".91" stroke="#31445c" stroke-width="2"/>${chips}
 </svg>`;
 return dataSvg(svg);
}
function softwareReference(course,phase){
 const t=String(phase.title||'').toLowerCase();
 if(t.includes('install the common raspberry pi software tools'))return REF('/assets/reference/software-tools.svg?v=14.0.0','Common Raspberry Pi software tools','Use this exact Terminal reference for the shared software foundation.','Software reference');
 if(t.includes('install magicmirror'))return REF('/assets/reference/magicmirror-install.svg?v=14.0.0','Official MagicMirror² installation','Clone the official MagicMirrorOrg repository, run the supported installer, copy the sample config, then launch MagicMirror² manually.','Software reference');
 if(t.includes('prepare raspberry pi os'))return REF('/assets/reference/imager-flow.svg?v=14.0.0','Raspberry Pi OS preparation','Use Raspberry Pi Imager, write and verify the card, complete first boot, update the OS, then reboot.','Exact reference');
 if(/software|install|terminal|server|kiosk|home assistant|gpio tools|companion/i.test(t)&&(phase.commands||[]).length)return REF(makeSoftwareSvg(course,phase),`${course.title} software reference`,'Scalable command reference generated from this phase’s actual commands and expected results.','Software reference');
 return null;
}
const audit={version:'14.0.0',total:0,exactReferences:0,softwareReferences:0,renderedReferences:0,bitmapReferences:0,spriteReferences:0};
for(const course of (window.PI_COURSES_V2||[])){
 course.phases.forEach((phase,i)=>{
  audit.total++;const v=phase.visual||(phase.visual={});v.photo=null;v.photos=[];
  if(course.id==='pi-setup'){v.photos=[SETUP[i]||SETUP[SETUP.length-1]];audit.exactReferences++;return;}
  const sw=softwareReference(course,phase);if(sw){v.photos=[sw];audit.softwareReferences++;return;}
  if(/dsi|ribbon|mipi/i.test(phase.title||'')){v.photos=[REF('/assets/reference/dsi-ribbon.svg?v=14.0.0','Exact DSI / MIPI reference','Power off first. Open the latch evenly, align the contacts, insert straight and close evenly.')];audit.exactReferences++;return;}
  v.photos=[REF(makePhysicalSvg(course,phase),'Scalable build render','Phase-specific rendered reference generated from this project and this phase. It stays sharp at any screen size and is never a reused low-resolution photo.','Scalable rendered reference')];audit.renderedReferences++;
 });
}
const style=document.createElement('style');style.id='photo-v14-style';style.textContent=`.visual-frame{background:#05080d;overflow:hidden}.visual-frame img{display:block;width:100%;max-width:100%;height:auto;max-height:620px;object-fit:contain;image-rendering:auto}.visual-frame .visual-caption{margin-top:0}.visual-badge{max-width:calc(100% - 28px)}@media(max-width:760px){.visual-frame img{max-height:52vh}.visual-frame{width:100%;min-width:0}}`;document.head.appendChild(style);
window.PI_VISUAL_AUDIT_V14=audit;window.PI_PHOTOS_V14={version:'14.0.0',audit};
})();