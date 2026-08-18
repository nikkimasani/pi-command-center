(()=>{
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const isMirror=()=>!!q('#bmRoot')&&document.body.classList.contains('bm-course');
let speaking=false;
function currentCard(){return q('#bmRoot .bm-main')||q('#bmRoot')}
function checkInput(){return q('#bmRoot .bm-check input[type="checkbox"]')}
function confirmed(){const c=checkInput();return !c||c.checked}
function speak(){
 const card=currentCard();if(!card||!('speechSynthesis'in window))return;
 speechSynthesis.cancel();
 if(speaking){speaking=false;render();return}
 const title=q('h1,h2,h3',card)?.textContent||'';
 const body=qa('.bdl-wrap p,.bdl-wrap li,.bm-why,.bm-wrong,.bm-check label',card).map(x=>x.textContent.trim()).filter(Boolean).join('. ');
 const u=new SpeechSynthesisUtterance(`${title}. ${body}`);u.rate=.88;u.pitch=1;u.onend=()=>{speaking=false;render()};speaking=true;speechSynthesis.speak(u);render();
}
function findNav(dir){
 const root=q('#bmRoot');if(!root)return null;
 const buttons=qa('button',root).filter(b=>!b.closest('#bm-beginner-coach'));
 const re=dir==='next'?/next|continue/i:/back|previous/i;
 return buttons.find(b=>re.test(b.textContent)&&!b.closest('.bdl-wrap'))||null;
}
function gate(){
 const card=currentCard();if(!card)return;
 let box=q('.bm-gate-message',card);if(!box){box=document.createElement('div');box.className='bm-gate-message';box.innerHTML='<strong>Confirm this action first</strong><p>Compare your hardware or screen with the reference, then check the confirmation box for this action. Guided Mode will unlock Next after you verify it.</p>';const c=q('.bm-check',card);(c||card).appendChild(box)}
 box.scrollIntoView({behavior:'smooth',block:'nearest'});setTimeout(()=>box.classList.add('pulse'),50);setTimeout(()=>box.classList.remove('pulse'),900);
}
function nav(dir){
 if(dir==='next'&&!confirmed()){gate();return}
 const target=findNav(dir);target?.click();setTimeout(()=>currentCard()?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function showHelp(){
 const card=currentCard();if(!card)return;
 let box=q('.bm-success-coach',card);if(box){box.remove();return}
 const check=q('.bm-check label',card)?.textContent.trim()||'Your result should match the reference shown in this action before you continue.';
 box=document.createElement('div');box.className='bm-success-coach';box.innerHTML=`<strong>Before you press Next</strong><p>${check}</p><p>If yours does not match, stay on this action. Use troubleshooting instead of guessing or stacking more changes.</p>`;const c=q('.bm-check',card);(c||card).appendChild(box);box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function render(){
 if(!isMirror()){q('#bm-beginner-coach')?.remove();return}
 let bar=q('#bm-beginner-coach');if(!bar){bar=document.createElement('div');bar.id='bm-beginner-coach';document.body.appendChild(bar)}
 const ok=confirmed();bar.innerHTML=`<button data-c="back" aria-label="Previous action">← Back</button><button data-c="read" aria-label="Read this action aloud">${speaking?'■ Stop reading':'🔊 Read to me'}</button><button data-c="help" aria-label="Explain what success looks like">👀 What should I see?</button><button class="primary ${ok?'':'locked'}" data-c="next" aria-label="Next action" aria-disabled="${ok?'false':'true'}">${ok?'Next →':'✓ Verify to unlock Next'}</button>`;
 bar.onclick=e=>{const c=e.target.closest('button')?.dataset.c;if(c==='read')speak();if(c==='back')nav('back');if(c==='next')nav('next');if(c==='help')showHelp()};
 const card=currentCard();if(card&&!q('.bm-beginner-label',card)){const lab=document.createElement('div');lab.className='bm-beginner-label';lab.textContent='BEGINNER MODE · Do only this action right now';const first=q('.bm-stagebar',card)||card.firstChild;card.insertBefore(lab,first)}
}
const css=document.createElement('style');css.textContent=`
#bm-beginner-coach{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:10000;display:flex;gap:8px;padding:8px;background:rgba(8,12,22,.97);border:1px solid #334155;border-radius:16px;box-shadow:0 18px 60px #0009;max-width:calc(100vw - 20px)}
#bm-beginner-coach button{border:1px solid #475569;background:#111827;color:#f8fafc;border-radius:11px;padding:11px 14px;font-weight:800;white-space:nowrap;cursor:pointer}#bm-beginner-coach .primary{background:#6d28d9;border-color:#8b5cf6}#bm-beginner-coach .primary.locked{background:#151b26;border-color:#425069;color:#91a0b4}.bm-beginner-label{display:inline-flex;padding:6px 10px;margin:0 0 10px;border-radius:999px;background:#172554;color:#bfdbfe;font-size:11px;font-weight:900;letter-spacing:.04em}.bm-success-coach,.bm-gate-message{margin-top:12px;padding:13px;border-radius:11px}.bm-success-coach{border:1px solid #22c55e66;background:#052e163d}.bm-success-coach strong{color:#86efac}.bm-success-coach p,.bm-gate-message p{margin:6px 0 0;color:#dbeafe;font-size:11px;line-height:1.5}.bm-gate-message{border:1px solid #f59e0b77;background:#3b260836;transition:transform .2s,box-shadow .2s}.bm-gate-message strong{color:#fbbf24}.bm-gate-message.pulse{transform:scale(1.01);box-shadow:0 0 0 4px #f59e0b22}
@media(max-width:700px){#bm-beginner-coach{width:calc(100vw - 16px);display:grid;grid-template-columns:1fr 1fr;bottom:max(8px,env(safe-area-inset-bottom))}#bm-beginner-coach button{padding:10px 8px;font-size:12px;white-space:normal;min-height:44px}body.bm-course #bmRoot{padding-bottom:155px!important}.bm-main{overflow:hidden}.bm-main img{max-width:100%;height:auto}}
`;document.head.appendChild(css);
document.addEventListener('change',e=>{if(e.target.matches('#bmRoot .bm-check input[type="checkbox"]'))render()});
new MutationObserver(()=>requestAnimationFrame(render)).observe(document.body,{subtree:true,childList:true});
document.addEventListener('keydown',e=>{if(!isMirror()||/input|textarea/i.test(e.target.tagName))return;if(e.key==='ArrowRight')nav('next');if(e.key==='ArrowLeft')nav('back')});
setTimeout(render,500);
})();