(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];

function closeMenu(){
  q('#sidebar')?.classList.remove('open');
  q('#sidebarOverlay')?.classList.remove('show');
  document.body.classList.remove('nav-open');
}
function toggleMenu(){
  const sidebar=q('#sidebar'), overlay=q('#sidebarOverlay');
  if(!sidebar)return;
  const open=!sidebar.classList.contains('open');
  sidebar.classList.toggle('open',open);
  overlay?.classList.toggle('show',open);
  document.body.classList.toggle('nav-open',open);
}

// Capture phase keeps the mobile menu usable even if an older page script fails first.
document.addEventListener('click',e=>{
  const menu=e.target.closest('#menuBtn,.hamburger');
  if(menu){e.preventDefault();e.stopPropagation();toggleMenu();return}
  if(e.target.closest('#sidebarOverlay')){e.preventDefault();closeMenu();return}
  const setup=e.target.closest('[data-view="setup"],[data-action="newToPi"],#startSetup,[data-open-setup]');
  if(setup&&window.PI_OPEN_SETUP_V3){e.preventDefault();closeMenu();setTimeout(()=>window.PI_OPEN_SETUP_V3(),0);return}
  if(e.target.closest('.side-link'))closeMenu();
},true);

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

function forceModernRenderer(){
  const step=q('#stepView');
  if(step?.classList.contains('active')&&!q('#pc6Root,#sm6Root',step)){
    // Both course renderers observe body class changes. This harmless pulse forces a remount
    // when legacy navigation opened a project before the modern renderer initialized.
    document.body.classList.toggle('course-remount-pulse');
  }
  const simple=q('#simpleView');
  if(simple?.classList.contains('active')&&/Shared Raspberry Pi Setup/i.test(simple.textContent||'')&&window.PI_OPEN_SETUP_V3){
    window.PI_OPEN_SETUP_V3();
  }
}

function repairImages(root=document){
  qa('img',root).forEach(img=>{
    if(img.dataset.prod7Bound)return;
    img.dataset.prod7Bound='1';
    img.decoding='async';
    const fail=()=>{
      if(img.closest('.pc8-visual,.sm6-visual-player,.s3-photo')){
        const box=document.createElement('div');
        box.className='prod7-image-fallback';
        box.innerHTML='<b>Visual unavailable</b><span>Use the written step below. Do not guess hardware placement from a broken image.</span>';
        img.replaceWith(box);
      }
    };
    img.addEventListener('error',fail,{once:true});
  });
}

function removeInternalQa(root=document){
  qa('.step-actions-list,.pc6-actions,.s3-card',root).forEach(area=>{
    qa('li',area).forEach(li=>{
      const t=(li.textContent||'').trim();
      if(/open browser developer tools/i.test(t)||/set the viewport to 800\s*[×x]\s*480/i.test(t)) li.remove();
    });
  });
}

function enhanceBeginnerClarity(root=document){
  qa('#pc6Root .pc6-actions li',root).forEach(li=>{
    if(li.dataset.prod7Detail)return;
    li.dataset.prod7Detail='1';
    const text=li.querySelector('span')?.textContent?.trim()||'';
    let detail='';
    if(/push .*github|commit .*github|github repository/i.test(text)) detail='Beginner check: open the repository in GitHub after the push and confirm the newest files are visible before continuing.';
    else if(/deploy .*vercel|import .*vercel/i.test(text)) detail='Beginner check: wait until Vercel shows the deployment as Ready, then open the production URL in a new tab and test it there, not only in your local preview.';
    else if(/kiosk/i.test(text)) detail='Do this only after the same page works in a normal Chromium window. Kiosk mode hides browser controls and makes troubleshooting harder.';
    else if(/wire|gpio|breadboard|ribbon|dsi|connector/i.test(text)) detail='Power rule: shut the Pi down and disconnect USB-C power before changing this hardware connection. Compare the physical pin or connector before applying power again.';
    else if(/wifi|wi-fi/i.test(text)) detail='Verification: load a normal webpage or reconnect by SSH so you know the Pi is actually online before blaming the project app.';
    else if(/reboot/i.test(text)) detail='After reboot, wait for the desktop or SSH to return, then repeat the exact check from this step before moving on.';
    if(detail){const small=document.createElement('small');small.className='prod7-detail';small.textContent=detail;li.querySelector('span')?.appendChild(small)}
  });
}

