(()=>{
'use strict';
if(window.PI_PHOTOS_V10)return;
const ORDER=['smart_1','smart_2','smart_3','smart_4','dashboard_1','dashboard_2','dashboard_3','dashboard_4','ai_1','ai_2','ai_3','ai_4','cyber_1','cyber_2','cyber_3','cyber_4','home_1','home_2','home_3','home_4','electronics_1','electronics_2','electronics_3','electronics_4','pomodoro_1','pomodoro_2','pomodoro_3','pomodoro_4','glance_1','glance_2','glance_3','glance_4','photo_1','photo_2','photo_3','magic_1','magic_2','magic_3','magic_4','shared_05','shared_06','shared_08','shared_09','shared_10','shared_11','shared_12','detail_06','detail_09','detail_12','dsi_5'];
const INDEX=Object.fromEntries(ORDER.map((k,i)=>[k,i]));
const MAP={
'smart-mirror':['smart_1','shared_05','smart_4','smart_3','smart_3','dsi_5','smart_4','detail_09','smart_4','detail_09'],
'dashboard':['dashboard_1','dashboard_2','dashboard_3','dashboard_4','dashboard_4','dashboard_4','dashboard_4','dashboard_4','detail_12'],
'ai-terminal':['ai_1','shared_05','ai_4','ai_4','ai_3','ai_3','ai_2','ai_4','ai_1'],
'cyberdeck':['cyber_1','shared_05','detail_12','cyber_1','cyber_2','cyber_2','cyber_4','cyber_4','cyber_2'],
'home-panel':['home_1','shared_05','home_3','home_4','home_2','home_4','home_4','home_4','detail_09'],
'electronics-lab':['electronics_1','shared_05','electronics_1','electronics_2','electronics_4','electronics_4','shared_08','shared_08','shared_08'],
'pomodoro':['pomodoro_1','shared_05','pomodoro_3','pomodoro_3','pomodoro_4','pomodoro_2','electronics_4','shared_11','shared_11'],
'glance':['glance_1','shared_05','glance_3','glance_4','glance_3','glance_4','glance_4','glance_2'],
'photo-frame':['photo_1','shared_05','shared_12','photo_3','photo_3','shared_12','photo_3','shared_12','photo_2'],
'magic-frame':['magic_1','shared_05','magic_4','magic_3','magic_4','magic_4','magic_2','magic_4','magic_1']
};
const makePhoto=(key,phase,label='Photorealistic step reference')=>({label,src:`/assets/photo-sprite-v3.jpg#piPhoto=${encodeURIComponent(key)}`,caption:`Visual reference for “${phase.title}”. Follow the written instructions for exact orientation, safety, and commands.`});
for(const course of (window.PI_COURSES_V2||[])){
 course.phases.forEach((phase,i)=>{
  const v=phase.visual||(phase.visual={});
  const exact=[];
  if(Array.isArray(v.photos)) for(const p of v.photos){if(p&&p.src&&/\.svg(?:\?|$)/.test(p.src)) exact.push(p)}
  if(v.photo&&/\.svg(?:\?|$)/.test(v.photo)) exact.push({label:'Exact technical reference',src:v.photo,caption:v.caption||phase.title});
  v.photo=null;v.photos=[];
  if(course.id==='pi-setup'){
   if(i===0){v.photos=[{label:'Exact Raspberry Pi 5 port map',src:'/assets/reference/pi5-board.svg?v=10.0.1',caption:'Use this sharp Pi 5 reference to identify power, micro-HDMI, USB, GPIO, MIPI and microSD locations.'}];return}
   if(i===2||i===3||i===4){v.photos=[{label:'Exact Raspberry Pi Imager workflow',src:'/assets/reference/imager-flow.svg?v=10.0.1',caption:'Use this sharp workflow for device, OS, storage and customization selections.'}];return}
   const setupKeys=['shared_05','shared_05','dashboard_2','dashboard_2','shared_05','shared_06','detail_12','detail_12'];
   const k=setupKeys[i];if(k)v.photos=[makePhoto(k,phase)];return;
  }
  if(/dsi|ribbon|mipi/i.test(phase.title||'')){
   v.photos=[makePhoto('dsi_5',phase,'DSI close-up'),{label:'Exact DSI safety reference',src:'/assets/reference/dsi-ribbon.svg?v=10.0.1',caption:'Use this exact DSI/MIPI reference for latch and contact orientation.'}];return;
  }
  const keys=MAP[course.id]; const k=keys&&keys[i];
  if(k&&INDEX[k]!=null)v.photos=[makePhoto(k,phase),...exact]; else if(exact.length)v.photos=exact;
 });
}
const style=document.createElement('style');style.id='photo-v10-style';style.textContent=`
.photo-sprite-v10-crop{width:min(100%,320px);aspect-ratio:16/9;background-image:url('/assets/photo-sprite-v3.jpg?v=10.0.1');background-size:500% 1000%;background-repeat:no-repeat;background-color:#05080d;display:block;margin:0 auto;border-radius:12px}
.visual-frame img[src*="photo-sprite-v3.jpg#piPhoto="]{opacity:0;position:absolute;pointer-events:none;width:1px!important;height:1px!important}
.visual-frame img:not([src*="photo-sprite-v3.jpg"]){max-width:100%;height:auto;object-fit:contain}
@media(max-width:760px){.photo-sprite-v10-crop{width:min(100%,300px)}.visual-frame{overflow:hidden}}
`;document.head.appendChild(style);
function process(root=document){root.querySelectorAll?.('.visual-frame img[src*="photo-sprite-v3.jpg#piPhoto="]').forEach(img=>{if(img.dataset.v10)return;img.dataset.v10='1';let key='';try{key=decodeURIComponent(new URL(img.src).hash.replace(/^#piPhoto=/,''))}catch(_){return}const idx=INDEX[key];if(idx==null)return;const col=idx%5,row=Math.floor(idx/5);const crop=document.createElement('div');crop.className='photo-sprite-v10-crop';crop.setAttribute('role','img');crop.setAttribute('aria-label',img.alt||'Photorealistic step reference');crop.dataset.photoAsset=key;crop.style.backgroundPosition=`${col*25}% ${row*(100/9)}%`;img.replaceWith(crop)})}
process();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)process(n)}).observe(document.documentElement,{subtree:true,childList:true});
window.PI_PHOTOS_V10={version:'10.0.1',assets:ORDER.length,process};
})();