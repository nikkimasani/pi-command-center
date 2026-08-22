(()=>{
'use strict';
const courses=window.PI_COURSES_V2||[];
const smart=courses.find(c=>c.id==='smart-mirror');
if(!smart){window.PI_PHOTOS_V15={version:'15.0.0',mapped:0};return;}
const MAP={
  'Lay out, identify, and inspect every part':{
    src:'/assets/photos/v15/smart-mirror/smart-mirror-kit.svg?v=15.0.0',
    label:'High-resolution Smart Mirror kit reference',
    caption:'Full Smart Mirror hardware layout with Raspberry Pi 5, display, mirror, frame, cables, power, mounting hardware, and accessories.'
  },
  'Prove the mirror effect before cutting or mounting':{
    src:'/assets/photos/v15/smart-mirror/mirror-effect-test.svg?v=15.0.0',
    label:'High-resolution mirror effect test',
    caption:'Realistic Smart Mirror test setup showing the display and two-way mirror before permanent cutting or mounting.'
  },
  'Dry-fit the full frame stack':{
    src:'/assets/photos/v15/smart-mirror/exploded-frame-stack.svg?v=15.0.0',
    label:'High-resolution exploded frame stack',
    caption:'Exploded Smart Mirror assembly showing the frame, mirror, mask, display, Raspberry Pi, cable space, and rear panel.'
  },
  'Connect and route the DSI ribbon correctly':{
    src:'/assets/photos/v15/smart-mirror/dsi-ribbon-guide.svg?v=15.0.0',
    label:'High-resolution DSI ribbon connection guide',
    caption:'Close-up DSI ribbon connection reference showing safe alignment, seating, and cable routing.'
  }
};
let mapped=0;
smart.phases.forEach(phase=>{
  const ref=MAP[phase.title];
  if(!ref)return;
  phase.visual=phase.visual||{};
  phase.visual.photo=ref.src;
  phase.visual.photos=[{label:ref.label,src:ref.src,caption:ref.caption}];
  phase.visual.caption=ref.caption;
  mapped++;
});
window.PI_PHOTOS_V15={version:'15.0.0',mapped,expected:Object.keys(MAP).length};
})();
