(()=>{
'use strict';
const courses=window.PI_COURSES_V2||[];
for(const course of courses){for(const phase of course.phases||[]){if(Array.isArray(phase.warning)&&phase.warning.length===0)phase.warning='';if(phase.warning==null)phase.warning='';if(!Array.isArray(phase.trouble))phase.trouble=[];if(!Array.isArray(phase.commands))phase.commands=[];}}
const exactReference=(phase)=>{
 const t=String(phase?.title||'').toLowerCase();
 if(t.includes('prepare raspberry pi os')) return {src:'/assets/reference/imager-flow.svg',label:'Raspberry Pi OS setup map',caption:'Raspberry Pi Imager, microSD, first boot, update, and verification flow.'};
 if(t.includes('dsi ribbon')) return {src:'/assets/reference/dsi-ribbon.svg',label:'DSI ribbon reference',caption:'Power off first, open the latch evenly, align the ribbon, insert straight, and close the latch evenly.'};
 if(t.includes('gpio')||t.includes('breadboard')) return {src:'/assets/reference/pi5-board.svg',label:'Raspberry Pi hardware reference',caption:'Use the written GPIO pin numbers and wiring instructions below. Never infer pin numbers from board position alone.'};
 return null;
};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function currentPhase(){const ct=document.querySelector('#courseView .course-title h1')?.textContent?.trim();const pt=document.querySelector('#courseView .step-head h1')?.textContent?.trim();if(!ct||!pt)return null;const c=courses.find(x=>x.title===ct);return c?.phases?.find(x=>x.title===pt)||null;}
function cleanVisual(){const frame=document.querySelector('#courseView .visual-frame');if(!frame||frame.dataset.visualClean==='5')return;const phase=currentPhase();if(!phase)return;frame.dataset.visualClean='5';const ref=exactReference(phase);if(ref){frame.innerHTML=`<span class="visual-badge">EXACT REFERENCE</span><img class="v5-exact-reference" src="${ref.src}" alt="${esc(ref.label)}"><div class="visual-caption"><strong>${esc(ref.label)}</strong><br>${esc(ref.caption)}</div>`;return;}
 const actions=(phase.actions||[]).slice(0,4);const success=(phase.success||[]).slice(0,2);frame.innerHTML=`<div class="v5-map"><div class="v5-map-head"><span>STEP INSTRUCTION MAP</span><strong>${esc(phase.title)}</strong><p>This replaces the old repeated or blurry placeholder image. Follow the exact actions below.</p></div><div class="v5-map-flow">${actions.map((a,i)=>`<div class="v5-map-step"><b>${i+1}</b><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join('')}</div>${success.length?`<div class="v5-map-success"><b>Before you continue</b>${success.map(x=>`<span>✓ ${esc(x)}</span>`).join('')}</div>`:''}</div>`;}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanVisual();});};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.PI_COURSES_V2_PATCH='5.0.0';
})();