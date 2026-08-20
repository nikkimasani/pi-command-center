import fs from 'node:fs';

const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');
const tags = [
  '<script src="/smart-mirror-v16-hires.js?v=16.1"></script>',
  '<script src="/smart-mirror-v16-sprite.js?v=16.1"></script>'
];

for (const tag of tags) {
  const src = tag.match(/src="([^"]+)/)?.[1]?.split('?')[0];
  if (src && !html.includes(src)) {
    html = html.replace('</body>', `${tag}\n</body>`);
  }
}

fs.writeFileSync(path, html);
console.log('Smart Mirror V16 entry scripts present in built index.html');
