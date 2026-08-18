(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
function apply(){
 const root=q('#pcRoot'); if(!root)return;
 const project=q('.pc-rail h3',root)?.textContent?.trim()||'';
 const action=q('.pc-layout main > h1',root)?.textContent?.trim()||'';
 if(project!=='Smart Mirror')return;
 if(!/DSI|display cable|ribbon/i.test(action))return;
 const anchor=q('.pc-target',root)||q('.pc-layout main > h1',root); if(!anchor)return;
 let card=q('.hw-accuracy',root);
 if(!card){card=document.createElement('section');card.className='hw-accuracy';anchor.insertAdjacentElement('afterend',card);}
 card.innerHTML=`<div class="hw-title">Pi 5 cable check</div><div class="hw-grid"><div><b>Pi 5 end</b><span>Use the smaller 22-way end in a CAM/DISP connector.</span></div><div><b>7-inch display end</b><span>Use the larger 15-way end in the display connector.</span></div><div><b>Pi contact direction</b><span>Metal contacts face toward the Ethernet and USB-A ports.</span></div><div><b>Display contact direction</b><span>Metal contacts face upward, away from the display.</span></div></div><p><strong>Power must be disconnected first.</strong> Open both retaining clips, insert the FFC straight and fully, then close both clips. Never force the cable or crease it.</p>`;
}
const css=document.createElement('style');css.textContent=`.hw-accuracy{margin:14px 0;padding:16px;border:1px solid #2d4867;border-radius:14px;background:#09131f;color:#dce8f5}.hw-title{font-weight:900;color:#8fc8ff;margin-bottom:10px}.hw-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hw-grid>div{padding:10px;border:1px solid #20344a;border-radius:10px;background:#0c1826}.hw-grid b,.hw-grid span{display:block}.hw-grid b{font-size:12px;color:#fff;margin-bottom:4px}.hw-grid span,.hw-accuracy p{font-size:12px;line-height:1.5;color:#afc1d4}.hw-accuracy p{margin:10px 0 0}.hw-accuracy strong{color:#ffd887}@media(max-width:600px){.hw-grid{grid-template-columns:1fr}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,300);
})();