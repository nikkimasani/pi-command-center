(()=>{
'use strict';
const M={
'cyberdeck/phase-1/step-1.jpg':'Pi, touchscreen and keyboard booted loose on the desk before enclosure work',
'cyberdeck/phase-1/step-2.jpg':'Pi powered from the intended USB-C power bank during stability test',
'cyberdeck/phase-1/step-3.jpg':'Cyberdeck port, cable-bend and ventilation clearance map',
'cyberdeck/phase-2/step-1.jpg':'Display and mini keyboard dry-fit in the intended enclosure positions',
'cyberdeck/phase-2/step-2.jpg':'Pi and power bank dry-fit with service access and open ventilation',
'cyberdeck/phase-2/step-3.jpg':'All cyberdeck cables routed with broad curves and closure slack',
'cyberdeck/phase-3/step-1.jpg':'Display, Pi case and power bank secured without blocked ports or vents',
'cyberdeck/phase-3/step-2.jpg':'Open-case powered cyberdeck test with relaxed cables and temperature check',
'cyberdeck/phase-3/step-3.jpg':'Closed cyberdeck ready for gentle mobility test',
'home-panel/phase-3/step-1.jpg':'Home Assistant panel dry-fit showing power-cable bend radius and open vents',
'home-panel/phase-3/step-2.jpg':'Mounted Home Assistant panel powered on with stable screen and routed cable',
'electronics-lab/phase-1/step-1.jpg':'Pi 5 GPIO header orientation with physical pin 6 GND and physical pin 11 GPIO17 identified',
'electronics-lab/phase-1/step-2.jpg':'Breadboard center gap and connected five-hole groups identified',
'electronics-lab/phase-2/step-1.jpg':'LED polarity and 220–330 ohm resistor placed in series on breadboard',
'electronics-lab/phase-2/step-2.jpg':'Verified GPIO17 to resistor to LED to GND wiring path before power-on',
'electronics-lab/phase-3/step-1.jpg':'Push button straddling breadboard center gap with paired legs identified',
'pomodoro/phase-3/step-1.jpg':'Optional Pomodoro push button wired safely between selected GPIO and GND',
'pomodoro/phase-3/step-2.jpg':'Optional Pomodoro status LED wired through 220–330 ohm resistor to GPIO and GND',
'photo-frame/phase-3/step-2.jpg':'Photo frame dry-fit showing screen, Pi, cable path, ventilation and safe LCD clearance',
'magic-frame/phase-1/step-1.jpg':'Known-good completed Smart Mirror operating normally before extension work',
'magic-frame/phase-3/step-1.jpg':'Optional Magic Mirror Frame sensor or button wired for standalone GPIO input test',
'magic-frame/phase-4/step-1.jpg':'Final sensor, cable and Pi dry-fit with ventilation and display clearance',
'magic-frame/phase-4/step-2.jpg':'Closed Magic Mirror Frame completing normal, reveal, sleep, wake and trigger states'
};
const PROJECT_META={
cyberdeck:{count:9,label:'Portable Cyberdeck'},'home-panel':{count:2,label:'Home Assistant Panel'},'electronics-lab':{count:5,label:'Electronics Lab'},pomodoro:{count:2,label:'Pomodoro Station'},'photo-frame':{count:1,label:'Digital Photo Frame'},'magic-frame':{count:4,label:'Magic Mirror Frame'},dashboard:{count:0,label:'Personal Dashboard'},'ai-terminal':{count:0,label:'Mini AI Terminal'},glance:{count:0,label:'Desk Info Center'}
};
function projectFrom(id){return Object.keys(PROJECT_META).find(k=>id.startsWith(k+'/'))||null}
function bindCourse(){
 if(!document.body.classList.contains('pc6-active'))return;
 document.querySelectorAll('#pc6Root .pc6-photo').forEach(card=>{
   if(card.dataset.manifestV9==='1')return;
   const id=card.querySelector('code')?.textContent?.trim(); if(!id||!M[id])return;
   card.dataset.manifestV9='1';
   const note=document.createElement('div');note.className='pc6-v9-manifest';
   note.innerHTML=`<small>EXACT HARDWARE VISUAL MANIFEST</small><b>${M[id]}</b><p>Status: exact project-state photo required. Until that exact image is attached, keep this step marked PHOTO PENDING. Do not substitute a generic Raspberry Pi, stock setup, or unrelated build photo.</p>`;
   card.appendChild(note);
 });
 document.querySelectorAll('#pc6Root .pc6-screen').forEach(card=>{
   if(card.dataset.manifestV9==='1')return;card.dataset.manifestV9='1';
   const note=document.createElement('small');note.className='pc6-v9-screen';note.textContent='SCREEN WALKTHROUGH: match the controls, state and result. Live values, names and timestamps may differ.';card.appendChild(note);
 });
}
function smartAudit(){
 if(!document.body.classList.contains('sm6-active'))return;
 const root=document.querySelector('#sm6Root')||document.querySelector('.sm6-wrap');if(!root||root.dataset.manifestV9==='1')return;root.dataset.manifestV9='1';
 const cards=[...root.querySelectorAll('.sm6-pending,.sm6-photo-awaiting,.sm6-manifest-photo')];
 const ids=cards.map(c=>c.querySelector('code')?.textContent?.trim()).filter(Boolean);
 const mapped=window.SMART_MIRROR_VISUALS||{};
 const exactReady=Object.keys(mapped).filter(k=>mapped[k]?.src && !String(mapped[k].src).includes('generated')).length;
 const pending=ids.filter(id=>!mapped[id]).length;
 window.SMART_MIRROR_EXACT_VISUAL_AUDIT={mapped:Object.keys(mapped).length,exactReady,pendingVisible:pending,visibleIds:ids};
 const badge=document.createElement('div');badge.className='sm6-v9-audit';badge.innerHTML=`<b>Smart Mirror exact-visual audit</b><span>${Object.keys(mapped).length} mapped manifest entries · ${exactReady} exact/reference assets · ${pending} visible unmapped slots</span><small>Generated diagrams never count as exact hardware photos.</small>`;root.prepend(badge);
}
function publish(){
 const byProject={};for(const [id,desc] of Object.entries(M)){const p=projectFrom(id);(byProject[p]||(byProject[p]=[])).push({id,description:desc,status:'exact-photo-required'});}
 for(const [id,meta] of Object.entries(PROJECT_META)){if(!byProject[id])byProject[id]=[];meta.manifested=byProject[id].length;}
 window.PI_PROJECT_VISUAL_MANIFEST={version:9,hardware:M,projects:byProject,projectMeta:PROJECT_META,softwareRule:'All .png course visuals are screen walkthrough references, not physical-photo claims.'};
}
publish();
const style=document.createElement('style');style.textContent=`.pc6-v9-manifest{margin-top:12px;padding:12px;border:1px solid #715b2d;background:#20190b;border-radius:10px}.pc6-v9-manifest small{display:block;color:#f4c96b;font-size:10px;font-weight:900;letter-spacing:.08em}.pc6-v9-manifest b{display:block;margin:5px 0;color:#fff}.pc6-v9-manifest p{margin:0;color:#c9b98f;line-height:1.5}.pc6-v9-screen{display:block;margin-top:10px;color:#8fb8e8;line-height:1.45}.sm6-v9-audit{display:grid;gap:4px;margin:10px 0 14px;padding:12px;border:1px solid #38566f;border-radius:12px;background:#091724}.sm6-v9-audit b{color:#eef6ff}.sm6-v9-audit span{color:#a8bfd3}.sm6-v9-audit small{color:#7892a9}@media(max-width:520px){.pc6-v9-manifest{padding:10px}.sm6-v9-audit{padding:10px}}`;document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(()=>{bindCourse();smartAudit()})).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setTimeout(()=>{bindCourse();smartAudit()},350);
})();