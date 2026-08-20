import fs from 'node:fs';

const fail=[];
const requireFile=(p,min=1)=>{
  if(!fs.existsSync(p)){fail.push(`missing file: ${p}`);return ''}
  const size=fs.statSync(p).size;
  if(size<min)fail.push(`file too small: ${p} (${size} bytes, expected >= ${min})`);
  return fs.readFileSync(p,'utf8');
};

const html=requireFile('index.html',50000);
const js=requireFile('smart-mirror-v17.js',15000);
requireFile('assets/projects/smart-mirror/v16/visual-sprite.b64',100000);
requireFile('assets/generic/pi5-board.jpg',20000);

if(!html.includes('/smart-mirror-v17.js?v=17.0'))fail.push('built index is missing V17 entry script');
if(/smart-mirror-v1(?:0|1|2|3|4|5|6)[^"']*\.js/i.test(html))fail.push('built index still contains a legacy Smart Mirror enhancement script');
if(!js.includes('SMART_MIRROR_STEP_COUNT = 16'))fail.push('V17 does not declare the required 16-step course');
if(!js.includes("16:'sprite-finished'"))fail.push('visual manifest does not cover step 16');
for(let i=1;i<=16;i++){
  const token=`${i}:`;
  const manifest=js.slice(js.indexOf('const VISUAL_MANIFEST'),js.indexOf('const SPRITE_CELL'));
  if(!manifest.includes(token))fail.push(`visual manifest missing step ${i}`);
}
if(!js.includes('replaceBrandMarks'))fail.push('Raspberry brand replacement is missing');
if(js.includes('🍓'))fail.push('V17 contains the strawberry placeholder');
if(!js.includes("genericHardware.style.display='none'"))fail.push('generic hardware fallback is not disabled for Smart Mirror');
if(!js.includes("quicklinks.style.display='none'"))fail.push('generic project quick links are not disabled for Smart Mirror');
if(!js.includes("SPRITE_PAYLOAD"))fail.push('generated hardware visual payload is not wired');

if(fail.length){
  console.error('\nSmart Mirror V17 validation FAILED');
  fail.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('Smart Mirror V17 validation passed: 16 steps, full visual manifest, no legacy scripts, no strawberry placeholder, required assets present.');
