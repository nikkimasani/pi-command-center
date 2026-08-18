(()=>{
'use strict';
const VISUALS={
  'smart-mirror/p1/s6-microsd-insert.jpg':{src:'https://www.raspberrypi.com/app/uploads/2024/10/BUMPER-AND-CARD-1-800x536.jpg',alt:'Raspberry Pi 5 microSD insertion orientation reference',caption:'Insert the microSD card with the Pi powered off. This official Raspberry Pi reference shows the slot and insertion direction; your SanDisk 128 GB card uses the same physical orientation.',source:'Raspberry Pi'},
  'smart-mirror/p2/s2-display-dsi.jpg':{src:'https://m.media-amazon.com/images/I/71ohFpc8HzL._AC_SL1200_.jpg',alt:'Hosyond 7-inch touchscreen DSI connection guide for Raspberry Pi 5',caption:'Hosyond hardware reference for the Pi 5 and display-side DSI connection. Match the connector latch and cable orientation before applying power.',source:'Hosyond manual'},
  'smart-mirror/p6/s1-dry-fit.jpg':{src:'/assets/smart-mirror/p6/s1-dry-fit.jpg',alt:'Open 12 by 12 shadow box with mirror acrylic, Hosyond display, Pi case, and cables dry-fitted before adhesive',caption:'Dry-fit every layer first. Confirm cable reach, back-panel clearance, and display position before using Velcro.'},
  'smart-mirror/p6/s2-iuniker-case.jpg':{src:'https://m.media-amazon.com/images/I/71T0l0LsiiL._AC_SL1500_.jpg',alt:'Raspberry Pi 5 seated in the iUniker passive aluminum cooling case with the top shell removed',caption:'Use this iUniker Pi 5 case reference to confirm board orientation and port alignment before closing the passive aluminum shell. Keep the DSI cable path clear.',source:'iUniker manual'},
  'smart-mirror/p6/s3-mirror-clean-layer.jpg':{src:'/assets/smart-mirror/p6/s3-mirror-clean-layer.jpg',alt:'Clean two-way acrylic mirror being lowered into the shadow-box front',caption:'Clean the acrylic immediately before placement so dust and fingerprints are not trapped inside the finished mirror.'},
  'smart-mirror/p6/s4-display-position.jpg':{src:'/assets/smart-mirror/p6/s4-display-position.jpg',alt:'Seven-inch touchscreen centered behind the 12 by 12 two-way mirror acrylic',caption:'Center the active display area behind the mirror before marking the final mounting position.'},
  'smart-mirror/p6/s5-display-velcro.jpg':{src:'/assets/smart-mirror/p6/s5-display-velcro.jpg',alt:'Heavy-duty Velcro applied only to safe display mounting edges',caption:'Place Velcro only on safe mounting surfaces. Keep adhesive away from electronics, vents, connectors, and the active screen.'},
  'smart-mirror/p6/s6-pi-placement.jpg':{src:'/assets/smart-mirror/p6/s6-pi-placement.jpg',alt:'iUniker Pi 5 case positioned beside the display with relaxed DSI cable routing and accessible USB-C power port',caption:'Position the Pi so the DSI cable has slack, the USB-C port remains reachable, and the back panel does not press on the case.'},
  'smart-mirror/p6/s7-cable-routing.jpg':{src:'/assets/smart-mirror/p6/s7-cable-routing.jpg',alt:'Rear Smart Mirror assembly showing gentle DSI curve, USB-C exit path, and strain relief',caption:'Route both cables before closing the back. Nothing should be pinched, sharply folded, or pulled tight.'},
  'smart-mirror/p7/s1-open-back-power-test.jpg':{src:'/assets/smart-mirror/p7/s1-open-back-power-test.jpg',alt:'Assembled Smart Mirror powered on with the rear panel still open for inspection',caption:'Run the first assembled power test with the back still accessible so cable pressure and component movement can be checked.'},
  'smart-mirror/p7/s3-closed-back.jpg':{src:'/assets/smart-mirror/p7/s3-closed-back.jpg',alt:'Finished rear Smart Mirror assembly with back panel closed and power cable exiting cleanly',caption:'The closed back should sit flat without pressure on the display, Pi case, DSI ribbon, or USB-C cable.'},
  'smart-mirror/p8/s1-placement.jpg':{src:'/assets/smart-mirror/p8/s1-placement.jpg',alt:'Finished Smart Mirror shown in stable desk placement and safe wall-mounted placement',caption:'Choose a stable final position that preserves ventilation, cable clearance, and access for future maintenance.'}
};
window.SMART_MIRROR_VISUALS=VISUALS;
function bind(){
  if(!document.body.classList.contains('sm6-active'))return;
  document.querySelectorAll('.sm6-pending').forEach(card=>{
    if(card.dataset.bound==='1')return;
    const id=card.querySelector('code')?.textContent?.trim();
    const meta=VISUALS[id];
    if(!meta)return;
    card.dataset.bound='1';
    const img=new Image();
    img.alt=meta.alt;
    img.loading='eager';
    img.onload=()=>{
      const fig=document.createElement('figure');
      fig.className='sm6-photo sm6-manifest-photo';
      const source=meta.source?`<small class="sm6-photo-source">Reference source: ${meta.source}</small>`:'';
      fig.innerHTML=`<img src="${meta.src}" alt="${meta.alt.replace(/"/g,'&quot;')}"><figcaption>${meta.caption}${source}</figcaption>`;
      card.replaceWith(fig);
    };
    img.onerror=()=>{
      card.className='sm6-photo-awaiting';
      card.innerHTML=`<div class="sm6-photo-awaiting-icon">📷</div><div><b>Exact photo reference is being prepared</b><p>${meta.caption}</p><small>Use the written actions and Expected Result for this step. The course will not substitute a misleading generic photo.</small></div>`;
    };
    img.src=meta.src;
  });
}
const style=document.createElement('style');
style.textContent=`.sm6-photo-awaiting{display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;align-items:start;margin:16px 0;padding:15px;border:1px solid #3b4f66;border-radius:14px;background:#0a1420}.sm6-photo-awaiting-icon{font-size:26px;line-height:1}.sm6-photo-awaiting b{display:block;color:#eef4ff;margin-bottom:5px}.sm6-photo-awaiting p{margin:0 0 7px;color:#b6c3d4;line-height:1.5}.sm6-photo-awaiting small{color:#8293a8;line-height:1.45}.sm6-manifest-photo img{width:100%;height:auto;display:block}.sm6-photo-source{display:block;margin-top:6px;color:#78aee8!important;font-size:11px}`;
document.head.appendChild(style);
new MutationObserver(()=>requestAnimationFrame(bind)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
setTimeout(bind,350);
})();
