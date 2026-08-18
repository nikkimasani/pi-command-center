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
const script='<script src="/photo-nano.js"></script>';
if(!html.includes(script)) html=html.replace('</body>',`${script}\n</body>`);
fs.writeFileSync(indexPath,html,'utf8');
console.log('Built dist with photorealistic visual layer.');
