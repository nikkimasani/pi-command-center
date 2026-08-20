(() => {
  'use strict';

  const smart = (window.PI_PROJECTS || []).find(p => p.id === 'smart-mirror');
  if (!smart) return;

  const SMART_MIRROR_STEP_COUNT = 16;
  const SPRITE_PAYLOAD = '/assets/projects/smart-mirror/v16/visual-sprite.b64?v=17';
  const SPRITE_POSITIONS = ['0%','16.6667%','33.3333%','50%','66.6667%','83.3333%','100%'];
  const VISUAL_MANIFEST = Object.freeze({
    1:'ports', 2:'os', 3:'terminal-update', 4:'sprite-dsi',
    5:'display-test', 6:'terminal-install', 7:'editor', 8:'mirror',
    9:'systemd', 10:'sprite-frame', 11:'sprite-frame', 12:'sprite-wiring',
    13:'sprite-back', 14:'sprite-rear', 15:'sprite-finished', 16:'sprite-finished'
  });
  const SPRITE_CELL = Object.freeze({4:1,10:2,11:2,12:4,13:5,14:3,15:6,16:6});

  const step = (title, summary, actions, success, warning, kind, visual) => ({
    title, summary, actions, success, warning,
    visual: visual || [title, summary], photos: [], v17Kind: kind
  });

  smart.summary = 'Build a complete Raspberry Pi 5 Smart Mirror from microSD preparation through final wall mounting, with 16 visual checkpoints, exact actions, verification, and troubleshooting.';
  smart.steps = [
    step('Prep the SD Card','Prepare the microSD card and identify every part before the Pi receives power.',[
      'Clear a dry work area and place a soft towel beside it for the touchscreen.',
      'Lay out the Raspberry Pi 5, 7-inch DSI touchscreen, 22-pin-to-15-pin DSI ribbon cable, Pi 5 case, 128 GB microSD card, 45W USB-C supply, 12 × 12 two-way mirror acrylic, 12 × 12 shadow box, Velcro, micro-HDMI cable, and mini keyboard.',
      'Keep USB-C power disconnected from the Pi.',
      'Identify the Pi 5 USB-C power port, two micro-HDMI ports, USB ports, Ethernet port, GPIO header, microSD slot, and MIPI camera/display connectors.',
      'Compare the DSI cable ends. The Pi 5 end is the narrow 22-pin end; the display end is the wider 15-pin end.',
      'Insert the microSD card into your computer using a suitable reader or adapter and confirm the computer detects it.'
    ],'All parts are identified, the Pi is unpowered, the microSD is detected, and you can tell the two ribbon ends apart.','Do not proceed if you are unsure which connector is power, HDMI, MIPI display, or if the microSD card is not detected.','ports',['Pi 5 ports','22-pin vs 15-pin','Power disconnected']),

    step('Flash Raspberry Pi OS and First Boot','Write Raspberry Pi OS, preconfigure Wi-Fi and SSH, then prove the Pi reaches a stable desktop.',[
      'Download and open Raspberry Pi Imager on your computer.',
      'Choose Raspberry Pi 5 as the device.',
      'Choose Raspberry Pi OS 64-bit Desktop as the operating system.',
      'Choose the 128 GB microSD card as storage and verify you selected the correct drive because it will be erased.',
      'Open Imager customisation. Set hostname to nikkipi, enter your Wi-Fi credentials, choose America/Chicago, and enable SSH with password authentication.',
      'Write the image and wait for verification to complete before ejecting the card.',
      'Insert the microSD into the Pi. Use micro-HDMI for this first boot if the DSI display is not connected yet.',
      'Connect the mini keyboard if needed, then connect USB-C power.',
      'Finish Raspberry Pi OS setup and confirm the desktop loads and Wi-Fi connects.'
    ],'Raspberry Pi OS reaches the desktop, Wi-Fi is connected, and the Pi remains stable.','If the Pi does not boot, power it off, reseat the card, and confirm Imager completed both writing and verification.','os',['Raspberry Pi OS','Wi-Fi connected','SSH enabled']),

    step('Update Raspberry Pi OS','Bring the operating system fully up to date before installing mirror software.',[
      'Open Terminal from the Raspberry Pi OS desktop.',
      'Run sudo apt update and wait for package lists to finish.',
      'Run sudo apt full-upgrade -y and let all upgrades complete.',
      'Run sudo reboot.',
      'After reboot, confirm the desktop returns, Wi-Fi reconnects, and Terminal opens normally.'
    ],'The upgrade completes without package errors and the Pi returns to a stable desktop after reboot.','Do not interrupt power during an upgrade. Resolve apt errors before continuing.','terminal-update',['sudo apt update','sudo apt full-upgrade -y','sudo reboot']),

    step('Connect the DSI Display Cable','Connect the 22-pin Pi end and 15-pin display end with the Pi completely powered off.',[
      'Shut the Pi down, unplug USB-C power, and wait at least 10 seconds.',
      'Locate the Pi 5 MIPI display connector. Do not use HDMI, USB, or the GPIO header.',
      'Release the connector latch gently. Do not pry the socket off the board.',
      'Align the narrow 22-pin end of the ribbon squarely with the Pi connector. Keep the ribbon flat and untwisted.',
      'Insert the ribbon evenly until it stops, then close the latch while holding the cable straight.',
      'At the touchscreen, open the display connector latch and insert the wider 15-pin end fully and evenly.',
      'Close the display latch and gently tug both ends. Neither should slide out.',
      'Leave the ribbon in a broad curve. Do not crease it sharply.'
    ],'Both DSI ends are straight, fully seated, locked, and the cable has a broad uncreased curve.','If either end is crooked, remove it and start again while power is disconnected. A partial connection can cause a black or flickering display.','sprite-dsi',['Unlock','Align','Insert','Lock']),

    step('Test the 7-inch Display','Prove video, touch, Wi-Fi, SSH, and basic stability while the hardware is still loose.',[
      'Place the touchscreen face-up on a soft towel and keep the Pi visible beside it.',
      'Reconnect USB-C power and allow Raspberry Pi OS to boot.',
      'Confirm the desktop appears on the 7-inch display.',
      'Tap icons, open a window, scroll, and type to confirm touch input.',
      'Confirm Wi-Fi remains connected.',
      'From another device on the same network, connect to nikkipi.local with SSH if available.',
      'Leave the setup running for at least 10 minutes and watch for flicker, restarts, or power warnings.'
    ],'The 7-inch display shows a stable desktop, touch works, network access works, and the Pi remains stable for 10 minutes.','If video is black, power off before touching the DSI cable. If video works but touch does not, verify the exact display model and its touch requirements.','display-test',['Display visible','Touch works','Network works']),

    step('Install MagicMirror²','Install MagicMirror only after the Pi and display have passed hardware testing.',[
      'Open Terminal.',
      'Change to your home folder with cd ~.',
      'Clone the official repository with git clone https://github.com/MagicMirrorOrg/MagicMirror.git.',
      'Enter the folder with cd MagicMirror.',
      'Install dependencies using the installation command documented by the current MagicMirror release. For releases using it, run npm run install-mm.',
      'Keep Terminal open until installation finishes and review the first real error if anything fails.'
    ],'The MagicMirror folder exists and dependency installation completes without an npm failure.','Do not repeatedly rerun a failed install without reading the first meaningful error.','terminal-install',['Clone repository','Install dependencies','No errors']),

    step('Configure MagicMirror','Create a simple known-good configuration before adding optional modules.',[
      'Create config/config.js from the sample configuration if it does not exist.',
      'Open config/config.js in a text editor.',
      'Keep the clock module and one or two simple modules for the first test.',
      'Keep the background black so the mirror effect works later.',
      'Add weather only after you have the required provider/location settings.',
      'Save the file and inspect commas, braces, quotes, module names, and positions carefully.'
    ],'config.js saves with valid JavaScript syntax and contains a minimal clock-first layout.','If MagicMirror reports a configuration error, compare brackets, commas, module names, and values before changing anything else.','editor',['config.js','clock','calendar','black background']),

    step('Test MagicMirror Manually','Run MagicMirror successfully before you configure automatic startup.',[
      'Open Terminal in the MagicMirror directory.',
      'Start MagicMirror with npm run start.',
      'Wait for the application window to open.',
      'Confirm the clock and configured modules appear over a black background.',
      'Leave it running several minutes and confirm Terminal is not repeating errors.',
      'Exit MagicMirror cleanly before continuing.'
    ],'MagicMirror starts manually and displays the configured modules without continuous errors.','Do not configure autostart until manual startup is reliable.','mirror',['MagicMirror running','Black background','Modules visible']),

    step('Set Up Autostart','Make MagicMirror recover automatically after a normal Raspberry Pi OS Desktop reboot.',[
      'Enable Desktop Autologin if you want the mirror to return without keyboard input after reboot.',
      'Create the user-level systemd service recommended for Raspberry Pi OS Desktop.',
      'Run systemctl --user daemon-reload.',
      'Run systemctl --user enable magicmirror.service.',
      'Run systemctl --user start magicmirror.service.',
      'Check systemctl --user status magicmirror.service.',
      'Reboot and confirm MagicMirror returns automatically after desktop login.'
    ],'A cold reboot ends with MagicMirror running automatically.','If the service fails, inspect systemctl --user status and journal output before editing the service again.','systemd',['systemd --user','enable','start','reboot']),

    step('Dry-fit the Shadow Box','Test the physical stack before attaching any component permanently.',[
      'Power the Pi off and disconnect USB-C.',
      'Open the 12 × 12 shadow box and remove its rear panel and decorative insert.',
      'Place the two-way mirror acrylic at the front where the original glass would sit.',
      'Center the 7-inch display behind the mirror and keep the LCD face parallel to the mirror.',
      'Place the Pi case behind or beside the display where it will not press on the LCD.',
      'Hold the rear panel in place without fastening it and confirm there is room for the ribbon, USB-C lead, and airflow.',
      'Mark the display center and safe mounting zones with removable painter tape.'
    ],'The mirror, screen, Pi, cables, and rear panel all fit without pressing on the LCD or sharply bending a cable.','Do not force the back closed. Pressure on the LCD can create bright spots, touch failures, or permanent damage.','sprite-frame',['Mirror acrylic','Display centered','Pi clearance','Rear panel fits']),

    step('Mount the Display','Secure the touchscreen behind the mirror with removable, serviceable mounting points.',[
      'Clean rigid mounting surfaces only. Keep adhesive away from the active LCD, connectors, flex cables, and vents.',
      'Apply short industrial Velcro strips or suitable removable fasteners to the rigid display frame or backing plate.',
      'Attach matching strips inside the shadow box at your alignment marks.',
      'Press the display into place gently.',
      'Inspect from the front and correct tilt or centering now.',
      'Gently tilt the powered-off frame and confirm the display does not move.'
    ],'The display is level, centered, removable for service, and does not shift when the frame is gently tilted.','Never place strong adhesive directly on the active display surface or delicate flex circuitry.','sprite-frame',['Centered display','Removable fasteners','No LCD pressure']),

    step('Mount the Pi and Route Cables','Create clean cable paths with service slack, strain relief, and ventilation.',[
      'Choose a Pi mounting position that keeps USB-C, DSI, and ventilation accessible.',
      'Secure the Pi case to a rigid rear surface with removable Velcro or suitable standoffs.',
      'Route the DSI ribbon in a broad smooth curve without folding it sharply.',
      'Route USB-C power separately so it does not crush or pull the ribbon.',
      'Use small cable clips or loose Velcro loops for strain relief.',
      'Leave service slack near connectors so the Pi can be removed later.',
      'Keep the Pi case and ventilation path uncovered.'
    ],'Cables lie flat, connectors are not under tension, nothing is pinched, and the Pi has a clear heat path.','A sharply creased ribbon or cable trapped under the rear panel can create intermittent failures.','sprite-wiring',['Pi mounted','DSI broad curve','USB-C exit','Ventilation']),

    step('Close the Rear Assembly','Inspect every layer and cable before fastening the shadow-box rear panel.',[
      'Keep power disconnected.',
      'Clean dust and fingerprints from the mirror acrylic using a suitable soft cloth.',
      'Confirm the display is centered and not under pressure.',
      'Confirm the Pi is secure and both DSI latches remain closed.',
      'Hold the rear panel in place and inspect the entire perimeter for trapped cables.',
      'Close or fasten the rear panel gradually and stop immediately if it bows or resists.',
      'Confirm the external USB-C lead exits without a sharp bend.'
    ],'The rear panel sits flat with no trapped cable, no LCD pressure, and a clean power exit.','If the back does not sit flat, reopen it and reposition components. Never solve a clearance problem by forcing the panel.','sprite-back',['Rear panel flat','Cables clear','Pi secure']),

    step('Run the Full Assembly Test','Prove the completed enclosure is stable before wall mounting.',[
      'Stand the assembled mirror securely in its normal orientation but do not mount it to the wall yet.',
      'Connect USB-C power and allow the Pi to boot.',
      'Confirm MagicMirror starts automatically.',
      'Check the clock and every configured module.',
      'Check Wi-Fi and touch if you plan to use touch through the acrylic.',
      'Run the mirror continuously for at least 30 minutes.',
      'Check CPU temperature with vcgencmd measure_temp during the test.',
      'Watch for flicker, undervoltage warnings, Wi-Fi drops, excessive heat, or restarts.'
    ],'The assembled mirror runs for 30 minutes, autostarts correctly, and remains thermally and electrically stable.','Resolve heat, power, display, or network instability before wall mounting or unattended use.','sprite-rear',['Autostart','30-minute test','Temperature checked']),

    step('Mount the Mirror Safely','Install the finished mirror only after choosing wall hardware appropriate for the completed weight and wall type.',[
      'Weigh or estimate the completed frame and choose hardware rated above that weight.',
      'Prefer a wall stud or appropriately rated anchors for the wall material.',
      'Mark a level position where the power cable reaches without tension.',
      'Install the mounting hardware according to its instructions.',
      'Lift the mirror into place and verify it is fully seated before releasing it.',
      'Route the power cable so it cannot be pulled or become a trip hazard.',
      'Power the mirror and confirm it still boots correctly while mounted.'
    ],'The mirror is level, stable, supported by correctly rated hardware, and the power cable is safely routed.','Do not rely on adhesive strips alone unless their rating, wall surface, and completed mirror weight clearly support the installation.','sprite-finished',['Level','Rated hardware','Safe power path']),

    step('Finish and Back Up the Build','Save the working configuration and keep a maintenance path for future changes.',[
      'Confirm the mirror is readable from normal viewing distance and black screen areas disappear into the reflection.',
      'Photograph the finished front and rear assembly for future troubleshooting.',
      'Back up config/config.js plus any custom CSS and module configuration.',
      'Record the Pi hostname and SSH method you use for maintenance.',
      'Use the working mirror for several days before adding optional modules.',
      'Power the Pi down before opening the frame or touching the DSI cable in the future.'
    ],'The mirror is mounted, boots itself, displays the intended content, and you have a backup and maintenance plan.','Keep the known-good configuration backed up so experiments can be rolled back quickly.','sprite-finished',['Build complete','Configuration backed up','Maintenance ready'])
  ];

  function berryMark(size=58){
    return `<svg class="v17-berry" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="Raspberry"><g fill="#e83c55"><circle cx="22" cy="25" r="9"/><circle cx="32" cy="21" r="9"/><circle cx="42" cy="25" r="9"/><circle cx="18" cy="35" r="9"/><circle cx="28" cy="34" r="9"/><circle cx="38" cy="34" r="9"/><circle cx="46" cy="35" r="9"/><circle cx="24" cy="44" r="9"/><circle cx="34" cy="45" r="9"/><circle cx="42" cy="44" r="8"/></g><g fill="#63b34d"><path d="M31 15c-8-9-15-7-18-5 6 0 10 4 12 8z"/><path d="M33 15c7-10 15-9 19-7-6 2-10 5-12 10z"/><path d="M30 14c0-8 4-12 8-14 0 7-1 11-3 15z"/></g></svg>`;
  }

  const esc = value => String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const chip = t => `<span class="v17-chip">${esc(t)}</span>`;
  const commandBlock = lines => `<div class="v17-terminal"><div class="v17-windowbar"><i></i><i></i><i></i><span>Terminal</span></div><pre>${lines.map(x=>`<span class="prompt">$</span> ${esc(x)}`).join('\n')}</pre></div>`;

  function osScreen(title='Raspberry Pi OS', subtitle='Desktop loaded • Wi-Fi connected', extras=''){
    return `<div class="v17-screen"><div class="v17-osbar"><span>${berryMark(28)} Raspberry Pi OS</span><span>Wi-Fi ● &nbsp; 10:24</span></div><div class="v17-desktop"><div class="v17-oscard">${berryMark(88)}<h2>${esc(title)}</h2><p>${esc(subtitle)}</p>${extras}</div></div></div>`;
  }

  function portsVisual(){
    return `<div class="v17-visual-stack"><div class="v17-real-photo"><img src="/assets/generic/pi5-board.jpg" alt="Real Raspberry Pi 5 board" loading="eager"><span>Real Raspberry Pi 5 board reference</span></div><div class="v17-port-grid"><div><b>USB-C POWER</b><small>5V power input. Leave disconnected while wiring DSI.</small></div><div><b>2 × MICRO-HDMI</b><small>Display outputs along the board edge.</small></div><div><b>MIPI CAMERA / DISPLAY</b><small>Small FFC connectors for camera/display ribbons. Use the display connector specified for your screen.</small></div><div><b>USB 3 / USB 2</b><small>Keyboard, mouse, storage, and accessories.</small></div><div><b>ETHERNET</b><small>Wired network port beside the USB stack.</small></div><div><b>GPIO 40-PIN</b><small>Header for electronics projects. Not used for this DSI connection.</small></div><div><b>MICROSD</b><small>Boot/storage card slot on the underside of the board.</small></div><div><b>DSI CABLE</b><small>Narrow 22-pin end goes to Pi 5. Wider 15-pin end goes to your display.</small></div></div><div class="v17-danger">Power must be OFF before inserting, removing, or reseating the DSI ribbon.</div></div>`;
  }

  function editorVisual(){
    return `<div class="v17-editor"><div class="v17-windowbar"><i></i><i></i><i></i><span>config/config.js</span></div><pre><span class="muted">modules: [</span>\n  { module: <b>'clock'</b>, position: <em>'top_left'</em> },\n  { module: <b>'calendar'</b>, position: <em>'top_left'</em> }\n<span class="muted">]</span></pre><div class="v17-verify">✓ Keep the first configuration simple. Save, then test before adding more modules.</div></div>`;
  }

  function mirrorVisual(){
    return `<div class="v17-mirror-screen"><div class="clock">10:30</div><div class="date">Thursday, August 20</div><div class="weather">☁ 72° <small>Partly Cloudy</small></div><div class="agenda"><b>Up Next</b><span>10:00 Team Standup</span><span>12:00 Lunch</span><span>3:30 Project Review</span></div></div>`;
  }

  let spriteUrl='';
  let spritePromise=null;
  function loadSprite(){
    if(spriteUrl) return Promise.resolve(spriteUrl);
    if(spritePromise) return spritePromise;
    spritePromise=fetch(SPRITE_PAYLOAD,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('visual payload '+r.status);return r.text();}).then(text=>{
      const raw=atob(text.replace(/\s+/g,''));
      const bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
      spriteUrl=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
      return spriteUrl;
    }).catch(err=>{console.warn('V17 generated visuals unavailable',err);return '';});
    return spritePromise;
  }

  function spriteVisual(stepNumber, title, caption){
    const index=SPRITE_CELL[stepNumber];
    if(!spriteUrl || index===undefined){
      return `<div class="v17-fallback"><b>${esc(title)}</b><p>${esc(caption)}</p><div class="v17-fallback-diagram">${chip('Check fit')}${chip('Keep cables loose')}${chip('Verify before closing')}</div></div>`;
    }
    return `<div class="v17-photo" role="img" aria-label="${esc(title)}" style="background-image:url('${spriteUrl}');background-position:center ${SPRITE_POSITIONS[index]}"></div><div class="v17-caption"><b>${esc(title)}</b><span>${esc(caption)}</span></div>`;
  }

  function visualFor(n){
    switch(VISUAL_MANIFEST[n]){
      case 'ports': return portsVisual();
      case 'os': return osScreen('Raspberry Pi OS','Desktop loaded • Wi-Fi connected',`<div class="v17-checkrow">${chip('Desktop stable')}${chip('Wi-Fi')}${chip('SSH enabled')}</div>`);
      case 'terminal-update': return commandBlock(['sudo apt update','sudo apt full-upgrade -y','sudo reboot'])+`<div class="v17-verify">✓ Continue only after the upgrade finishes without package errors and the Pi reboots normally.</div>`;
      case 'sprite-dsi': return spriteVisual(4,'DSI ribbon connection','Use the visual as a placement reference, then verify the latch and cable seating physically before applying power.')+`<div class="v17-sequence"><span><b>1</b> Unlock</span><span><b>2</b> Align</span><span><b>3</b> Insert</span><span><b>4</b> Lock</span></div>`;
      case 'display-test': return osScreen('7-inch Display Test','Video visible • Touch responding • Network online',`<div class="v17-checkrow">${chip('Tap')}${chip('Scroll')}${chip('Type')}${chip('10 min stable')}</div>`);
      case 'terminal-install': return commandBlock(['cd ~','git clone https://github.com/MagicMirrorOrg/MagicMirror.git','cd MagicMirror','npm run install-mm'])+`<div class="v17-verify">✓ Installation should finish without an npm failure.</div>`;
      case 'editor': return editorVisual();
      case 'mirror': return mirrorVisual()+`<div class="v17-verify">✓ The clock and configured modules should be visible on a black background with no repeating terminal errors.</div>`;
      case 'systemd': return commandBlock(['systemctl --user daemon-reload','systemctl --user enable magicmirror.service','systemctl --user start magicmirror.service','systemctl --user status magicmirror.service'])+`<div class="v17-verify">✓ Reboot once. MagicMirror should return automatically after desktop login.</div>`;
      case 'sprite-frame': return spriteVisual(n,'Shadow-box dry fit','Keep the mirror, display, Pi, and cable paths removable until the fit is proven. Nothing should press against the LCD.');
      case 'sprite-wiring': return spriteVisual(n,'Rear cable routing','Use broad cable curves, service slack, strain relief, and an unobstructed ventilation path.');
      case 'sprite-back': return spriteVisual(n,'Closed rear assembly','The back should sit flat. No cable should be trapped along the perimeter.');
      case 'sprite-rear': return spriteVisual(n,'Completed rear layout','Test the assembled enclosure on the desk for at least 30 minutes before wall mounting.');
      case 'sprite-finished': return spriteVisual(n,'Finished Smart Mirror','Final placement target. Your exact frame can differ as long as the mirror effect, mounting, cable routing, and ventilation are correct.');
      default: return `<div class="v17-fallback"><b>Visual checkpoint ${n}</b><p>Follow the actions and verification below.</p></div>`;
    }
  }

  function currentStep(){
    const chipEl=document.querySelector('#stepView.active .step-chip');
    const m=chipEl && chipEl.textContent.match(/Step\s+(\d+)/i);
    return m?Number(m[1]):0;
  }
  function isSmartMirrorOpen(){
    const title=document.querySelector('#stepView.active .step-title-area');
    return !!(title && /Smart Mirror/i.test(title.textContent));
  }

  function replaceBrandMarks(){
    document.querySelectorAll('.logo-icon,.mobile-header .emoji').forEach(el=>{
      if(el.dataset.v17Berry)return;
      el.innerHTML=berryMark(el.classList.contains('logo-icon')?32:22);
      el.dataset.v17Berry='1';
    });
  }

  const roadmapTitles=['Prep SD','First boot','Update','DSI cable','Test display','Install','Configure','Test mirror','Autostart','Dry fit','Mount display','Cable routing','Close back','Full test','Wall mount','Finished'];
  const roadmapIcon=['◫','◉','>_','↧','▣','>_','{}','▤','↻','□','▣','⌁','■','✓','⌂','★'];
  function restyleRoadmap(){
    const thumbs=[...document.querySelectorAll('#stepView.active .step-thumbnails .thumb[data-step]')];
    thumbs.forEach((btn,i)=>{
      if(btn.dataset.v17Roadmap)return;
      btn.innerHTML=`<span class="v17-road-icon">${roadmapIcon[i]||'•'}</span><span class="v17-road-title">${roadmapTitles[i]||`Step ${i+1}`}</span><span class="v17-road-num">${i+1}</span>`;
      btn.dataset.v17Roadmap='1';
    });
  }

  function apply(){
    replaceBrandMarks();
    const active=isSmartMirrorOpen();
    document.body.classList.toggle('v17-smart-mirror',active);
    if(!active)return;
    const n=currentStep();
    if(!n)return;
    const hero=document.querySelector('#stepView.active .step-hero');
    if(hero && hero.dataset.v17Step!==String(n)){
      hero.classList.add('has-photo');
      hero.innerHTML=`<div class="v17-hero"><div class="v17-eyebrow">VISUAL CHECKPOINT • STEP ${n} OF ${SMART_MIRROR_STEP_COUNT}</div>${visualFor(n)}</div>`;
      hero.dataset.v17Step=String(n);
    }
    const genericHardware=document.querySelector('#stepView.active .step-hardware');
    if(genericHardware)genericHardware.style.display='none';
    const quicklinks=document.querySelector('#stepView.active .step-quicklinks');
    if(quicklinks)quicklinks.style.display='none';
    restyleRoadmap();
  }

  const style=document.createElement('style');
  style.id='smart-mirror-v17-css';
  style.textContent=`
    .v17-berry{display:block;overflow:visible}.logo-icon .v17-berry{margin:0}
    body.v17-smart-mirror{--purple:#45c861;--green:#45c861}
    body.v17-smart-mirror .step-layout{min-height:auto!important;display:block!important}
    body.v17-smart-mirror .step-main{overflow:visible!important;border-right:0!important;padding-bottom:calc(130px + env(safe-area-inset-bottom))!important;max-width:980px;margin:0 auto}
    body.v17-smart-mirror .right-panel{position:static!important;height:auto!important;overflow:visible!important;max-width:980px;margin:0 auto;border:1px solid var(--line);border-radius:14px}
    body.v17-smart-mirror .step-hero{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;background:#080d13;border-color:#283748}
    body.v17-smart-mirror .step-thumbnails{margin:14px 0 24px;padding:2px 0 8px;gap:8px}
    body.v17-smart-mirror .thumb{width:104px;height:74px;padding:8px;display:grid;grid-template-columns:28px 1fr;grid-template-rows:1fr auto;gap:2px 8px;align-items:center;justify-content:stretch;text-align:left;background:#0c131c;border:1px solid #283748;border-radius:11px}
    body.v17-smart-mirror .thumb.active{border:2px solid #45c861;background:#102018}
    body.v17-smart-mirror .thumb.complete{border-color:#45c861}
    .v17-road-icon{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#152130;color:#45c861;font-weight:900}.v17-road-title{font-size:10px;color:#e8eef5;font-weight:700;line-height:1.15}.v17-road-num{font-size:9px;color:#7f91a6}
    .v17-hero{width:100%;padding:18px;display:flex;flex-direction:column;gap:14px}.v17-eyebrow{color:#45c861;font-size:11px;font-weight:800;letter-spacing:.12em}
    .v17-real-photo{border:1px solid #29394a;border-radius:14px;overflow:hidden;background:#05080c}.v17-real-photo img{width:100%!important;height:auto!important;max-height:520px!important;object-fit:contain!important;image-rendering:auto!important}.v17-real-photo span{display:block;padding:10px 12px;color:#9aacbd;font-size:11px;border-top:1px solid #253445}
    .v17-port-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v17-port-grid div{padding:11px;border:1px solid #263646;border-radius:10px;background:#0c131c}.v17-port-grid b{display:block;color:#f4f7fb;font-size:11px;margin-bottom:3px}.v17-port-grid small{color:#98a8b9;font-size:10px;line-height:1.45}.v17-danger{padding:12px;border:1px solid #7c3941;background:#281116;color:#ffb1ba;border-radius:10px;font-size:12px;font-weight:700}
    .v17-screen,.v17-editor,.v17-terminal{border:1px solid #2b3b4c;border-radius:15px;overflow:hidden;background:#060b11;box-shadow:0 18px 45px rgba(0,0,0,.25)}.v17-osbar{min-height:44px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;background:#141b24;color:#dfe8f2;font-size:11px}.v17-osbar>span{display:flex;align-items:center;gap:6px}.v17-desktop{min-height:330px;display:grid;place-items:center;padding:22px;background:radial-gradient(circle at 70% 20%,#24304b 0,#111824 38%,#080d13 75%)}.v17-oscard{width:min(360px,94%);text-align:center;padding:26px;border:1px solid #34465a;border-radius:18px;background:rgba(7,12,18,.86)}.v17-oscard .v17-berry{margin:0 auto 12px}.v17-oscard h2{font-size:24px;margin:0 0 7px}.v17-oscard p{color:#9cadbe;margin:0}.v17-checkrow{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:14px}.v17-chip{padding:5px 8px;border:1px solid #31543c;border-radius:999px;background:#102018;color:#7be18d;font-size:9px;font-weight:700}
    .v17-windowbar{height:40px;padding:0 12px;display:flex;align-items:center;gap:7px;background:#111923;border-bottom:1px solid #263646;color:#94a6b9;font-size:10px}.v17-windowbar i{width:9px;height:9px;border-radius:50%;background:#46576a}.v17-windowbar span{margin-left:5px}.v17-terminal pre,.v17-editor pre{margin:0;padding:22px;white-space:pre-wrap;overflow:auto;font:600 13px/1.8 ui-monospace,SFMono-Regular,Menlo,monospace;color:#78e989;background:#020604}.v17-terminal .prompt{color:#a3b3c4}.v17-editor pre{color:#dce7f2;background:#071018}.v17-editor b{color:#78e989}.v17-editor em{color:#f3cc67}.v17-editor .muted{color:#8799ad}.v17-verify{padding:12px 14px;border:1px solid #315b3d;border-radius:10px;background:#0d2415;color:#8ce39b;font-size:11px;line-height:1.5}
    .v17-mirror-screen{min-height:420px;border:1px solid #303b45;border-radius:15px;background:linear-gradient(115deg,rgba(255,255,255,.05),transparent 30%),#030506;padding:44px;color:#fff;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:min-content;gap:12px 22px;align-content:center}.v17-mirror-screen .clock{font-size:58px;font-weight:300}.v17-mirror-screen .date{font-size:16px;color:#cbd3da}.v17-mirror-screen .weather{grid-column:2;font-size:38px}.v17-mirror-screen .weather small{display:block;font-size:11px;color:#b9c3cc}.v17-mirror-screen .agenda{grid-column:1/3;display:grid;gap:5px;margin-top:18px;color:#d8e0e7}.v17-mirror-screen .agenda span{font-size:12px;color:#aab6c1}
    .v17-photo{width:100%;aspect-ratio:4/3;border:1px solid #293746;border-radius:14px;background-color:#090d13;background-repeat:no-repeat;background-size:100% 700%;box-shadow:0 12px 32px rgba(0,0,0,.25)}.v17-caption{padding:11px 2px 0;display:grid;gap:3px}.v17-caption b{color:#f4f7fb;font-size:12px}.v17-caption span{color:#95a7b8;font-size:11px;line-height:1.5}.v17-sequence{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.v17-sequence span{padding:9px 5px;border:1px solid #29394a;border-radius:9px;text-align:center;color:#c7d1dc;font-size:10px;background:#0b121a}.v17-sequence b{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:50%;margin-right:3px;background:#45c861;color:#08110b}.v17-fallback{padding:28px;border:1px dashed #43556a;border-radius:14px;background:#0b1118;text-align:center}.v17-fallback b{display:block;font-size:20px;margin-bottom:7px}.v17-fallback p{color:#9babbc}.v17-fallback-diagram{display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin-top:14px}
    @media(max-width:820px){body.v17-smart-mirror .content-wrap{padding:0!important}body.v17-smart-mirror .step-topbar{position:static!important}body.v17-smart-mirror .step-main{padding:16px 14px calc(138px + env(safe-area-inset-bottom))!important}body.v17-smart-mirror .right-panel{margin:0 14px 90px}body.v17-smart-mirror .bottom-nav{padding-bottom:env(safe-area-inset-bottom);height:calc(64px + env(safe-area-inset-bottom))}.v17-hero{padding:12px}.v17-port-grid{grid-template-columns:1fr}.v17-desktop{min-height:300px}.v17-mirror-screen{min-height:360px;padding:28px 22px}.v17-mirror-screen .clock{font-size:46px}.v17-photo{border-radius:11px}.v17-terminal pre,.v17-editor pre{font-size:11px;padding:16px}.v17-sequence{grid-template-columns:repeat(2,1fr)}}
  `;
  document.head.appendChild(style);

  loadSprite().then(()=>requestAnimationFrame(()=>{const hero=document.querySelector('#stepView.active .step-hero');if(hero)delete hero.dataset.v17Step;apply();}));
  const observer=new MutationObserver(()=>requestAnimationFrame(apply));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  apply();
  window.addEventListener('pagehide',()=>{if(spriteUrl)URL.revokeObjectURL(spriteUrl);},{once:true});
})();
