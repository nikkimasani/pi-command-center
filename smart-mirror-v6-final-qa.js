(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function currentStep(){return q('#sm6Root .sm6-step')||q('.sm6-step')}
function audit(){
  if(!document.body.classList.contains('sm6-active'))return;
  const step=currentStep();if(!step)return;
  const title=q('h1',step)?.textContent?.trim()||'Smart Mirror step';
  const actions=qa('.sm6-actions li',step).length;
  const expected=!!q('.sm6-expected p',step)?.textContent?.trim();
  const trouble=!!qa('details',step).find(d=>/Troubleshooting/i.test(q('summary',d)?.textContent||''))?.textContent?.trim();
  const commands=qa('[data-copy]',step).length;
  const visual=!!q('.sm6-photo,.sm6-screen,.sm6-pending,.sm6-photo-awaiting',step);
  const verified=!!q('#sm6Check',step);
  const pass=actions>=4&&expected&&visual&&verified;
  step.dataset.sm6FinalQa=pass?'pass':'review';
  let badge=q('.sm6-final-qa-badge',step);
  if(!badge){badge=document.createElement('div');badge.className='sm6-final-qa-badge';const h=q('h1',step);h?.insertAdjacentElement('beforebegin',badge)}
  badge.textContent=pass?'QA READY':'QA REVIEW';
  badge.title=`${title}: actions ${actions}, expected ${expected?'yes':'no'}, troubleshooting ${trouble?'yes':'fallback'}, commands ${commands}, visual ${visual?'yes':'no'}, verification ${verified?'yes':'no'}`;
  qa('[data-copy]',step).forEach(btn=>{btn.type='button';btn.setAttribute('aria-label','Copy command to clipboard')});
  const check=q('#sm6Check',step);if(check)check.setAttribute('aria-label','I verified this Smart Mirror step');
  const note=q('#sm6Note',step);if(note)note.setAttribute('aria-label','Optional notes for this Smart Mirror step');
}
function manifestCoverage(){
  const m=window.SMART_MIRROR_VISUALS||{};
  const ids=Object.keys(m);
  const local=ids.filter(id=>String(m[id]?.src||'').startsWith('/assets/')).length;
  const remote=ids.length-local;
  window.SMART_MIRROR_V6_COVERAGE={manifestEntries:ids.length,localAssets:local,remoteReferences:remote,checkedAt:new Date().toISOString()};
}
function run(){audit();manifestCoverage()}
const style=document.createElement('style');style.textContent=`.sm6-final-qa-badge{display:inline-flex;align-items:center;min-height:24px;padding:4px 8px;margin:0 0 8px;border:1px solid #2f5a48;border-radius:999px;background:#0b211a;color:#88ecc0;font-size:9px;font-weight:900;letter-spacing:.08em}.sm6-step[data-sm6-final-qa="review"] .sm6-final-qa-badge{border-color:#7c5d28;background:#251b08;color:#f1c875}@media(max-width:520px){.sm6-nav{position:sticky;bottom:0;z-index:6;background:#09131f;padding:10px 0}.sm6-command{grid-template-columns:1fr!important}.sm6-command button{min-height:44px}.sm6-actions{padding-left:0}.sm6-step,.sm6-card,.sm6-phase{padding:13px!important}}`;document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(run)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setTimeout(run,350);
})();