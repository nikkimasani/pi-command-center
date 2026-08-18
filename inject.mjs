import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('./index.html', import.meta.url);
let html = await readFile(path, 'utf8');

const script = '<script src="/photo-nano.js"></script>';
if (!html.includes(script)) {
  html = html.replace('</body>', `${script}\n</body>`);
  await writeFile(path, html, 'utf8');
  console.log('Injected photorealistic visual layer into index.html');
} else {
  console.log('Photorealistic visual layer already present');
}
