import fs from 'node:fs';

const path='index.html';
let html=fs.readFileSync(path,'utf8');

// Remove every previous Smart Mirror enhancement script from the production HTML.
html=html.replace(/\n?<script\s+src="\/smart-mirror-v(?:10|11[^"']*|12[^"']*|13[^"']*|14[^"']*|15[^"']*|16[^"']*)\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-hires\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-sprite\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v17\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');

// Remove the old strawberry placeholder from the actual built app shell.
html=html.replace(/<link rel="icon" href="data:image\/svg\+xml,[^"]*🍓[^>]*>/g,'<link rel="icon" href="/icon-192.svg">');
html=html.replaceAll('🍓','◉');

const tag='<script src="/smart-mirror-v17.js?v=17.1"></script>';
html=html.replace('</body>',`${tag}\n</body>`);
fs.writeFileSync(path,html);
console.log('Smart Mirror V17.1 is the only Smart Mirror enhancement; strawberry placeholder removed from built shell');
