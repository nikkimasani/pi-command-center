/* V19: project covers stay in the header; lesson visuals describe the actual action. */
(()=>{
  const courses=window.PI_COURSES_V2||[];
  const action=(title,detail)=>({title,detail});
  const diagram=(scene,caption)=>({scene,caption,photos:[]});
  const photo=(src,label,caption)=>({photos:[{src,label,caption}],caption});
  const lesson=(title,why,time,visual,actions,success,warning='')=>({title,why,time,visual,actions,success,warning,commands:[],trouble:[]});
  const specs={
    dashboard:{cover:'dashboard.png',setup:'Open the dashboard on the real Pi display and confirm its touch targets, layout, and browser route.',build:'Build the essential dashboard cards and navigation before connecting optional live data.',test:'Test navigation, long text, error states, and kiosk behavior at 800 × 480.'},
    'ai-terminal':{cover:'ai-terminal.png',setup:'Set up the terminal interface with the mini keyboard, then test input, scrolling, copy/paste, and the maintenance escape route.',build:'Create the core terminal workflow without putting any secret into browser code.',test:'Test long prompts, responses, cancellation, and recovery from a network delay.'},
    cyberdeck:{cover:'cyberdeck.png',setup:'Prove the Pi, screen, keyboard, and approved USB-C PD battery work together on the bench.',build:'Mock the enclosure, then mount parts with serviceable connectors, safe cable routing, and airflow.',test:'Run on battery under load and check heat, typing comfort, and cable strain.'},
    'home-panel':{cover:'home-panel.png',setup:'Open a dedicated Home Assistant dashboard on the Pi and test only safe, intended controls.',build:'Create a simple room-and-scene layout with large touch targets and clear state feedback.',test:'Use the panel by touch, including a controlled network/error-state check.'},
    'electronics-lab':{cover:'electronics-lab.png',setup:'Install gpiozero and identify BCM numbers, 3.3 V logic, ground, the LED resistor, and the button before wiring.',build:'Build a resistor-protected LED circuit first, then add a button only after the LED test passes.',test:'Test LED blink, input, and combined behavior one change at a time with power removed before rewiring.'},
    pomodoro:{cover:'pomodoro.png',setup:'Open the timer app and test a short development timer on the real touch display.',build:'Configure focus, break, and completion behavior before optional GPIO controls.',test:'Test start, pause, reset, complete, refresh, and a full touch interaction flow.'},
    glance:{cover:'desk-info.png',setup:'Open the display on the desk and confirm it is readable at normal viewing distance.',build:'Choose a small set of useful pages, calm rotation, pause-on-touch, and day/night behavior.',test:'Run the display for a workday and remove any screen that does not earn its place.'},
    'photo-frame':{cover:'photo-frame.png',setup:'Load a small private test album with portrait and landscape images before using personal collections.',build:'Configure aspect handling, captions, preloading, and collection selection.',test:'Test automatic advance, manual navigation, empty collections, and night behavior.'},
    'magic-frame':{cover:'magic-frame.png',setup:'Verify that the Smart Mirror and Photo Frame courses work independently before combining them.',build:'Create a true black sleep state, an explicit wake action, and a clean photo reveal.',test:'Test repeated wake/sleep cycles, inactivity timeout, and the maintenance fallback before optional sensing.'}
  };
  for(const [id,spec] of Object.entries(specs)){
    const course=courses.find(item=>item.id===id);if(!course)continue;
    course.cover=`/assets/lesson-photos/${spec.cover}`;
    const scene=course.scene||'dashboard';
    course.phases=[
      lesson(`Prepare the ${course.title} materials`,'This project starts after the Raspberry Pi 5 Setup course is complete. Keep the project-specific work focused on its actual components and goal.','15–25 min',diagram(scene,`Project-specific materials and safe work-area diagram for ${course.title}.`),[
        action('Confirm the Pi foundation is complete','Use the Raspberry Pi 5 Setup course for Imager, Wi-Fi, updates, Terminal, and the clean cold-boot check.'),
        action('Lay out only project-specific parts','Identify the display, input hardware, enclosure, circuit parts, or account/service needed for this project.'),
        action('Inspect connectors and protect the work surface','Do not connect power while changing physical parts or cable routing.')
      ],['The Pi foundation is complete.','Project-specific materials are present.','Power is disconnected for physical setup.']),
      lesson(`Set up the ${course.title} software`,'Use the exact software path for this project; do not repeat the full Pi operating-system setup here.','25–45 min',diagram('pi-os',`Software setup diagram for ${course.title}: work from the completed Pi foundation, then test this project manually.`),[
        action('Start from the working Pi foundation',spec.setup),
        action('Test manually before automation','Do not make an autostart rule, wall mount, or enclosure change until the project works interactively.'),
        action('Keep a recovery path','Record the non-secret URL, folder, or start command needed to return to this working state.')
      ],['The project opens manually.','The primary input method works.','A maintenance route is known.']),
      lesson(`Build the core ${course.title} experience`,'Implement the central project behavior before adding optional hardware, automation, or visual polish.','35–75 min',diagram(scene,`Core ${course.title} build diagram. Follow the numbered checklist below in order.`),[
        action('Build the core workflow',spec.build),
        action('Use the real display and input method','Test the screen, keyboard, touch controls, or circuit exactly as it will be used.'),
        action('Keep scope intentionally small','Remove features or hardware that make the core project harder to understand or maintain.')
      ],['The project’s main task works manually.','The interaction is clear on the actual hardware.']),
      lesson(`Test ${course.title} in real use`,'A project is ready only after it succeeds in the environment and interaction style it was built for.','30–60 min',diagram(scene,`Real-use test diagram for ${course.title}: verify the project’s main task, controls, and failure recovery.`),[
        action('Run a realistic test',spec.test),
        action('Exercise every primary control','Include touch targets, keyboard input, physical buttons, or expected navigation.'),
        action('Check a recoverable failure','Confirm a network delay, empty state, or canceled action does not leave the project stuck.'),
        action('Check heat, power, and cable strain','Keep airflow open and solve instability before the project is left unattended.')
      ],['The primary task works in a realistic session.','The project recovers from a normal failure.','No cable or component is under strain.']),
      lesson(`Finish, cold-boot, and document ${course.title}`,'Automate only the confirmed working state, then document it so future changes are deliberate.','25–45 min',diagram('maintenance',`Final validation diagram for ${course.title}: cold boot, verify the primary task, and record the recovery path.`),[
        action('Configure one tested startup path','Use a single kiosk, service, or launch method only after manual success.'),
        action('Run a clean cold-boot test','Shut down, remove power briefly when appropriate, then confirm the project returns to its normal state.'),
        action('Document non-secret details','Record cable routing, settings, GPIO pins, display orientation, or recovery commands without recording credentials.'),
        action('Use the cover image as the finished-project reference','The header image represents the completed project; it is intentionally not reused as proof for every step.')
      ],['A cold boot reaches the intended project state.','The main task works after restart.','The recovery path is documented.'])
    ];
  }

  const mirror=courses.find(item=>item.id==='smart-mirror');
  if(mirror){
    mirror.cover='/assets/lesson-photos/smart-mirror-finished.png';
    mirror.phases=[
      lesson('Lay out and inspect the Smart Mirror hardware','Identify the project-specific frame, mirror, display, Pi, compatible DSI cable, and power supply before assembly.','15–25 min',photo('/assets/lesson-photos/smart-mirror-kit.png','Smart Mirror kit layout','Project-specific parts are laid out before the first connection.'),[action('Confirm the Pi foundation is complete','The Raspberry Pi 5 Setup course covers Imager, Wi-Fi, updates, and common tools.'),action('Inspect the mirror hardware','Check the display, ribbon, acrylic, frame, cable, and Pi case for damage.'),action('Keep USB-C disconnected','Physical work begins with the Pi fully powered off.')],['All required mirror components are present.','The Pi is powered off.']),
      lesson('Install and test MagicMirror² on a temporary display','Prove the mirror software on HDMI before the display is placed behind acrylic or into the frame.','35–75 min',photo('/assets/reference/magicmirror-install.svg?v=17.0.0','MagicMirror² installation diagram','Install from the official repository and test the default display before framing.'),[action('Install MagicMirror²','Use the official MagicMirrorOrg repository and supported manual install path.'),action('Create a working configuration','Copy the sample config before editing it.'),action('Run the default dashboard on HDMI','Verify it stays stable before moving to mirror hardware.')],['MagicMirror² starts manually.','The default dashboard is stable on the temporary display.']),
      lesson('Prove the optical mirror effect before cutting or mounting','Test the real acrylic, display brightness, and room lighting before any permanent assembly.','20–30 min',photo('/assets/lesson-photos/smart-mirror-finished.png','Finished-project target','This is the completed-project cover reference; use it only to judge the intended optical result.'),[action('Show sparse bright content on black','Use a running test dashboard with unused pixels fully black.'),action('Hold the mirror sheet in front of the temporary display','Keep both surfaces protected and parallel.'),action('Check normal and dim lighting','Confirm the content remains readable from the expected viewing angle.')],['Bright content is readable.','Black areas disappear into the reflection.']),
      lesson('Connect the DSI ribbon before frame assembly','Seat the cable while the Pi and display are accessible, then test it before mounting.','20–30 min',photo('/assets/lesson-photos/dsi-ribbon-seated.png','Seated DSI ribbon','The cable is straight, fully inserted, and secured by the closed latch.'),[action('Disconnect USB-C completely','Never handle DSI while the Pi is powered.'),action('Match the connector orientation','Use the DSI reference diagram to verify contacts and stiffener direction.'),action('Seat and test the cable','Test the display before it is placed in the frame.')],['The DSI connection is stable.','No sharp ribbon fold is visible.'],'Do not connect or disconnect DSI while powered.'),
      lesson('Dry-fit the frame stack and cable exit','Place the mirror, display, Pi, and rear panel without adhesive to confirm alignment and clearance.','30–45 min',diagram('mirror-stack','Dry-fit diagram: mirror front, mask, display, Pi, cable space, and rear panel.'),[action('Center the display behind the marked mirror area','Check the view from the front before anything is attached.'),action('Leave Pi vents and power accessible','Plan a broad cable exit with no sharp edge or rear-panel pressure.'),action('Test the rear panel without fastening','It must close without touching the LCD, Pi, or ribbon.')],['The display is centered.','The rear panel has clearance.']),
      lesson('Mount the display and black out the cavity','Secure the rigid display edges and hide only the inactive cavity.','45–60 min',diagram('mirror-mount','Mounting diagram: support rigid display edges, use a matte mask, keep the active screen and ventilation clear.'),[action('Power down before mounting','Disconnect USB-C before handling the display or mount.'),action('Mount only to rigid edges','Never press adhesive or hardware into the active LCD or flex cable.'),action('Add a matte-black mask','Hide reflective gaps without covering visible pixels or blocking ventilation.')],['The display is level and stable.','The active screen and vents remain clear.']),
      lesson('Test the mounted display before closing the frame','Verify the display, optical effect, and MagicMirror² screen while all connections remain accessible.','30–45 min',diagram('mirror-ui','Mounted-display test diagram: sparse black screen, stable dashboard, centered view through the mirror.'),[action('Boot the mounted display','Stop and power down if the display flickers or remains black.'),action('Start the tested MagicMirror² configuration','Use the configuration proven on the temporary display.'),action('Inspect from normal viewing distance','Confirm alignment, readability, and black unused areas.')],['The mounted display is stable.','The dashboard is readable through the mirror.']),
      lesson('Close the rear panel and run the thermal test','Final assembly must not create cable pressure or trap heat.','45–60 min',diagram('mirror-finish','Final-assembly diagram: rear panel closes cleanly, cables are free, and Pi ventilation remains open.'),[action('Arrange the tested cable paths','Power down before moving the rear panel.'),action('Close the panel slowly','Stop if you feel pressure; do not force the enclosure.'),action('Run for 30 minutes','Check display stability, temperature, Wi-Fi, and cable strain.')],['The closed frame is stable for 30 minutes.','No cable is pinched.']),
      lesson('Configure startup and document the finished mirror','The cover image represents the finished project; automate only after all manual checks pass.','30–45 min',photo('/assets/lesson-photos/smart-mirror-finished.png','Finished Smart Mirror cover','Use this completed-project reference at final validation, not as an earlier-step substitute.'),[action('Configure one tested startup method','Use a single known-good MagicMirror² launch path.'),action('Run two cold boots','Confirm the display and dashboard start without duplicate windows.'),action('Record the build','Photograph rear routing and write down non-secret recovery details.')],['Two cold boots reach the intended dashboard.','The finished build is documented.'])
    ];
  }

  const applyCover=()=>{
    const heading=document.querySelector('#courseView .course-title h1');
    if(!heading)return;
    const course=courses.find(item=>item.title===heading.textContent.trim());
    const head=document.querySelector('#courseView .course-head');
    // The observer sees the cover insertion too. Check the entire course view,
    // not just the header, so inserting this figure cannot schedule another one.
    if(!course?.cover||!head||document.querySelector('#courseView .project-cover'))return;
    const cover=document.createElement('figure');cover.className='project-cover';cover.innerHTML=`<img src="${course.cover}" alt="Finished ${course.title} project"><figcaption>Finished-project reference · lesson diagrams below describe the current action.</figcaption>`;head.after(cover);
  };
  new MutationObserver(()=>requestAnimationFrame(applyCover)).observe(document.body,{childList:true,subtree:true});
  applyCover();
})();
