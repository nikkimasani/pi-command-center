(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));
function rows(block){
 const pre=q('pre',block);if(!pre||block.dataset.rows==='1')return;
 const lines=pre.textContent.split('\n').map(x=>x.trim()).filter(Boolean);
 if(lines.length<2)return;
 const wrap=document.createElement('div');wrap.className='cc-rows';
 lines.forEach((line,i)=>{const row=document.createElement('div');row.className='cc-row';row.innerHTML=`<div><small>${i+1}</small><code>${esc(line)}</code></div><button type="button">Copy</button>`;row.querySelector('button').onclick=async()=>{const b=row.querySelector('button');try{await navigator.clipboard.writeText(line);b.textContent='Copied ✓';setTimeout(()=>b.textContent='Copy',900)}catch{b.textContent='Select';const range=document.createRange();range.selectNodeContents(row.querySelector('code'));const sel=getSelection();sel.removeAllRanges();sel.addRange(range)}};wrap.appendChild(row)});
 pre.replaceWith(wrap);block.dataset.rows='1';
}
function apply(){qa('.sc-command,.pc-command').forEach(rows)}
const css=document.createElement('style');css.textContent=`.cc-rows{display:grid;gap:8px;margin:10px 0}.cc-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:10px;border:1px solid #2d4057;border-radius:9px;background:#03070c}.cc-row>div{display:grid;grid-template-columns:22px minmax(0,1fr);gap:7px;align-items:start;min-width:0}.cc-row small{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#251b48;color:#c7b8ff;font-size:9px;font-weight:900}.cc-row code{font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;color:#dbf7e8;overflow-wrap:anywhere;white-space:pre-wrap}.cc-row button{border:1px solid #6f54c8;background:#2c1d5a;color:#fff;border-radius:8px;padding:8px 11px;font-size:10px;font-weight:800}@media(max-width:600px){.cc-row{grid-template-columns:1fr}.cc-row button{width:100%;min-height:40px}.cc-row code{font-size:12px}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,250);
})();