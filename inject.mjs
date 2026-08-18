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
const scripts=['/photo-nano.js','/photo-extra-small.js','/setup-wizard.js'];
for(const src of scripts){
  const tag=`<script src="${src}"></script>`;
  if(!html.includes(tag)) html=html.replace('</body>',`${tag}\n</body>`);
}
fs.writeFileSync(indexPath,html,'utf8');
console.log('Built dist with photorealistic visuals and integrated 18-step setup wizard.');
