const fs=require('fs'),vm=require('vm');
const required=['index.html','course-v2.css','course-v4.css','course-v2-data.js','course-v2-fixes.js','course-v4-enhancements.js','course-v9-prerequisite.js','course-v10-photos.js','course-v2.js','sw.js','assets/photo-sprite-v3.jpg','assets/reference/pi5-board.svg','assets/reference/dsi-ribbon.svg','assets/reference/imager-flow.svg'];
for(const f of required)if(!fs.existsSync(f))throw new Error(`Missing ${f}`);
for(const f of ['course-v2.js','course-v2-fixes.js','course-v4-enhancements.js','course-v9-prerequisite.js','course-v10-photos.js'])new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});
const dummyEl=()=>({style:{},dataset:{},setAttribute(){},replaceWith(){},appendChild(){},querySelectorAll(){return[]}});
const document={head:{appendChild(){}},documentElement:{},createElement:dummyEl,querySelectorAll(){return[]}};
const context={window:{},console,document,URL,requestAnimationFrame:()=>{},MutationObserver:function(){this.observe=()=>{}},setTimeout,clearTimeout};
vm.createContext(context);
for(const f of ['course-v2-data.js','course-v2-fixes.js','course-v4-enhancements.js','course-v9-prerequisite.js','course-v10-photos.js'])new vm.Script(fs.readFileSync(f,'utf8'),{filename:f}).runInContext(context);
const courses=context.window.PI_COURSES_V2;if(!Array.isArray(courses)||courses.length!==11)throw new Error(`Expected 11 courses including prerequisite, got ${courses?.length}`);
if(courses[0]?.id!=='pi-setup'||courses[0].phases.length!==8)throw new Error('START HERE prerequisite must be first with 8 phases');
let phases=0,visualPhases=0,spriteRefs=0;const unique=new Set();
for(const c of courses){for(const p of c.phases){phases++;const photos=p.visual?.photos||[];if(!photos.length)throw new Error(`Missing V10 visual: ${c.id} / ${p.title}`);visualPhases++;for(const x of photos){const src=x.src||'';if(/\.(?:jpg|jpeg)(?:\?|#|$)/i.test(src)&&!src.includes('/assets/photo-sprite-v3.jpg#piPhoto='))throw new Error(`Unapproved legacy bitmap survived V10: ${c.id} / ${p.title} / ${src}`);const m=src.match(/photo-sprite-v3\.jpg#piPhoto=([^&]+)/);if(m){spriteRefs++;unique.add(decodeURIComponent(m[1]));}}}}
if(unique.size<25)throw new Error(`Expected broad V10 photo coverage, got only ${unique.size} unique sprite cells`);
const spriteBytes=fs.statSync('assets/photo-sprite-v3.jpg').size;if(spriteBytes<300000)throw new Error(`Verified photo sprite looks truncated: ${spriteBytes} bytes`);
const index=fs.readFileSync('index.html','utf8');for(const token of ['Pi Command Center • V10','course-v10-photos.js?v=10.0.0','course-v9-prerequisite.js?v=10.0.0'])if(!index.includes(token))throw new Error(`Missing V10 shell token ${token}`);
const sw=fs.readFileSync('sw.js','utf8');if(!sw.includes("pi-command-course-v10")||!sw.includes('photo-sprite-v3.jpg?v=10.0.1'))throw new Error('Service worker is not V10 verified-photo-aware');
console.log(`COURSE_VALIDATION_OK courses=${courses.length} phases=${phases} visualPhases=${visualPhases} uniquePhotoCells=${unique.size} spriteRefs=${spriteRefs} spriteBytes=${spriteBytes} prerequisite=8 cache=v10`);