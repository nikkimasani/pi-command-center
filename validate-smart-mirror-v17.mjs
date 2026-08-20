import fs from 'node:fs';

const fail=[];
const requireText=(p,min=1)=>{
  if(!fs.existsSync(p)){fail.push(`missing file: ${p}`);return ''}
  const size=fs.statSync(p).size;
  if(size<min)fail.push(`file too small: ${p} (${size} bytes, expected >= ${min})`);
  return fs.readFileSync(p,'utf8');
};

const html=requireText('index.html',50000);
const js=requireText('smart-mirror-v17.js',20000);
const responsive=requireText('responsive-v1.js',4000);
const setup=requireText('shared-setup-v2.js',8000);
const courses=requireText('project-courses-v1.js',12000);
const sw=requireText('sw.js',1500);
const vercel=requireText('vercel.json',300);
const icon192=requireText('icon-192.svg',500);
const icon512=requireText('icon-512.svg',500);
const iconMask=requireText('icon-maskable.svg',500);

if(!html.includes('/responsive-v1.js?v=1.0'))fail.push('built index is missing responsive V1 layer');
if(!html.includes('/shared-setup-v2.js?v=2.0'))fail.push('built index is missing Shared Setup V2');
if(!html.includes('/smart-mirror-v17.js?v=17.2'))fail.push('built index is missing Smart Mirror V17.2');
if(!html.includes('/project-courses-v1.js?v=1.0'))fail.push('built index is missing Project Courses V1');
if(/smart-mirror-v1(?:0|1|2|3|4|5|6)[^"']*\.js/i.test(html))fail.push('built index still contains a legacy Smart Mirror enhancement script');
if(html.includes('🍓'))fail.push('built production shell still contains the strawberry placeholder');
if(!html.includes('<link rel="icon" href="/icon-192.svg">'))fail.push('production favicon tag is not exact');
if(html.includes('</svg>">'))fail.push('production favicon markup contains malformed SVG data-URI remnants');
if(!html.includes('queueMicrotask(()=>{if(window.renderHome'))fail.push('first-load home metadata rerender is missing');
if(!js.includes('SMART_MIRROR_STEP_COUNT = 16'))fail.push('V17 does not declare the required 16-step course');

const setupAssets=[
  'assets/setup/v2/step-01-microsd-setup.svg','assets/setup/v2/step-02-imager-settings.svg','assets/setup/v2/step-03-metal-case-assembly.svg','assets/setup/v2/step-04-first-boot-guide.svg','assets/setup/v2/step-05-dsi-connection-guide.svg','assets/setup/v2/step-06-build-verification.svg'
];
for(const p of setupAssets){
  const svg=requireText(p,2000);
  if(!svg.includes('<svg')||!svg.includes('1122')||!svg.includes('1402'))fail.push(`invalid Setup V2 SVG: ${p}`);
  if(svg.includes('🍓'))fail.push(`strawberry placeholder found in ${p}`);
}
for(let i=1;i<=6;i++) if(!setup.includes(`id: ${i}`)) fail.push(`Shared Setup manifest missing step ${i}`);

const foundationStart=html.indexOf('window.PI_FOUNDATION=[');
const foundationEnd=html.indexOf('window.PI_PROJECTS=[',foundationStart);
const foundationHtml=foundationStart>=0&&foundationEnd>foundationStart?html.slice(foundationStart,foundationEnd):'';
if(!foundationHtml)fail.push('built HTML Shared Setup fallback dataset is missing');
for(const p of setupAssets){
  const webPath='/'+p;
  if(!setup.includes(webPath)) fail.push(`Shared Setup manifest missing asset path ${webPath}`);
  if(!sw.includes(webPath)) fail.push(`service worker missing Setup V2 asset ${webPath}`);
  if(!foundationHtml.includes(webPath)) fail.push(`base Shared Setup fallback missing V2 asset ${webPath}`);
}
if((foundationHtml.match(/F\('/g)||[]).length!==6)fail.push('base Shared Setup fallback is not exactly six steps');
const forbiddenFoundation=['/assets/projects/smart-mirror/v15/step-01-parts.jpg','/assets/setup/imager-ssh-generated.jpg','/assets/generic/pi5-board.jpg','/assets/boot-screen.jpg'];
for(const ref of forbiddenFoundation) if(foundationHtml.includes(ref)) fail.push(`legacy/fallback image remains inside Shared Setup dataset: ${ref}`);

if(!setup.includes('window.SHARED_PI_SETUP_V2'))fail.push('Shared Setup V2 does not expose its strict manifest');
if(!setup.includes('sharedSetupV2Render'))fail.push('Shared Setup V2 renderer override is missing');
if(!setup.includes('@media(max-width:900px)')||!setup.includes('@media(max-width:560px)'))fail.push('Shared Setup V2 responsive breakpoints are missing');

const bannedSetupRefs=['/assets/projects/smart-mirror/v15/step-01-parts.jpg','/assets/setup/imager-ssh-generated.jpg'];
for(const ref of bannedSetupRefs) if(html.includes(ref)) fail.push(`legacy setup asset remains in built HTML: ${ref}`);
if(vercel.includes('seed-setup-v2-assets.mjs'))fail.push('Vercel still depends on the failed Canva setup seeder');
if(!sw.includes("pi-command-v56"))fail.push('service worker cache was not bumped to V56');
for(const asset of ['/shared-setup-v2.js','/smart-mirror-v17.js','/responsive-v1.js','/project-courses-v1.js']) if(!sw.includes(asset)) fail.push(`service worker missing ${asset}`);
if(!vercel.includes('/project-courses-v1.js'))fail.push('Vercel no-store header for Project Courses V1 is missing');

const responsiveChecks=['@media (max-width:980px)','@media (max-width:760px)','@media (max-width:480px)','orientation:landscape','pointer:coarse','prefers-reduced-motion','100dvh','env(safe-area-inset-bottom)','overflow-x:hidden'];
for(const token of responsiveChecks) if(!responsive.includes(token)) fail.push(`responsive layer missing: ${token}`);
for(const [name,content] of [['icon-192.svg',icon192],['icon-512.svg',icon512],['icon-maskable.svg',iconMask]]){
  if(content.includes('🍓'))fail.push(`${name} still contains strawberry artwork`);
  if(!content.includes('#c51a4a')||!content.includes('#65ad4b'))fail.push(`${name} is missing raspberry fruit artwork`);
}

const manifestStart=js.indexOf('const VISUAL_MANIFEST');
const manifestEnd=js.indexOf('const step=');
const manifest=js.slice(manifestStart,manifestEnd);
for(let i=1;i<=16;i++) if(!manifest.includes(`${i}:`)) fail.push(`Smart Mirror visual manifest missing step ${i}`);
for(const fn of ['portsVisual','osVisual','terminal','dsiVisual','displayVisual','editorVisual','mirrorVisual','systemdVisual','frameVisual','wiringVisual','backVisual','mountVisual','visualFor']) if(!js.includes(`function ${fn}`)) fail.push(`missing Smart Mirror visual renderer: ${fn}`);
if(js.includes('SPRITE_PAYLOAD')||js.includes('visual-sprite.b64'))fail.push('V17 still depends on the corrupted sprite pipeline');
if(!js.includes("genericHardware.style.display='none'"))fail.push('generic hardware fallback is not disabled for Smart Mirror');
if(!js.includes("quicklinks.style.display='none'"))fail.push('generic project quick links are not disabled for Smart Mirror');

for(const token of ['Project Progress','Project Files','data-view="progress"','projectFiles','function diagram','mode=\'gpio\'','mode=\'screen\'','mode=\'thermal\'','mode=\'security\'','mode=\'boot\'']) if(!courses.includes(token)) fail.push(`Project Courses V1 missing ${token}`);
if(!courses.includes("p.id==='smart-mirror'"))fail.push('Project Courses V1 does not preserve Smart Mirror V17 ownership');
if(!courses.includes("hw.style.display='none'"))fail.push('Project Courses V1 does not suppress generic hardware placeholders');
if(!courses.includes("ql.style.display='none'"))fail.push('Project Courses V1 does not suppress generic project quick links');
if(!courses.includes('@media(max-width:760px)'))fail.push('Project Courses V1 mobile breakpoint is missing');
for(const id of ['dashboard','ai-terminal','cyberdeck','home-panel','electronics-lab','pomodoro','glance','photo-frame','magic-frame']) if(!html.includes(`P('${id}'`)) fail.push(`base project dataset missing ${id}`);

if(fail.length){console.error('\nPi Command Center release validation FAILED');fail.forEach(x=>console.error(' - '+x));process.exit(1);}
console.log('Pi Command Center validation passed: Shared Setup V2 + Smart Mirror V17.2 + Project Courses V1 + Progress + Project Files + responsive V1 + V56 cache.');
