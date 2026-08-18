(()=>{
const isMirror=()=>!!document.querySelector('#bm-course');
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
let speaking=false;
function currentCard(){return q('#bm-course .bm-card')||q('#bm-course');}
function speak(){
 const card=currentCard(); if(!card||!('speechSynthesis'in window))return;
 speechSynthesis.cancel();
 if(speaking){speaking=false;return;}
 const title=q('h2,h3',card)?.textContent||'';
 const body=qa('p,li,.bm-why,.bm-wrong,.bm-check',card).map(x=>x.textContent.trim()).filter(Boolean).join('. ');
 const u=new SpeechSynthesisUtterance(`${title}. ${body}`);u.rate=.9;u.onend=()=>{speaking=false;render()};speaking=true;speechSynthesis.speak(u);render();
}
function nav(dir){
 const buttons=qa('#bm-course button');
 const target=buttons.find(b=>new RegExp(dir==='next'?'next|continue':'back|previous','i').test(b.textContent));
 target?.click();
 setTimeout(()=>currentCard()?.scrollIntoView({behavior:'smooth',block:'start'}),50);
}
function render(){
 if(!isMirror())return;
 let bar=q('#bm-beginner-coach');
 if(!bar){bar=document.createElement('div');bar.id='bm-beginner-coach';document.body.appendChild(bar)}
 bar.innerHTML=`<button data-c="back" aria-label="Previous action">← Back</button><button data-c="read" aria-label="Read this action aloud">${speaking?'■ Stop reading':'🔊 Read to me'}</button><button data-c="help" aria-label="Explain what success looks like">👀 What should I see?</button><button class="primary" data-c="next" aria-label="Next action">Next →</button>`;
 bar.onclick=e=>{const c=e.target.closest('button')?.dataset.c;if(c==='read')speak();if(c==='back')nav('back');if(c==='next')nav('next');if(c==='help')showHelp()};
 const card=currentCard();
 if(card&&!q('.bm-beginner-label',card)){const lab=document.createElement('div');lab.className='bm-beginner-label';lab.textContent='BEGINNER MODE · Do only this action right now';card.prepend(lab)}
}
function showHelp(){
 const card=currentCard();if(!card)return;
 let box=q('.bm-success-coach',card);if(box){box.remove();return}
 const check=qa('label,.bm-check',card).map(x=>x.textContent.trim()).find(Boolean)||'Your result should match the reference shown in this action before you continue.';
 box=document.createElement('div');box.className='bm-success-coach';box.innerHTML=`<strong>Before you press Next</strong><p>${check}</p><p>If yours does not match, stay on this action. Use the troubleshooting option instead of guessing.</p>`;card.appendChild(box);box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
const css=document.createElement('style');css.textContent=`
#bm-beginner-coach{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:10000;display:flex;gap:8px;padding:8px;background:rgba(8,12,22,.96);border:1px solid #334155;border-radius:16px;box-shadow:0 18px 60px #0009;max-width:calc(100vw - 20px)}
#bm-beginner-coach button{border:1px solid #475569;background:#111827;color:#f8fafc;border-radius:11px;padding:11px 14px;font-weight:800;white-space:nowrap}#bm-beginner-coach .primary{background:#6d28d9;border-color:#8b5cf6}
.bm-beginner-label{display:inline-flex;padding:6px 10px;margin-bottom:10px;border-radius:999px;background:#172554;color:#bfdbfe;font-size:12px;font-weight:900;letter-spacing:.04em}.bm-success-coach{margin-top:14px;padding:14px;border:1px solid #22c55e66;border-radius:12px;background:#052e163d}.bm-success-coach strong{color:#86efac}.bm-success-coach p{margin:7px 0 0;color:#dbeafe}
@media(max-width:700px){#bm-beginner-coach{width:calc(100vw - 16px);display:grid;grid-template-columns:1fr 1fr;bottom:max(8px,env(safe-area-inset-bottom))}#bm-beginner-coach button{padding:10px 8px;font-size:13px}#bm-course{padding-bottom:150px!important}.bm-card{overflow:hidden}.bm-card img{max-width:100%;height:auto}}
`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(render)).observe(document.body,{subtree:true,childList:true});
document.addEventListener('keydown',e=>{if(!isMirror()||/input|textarea/i.test(e.target.tagName))return;if(e.key==='ArrowRight')nav('next');if(e.key==='ArrowLeft')nav('back')});
setTimeout(render,300);
})();