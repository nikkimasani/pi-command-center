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

const obsolete=[
  '/photo-nano.js','/action-guide.js','/setup-actions.js','/beginner-mirror.js',
  '/smart-mirror-photo-override.js','/beginner-detail-layer.js','/beginner-coach.js',
  '/guided-projects-v2.js','/setup-wizard.js'
];
for(const src of obsolete){
  const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  html=html.replace(new RegExp(`<script\\s+src=["']${escaped}["']><\\/script>\\s*`,'g'),'');
}

const scripts=['/setup-course-v2.js','/project-course-v3.js'];
for(const src of scripts){
  const tag=`<script src="${src}"></script>`;
  if(!html.includes(tag)) html=html.replace('</body>',`${tag}\n</body>`);
}
fs.writeFileSync(indexPath,html,'utf8');
console.log('Built dist with detailed visual Pi setup course and resilient v3 project walkthroughs.');