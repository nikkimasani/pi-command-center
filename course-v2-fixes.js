(()=>{
'use strict';
const courses=window.PI_COURSES_V2||[];
for(const course of courses){
  for(const phase of course.phases||[]){
    if(Array.isArray(phase.warning)&&phase.warning.length===0)phase.warning='';
    if(phase.warning==null)phase.warning='';
    if(!Array.isArray(phase.trouble))phase.trouble=[];
    if(!Array.isArray(phase.commands))phase.commands=[];
    if(!phase.visual)phase.visual={scene:'guide',caption:''};
  }
}
// V10 owns visual selection. Do not clear photo assignments and do not rewrite
// rendered visual frames after course-v10-photos.js has mapped them.
window.PI_COURSES_V2_PATCH='10.0.3';
})();
