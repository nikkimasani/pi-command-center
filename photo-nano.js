(()=>{
const ASSETS={
  dsi:'/assets/dsi-ribbon-reference.jpg',
  ports:'/assets/pi5-port-map-reference.jpg',
  mirror:'/assets/smart-mirror-finished-reference.jpg'
};
const CSS=`
.photo-realism{margin:18px 0;border:1px solid #394a62;border-radius:16px;overflow:hidden;background:#080d15;box-shadow:0 18px 42px rgba(0,0,0,.26)}
.photo-realism-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 13px;background:#0b1420;border-bottom:1px solid #28374a}
.photo-realism-head strong{font-size:13px}.photo-realism-badge{font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#c5b7ff;background:rgba(130,87,255,.13);border:1px solid rgba(130,87,255,.36);padding:5px 8px;border-radius:999px}
.photo-realism-tabs{display:flex;gap:7px;padding:9px 10px;border-bottom:1px solid #263449;overflow-x:auto;background:#09111b}.photo-realism-tabs button{white-space:nowrap;border:1px solid #33445d;background:#0c1521;color:#9cabbc;border-radius:8px;padding:7px 9px;font-size:10px;cursor:pointer}.photo-realism-tabs button.active{border-color:#8257ff;background:#211944;color:#ddd3ff}
.photo-realism-stage{background:#05080d;display:grid;place-items:center;min-height:220px}.photo-realism-stage img{display:block;width:100%;height:auto;max-height:700px;object-fit:contain}
.photo-realism-copy{padding:11px 13px}.photo-realism-copy strong{display:block;font-size:11px;color:#d8e2ee}.photo-realism-copy p{margin:5px 0 0;color:#95a5b8;font-size:10.5px;line-height:1.55}.photo-realism-check{display:flex;gap:8px;align-items:flex-start;margin:0 13px 13px;padding:10px;border:1px solid rgba(75,212,155,.28);border-radius:10px;background:rgba(75,212,155,.06);font-size:10.5px;color:#caeee0}.photo-realism-check input{margin-top:2px;accent-color:#4bd49b}
@media(max-width:820px){.photo-realism-head{align-items:flex-start;flex-direction:column}.photo-realism-stage{min-height:160px}.photo-realism-copy p,.photo-realism-check{font-size:11.5px}}
`;
if(!document.getElementById('photo-realism-css')){const s=document.createElement('style');s.id='photo-realism-css';s.textContent=CSS;document.head.appendChild(s)}
function viewer(asset,title,views,check){
  const first=views[0];
  return `<section class="photo-realism"><div class="photo-realism-head"><span class="photo-realism-badge">Generated photorealistic reference</span><strong>${title}</strong></div><div class="photo-realism-tabs">${views.map((v,i)=>`<button class="${i===0?'active':''}" data-pr-tab="${i}">${v.label}</button>`).join('')}</div><div class="photo-realism-stage"><img src="${asset}" alt="${title}" loading="lazy"></div><div class="photo-realism-copy"><strong data-pr-title>${first.title}</strong><p data-pr-copy>${first.copy}</p></div><label class="photo-realism-check"><input type="checkbox" data-pr-check><span>${check}</span></label></section>`;
}
function wire(box,views){
  box.querySelectorAll('[data-pr-tab]').forEach(btn=>btn.onclick=()=>{box.querySelectorAll('[data-pr-tab]').forEach(x=>x.classList.toggle('active',x===btn));const v=views[Number(btn.dataset.prTab)];box.querySelector('[data-pr-title]').textContent=v.title;box.querySelector('[data-pr-copy]').textContent=v.copy});
  const cb=box.querySelector('[data-pr-check]');if(cb){const key='pi-photo-check:'+location.pathname+':'+document.querySelector('.guide-card h2')?.textContent;cb.checked=localStorage.getItem(key)==='1';cb.onchange=()=>localStorage.setItem(key,cb.checked?'1':'0')}
}
function enhance(){
  document.querySelectorAll('.guide-card').forEach(g=>{
    if(g.dataset.photoRealism==='1')return;
    const h=(g.querySelector('h2')?.textContent||'').toLowerCase();
    const project=(document.querySelector('.project-hero h1')?.textContent||'').toLowerCase();
    let asset,title,views,check;
    if(/dsi|ribbon|display cable|touch display/.test(h)){
      asset=ASSETS.dsi;title='DSI ribbon orientation and seating';check='My ribbon orientation, connector seating, and powered-on result match the visual reference.';
      views=[
        {label:'Correct',title:'Correct connection',copy:'Match the ribbon orientation and fully seated connector before restoring USB-C power.'},
        {label:'Common mistake',title:'What to avoid',copy:'Do not insert the ribbon upside down, leave it partially seated, or force the latch closed.'},
        {label:'Close-up',title:'Inspect the connector',copy:'Look closely at the cable edge, exposed contacts, latch position, and straight seating.'},
        {label:'Expected result',title:'What success looks like',copy:'After power-up, the display should initialize normally without flicker, blank output, or a loose-cable warning.'}
      ];
    }else if(/port map|identify.*port|first-boot hardware|locate.*port/.test(h)){
      asset=ASSETS.ports;title='Raspberry Pi 5 port map';check='I can identify the correct power, HDMI, USB, Ethernet, GPIO, microSD, and display connections on my Pi.';
      views=[
        {label:'Overview',title:'Identify before connecting',copy:'Use the labeled board reference to locate each connector before plugging in a cable.'},
        {label:'Power',title:'USB-C power',copy:'Keep USB-C power disconnected while you are installing or moving display and GPIO hardware.'},
        {label:'Display',title:'HDMI and DSI are different',copy:'Micro-HDMI is for external monitors. DSI is the ribbon-cable display connector used by the touchscreen build.'}
      ];
    }else if(project.includes('smart mirror')&&/final|calibrat|finish|mirror|assemble|layer|mount/.test(h)){
      asset=ASSETS.mirror;title='Smart Mirror finished-result target';check='My assembly is aligned, dark areas disappear behind the mirror, and illuminated dashboard content is readable.';
      views=[
        {label:'Expected result',title:'Finished visual target',copy:'The mirror should look clean when pixels are black and reveal the dashboard only where the display is illuminated.'},
        {label:'Alignment',title:'Center the active display area',copy:'Check that the visible dashboard sits where you intended and the frame does not expose bright gaps.'},
        {label:'Blackout',title:'Hide the unused interior',copy:'Any bright interior surface can show through. Blackout masking should surround the active display.'},
        {label:'Calibration',title:'Tune brightness last',copy:'Adjust brightness only after the mirror, display, masking, and room-lighting conditions are final.'}
      ];
    }else return;
    const host=g.querySelector('.step-image')||g.querySelector('.lead')||g.querySelector('h2');
    host.insertAdjacentHTML('afterend',viewer(asset,title,views,check));
    const box=host.nextElementSibling;wire(box,views);g.dataset.photoRealism='1';
  });
}
new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',enhance);setTimeout(enhance,500);
})();