(()=>{
'use strict';
const MAP={
'smart-mirror':['smart_1','shared_05','shared_07','smart_3','smart_3','dsi_5','shared_07','detail_11','smart_4','detail_11'],
'dashboard':['dashboard_1','dashboard_2','dashboard_3','dashboard_4','detail_14','dashboard_4','dashboard_4','dashboard_4','detail_12'],
'ai-terminal':['ai_1','shared_05','detail_05','ai_4','ai_3','ai_3','detail_10','ai_4','detail_05'],
'cyberdeck':['cyber_1','shared_05','detail_12','cyber_1','cyber_2','cyber_2','cyber_4','cyber_4','detail_02'],
'home-panel':['home_1','shared_05','home_3','home_4','home_2','detail_14','home_4','detail_04','detail_09'],
'electronics-lab':['electronics_1','shared_05','electronics_1','electronics_2','electronics_4','detail_08','detail_13','shared_08','detail_13'],
'pomodoro':['pomodoro_1','shared_05','pomodoro_3','pomodoro_3','pomodoro_4','pomodoro_2','electronics_4','shared_11','shared_11'],
'glance':['glance_1','shared_05','glance_3','glance_4','glance_3','glance_4','glance_4','glance_2'],
'photo-frame':['photo_1','shared_05','shared_12','photo_3','photo_3','shared_12','photo_3','shared_12','photo_2'],
'magic-frame':['magic_1','shared_05','magic_4','magic_3','magic_4','magic_4','magic_2','magic_4','magic_1']
};
const courses=window.PI_COURSES_V2||[];
for(const course of courses){
 const keys=MAP[course.id];
 if(!keys||keys.length!==course.phases.length){console.error('PHOTO_V3_MAP_MISMATCH',course.id,keys?.length,course.phases.length);continue;}
 course.phases.forEach((phase,i)=>{
  const v=phase.visual||(phase.visual={});
  const existing=[];
  if(Array.isArray(v.photos)) existing.push(...v.photos);
  if(v.photo&&!existing.some(x=>x&&x.src===v.photo)) existing.push({label:'Verified reference',src:v.photo,caption:v.caption||phase.title});
  const key=keys[i];
  v.photos=[{label:'Realistic step view',src:`/assets/photo-sprite-v3.jpg#piPhoto=${encodeURIComponent(key)}`,caption:`Photorealistic instructional reference for “${phase.title}”. Use the written labels and safety notes for exact connector orientation and electrical details.`},...existing];
  v.photo=null;
  v.photoAssetKey=key;
 });
}
window.PI_PHOTO_MAP_V3=MAP;
window.PI_PHOTO_BIND_V3='3.0.0';
})();