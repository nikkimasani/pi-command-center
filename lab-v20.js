(()=>{
  const D=window.PI_LAB,root=document.querySelector('#app');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let S={view:'dashboard',courseId:'foundation',lesson:0,answers:{},checks:{},labFilter:'All'};
  try{S={...S,...JSON.parse(localStorage.getItem('pi-lab-v21'))}}catch{}
  // Keep completion and resume data, but always begin a new visit on Dashboard.
  S.view='dashboard';
  const save=()=>localStorage.setItem('pi-lab-v21',JSON.stringify(S));
  navigator.serviceWorker?.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));
  const course=id=>D.courses.find(x=>x.id===id),ready=()=>D.courses.filter(x=>x.status==='ready');
  // Each photo is a distinct, generated illustrative reference for its own action.
  // The written instructions, pin assignments, commands, and official sources remain authoritative.
  const illustrativePhotos={
    'electronics-lab':[
      ['electronics-gpio-header-v21.png','Raspberry Pi 5 GPIO header on a workbench'],
      ['electronics-led-wire-v21.png','Raspberry Pi LED circuit with resistor on a breadboard'],
      ['electronics-led-blink-v21.png','LED blink test connected to a Raspberry Pi'],
      ['electronics-button-v21.png','Pushbutton input circuit connected to a Raspberry Pi'],
      ['electronics-combo-v21.png','Combined Raspberry Pi button and LED circuit']
    ],
    pomodoro:[
      ['pomodoro-plan-v22.png','Pomodoro components laid out before wiring'],
      ['pomodoro-script-v22.png','The same Pomodoro button and LED circuit wired to a Raspberry Pi'],
      ['pomodoro-test-v22.png','The same Pomodoro circuit running with its LED lit'],
      ['pomodoro-autostart-v22.png','The finished Pomodoro station with the same button and LED circuit']
    ],
    'photo-frame':[
      ['photo-frame-prepare-v21.png','Photos prepared beside a Raspberry Pi photo-frame workstation'],
      ['photo-frame-install-v21.png','Raspberry Pi display and keyboard while installing slideshow software'],
      ['photo-frame-slideshow-v21.png','Raspberry Pi photo frame showing a tested slideshow'],
      ['photo-frame-autostart-v21.png','Finished Raspberry Pi photo frame ready for automatic startup']
    ],
    'desk-info':[
      ['desk-info-plan-v21.png','Raspberry Pi desk display materials arranged before setup'],
      ['desk-info-install-v21.png','Raspberry Pi temporary display during dashboard installation'],
      ['desk-info-config-v21.png','Raspberry Pi dashboard configuration workstation'],
      ['desk-info-autostart-v21.png','Raspberry Pi desk display prepared for automatic launch'],
      ['desk-info-validate-v21.png','Finished Raspberry Pi desk information display in use']
    ],
    'home-assistant':[
      ['ha-image-v21.png','Raspberry Pi Home Assistant OS preparation with microSD card'],
      ['ha-onboard-v21.png','Raspberry Pi connected to a network for Home Assistant onboarding'],
      ['ha-dashboard-v21.png','Home Assistant dashboard design on a Raspberry Pi workstation'],
      ['ha-panel-v21.png','Finished Home Assistant display panel']
    ],
    'ai-terminal':[
      ['ai-check-v21.png','Raspberry Pi workstation checked before installing a local AI runtime'],
      ['ai-install-v21.png','Raspberry Pi workstation during local AI runtime installation'],
      ['ai-model-v21.png','Raspberry Pi workstation while testing a compact local model'],
      ['ai-routine-v21.png','Finished Raspberry Pi local AI terminal workstation']
    ],
    cyberdeck:[
      ['cyberdeck-fit-v21.png','Portable Raspberry Pi cyberdeck parts laid out for a fit check'],
      ['cyberdeck-software-v21.png','Open Raspberry Pi cyberdeck during power-management setup'],
      ['cyberdeck-keyboard-v21.png','Portable Raspberry Pi cyberdeck with keyboard setup'],
      ['cyberdeck-validate-v21.png','Finished Raspberry Pi cyberdeck running away from wall power']
    ],
    'personal-dashboard':[
      ['personal-dashboard-plan-v21.png','Raspberry Pi personal dashboard materials and display planned on a desk'],
      ['personal-dashboard-kiosk-v21.png','Raspberry Pi screen in a dedicated dashboard kiosk setup'],
      ['personal-dashboard-escape-v21.png','Raspberry Pi dashboard workstation with keyboard recovery path'],
      ['personal-dashboard-autostart-v21.png','Finished Raspberry Pi personal dashboard ready to start automatically']
    ],
    'linux-basics':[
      ['linux-prompt-v21.png','Raspberry Pi desktop with a new terminal prompt'],
      ['linux-navigate-v21.png','Raspberry Pi desktop exploring terminal and folders'],
      ['linux-files-v21.png','Raspberry Pi project workspace for creating and reading files'],
      ['linux-permissions-v21.png','Raspberry Pi workspace illustrating careful permissions work'],
      ['linux-apt-v21.png','Raspberry Pi connected by Ethernet during a software update'],
      ['linux-help-v21.png','Raspberry Pi workstation using documentation and terminal help']
    ],
    'python-fundamentals':[
      ['python-first-v22.png','Raspberry Pi workstation ready to run a first Python script'],
      ['python-types-v22.png','Raspberry Pi workspace representing Python values and basic types'],
      ['python-conditionals-v22.png','Raspberry Pi workspace representing a Python decision branch'],
      ['python-loops-v22.png','Raspberry Pi workspace representing repeated Python work'],
      ['python-functions-v22.png','Raspberry Pi workspace representing organized reusable Python code'],
      ['python-venv-v22.png','Raspberry Pi project workspace for a Python virtual environment']
    ],
    pihole:[
      ['pihole-plan-v22.png','Raspberry Pi and home-network hardware prepared for Pi-hole'],
      ['pihole-install-v22.png','Raspberry Pi connected to a home network during Pi-hole installation'],
      ['pihole-dashboard-v22.png','Raspberry Pi home-network station with a dashboard reference'],
      ['pihole-network-v22.png','Raspberry Pi and router showing the network DNS connection stage'],
      ['pihole-maintain-v22.png','Raspberry Pi Pi-hole station during routine maintenance']
    ],
    retropie:[
      ['retropie-plan-v22.png','RetroPie hardware and a separate microSD card prepared before installation'],
      ['retropie-image-v22.png','RetroPie image being written to a microSD card'],
      ['retropie-controller-v22.png','Raspberry Pi RetroPie station with a controller ready for first setup'],
      ['retropie-roms-v22.png','Raspberry Pi RetroPie workstation during file transfer'],
      ['retropie-bluetooth-v22.png','Raspberry Pi RetroPie setup with a wireless controller'],
      ['retropie-finish-v22.png','Finished Raspberry Pi RetroPie gaming station']
    ],
    'security-camera':[
      ['camera-connect-v22.png','Raspberry Pi camera module and CSI ribbon prepared for safe connection'],
      ['camera-detect-v22.png','Connected Raspberry Pi camera module during detection'],
      ['camera-capture-v22.png','Raspberry Pi camera module prepared to capture a photo or video'],
      ['camera-motion-v22.png','Raspberry Pi camera aimed at a scene for motion detection'],
      ['camera-mount-v22.png','Finished Raspberry Pi security camera mounted for use']
    ],
    'weather-station':[
      ['weather-wire-v22.png','Raspberry Pi and weather sensor wired on a breadboard'],
      ['weather-venv-v22.png','Raspberry Pi weather sensor project during software setup'],
      ['weather-read-v22.png','Raspberry Pi weather sensor ready to report live readings'],
      ['weather-log-v22.png','Raspberry Pi weather station logging a history of readings'],
      ['weather-review-v22.png','Finished Raspberry Pi weather station reviewing its data']
    ]
  };
  Object.entries(illustrativePhotos).forEach(([courseId,photos])=>{
    const c=course(courseId);
    if(!c)return;
    photos.forEach(([file,alt],index)=>{
      if(!c.lessons[index])return;
      Object.assign(c.lessons[index],{
        kind:'photo',
        image:`https://pi-command-center-cloudflare.pages.dev/assets/lesson-photos/${file}`,
        alt,
        caption:'Illustrative step reference. Follow the written procedure, exact commands, and official source links for your specific hardware and software version.'
      });
    });
  });
  // Foundation and Smart Mirror originally retained their compact step maps.
  // Keep those maps available in the curriculum data, but lead each of these
  // lessons with a realistic action-specific reference photo instead.
  const precisePhotoOverrides={
    foundation:[
      [1,'foundation-imager-install-v23.png','Raspberry Pi Imager installed on a Windows laptop beside an unopened Pi kit and untouched microSD card','Install Imager on your computer before inserting or selecting any storage.'],
      [2,'foundation-imager-select-v23.png','Raspberry Pi Imager showing the Pi, operating-system, and storage selection workflow','Confirm the device, operating system, and intended microSD card before writing.'],
      [5,'foundation-imager-write-v23.png','Verified microSD card being installed in a powered-off Raspberry Pi 5','Eject after verification, insert the card while the Pi is off, then connect power last.']
    ],
    mirror:[
      [1,'mirror-temporary-display-v23.png','Raspberry Pi 5 running MagicMirror on a temporary HDMI monitor','Prove the dashboard works on an accessible temporary display before it goes into a frame.'],
      [4,'mirror-configure-v23.png','Raspberry Pi MagicMirror configuration on a temporary monitor','Configure the layout, rotation, and modules while the display is still easy to reach.'],
      [5,'mirror-autostart-v23.png','Raspberry Pi MagicMirror dashboard booted on a temporary HDMI monitor','Verify PM2 autostart and a clean reboot before the mirror is mounted.']
    ]
  };
  Object.entries(precisePhotoOverrides).forEach(([courseId,photos])=>{
    const c=course(courseId); if(!c)return;
    photos.forEach(([index,file,alt,caption])=>{
      if(!c.lessons[index])return;
      Object.assign(c.lessons[index],{kind:'photo',image:`https://pi-command-center-cloudflare.pages.dev/assets/lesson-photos/${file}`,alt,caption});
    });
  });
  // Card covers make the Labs grid scannable at a glance.  Reuse the most
  // representative visual from a lab's own sequence; the six newest labs
  // receive a dedicated project cover.
  const labCovers={
    'electronics-lab':'electronics-combo-v21.png',
    pomodoro:'pomodoro-autostart-v22.png',
    'photo-frame':'photo-frame-autostart-v21.png',
    'desk-info':'desk-info-validate-v21.png',
    'home-assistant':'ha-panel-v21.png',
    'ai-terminal':'ai-routine-v21.png',
    cyberdeck:'cyberdeck-validate-v21.png',
    'personal-dashboard':'personal-dashboard-autostart-v21.png',
    'linux-basics':'linux-basics-cover-v21.png',
    'python-fundamentals':'python-fundamentals-cover-v21.png',
    pihole:'pihole-cover-v21.png',
    retropie:'retropie-cover-v21.png',
    'security-camera':'security-camera-cover-v21.png',
    'weather-station':'weather-station-cover-v21.png'
  };
  Object.entries(labCovers).forEach(([courseId,file])=>{
    const c=course(courseId);
    if(c)c.cover=`https://pi-command-center-cloudflare.pages.dev/assets/lesson-photos/${file}`;
  });
  const key=(c,i)=>`${c.id}:${i}`,done=(c,i)=>S.checks[key(c,i)]?.every(Boolean)&&S.answers[key(c,i)]===c.lessons[i].check.answer;
  const progress=c=>c.lessons.length?Math.round(c.lessons.filter((_,i)=>done(c,i)).length/c.lessons.length*100):0;
  const diagram=t=>{const m={
    "imager-download":{h:'Install Raspberry Pi Imager',steps:['Open raspberrypi.com/software','Download the installer for your OS','Install it','Launch Imager'],note:'Use the official site only — avoid third-party download mirrors.'},
    "imager-select":{h:'Three required selections',steps:['Device: Raspberry Pi 5','OS: Raspberry Pi OS Desktop','Storage: your microSD card'],note:'Recheck Storage last — this is the selection that gets erased.'},
    "imager-write":{h:'Safe imaging order',steps:['Recheck storage','Write','Verify','Eject','Insert into the powered-off Pi'],note:'Never remove the card mid-write or mid-verify.'},
    "software-test":{h:'Prove software before the enclosure',steps:['Boot with a temporary HDMI display','Install MagicMirror² (official docs)','Run the default config','Restart once','Confirm it is stable'],note:'Isolate software problems while everything is still easy to reach.'},
    "mirror-config":{h:'Match software to your real display',steps:['Confirm native resolution + refresh rate','Set rotation to match your frame','Edit ~/MagicMirror/config/config.js','Choose a few glance-friendly modules','Restart and check the real DSI panel'],note:'Do this before mounting — text size and viewing angle differ from a temporary display.'},
    "mirror-autostart":{h:'Make it start itself',steps:['Install PM2','Write a launch script','pm2 start + save','Run the pm2 startup command','Reboot and confirm'],note:'Prove this before you seal the frame — there is no keyboard afterward.'},
    "gpio-pinout":{h:'Know the header before you wire it',steps:['Power down first','Run pinout on the Pi','Find 3V3, 5V, GND','Locate your GPIO numbers'],note:'GPIO pins are 3.3V logic only — never connect a 5V signal directly to one.'},
    "gpio-led":{h:'Wire an LED safely',steps:['Power down','GPIO pin → resistor → LED anode','LED cathode → GND','Confirm gpiozero is installed'],note:'Always wire a resistor in series — never bridge an LED directly across a GPIO pin.'},
    "gpio-blink":{h:'Your first GPIO program',steps:['Create blink.py','LED(your GPIO number)','Loop: on → sleep → off → sleep','Run with python3 blink.py'],note:'gpiozero addresses pins by BCM GPIO number, not physical pin position.'},
    "gpio-button":{h:'Read a button safely',steps:['Power down','Button between GPIO and GND','No external resistor needed','wait_for_press() in Python'],note:'gpiozero’s Button class uses the Pi’s internal pull-up resistor by default.'},
    "gpio-combo":{h:'Combine input and output',steps:['Keep both circuits wired','wait_for_press() in a loop','led.toggle() on each press','Run and confirm'],note:'This is your first complete input-to-output program.'},
    "pomodoro-plan":{h:'Plan before you code',steps:['Choose work/break minutes','Decide LED behavior per stage','Reuse Electronics Lab wiring'],note:'Start with the classic 25/5 pattern, then adjust.'},
    "pomodoro-script":{h:'Write the timer logic',steps:['Create pomodoro.py','LED on during work','led.blink() during break','Loop back and wait for the next press'],note:'The script should run continuously, not exit after one cycle.'},
    "pomodoro-test":{h:'Prove it before you trust it',steps:['Shrink WORK_MIN/BREAK_MIN','Run and press the button','Watch the full state sequence','Restore real durations'],note:'An accelerated test catches logic mistakes in seconds, not hours.'},
    "pomodoro-service":{h:'Make it survive a reboot',steps:['Write a systemd unit file','daemon-reload','enable + start','Check status'],note:'A wrong path or username in the unit file is the most common failure.'},
    "frame-prepare":{h:'Get your photos onto the Pi',steps:['mkdir the photo folder','scp from your other computer','ls to confirm'],note:'Reuses the SSH connection you proved in Foundation.'},
    "frame-install":{h:'Install the slideshow viewer',steps:['apt update','apt install feh','feh --version'],note:'feh is intentionally minimal — exactly what a dedicated slideshow needs.'},
    "frame-slideshow":{h:'Test the real slideshow',steps:['feh -F -Z -D 10 -Y -z <folder>','Watch a full cycle','Escape to stop'],note:'Confirm scaling and pacing before you automate it.'},
    "frame-autostart":{h:'Start it with no terminal',steps:['mkdir ~/.config/autostart','Write a .desktop entry','Reboot and confirm'],note:'The XDG autostart standard works across X11 and Wayland.'},
    "desk-plan":{h:'Plan the open display',steps:['Choose a stand or mount','Confirm native resolution','Plan cable routing'],note:'Unlike Smart Mirror, the display itself is visible — finish and routing matter more.'},
    "desk-config":{h:'Configure for a glanceable screen',steps:['Confirm resolution + refresh rate','Set rotation to match your mount','Pick modules in config.js','Restart and check at real distance'],note:'An open display can show more than a mirror can, since there is no reflective layer.'},
    "desk-validate":{h:'Prove it before daily use',steps:['Mount with slack + open vents','30-minute supervised test','Two cold boots','Non-secret recovery note'],note:'Same reliability bar as any always-on Pi display.'},
    "ha-image":{h:'Image Home Assistant OS',steps:['Open Raspberry Pi Imager','Other specific-purpose OS → Home automation → Home Assistant','Choose + recheck storage','Write, verify, insert'],note:'Uses the same Imager skill from Foundation.'},
    "ha-onboard":{h:'First boot and setup',steps:['Connect Ethernet if possible','Power on and wait','Open homeassistant.local:8123','Complete onboarding'],note:'A first Home Assistant OS boot is slower than a normal Pi OS boot.'},
    "ha-dashboard":{h:'Design for a panel, not a phone',steps:['Open the dashboard editor','Favor large, glanceable cards','Add only entities you check often'],note:'A panel is viewed briefly and from a distance.'},
    "ha-panel":{h:'Show it fullscreen on a device',steps:['Pick the panel device','Open the dashboard in kiosk mode','Mount with cable slack'],note:'The panel device just needs a browser — it does not run Home Assistant itself.'},
    "ai-check":{h:'Confirm the one hard requirement',steps:['uname -m','Expect aarch64','Confirm 8GB RAM for headroom'],note:'A 32-bit OS cannot run Ollama at all.'},
    "ai-install":{h:'Install the official runtime',steps:['curl install.sh | sh','Confirm systemd service active','ollama --version'],note:'The installer sets up the binary and a background service automatically.'},
    "ai-model":{h:'Pull a Pi-sized model',steps:['ollama pull llama3.2:1b','ollama run llama3.2:1b','Chat, then /bye to exit'],note:'Start small — large models can be too slow to be usable on a Pi.'},
    "ai-routine":{h:'Make it a real habit',steps:['Test with real questions','Always exit with /bye','Note what it is actually good for'],note:'Small local models trade capability for running fully offline.'},
    "deck-fit":{h:'Confirm fit before power',steps:['Check battery pack docs for your Pi model','Power down, dry-fit the stack','Confirm GPIO alignment + case closes'],note:'Battery HATs are frequently Pi-model-specific.'},
    "deck-software":{h:'Install the power manager',steps:['Download the official script','Run the installer','Open the web control panel'],note:'The control panel is where you read battery level and configure shutdown.'},
    "deck-keyboard":{h:'Pair a wireless keyboard',steps:['Put keyboard in pairing mode','Pair via Bluetooth manager','Confirm it reconnects after reboot'],note:'A pairing that does not survive reboot is not finished yet.'},
    "deck-validate":{h:'Prove it works unplugged',steps:['Disconnect USB-C power','Set a low-battery shutdown threshold','Use it for a real session','Note real-world runtime'],note:'A clean triggered shutdown avoids microSD corruption from a hard power cut.'},
    "dash-plan":{h:'Pick one real page first',steps:['Choose a page you already use','Check it at your display resolution','Decide if you need touch'],note:'A dashboard you never use loses its value fast.'},
    "dash-kiosk":{h:'Launch fullscreen, no chrome',steps:['Confirm Chromium is installed','chromium-browser --kiosk "<url>"','Confirm no address bar or tabs'],note:'--kiosk is a standard Chromium switch, not Pi-specific.'},
    "dash-escape":{h:'Plan your way back in',steps:['Confirm SSH works during kiosk mode','Learn Alt+F4 as a keyboard fallback'],note:'Decide this before you rely on the kiosk daily.'},
    "dash-autostart":{h:'Start it with no terminal',steps:['mkdir ~/.config/autostart','Write a .desktop entry with your kiosk command','Reboot and confirm'],note:'Same XDG autostart standard used across every kiosk-style lab in this course.'},
    "linux-prompt":{h:'Read your prompt before typing anything',steps:['username@hostname : who and where','~ means your home folder','A command is just a program'],note:'You are not learning terminal magic — you are learning to run programs by name.'},
    "linux-navigate":{h:'Move around with three commands',steps:['pwd — where am I','ls -la — what is here','cd — move there'],note:'A path starting with / is absolute; anything else is relative to where you are.'},
    "linux-files":{h:'Create, view, and safely remove',steps:['mkdir + touch to create','cat or nano to view or edit','rm — no undo, ever'],note:'Always re-read the exact path before pressing Enter on rm.'},
    "linux-permissions":{h:'Read permissions, use sudo sparingly',steps:['ls -l shows rwx for owner/group/others','sudo elevates one command only','Permission denied often means wrong folder, not missing sudo'],note:'sudo is not a general "make it work" switch.'},
    "linux-apt":{h:'The package manager you already used',steps:['apt update — refresh the list','apt install — get one package','apt remove — take it back off'],note:'update refreshes the list; upgrade installs newer versions.'},
    "linux-help":{h:'Never guess — look it up',steps:['Tab to autocomplete','↑ for command history','Ctrl+C to cancel','man <command> for the full manual'],note:'An infinite loop or stuck command is a common mistake, not a broken computer.'},
    "py-first":{h:'Run code two ways',steps:['Shell — one line at a time','Editor — a saved, repeatable script','F5 to run the whole file'],note:'Thonny is preinstalled on Raspberry Pi OS Desktop.'},
    "py-variables":{h:'Four types you will use constantly',steps:['str — text in quotes','int / float — numbers','bool — True or False','type() when unsure'],note:'An f-string is the clearest way to mix text and variables.'},
    "py-conditionals":{h:'One branch runs, not all of them',steps:['if — first check','elif — next check','else — fallback'],note:'Python stops at the first condition that is True.'},
    "py-loops":{h:'Two kinds of repetition',steps:['for — a known number of times','while — until a condition changes','Stop button / Ctrl+C for a stuck loop'],note:'An infinite loop is a common beginner mistake, not a broken computer.'},
    "py-functions":{h:'Package logic you will reuse',steps:['def name(parameters):','code that uses the parameters','return sends a value back'],note:'print() displays something; return hands a value back to your code.'},
    "py-venv":{h:'Install libraries the current, correct way',steps:['python3 -m venv — create it','source .../activate — turn it on','pip install — now it works','deactivate when done'],note:'Current Raspberry Pi OS blocks pip install outside a virtual environment.'},
    "pihole-plan":{h:'Understand it before installing',steps:['Pi-hole answers ad/tracker lookups with nothing','Set a static IP or DHCP reservation first','Confirm free storage'],note:'Every device that uses Pi-hole for DNS depends on this address never changing.'},
    "pihole-install":{h:'Run the official installer',steps:['curl -sSL install.pi-hole.net | bash','Choose interface + upstream DNS','Record the admin password'],note:'The installer generates a random password once if you do not set your own.'},
    "pihole-dashboard":{h:'Explore what it is telling you',steps:['Open http://<pi-ip>/admin/','Log in with your admin password','Read today’s query and block stats'],note:'The dashboard is your live view into network DNS activity.'},
    "pihole-network":{h:'Make devices actually use it',steps:['Router DHCP DNS — covers every device','Per-device DNS — for testing one at a time','Confirm blocking is really happening'],note:'Router-level setup is inherited by every device automatically.'},
    "pihole-maintain":{h:'Keep it healthy over time',steps:['pihole -g — refresh blocklists','Treat it like real infrastructure','Check it after every reboot'],note:'Every device depending on it makes this a single point of failure.'},
    "retro-plan":{h:'Set expectations first',steps:['A full OS image, not an app','Zero games included, by design','A separate Pi or SD card'],note:'ROM sourcing is entirely your responsibility.'},
    "retro-image":{h:'Get the image onto a card',steps:['Download the image for your Pi model','Imager → Use custom','Write to a dedicated card'],note:'RetroPie is not in Imager’s built-in OS list.'},
    "retro-controller":{h:'First boot configures your controller',steps:['Hold any button to identify it','Map each button in turn','Reconfigure any time from the menu'],note:'This screen appears automatically the first time a controller is connected.'},
    "retro-roms":{h:'Your own ROMs, in the right folder',steps:['USB, network share, or SFTP','One folder per system, e.g. roms/nes','Refresh EmulationStation (F4)'],note:'Only transfer files you created from media you own.'},
    "retro-bluetooth":{h:'Pair a wireless controller',steps:['RetroPie menu → Bluetooth Configuration','Select its MAC address to pair','Map buttons the same way as USB'],note:'Bluetooth controllers use the same input-config screen as wired ones.'},
    "retro-finish":{h:'Know the common fixes',steps:['Black screen → a display-driver setting, not a bad card','Confirm one full game + controller works','Document what you built'],note:'A short config fix beats reflashing the card.'},
    "cam-connect":{h:'Connect it without damage',steps:['Power off completely','Use the CSI port, not DSI','Contacts face away from the flap'],note:'CSI and DSI connectors look alike but are not interchangeable.'},
    "cam-detect":{h:'Prove it works before writing code',steps:['Confirm picamera2 is installed','rpicam-hello --list-cameras','rpicam-still -o test.jpg'],note:'Preinstalled on Desktop images; not on Lite.'},
    "cam-capture":{h:'Photo and video in a few lines',steps:['Picamera2() + configure()','capture_file() for a still','H264Encoder + start_recording() for video'],note:'Always close() the camera when a script finishes.'},
    "cam-motion":{h:'Detect motion by comparing frames',steps:['Capture a frame','Compare it to the previous one','Record only past a difference threshold'],note:'The same approach used in picamera2’s own official example.'},
    "cam-mount":{h:'Make it a real camera',steps:['Pick a stable, aimed position','Run a real test period, not a desk test','Review what it actually captured'],note:'Autostart it with the same systemd pattern as Pomodoro Station.'},
    "weather-wire":{h:'Wire it and enable I2C',steps:['3.3V, GND, SDA, SCL — four wires','raspi-config → Interface Options → I2C','i2cdetect -y 1 to confirm'],note:'An empty grid means a wiring mistake or I2C not yet enabled.'},
    "weather-venv":{h:'Install the library correctly',steps:['python3 -m venv ~/weather-env','source .../activate','pip3 install adafruit-circuitpython-bme280'],note:'Same externally-managed-environment rule from Python Fundamentals.'},
    "weather-read":{h:'Read live values',steps:['board.I2C() to connect','Adafruit_BME280_I2C(i2c)','Print temperature, humidity, pressure'],note:'Compare against a thermometer as a sanity check, not an exact match.'},
    "weather-log":{h:'Log it automatically over time',steps:['Append a timestamped row to a CSV','Schedule it with cron','Confirm rows are accumulating'],note:'Point cron at the venv’s own python3 by full path.'},
    "weather-review":{h:'Turn rows into insight',steps:['Log for hours, not minutes','Look for a real daily pattern','Decide what to build next'],note:'A handful of readings cannot show a real trend.'}
  }[t]||{h:'Step diagram',steps:['Read the action checklist below'],note:''};
    const steps=m.steps.map((s,i)=>`<div class="diagram-step"><b>${i+1}</b><span>${esc(s)}</span></div>${i<m.steps.length-1?'<div class="diagram-arrow">→</div>':''}`).join('');
    return `<figure class="diagram"><span>STEP MAP</span><strong>${esc(m.h)}</strong><div class="diagram-flow">${steps}</div>${m.note?`<em>${esc(m.note)}</em>`:''}</figure>`};
  const card=c=>`<article class="card ${c.status}">${c.cover?`<img src="${c.cover}" alt="">`:''}<div class="card-copy"><span class="card-icon">${esc(c.icon||'')}</span><span class="tag">${esc(c.level)}</span><h3>${esc(c.title)}</h3><p>${esc(c.short)}</p><div class="meta">${esc(c.duration)}${c.status==='ready'?` · ${c.lessons.length} lessons`:''}</div>${c.materials&&c.materials.length?`<p class="card-materials">Needs: ${esc(c.materials.slice(0,3).join(', '))}${c.materials.length>3?` +${c.materials.length-3} more`:''}</p>`:''}${c.status==='ready'?`<button class="text-btn" data-open="${c.id}">Open lab →</button>`:`<span class="review-label">Curriculum review in progress</span>`}</div></article>`;
  function nextUp(){
    const r=ready();
    return r.find(c=>{const p=progress(c);return p>0&&p<100}) || r.find(c=>progress(c)===0) || r[0];
  }
  function dashboard(){
    const r=ready(),target=nextUp(),totalLessons=r.reduce((n,c)=>n+c.lessons.length,0),verb=progress(target)>0?'Continue':'Start';
    return `<section class="hero"><div><p class="eyebrow">Pi Lab</p><h1>Raspberry Pi Lab</h1><div class="hero-actions"><button class="primary" data-open="${target.id}">${verb}: ${esc(target.title)}</button><button class="secondary" data-view="labs">Browse all labs</button></div></div><aside><img class="hero-mark" src="/assets/brand/raspberry-pi-logo-hero.png" alt="Raspberry Pi logo"><b>${r.length}</b><span>Labs ready</span><b>${totalLessons}</b><span>Lessons</span><b>${progress(target)}%</b><span>${esc(target.title)} progress</span></aside></section>`}
  const labs=()=>{
    const levels=['All',...new Set(D.courses.map(c=>c.level))];
    const active=S.labFilter&&levels.includes(S.labFilter)?S.labFilter:'All';
    const shown=active==='All'?D.courses:D.courses.filter(c=>c.level===active);
    return `<section class="dashboard-head"><p class="eyebrow">Labs</p><h1>Choose a lab</h1><p>Each lab contains its lessons, source links, visuals, commands, and checks.</p></section><div class="filter-row">${levels.map(l=>`<button class="filter-chip ${l===active?'active':''}" data-filter="${esc(l)}">${esc(l)}</button>`).join('')}</div><div class="cards">${shown.map(card).join('')}</div>`;
  };
  const health=()=>{
    const quick=(D.healthCheck||[]).map((x,i)=>`<div class="command"><b>${esc(x[0])}</b><pre>${esc(x[1])}</pre><small>Expected: ${esc(x[2])}</small><button data-copy-health="${i}">Copy</button></div>`).join('');
    const live=(D.healthLiveSetup||[]).map((x,i)=>`<div class="command"><b>${esc(x[0])}</b><pre>${esc(x[1])}</pre><small>Expected: ${esc(x[2])}</small><button data-copy-live="${i}">Copy</button></div>`).join('');
    const trouble=[
      ['The live page never loads from another device','Confirm the script is still running (check the terminal, or run sudo systemctl status pi-health.service if you set up autostart), and confirm both devices are on the same network.'],
      ['vcgencmd or systemctl fields show an error','That means the script is not running on real Raspberry Pi hardware, or is missing a piece of standard Raspberry Pi OS software — vcgencmd ships with Raspberry Pi OS by default.']
    ].map(x=>`<details><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('');
    return `<section class="dashboard-head"><p class="eyebrow">Health</p><h1>Pi Health Check</h1><p>Two ways to check any Raspberry Pi — not tied to a specific lab. Use these right after a fresh boot, after changing a project, or any time something feels off.</p></section><section class="commands"><p class="eyebrow">Quick check — run these yourself, any time</p>${quick}<p class="health-source">Source: ${esc(D.healthCheckSource||'')}</p></section><section class="dashboard-head" style="margin-top:34px"><p class="eyebrow">Go further</p><h1 style="font-size:28px">Live, auto-refreshing status page</h1><p>Install a small script once — standard-library Python only, nothing to download or pip install. It serves its own page on the Pi that refreshes automatically, so you just plug in and open a link.</p></section><section class="commands">${live}</section><section class="troubleshoot"><p class="eyebrow">If something goes wrong</p>${trouble}</section>`;
  };
  const reference=()=>`<section class="dashboard-head"><p class="eyebrow">Reference</p><h1>Official setup resources</h1><p>Use these primary sources alongside the lab instructions. They open in a new tab.</p></section><section class="resources reference-list"><a href="https://www.raspberrypi.com/software/" target="_blank" rel="noopener">Download Raspberry Pi Imager ↗</a><a href="https://www.raspberrypi.com/documentation/computers/getting-started.html" target="_blank" rel="noopener">Raspberry Pi: Getting started ↗</a><a href="https://www.raspberrypi.com/documentation/computers/remote-access.html" target="_blank" rel="noopener">Raspberry Pi: Remote access (SSH) ↗</a><a href="https://www.raspberrypi.com/documentation/computers/display.html" target="_blank" rel="noopener">Raspberry Pi: Display documentation ↗</a><a href="https://gpiozero.readthedocs.io/" target="_blank" rel="noopener">gpiozero documentation ↗</a><a href="https://docs.magicmirror.builders/getting-started/installation.html" target="_blank" rel="noopener">MagicMirror²: Installation ↗</a><a href="https://docs.magicmirror.builders/configuration/autostart.html" target="_blank" rel="noopener">MagicMirror²: Autostart ↗</a><a href="https://feh.finalrewind.org/" target="_blank" rel="noopener">feh manual ↗</a><a href="https://www.home-assistant.io/installation/raspberrypi/" target="_blank" rel="noopener">Home Assistant: Raspberry Pi install ↗</a><a href="https://ollama.com/" target="_blank" rel="noopener">Ollama ↗</a><a href="https://docs.pisugar.com/" target="_blank" rel="noopener">PiSugar documentation ↗</a><a href="https://specifications.freedesktop.org/autostart-spec/autostart-spec-latest.html" target="_blank" rel="noopener">freedesktop.org: Autostart specification ↗</a></section>`;
  const report=()=>`<section class="dashboard-head"><p class="eyebrow">My progress</p><h1>Learning record</h1><p>Progress stays on this device. A lesson completes only after its checklist and knowledge check are complete.</p></section><div class="cards">${ready().map(c=>`<article class="card ready"><div class="card-copy"><span class="tag">${progress(c)}% complete</span><h3>${esc(c.title)}</h3><p>${c.lessons.filter((_,i)=>done(c,i)).length} of ${c.lessons.length} lessons verified</p><button class="text-btn" data-open="${c.id}">Resume lab →</button></div></article>`).join('')}</div>`;
  function printable(c){
    return `<div class="print-only"><h1>${esc(c.title)}</h1><p>${esc(c.short)}</p><h2>Materials</h2><ul>${(c.materials||[]).map(m=>`<li>${esc(m)}</li>`).join('')}</ul><h2>Safety</h2><ul>${(c.safety||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>${c.lessons.map((l,i)=>`<h2>${i+1}. ${esc(l.title)}</h2><p><b>Goal:</b> ${esc(l.goal)}</p><ol>${l.actions.map(a=>`<li><b>${esc(a[0])}</b> — ${esc(a[1])}</li>`).join('')}</ol>${l.commands?l.commands.map(cmd=>`<p><b>${esc(cmd[0])}</b></p><pre>${esc(cmd[1])}</pre><p><i>Expected:</i> ${esc(cmd[2])}</p>`).join(''):''}<p><b>Knowledge check:</b> ${esc(l.check.q)}</p><p><b>Success:</b> ${esc(l.success)}</p>`).join('')}<p>Source: ${esc(c.source||'')}</p></div>`;
  }
  function lesson(c,l){const k=key(c,S.lesson),checked=S.checks[k]||[],answered=S.answers[k],visual=l.kind==='photo'?`<figure class="lesson-photo"><img src="${l.image}" alt="${esc(l.alt)}"><figcaption>${esc(l.caption)}</figcaption></figure>`:diagram(l.diagram),links=(l.links||c.links||[]).map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])} ↗</a>`).join(''),commands=(l.commands||[]).map((x,i)=>`<div class="command"><b>${esc(x[0])}</b><pre>${esc(x[1])}</pre><small>Expected: ${esc(x[2])}</small><button data-copy-command="${i}">Copy</button></div>`).join(''),troubleshoot=(l.troubleshoot||[]).map(x=>`<details><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('');return `<div class="lesson-topbar"><button class="back" data-view="labs">← Labs</button><button class="secondary" data-print>Print this lab</button></div><section class="course-banner"><div><p class="eyebrow">${esc(c.title)}</p><p class="course-blurb">${esc(c.short)}</p><h1>${esc(l.title)}</h1><p>${esc(l.goal)}</p></div><div class="course-progress"><b>${progress(c)}%</b><span>${c.lessons.filter((_,i)=>done(c,i)).length}/${c.lessons.length} verified</span><i><em style="width:${progress(c)}%"></em></i></div></section><div class="learning-layout"><aside class="map"><p>COURSE MAP</p>${c.lessons.map((x,i)=>`<button class="${i===S.lesson?'active':''} ${done(c,i)?'done':''}" data-lesson="${i}"><b>${done(c,i)?'✓':i+1}</b><span>${esc(x.title)}</span></button>`).join('')}</aside><main><div class="lesson-meta"><span>LESSON ${S.lesson+1} OF ${c.lessons.length}</span><span>${esc(l.time)}</span></div>${visual}<section class="resources"><p class="eyebrow">Official resources</p>${links}</section><section class="mission"><p class="eyebrow">Your mission</p><h2>Do these in order</h2>${l.actions.map((a,i)=>`<label class="action"><input type="checkbox" data-check="${i}" ${checked[i]?'checked':''}><span><b>${esc(a[0])}</b><small>${esc(a[1])}</small></span></label>`).join('')}</section>${commands?`<section class="commands"><p class="eyebrow">Copyable Terminal commands</p>${commands}</section>`:''}${troubleshoot?`<section class="troubleshoot"><p class="eyebrow">If something goes wrong</p>${troubleshoot}</section>`:''}<section class="checkpoint"><p class="eyebrow">Knowledge check</p><h2>${esc(l.check.q)}</h2>${l.check.options.map((o,i)=>`<button class="answer ${answered!==undefined?(i===l.check.answer?'right':i===answered?'wrong':''):''}" data-answer="${i}" ${answered!==undefined?'disabled':''}>${String.fromCharCode(65+i)} <span>${esc(o)}</span></button>`).join('')}${answered!==undefined?`<div class="feedback ${answered===l.check.answer?'ok':'no'}">${answered===l.check.answer?'Correct. ':''}${esc(l.check.why)}</div>`:''}</section><section class="success"><b>Ready to move on when:</b> ${esc(l.success)}</section><div class="lesson-nav"><button class="secondary" data-prev ${S.lesson?'':'disabled'}>← Previous</button><button class="primary" data-next ${done(c,S.lesson)&&S.lesson<c.lessons.length-1?'':'disabled'}>${S.lesson===c.lessons.length-1?'Lab complete':'Next lesson →'}</button></div></main><aside class="support">${c.materials&&c.materials.length?`<section><p class="eyebrow">Materials</p>${c.materials.map(x=>`<p>• ${esc(x)}</p>`).join('')}</section>`:''}<section><p class="eyebrow">Safety</p>${c.safety.map(x=>`<p>• ${esc(x)}</p>`).join('')}</section><section><p class="eyebrow">Source</p><p>${esc(c.source||'')}</p></section></aside></div>${printable(c)}`}
  function render(){const c=course(S.courseId),body=S.view==='course'?lesson(c,c.lessons[S.lesson]):S.view==='labs'?labs():S.view==='health'?health():S.view==='reference'?reference():S.view==='progress'?report():dashboard();root.innerHTML=`<header><button class="brand" data-view="dashboard"><img class="brand-mark" src="/assets/brand/raspberry-pi-logo-header.png" alt=""> Pi Lab</button><nav><button data-view="dashboard" class="${S.view==='dashboard'?'active':''}">Dashboard</button><button data-view="labs" class="${S.view==='labs'?'active':''}">Labs</button><button data-view="health" class="${S.view==='health'?'active':''}">Health</button><button data-view="reference" class="${S.view==='reference'?'active':''}">Reference</button><button data-view="progress" class="${S.view==='progress'?'active':''}">Progress</button></nav><div class="student">Builder mode <i></i></div></header><main>${body}</main><footer class="site-footer">Created by Nikki</footer>`;root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{S.view=b.dataset.view;save();render();window.scrollTo(0,0)});root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{S.view='course';S.courseId=b.dataset.open;S.lesson=0;save();render();window.scrollTo(0,0)});root.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{S.lesson=+b.dataset.lesson;save();render();window.scrollTo(0,0)});root.querySelectorAll('[data-check]').forEach(b=>b.onchange=e=>{const k=key(c,S.lesson);S.checks[k]=S.checks[k]||Array(c.lessons[S.lesson].actions.length).fill(false);S.checks[k][+e.target.dataset.check]=e.target.checked;save();render()});root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{S.answers[key(c,S.lesson)]=+b.dataset.answer;save();render()});root.querySelectorAll('[data-copy-command]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(c.lessons[S.lesson].commands[+b.dataset.copyCommand][1]);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1200)});root.querySelectorAll('[data-copy-health]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(D.healthCheck[+b.dataset.copyHealth][1]);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1200)});root.querySelectorAll('[data-copy-live]').forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(D.healthLiveSetup[+b.dataset.copyLive][1]);b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1200)});root.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{S.labFilter=b.dataset.filter;save();render()});root.querySelector('[data-print]')?.addEventListener('click',()=>window.print());root.querySelector('[data-prev]')?.addEventListener('click',()=>{if(S.lesson){S.lesson--;save();render();window.scrollTo(0,0)}});root.querySelector('[data-next]')?.addEventListener('click',()=>{if(done(c,S.lesson)&&S.lesson<c.lessons.length-1){S.lesson++;save();render();window.scrollTo(0,0)}})}render();
})();
