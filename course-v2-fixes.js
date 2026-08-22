(()=>{
'use strict';
const courses=window.PI_COURSES_V2||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const exactReference=(phase)=>{
 const t=String(phase?.title||'').toLowerCase();
 if(t.includes('prepare raspberry pi os')) return {src:'/assets/reference/imager-flow.svg',label:'Raspberry Pi OS setup',caption:'Exact workflow: Raspberry Pi Imager, microSD write and verify, first boot, update, network check, then reboot.'};
 if(t.includes('dsi ribbon')) return {src:'/assets/reference/dsi-ribbon.svg',label:'DSI / MIPI ribbon connection',caption:'Power off first. Open the latch evenly, align the contact side for the exact connector, insert straight, close evenly, and keep a gentle cable curve.'};
 if(t.includes('gpio')||t.includes('breadboard')||t.includes('led circuit')||t.includes('button circuit')) return {src:'/assets/reference/pi5-board.svg',label:'Raspberry Pi 5 GPIO reference',caption:'Use the physical pin numbers stated in the written step. Bare GPIO uses 3.3 V logic. Never infer pins from image position alone.'};
 return null;
};
for(const course of courses){
 for(const phase of course.phases||[]){
  if(Array.isArray(phase.warning)&&phase.warning.length===0)phase.warning='';
  if(phase.warning==null)phase.warning='';
  if(!Array.isArray(phase.trouble))phase.trouble=[];
  if(!Array.isArray(phase.commands))phase.commands=[];
  const v=phase.visual||(phase.visual={scene:'guide',caption:''});
  /* Remove every inherited JPEG / generated-photo assignment. A visual is allowed only when it is exact. */
  v.photo=null;v.photos=[];
  const ref=exactReference(phase);
  if(ref){v.photo=ref.src;v.caption=ref.caption;v.photos=[{label:ref.label,src:ref.src,caption:ref.caption}];}
 }
}
function currentPhase(){
 const ct=document.querySelector('#courseView .course-title h1')?.textContent?.trim();
 const pt=document.querySelector('#courseView .step-head h1')?.textContent?.trim();
 if(!ct||!pt)return null;
 const c=courses.find(x=>x.title===ct);return c?.phases?.find(x=>x.title===pt)||null;
}
function replaceVisual(){
 const frame=document.querySelector('#courseView .visual-frame');
 if(!frame)return;
 const phase=currentPhase();if(!phase)return;
 const signature=`7:${phase.title}`;if(frame.dataset.visualClean===signature)return;
 frame.dataset.visualClean=signature;
 const ref=exactReference(phase);
 if(ref){
  frame.innerHTML=`<span class="visual-badge">EXACT REFERENCE</span><img class="v5-exact-reference" src="${esc(ref.src)}" alt="${esc(ref.label)}"><div class="visual-caption"><strong>${esc(ref.label)}</strong><br>${esc(ref.caption)}</div>`;
  return;
 }
 const actions=(phase.actions||[]).slice(0,5),success=(phase.success||[]).slice(0,3);
 frame.innerHTML=`<div class="v5-map"><div class="v5-map-head"><span>PHASE-SPECIFIC GUIDE</span><strong>${esc(phase.title)}</strong><p>No photo is shown here because the available image library does not contain an exact match. This diagram is generated from this phase only, so it will not pretend an unrelated image is the correct hardware state.</p></div><div class="v5-map-flow">${actions.map((a,i)=>`<div class="v5-map-step"><b>${i+1}</b><div><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></div></div>`).join('')}</div>${success.length?`<div class="v5-map-success"><b>Before you continue</b>${success.map(x=>`<span>✓ ${esc(x)}</span>`).join('')}</div>`:''}</div>`;
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;replaceVisual();});};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.PI_COURSES_V2_PATCH='7.0.0';
})();