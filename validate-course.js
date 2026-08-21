const fs=require('fs');const vm=require('vm');
const required=['index.html','course-v2.html','course-v2.css','course-v2-data.js','course-v2-fixes.js','course-v2.js','sw.js'];for(const f of required){if(!fs.existsSync(f))throw new Error(`Missing ${f}`)}
new vm.Script(fs.readFileSync('course-v2.js','utf8'),{filename:'course-v2.js'});
new vm.Script(fs.readFileSync('course-v2-fixes.js','utf8'),{filename:'course-v2-fixes.js'});
const context={window:{}};vm.createContext(context);new vm.Script(fs.readFileSync('course-v2-data.js','utf8'),{filename:'course-v2-data.js'}).runInContext(context);new vm.Script(fs.readFileSync('course-v2-fixes.js','utf8'),{filename:'course-v2-fixes.js'}).runInContext(context);
const courses=context.window.PI_COURSES_V2;const expected=['smart-mirror','dashboard','ai-terminal','cyberdeck','home-panel','electronics-lab','pomodoro','glance','photo-frame','magic-frame'];
if(!Array.isArray(courses)||courses.length!==10)throw new Error(`Expected 10 courses, found ${courses?.length}`);
for(const id of expected){if(!courses.some(c=>c.id===id))throw new Error(`Missing course ${id}`)}
let phases=0,visuals=0,actions=0;
for(const c of courses){
 if(!c.title||!c.goal||!Array.isArray(c.materials)||c.materials.length<4)throw new Error(`Incomplete course metadata: ${c.id}`);
 if(!Array.isArray(c.safety)||!c.safety.length)throw new Error(`Missing safety guidance: ${c.id}`);
 if(!Array.isArray(c.phases)||c.phases.length<8)throw new Error(`Course ${c.id} has only ${c.phases?.length||0} phases`);
 for(const [i,p] of c.phases.entries()){
  phases++;
  if(!p.title||!p.why||!p.time)throw new Error(`Incomplete phase metadata: ${c.id} #${i+1}`);
  if(!p.visual||!p.visual.scene)throw new Error(`Missing visual: ${c.id} #${i+1}`);visuals++;
  if(!Array.isArray(p.actions)||p.actions.length<4)throw new Error(`Too few actions: ${c.id} #${i+1}`);
  for(const a of p.actions){if(!a.title||!a.detail)throw new Error(`Incomplete action: ${c.id} #${i+1}`);actions++}
  if(!Array.isArray(p.success)||!p.success.length)throw new Error(`Missing success gate: ${c.id} #${i+1}`);
  if(typeof p.warning!=='string')throw new Error(`Warning must be text: ${c.id} #${i+1}`);
  if(!Array.isArray(p.trouble))throw new Error(`Troubleshooting must be a list: ${c.id} #${i+1}`);
  if(!Array.isArray(p.commands))throw new Error(`Commands must be a list: ${c.id} #${i+1}`);
 }
}
const html=fs.readFileSync('index.html','utf8');for(const marker of ['COURSE ENGINE V2.0.0','course-v2-data.js?v=2.0.0','course-v2-fixes.js?v=2.0.1','course-v2.js?v=2.0.0','course-v2.css?v=2.0.0']){if(!html.includes(marker))throw new Error(`index.html missing ${marker}`)}
if(!fs.readFileSync('sw.js','utf8').includes('pi-command-course-v2'))throw new Error('Service worker cache version is not V2');
console.log(`COURSE_VALIDATION_OK courses=${courses.length} phases=${phases} visuals=${visuals} actions=${actions} version=${context.window.PI_COURSES_V2_VERSION} patch=${context.window.PI_COURSES_V2_PATCH}`);
