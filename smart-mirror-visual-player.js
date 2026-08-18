(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const SETS={
  dsiPi:{
    label:'Pi-side DSI connection',
    tabs:[
      ['correct','Correct','/assets/smart-mirror/dsi-seated.jpg','The 22-pin ribbon is straight, evenly inserted, and the latch is fully closed.'],
      ['wrong','Common mistake','/assets/smart-mirror/dsi-wrong.jpg','Do not continue with a crooked, partly seated, reversed, or strained ribbon.'],
      ['close','Close-up','/assets/smart-mirror/dsi-align.jpg','Use this close view to compare the cable angle and connector alignment before closing the latch.'],
      ['expected','Expected result','/assets/smart-mirror/dsi-seated.jpg','Both ribbon edges sit at the same depth and the cable leaves the connector without a twist or sharp bend.']
    ]
  },
  dsiFind:{
    label:'Find the Pi 5 DSI connector',
    tabs:[
      ['correct','Correct','/assets/smart-mirror/dsi-find.jpg','Locate this exact connector before touching the latch.'],
      ['wrong','Common mistake','/assets/pi5-port-map-reference.jpg','Do not confuse the small display connector with USB-C power, micro-HDMI, GPIO, or another board connector.'],
      ['close','Close-up','/assets/smart-mirror/dsi-port-locate-generated.jpg','Compare the small connector body and latch position before inserting the ribbon.'],
      ['expected','Expected result','/assets/smart-mirror/dsi-find.jpg','You can point to the correct connector and the Pi is still fully powered off.']
    ]
  },
  displayTest:{
    label:'Loose display power test',
    tabs:[
      ['correct','Correct','/assets/smart-mirror/display-test.jpg','The loose Hosyond display shows the Raspberry Pi boot sequence or desktop before any mounting begins.'],
      ['wrong','Common mistake','/assets/smart-mirror/dsi-wrong.jpg','If the display stays blank, power off before touching either DSI connector. Never reseat a ribbon while powered.'],
      ['close','Close-up','/assets/smart-mirror/dsi-seated.jpg','Recheck both cable ends for even seating if the screen does not light.'],
      ['expected','Expected result','/assets/smart-mirror/display-test.jpg','The image is stable with no flicker, intermittent blanking, or cable strain.']
    ]
  },
  touch:{
    label:'Touchscreen verification',
    tabs:[
      ['correct','Correct','/assets/smart-mirror/touch-test.jpg','Touch input lands under your finger and works across the display.'],
      ['wrong','Common mistake','/assets/smart-mirror/touch-test.jpg','If a tap registers in another corner, stop and correct touch rotation before mounting.'],
      ['close','Close-up','/assets/smart-mirror/touch-test.jpg','Test all four corners and the center while the display is still loose.'],
      ['expected','Expected result','/assets/smart-mirror/touch-test.jpg','All tested points respond in the matching location with no intermittent loss of touch.']
    ]
  }
};
function pick(title=''){
  const t=title.toLowerCase();
  if(t.includes('connect the 22-pin end')||t.includes('pi-side')||t.includes('dsi cable to the pi'))return SETS.dsiPi;
  if(t.includes('display connector')||t.includes('locate')&&t.includes('dsi'))return SETS.dsiFind;
  if(t.includes('power on the loose pi')||t.includes('loose pi and display')||t.includes('first assembled power test'))return SETS.displayTest;
  if(t.includes('touch'))return SETS.touch;
  return null;
}
function renderPlayer(set){
  const active=set.tabs[0];
  return `<section class="sm6-card sm6-visual-player" data-vp-active="${active[0]}"><div class="sm6-vp-head"><div><small>VISUAL REFERENCE</small><h2>${esc(set.label)}</h2></div><span>Compare before continuing</span></div><div class="sm6-vp-tabs">${set.tabs.map((x,i)=>`<button type="button" data-vp-tab="${x[0]}" class="${i===0?'active':''}">${esc(x[1])}</button>`).join('')}</div><div class="sm6-vp-stage"><img src="${active[2]}" alt="${esc(active[3])}"><div class="sm6-vp-copy"><b>${esc(active[1])}</b><p>${esc(active[3])}</p></div></div><div class="sm6-vp-thumbs">${set.tabs.map((x,i)=>`<button type="button" data-vp-thumb="${x[0]}" class="${i===0?'active':''}"><img src="${x[2]}" alt=""><span>${esc(x[1])}</span></button>`).join('')}</div></section>`;
}
function bindPlayer(player,set){
  const select=id=>{
    const item=set.tabs.find(x=>x[0]===id)||set.tabs[0];
    player.dataset.vpActive=id;
    qa('[data-vp-tab]',player).forEach(b=>b.classList.toggle('active',b.dataset.vpTab===id));
    qa('[data-vp-thumb]',player).forEach(b=>b.classList.toggle('active',b.dataset.vpThumb===id));
    const img=q('.sm6-vp-stage img',player),copy=q('.sm6-vp-copy',player);
    if(img){img.src=item[2];img.alt=item[3]}
    if(copy)copy.innerHTML=`<b>${esc(item[1])}</b><p>${esc(item[3])}</p>`;
  };
  qa('[data-vp-tab]',player).forEach(b=>b.onclick=()=>select(b.dataset.vpTab));
  qa('[data-vp-thumb]',player).forEach(b=>b.onclick=()=>select(b.dataset.vpThumb));
}
function enhance(){
  if(!document.body.classList.contains('sm6-active'))return;
  const article=q('#sm6Root .sm6-step');if(!article||q('.sm6-visual-player',article))return;
  const title=q('h1',article)?.textContent||'';
  const set=pick(title);if(!set)return;
  const why=q('.sm6-why',article);
  if(!why)return;
  why.insertAdjacentHTML('afterend',renderPlayer(set));
  bindPlayer(q('.sm6-visual-player',article),set);
}
const style=document.createElement('style');
style.textContent=`.sm6-visual-player{border-color:#3b536f!important;background:linear-gradient(180deg,#0b1724,#08111b)!important}.sm6-vp-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.sm6-vp-head small{color:#72b8ff;font-weight:900;letter-spacing:.09em}.sm6-vp-head h2{margin:4px 0 0!important}.sm6-vp-head>span{font-size:11px;color:#8ea2b9;border:1px solid #304760;border-radius:999px;padding:5px 8px}.sm6-vp-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}.sm6-vp-tabs button{border:1px solid #344c65;background:#0b1724;color:#9fb0c5;padding:8px 11px;border-radius:8px;font-weight:800}.sm6-vp-tabs button.active{background:#6f49e9;border-color:#805cff;color:#fff}.sm6-vp-stage{overflow:hidden;border:1px solid #354c65;border-radius:13px;background:#050a10}.sm6-vp-stage>img{width:100%;max-height:560px;object-fit:contain;background:#05080c}.sm6-vp-copy{padding:12px 14px}.sm6-vp-copy b{display:block;margin-bottom:4px}.sm6-vp-copy p{margin:0;color:#aebdd0;line-height:1.5}.sm6-vp-thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}.sm6-vp-thumbs button{overflow:hidden;border:1px solid #2b3e53;background:#08111a;color:#9aaabe;border-radius:9px;padding:0;text-align:left}.sm6-vp-thumbs button.active{border-color:#805cff;box-shadow:0 0 0 1px #805cff}.sm6-vp-thumbs img{width:100%;aspect-ratio:16/9;object-fit:cover}.sm6-vp-thumbs span{display:block;padding:7px;font-size:10px;font-weight:800}@media(max-width:620px){.sm6-vp-head{display:block}.sm6-vp-head>span{display:inline-block;margin-top:8px}.sm6-vp-tabs{display:grid;grid-template-columns:1fr 1fr}.sm6-vp-tabs button{width:100%}.sm6-vp-thumbs{grid-template-columns:1fr 1fr}}`;
document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(enhance)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
setTimeout(enhance,500);
})();
