(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const EXACT={
  smartMirror:[
    {match:'Power the display and Pi on while everything is still loose on your desk.',src:'/assets/smart-mirror/display-test.jpg',title:'Loose desk power test',caption:'Keep the Pi and display loose on the desk for this test. Do not mount anything yet.'},
    {match:'Open a mostly black test page with very large white text',src:'/assets/smart-mirror/display-test.jpg',title:'Black-background display test',caption:'Use a mostly black screen with bright white content so you can judge what will show through the mirror.'},
    {match:'Hold one two-way mirror sheet directly in front of the screen',src:'/assets/smart-mirror-finished-reference.jpg',title:'Mirror effect reference',caption:'Hold the reflective acrylic directly in front of the powered screen before mounting it.'},
    {match:'Look at the mirror from straight on',src:'/assets/smart-mirror-finished-reference.jpg',title:'Viewing-angle check',caption:'Check the mirror from the same standing angle and room lighting you will actually use.'},
    {match:'Increase display brightness only as much as needed',src:'/assets/smart-mirror/display-test.jpg',title:'Brightness check',caption:'Raise brightness only until white content is readable through the mirror while black areas still disappear.'},
    {match:'Power the Pi completely off before touching the DSI cable.',src:'/assets/smart-mirror/dsi-find.jpg',title:'Power off before DSI work',caption:'USB-C power must be physically disconnected before you touch either DSI connector.'},
    {match:'Connect the Pi 5-compatible DSI cable firmly and squarely at both ends.',src:'/assets/smart-mirror/dsi-port-locate-generated.jpg',title:'DSI connector and ribbon orientation',caption:'Match the connector, latch, and ribbon orientation shown here. Insert the cable straight and evenly.'},
    {match:'Route the DSI ribbon in a broad curve.',src:'/assets/smart-mirror/dsi-align.jpg',title:'Safe DSI ribbon curve',caption:'Use a broad curve. Do not fold or crease the ribbon like paper.'},
    {match:'Route the USB-C power cable on a different path',src:'/assets/pi5-port-map-reference.jpg',title:'Separate the power and display cable paths',caption:'Keep USB-C power from pressing the DSI ribbon against the frame.'}
  ]
};
function replaceFigure(root,item){
  let fig=q('.pc-photo',root);
  if(!fig){
    const target=q('.pc-target',root)||q('.pc-layout main > h1',root);
    if(!target)return;
    fig=document.createElement('figure');fig.className='pc-photo vr-exact';target.insertAdjacentElement('afterend',fig);
  }
  fig.classList.add('vr-exact');
  fig.innerHTML=`<div class="pc-photo-head"><strong>${esc(item.title)}</strong><span class="vr-badge">EXACT ACTION PHOTO</span></div><img src="${item.src}" alt="${esc(item.title)}"><figcaption>${esc(item.caption)}</figcaption>`;
}
function projectVisual(){
  const root=q('#pcRoot');if(!root)return;
  const project=q('.pc-rail h3',root)?.textContent?.trim()||'';
  const action=q('.pc-layout main > h1',root)?.textContent?.trim()||'';
  if(project==='Smart Mirror'){
    const item=EXACT.smartMirror.find(x=>action.includes(x.match));
    if(item){replaceFigure(root,item);return;}
    const fig=q('.pc-photo',root);
    if(fig&&!fig.classList.contains('vr-exact')){
      const src=q(':scope > img',fig)?.getAttribute('src')||'';
      if(src.includes('smart-mirror-finished-reference')){
        fig.remove();
        const target=q('.pc-target',root)||q('.pc-layout main > h1',root);
        if(target&&!q('.vr-missing',root))target.insertAdjacentHTML('afterend',`<div class="vr-missing"><strong>Exact visual required for this action</strong><p>The generic finished-mirror photo was removed because it does not teach this exact action. This action will only show a photo when its dedicated reference is available.</p></div>`);
      }
    }
  }
}
function setupVisual(){
  const root=q('#simpleView');if(!root?.classList.contains('active'))return;
  const title=q('.sc-head h1',root)?.textContent?.trim()||'';
  const visual=q('.sc-visual',root);if(!visual)return;
  if(title==='Enable SSH before first boot'&&visual.dataset.vr!=='ssh'){
    visual.dataset.vr='ssh';
    visual.innerHTML=`<figure class="sc-photo vr-setup-photo"><img src="/assets/setup/imager-ssh-generated.jpg" alt="Raspberry Pi Imager SSH settings"><figcaption><b>Match this screen.</b> SSH is ON, password authentication is selected, a username is set, and the settings are ready to save.</figcaption></figure>`;
  }
}
function apply(){projectVisual();setupVisual()}
const css=document.createElement('style');css.textContent=`.vr-badge{font-size:9px;font-weight:900;letter-spacing:.08em;color:#8ff0c4;background:#0c2a20;border:1px solid #256f55;padding:5px 7px;border-radius:999px}.vr-exact>img,.vr-setup-photo>img{width:100%;display:block;max-height:none!important;object-fit:contain;background:#05090f}.vr-missing{margin:14px 0;padding:16px;border-radius:12px;border:1px dashed #8a6d2f;background:#21190d;color:#f5d78b}.vr-missing strong{display:block;margin-bottom:6px;color:#ffe7a3}.vr-missing p{font-size:12px;line-height:1.55;color:#d8c69e}.vr-setup-photo figcaption b{color:#fff}@media(max-width:600px){.vr-badge{font-size:8px}.vr-exact>img,.vr-setup-photo>img{width:100%;max-height:none!important}.vr-missing{font-size:14px}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,300);
})();