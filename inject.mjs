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
const remove=['/photo-nano.js','/photo-extra-small.js','/action-guide.js','/setup-actions.js','/beginner-mirror.js','/smart-mirror-photo-override.js','/beginner-detail-layer.js','/beginner-coach.js','/guided-projects-v2.js','/setup-wizard.js','/project-visual-fix-v4.js','/project-course-v3.js','/setup-course-v2.js','/course-quality-v5.js','/visual-registry-v6.js','/command-copy-v6.js','/hardware-accuracy-v7.js','/gpio-accuracy-v8.js','/gpio-lab-v9.js','/smart-mirror-course-v5.js','/smart-mirror-v5-guard.js'];
for(const src of remove){const escaped=src.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');html=html.replace(new RegExp(`<script\\s+src=["']${escaped}["']><\\/script>\\s*`,'g'),'')}
const scripts=['/setup-course-v3.js','/project-course-v4.js','/smart-mirror-course-v6.js','/smart-mirror-v6-qa.js','/smart-mirror-visual-manifest.js','/smart-mirror-setup-coach.js','/smart-mirror-visual-player.js'];
for(const src of scripts){const tag=`<script src="${src}"></script>`;if(!html.includes(tag))html=html.replace('</body>',`${tag}\n</body>`)}
fs.writeFileSync(indexPath,html,'utf8');
console.log('Built dist with Setup V3, generic Project Course V4, isolated Smart Mirror Course V6, V6 QA enforcement, fixed Smart Mirror visual manifest, interactive setup coach, and inline visual player.');