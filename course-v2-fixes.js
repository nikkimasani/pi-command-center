(()=>{
'use strict';
const courses=window.PI_COURSES_V2||[];
for(const course of courses){
  for(const phase of course.phases||[]){
    if(Array.isArray(phase.warning)&&phase.warning.length===0) phase.warning='';
    if(phase.warning==null) phase.warning='';
    if(!Array.isArray(phase.trouble)) phase.trouble=[];
    if(!Array.isArray(phase.commands)) phase.commands=[];
  }
}
window.PI_COURSES_V2_PATCH='2.0.1';
})();