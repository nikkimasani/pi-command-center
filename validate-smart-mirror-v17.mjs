import fs from 'node:fs';

const fail=[];
const requireFile=(p,min=1)=>{
  if(!fs.existsSync(p)){fail.push(`missing file: ${p}`);return ''}
  const size=fs.statSync(p).size;
  if(size<min)fail.push(`file too small: ${p} (${size} bytes, expected >= ${min})`);
  return fs.readFileSync(p,'utf8');
};

const html=requireFile('index.html',50000);
const js=requireFile('smart-mirror-v17.js',20000);

if(!html.includes('/smart-mirror-v17.js?v=17.1'))fail.push('built index is missing V17.1 entry script');
if(/smart-mirror-v1(?:0|1|2|3|4|5|6)[^"']*\.js/i.test(html))fail.push('built index still contains a legacy Smart Mirror enhancement script');
if(html.includes('🍓'))fail.push('built production shell still contains the strawberry placeholder');
if(!html.includes('href="/icon-192.svg"'))fail.push('production favicon was not replaced with the app icon');
if(!js.includes('SMART_MIRROR_STEP_COUNT = 16'))fail.push('V17 does not declare the required 16-step course');

const manifestStart=js.indexOf('const VISUAL_MANIFEST');
const manifestEnd=js.indexOf('const step=');
const manifest=js.slice(manifestStart,manifestEnd);
for(let i=1;i<=16;i++) if(!manifest.includes(`${i}:`)) fail.push(`visual manifest missing step ${i}`);

const visualFunctions=['portsVisual','osVisual','terminal','dsiVisual','displayVisual','editorVisual','mirrorVisual','systemdVisual','frameVisual','wiringVisual','backVisual','mountVisual','visualFor'];
for(const fn of visualFunctions) if(!js.includes(`function ${fn}`)) fail.push(`missing visual renderer: ${fn}`);

if(!js.includes('replaceBrandMarks'))fail.push('Raspberry branding replacement is missing');
if(js.includes('🍓'))fail.push('V17 contains the strawberry placeholder');
if(js.includes('SPRITE_PAYLOAD')||js.includes('visual-sprite.b64'))fail.push('V17 still depends on the corrupted sprite pipeline');
if(!js.includes("genericHardware.style.display='none'"))fail.push('generic hardware fallback is not disabled for Smart Mirror');
if(!js.includes("quicklinks.style.display='none'"))fail.push('generic project quick links are not disabled for Smart Mirror');
if(!js.includes("case 'ports'")||!js.includes("case 'finished'"))fail.push('visual switch does not span first and final checkpoints');
if(!js.includes('Raspberry Pi 5 port map'))fail.push('Step 1 annotated port map is missing');
if(!js.includes('Raspberry Pi OS'))fail.push('Step 2 Raspberry Pi OS visual is missing');
if(!js.includes('DSI ribbon: unlock'))fail.push('DSI instructional diagram is missing');

if(fail.length){
  console.error('\nSmart Mirror V17.1 validation FAILED');
  fail.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('Smart Mirror V17.1 validation passed: 16 deterministic visuals, no legacy scripts, no strawberry placeholder, no sprite dependency.');
