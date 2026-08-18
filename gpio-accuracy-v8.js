(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
function apply(){
 const root=q('#pcRoot'); if(!root) return;
 const project=q('.pc-rail h3',root)?.textContent?.trim()||'';
 const action=q('.pc-layout main > h1',root)?.textContent?.trim()||'';
 if(project!=='Electronics Lab') return;
 if(q('.gpio-v8',root)) return;
 const target=q('.pc-target',root)||q('.pc-layout main > h1',root); if(!target)return;
 let html='';
 if(/LED|breadboard|GPIO|resistor|button/i.test(action)) html=`<aside class="gpio-v8"><strong>GPIO SAFETY CHECK</strong><ol><li>Shut the Pi down and unplug USB-C power before moving jumper wires.</li><li>Use the 40-pin header. GPIO17 is BCM GPIO17, physical pin 11.</li><li>Put a 220–330 Ω resistor in series with the LED. Never connect an LED directly from GPIO to GND.</li><li>LED long leg is the anode. Short leg and flat edge identify the cathode side.</li><li>Use a GND pin for the return path. Do not substitute a 5 V pin.</li><li>After wiring, compare every row and pin before restoring power.</li></ol><p>On Raspberry Pi 5, user-facing GPIO signals are 3.3 V. The app will use GPIO Zero for beginner Python examples rather than obsolete low-level tutorials.</p></aside>`;
 if(html) target.insertAdjacentHTML('afterend',html);
}
const css=document.createElement('style');css.textContent=`.gpio-v8{margin:14px 0;padding:16px;border:1px solid #38526f;border-radius:14px;background:#0a1522;color:#dbe9f8}.gpio-v8 strong{color:#91c9ff;font-size:12px;letter-spacing:.08em}.gpio-v8 ol{padding-left:22px;line-height:1.65}.gpio-v8 p{margin:10px 0 0;color:#a9bdd2;line-height:1.55}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,300);
})();