(()=>{
'use strict';
const rename=s=>typeof s==='string'?s.replace(/Pi Command Center/g,'Pi Hub').replace(/Pi Command\b/g,'Pi Hub'):s;
const walk=v=>{
  if(Array.isArray(v)){for(let i=0;i<v.length;i++)v[i]=typeof v[i]==='string'?rename(v[i]):walk(v[i]);return v;}
  if(v&&typeof v==='object'){for(const k of Object.keys(v))v[k]=typeof v[k]==='string'?rename(v[k]):walk(v[k]);}
  return v;
};
walk(window.PI_COURSES_V2||[]);
document.title=document.title.replace(/Pi Command Center/g,'Pi Hub').replace(/Pi Command\b/g,'Pi Hub');
window.PI_HUB_BRAND='12.0.0';
})();
