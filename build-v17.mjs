import fs from 'node:fs';

const path='index.html';
let html=fs.readFileSync(path,'utf8');

// Remove every previous enhancement entry so the build is deterministic.
html=html.replace(/\n?<script\s+src="\/smart-mirror-v(?:10|11[^"']*|12[^"']*|13[^"']*|14[^"']*|15[^"']*|16[^"']*)\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-hires\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v16-sprite\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/smart-mirror-v17\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/responsive-v1\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script\s+src="\/shared-setup-v2\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script>queueMicrotask\(.*?window\.renderHome\(\).*?<\/script>/gis,'');

// Replace legacy Shared Setup image references in the source data as an additional guard.
html=html.replaceAll('/assets/projects/smart-mirror/v15/step-01-parts.jpg','/assets/setup/v2/step-01-microsd-setup.svg');
html=html.replaceAll('/assets/setup/imager-ssh-generated.jpg','/assets/setup/v2/step-02-imager-settings.svg');

// Replace embedded strawberry favicon and visible shell branding.
html=html.replace(/^\s*<link\s+rel="icon".*$/mi,'  <link rel="icon" href="/icon-192.svg">');
html=html.replace(/<div class="logo-icon">[\s\S]*?<\/div>/i,'<div class="logo-icon"><img src="/icon-192.svg" alt="Raspberry" width="28" height="28"></div>');
html=html.replace(/<span class="emoji">[\s\S]*?<\/span>/i,'<span class="emoji"><img src="/icon-192.svg" alt="Raspberry" width="22" height="22"></span>');
html=html.replaceAll('🍓','◉');

const responsive='<script src="/responsive-v1.js?v=1.0"></script>';
const setup='<script src="/shared-setup-v2.js?v=2.0"></script>';
const v17='<script src="/smart-mirror-v17.js?v=17.2"></script>';
const rerender='<script>queueMicrotask(()=>{if(window.renderHome&&document.querySelector("#homeView.active"))window.renderHome();});</script>';
html=html.replace('</body>',`${responsive}\n${setup}\n${v17}\n${rerender}\n</body>`);

fs.writeFileSync(path,html);
console.log('Pi Command Center built: responsive V1 + Shared Setup V2 + Smart Mirror V17.2');
