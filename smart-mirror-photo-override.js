(()=>{
const PHOTO={
 find:'/assets/smart-mirror/dsi-find.jpg',
 align:'/assets/smart-mirror/dsi-align.jpg',
 seated:'/assets/smart-mirror/dsi-seated.jpg',
 wrong:'/assets/smart-mirror/dsi-wrong.jpg'
};
const q=(s,r=document)=>r.querySelector(s);
function current(){
 const root=q('#bmRoot');if(!root)return null;
 const stage=Number((q('.bm-stagebar span',root)?.textContent.match(/Stage\s+(\d+)/i)||[])[1]||0);
 const action=Number((q('.bm-counter',root)?.textContent.match(/Action\s+(\d+)/i)||[])[1]||0);
 return{root,stage,action};
}
function config(stage,action){
 if(stage!==5)return null;
 if(action===1)return{src:PHOTO.find,label:'Find the display connector',caption:'Use this generated close-up to identify the small DSI/display connector before touching a latch.'};
 if(action===2)return{src:PHOTO.find,label:'Open only the small latch',caption:'Zoom in and identify the tiny movable locking tab. Do not lift the whole connector body.'};
 if(action===3)return{src:PHOTO.align,label:'Orient the ribbon before insertion',caption:'Hold the ribbon square to the connector and compare which side faces the connector before sliding it in.'};
 if(action===4)return{src:PHOTO.seated,label:'Fully seated and straight',caption:'Both edges should be equally deep. Use the mistake view to compare against partial or crooked insertion.',compare:true};
 if(action===5)return{src:PHOTO.seated,label:'Lock the ribbon',caption:'Keep the ribbon straight while closing the latch evenly. The cable should stay in place without force.',compare:true};
 if(action===6)return{src:PHOTO.align,label:'Repeat at the display end',caption:'Apply the same orientation, straight insertion, and gentle locking process at the screen connector.',compare:true};
 return null;
}
function enhance(){
 const c=current();if(!c)return;const cfg=config(c.stage,c.action);if(!cfg)return;
 const visual=q('.bm-visual',c.root);if(!visual)return;
 const key=`${c.stage}-${c.action}`;if(visual.dataset.photoAction===key)return;
 visual.dataset.photoAction=key;
 visual.innerHTML=`<figure class="smp-photo"><div class="smp-photo-head"><div><small>GENERATED HARDWARE REFERENCE</small><strong>${cfg.label}</strong></div><button type="button" data-smp-zoom>Tap to enlarge</button></div><img src="${cfg.src}" alt="${cfg.label}"><figcaption>${cfg.caption}</figcaption>${cfg.compare?`<div class="smp-compare"><button class="active" data-smp-view="correct">✓ Correct</button><button data-smp-view="wrong">✕ Common mistakes</button></div>`:''}</figure>`;
 const img=q('img',visual);q('[data-smp-zoom]',visual).onclick=()=>openZoom(img.src,cfg.label);
 if(cfg.compare){visual.querySelectorAll('[data-smp-view]').forEach(b=>b.onclick=()=>{visual.querySelectorAll('[data-smp-view]').forEach(x=>x.classList.remove('active'));b.classList.add('active');img.src=b.dataset.smpView==='wrong'?PHOTO.wrong:cfg.src})}
}
function openZoom(src,title){
 let m=q('#smp-modal');if(!m){m=document.createElement('div');m.id='smp-modal';m.innerHTML='<div class="smp-modal-box"><div class="smp-modal-head"><strong></strong><button>Close</button></div><img></div>';document.body.appendChild(m);q('button',m).onclick=()=>m.classList.remove('open');m.onclick=e=>{if(e.target===m)m.classList.remove('open')}}
 q('strong',m).textContent=title;q('img',m).src=src;m.classList.add('open');
}
const css=document.createElement('style');css.textContent=`.smp-photo{margin:0;background:#050a10}.smp-photo-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid #33465d;background:#0a1521}.smp-photo-head small{display:block;color:#69d6ff;font-size:9px;font-weight:900;letter-spacing:.09em}.smp-photo-head strong{display:block;margin-top:3px;color:#fff;font-size:13px}.smp-photo-head button{border:1px solid #53657c;background:#111c29;color:#dce8f4;border-radius:8px;padding:8px 10px}.smp-photo img{display:block;width:100%;max-height:610px;object-fit:contain;background:#020609}.smp-photo figcaption{padding:10px 12px;color:#becddd;font-size:11px;line-height:1.55;border-top:1px solid #26384e}.smp-compare{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:9px}.smp-compare button{border:1px solid #3e5067;background:#111b28;color:#cbd7e4;border-radius:8px;padding:9px}.smp-compare button.active{border-color:#62d6a7;background:#0f2d25;color:#bff0db}#smp-modal{position:fixed;inset:0;z-index:12000;background:#02050aee;display:none;align-items:center;justify-content:center;padding:14px}#smp-modal.open{display:flex}.smp-modal-box{width:min(1100px,100%);max-height:94vh;overflow:auto;background:#08111b;border:1px solid #3a4d65;border-radius:14px;padding:10px}.smp-modal-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px}.smp-modal-head button{border:1px solid #53657c;background:#111c29;color:#fff;border-radius:8px;padding:8px 11px}.smp-modal-box img{width:100%;max-height:82vh;object-fit:contain;display:block}@media(max-width:650px){.smp-photo-head{display:block}.smp-photo-head button{width:100%;margin-top:9px;min-height:42px}.smp-compare{grid-template-columns:1fr}.smp-photo figcaption{font-size:12px}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(enhance)).observe(document.body,{childList:true,subtree:true});setTimeout(enhance,700);
})();