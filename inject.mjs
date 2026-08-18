import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});

for(const name of fs.readdirSync(root)){
  if(name==='dist'||name==='.git') continue;
  const src=path.join(root,name);
  const dest=path.join(dist,name);
  const stat=fs.statSync(src);
  if(stat.isDirectory()) fs.cpSync(src,dest,{recursive:true});
  else fs.copyFileSync(src,dest);
}

const indexPath=path.join(dist,'index.html');
let html=fs.readFileSync(indexPath,'utf8');

// Remove the older overlapping tutorial layers. They competed for the same
// step DOM and left the original fixed Next bar visible under Beginner Mode.
const obsolete=[
  '/photo-nano.js','/action-guide.js','/setup-actions.js','/beginner-mirror.js',
  '/smart-mirror-photo-override.js','/beginner-detail-layer.js','/beginner-coach.js'
];
for(const src of obsolete){
  const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  html=html.replace(new RegExp(`<script\\s+src=["']${escaped}["']><\\/script>\\s*`,'g'),'');
}

// Keep the shared setup wizard separate. Projects use one unified beginner
// walkthrough controller so Back/Next, visuals, checks, and progress agree.
const scripts=['/setup-wizard.js','/guided-projects-v2.js'];
for(const src of scripts){
  const tag=`<script src="${src}"></script>`;
  if(!html.includes(tag)) html=html.replace('</body>',`${tag}\n</body>`);
}
fs.writeFileSync(indexPath,html,'utf8');
console.log('Built dist with unified beginner walkthroughs for all 10 projects.');