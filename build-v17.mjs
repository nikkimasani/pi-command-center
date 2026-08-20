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
html=html.replace(/\n?<script\s+src="\/project-courses-v1\.js(?:\?[^"']*)?"\s*><\/script>/gi,'');
html=html.replace(/\n?<script>queueMicrotask\(.*?window\.renderHome\(\).*?<\/script>/gis,'');

const foundation=`window.PI_FOUNDATION=[
F('Flash Raspberry Pi OS 64-bit Desktop to the 128 GB SanDisk microSD card with Raspberry Pi Imager.',[{label:'microSD setup',src:'/assets/setup/v2/step-01-microsd-setup.svg',caption:'Prepare the correct 128 GB card and Raspberry Pi OS image before writing.'}]),
F('Configure Raspberry Pi Imager: hostname nikkipi, SSH, Wi-Fi, username/password, and America/Chicago.',[{label:'Imager settings',src:'/assets/setup/v2/step-02-imager-settings.svg',caption:'Verify SSH, Wi-Fi, hostname and locale before writing the card.'}]),
F('Install the Raspberry Pi 5 securely in the metal case while keeping required ports and DSI access clear.',[{label:'Metal case assembly',src:'/assets/setup/v2/step-03-metal-case-assembly.svg',caption:'Align the board with its standoffs and keep airflow and connectors unobstructed.'}]),
F('Boot Raspberry Pi OS, confirm Wi-Fi, update the system, and reboot cleanly.',[{label:'First boot and update',src:'/assets/setup/v2/step-04-first-boot-guide.svg',caption:'Confirm the desktop and Wi-Fi, then update and reboot before hardware work.'}]),
F('Power the Pi fully off and connect the DSI ribbon using the unlock, align, insert, and lock sequence.',[{label:'DSI connection',src:'/assets/setup/v2/step-05-dsi-connection-guide.svg',caption:'Never handle the DSI ribbon while the Pi is powered.'}]),
F('Verify display, touch, Wi-Fi, SSH, and temperature before starting project-specific assembly.',[{label:'Build verification',src:'/assets/setup/v2/step-06-build-verification.svg',caption:'Continue only after all five shared-system checks pass consistently.'}])
];`;
html=html.replace(/window\.PI_FOUNDATION=\[[\s\S]*?\];\s*window\.PI_PROJECTS=\[/,`${foundation}\nwindow.PI_PROJECTS=[`);

html=html.replace(/^\s*<link\s+rel="icon".*$/mi,'  <link rel="icon" href="/icon-192.svg">');
html=html.replace(/<div class="logo-icon">[\s\S]*?<\/div>/i,'<div class="logo-icon"><img src="/icon-192.svg" alt="Raspberry" width="28" height="28"></div>');
html=html.replace(/<span class="emoji">[\s\S]*?<\/span>/i,'<span class="emoji"><img src="/icon-192.svg" alt="Raspberry" width="22" height="22"></span>');
html=html.replaceAll('🍓','◉');

const responsive='<script src="/responsive-v1.js?v=1.0"></script>';
const setup='<script src="/shared-setup-v2.js?v=2.0"></script>';
const v17='<script src="/smart-mirror-v17.js?v=17.2"></script>';
const courses='<script src="/project-courses-v1.js?v=1.0"></script>';
const rerender='<script>queueMicrotask(()=>{if(window.renderHome&&document.querySelector("#homeView.active"))window.renderHome();});</script>';
html=html.replace('</body>',`${responsive}\n${setup}\n${v17}\n${courses}\n${rerender}\n</body>`);

fs.writeFileSync(path,html);
console.log('Pi Command Center built: responsive V1 + Shared Setup V2 + Smart Mirror V17.2 + Project Courses V1');
