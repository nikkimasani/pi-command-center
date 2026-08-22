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
// Load the V15 exact high-resolution photo override. It waits for V14 mapping
// before replacing the selected Smart Mirror phase visuals.
const s=document.createElement('script');
s.src='/course-v15-hires.js?v=15.0.0';
s.async=true;
document.head.appendChild(s);
window.PI_COURSES_V2_PATCH='15.0.0';
})();
