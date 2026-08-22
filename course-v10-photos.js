(()=>{
'use strict';
if(window.PI_PHOTOS_V11)return;
const ORDER=['smart_1','smart_2','smart_3','smart_4','dashboard_1','dashboard_2','dashboard_3','dashboard_4','ai_1','ai_2','ai_3','ai_4','cyber_1','cyber_2','cyber_3','cyber_4','home_1','home_2','home_3','home_4','electronics_1','electronics_2','electronics_3','electronics_4','pomodoro_1','pomodoro_2','pomodoro_3','pomodoro_4','glance_1','glance_2','glance_3','glance_4','photo_1','photo_2','photo_3','magic_1','magic_2','magic_3','magic_4','shared_05','shared_06','shared_08','shared_09','shared_10','shared_11','shared_12','detail_06','detail_09','detail_12','dsi_5'];
const INDEX=Object.fromEntries(ORDER.map((k,i)=>[k,i]));
const REF=(src,label,caption,kind='Exact reference')=>({src,label,caption,kind});
const PHOTO=(key,phase,label='Photorealistic build reference')=>({label,kind:'Photorealistic reference',src:`/assets/photo-sprite-v3.jpg#piPhoto=${encodeURIComponent(key)}`,caption:`Build-state reference for “${phase.title}”. Use the written instructions for exact orientation, safety, and commands.`});
const SETUP=[
 REF('/assets/reference/pi5-board.svg?v=11.0.0','Raspberry Pi 5 port map','Identify USB-C power, micro-HDMI, USB, GPIO, MIPI and the underside microSD slot.'),
 REF('/assets/reference/imager-download.svg?v=11.0.0','Raspberry Pi Imager download','Use the official Raspberry Pi software page, install Imager, then open it before choosing storage.'),
 REF('/assets/reference/imager-flow.svg?v=11.0.0','Raspberry Pi Imager workflow','Choose Raspberry Pi 5, Raspberry Pi OS 64-bit Desktop, and only the intended microSD card.'),
 REF('/assets/reference/imager-customize.svg?v=11.0.0','Imager OS customization','Configure hostname, username, Wi-Fi, locale and SSH before writing the card.'),
 REF('/assets/reference/imager-write.svg?v=11.0.0','Write, verify and eject','Write the OS, wait for verification, eject cleanly, then insert the card only while the Pi is powered off.'),
 REF('/assets/reference/first-boot.svg?v=11.0.0','Raspberry Pi OS first boot','Reach the desktop, test input, connect Wi-Fi, and confirm the Pi is stable before continuing.'),
 REF('/assets/reference/software-tools.svg?v=11.0.0','Common Raspberry Pi software tools','Update Raspberry Pi OS and install Git, curl, Python, pip/venv and Chromium.'),
 REF('/assets/reference/health-check.svg?v=11.0.0','Final Pi health check','Verify IP, temperature, storage, SSH, clean shutdown and a true cold boot.')
];
const START={'smart-mirror':'smart_1','dashboard':'dashboard_1','ai-terminal':'ai_1','cyberdeck':'cyber_1','home-panel':'home_1','electronics-lab':'electronics_1','pomodoro':'pomodoro_1','glance':'glance_1','photo-frame':'photo_1','magic-frame':'magic_1'};
const FINISH={'smart-mirror':'smart_4','dashboard':'dashboard_4','ai-terminal':'ai_4','cyberdeck':'cyber_4','home-panel':'home_4','electronics-lab':'electronics_4','pomodoro':'pomodoro_4','glance':'glance_4','photo-frame':'photo_3','magic-frame':'magic_4'};
const PROJECT_RULES={
'smart-mirror':[[/mirror effect/i,'smart_2'],[/dry-fit|frame stack/i,'smart_3'],[/mount the display|black out/i,'smart_3'],[/kiosk|mirror screen/i,'smart_4'],[/close the frame|rear panel/i,'detail_09']],
'dashboard':[[/wireframe|layout/i,'dashboard_2'],[/widget|dashboard/i,'dashboard_3'],[/kiosk|display|final/i,'dashboard_4']],
'ai-terminal':[[/terminal|keyboard|launcher/i,'ai_2'],[/secure|api/i,'ai_3'],[/final|display/i,'ai_4']],
'cyberdeck':[[/mock|layout|mount/i,'cyber_2'],[/airflow|cable|power/i,'cyber_3'],[/launcher|final/i,'cyber_4']],
'home-panel':[[/mount|wall/i,'home_2'],[/dashboard|interface/i,'home_3'],[/kiosk|final/i,'home_4']],
'electronics-lab':[[/breadboard|led/i,'electronics_2'],[/button|sensor|wire/i,'electronics_3'],[/test|final/i,'electronics_4']],
'pomodoro':[[/timer|interface/i,'pomodoro_2'],[/button|led/i,'pomodoro_3'],[/final|focus/i,'pomodoro_4']],
'glance':[[/screen|page|layout/i,'glance_2'],[/rotate|night/i,'glance_3'],[/kiosk|final/i,'glance_4']],
'photo-frame':[[/album|photo|collection/i,'photo_2'],[/viewer|kiosk|final/i,'photo_3']],
'magic-frame':[[/mirror|sleep|wake/i,'magic_2'],[/photo|frame/i,'magic_3'],[/final|mode/i,'magic_4']]
};
function softwareReference(course,phase){
 const t=String(phase.title||'').toLowerCase();
 if(t.includes('install the common raspberry pi software tools')) return REF('/assets/reference/software-tools.svg?v=11.0.0','Common Raspberry Pi software tools','Use this exact Terminal reference instead of a low-resolution project photo.');
 if(t.includes('install magicmirror')) return REF('/assets/reference/magicmirror-install.svg?v=11.0.0','Official MagicMirror² installation','Clone the official MagicMirrorOrg repository, run the supported installer, copy the sample config, then launch MagicMirror² manually.');
 if(t.includes('prepare raspberry pi os')) return REF('/assets/reference/imager-flow.svg?v=11.0.0','Raspberry Pi OS preparation','Use Raspberry Pi Imager, write and verify the card, complete first boot, update the OS, then reboot.');
 if(/software|install|terminal|server|kiosk|home assistant|gpio tools|companion/i.test(t) && (phase.commands||[]).length){return REF(makeSoftwareSvg(course,phase),`${course.title} software reference`,'Scalable command reference generated from this phase’s actual commands and expected results.','Software reference');}
 return null;
}
function makeSoftwareSvg(course,phase){
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));
 const rows=(phase.commands||[]).slice(0,4).map((c,i)=>`<text x="95" y="${235+i*72}" fill="#7ce3b2" font-family="monospace" font-size="18">$ ${esc(c.code).slice(0,86)}</text><text x="95" y="${260+i*72}" fill="#9fb0c5" font-family="Arial" font-size="15">Expected: ${esc(c.result).slice(0,88)}</text>`).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#07101a"/><rect x="30" y="30" width="1140" height="615" rx="28" fill="#0d1824" stroke="#31445c" stroke-width="3"/><text x="70" y="92" fill="#c4b5fd" font-family="Arial" font-size="25" font-weight="700">${esc(course.title)} • Software setup</text><text x="70" y="132" fill="#f8fafc" font-family="Arial" font-size="30" font-weight="700">${esc(phase.title).slice(0,68)}</text><rect x="70" y="165" width="1060" height="390" rx="20" fill="#05090e" stroke="#526981" stroke-width="3"/>${rows}<text x="70" y="610" fill="#d9e4ef" font-family="Arial" font-size="19">Run only the commands shown in this phase. Stop and fix any error before continuing.</text></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function physicalKey(course,phase){const t=String(phase.title||'');if(/lay out, identify, and inspect/i.test(t))return START[course.id];if(/complete final validation|document the build|maintenance/i.test(t))return FINISH[course.id]||'detail_12';for(const [re,key] of (PROJECT_RULES[course.id]||[]))if(re.test(t))return key;return FINISH[course.id]||START[course.id]||null;}
for(const course of (window.PI_COURSES_V2||[])){
 course.phases.forEach((phase,i)=>{
  const v=phase.visual||(phase.visual={});v.photo=null;v.photos=[];
  if(course.id==='pi-setup'){
    const primary=SETUP[i]||SETUP[SETUP.length-1],extra=[];
    if(i===0)extra.push(REF('/assets/pi5-port-map-reference.jpg?v=11.0.0','Original Pi 5 photo reference','Secondary hardware photo. Use the scalable port map above for labels.','Photo reference'));
    if(i===3)extra.push(REF('/assets/setup/imager-ssh-generated.jpg?v=11.0.0','Imager SSH screenshot reference','Secondary screenshot showing the Imager customization/SSH area.','Screenshot reference'));
    if(i===5)extra.push(REF('/assets/boot-screen.jpg?v=11.0.0','First-boot screenshot reference','Secondary boot reference. Use the scalable checklist above for the current workflow.','Screenshot reference'));
    v.photos=[primary,...extra];return;
  }
  const sw=softwareReference(course,phase);if(sw){v.photos=[sw];return;}
  if(/dsi|ribbon|mipi/i.test(phase.title||'')){v.photos=[REF('/assets/reference/dsi-ribbon.svg?v=11.0.0','Exact DSI / MIPI reference','Power off first. Open the latch evenly, align the contacts, insert straight and close evenly.'),REF('/assets/smart-mirror/dsi-align.jpg?v=11.0.0','DSI alignment photo','Match ribbon orientation before insertion.','Photo reference'),REF('/assets/smart-mirror/dsi-seated.jpg?v=11.0.0','DSI fully seated photo','Ribbon inserted evenly with the latch closed.','Photo reference')];return;}
  const k=physicalKey(course,phase);if(k&&INDEX[k]!=null)v.photos=[PHOTO(k,phase)];
 });
}
const style=document.createElement('style');style.id='photo-v11-style';style.textContent=`
.photo-sprite-v11-crop{width:min(100%,400px);aspect-ratio:16/9;background-image:url('/assets/photo-sprite-v3.jpg?v=11.0.0');background-size:500% 1000%;background-repeat:no-repeat;background-color:#05080d;display:block;margin:18px auto;border-radius:12px}
.visual-frame.has-v11-sprite{background:#05080d}.visual-frame.has-v11-sprite .visual-caption{margin-top:0}
.visual-frame img[src*="photo-sprite-v3.jpg#piPhoto="]{opacity:0;position:absolute;pointer-events:none;width:1px!important;height:1px!important}
.visual-frame img:not([src*="photo-sprite-v3.jpg"]){max-width:100%;height:auto;object-fit:contain}
@media(max-width:760px){.photo-sprite-v11-crop{width:min(100%,400px);max-width:100%}.visual-frame{overflow:hidden}}
`;document.head.appendChild(style);
function process(root=document){root.querySelectorAll?.('.visual-frame img[src*="photo-sprite-v3.jpg#piPhoto="]').forEach(img=>{if(img.dataset.v11)return;img.dataset.v11='1';let key='';try{key=decodeURIComponent(new URL(img.src).hash.replace(/^#piPhoto=/,''))}catch(_){return}const idx=INDEX[key];if(idx==null)return;const col=idx%5,row=Math.floor(idx/5);const crop=document.createElement('div');crop.className='photo-sprite-v11-crop';crop.setAttribute('role','img');crop.setAttribute('aria-label',img.alt||'Photorealistic build reference');crop.dataset.photoAsset=key;crop.style.backgroundPosition=`${col*25}% ${row*(100/9)}%`;const frame=img.closest('.visual-frame');if(frame)frame.classList.add('has-v11-sprite');img.replaceWith(crop)})}
process();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)process(n)}).observe(document.documentElement,{subtree:true,childList:true});
window.PI_PHOTOS_V11={version:'11.0.0',assets:ORDER.length,process};
})();