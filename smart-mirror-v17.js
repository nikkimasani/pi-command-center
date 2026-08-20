(() => {
  'use strict';

  const smart = (window.PI_PROJECTS || []).find(p => p.id === 'smart-mirror');
  if (!smart) return;

  const SMART_MIRROR_STEP_COUNT = 16;
  const VISUAL_MANIFEST = Object.freeze({
    1:'ports',2:'os',3:'terminal-update',4:'dsi',5:'display-test',6:'terminal-install',7:'editor',8:'mirror',9:'systemd',10:'frame',11:'mount-display',12:'wiring',13:'back',14:'full-test',15:'mount',16:'finished'
  });

  const step=(title,summary,actions,success,warning,kind)=>({title,summary,actions,success,warning,visual:[title,summary],photos:[],v17Kind:kind});

  smart.summary='Build a complete Raspberry Pi 5 Smart Mirror from microSD preparation through final wall mounting, with 16 visual checkpoints, explicit actions, verification, and troubleshooting.';
  smart.steps=[
    step('Prep the SD Card and Identify the Hardware','Prepare the work area, identify every Pi 5 connector, and verify the microSD card before power is connected.',[
      'Clear a dry work area and place a soft towel beside it for the touchscreen.',
      'Lay out the Raspberry Pi 5, 7-inch DSI touchscreen, Waveshare 22-pin-to-15-pin DSI ribbon, Pi 5 case, 128 GB microSD, 45W USB-C supply, 12 × 12 two-way mirror acrylic, 12 × 12 shadow box, removable mounting strips or Velcro, micro-HDMI cable, and mini keyboard.',
      'Keep USB-C power disconnected from the Raspberry Pi 5.',
      'Use the visual above to identify USB-C power, two micro-HDMI ports, USB 3, USB 2, Ethernet, GPIO, microSD, and the MIPI camera/display connectors.',
      'Compare the DSI ribbon ends. The narrow end has 22 contacts for the Pi 5. The wider end has 15 contacts for the touchscreen.',
      'Insert the microSD card into your computer and confirm it appears before opening Raspberry Pi Imager.'
    ],'Every required part is identified, the Pi is unpowered, the microSD card is detected, and you can distinguish the 22-pin and 15-pin ribbon ends.','Do not continue if you are unsure which connector is USB-C power, micro-HDMI, or MIPI display. Never insert or remove the DSI ribbon while the Pi is powered.','ports'),

    step('Flash Raspberry Pi OS and Complete First Boot','Write Raspberry Pi OS 64-bit Desktop, preconfigure network access, and confirm the Pi reaches a stable desktop.',[
      'Download and open Raspberry Pi Imager on your computer.',
      'Choose Raspberry Pi 5 as the device and Raspberry Pi OS 64-bit Desktop as the operating system.',
      'Choose the 128 GB microSD card as storage. Confirm the selected drive is correct because it will be erased.',
      'Open Imager customisation. Set the hostname, enter Wi-Fi credentials, choose your locale and time zone, and enable SSH with password authentication.',
      'Write the image and wait for verification to complete before ejecting the card.',
      'Insert the microSD into the Pi. For first boot, use micro-HDMI if the DSI display is not connected yet.',
      'Connect the keyboard if needed, then connect USB-C power.',
      'Finish Raspberry Pi OS setup. Confirm the desktop loads, Wi-Fi connects, and the Pi remains stable.'
    ],'The Raspberry Pi OS desktop is visible, Wi-Fi is connected, and the Pi remains responsive.','If the Pi does not boot, power it off, reseat the microSD card, and confirm Raspberry Pi Imager completed both write and verification.','os'),

    step('Update Raspberry Pi OS','Bring the operating system fully up to date before installing mirror software.',[
      'Open Terminal from the Raspberry Pi OS desktop.',
      'Run sudo apt update and wait for package lists to finish.',
      'Run sudo apt full-upgrade -y and allow every upgrade to complete.',
      'Run sudo reboot.',
      'After reboot, confirm the desktop returns, Wi-Fi reconnects, and Terminal opens normally.'
    ],'The upgrade completes without package errors and the Pi returns to a stable desktop after reboot.','Do not interrupt power during an upgrade. Resolve apt errors before continuing.','terminal-update'),

    step('Connect the DSI Display Cable','Connect the narrow 22-pin end to the Pi 5 and the wider 15-pin end to the display with all power disconnected.',[
      'Shut the Pi down, unplug USB-C power, and wait at least 10 seconds.',
      'Locate the Pi 5 MIPI display connector shown in the visual. Do not use HDMI, USB, or GPIO.',
      'Release the small connector latch gently. Do not pry the socket off the board.',
      'Align the narrow 22-pin ribbon end squarely with the Pi connector. Keep the ribbon flat and untwisted.',
      'Insert the ribbon evenly until it stops, then close the latch while holding the cable straight.',
      'At the touchscreen, open its DSI latch and insert the wider 15-pin end fully and evenly.',
      'Close the display latch, then gently tug each end. Neither end should move.',
      'Route the ribbon in a broad curve. Do not crease it sharply.'
    ],'Both DSI ends are straight, fully seated, locked, and the ribbon has a smooth broad curve.','If either end looks crooked or slides out, remove it and start again while power is disconnected.','dsi'),

    step('Test the 7-inch Display and Touch','Prove video, touch, Wi-Fi, and basic stability while everything is still loose on the desk.',[
      'Place the touchscreen face-up on a soft towel and keep the Pi visible beside it.',
      'Reconnect USB-C power and let Raspberry Pi OS boot.',
      'Confirm the desktop appears on the 7-inch display.',
      'Tap icons, open a window, scroll, and type to confirm touch input.',
      'Confirm Wi-Fi remains connected and, if configured, test SSH from another device.',
      'Leave the setup running for at least 10 minutes and watch for flicker, restarts, or power warnings.'
    ],'The touchscreen shows a stable desktop, touch works, network access works, and the Pi remains stable for at least 10 minutes.','If the display is black, power off before reseating the DSI cable. If video works but touch does not, verify the exact display model and its touch requirements.','display-test'),

    step('Install MagicMirror²','Install MagicMirror only after the Pi and display pass hardware testing.',[
      'Open Terminal.',
      'Change to your home folder with cd ~.',
      'Clone the official repository with git clone https://github.com/MagicMirrorOrg/MagicMirror.git.',
      'Enter the folder with cd MagicMirror.',
      'Run the dependency installation command documented by the current MagicMirror release.',
      'Keep Terminal open until installation finishes. If it fails, capture the first meaningful error before retrying.'
    ],'The MagicMirror directory exists and dependency installation finishes without an npm failure.','Do not repeatedly rerun a failed installation without reading the first meaningful error.','terminal-install'),

    step('Configure MagicMirror','Create a minimal known-good configuration before adding optional modules.',[
      'Create config/config.js from the sample configuration if it does not exist.',
      'Open config/config.js in a text editor.',
      'Keep the clock module and one or two simple modules for the first test.',
      'Keep the background black so unused screen areas disappear behind the mirror.',
      'Add weather only after you have the required provider and location settings.',
      'Save the file and inspect commas, braces, quotation marks, module names, and positions carefully.'
    ],'config.js saves with valid JavaScript syntax and contains a minimal clock-first layout.','If MagicMirror reports a configuration error, check brackets, commas, module names, and values before changing anything else.','editor'),

    step('Test MagicMirror Manually','Run MagicMirror successfully before setting up automatic startup.',[
      'Open Terminal in the MagicMirror directory.',
      'Start MagicMirror with npm run start.',
      'Wait for the application window to open.',
      'Confirm the clock and configured modules appear over a black background.',
      'Leave it running several minutes and confirm Terminal is not repeating errors.',
      'Exit MagicMirror cleanly before continuing.'
    ],'MagicMirror starts manually and displays the configured modules without continuous errors.','Do not configure autostart until manual startup is reliable.','mirror'),

    step('Set Up Automatic Startup','Configure a user-level systemd service so MagicMirror returns after a normal desktop reboot.',[
      'Enable Desktop Autologin if you want the mirror to recover without keyboard input after reboot.',
      'Create the user-level systemd service recommended for Raspberry Pi OS Desktop.',
      'Run systemctl --user daemon-reload.',
      'Run systemctl --user enable magicmirror.service.',
      'Run systemctl --user start magicmirror.service.',
      'Check systemctl --user status magicmirror.service.',
      'Reboot and confirm MagicMirror returns automatically after desktop login.'
    ],'A cold reboot ends with MagicMirror running automatically.','If the service fails, inspect systemctl --user status and the user journal before editing the service again.','systemd'),

    step('Dry-fit the Shadow Box','Test the entire physical stack before attaching any component permanently.',[
      'Power the Pi off and disconnect USB-C.',
      'Open the 12 × 12 shadow box and remove its rear panel and decorative insert.',
      'Place the two-way mirror acrylic at the front where the original glass would sit.',
      'Center the 7-inch display behind the mirror and keep the LCD surface parallel to the mirror.',
      'Place the Pi case where it will not press on the LCD and where USB-C and ventilation remain accessible.',
      'Hold the rear panel in place without fastening it and verify room for the ribbon, power lead, and airflow.',
      'Mark display center and safe mounting areas with removable painter tape.'
    ],'The mirror, screen, Pi, cables, and rear panel all fit without pressure on the LCD or a sharp cable bend.','Do not force the rear panel closed. Pressure on the LCD can create bright spots, touch problems, or permanent damage.','frame'),

    step('Mount the Display Behind the Mirror','Secure the touchscreen with removable, serviceable mounting points.',[
      'Clean rigid mounting surfaces only. Keep adhesive away from the active LCD, connectors, flex cables, and vents.',
      'Apply short industrial Velcro strips or suitable removable fasteners to the rigid display frame or a backing plate.',
      'Attach matching strips inside the shadow box at your alignment marks.',
      'Press the display into place gently.',
      'Inspect from the front and correct tilt or centering now.',
      'Gently tilt the powered-off frame and confirm the display does not move.'
    ],'The display is level, centered, removable for service, and does not shift when the frame is gently tilted.','Never place strong adhesive directly on the active display surface or delicate flex circuitry.','mount-display'),

    step('Mount the Pi and Route the Cables','Create serviceable cable paths with strain relief and ventilation.',[
      'Choose a Pi mounting position that leaves USB-C, DSI, and ventilation accessible.',
      'Secure the Pi case to a rigid rear surface with removable Velcro or suitable standoffs.',
      'Route the DSI ribbon in a broad smooth curve without folding it sharply.',
      'Route USB-C power separately so it does not crush or pull the ribbon.',
      'Use small cable clips or loose Velcro loops for strain relief.',
      'Leave a small amount of service slack near connectors.',
      'Keep the Pi case and ventilation path uncovered.'
    ],'Cables lie flat, connectors are not under tension, nothing is pinched, and the Pi has a clear heat path.','A sharply creased ribbon or a cable trapped under the rear panel can create intermittent failures.','wiring'),

    step('Close the Rear Assembly','Inspect every layer before fastening the rear panel.',[
      'Keep power disconnected.',
      'Clean dust and fingerprints from the mirror acrylic with a suitable soft cloth.',
      'Confirm the display is centered and not under pressure.',
      'Confirm the Pi is secure and both DSI latches remain closed.',
      'Hold the rear panel in place and inspect the entire perimeter for trapped cables.',
      'Fasten the rear panel gradually and stop immediately if it bows or resists.',
      'Confirm the external USB-C lead exits without a sharp bend.'
    ],'The rear panel sits flat with no trapped cable, no LCD pressure, and a clean power exit.','If the back does not sit flat, reopen it and reposition components. Never solve a clearance problem by forcing the panel.','back'),

    step('Run the Full Assembly Test','Prove the completed enclosure is stable before wall mounting.',[
      'Stand the assembled mirror securely in its normal orientation but do not wall-mount it yet.',
      'Connect USB-C power and allow the Pi to boot.',
      'Confirm MagicMirror starts automatically.',
      'Check the clock and every configured module.',
      'Check Wi-Fi and touch if you plan to use touch through the acrylic.',
      'Run the mirror continuously for at least 30 minutes.',
      'Check CPU temperature with vcgencmd measure_temp during the test.',
      'Watch for flicker, undervoltage warnings, Wi-Fi drops, excessive heat, or restarts.'
    ],'The assembled mirror runs for at least 30 minutes, autostarts correctly, and remains thermally and electrically stable.','Resolve heat, power, display, or network instability before wall mounting or unattended use.','full-test'),

    step('Mount the Mirror Safely','Install the finished mirror only after choosing wall hardware appropriate for its completed weight and wall type.',[
      'Weigh or estimate the completed frame and choose hardware rated above that weight.',
      'Prefer a wall stud or appropriately rated anchors for the wall material.',
      'Mark a level position where the power cable reaches without tension.',
      'Install the mounting hardware according to its instructions.',
      'Lift the mirror into place and verify it is fully seated before releasing it.',
      'Route the power cable so it cannot be pulled or become a trip hazard.',
      'Power the mirror and confirm it still boots correctly while mounted.'
    ],'The mirror is level, stable, supported by correctly rated hardware, and the power cable is safely routed.','Do not rely on adhesive picture strips alone unless their rating, wall surface, and completed mirror weight clearly support the installation.','mount'),

    step('Finish and Back Up the Build','Save the working configuration and keep a maintenance path for future changes.',[
      'Confirm the mirror is readable from normal viewing distance and unused black areas disappear into the reflection.',
      'Photograph the finished front and rear assembly for future troubleshooting.',
      'Back up config/config.js plus any custom CSS and module configuration.',
      'Record the Pi hostname and SSH method used for maintenance.',
      'Use the working mirror for several days before adding optional modules.',
      'Power the Pi down before opening the frame or touching the DSI cable in the future.'
    ],'The mirror is mounted, boots itself, displays the intended content, and you have a known-good backup and maintenance plan.','Keep the known-good configuration backed up so experiments can be rolled back quickly.','finished')
  ];

  function raspberryMark(size=76){
    return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" role="img" aria-label="Raspberry"><g fill="#c51a4a"><circle cx="28" cy="31" r="11"/><circle cx="40" cy="27" r="11"/><circle cx="52" cy="31" r="11"/><circle cx="24" cy="43" r="11"/><circle cx="36" cy="42" r="11"/><circle cx="48" cy="43" r="11"/><circle cx="31" cy="54" r="10"/><circle cx="43" cy="54" r="10"/></g><g fill="#62a744"><ellipse cx="33" cy="16" rx="7" ry="14" transform="rotate(-35 33 16)"/><ellipse cx="47" cy="16" rx="7" ry="14" transform="rotate(35 47 16)"/><ellipse cx="40" cy="11" rx="6" ry="13"/></g></svg>`;
  }

  const svgWrap=(body,label)=>`<div class="v17-diagram" role="img" aria-label="${label}"><svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">${body}</svg></div>`;
  const text=(x,y,s,size=24,fill='#f4f7fb',weight=600,anchor='start')=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="Inter,Arial,sans-serif">${s}</text>`;
  const box=(x,y,w,h,fill='#111a25',stroke='#314155',r=18)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;

  function portsVisual(){
    return svgWrap(`<rect width="900" height="560" rx="24" fill="#080d14"/>${text(44,58,'Raspberry Pi 5 port map',32)}${text(44,91,'Use this to identify connectors before power is connected.',18,'#91a1b4',500)}
      <rect x="240" y="150" width="420" height="260" rx="28" fill="#2f7d4d" stroke="#6ac48c" stroke-width="4"/>
      <rect x="605" y="178" width="72" height="54" rx="7" fill="#aeb7c1"/><rect x="605" y="246" width="72" height="54" rx="7" fill="#aeb7c1"/><rect x="605" y="314" width="72" height="54" rx="7" fill="#aeb7c1"/>
      <rect x="280" y="392" width="64" height="22" rx="4" fill="#d7b665"/><rect x="360" y="392" width="64" height="22" rx="4" fill="#d7b665"/><rect x="445" y="392" width="88" height="22" rx="4" fill="#d7b665"/>
      <rect x="276" y="155" width="290" height="18" rx="5" fill="#172e20"/>${text(421,168,'GPIO 40-pin',14,'#dff5e7',700,'middle')}
      <rect x="270" y="245" width="34" height="82" rx="5" fill="#efe2bf"/><rect x="329" y="245" width="34" height="82" rx="5" fill="#efe2bf"/>
      <path d="M118 178 L252 192" stroke="#58d37f" stroke-width="3"/><circle cx="252" cy="192" r="7" fill="#58d37f"/>${text(44,170,'GPIO',20,'#58d37f',700)}
      <path d="M110 374 L278 402" stroke="#58d37f" stroke-width="3"/><circle cx="278" cy="402" r="7" fill="#58d37f"/>${text(44,367,'USB-C power',20,'#58d37f',700)}
      <path d="M443 474 L395 410" stroke="#58d37f" stroke-width="3"/><circle cx="395" cy="410" r="7" fill="#58d37f"/>${text(443,501,'2 × micro-HDMI',20,'#58d37f',700,'middle')}
      <path d="M735 196 L674 196" stroke="#58d37f" stroke-width="3"/><circle cx="674" cy="196" r="7" fill="#58d37f"/>${text(750,190,'USB 3 / USB 2',20,'#58d37f',700)}
      <path d="M744 338 L674 338" stroke="#58d37f" stroke-width="3"/><circle cx="674" cy="338" r="7" fill="#58d37f"/>${text(750,332,'Ethernet',20,'#58d37f',700)}
      <path d="M185 286 L271 286" stroke="#8d7cff" stroke-width="3"/><circle cx="271" cy="286" r="7" fill="#8d7cff"/>${text(44,278,'MIPI connectors',20,'#a99aff',700)}
      ${text(44,524,'Keep USB-C power disconnected during connector identification.',18,'#ffcb6b',700)}
    `,'Annotated Raspberry Pi 5 port map');
  }

  function osVisual(){
    return `<div class="v17-screen"><div class="v17-screen-top"><span>Raspberry Pi OS</span><span>Wi-Fi ◉ &nbsp; 100%</span></div><div class="v17-desktop">${raspberryMark(92)}<h3>Desktop ready</h3><p>Wi-Fi connected · SSH enabled</p><div class="v17-ready">✓ Continue when the desktop is stable</div></div></div>`;
  }

  function terminal(lines,title='Terminal'){
    return `<div class="v17-terminal"><div class="v17-terminal-head"><span>${title}</span><span>● ● ●</span></div><pre>${lines.map(x=>`<span>${x}</span>`).join('\n')}</pre></div>`;
  }

  function dsiVisual(){
    return svgWrap(`<rect width="900" height="560" rx="24" fill="#080d14"/>${text(44,58,'DSI ribbon: unlock → align → insert → lock',30)}${text(44,91,'Pi powered off. Narrow 22-pin end goes to the Pi 5.',18,'#91a1b4',500)}
      ${box(40,130,190,330)}${box(250,130,190,330)}${box(460,130,190,330)}${box(670,130,190,330)}
      ${text(135,176,'1  UNLOCK',20,'#58d37f',800,'middle')}${text(345,176,'2  ALIGN',20,'#58d37f',800,'middle')}${text(555,176,'3  INSERT',20,'#58d37f',800,'middle')}${text(765,176,'4  LOCK',20,'#58d37f',800,'middle')}
      <rect x="82" y="255" width="105" height="26" rx="5" fill="#d9e1ea"/><rect x="100" y="230" width="70" height="14" rx="4" fill="#8d7cff"/><path d="M135 214 v-48" stroke="#ffcb6b" stroke-width="4"/><path d="M127 176 l8-12 8 12" fill="#ffcb6b"/>
      <rect x="292" y="255" width="105" height="26" rx="5" fill="#d9e1ea"/><rect x="325" y="192" width="40" height="72" fill="#e8edf3"/><path d="M345 310 v-38" stroke="#58d37f" stroke-width="5"/>
      <rect x="502" y="255" width="105" height="26" rx="5" fill="#d9e1ea"/><rect x="535" y="214" width="40" height="62" fill="#e8edf3"/><path d="M555 194 v48" stroke="#58d37f" stroke-width="5"/><path d="M547 230 l8 12 8-12" fill="#58d37f"/>
      <rect x="712" y="255" width="105" height="26" rx="5" fill="#d9e1ea"/><rect x="745" y="214" width="40" height="62" fill="#e8edf3"/><rect x="730" y="230" width="70" height="14" rx="4" fill="#8d7cff"/>
      ${text(135,420,'Lift latch gently',16,'#a8b6c6',600,'middle')}${text(345,420,'Ribbon straight',16,'#a8b6c6',600,'middle')}${text(555,420,'Fully seated',16,'#a8b6c6',600,'middle')}${text(765,420,'Latch flat',16,'#a8b6c6',600,'middle')}
      ${text(44,520,'Do not crease the ribbon and never work on the DSI connector with power attached.',18,'#ffcb6b',700)}
    `,'Four-stage DSI ribbon installation guide');
  }

  function displayVisual(){return `<div class="v17-screen"><div class="v17-screen-top"><span>7-inch DSI display test</span><span>Wi-Fi ◉</span></div><div class="v17-desktop">${raspberryMark(74)}<h3>Raspberry Pi OS</h3><p>Video ✓ &nbsp; Touch ✓ &nbsp; Network ✓</p><div class="v17-ready">Run this loose on the desk for 10 minutes</div></div></div>`;}
  function editorVisual(){return `<div class="v17-code"><div>config/config.js</div><pre>modules: [
  { module: "clock", position: "top_left" },
  { module: "calendar", position: "top_left" }
]

/* Start simple. Add weather later. */</pre></div>`;}
  function mirrorVisual(){return `<div class="v17-mirror"><div class="v17-clock">10:30<div>MON, MAY 12</div></div><div class="v17-weather">☁ 72°<small>Partly Cloudy</small></div><div class="v17-list"><b>Up Next</b><span>10:00 Team Standup</span><span>12:00 Lunch</span><span>3:30 Project Review</span></div></div>`;}
  function systemdVisual(){return terminal(['$ systemctl --user daemon-reload','$ systemctl --user enable magicmirror.service','$ systemctl --user start magicmirror.service','$ systemctl --user status magicmirror.service','● magicmirror.service  active (running)'],'systemd user service');}

  function frameVisual(mode){
    const labels=mode==='mount-display'?['Two-way mirror acrylic','7-inch display','Removable mounting strips','Shadow-box frame']:['Front glass channel','Two-way mirror acrylic','7-inch display','Pi 5 case + cables','Rear panel'];
    return svgWrap(`<rect width="900" height="560" rx="24" fill="#080d14"/>${text(44,58,mode==='mount-display'?'Display mounting layout':'Shadow-box dry-fit stack',31)}${text(44,91,'Keep the screen flat, centered, removable, and free of pressure.',18,'#91a1b4',500)}
      <rect x="180" y="150" width="540" height="340" rx="24" fill="#7d6043" stroke="#b8956e" stroke-width="16"/>
      <rect x="240" y="195" width="420" height="250" rx="12" fill="#17202b" stroke="#d1d7df" stroke-width="5"/>
      <rect x="305" y="225" width="290" height="190" rx="8" fill="#05080c" stroke="#58d37f" stroke-width="4"/>
      <rect x="610" y="240" width="70" height="100" rx="10" fill="#2f7d4d" stroke="#6ac48c" stroke-width="3"/>
      ${labels.map((l,i)=>`${text(40,180+i*62,l,17,i===2?'#58d37f':'#c5d0dc',700)}<path d="M210 ${175+i*62} H${i===3?610:300}" stroke="${i===2?'#58d37f':'#526275'}" stroke-width="3"/>`).join('')}
    `,mode==='mount-display'?'Display mounted behind mirror diagram':'Shadow box dry-fit diagram');
  }

  function wiringVisual(){return svgWrap(`<rect width="900" height="560" rx="24" fill="#080d14"/>${text(44,58,'Rear cable routing and ventilation',31)}${text(44,91,'Leave service slack. Keep ribbon bends broad and vents clear.',18,'#91a1b4',500)}
    <rect x="135" y="135" width="630" height="360" rx="28" fill="#111820" stroke="#4a5b70" stroke-width="5"/>
    <rect x="205" y="210" width="330" height="210" rx="16" fill="#0a0e13" stroke="#d7dde5" stroke-width="4"/>${text(370,322,'7-inch display',25,'#f4f7fb',700,'middle')}
    <rect x="585" y="200" width="125" height="120" rx="16" fill="#2f7d4d" stroke="#6ac48c" stroke-width="4"/>${text(648,266,'Pi 5',28,'#fff',800,'middle')}
    <path d="M585 275 C535 275 548 350 500 350" fill="none" stroke="#e7edf4" stroke-width="18"/><path d="M585 275 C535 275 548 350 500 350" fill="none" stroke="#6d7f91" stroke-width="2"/>
    <path d="M710 250 C785 250 790 420 820 420" fill="none" stroke="#58d37f" stroke-width="10"/>
    ${text(500,390,'DSI: broad curve',17,'#a8b6c6',700,'middle')}${text(760,454,'USB-C exit',17,'#58d37f',700,'middle')}${text(648,355,'Keep vents clear',17,'#ffcb6b',700,'middle')}
  `,'Rear cable routing diagram');}

  function backVisual(){return svgWrap(`<rect width="900" height="560" rx="24" fill="#080d14"/>${text(44,58,'Rear panel closure check',31)}${text(44,91,'The back must sit flat without crushing a cable or pressing the LCD.',18,'#91a1b4',500)}
    <rect x="150" y="130" width="600" height="360" rx="28" fill="#111820" stroke="#4a5b70" stroke-width="5"/><rect x="205" y="180" width="490" height="260" rx="18" fill="#222b35" stroke="#67788b" stroke-width="4"/>
    ${text(450,286,'REAR PANEL',34,'#d9e2ec',800,'middle')}${text(450,328,'flat · no bowing · no trapped cables',19,'#58d37f',700,'middle')}
    <path d="M120 460 H780" stroke="#58d37f" stroke-width="6"/><path d="M750 450 l30 10 -30 10" fill="#58d37f"/>
  `,'Rear panel closure verification diagram');}

  function mountVisual(finished=false){return `<div class="v17-finished"><div class="v17-wall"><div class="v17-frame"><div class="v17-clock">10:45<div>MON, MAY 12</div></div><div class="v17-weather">☁ 73°<small>Partly Cloudy</small></div><div class="v17-list"><span>10:00 Team Standup</span><span>12:00 Lunch</span><span>3:30 Project Review</span></div></div></div><div class="v17-finish-label">${finished?'Finished Smart Mirror':'Wall-mount target'} · level · stable · safe power path</div></div>`;}

  function visualFor(n){
    switch(VISUAL_MANIFEST[n]){
      case 'ports': return portsVisual();
      case 'os': return osVisual();
      case 'terminal-update': return terminal(['$ sudo apt update','$ sudo apt full-upgrade -y','$ sudo reboot','System updated successfully']);
      case 'dsi': return dsiVisual();
      case 'display-test': return displayVisual();
      case 'terminal-install': return terminal(['$ cd ~','$ git clone https://github.com/MagicMirrorOrg/MagicMirror.git','$ cd MagicMirror','$ npm run install-mm','Installation complete']);
      case 'editor': return editorVisual();
      case 'mirror': return mirrorVisual();
      case 'systemd': return systemdVisual();
      case 'frame': return frameVisual('frame');
      case 'mount-display': return frameVisual('mount-display');
      case 'wiring': return wiringVisual();
      case 'back': return backVisual();
      case 'full-test': return `${mirrorVisual()}<div class="v17-test-row"><span>✓ Autostart</span><span>✓ 30 min</span><span>✓ Temp checked</span></div>`;
      case 'mount': return mountVisual(false);
      case 'finished': return mountVisual(true);
      default: return portsVisual();
    }
  }

  const css=document.createElement('style');
  css.id='smart-mirror-v17-css';
  css.textContent=`
    body.v17-smart-mirror{--purple:#49ce68;--green:#49ce68}
    body.v17-smart-mirror .step-main{overflow:visible!important;padding-bottom:130px!important}
    body.v17-smart-mirror .step-layout,body.v17-smart-mirror .step-hero{height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important}
    body.v17-smart-mirror .step-hardware,body.v17-smart-mirror .step-quicklinks{display:none!important}
    body.v17-smart-mirror .step-hero{background:#080d14!important;border:1px solid #293748!important}
    .v17-diagram,.v17-screen,.v17-terminal,.v17-code,.v17-mirror,.v17-finished{width:100%;border-radius:18px;overflow:hidden;background:#080d14;border:1px solid #293748;color:#f4f7fb}
    .v17-diagram svg{width:100%;height:auto;display:block}
    .v17-screen-top,.v17-terminal-head{display:flex;justify-content:space-between;padding:13px 16px;background:#111822;border-bottom:1px solid #293748;font-size:13px;color:#b9c5d2}
    .v17-desktop{min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:radial-gradient(circle at center,#152331,#080d14 68%);padding:30px;text-align:center}
    .v17-desktop h3{font-size:34px;margin:0}.v17-desktop p{font-size:20px;color:#9eacbc;margin:0}.v17-ready{margin-top:14px;padding:13px 18px;border:1px solid #2e8c4c;background:#0d311d;border-radius:12px;color:#72e491;font-weight:700}
    .v17-terminal pre,.v17-code pre{margin:0;padding:22px;min-height:330px;background:#020603;color:#65e77e;font:600 14px/1.8 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;overflow:auto}.v17-terminal pre span{display:block}
    .v17-code>div{padding:13px 16px;background:#111822;border-bottom:1px solid #293748;color:#b9c5d2}.v17-code pre{color:#e7edf4}
    .v17-mirror{min-height:460px;position:relative;background:linear-gradient(145deg,#08090b,#141719);padding:36px}.v17-clock{font-size:54px;line-height:1;color:#fff}.v17-clock div{font-size:14px;margin-top:8px;color:#c4ccd5}.v17-weather{position:absolute;top:140px;right:48px;font-size:42px}.v17-weather small{display:block;font-size:13px;color:#c4ccd5;margin-top:4px}.v17-list{position:absolute;left:36px;bottom:42px;display:flex;flex-direction:column;gap:8px;color:#d8e0e8}.v17-list b{color:#58d37f}.v17-list span{font-size:14px}
    .v17-test-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}.v17-test-row span{padding:12px;border:1px solid #2d8648;border-radius:10px;background:#0b2b19;color:#72e491;text-align:center;font-weight:700}
    .v17-wall{min-height:470px;background:linear-gradient(90deg,#8d6c4f,#b18a68 46%,#9c7659);padding:50px;display:grid;place-items:center}.v17-frame{width:min(78%,390px);aspect-ratio:1/1.18;border:18px solid #56483b;background:linear-gradient(145deg,#0a0b0d,#17191c);box-shadow:0 18px 45px #0008;position:relative;padding:24px}.v17-frame .v17-clock{font-size:34px}.v17-frame .v17-weather{top:120px;right:24px;font-size:28px}.v17-frame .v17-list{left:24px;bottom:28px}.v17-finish-label{padding:15px 18px;color:#c7d2de;background:#0b1119}
    .v17-berry{display:inline-block;vertical-align:middle}
    @media(max-width:820px){body.v17-smart-mirror .step-main{padding-bottom:145px!important}.v17-diagram,.v17-screen,.v17-terminal,.v17-code,.v17-mirror,.v17-finished{border-radius:14px}.v17-desktop{min-height:350px}.v17-desktop h3{font-size:28px}.v17-desktop p{font-size:17px}.v17-terminal pre,.v17-code pre{font-size:12px;min-height:270px}.v17-mirror{min-height:390px;padding:26px}.v17-clock{font-size:44px}.v17-weather{right:28px}.v17-wall{min-height:400px;padding:30px 20px}}
  `;
  document.head.appendChild(css);

  function currentStep(){const c=document.querySelector('.step-chip');const m=c&&c.textContent.match(/Step\s+(\d+)/i);return m?Number(m[1]):0}
  function isSmartOpen(){return !!document.querySelector('#stepView.active') && window.curProj?.id==='smart-mirror' || document.body.dataset.v17Smart==='1'}
  function replaceBrandMarks(){
    document.querySelectorAll('.project-card').forEach(card=>{if(/smart mirror/i.test(card.textContent||'')){const icon=card.querySelector('.project-image');if(icon&&!icon.dataset.v17brand){icon.innerHTML=raspberryMark(52);icon.dataset.v17brand='1'}}});
  }
  function applyStep(){
    const n=currentStep();
    if(!n||n>SMART_MIRROR_STEP_COUNT)return;
    const active=document.querySelector('#stepView.active');
    if(!active)return;
    const title=active.querySelector('.step-title-area h1')?.textContent||'';
    const isMirror=(window.curProj&&window.curProj.id==='smart-mirror') || smart.steps.some(s=>s.title===title);
    if(!isMirror)return;
    document.body.classList.add('v17-smart-mirror');document.body.dataset.v17Smart='1';
    const hero=active.querySelector('.step-hero');if(hero&&hero.dataset.v17step!==String(n)){hero.classList.remove('has-photo');hero.innerHTML=visualFor(n);hero.dataset.v17step=String(n)}
    const genericHardware=active.querySelector('.step-hardware');if(genericHardware)genericHardware.style.display='none';
    const quicklinks=active.querySelector('.step-quicklinks');if(quicklinks)quicklinks.style.display='none';
    const top=active.querySelector('.step-topbar');if(top){const chip=top.querySelector('.step-chip');if(chip)chip.innerHTML=`Step <span>${n}</span> of 16`;}
    replaceBrandMarks();
  }
  function cleanup(){if(!document.querySelector('#stepView.active')){document.body.classList.remove('v17-smart-mirror');delete document.body.dataset.v17Smart}}

  replaceBrandMarks();
  const obs=new MutationObserver(()=>requestAnimationFrame(()=>{applyStep();cleanup();replaceBrandMarks()}));
  obs.observe(document.body,{subtree:true,childList:true,characterData:true});
  document.addEventListener('click',()=>setTimeout(applyStep,0));
  setTimeout(applyStep,0);
})();
