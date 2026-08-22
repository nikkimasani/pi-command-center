(()=>{
'use strict';
if(window.PI_PHOTOS_V10)return;
const ORDER=['ai_1','ai_2','ai_3','ai_4','cyber_1','cyber_2','cyber_3','cyber_4','dashboard_1','dashboard_2','dashboard_3','dashboard_4','detail_01','detail_02','detail_03','detail_04','detail_05','detail_06','detail_07','detail_08','detail_09','detail_10','detail_11','detail_12','detail_13','detail_14','detail_15','dsi_1','dsi_2','dsi_3','dsi_4','dsi_5','electronics_1','electronics_2','electronics_3','electronics_4','glance_1','glance_2','glance_3','glance_4','home_1','home_2','home_3','home_4','magic_1','magic_2','magic_3','magic_4','photo_1','photo_2','photo_3','pomodoro_1','pomodoro_2','pomodoro_3','pomodoro_4','shared_01','shared_02','shared_03','shared_04','shared_05','shared_06','shared_07','shared_08','shared_09','shared_10','shared_11','shared_12','smart_1','smart_2','smart_3','smart_4'];
const INDEX=Object.fromEntries(ORDER.map((k,i)=>[k,i]));
const POOLS={
 'smart-mirror':['smart_1','smart_2','smart_3','smart_4','detail_09','dsi_1','dsi_2','dsi_3','dsi_4','dsi_5','shared_07','magic_3','magic_4','detail_11','detail_12','shared_05','shared_06'],
 'dashboard':['dashboard_1','dashboard_2','dashboard_3','dashboard_4','detail_04','detail_14','shared_10','detail_01','glance_3','glance_4','shared_05','detail_15','shared_01'],
 'ai-terminal':['ai_1','ai_2','ai_3','ai_4','detail_02','detail_05','detail_12','shared_06','cyber_4','shared_05','shared_01','detail_15'],
 'cyberdeck':['cyber_1','cyber_2','cyber_3','cyber_4','detail_02','detail_05','detail_06','detail_12','shared_04','shared_09','shared_01','shared_02'],
 'home-panel':['home_1','home_2','home_3','home_4','detail_04','detail_14','shared_10','detail_11','glance_1','shared_05','shared_01','detail_15'],
 'electronics-lab':['electronics_1','electronics_2','electronics_3','electronics_4','detail_03','detail_08','detail_13','shared_08','ai_3','detail_15','shared_01','detail_07'],
 'pomodoro':['pomodoro_1','pomodoro_2','pomodoro_3','pomodoro_4','shared_11','detail_01','glance_1','shared_05','detail_15','shared_01','dashboard_1'],
 'glance':['glance_1','glance_2','glance_3','glance_4','dashboard_3','dashboard_4','detail_01','shared_05','detail_15','shared_01','home_1'],
 'photo-frame':['photo_1','photo_2','photo_3','shared_12','detail_09','shared_03','shared_05','detail_15','shared_01','glance_2','detail_11'],
 'magic-frame':['magic_1','magic_2','magic_3','magic_4','shared_07','photo_3','shared_12','dsi_2','detail_09','shared_05','detail_15','shared_01']
};
const INVENTORY={'smart-mirror':'smart_1','dashboard':'dashboard_1','ai-terminal':'ai_1','cyberdeck':'cyber_1','home-panel':'home_1','electronics-lab':'electronics_1','pomodoro':'pomodoro_1','glance':'glance_1','photo-frame':'photo_1','magic-frame':'magic_1'};
const FINAL={'smart-mirror':'smart_4','dashboard':'dashboard_4','ai-terminal':'ai_4','cyberdeck':'cyber_4','home-panel':'home_4','electronics-lab':'electronics_4','pomodoro':'pomodoro_4','glance':'glance_4','photo-frame':'photo_3','magic-frame':'magic_4'};
const SOFTWARE={'smart-mirror':'shared_07','dashboard':'dashboard_4','ai-terminal':'ai_4','cyberdeck':'cyber_3','home-panel':'home_4','electronics-lab':'electronics_3','pomodoro':'pomodoro_3','glance':'glance_4','photo-frame':'photo_3','magic-frame':'magic_4'};
const SETUP={1:'shared_01',2:'dashboard_2',4:'shared_02',5:'shared_05',6:'shared_06',7:'detail_15'};
const url=k=>`/assets/photo-atlas-v10.webp#piPhoto=${encodeURIComponent(k)}`;
function photo(k,phase,label='Photorealistic build reference'){return {label,src:url(k),caption:`Visual reference for “${phase.title}”. Follow the written step for exact safety, orientation, and commands.`}}
function choose(course,phase,i){
 const t=(phase.title||'').toLowerCase();
 if(course.id==='pi-setup')return SETUP[i]||null;
 if(/dsi|ribbon|mipi/.test(t))return 'dsi_3';
 if(/lay out|inventory|identify|inspect every part/.test(t))return INVENTORY[course.id]||null;
 if(/final validation|finished|cold.boot|maintenance|document the build/.test(t))return FINAL[course.id]||null;
 if(/install|software|terminal|magicmirror|home assistant|companion/.test(t))return SOFTWARE[course.id]||null;
 const pool=POOLS[course.id]||[];return pool[i%pool.length]||null;
}
for(const course of (window.PI_COURSES_V2||[])){
 course.phases.forEach((phase,i)=>{
  const v=phase.visual||(phase.visual={});
  const old=[];
  if(Array.isArray(v.photos))for(const p of v.photos){if(p&&p.src&&/\.svg(?:\?|$)/.test(p.src))old.push(p)}
  if(v.photo&&/\.svg(?:\?|$)/.test(v.photo))old.push({label:'Exact technical reference',src:v.photo,caption:v.caption||phase.title});
  v.photo=null;v.photos=[];
  if(course.id==='pi-setup'&&i===0){v.photos=[{label:'Exact Pi 5 port reference',src:'/assets/reference/pi5-board.svg?v=10.0.0',caption:'Use this exact board reference to identify Pi 5 power, micro-HDMI, USB, GPIO, MIPI and microSD locations.'}];return}
  if(course.id==='pi-setup'&&i===3){v.photos=[{label:'Exact Imager workflow',src:'/assets/reference/imager-flow.svg?v=10.0.0',caption:'Use this sharp workflow while configuring username, Wi-Fi, hostname, locale and SSH.'}];return}
  if(/dsi|ribbon|mipi/i.test(phase.title||'')){
    v.photos=['dsi_1','dsi_2','dsi_3','dsi_4','dsi_5'].map((k,n)=>photo(k,phase,`DSI close-up ${n+1}`));
    v.photos.push({label:'Exact DSI safety reference',src:'/assets/reference/dsi-ribbon.svg?v=10.0.0',caption:'Use the exact DSI/MIPI reference for latch and contact-orientation safety.'});return;
  }
  const k=choose(course,phase,i);
  if(k)v.photos=[photo(k,phase),...old]; else if(old.length)v.photos=old;
 });
}
const style=document.createElement('style');style.id='photo-v10-style';style.textContent=`
.photo-atlas-v10-crop{width:min(100%,420px);aspect-ratio:16/9;background-image:url('/assets/photo-atlas-v10.webp?v=10.0.0');background-size:600% 1200%;background-repeat:no-repeat;background-color:#05080d;display:block;margin:0 auto;border-radius:12px;image-rendering:auto}
.visual-frame img[src*="photo-atlas-v10.webp#piPhoto="]{opacity:0;position:absolute;pointer-events:none;width:1px!important;height:1px!important}
@media(max-width:760px){.photo-atlas-v10-crop{width:min(100%,400px)}.visual-frame{overflow:hidden}.visual-frame>div:first-child{max-width:100%}}
`;document.head.appendChild(style);
function process(root=document){root.querySelectorAll?.('.visual-frame img[src*="photo-atlas-v10.webp#piPhoto="]').forEach(img=>{if(img.dataset.v10)return;img.dataset.v10='1';let key='';try{key=decodeURIComponent(new URL(img.src).hash.replace(/^#piPhoto=/,''))}catch(_){return}const idx=INDEX[key];if(idx==null)return;const col=idx%6,row=Math.floor(idx/6);const crop=document.createElement('div');crop.className='photo-atlas-v10-crop';crop.setAttribute('role','img');crop.setAttribute('aria-label',img.alt||'Photorealistic build reference');crop.dataset.photoAsset=key;crop.style.backgroundPosition=`${col*20}% ${row*(100/11)}%`;img.replaceWith(crop)})}
process();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)process(n)}).observe(document.documentElement,{subtree:true,childList:true});
window.PI_PHOTOS_V10={version:'10.0.0',assets:ORDER.length,process};
})();