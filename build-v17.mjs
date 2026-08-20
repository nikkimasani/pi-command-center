import fs from 'node:fs';

const path='index.html';
let html=fs.readFileSync(path,'utf8');

// Remove every previous Smart Mirror enhancement script from the production HTML.
html=html.replace(/\n?<script\s+src="\/smart-mirror-v(?:10|11[^"']*|12[^"']*|13[^"']*|14[^"']*|15[^"']*|16[^"']*)\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-hires\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-sprite\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v17\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script>queueMicrotask\(.*?window\.renderHome\(\).*?<\/script>/gis,'');

// The source favicon is an inline SVG data URI containing raw > characters.
// Replace the complete source line so no fragment of the embedded SVG can survive.
html=html.replace(/^\s*<link\s+rel="icon".*$/mi,'  <link rel="icon" href="/icon-192.svg">');

// Use the raspberry app icon in visible shell branding.
html=html.replace(/<div class="logo-icon">[\s\S]*?<\/div>/i,'<div class="logo-icon"><img src="/icon-192.svg" alt="Raspberry" width="28" height="28"></div>');
html=html.replace(/<span class="emoji">[\s\S]*?<\/span>/i,'<span class="emoji"><img src="/icon-192.svg" alt="Raspberry" width="22" height="22"></span>');

// Remove any remaining legacy strawberry text token from built markup/data.
html=html.replaceAll('🍓','◉');

const v17='<script src="/smart-mirror-v17.js?v=17.2"></script>';
const rerender='<script>queueMicrotask(()=>{if(window.renderHome&&document.querySelector("#homeView.active"))window.renderHome();});</script>';
html=html.replace('</body>',`${v17}\n${rerender}\n</body>`);

fs.writeFileSync(path,html);
console.log('Smart Mirror V17.2 shell built: one renderer, clean raspberry branding, first-load 16-step home metadata');
