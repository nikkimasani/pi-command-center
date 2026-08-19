(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const NOW=()=>new Date().toISOString();
const state={startedAt:NOW(),runs:0,lastRun:null,project:'',step:'',checks:{},issues:[],visuals:{exact:0,generated:0,pending:0,total:0},mobile:{overflow:[]},pwa:{serviceWorker:'unknown',controller:false,displayMode:'browser'}};
function projectId(){try{return JSON.parse(localStorage.getItem('pi-last-v4')||'null')?.id||''}catch{return''}}
function text(el){return el?.textContent?.replace(/\s+/g,' ').trim()||''}
function issue(code,msg,severity='review'){state.issues.push({code,msg,severity,at:NOW()})}
function uniqueIssues(){const seen=new Set();state.issues=state.issues.filter(x=>{const k=x.code+'|'+x.msg;if(seen.has(k))return false;seen.add(k);return true})}
function auditStep(){
 const root=q('#pc6Root .pc6-step');if(!root)return;
 const title=text(q('h1',root))||text(q('h2',root))||'Current step';
 state.project=projectId();state.step=title;
 const actions=qa('.pc6-actions li',root).filter(x=>text(x)).length;
 const expected=text(q('.pc6-expected p',root));
 const trouble=qa('details.pc6-card',root).find(x=>text(q('summary',x))==='Troubleshooting');
 const tips=trouble?qa('li',trouble).filter(x=>text(x)).length:0;
 const verify=!!q('#pc6Check',root);
 const note=!!q('#pc6Note',root);
 const commandBlocks=qa('.pc6-command',root);
 const copyButtons=qa('[data-copy]',root);
 const visual=q('.pc8-visual,.pc6-screen,.pc6-photo,.pc7-visual',root);
 const visualExact=!!q('.pc8-exact',root);
 const visualGenerated=!!q('.pc8-generated',root);
 const visualPending=visualGenerated&&/PHOTO PENDING/i.test(text(visual));
 state.checks={actions:actions>=4,expected:!!expected,troubleshooting:tips>=1,verification:verify,notes:note,visual:!!visual,copy:commandBlocks.length===0||copyButtons.length>=commandBlocks.length};
 if(actions<4)issue('actions',`${title}: only ${actions} concrete actions found.`,'blocker');
 if(!expected)issue('expected',`${title}: expected result is missing.`,'blocker');
 if(!verify)issue('verification',`${title}: verification gate is missing.`,'blocker');
 if(!visual)issue('visual',`${title}: visual binding is missing.`,'blocker');
 if(commandBlocks.length&&copyButtons.length<commandBlocks.length)issue('copy',`${title}: one or more command blocks lack copy controls.`,'review');
 if(tips<1)issue('troubleshooting',`${title}: troubleshooting guidance is missing.`,'review');
 if(visualPending)issue('photo-pending',`${title}: physical visual still needs an exact project photo.`,'visual');
 if(visual){state.visuals.total++;if(visualExact)state.visuals.exact++;if(visualGenerated)state.visuals.generated++;if(visualPending)state.visuals.pending++;}
 root.dataset.releaseQa=Object.values(state.checks).every(Boolean)?'pass':'review';
}
function auditAccessibility(){
 qa('#pc6Root button').forEach(btn=>{if(!text(btn)&&!btn.getAttribute('aria-label'))issue('a11y-button','A visible course button has no accessible name.','review')});
 const note=q('#pc6Note');if(note&&!note.getAttribute('aria-label')&&!note.getAttribute('placeholder'))issue('a11y-note','Step notes field has no accessible label.','review');
 qa('#pc6Root img').forEach(img=>{if(!img.alt?.trim())issue('a11y-image',`Image ${img.src.split('/').pop()||'asset'} has no alt text.`,'review')});
}
function auditMobile(){
 state.mobile.overflow=[];
 if(innerWidth>700)return;
 qa('#pc6Root *').forEach(el=>{const r=el.getBoundingClientRect();if(r.width>0&&(r.right-innerWidth>3||r.left<-3)){const id=el.id?`#${el.id}`:'';const cls=el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):'';state.mobile.overflow.push((el.tagName.toLowerCase()+id+cls).slice(0,90))}});
 state.mobile.overflow=[...new Set(state.mobile.overflow)].slice(0,15);
 if(state.mobile.overflow.length)issue('mobile-overflow',`Horizontal overflow detected in ${state.mobile.overflow.length} element(s).`,'review');
}
async function auditPwa(){
 state.pwa.displayMode=matchMedia('(display-mode: standalone)').matches?'standalone':'browser';
 state.pwa.controller=!!navigator.serviceWorker?.controller;
 if(!('serviceWorker' in navigator)){state.pwa.serviceWorker='unsupported';return}
 try{const reg=await navigator.serviceWorker.getRegistration();state.pwa.serviceWorker=reg?'registered':'missing';if(!reg)issue('pwa-sw','No service worker registration found.','review')}catch{state.pwa.serviceWorker='error';issue('pwa-sw','Service worker registration check failed.','review')}
}
function hardenKeyboard(){
 qa('#pc6Root [data-copy],#pc6Root .pc6-nav button,#pc6Root .pc6-rail button').forEach(el=>{if(el.dataset.releaseKeys==='1')return;el.dataset.releaseKeys='1';if(!el.hasAttribute('tabindex'))el.tabIndex=0;el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&el.tagName!=='BUTTON'){e.preventDefault();el.click()}})});
}
function badge(){
 let el=q('#pc6ReleaseAudit');if(!el){el=document.createElement('button');el.id='pc6ReleaseAudit';el.type='button';el.setAttribute('aria-label','Open release QA summary');document.body.appendChild(el);el.onclick=()=>{const summary={project:state.project,step:state.step,checks:state.checks,issues:state.issues,visuals:state.visuals,mobile:state.mobile,pwa:state.pwa,lastRun:state.lastRun};console.table(state.checks);console.table(state.issues);alert(`Release QA: ${Object.values(state.checks).every(Boolean)&&!state.issues.some(x=>x.severity==='blocker')?'PASS':'REVIEW'}\nBlockers: ${state.issues.filter(x=>x.severity==='blocker').length}\nReview: ${state.issues.filter(x=>x.severity==='review').length}\nPhoto pending: ${state.issues.filter(x=>x.code==='photo-pending').length}\nDetails are available in window.PI_COMMAND_RELEASE_QA and the browser console.`);window.PI_COMMAND_RELEASE_QA=summary}}
 const blockers=state.issues.filter(x=>x.severity==='blocker').length,review=state.issues.filter(x=>x.severity==='review').length,pending=state.issues.filter(x=>x.code==='photo-pending').length;
 el.textContent=blockers?`QA ${blockers} blocker${blockers===1?'':'s'}`:review?`QA ${review} review` : pending?`QA ${pending} photo pending`:'QA pass';
 el.dataset.status=blockers?'blocker':review?'review':pending?'visual':'pass';
}
async function run(){
 if(!document.body.classList.contains('pc6-active'))return;
 state.runs++;state.lastRun=NOW();state.issues=[];state.visuals={exact:0,generated:0,pending:0,total:0};
 auditStep();auditAccessibility();auditMobile();hardenKeyboard();await auditPwa();uniqueIssues();window.PI_COMMAND_RELEASE_QA=JSON.parse(JSON.stringify(state));badge();
}
const style=document.createElement('style');style.textContent=`#pc6ReleaseAudit{position:fixed;right:12px;bottom:12px;z-index:9999;border:1px solid #35506a;border-radius:999px;padding:9px 12px;background:#0a1724;color:#dbe9f7;font:800 11px/1 system-ui;box-shadow:0 8px 24px #0008}#pc6ReleaseAudit[data-status="pass"]{border-color:#2f8b63;color:#8ce3ba}#pc6ReleaseAudit[data-status="review"]{border-color:#8b6b2f;color:#f4d58a}#pc6ReleaseAudit[data-status="blocker"]{border-color:#9b3c50;color:#ff9aac}#pc6ReleaseAudit[data-status="visual"]{border-color:#6251a9;color:#b9abff}.pc6-step[data-release-qa="review"]{box-shadow:inset 0 0 0 1px rgba(255,177,77,.22)}@media(max-width:520px){#pc6ReleaseAudit{right:8px;bottom:64px;max-width:48vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}`;document.head.appendChild(style);
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,120)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(run,180)});setTimeout(run,500);
})();