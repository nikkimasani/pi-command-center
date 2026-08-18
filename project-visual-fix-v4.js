(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const MAP={
 mirror:'/assets/smart-mirror-finished-reference.jpg',ports:'/assets/pi5-port-map-reference.jpg',boot:'/assets/boot-screen.jpg',display:'/assets/smart-mirror/display-test.jpg',touch:'/assets/smart-mirror/touch-test.jpg',find:'/assets/smart-mirror/dsi-find.jpg',align:'/assets/smart-mirror/dsi-align.jpg',seat:'/assets/smart-mirror/dsi-seated.jpg',wrong:'/assets/smart-mirror/dsi-wrong.jpg'
};
function smartMirrorSrc(t){t=t.toLowerCase();
 if(/open.*dsi|find.*dsi|connector latch|locate.*connector/.test(t))return MAP.find;
 if(/orient|hold.*ribbon|contact side|insertion direction/.test(t))return MAP.align;
 if(/insert.*ribbon|fully seated|close.*latch|lock.*connector|repeat.*display end/.test(t))return MAP.seat;
 if(/touch|tap.*control|finger/.test(t))return MAP.touch;
 if(/power.*display|power.*pi|boot|screen.*light|black test page|white text|brightness|chromium|kiosk/.test(t))return MAP.display;
 if(/micro.?sd|usb-c|micro.?hdmi|ethernet|usb port|pi 5|metal case|gpio/.test(t))return MAP.ports;
 if(/mirror|acrylic|reflection|shadow box|blackout|mask|front|standing angle|room light/.test(t))return MAP.mirror;
 return null;
}
function apply(){
 const root=q('#pcRoot');if(!root)return;
 const pTitle=q('.pc-rail h3',root)?.textContent?.trim();
 const action=q('.pc-layout main > h1',root)?.textContent?.trim()||'';
 const figure=q('.pc-photo',root);
 if(figure){
   q('.pc-photo-head button',figure)?.remove();
   const img=q(':scope > img',figure);
   if(pTitle==='Smart Mirror'&&img){const src=smartMirrorSrc(action);if(src)img.src=src;}
   figure.style.margin='14px 0';
 }
 const screen=q('.pc-screen',root);if(screen){screen.style.margin='14px 0';}
}
const css=document.createElement('style');css.textContent=`#pcRoot .pc-photo-head{padding:11px 13px}#pcRoot .pc-photo-head strong{font-size:14px}#pcRoot .pc-photo>img{display:block!important;width:100%!important;max-height:none!important;min-height:260px!important;object-fit:contain!important;background:#05090f}#pcRoot .pc-photo figcaption{font-size:13px!important;padding:12px 14px!important}#pcRoot .pc-screen{min-height:300px}#pcRoot .pc-appmock,#pcRoot .pc-terminal,#pcRoot .pc-deck{min-height:260px}@media(max-width:600px){#pcRoot .pc-photo>img{min-height:220px!important}#pcRoot .pc-photo-head strong{font-size:15px}}`;document.head.appendChild(css);
new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(apply,400);
})();