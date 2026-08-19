(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const DEFAULTS={
  dashboard:['Reload the page once and confirm the same card or control still appears.','Check the browser console for the first error before changing code.','Re-test at 1024×600 and remove any horizontal overflow before continuing.'],
  'ai-terminal':['Confirm the browser never receives or renders an API secret.','Check the network request status and response body before retrying.','Return to the last known-good mock response if the live request fails.'],
  cyberdeck:['Power the Pi off before reseating a connector or moving a mounted part.','Re-open the case and inspect cable strain, blocked vents and connector alignment.','Test the affected component loose on the desk before changing the enclosure layout.'],
  'home-panel':['Confirm Home Assistant works from a normal browser before troubleshooting the Pi.','Check Wi-Fi and the Home Assistant URL, then retry the same control once.','Exit kiosk mode and reproduce the issue in a normal Chromium window.'],
  'electronics-lab':['Remove USB-C power before touching any jumper wire.','Trace the circuit from GPIO to component to GND and verify the physical pin numbers.','Check LED polarity, resistor placement and breadboard row continuity before restoring power.'],
  pomodoro:['Reset to a short development duration and reproduce the state change.','Confirm only one countdown interval is active.','Reload the page and test Start, Pause and Reset before reconnecting GPIO hardware.'],
  glance:['Test each data source separately so one failing card does not hide the root cause.','Check the browser console and network request for the first failed source.','Replace live data with a placeholder value to confirm the layout itself is still healthy.'],
  'photo-frame':['Confirm the image path works directly in the browser.','Test one known-good JPG or PNG before changing slideshow logic.','Check portrait and landscape images separately to isolate object-fit or sizing problems.'],
  'magic-frame':['Return to the proven Smart Mirror state before debugging the new behavior.','Test the software state switch without the physical trigger.','If GPIO is involved, disconnect the new input and verify the base mirror still works normally.']
};
function projectId(){try{return JSON.parse(localStorage.getItem('pi-last-v4')||'null')?.id||''}catch{return''}}
function addTrouble(){
  if(!document.body.classList.contains('pc6-active'))return;
  const step=q('#pc6Root .pc6-step');if(!step)return;
  const details=qa('#pc6Root details.pc6-card').find(x=>x.querySelector('summary')?.textContent?.trim()==='Troubleshooting');
  if(!details||details.dataset.hardened==='1')return;
  details.dataset.hardened='1';
  const hasSpecific=!!details.querySelector('ul li');
  if(hasSpecific)return;
  const tips=DEFAULTS[projectId()]||['Undo only the last change.','Reproduce the problem once and read the first meaningful error.','Change one variable at a time, then compare the result with Expected Result.'];
  details.innerHTML=`<summary>Troubleshooting</summary><ul>${tips.map(t=>`<li>${t}</li>`).join('')}</ul>`;
}
function hardenCopy(){
  qa('#pc6Root [data-copy]').forEach(btn=>{
    if(btn.dataset.copyHardened==='1')return;btn.dataset.copyHardened='1';
    btn.type='button';btn.setAttribute('aria-label','Copy command to clipboard');
    btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
  });
}
function hardenControls(){
  qa('#pc6Root button,#pc6Root input,#pc6Root textarea').forEach(el=>{if(!el.getAttribute('aria-label')&&!el.textContent?.trim()){const ph=el.getAttribute('placeholder');if(ph)el.setAttribute('aria-label',ph)}});
  const check=q('#pc6Check');if(check)check.setAttribute('aria-label','I verified this step');
  const note=q('#pc6Note');if(note)note.setAttribute('aria-label','Optional notes for this step');
}
function addSafetyBanner(){
  if(!document.body.classList.contains('pc6-active'))return;
  const step=q('#pc6Root .pc6-step');if(!step||step.querySelector('.pc6-hardening-safety'))return;
  const id=projectId(),hardware=!!step.querySelector('.pc6-photo');
  if(!hardware)return;
  const banner=document.createElement('div');banner.className='pc6-hardening-safety';
  banner.innerHTML=`<b>Hardware safety</b><span>${id==='electronics-lab'?'Remove USB-C power before changing wiring. Verify the physical GPIO pin before reconnecting power.':'Power the Pi off before moving connectors, cables or mounted parts unless this step explicitly requires a powered test.'}</span>`;
  const why=step.querySelector('.pc6-why');why?.insertAdjacentElement('afterend',banner);
}
function audit(){
  if(!document.body.classList.contains('pc6-active'))return;
  const step=q('#pc6Root .pc6-step');if(!step)return;
  const actions=qa('.pc6-actions li',step).length,expected=!!q('.pc6-expected p',step)?.textContent.trim(),visual=!!q('.pc6-screen,.pc6-photo,.pc7-visual',step),verify=!!q('#pc6Check',step);
  step.dataset.qa=actions>=4&&expected&&visual&&verify?'pass':'review';
}
function run(){addTrouble();hardenCopy();hardenControls();addSafetyBanner();audit()}
const style=document.createElement('style');style.textContent=`.pc6-hardening-safety{display:grid;gap:4px;margin:12px 0;padding:12px 14px;border:1px solid #6e5724;border-radius:12px;background:#241b08;color:#f7d98a}.pc6-hardening-safety b{font-size:12px;text-transform:uppercase;letter-spacing:.06em}.pc6-hardening-safety span{color:#eadcae;line-height:1.45}.pc6-step[data-qa="review"]{outline:1px solid rgba(255,180,80,.22)}@media(max-width:520px){#pc6Root{padding:8px}.pc6-step,.pc6-card,.pc6-phase{padding:13px}.pc6-nav{position:sticky;bottom:0;background:#09131f;padding:10px 0;z-index:5}.pc6-nav button{min-height:48px}.pc6-command{grid-template-columns:1fr}.pc6-command button{min-height:44px}.pc6-rail button{min-width:150px}.pc6-actions{padding-left:0}}`;document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(run)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setTimeout(run,300);
})();