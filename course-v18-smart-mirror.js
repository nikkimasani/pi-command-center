/* Smart Mirror V18: a purpose-built sequence with visual references that match each lesson. */
(()=>{
  const course=(window.PI_COURSES_V2||[]).find(item=>item.id==='smart-mirror');
  if(!course)return;
  const photo=(src,label,caption)=>({src,label,caption});
  const action=(title,detail)=>({title,detail});
  const command=(label,code,result)=>({label,code,result});
  const lesson=(title,why,time,photos,actions,success,warning='',commands=[])=>({title,why,time,visual:{photos},actions,success,warning,commands,trouble:[]});
  course.phases=[
    lesson('Lay out and inspect the Smart Mirror hardware','Confirm the exact hardware is present and undamaged before any cable is connected or material is cut.','15–25 min',[
      photo('/assets/lesson-photos/smart-mirror-kit.png','Smart Mirror kit layout','The Pi, display, two-way mirror sheet, frame, cable, power supply, and mounting materials are laid out before assembly.')
    ],[
      action('Create a protected work surface','Use a clean, dry table and place a soft towel beneath the display and mirror sheet.'),
      action('Match every part to the course materials','Check the Pi, display, compatible DSI cable, power supply, frame, mirror material, mask material, and mounting hardware.'),
      action('Inspect the display and ribbon cable','Stop if the display has cracked glass, the ribbon has a crease, or a connector latch is damaged.'),
      action('Keep USB-C power disconnected','Do not connect power during inventory or while checking ribbon orientation.')
    ],['Every required part is present.','The Pi is powered off.','The display, mirror sheet, and DSI cable have no visible damage.']),
    lesson('Prepare Raspberry Pi OS on a temporary display','Build a stable Pi OS installation before placing any hardware into the mirror frame.','30–60 min',[
      photo('/assets/reference/imager-flow.svg?v=17.0.0','Raspberry Pi Imager workflow','Choose Raspberry Pi 5, Raspberry Pi OS 64-bit Desktop, and only the intended microSD card.'),
      photo('/assets/reference/first-boot.svg?v=17.0.0','First boot check','Use a temporary HDMI display and keyboard to confirm the desktop, network, and power supply are stable.')
    ],[
      action('Write Raspberry Pi OS Desktop','Use Raspberry Pi Imager to write Raspberry Pi OS 64-bit Desktop to the intended microSD card.'),
      action('Set access details before writing','Configure Wi-Fi, locale, hostname, username, password, and SSH in Imager customization.'),
      action('Boot on temporary HDMI first','Connect HDMI and input devices before USB-C power; keep the mirror display disconnected for this software check.'),
      action('Update and reboot','Confirm Wi-Fi, a clean update, and one successful restart before moving on.')
    ],['Raspberry Pi OS Desktop is usable.','Wi-Fi works.','The Pi completes a clean reboot.'],'Do not troubleshoot the operating system and a new DSI connection at the same time.'),
    lesson('Install the shared Raspberry Pi tools','Set up Terminal, Git, Python, and Chromium before installing the mirror application.','20–35 min',[
      photo('/assets/reference/software-tools.svg?v=17.0.0','Shared tools diagram','Install the common command-line and browser tools while the Pi is still on the temporary display.')
    ],[
      action('Open Terminal on Raspberry Pi OS','Use the temporary HDMI display while verifying the base system.'),
      action('Update package information','Complete the update before installing any project software.'),
      action('Install the shared tools','Install Git, curl, Python, virtual-environment support, and Chromium.'),
      action('Create one project folder','Use ~/pi-projects so the software location stays predictable.'),
      action('Verify the versions','Confirm Git and Python print version numbers and Chromium opens.')
    ],['Git and Python report versions.','Chromium opens.','~/pi-projects exists.'],'Keep the Pi powered from the known-good Pi 5 power supply during package installation.',[
      command('Install shared tools','sudo apt update && sudo apt install -y git curl python3 python3-venv python3-pip chromium || sudo apt install -y git curl python3 python3-venv python3-pip chromium-browser','The packages finish without an unresolved error.'),
      command('Create project folder','mkdir -p ~/pi-projects','The folder is created.')
    ]),
    lesson('Install and test MagicMirror² before framing','Prove the dashboard software on the temporary display before it is hidden behind acrylic or installed in the frame.','35–75 min',[
      photo('/assets/reference/magicmirror-install.svg?v=17.0.0','MagicMirror² installation diagram','Install from the official MagicMirrorOrg repository, make a working configuration, and test the default screen first.')
    ],[
      action('Check Node.js and Git','Confirm both commands report versions; use the current MagicMirror² documentation if Node does not meet its current requirement.'),
      action('Clone the official MagicMirror² repository','Use the MagicMirrorOrg repository, not an outdated third-party installer.'),
      action('Run the supported installer','Let node --run install-mm finish; it can take several minutes on a Pi.'),
      action('Create the working configuration','Copy config/config.js.sample to config/config.js before editing anything.'),
      action('Start MagicMirror² manually','Run it on the temporary HDMI display and confirm the default dashboard stays stable.')
    ],['~/MagicMirror exists.','config/config.js exists.','The default MagicMirror² window opens and stays stable.'],'Do not add third-party modules until the default dashboard works reliably.',[
      command('Clone MagicMirror²','cd ~ && git clone https://github.com/MagicMirrorOrg/MagicMirror.git','A ~/MagicMirror folder is created.'),
      command('Install and configure','cd ~/MagicMirror && node --run install-mm && cp config/config.js.sample config/config.js','Dependencies install and a working config exists.'),
      command('Manual software test','cd ~/MagicMirror && node --run start','MagicMirror² opens on the temporary display.')
    ]),
    lesson('Prove the optical mirror effect before cutting or mounting','Check that your exact acrylic, display brightness, and room lighting create a readable mirror effect before anything becomes permanent.','20–30 min',[
      photo('/assets/lesson-photos/smart-mirror-finished.png','Optical effect target','This is the intended result: bright content remains readable while unused black areas disappear into the reflection.')
    ],[
      action('Place the running display on a soft towel','Use the tested temporary setup and keep the LCD face protected.'),
      action('Show a simple black MagicMirror² screen','Use bright text on a black background; avoid a full-screen gray or white desktop.'),
      action('Hold the mirror sheet in front of the display','Keep it parallel to the display without scratching either surface.'),
      action('Test normal and dim room lighting','Check readability from the expected viewing angle.'),
      action('Mark the usable display area','Use removable tape on the protective layer or frame, not permanent adhesive.')
    ],['Bright content is readable through the mirror.','Black areas mostly blend into the reflection.','The display area is marked before framing.'],'Do not cut acrylic or attach permanent adhesive until this test passes.'),
    lesson('Dry-fit the frame stack and cable exit','Confirm the mirror, mask, display, Pi case, and power cable have clearance before mounting anything.','30–45 min',[
      photo('/assets/lesson-photos/smart-mirror-frame-build.png','Frame stack dry-fit','The mirror panel, display, Pi, and cable route are placed in the frame without any adhesive or pressure on the LCD.')
    ],[
      action('Place the mirror sheet at the frame front','Keep the reflective sheet flat and protected.'),
      action('Center the display behind the marked area','Check from the front that the active display is centered behind the mirror.'),
      action('Place the Pi case with its vents exposed','Leave room for USB-C power, DSI routing, and airflow.'),
      action('Plan a gentle cable exit','The USB-C and DSI paths must not cross a sharp edge or sit beneath the rear panel.'),
      action('Test the rear panel without fastening it','It must sit normally without pressing the LCD, Pi case, or cable.')
    ],['The display is centered.','The rear panel can close without pressure.','The Pi vents and cable exits remain accessible.']),
    lesson('Mount the display by its rigid edges and black out the cavity','Secure the display reversibly, then hide reflective interior surfaces without covering the active screen or blocking airflow.','45–60 min',[
      photo('/assets/lesson-photos/smart-mirror-frame-build.png','Safe display mounting reference','Mount only to rigid display edges or a backing plate; keep the active LCD, vents, and cable path clear.')
    ],[
      action('Power down completely','Disconnect USB-C and wait until the Pi and display are unpowered.'),
      action('Attach removable mounts to rigid surfaces','Use short Velcro strips or a backing plate on the display frame, never over the active LCD or flex cable.'),
      action('Mount from your dry-fit marks','Check alignment from the front before applying any additional pressure.'),
      action('Add a matte-black mask around the inactive area','Block visible wood, cables, and shiny hardware without covering visible pixels.'),
      action('Recheck ventilation','Keep the Pi case and its airflow path free of foam and tape.')
    ],['The display is level and stable.','The active screen is not covered.','The cavity looks dark with the display off.'],'Never use adhesive that can pull on a DSI connector or press into the LCD.'),
    lesson('Connect the DSI ribbon with the Pi fully powered off','Seat the display cable straight, fully, and without a sharp fold before testing the mounted display.','20–30 min',[
      photo('/assets/lesson-photos/dsi-ribbon-seated.png','Seated DSI ribbon','High-resolution physical reference: the ribbon is straight, fully inserted, and held by a closed latch.'),
      photo('/assets/reference/dsi-ribbon.svg?v=17.0.0','DSI orientation diagram','Use the diagram to verify the contact and blue-stiffener orientation on your exact display and Pi connectors.')
    ],[
      action('Disconnect USB-C power','The Pi must be completely off before either DSI connector is opened.'),
      action('Open both connector latches evenly','Use a fingernail or plastic tool; do not pry the latch off.'),
      action('Match contact orientation to the diagram','Confirm the gold contacts and blue stiffener match your particular connector before insertion.'),
      action('Insert the ribbon straight and fully','Both sides should be equally deep before the latch is closed.'),
      action('Route a broad curve','Do not crease the ribbon or pinch it beneath the rear panel.')
    ],['Both DSI ends are straight and equally seated.','The latches are closed.','No sharp fold is visible.'],'Never connect or disconnect DSI while the Pi is powered.'),
    lesson('Test MagicMirror² in the mounted display before closing the frame','Verify the display, optics, touch if applicable, and MagicMirror² screen together while the rear remains open and accessible.','30–45 min',[
      photo('/assets/lesson-photos/smart-mirror-finished.png','Mounted display test target','The mounted display should show a sparse black-background MagicMirror² screen while the rest of the frame stays visually quiet.')
    ],[
      action('Reconnect power and boot','Watch for a stable display image; power off immediately if the display flickers or remains black.'),
      action('Start the tested MagicMirror² configuration','Use the configuration that worked on the temporary display.'),
      action('Keep unused screen area pure black','The mirror effect depends on black pixels and sparse high-contrast content.'),
      action('Check the front from normal viewing distance','Confirm the screen is centered and readable through the acrylic.'),
      action('Power off before any correction','Reseat DSI or adjust the mount only with USB-C disconnected.')
    ],['The mounted display is stable.','MagicMirror² is readable through the acrylic.','No unexpected bright hardware is visible through the mirror.']),
    lesson('Close the rear panel and run the thermal test','Final assembly changes cable pressure and airflow, so prove stability with the actual back panel installed.','45–60 min',[
      photo('/assets/lesson-photos/smart-mirror-finished.png','Completed-frame reference','The rear panel closes without changing display alignment, pinching cables, or blocking the Pi case vents.')
    ],[
      action('Shut down before closing the back','Arrange the already-tested DSI and USB-C paths before the panel moves.'),
      action('Close the panel slowly','Stop if you feel spring pressure; reopen and move the obstruction rather than forcing it.'),
      action('Power on and inspect the mirror front','Confirm the display remains centered and the mirror effect has not changed.'),
      action('Run for at least 30 minutes','Watch for flicker, Wi-Fi loss, display faults, or excess heat.'),
      action('Check temperature and airflow','Use vcgencmd measure_temp and verify the vents remain open.')
    ],['The closed frame stays stable for 30 minutes.','No cable is pinched.','The display remains centered.'],'If the final enclosure runs noticeably hotter than the open test, improve airflow before leaving it on unattended.',[
      command('Check temperature','vcgencmd measure_temp','A normal temperature line appears while the system stays stable.')
    ]),
    lesson('Configure one tested autostart path and verify a cold boot','Only automate MagicMirror² after every physical and software component works manually in the closed frame.','30–45 min',[
      photo('/assets/lesson-photos/smart-mirror-finished.png','Cold-boot target','After power is reconnected, the finished mirror should reach its sparse dashboard without cable changes or manual intervention.')
    ],[
      action('Choose one autostart method','Use one documented Raspberry Pi desktop autostart method for the already-tested MagicMirror² command.'),
      action('Test the command manually one final time','Do not automate a command that has not been proven from Terminal.'),
      action('Shut down cleanly and remove power for ten seconds','This makes the next test a true cold boot.'),
      action('Reconnect power and wait','Confirm the mirror reaches the intended dashboard without duplicate windows.'),
      action('Repeat once','A second cold boot catches duplicate or timing-dependent startup entries.')
    ],['Two cold boots reach the intended mirror screen.','No duplicate MagicMirror² window opens.','The display remains stable after startup.']),
    lesson('Record the build and its maintenance checks','Document the exact configuration while it is fresh so future repairs do not require reopening the whole project by guesswork.','15–20 min',[
      photo('/assets/lesson-photos/smart-mirror-finished.png','Document the finished build','Record the finished front, rear cable route, MagicMirror² location, brightness setting, and recovery procedure.')
    ],[
      action('Photograph the rear cable routing','Take a clear photo before the mirror is wall-mounted or moved.'),
      action('Record the software location','Note ~/MagicMirror, the startup method, and any non-secret configuration changes.'),
      action('Record the optical settings','Write down brightness and room-light conditions that produced the best mirror effect.'),
      action('Plan periodic inspection','Check ventilation, cable strain, and mounting material every few months.'),
      action('Keep credentials out of notes and screenshots','Do not save Wi-Fi passwords or private keys in the course notes or repository.')
    ],['The rear cable path is documented.','The recovery path is known.','No secret is saved in a public file.'])
  ];
})();
