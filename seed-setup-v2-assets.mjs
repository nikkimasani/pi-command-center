import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const outDir='assets/setup/v2';
fs.mkdirSync(outDir,{recursive:true});

const assets=[
  {
    file:'step-01-microsd.png',
    production:'https://pi-command-center.vercel.app/assets/setup/v2/step-01-microsd.png',
    canva:'https://media.canva.com/v2/image-resize/format:PNG/height:1402/quality:100/uri:ifs%3A%2F%2FM%2Fab17e1b7-2c3a-4744-9f58-975db16ebab1/watermark:F/width:1122?csig=AAAAAAAAAAAAAAAAAAAAAJNeJnt0h6bNXTQWL5WyTRywN17Uw4X17D32je62G1dy&exp=1787257501&osig=AAAAAAAAAAAAAAAAAAAAALYe5i8SwoX2orHClnK6eZniRN0Da3tl7OAcSrJnUUjh&signer=media-rpc&x-canva-quality=thumbnail'
  }
];

function pngSize(buf){
  if(buf.length<24 || buf.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') return null;
  return {width:buf.readUInt32BE(16),height:buf.readUInt32BE(20)};
}

async function get(url){
  const r=await fetch(url,{redirect:'follow',cache:'no-store'});
  if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return Buffer.from(await r.arrayBuffer());
}

for(const a of assets){
  let data=null,source='';
  try{
    const prod=await get(a.production);
    const dim=pngSize(prod);
    if(dim && dim.width>=1000 && dim.height>=1200){ data=prod; source='production'; }
  }catch{}
  if(!data){
    const c=await get(a.canva);
    const dim=pngSize(c);
    if(!dim || dim.width<1000 || dim.height<1200) throw new Error(`Approved asset ${a.file} returned ${dim?`${dim.width}x${dim.height}`:'non-PNG'} instead of full resolution`);
    data=c; source='Canva seed';
  }
  fs.writeFileSync(path.join(outDir,a.file),data);
  const dim=pngSize(data);
  console.log(`Seeded ${a.file} ${dim.width}x${dim.height} from ${source}`);
}
