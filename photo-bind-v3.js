(()=>{
'use strict';
const MAP={
'smart-mirror':['smart_1','shared_05','smart_4','smart_3','smart_3','dsi_5','smart_4','detail_09','smart_4','detail_09'],
'dashboard':['dashboard_1','dashboard_2','dashboard_3','dashboard_4','dashboard_4','dashboard_4','dashboard_4','dashboard_4','detail_12'],
'ai-terminal':['ai_1','shared_05','ai_4','ai_4','ai_3','ai_3','ai_2','ai_4','ai_1'],
'cyberdeck':['cyber_1','shared_05','detail_12','cyber_1','cyber_2','cyber_2','cyber_4','cyber_4','cyber_2'],
'home-panel':['home_1','shared_05','home_3','home_4','home_2','home_4','home_4','home_4','detail_09'],
'electronics-lab':['electronics_1','shared_05','electronics_1','electronics_2','electronics_4','electronics_4','shared_08','shared_08','shared_08'],
'pomodoro':['pomodoro_1','shared_05','pomodoro_3','pomodoro_3','pomodoro_4','pomodoro_2','electronics_4','shared_11','shared_11'],
'glance':['glance_1','shared_05','glance_3','glance_4','glance_3','glance_4','glance_4','glance_2'],
'photo-frame':['photo_1','shared_05','shared_12','photo_3','photo_3','shared_12','photo_3','shared_12','photo_2'],
'magic-frame':['magic_1','shared_05','magic_4','magic_3','magic_4','magic_4','magic_2','magic_4','magic_1']
};
const AVAILABLE=['smart_1','smart_2','smart_3','smart_4','dashboard_1','dashboard_2','dashboard_3','dashboard_4','ai_1','ai_2','ai_3','ai_4','cyber_1','cyber_2','cyber_3','cyber_4','home_1','home_2','home_3','home_4','electronics_1','electronics_2','electronics_3','electronics_4','pomodoro_1','pomodoro_2','pomodoro_3','pomodoro_4','glance_1','glance_2','glance_3','glance_4','photo_1','photo_2','photo_3','magic_1','magic_2','magic_3','magic_4','shared_05','shared_06','shared_08','shared_09','shared_10','shared_11','shared_12','detail_06','detail_09','detail_12','dsi_5'];
const available=new Set(AVAILABLE),courses=window.PI_COURSES_V2||[];
for(const course of courses){
 const keys=MAP[course.id];
 if(!keys||keys.length!==course.phases.length){console.error('PHOTO_V3_MAP_MISMATCH',course.id,keys?.length,course.phases.length);continue;}
 course.phases.forEach((phase,i)=>{
  const key=keys[i];if(!available.has(key)){console.error('PHOTO_V3_ASSET_MISSING',course.id,i,key);return;}
  const v=phase.visual||(phase.visual={}),existing=[];
  if(Array.isArray(v.photos)) existing.push(...v.photos);
  if(v.photo&&!existing.some(x=>x&&x.src===v.photo)) existing.push({label:'Verified reference',src:v.photo,caption:v.caption||phase.title});
  v.photos=[{label:'Realistic step view',src:`/assets/photo-sprite-v3.jpg#piPhoto=${encodeURIComponent(key)}`,caption:`Photorealistic instructional reference for “${phase.title}”. Use the written labels and safety notes for exact connector orientation and electrical details.`},...existing];
  v.photo=null;v.photoAssetKey=key;
 });
}
window.PI_PHOTO_MAP_V3=MAP;window.PI_PHOTO_AVAILABLE_V3=AVAILABLE;window.PI_PHOTO_BIND_V3='3.0.1';
})();