let queued=false;
function stabilize(){
  queued=false;
  forceModernRenderer();
  repairImages();
  removeInternalQa();
  enhanceBeginnerClarity();
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(stabilize)}
new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','src']});
window.addEventListener('pageshow',queue);
window.addEventListener('resize',queue);
setTimeout(stabilize,50);setTimeout(stabilize,500);setTimeout(stabilize,1500);

const style=document.createElement('style');
style.id='production-ui-v7-style';
style.textContent=`
html,body{width:100%;max-width:100%;min-height:100%;height:auto!important;overflow-x:hidden!important}
body{overscroll-behavior-x:none}
body.nav-open{overflow:hidden!important}
.app-shell,.main-area,.content-wrap,.view,.view.active,#stepView,#simpleView,#setupView,#projectsView{min-width:0!important;max-width:100%!important;height:auto!important;max-height:none!important}
.view.active,#stepView.active,#simpleView.active{overflow:visible!important}
.main-area{width:100%;overflow:visible!important}
.content-wrap{width:100%;overflow:visible!important}
#pc6Root,#sm6Root,.s3{width:100%!important;max-width:1180px!important;min-width:0!important;overflow:visible!important}
#pc6Root * ,#sm6Root *,.s3 *{min-width:0}
.pc6-layout,.sm6-layout{align-items:start}
.pc6-step,.sm6-step,.pc6-card,.sm6-card,.s3 article,.s3-card{height:auto!important;max-height:none!important;overflow:visible}
.pc8-visual,.sm6-visual-player,.s3-photo{width:100%;max-width:100%;overflow:hidden!important}
.pc8-image img,.pc8-frame svg,.sm6-vp-stage>img,.sm6-vp-thumbs img,.s3-photo img{display:block;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center!important}
.sm6-vp-stage{height:auto!important;min-height:0!important}
.prod7-image-fallback{display:grid;gap:6px;padding:22px;border:1px dashed #3b526d;border-radius:12px;background:#08111b;color:#eef4ff;min-height:130px;place-content:center;text-align:center}
.prod7-image-fallback span{color:#9fb0c5;font-size:12px;line-height:1.5}
.prod7-detail{display:block;margin-top:7px;padding:8px 10px;border-left:3px solid #7655e9;background:#0d1825;color:#aebdd0!important;font-size:12px!important;line-height:1.45;border-radius:0 7px 7px 0}
.sidebar.open{visibility:visible!important;pointer-events:auto!important}
.sidebar-overlay.show{display:block!important;pointer-events:auto!important}
@media(max-width:820px){
  .mobile-header{display:flex!important;position:sticky!important;top:0;z-index:900;min-height:58px;padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right))}
  .hamburger{width:44px!important;height:44px!important;touch-action:manipulation}
  .sidebar{top:0!important;bottom:0!important;height:100dvh!important;max-height:100dvh!important;overflow-y:auto!important}
  .content-wrap{padding:12px 12px max(28px,env(safe-area-inset-bottom))!important}
  #pc6Root,#sm6Root,.s3{padding:4px!important;margin:0 auto!important}
  .pc6-layout,.sm6-layout{display:block!important}
  .pc6-rail,.sm6-rail{position:static!important;width:100%!important;margin-top:14px!important}
  .pc6-step,.sm6-step,.pc6-card,.sm6-card,.s3 article,.s3-card{padding:14px!important;border-radius:12px!important}
  .pc6-wrap header h1,.sm6-wrap header h1,.s3 h1{font-size:clamp(1.55rem,7vw,2rem)!important;line-height:1.15!important}
  .pc6-step h1,.sm6-step h1{font-size:clamp(1.45rem,6.6vw,1.95rem)!important}
  .pc6-actions li,.sm6-actions li{grid-template-columns:32px minmax(0,1fr)!important;gap:10px!important}
  .pc6-materials{grid-template-columns:1fr!important}
  .pc6-nav,.sm6-nav,.s3-nav,.s3-bottom{position:relative!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
  .pc6-nav button,.sm6-nav button,.s3-nav button,.s3-bottom button{min-height:46px!important;margin:0!important}
  .pc8-tabs,.sm6-vp-tabs,.sm6-vp-thumbs{grid-template-columns:1fr 1fr!important}
  .mobile-toolbox-link{min-height:40px;display:flex;align-items:center}
}
@media(max-width:430px){
  .mobile-header-title{font-size:13px!important}
  .mobile-toolbox-link{font-size:10px!important;padding:5px 8px!important}
  .pc8-tabs button,.sm6-vp-tabs button{font-size:11px!important}
}
`;
document.head.appendChild(style);
window.PI_PRODUCTION_UI={version:'v7',stabilize};
})();
