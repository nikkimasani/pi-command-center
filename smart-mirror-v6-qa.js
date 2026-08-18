(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function helpFor(title=''){
  const t=title.toLowerCase();
  if(t.includes('imager')||t.includes('raspberry pi 5')||t.includes('write and verify'))return ['If the expected option is missing, close and reopen Raspberry Pi Imager before changing other settings.','If the microSD card is not listed, reseat the card reader and confirm the computer can see the card.'];
  if(t.includes('microsd'))return ['If the card does not slide in with light pressure, stop and check its orientation. Do not force it.','If the Pi does not boot later, power off and confirm the card is fully seated.'];
  if(t.includes('wi-fi')||t.includes('internet'))return ['If Wi-Fi is disconnected, recheck the SSID, password and Wi-Fi country configured in Imager.','If Wi-Fi connects but pages do not load, test another website before changing MagicMirror settings.'];
  if(t.includes('git')||t.includes('node'))return ['If a version command says command not found, stop here and install that prerequisite before continuing.','Do not continue to MagicMirror until git, node and npm each return a version.'];
  if(t.includes('config.js')||t.includes('clock')||t.includes('weather')||t.includes('calendar'))return ['If MagicMirror reports a configuration error, undo only the last edit and recheck commas, quotes, brackets and braces.','If one module is blank, keep the rest unchanged and troubleshoot only that module first.'];
  if(t.includes('pm2')||t.includes('autostart')||t.includes('reboot'))return ['If MagicMirror does not return after reboot, reconnect over SSH and run pm2 status before reinstalling anything.','If PM2 shows the process stopped or errored, inspect that process first rather than creating duplicate PM2 entries.'];
  if(t.includes('orientation')||t.includes('rotation'))return ['If the screen was already upright, undo unnecessary rotation changes.','If the image rotates but touch does not, treat touch calibration as a separate problem and continue only after both agree.'];
  if(t.includes('touch'))return ['If one corner responds in a different corner, touch coordinates are rotated or mirrored. Correct calibration before mounting.','If touch works intermittently, test again while the display is still loose so cable pressure can be ruled out.'];
  if(t.includes('dry-fit')||t.includes('shadow box'))return ['If the back panel bows or will not sit flat, remove it and reposition components. Never force the enclosure closed.','If the DSI cable needs a sharp fold to reach, change the Pi or display position before applying adhesive.'];
  if(t.includes('iuniker')||t.includes('case'))return ['If a port does not line up with its case opening, stop and recheck Pi orientation before tightening screws.','If the DSI ribbon is trapped by the case, reopen the case and reroute it before power is restored.'];
  if(t.includes('mirror acrylic')||t.includes('clean'))return ['If dust is trapped, remove the acrylic and clean it now rather than accepting it permanently.','Use only acrylic-safe cleaning methods; stop if a cleaner clouds or marks the sheet.'];
  if(t.includes('velcro')||t.includes('center the display')||t.includes('position and secure'))return ['If alignment shifts when pressing the fastener, lift the part and realign it rather than twisting the mounted screen.','Keep adhesive away from controller components, ribbon connectors and ventilation paths.'];
  if(t.includes('cable')||t.includes('dsi'))return ['If the ribbon is twisted, creased or under tension, power off and reroute it before continuing.','If the back panel contacts a connector, move the component instead of relying on pressure to hold it in place.'];
  if(t.includes('power the mirror')||t.includes('closed back'))return ['If the display flickers or goes blank after assembly, power off and inspect cable pressure before changing software.','If the enclosure becomes unusually hot, disconnect power and improve clearance or airflow before extended use.'];
  if(t.includes('brightness')||t.includes('reflection'))return ['If text is hard to read, test typical room lighting and display brightness before changing the physical mirror stack.','If light leaks around the screen, correct the blackout/alignment around the display rather than increasing brightness indefinitely.'];
  if(t.includes('placement')||t.includes('wall'))return ['If the frame feels unstable, choose a different stand or mounting method before powering it in that position.','Keep ventilation and the power-cable exit clear after final placement.'];
  return ['If your result does not match the expected result, stay on this step and recheck only the actions you just completed.','Do not continue by guessing. Restore the last known-good state, then repeat this step once.'];
}
function enhance(){
  if(!document.body.classList.contains('sm6-active'))return;
  const root=q('#sm6Root'); if(!root)return;
  const article=q('.sm6-step',root); if(!article)return;
  if(!q('details.sm6-card',article)){
    const title=q('h1',article)?.textContent||'';
    const trouble=document.createElement('details');
    trouble.className='sm6-card sm6-auto-trouble';
    trouble.innerHTML=`<summary>Troubleshooting this exact step</summary><ul>${helpFor(title).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    const gate=q('.sm6-check',article);
    if(gate)article.insertBefore(trouble,gate);else article.appendChild(trouble);
  }
  const aside=q('.sm6-layout aside',root);
  if(aside&&!q('.sm6-phase-toggle',root)){
    const btn=document.createElement('button');
    btn.className='sm6-phase-toggle sm6-ghost';
    btn.type='button';
    btn.textContent='Phases ▾';
    btn.setAttribute('aria-expanded','false');
    btn.onclick=()=>{const open=aside.classList.toggle('sm6-phase-open');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Hide phases ▴':'Phases ▾';};
    aside.parentNode.insertBefore(btn,aside);
  }
}
const css=document.createElement('style');
css.textContent=`.sm6-phase-toggle{display:none!important}.sm6-auto-trouble summary{cursor:pointer;font-weight:800}@media(max-width:760px){.sm6-phase-toggle{display:block!important;width:100%;margin:8px 0}.sm6-layout aside{display:none!important;white-space:normal!important;overflow:visible!important;flex-wrap:wrap}.sm6-layout aside.sm6-phase-open{display:flex!important}.sm6-layout aside.sm6-phase-open .sm6-phase span{display:inline!important}.sm6-layout aside.sm6-phase-open .sm6-phase{width:100%!important}}`;
document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(enhance)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
setTimeout(enhance,300);
})();
