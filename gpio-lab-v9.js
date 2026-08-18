(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
function apply(){
 const root=q('#pcRoot');if(!root)return;
 const project=q('.pc-rail h3',root)?.textContent?.trim()||'';
 const action=q('.pc-layout main > h1',root)?.textContent?.trim()||'';
 if(!/Electronics Lab/i.test(project)||!/GPIO|LED|breadboard|resistor|blink/i.test(action))return;
 const anchor=q('.pc-target',root)||q('.pc-layout main > h1',root);if(!anchor)return;
 let card=q('.gpio-lab-v9',root);
 if(!card){card=document.createElement('section');card.className='gpio-lab-v9';anchor.insertAdjacentElement('afterend',card)}
 card.innerHTML=`<div class="gl-head"><strong>GPIO17 LED build check</strong><span>VERIFY BEFORE POWER</span></div><ol><li><b>Shut down and unplug the Pi.</b> Do not move GPIO wiring while powered.</li><li><b>Find GPIO17.</b> It is BCM GPIO17, physical header pin 11. Do not count “17” as the physical pin number.</li><li><b>Wire the output path.</b> GPIO17 → 220–330 Ω resistor → LED anode, the longer leg.</li><li><b>Wire the return path.</b> LED cathode, the shorter leg and flat-side lead, → GND.</li><li><b>Trace every connection once.</b> Confirm there is no direct GPIO-to-GND short and no 5 V connection in the LED signal path.</li><li><b>Restore power and test.</b> Run the GPIO Zero LED example. The LED should alternate on and off about once per second.</li></ol><div class="gl-result"><b>Expected result</b><span>LED blinks steadily. If it stays dark, power down before checking LED polarity, resistor placement, GPIO17 pin selection, and GND.</span></div>`;
}
const css=document.createElement('style');css.textContent=`.gpio-lab-v9{margin:14px 0;padding:16px;border:1px solid #315944;border-radius:14px;background:#091710;color:#dcebe3}.gl-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.gl-head strong{color:#a9f0c9}.gl-head span{font-size:9px;font-weight:900;letter-spacing:.08em;padding:5px 7px;border-radius:999px;background:#173523;color:#b9f7d4;border:1px solid #356b4d}.gpio-lab-v9 ol{margin:0;padding-left:22px}.gpio-lab-v9 li{margin:8px 0;font-size:12px;line-height:1.55;color:#bed1c6}.gpio-lab-v9 b{color:#fff}.gl-result{margin-top:12px;padding:11px;border-radius:10px;background:#0d2117;border:1px solid #274c38}.gl-result b,.gl-result span{display:block}.gl-result span{margin-top:4px;font-size:12px;line-height:1.5;color:#bed1c6}@media(max-width:600px){.gl-head{align-items:flex-start;flex-direction:column}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,300);
})();