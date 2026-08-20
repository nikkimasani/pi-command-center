(() => {
  'use strict';

  const smart = (window.PI_PROJECTS || []).find(p => p.id === 'smart-mirror');
  if (!smart) return;

  const step = (title, summary, actions, success, warning, kind, visual) => ({
    title, summary, actions, success, warning,
    visual: visual || [title, summary],
    photos: [],
    v16Kind: kind || 'hardware'
  });

  smart.summary = 'Build a complete Raspberry Pi 5 Smart Mirror from microSD preparation through final wall mounting, with 16 beginner-first visual checkpoints.';
  smart.steps = [
    step('Prep the SD Card','Prepare the microSD card and all hardware before powering the Pi.',[
      'Set the Raspberry Pi 5, 128 GB microSD card, microSD adapter or reader, 45W USB-C supply, 7-inch DSI touchscreen, 22-pin-to-15-pin DSI cable, mirror acrylic, shadow box, Velcro, micro-HDMI cable, and mini keyboard on a clean dry work surface.',
      'Keep the Raspberry Pi power supply unplugged. Do not connect the DSI ribbon while the Pi is powered.',
      'Insert the microSD card into your computer using the card reader or adapter.',
      'Confirm the computer detects the card before opening Raspberry Pi Imager.'
    ],'The microSD card is detected by your computer and every required part is identified before power is connected.','Do not continue if the card is not detected or if you cannot identify the narrow 22-pin Pi end and wider 15-pin display end of the DSI cable.','parts',['microSD ready','All parts identified','Pi unpowered']),

    step('First Boot','Flash Raspberry Pi OS, preconfigure Wi-Fi and SSH, then complete the first startup.',[
      'Download and open Raspberry Pi Imager on your computer.',
      'Choose Raspberry Pi 5 as the device and Raspberry Pi OS 64-bit Desktop as the operating system.',
      'Choose the 128 GB microSD card as storage. Double-check the drive before writing because the selected drive will be erased.',
      'Open Imager customisation. Set hostname to nikkipi, enter your Wi-Fi credentials, set the locale/time zone to America/Chicago, and enable SSH with password authentication.',
      'Write the image, wait for verification to finish, eject the card safely, and insert it into the Pi 5.',
      'For this first boot, use micro-HDMI if the DSI display is not connected yet. Connect keyboard if needed, then connect USB-C power.',
      'Finish the Raspberry Pi OS desktop setup and confirm the desktop appears.'
    ],'Raspberry Pi OS reaches the desktop and the Pi connects to your Wi-Fi network.','If the Pi does not boot, power it off, reseat the microSD card, and confirm Imager completed both writing and verification.','boot',['Raspberry Pi OS','Wi-Fi connected','SSH enabled']),

    step('Update the System','Bring Raspberry Pi OS fully up to date before installing mirror software.',[
      'Open Terminal from the Raspberry Pi OS desktop.',
      'Run sudo apt update and wait for the package lists to finish.',
      'Run sudo apt full-upgrade -y and allow all upgrades to complete.',
      'Run sudo reboot after the upgrade finishes.',
      'After reboot, reopen Terminal and confirm the Pi is responsive and online.'
    ],'The upgrade completes without package errors and the Pi returns to the desktop after reboot.','Do not interrupt power during an upgrade. If apt reports an error, resolve it before installing MagicMirror.','terminal',['sudo apt update','sudo apt full-upgrade -y','sudo reboot']),

    step('Connect the DSI Display Cable','Connect the display ribbon correctly with the Pi fully powered off.',[
      'Shut the Pi down and disconnect the USB-C power cable. Wait at least 10 seconds.',
      'Locate the Pi 5 MIPI display connector. Use the connector intended for the display, not an HDMI or USB port.',
      'Gently lift or release the connector latch. Do not pry the socket off the board.',
      'Align the narrow 22-pin end of the DSI cable squarely with the Pi connector. Keep the ribbon flat and untwisted.',
      'Insert the ribbon evenly until it stops, then close the latch while holding the cable straight.',
      'At the display, open its DSI connector latch and insert the wider 15-pin end fully and evenly.',
      'Close the display latch and gently tug each ribbon end. Neither end should slide out.'
    ],'Both DSI ends are straight, fully seated, and locked. The ribbon has a broad curve with no sharp crease.','If either end looks crooked, remove it and start again while power is disconnected. A partially seated ribbon can cause a black screen or intermittent display.','dsi',['Unlock','Align','Insert','Lock']),

    step('Test the Display','Prove display, touch, network, and SSH while everything is still loose on the desk.',[
      'Place the touchscreen face-up on a soft towel. Keep the Pi and display loose and visible.',
      'Reconnect the Pi USB-C power supply and allow Raspberry Pi OS to boot.',
      'Confirm the Raspberry Pi OS desktop appears on the 7-inch display.',
      'Tap icons, open a window, scroll, and type using the on-screen or mini keyboard to confirm touch response.',
      'From another computer or phone on the same network, confirm the Pi responds at nikkipi.local or connect with SSH.',
      'Leave the setup running for 10 minutes and watch for screen flicker, restarts, or power warnings.'
    ],'The touchscreen shows a stable desktop, touch input works, Wi-Fi works, and the Pi remains stable for at least 10 minutes.','If the display is black, power off before reseating the DSI cable. If touch is missing but video works, verify the display model and its connection requirements.','display',['Desktop visible','Touch works','Network works']),

    step('Install MagicMirror²','Install MagicMirror and its dependencies on the tested Raspberry Pi.',[
      'Open Terminal.',
      'Confirm Node.js prerequisites are available according to the current MagicMirror installation instructions.',
      'Change to your home directory with cd ~.',
      'Clone the MagicMirror repository with git clone https://github.com/MagicMirrorOrg/MagicMirror.git.',
      'Enter the folder with cd MagicMirror.',
      'Run npm run install-mm and allow the installation to finish. If your installed MagicMirror version documents npm install instead, follow the command shown by the official installer for that release.',
      'Do not close Terminal until the installation exits without errors.'
    ],'The MagicMirror folder exists and dependency installation completes without an npm failure.','If npm fails, copy the first real error line before retrying. Re-running commands blindly can hide the root cause.','terminal',['cd ~','git clone MagicMirror','install dependencies']),

    step('Configure MagicMirror','Edit config.js so the first mirror screen contains only a few useful modules.',[
      'From the MagicMirror folder, create the initial config if needed by copying config/config.js.sample to config/config.js.',
      'Open config/config.js in a text editor.',
      'Keep the clock and calendar modules for the first test.',
      'Add or configure weather only after you have the required location/provider settings.',
      'Keep the background black and avoid adding many modules before the basic mirror works.',
      'Save the file and check carefully for missing commas, braces, or quotation marks.'
    ],'config.js saves successfully and contains a simple clock/calendar layout with valid JavaScript syntax.','If MagicMirror later opens to an error screen, return here and compare brackets, commas, module names, and configuration values.','editor',['clock','calendar','weather later']),

    step('Test MagicMirror','Run MagicMirror manually before configuring automatic startup.',[
      'Open Terminal in the MagicMirror directory.',
      'Start MagicMirror using npm run start.',
      'Wait for the Electron window to open.',
      'Confirm the clock and configured modules appear over a black background.',
      'Leave it running for several minutes and confirm there are no repeating errors in Terminal.',
      'Exit MagicMirror cleanly before continuing.'
    ],'MagicMirror opens full-screen or in its application window and shows the configured modules without continuous errors.','Do not configure autostart until manual startup works reliably. Fix module or configuration errors first.','mirror',['MagicMirror running','Black background','Modules visible']),

    step('Set Up Autostart','Make MagicMirror start automatically after Raspberry Pi OS Desktop logs in.',[
      'Enable Desktop Autologin in Raspberry Pi configuration if you want the mirror to recover automatically after reboot.',
      'Create a user-level systemd service for MagicMirror using the current MagicMirror autostart documentation.',
      'Reload the user service configuration with systemctl --user daemon-reload.',
      'Enable the service with systemctl --user enable magicmirror.service.',
      'Start it with systemctl --user start magicmirror.service.',
      'Check status with systemctl --user status magicmirror.service.',
      'Reboot the Pi and confirm MagicMirror returns without manually opening Terminal.'
    ],'A cold reboot ends with MagicMirror running automatically after desktop login.','If the service fails, read systemctl --user status and the journal output before changing the service file.','terminal',['systemd user service','enable','start','reboot']),

    step('Assemble the Frame','Dry-fit the mirror acrylic and display inside the 12 × 12 shadow box before attaching anything permanently.',[
      'Power the Pi off and disconnect USB-C.',
      'Open the shadow box and remove its rear panel and decorative insert.',
      'Place the two-way mirror acrylic at the front in the same plane where the original glass sits.',
      'Center the 7-inch display behind the mirror. Keep its LCD surface parallel to the mirror.',
      'Hold the rear panel in position without closing it and confirm there is room for the Pi, ribbon, USB-C cable, and ventilation.',
      'Mark the display center and safe mounting zones with removable painter tape.'
    ],'The mirror, screen, Pi, and rear panel all fit without pressing on the LCD or sharply bending a cable.','Do not force the rear panel closed. Pressure on the LCD can create bright spots, touch problems, or permanent damage.','frame',['Mirror acrylic','7-inch display area','12 × 12 frame']),

    step('Mount the Display','Secure the touchscreen behind the mirror using removable, serviceable mounting points.',[
      'Clean only rigid mounting surfaces. Keep adhesive away from the visible LCD, flex cables, connectors, and vents.',
      'Apply short industrial Velcro strips or suitable removable fasteners to the rigid display frame or a backing plate.',
      'Attach matching strips inside the shadow box at your alignment marks.',
      'Press the display into place gently.',
      'Look from the front and correct tilt or centering before adding the Pi.',
      'Gently tilt the powered-off frame and confirm the display does not shift.'
    ],'The display is level, centered, removable for service, and does not move when the frame is gently tilted.','Never place strong adhesive directly on the active display surface or delicate flex circuitry.','frame',['Centered display','Removable fasteners','No LCD pressure']),

    step('Route the Cables','Mount the Pi and create clean cable paths with strain relief and ventilation.',[
      'Choose a Pi mounting position that leaves USB-C, DSI, and ventilation accessible.',
      'Secure the Pi case to a rigid rear surface with removable Velcro or suitable standoffs.',
      'Route the DSI ribbon in a broad smooth curve. Do not fold it sharply.',
      'Route USB-C power separately so it does not crush or pull the ribbon.',
      'Use small cable clips or loose Velcro loops for strain relief.',
      'Leave a little service slack near connectors so the Pi can be removed later.',
      'Keep the Pi case and ventilation path uncovered.'
    ],'The cables lie flat, nothing is pinched, connectors are not under tension, and the Pi has a clear path for heat to escape.','A sharply creased DSI ribbon or a cable trapped under the back panel can create intermittent failures.','wiring',['Pi mounted','DSI broad curve','USB-C exit','Ventilation']),

    step('Final Assembly','Close the shadow box only after inspecting every layer and cable.',[
      'With power still disconnected, inspect the mirror acrylic for dust or fingerprints and clean it with a suitable soft cloth.',
      'Confirm the display is centered and does not contact the mirror with excessive pressure.',
      'Confirm the Pi is secure and the DSI latch is still closed at both ends.',
      'Hold the rear panel in place and inspect the entire perimeter for trapped cables.',
      'Close or fasten the rear panel gradually. Stop immediately if it bows or resists.',
      'Confirm the external USB-C cable exits without a sharp bend.'
    ],'The rear panel sits flat and secure with no cable trapped at an edge and no pressure on the display.','If the back does not sit flat, reopen it and reposition components. Do not solve a clearance problem by forcing the panel closed.','back',['Rear panel flat','Cables clear','Pi secure']),

    step('Test Everything','Run the completed mirror on the desk before wall mounting.',[
      'Stand the assembled mirror securely in its normal orientation but do not wall-mount it yet.',
      'Connect USB-C power and allow the Pi to boot.',
      'Confirm MagicMirror starts automatically.',
      'Check the clock, weather or other configured modules, Wi-Fi, and touch if you plan to use touch through the acrylic.',
      'Run the mirror for at least 30 minutes.',
      'Open a terminal or SSH session and run vcgencmd measure_temp during the test.',
      'Watch for flicker, undervoltage messages, Wi-Fi drops, excessive heat, or spontaneous restarts.'
    ],'The assembled mirror runs continuously for 30 minutes, starts automatically, and remains thermally and electrically stable.','Solve heat, power, display, or network instability before mounting the mirror on a wall or leaving it unattended.','mirror',['Autostart works','30-minute test','Temperature checked']),

    step('Mount to the Wall','Install the completed mirror only after confirming the wall, hardware, and cable path can support it safely.',[
      'Weigh or estimate the completed frame and choose wall hardware rated above that weight.',
      'Prefer a wall stud or appropriately rated anchors for the wall type.',
      'Mark a level mounting position where the power cable can reach without tension.',
      'Install the mounting hardware according to its instructions.',
      'Lift the mirror into place and verify it is fully seated before releasing it.',
      'Route the power cable so it cannot be pulled or become a trip hazard.',
      'Power the mirror and confirm it still boots correctly in its mounted position.'
    ],'The mirror is level, stable, supported by correctly rated hardware, and the power cable is safely routed.','Do not rely on adhesive picture strips alone unless their manufacturer rating, wall surface, and completed mirror weight clearly support the installation.','mount',['Level','Rated hardware','Safe power path']),

    step('Enjoy Your Smart Mirror','Finish the build, save your working configuration, and keep a maintenance path.',[
      'Confirm the mirror shows the information you actually want at normal viewing distance.',
      'Take photos of the finished front and rear layout for future troubleshooting.',
      'Back up config/config.js and any custom CSS or module configuration.',
      'Record the Pi hostname and how to SSH into it for maintenance.',
      'Avoid adding new modules immediately. Use the working mirror for a few days and only add features that improve it.',
      'If you change hardware later, power the Pi down before opening the frame or touching the DSI cable.'
    ],'The mirror is mounted, boots itself, displays the intended content clearly, and you have a saved configuration and maintenance plan.','Keep the known-good configuration backed up so future experiments can be rolled back quickly.','finished',['Build complete','Configuration backed up','Ready to use'])
  ];

  const css = document.createElement('style');
  css.id = 'smart-mirror-v16-hires-css';
  css.textContent = `
    body.v16-smart-mirror { --purple:#42c85a; --green:#42c85a; }
    body.v16-smart-mirror .step-main { overflow:visible!important; padding-bottom:120px!important; }
    body.v16-smart-mirror .step-layout { min-height:auto!important; }
    body.v16-smart-mirror .step-hero { min-height:0!important; height:auto!important; max-height:none!important; overflow:visible!important; background:#090f16; }
    body.v16-smart-mirror .step-hero.has-photo img,
    body.v16-smart-mirror .v16-photo { width:100%!important; height:auto!important; max-height:none!important; object-fit:contain!important; image-rendering:auto!important; display:block; }
    .v16-hero { width:100%; min-height:340px; padding:24px; background:linear-gradient(145deg,#0b1119,#090d13); color:#f4f7fb; display:flex; flex-direction:column; justify-content:center; gap:18px; }
    .v16-eyebrow { color:#42c85a; font-size:12px; letter-spacing:.12em; font-weight:800; text-transform:uppercase; }
    .v16-terminal { background:#020604; border:1px solid #233529; border-radius:14px; padding:20px; font:600 14px/1.75 ui-monospace,SFMono-Regular,Menlo,monospace; color:#5bea72; overflow:auto; box-shadow:inset 0 0 40px rgba(40,180,70,.05); }
    .v16-terminal .dim { color:#82928a; }
    .v16-screen { border:1px solid #263442; border-radius:16px; background:#05080c; padding:24px; min-height:300px; display:grid; place-items:center; }
    .v16-screen-card { width:min(100%,560px); padding:28px; border-radius:18px; border:1px solid #283746; background:#090e14; text-align:center; }
    .v16-clock { font-size:64px; font-weight:300; letter-spacing:-.04em; }
    .v16-weather { margin-top:22px; font-size:34px; }
    .v16-editor { background:#080b0f; border-radius:14px; border:1px solid #26323e; padding:20px; font:500 13px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace; color:#c8d2dc; white-space:pre-wrap; }
    .v16-workbench { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
    .v16-part { min-height:120px; border:1px solid #293746; border-radius:14px; background:#101821; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; }
    .v16-part strong { color:#fff; font-size:15px; }
    .v16-part span { color:#8fa0b5; font-size:12px; margin-top:4px; }
    .v16-assembly { position:relative; width:100%; min-height:370px; border-radius:16px; background:#111820; border:1px solid #2b3946; overflow:hidden; }
    .v16-frame { position:absolute; inset:24px; border:18px solid #34271d; border-radius:6px; background:#15191d; box-shadow:inset 0 0 0 2px #53606a; }
    .v16-display { position:absolute; width:52%; height:48%; left:24%; top:25%; border:3px solid #5b6670; background:#050607; display:grid; place-items:center; color:#9eabb8; }
    .v16-pi { position:absolute; width:30%; height:19%; left:35%; top:8%; border:2px solid #4ba95b; background:#173d24; border-radius:8px; display:grid; place-items:center; color:#dff7e5; font-weight:800; }
    .v16-cable { position:absolute; left:49%; top:26%; width:3%; height:30%; background:repeating-linear-gradient(90deg,#f7f7f7 0 4px,#b6ccf2 4px 6px); }
    .v16-check { display:flex; align-items:flex-start; gap:12px; padding:16px; border:1px solid #215d34; border-radius:14px; background:#0b2113; color:#dff6e5; }
    .v16-check b { color:#5bea72; }
    @media(max-width:820px){
      body.v16-smart-mirror .main-area, body.v16-smart-mirror .content-wrap, body.v16-smart-mirror #stepView { height:auto!important; max-height:none!important; overflow:visible!important; }
      body.v16-smart-mirror .step-layout { display:block!important; }
      body.v16-smart-mirror .right-panel { position:static!important; height:auto!important; max-height:none!important; overflow:visible!important; }
      body.v16-smart-mirror .step-main { padding:16px 16px 140px!important; }
      body.v16-smart-mirror .bottom-nav { height:64px; }
      .v16-hero { min-height:260px; padding:16px; }
      .v16-workbench { grid-template-columns:1fr 1fr; }
      .v16-clock { font-size:48px; }
    }
  `;
  document.head.appendChild(css);

  function currentStepNumber() {
    const chip = document.querySelector('.step-chip');
    const m = chip && chip.textContent.match(/Step\s+(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  function heroFor(n) {
    const s = smart.steps[n - 1];
    if (!s) return '';
    const kind = s.v16Kind;
    if (kind === 'terminal') {
      const rows = n === 3 ? ['$ sudo apt update','$ sudo apt full-upgrade -y','$ sudo reboot','','System updated successfully.'] :
        n === 6 ? ['$ cd ~','$ git clone https://github.com/MagicMirrorOrg/MagicMirror.git','$ cd MagicMirror','$ npm run install-mm','','Dependencies installed.'] :
        ['$ systemctl --user daemon-reload','$ systemctl --user enable magicmirror.service','$ systemctl --user start magicmirror.service','$ systemctl --user status magicmirror.service','','● magicmirror.service  active (running)'];
      return `<div class="v16-hero"><div class="v16-eyebrow">Software step ${n} of 16</div><div class="v16-terminal">${rows.map(r=>r ? `<div>${r.replaceAll('&','&amp;').replaceAll('<','&lt;')}</div>` : '<br>').join('')}</div><div class="v16-check"><span>✓</span><div><b>What you should see</b><br>The command finishes without a fatal error before you continue.</div></div></div>`;
    }
    if (kind === 'editor') {
      return `<div class="v16-hero"><div class="v16-eyebrow">Configuration reference</div><div class="v16-editor">modules: [\n  { module: "clock", position: "top_left" },\n  { module: "calendar", position: "top_left" }\n]\n\n/* Keep the first configuration simple. */</div><div class="v16-check"><span>✓</span><div><b>Verify</b><br>Save the file with matching braces, brackets, commas, and quotation marks.</div></div></div>`;
    }
    if (kind === 'mirror' || kind === 'finished') {
      return `<div class="v16-hero"><div class="v16-eyebrow">Live mirror target</div><div class="v16-screen"><div class="v16-screen-card"><div class="v16-clock">10:30</div><div>Thu, Aug 20</div><div class="v16-weather">⛅ 78°</div><div style="margin-top:6px;color:#91a0ae">Partly Cloudy</div></div></div><div class="v16-check"><span>✓</span><div><b>What you should see</b><br>Bright information floats over a truly black background so dark areas disappear behind the two-way mirror.</div></div></div>`;
    }
    if (kind === 'parts') {
      return `<div class="v16-hero"><div class="v16-eyebrow">Hardware checklist</div><div class="v16-workbench"><div class="v16-part"><strong>Raspberry Pi 5</strong><span>4 GB board + case</span></div><div class="v16-part"><strong>7-inch DSI display</strong><span>Touchscreen</span></div><div class="v16-part"><strong>22→15 pin DSI cable</strong><span>Identify both ends</span></div><div class="v16-part"><strong>12 × 12 mirror + frame</strong><span>Two-way acrylic + shadow box</span></div></div><div class="v16-check"><span>✓</span><div><b>Before power</b><br>Everything is identified and the Pi remains unplugged.</div></div></div>`;
    }
    if (kind === 'boot' || kind === 'display') {
      return `<div class="v16-hero"><div class="v16-eyebrow">Screen checkpoint</div><div class="v16-screen"><div class="v16-screen-card"><div style="font-size:82px">🍓</div><div style="font-size:22px;font-weight:800;margin-top:12px">Raspberry Pi OS</div><div style="color:#91a0ae;margin-top:8px">Desktop loaded • Wi-Fi connected${kind==='display'?' • Touch responding':''}</div></div></div><div class="v16-check"><span>✓</span><div><b>Continue only when</b><br>The desktop is stable and the required input/network checks pass.</div></div></div>`;
    }
    if (kind === 'dsi') {
      return `<div class="v16-hero"><div class="v16-eyebrow">DSI connection</div><img class="v16-photo" src="/assets/generic/pi5-board.jpg" alt="High resolution Raspberry Pi 5 board reference"><div class="v16-check"><span>✓</span><div><b>Connection sequence</b><br>Power off → unlock latch → align ribbon squarely → insert fully → lock latch → gentle tug test.</div></div></div>`;
    }
    if (kind === 'frame' || kind === 'wiring' || kind === 'back' || kind === 'mount') {
      return `<div class="v16-hero"><div class="v16-eyebrow">Physical assembly reference</div><div class="v16-assembly"><div class="v16-frame"></div><div class="v16-pi">PI 5</div><div class="v16-cable"></div><div class="v16-display">7-inch display area</div></div><div class="v16-check"><span>✓</span><div><b>Assembly rule</b><br>Nothing presses the LCD, the DSI ribbon stays gently curved, the rear panel closes flat, and ventilation remains open.</div></div></div>`;
    }
    return `<div class="v16-hero"><div class="v16-eyebrow">Smart Mirror checkpoint</div><div class="v16-check"><span>✓</span><div><b>${s.title}</b><br>${s.success}</div></div></div>`;
  }

  let decorating = false;
  function decorate() {
    if (decorating) return;
    const view = document.getElementById('stepView');
    if (!view || !view.classList.contains('active')) {
      document.body.classList.remove('v16-smart-mirror');
      return;
    }
    const title = document.querySelector('.step-title-area h1');
    const n = currentStepNumber();
    if (!n || !smart.steps[n-1] || !title || title.textContent.trim() !== smart.steps[n-1].title) return;
    document.body.classList.add('v16-smart-mirror');
    const hero = document.querySelector('.step-hero');
    if (!hero) return;
    const marker = `v16-${n}`;
    if (hero.dataset.v16 === marker) return;
    decorating = true;
    hero.classList.add('has-photo');
    hero.dataset.v16 = marker;
    hero.innerHTML = heroFor(n);
    requestAnimationFrame(() => { decorating = false; });
  }

  const observer = new MutationObserver(() => requestAnimationFrame(decorate));
  observer.observe(document.body, {subtree:true, childList:true, characterData:true});

  if (typeof window.renderHome === 'function') window.renderHome();
  setTimeout(decorate, 50);
  window.SMART_MIRROR_V16 = { version: '16.0.0', steps: smart.steps.length };
})();
