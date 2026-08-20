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
const icon192=requireFile('icon-192.svg',500);
const icon512=requireFile('icon-512.svg',500);
const iconMask=requireFile('icon-maskable.svg',500);

if(!html.includes('/smart-mirror-v17.js?v=17.2'))fail.push('built index is missing V17.2 entry script');
if(/smart-mirror-v1(?:0|1|2|3|4|5|6)[^"']*\.js/i.test(html))fail.push('built index still contains a legacy Smart Mirror enhancement script');
if(html.includes('🍓'))fail.push('built production shell still contains the strawberry placeholder');
if(!html.includes('<link rel="icon" href="/icon-192.svg">'))fail.push('production favicon tag is not exact');
if(html.includes('</svg>">')||html.includes('</svg>">'))fail.push('production favicon markup contains malformed SVG data-URI remnants');
if(!html.includes('<div class="logo-icon"><img src="/icon-192.svg"'))fail.push('desktop shell does not use raspberry app icon');
if(!html.includes('<span class="emoji"><img src="/icon-192.svg"'))fail.push('mobile shell does not use raspberry app icon');
if(!html.includes('queueMicrotask(()=>{if(window.renderHome'))fail.push('first-load home metadata rerender is missing');
if(!js.includes('SMART_MIRROR_STEP_COUNT = 16'))fail.push('V17 does not declare the required 16-step course');

for(const [name,content] of [['icon-192.svg',icon192],['icon-512.svg',icon512],['icon-maskable.svg',iconMask]]){
  if(content.includes('🍓'))fail.push(`${name} still contains strawberry artwork`);
  if(!content.includes('#c51a4a')||!content.includes('#65ad4b'))fail.push(`${name} is missing raspberry fruit artwork`);
}

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
  console.error('\nSmart Mirror V17.2 validation FAILED');
  fail.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('Smart Mirror V17.2 validation passed: 16 deterministic visuals, clean raspberry branding, no legacy scripts, no sprite dependency, first-load metadata refreshed.');
