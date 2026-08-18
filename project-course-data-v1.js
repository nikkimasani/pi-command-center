(()=>{
'use strict';
const step=(title,steps,expected,commands=[],trouble=[])=>({title,steps,expected,commands,trouble});
const phase=(title,summary,steps)=>({title,summary,actions:steps});
window.PI_PROJECT_COURSES={
  dashboard:{
    phases:[
      phase('Plan the dashboard','Decide what the 7-inch screen should show before writing code.',[
        step('Choose the dashboard sections',['List the information you want visible every day: time, weather, calendar, focus status, shortcuts and Pi status.','Limit the first version to four to six sections so the screen stays readable.','Mark which sections need live data and which can be static.','Sketch the screen as a simple top bar plus large cards.'],'You have a one-screen layout plan with no more than six primary sections.'),
        step('Create the project folder',['Open Terminal on your computer.','Create a new folder for the dashboard and enter it.','Create index.html, styles.css and app.js.','Open the folder in your code editor.'], 'The project folder contains the three starter files.', ['mkdir pi-dashboard','cd pi-dashboard']),
        step('Build the mobile-first shell',['Add a viewport meta tag in index.html.','Create one main dashboard container and semantic sections for each card.','Use CSS Grid with one column by default and two columns only when the screen is wide enough.','Set all cards to min-width:0 so long content cannot force horizontal overflow.'],'The dashboard fits inside a phone-sized viewport without horizontal scrolling.')
      ]),
      phase('Build the useful cards','Add each dashboard feature independently so one failure cannot break the whole page.',[
        step('Add clock and date',['Create a clock element and date element.','Use setInterval to refresh the time once per second.','Format the date with Intl.DateTimeFormat.','Verify the clock updates without reloading the page.'],'Time changes every second and the date is readable from several feet away.'),
        step('Add weather and calendar placeholders',['Create separate weather and calendar cards.','Start with sample data instead of an API.','Design loading, success and error states before connecting live data.','Keep each card readable at 1024×600 and 800×480.'],'Weather and calendar cards remain usable even with long text or missing data.'),
        step('Add Pi status and shortcuts',['Add a card for online/offline state, temperature and uptime placeholders.','Add large shortcut buttons for the tools you use most.','Use at least 44px touch targets.','Test with keyboard and touch navigation.'],'Every shortcut is easy to tap and no card overlaps another.')
      ]),
      phase('Run it on the Raspberry Pi','Move the working page to the Pi only after desktop testing is stable.',[
        step('Connect to the Pi with SSH',['Open Windows Terminal or PowerShell.','Run the SSH command using the username and hostname configured in Raspberry Pi Imager.','Accept the first fingerprint prompt with yes.','Enter the password even though no characters appear.'], 'You see a Raspberry Pi shell prompt.', ['ssh YOUR_USERNAME@nikkipi.local']),
        step('Update the Pi and verify Chromium',['Update package lists and installed packages.','Confirm Chromium launches normally from the desktop.','Do not start kiosk mode until normal browsing works.'], 'The Pi is updated and Chromium opens normally.', ['sudo apt update','sudo apt full-upgrade -y']),
        step('Open the dashboard in kiosk mode',['Deploy or serve the dashboard URL.','Open it once in normal Chromium and verify every card.','Then launch Chromium with the kiosk flag.','Confirm the page fills the display and there is no horizontal overflow.'], 'The dashboard fills the 7-inch display and remains readable and touch-friendly.', ['chromium --kiosk https://YOUR-URL.vercel.app'])
      ]),
      phase('Harden and finish','Make the dashboard reliable enough to leave running unattended.',[
        step('Test restart behavior',['Reboot the Pi.','Confirm Wi-Fi reconnects.','Open the dashboard again and verify every card recovers.','Note any data source that fails after restart.'],'A reboot does not require rebuilding or manually repairing the dashboard.'),
        step('Test failure states',['Disconnect Wi-Fi temporarily.','Confirm the page still renders and live-data cards show a useful error state.','Reconnect Wi-Fi and verify the cards recover.'],'Network failure does not create a blank or broken screen.'),
        step('Save the final configuration',['Record the dashboard URL, hostname and any API setup in project notes.','Save a screenshot of the finished layout.','Confirm the Pi can still exit kiosk mode for maintenance.'],'The dashboard is documented, recoverable and ready for daily use.')
      ])
    ]
  },
  'ai-terminal':{
    phases:[
      phase('Build the safe chat interface','Create the AI terminal UI without exposing secrets in browser code.',[
        step('Design the terminal layout',['Create a full-height chat page with header, message list and composer.','Use a dark high-contrast theme and large touch targets.','Make the message list independently scrollable.','Keep the composer visible when the on-screen keyboard opens.'],'The page fits mobile and 7-inch layouts without horizontal overflow.'),
        step('Add local message behavior',['Render user and assistant message bubbles from JavaScript.','Add Send and Enter-key behavior.','Disable Send while the input is empty.','Test long messages and code blocks.'],'The chat UI works with local mock replies before any API is connected.'),
        step('Create a server-side API route',['Create a server endpoint that receives the user message.','Store the AI API key only in server environment variables.','Return a temporary mock response first.','Confirm the browser bundle contains no secret key.'],'The browser calls a server endpoint and no API secret is present client-side.')
      ]),
      phase('Connect AI safely','Add the real model only after the server boundary is proven.',[
        step('Add the model call on the server',['Replace the mock server response with the AI request.','Validate empty or oversized input before sending it upstream.','Return a controlled error message when the provider fails.','Never log the secret key.'],'A normal prompt returns an assistant response through the server endpoint.'),
        step('Add loading and error states',['Show a visible typing/loading state after Send.','Prevent duplicate submissions while a request is active.','Render network and server errors inside the conversation.','Allow the user to retry without reloading the app.'],'Slow or failed requests remain understandable and recoverable.'),
        step('Test conversation limits',['Send short, long and multiline prompts.','Test code snippets and punctuation.','Test rapid repeated taps.','Confirm the UI remains responsive and does not duplicate messages.'],'The chat remains stable under normal beginner mistakes and repeated taps.')
      ]),
      phase('Move to Raspberry Pi','Run the finished AI terminal as a dedicated Pi interface.',[
        step('Connect to the Pi and update it',['SSH into the Pi.','Update package lists and packages.','Confirm Chromium opens before kiosk testing.'], 'The Pi is current and reachable over SSH.', ['ssh YOUR_USERNAME@nikkipi.local','sudo apt update','sudo apt full-upgrade -y']),
        step('Open the deployed AI terminal',['Open the deployed URL in normal Chromium.','Send a real test prompt.','Confirm the server-side environment variable works from the deployed app.','Check that no browser console error appears.'],'A real prompt succeeds from the Raspberry Pi browser.'),
        step('Launch the terminal in kiosk mode',['Close normal Chromium.','Launch the app in kiosk mode.','Test typing with the intended keyboard or touchscreen.','Confirm the composer stays usable at the bottom of the screen.'],'The AI terminal fills the display and remains usable for a full conversation.', ['chromium --kiosk https://YOUR-URL.vercel.app'])
      ]),
      phase('Finish and secure','Document recovery and keep secrets out of the device UI.',[
        step('Verify secret handling',['Inspect client-side source and browser storage.','Confirm the API key is not present.','Rotate the key immediately if it was ever exposed.'],'No API secret is available in browser source or local storage.'),
        step('Test offline behavior',['Disconnect Wi-Fi.','Send a message and verify the app shows a clear network error.','Reconnect and retry successfully.'],'The app fails clearly rather than hanging indefinitely.'),
        step('Document the deployment',['Record the deployed URL and server environment variable name.','Record how to exit kiosk mode.','Save a screenshot of the final terminal.'],'The AI terminal can be maintained without rediscovering its setup.')
      ])
    ]
  },
  cyberdeck:{
    phases:[
      phase('Bench-test every component','Prove the Pi, screen, keyboard and power source work before enclosure assembly.',[
        step('Boot the Pi on the desk',['Insert the prepared microSD card with power disconnected.','Connect the display using the intended DSI or HDMI path.','Connect the keyboard.','Connect power last and wait for Raspberry Pi OS.'],'The Pi boots, the display is stable and the keyboard types normally.'),
        step('Test portable power',['Shut the Pi down cleanly.','Connect the intended USB-C power bank or portable supply.','Boot again and watch for undervoltage warnings.','Run the system for at least ten minutes.'],'The Pi remains stable on portable power without repeated warnings.'),
        step('Map every required port',['Identify USB-C power, display connection, USB keyboard path, microSD access and any external USB ports.','Mark which ports must remain reachable after assembly.','Plan cable exits before cutting or fastening the enclosure.'],'You have a clear port-access plan before anything is mounted.')
      ]),
      phase('Dry-fit the enclosure','Place every component without permanent fasteners first.',[
        step('Place the display and keyboard',['Set the display in its intended opening.','Position the mini keyboard where it can be removed or serviced.','Check viewing angle and typing clearance.','Do not tighten permanent hardware yet.'],'Display and keyboard fit without pressure or obstruction.'),
        step('Place the Pi and power source',['Position the Pi so cooling surfaces and ports remain accessible.','Place the power bank away from the Pi cooling path.','Leave enough space for connectors and cable bends.','Close the enclosure gently without fastening it.'],'The enclosure can close without pressing on the Pi, screen or battery.'),
        step('Route cables with slack',['Connect the display, keyboard and power paths.','Use broad cable curves instead of sharp folds.','Leave service slack so the enclosure can open without unplugging everything.','Confirm no cable crosses a fan or vent.'],'Every cable reaches naturally and nothing is pinched.')
      ]),
      phase('Secure and validate','Fasten components one at a time and retest after each change.',[
        step('Secure the display',['Power down and unplug everything.','Fasten only the display using the enclosure-approved mounting points.','Confirm the LCD is not being compressed.','Reconnect and test the screen before continuing.'],'The display is secure and still works after mounting.'),
        step('Secure the Pi and keyboard',['Power down again.','Mount the Pi without blocking ports or cooling.','Secure the keyboard so it cannot slide into cables.','Reboot and test typing and connectivity.'],'Pi and keyboard stay fixed and all required ports remain usable.'),
        step('Secure the power source',['Mount the battery or power bank so its charging port remains reachable.','Keep it away from heat sinks and vents.','Add strain relief to the USB-C cable.','Run another powered test with the case partially open.'],'Portable power is secure, chargeable and does not stress the USB-C connector.')
      ]),
      phase('Final cyberdeck test','Confirm the finished unit works as a portable computer.',[
        step('Close the enclosure',['Shut down the Pi.','Arrange cables one final time.','Close each panel slowly while watching for pressure.','Tighten fasteners evenly.'],'The case closes fully without bulging or cable pressure.'),
        step('Run a thermal and battery test',['Boot from portable power.','Use the deck for at least fifteen minutes.','Check temperature during the test.','Confirm the keyboard, display and network remain stable.'],'The cyberdeck runs without thermal, power or input problems.', ['vcgencmd measure_temp']),
        step('Record service access',['Note how to open the enclosure safely.','Record which fasteners release the Pi, display and battery.','Save photos of the final cable routing.'],'The cyberdeck is finished and maintainable.')
      ])
    ]
  },
  'home-panel':{
    phases:[
      phase('Prepare Home Assistant','Verify the smart-home system before dedicating the Pi display.',[
        step('Verify Home Assistant on a normal computer',['Sign in to Home Assistant from your normal browser.','Confirm the devices you plan to control are available.','Test the key lights, switches and scenes.','Fix unavailable entities before designing the wall panel.'],'The intended devices and scenes work from a normal browser.'),
        step('Create a dedicated dashboard',['Create a dashboard specifically for the 7-inch panel.','Group controls by room or scene.','Use large buttons and avoid tiny entity rows.','Put the most-used controls on the first view.'],'The panel dashboard is simple enough to operate at arm’s length.'),
        step('Test touch layout',['Resize your browser to approximately the Pi display size.','Tap every control with touch or touch emulation.','Remove cards that require precise scrolling or tiny icons.'],'Every primary control is easy to hit without zooming.')
      ]),
      phase('Prepare the Raspberry Pi','Get the Pi online and stable before kiosk mode.',[
        step('Connect with SSH and update',['SSH into the Pi.','Update package lists and installed packages.','Reboot if required.'], 'The Pi is updated and reconnects normally.', ['ssh YOUR_USERNAME@nikkipi.local','sudo apt update','sudo apt full-upgrade -y']),
        step('Open Home Assistant in Chromium',['Open the Home Assistant dashboard URL in normal Chromium.','Sign in.','Test several controls from the Pi.','Confirm state updates appear on screen.'],'The Pi can control Home Assistant successfully in a normal browser.'),
        step('Prepare a maintenance exit',['Decide how you will leave kiosk mode when maintenance is needed.','Keep keyboard access or another reliable exit method.','Test the exit before switching to full-screen use.'],'You can always return to the Pi desktop without reinstalling anything.')
      ]),
      phase('Run the wall panel','Switch to kiosk behavior only after normal browser testing passes.',[
        step('Launch the dashboard full screen',['Close normal Chromium.','Launch the Home Assistant dashboard in kiosk mode.','Wait for the dashboard to finish loading.','Confirm browser chrome is hidden.'],'The Home Assistant dashboard fills the display.', ['chromium --kiosk https://YOUR-HOME-ASSISTANT-URL']),
        step('Test room and scene controls',['Tap every visible room control.','Activate each scene once.','Confirm on-screen state matches the actual device.','Check scrolling and orientation.'],'Controls respond accurately and remain easy to reach.'),
        step('Test network recovery',['Disconnect Wi-Fi briefly.','Confirm the panel shows a recoverable disconnected state.','Reconnect Wi-Fi and wait for Home Assistant to recover.'],'The panel reconnects without requiring a rebuild.')
      ]),
      phase('Mount and finish','Mount only after software and touch behavior are proven.',[
        step('Dry-fit the display mount',['Power the Pi off.','Hold or place the display at its intended location.','Check cable reach, viewing angle and ventilation.','Do not permanently mount until all three are acceptable.'],'The display position is comfortable and serviceable.'),
        step('Route power safely',['Choose a power route that will not be pinched by the mount.','Leave strain relief near the Pi USB-C connector.','Keep the cable away from sharp edges.'],'Power reaches the panel without tension or a sharp bend.'),
        step('Complete the final panel test',['Mount the unit.','Power it on.','Test several controls from the mounted position.','Confirm you can still access maintenance controls.'],'The mounted Home Assistant panel is stable, responsive and maintainable.')
      ])
    ]
  },
  'electronics-lab':{
    phases:[
      phase('Learn the safe wiring workflow','Build only with power removed and verify each physical connection.',[
        step('Identify the GPIO header',['Power the Pi off and unplug USB-C.','Orient the Pi so pin 1 is known.','Use a GPIO pinout reference to identify 3.3V, GND and GPIO17.','Do not insert any jumper yet.'],'You can point to the intended physical pins before wiring.'),
        step('Set up the breadboard',['Place the breadboard beside the Pi.','Identify the connected rows and power rails.','Choose one side for GND and keep it consistent.','Keep loose metal objects away from the board.'],'The breadboard orientation and intended GND rail are clear.'),
        step('Install GPIO Zero support',['Reconnect power only after the hardware area is clear.','SSH into the Pi.','Install python3-gpiozero.','Power down again before wiring.'],'GPIO Zero is installed and the Pi is powered off for wiring.', ['sudo apt install -y python3-gpiozero','sudo poweroff'])
      ]),
      phase('Build the first LED circuit','Wire GPIO17 through a resistor and LED to GND.',[
        step('Place the LED and resistor',['Confirm power is disconnected.','Insert the LED across separate breadboard rows.','Identify the long positive leg and short negative leg.','Place a 220–330Ω resistor in series with the positive side.'],'LED polarity and resistor placement are physically clear.'),
        step('Connect GPIO17 and GND',['Run one jumper from physical GPIO17 to the resistor input.','Run another jumper from the LED negative side to GND.','Trace the full path GPIO17 → resistor → LED → GND.','Do not power on until the path is correct.'],'The circuit has one current-limiting resistor and a complete path to GND.'),
        step('Run the LED test program',['Restore power.','Create a small Python file using gpiozero.LED on pin 17.','Turn the LED on, wait, then turn it off.','Stop immediately if the LED, resistor or Pi becomes hot.'],'The LED turns on and off under software control.', ['python3 led-test.py'])
      ]),
      phase('Add a push button','Learn input wiring separately from the LED output.',[
        step('Power down before rewiring',['Run a clean shutdown.','Unplug USB-C.','Wait until LEDs are off.','Do not move jumpers while the Pi is powered.'],'The Pi is fully unpowered before the circuit changes.', ['sudo poweroff']),
        step('Wire the button to a GPIO input',['Place the push button across the breadboard center gap if required by its leg layout.','Connect one button side to the chosen GPIO input.','Connect the other side according to the pull-up or pull-down method used in your code.','Trace every wire before restoring power.'],'The button input circuit matches the code’s pull-up/pull-down configuration.'),
        step('Read button presses in Python',['Restore power.','Run a gpiozero Button test.','Press and release the button several times.','Confirm one press does not create random repeated input.'],'Button state changes are detected consistently.', ['python3 button-test.py'])
      ]),
      phase('Combine and document','Use the button to control the LED and save a known-good wiring reference.',[
        step('Combine input and output behavior',['Modify the Python script so a button press changes the LED state.','Keep the existing safe GPIO numbers.','Run the script and test repeated presses.'],'Button input controls the LED reliably.'),
        step('Power-cycle the circuit',['Stop the script.','Shut the Pi down.','Remove and restore power without changing wires.','Run the script again.'],'The circuit still behaves correctly after a clean restart.'),
        step('Save a wiring map',['Photograph the working circuit from directly above.','Record each physical pin and GPIO number.','Label the resistor value and LED polarity in your notes.'],'You have a reproducible reference for the working electronics lab.')
      ])
    ]
  },
  pomodoro:{
    phases:[
      phase('Build the timer core','Make the focus timer reliable before adding Pi-specific behavior.',[
        step('Create the timer screen',['Build a large 25:00 display.','Add Start, Pause, Reset and Complete buttons.','Use touch targets at least 44px tall.','Keep the timer readable at phone width and 7-inch width.'],'The timer screen has no horizontal overflow and controls are easy to tap.'),
        step('Implement countdown logic',['Store remaining time in seconds.','Decrease it once per second only while running.','Prevent multiple intervals from starting after repeated taps.','Stop at zero instead of going negative.'],'Start and Pause behave predictably and the timer never drops below 00:00.'),
        step('Add session state',['Track focus versus break mode.','Show a clear visual label for the current mode.','Reset to the correct duration when a session completes.','Keep Complete separate from Reset.'],'The app clearly distinguishes focus, break, pause and completed states.')
      ]),
      phase('Make it resilient','Handle accidental taps and page reloads gracefully.',[
        step('Test rapid button taps',['Tap Start repeatedly.','Tap Pause and Start quickly.','Tap Reset while paused and while running.','Confirm there is still only one countdown interval.'],'Rapid taps do not speed up or duplicate the countdown.'),
        step('Save timer state',['Store the active mode and remaining time locally.','Reload the page.','Restore a reasonable saved state without creating duplicate timers.'],'A reload does not destroy the user’s session state.'),
        step('Add completion feedback',['Add a clear completion message.','Optionally add a short sound that can be muted.','Keep the next action obvious: start break or start focus.'],'The end of a session is obvious without being disruptive.')
      ]),
      phase('Run it on the Pi','Move the proven timer to the Raspberry Pi display.',[
        step('Update and test the Pi browser',['SSH into the Pi.','Update packages.','Open the timer in normal Chromium first.'], 'The timer runs correctly in the Pi browser.', ['ssh YOUR_USERNAME@nikkipi.local','sudo apt update','sudo apt full-upgrade -y']),
        step('Test touchscreen behavior',['Tap every timer control on the Pi display.','Confirm there are no hover-only actions.','Test the on-screen keyboard only if settings require text entry.'],'All timer controls work directly by touch.'),
        step('Launch kiosk mode',['Close normal Chromium.','Launch the deployed timer URL in kiosk mode.','Run a short test timer before relying on a 25-minute session.'],'The timer fills the display and remains responsive.', ['chromium --kiosk https://YOUR-URL.vercel.app'])
      ]),
      phase('Optional physical controls','Add hardware only after the touchscreen version is stable.',[
        step('Plan button functions',['Choose which physical buttons are truly useful, such as Start/Pause and Reset.','Assign GPIO pins before wiring.','Keep the touchscreen controls available as a fallback.'],'Each optional button has one clear function and assigned GPIO.'),
        step('Wire one button at a time',['Shut down and unplug the Pi.','Wire one button using the intended pull-up/pull-down configuration.','Test it independently before adding another button.'],'One physical button works without affecting the touchscreen UI.'),
        step('Finish the station',['Secure the display and any buttons.','Route cables with strain relief.','Run a full focus session and break.'],'The Pomodoro station works for a complete cycle without manual repair.')
      ])
    ]
  },
  glance:{
    phases:[
      phase('Choose glanceable information','Design for reading from a distance, not dense interaction.',[
        step('Select four primary cards',['Choose only the information you need at a glance, such as time, weather, next event and Pi status.','Rank the cards by importance.','Remove anything that requires frequent scrolling.'],'The first screen contains four or fewer high-value information areas.'),
        step('Set typography and spacing',['Use large time and headline text.','Keep secondary labels short.','Use high contrast and generous card spacing.','Test at the physical viewing distance you expect.'],'Primary information is readable without leaning toward the display.'),
        step('Build loading and error states',['Give every live-data card a loading state.','Give every live-data card a compact error state.','Keep the rest of the dashboard visible when one source fails.'],'A failed data source cannot blank the whole screen.')
      ]),
      phase('Connect data sources','Add one source at a time and verify it independently.',[
        step('Connect time and local date',['Use the browser clock for local time.','Format date and time with Intl APIs.','Verify timezone on the Pi later.'],'Clock and date update correctly without network access.'),
        step('Connect weather',['Use the selected weather API or service through the appropriate server-side path if a secret is required.','Show temperature, condition and one useful forecast detail.','Handle unavailable weather data.'],'Weather updates without exposing a secret in browser code.'),
        step('Connect calendar and Pi status',['Add the next calendar event using the chosen safe integration.','Add Pi online/temperature status if desired.','Keep each source independently recoverable.'],'Calendar and system status display without breaking the other cards.')
      ]),
      phase('Run on Raspberry Pi','Validate the exact display size and full-screen behavior.',[
        step('SSH and update the Pi',['Connect over SSH.','Update packages.','Verify the correct timezone.'],'The Pi is updated and reports the intended local time.', ['ssh YOUR_USERNAME@nikkipi.local','sudo apt update','sudo apt full-upgrade -y','timedatectl']),
        step('Test in normal Chromium',['Open the deployed Desk Info Center.','Leave it running long enough for every live card to refresh.','Check for overflow and long-text problems.'],'All cards refresh and remain readable on the 7-inch display.'),
        step('Launch in kiosk mode',['Close normal Chromium.','Open the info center in kiosk mode.','Confirm there is no browser chrome or unintended scrollbar.'],'The info center behaves like a dedicated appliance.', ['chromium --kiosk https://YOUR-URL.vercel.app'])
      ]),
      phase('Leave it unattended','Test the conditions that matter for an always-on desk display.',[
        step('Test overnight-style refresh',['Leave the page open through multiple refresh cycles.','Watch for duplicated timers, repeated cards or memory-related slowdown.'],'The display stays stable across repeated updates.'),
        step('Test network loss',['Disconnect Wi-Fi temporarily.','Confirm useful cached/static content remains.','Reconnect and verify data sources recover.'],'A temporary outage does not require a page rebuild.'),
        step('Document maintenance',['Record the URL, refresh behavior and how to exit kiosk mode.','Save a screenshot of the final layout.'],'The Desk Info Center is ready for daily unattended use.')
      ])
    ]
  },
  'photo-frame':{
    phases:[
      phase('Prepare the photo library','Use a small clean sample library before loading every photo.',[
        step('Create the photo folder',['Create a dedicated folder for frame images.','Copy five to ten test images into it.','Include both portrait and landscape photos.','Use simple filenames without unusual characters for the first test.'],'A small representative photo set is ready.'),
        step('Decide the crop behavior',['Choose whether images should fit completely with bars or crop to fill the screen.','Test both portrait and landscape examples.','Keep faces and important subjects from being unintentionally cropped.'],'You have one consistent display rule for mixed photo orientations.'),
        step('Build slideshow controls',['Create the image stage.','Add automatic advance.','Add Previous and Next controls for maintenance.','Add pause/resume if you expect to interact with the frame.'],'The test slideshow can advance automatically and manually.')
      ]),
      phase('Make the slideshow reliable','Handle bad images, reloads and timing before moving to the Pi.',[
        step('Preload the next image',['Load the next photo before switching if practical.','Do not blank the screen while the next image is loading.','Skip an image cleanly if it fails.'],'Transitions remain smooth even when one image is slow or invalid.'),
        step('Test long-running behavior',['Use a short interval for testing.','Let the slideshow cycle through the sample library repeatedly.','Confirm timers are not duplicated after navigation.'],'The slideshow cycles repeatedly without speeding up or freezing.'),
        step('Test browser reload',['Reload during the slideshow.','Confirm it restarts cleanly.','Verify controls still work after the reload.'],'A reload restores a usable slideshow automatically.')
      ]),
      phase('Run it on Raspberry Pi','Move the stable slideshow to the intended display.',[
        step('Update the Pi and copy photos',['SSH into the Pi.','Update packages.','Copy or sync the photo folder to the intended location.'],'The Pi contains the test photo library and is updated.', ['ssh YOUR_USERNAME@nikkipi.local','sudo apt update','sudo apt full-upgrade -y']),
        step('Serve or open the frame app',['Open the frame app in normal Chromium.','Verify every sample image displays.','Check portrait and landscape treatment.'],'The slideshow looks correct on the actual display.'),
        step('Launch kiosk mode',['Close normal Chromium.','Launch the frame app in kiosk mode.','Let it advance through several photos.'],'Photos fill the intended screen area without browser chrome.', ['chromium --kiosk https://YOUR-URL.vercel.app'])
      ]),
      phase('Load the real library','Scale up only after the test library is proven.',[
        step('Add photos in batches',['Add a manageable batch of real photos.','Reload and watch at least one full cycle of that batch.','Remove or rename files that fail.'],'The larger library still cycles cleanly.'),
        step('Test power-cycle recovery',['Reboot the Pi.','Open the frame again.','Confirm the slideshow starts without manual repair.'],'The frame recovers normally after a reboot.'),
        step('Finish the enclosure or stand',['Power down.','Mount the display without pressing on the LCD.','Route power with strain relief and ventilation.','Power on and run a final slideshow test.'],'The Digital Photo Frame is physically secure and runs unattended.')
      ])
    ]
  },
  'magic-frame':{
    phases:[
      phase('Start from the proven Smart Mirror','Do not add Magic Frame features until the base mirror works reliably.',[
        step('Verify the existing Smart Mirror',['Boot the Smart Mirror.','Confirm MagicMirror loads automatically.','Verify touch, orientation and display brightness.','Fix any base-mirror issue before continuing.'],'The base Smart Mirror is fully working before enhancement.'),
        step('Define the hidden and reveal states',['Choose what the mirror shows normally.','Define the photo/reveal state separately.','Use black backgrounds wherever content should disappear behind the mirror.','Sketch how the transition should look.'],'Normal mirror and photo-reveal states are clearly defined.'),
        step('Create a software-only reveal test',['Add a temporary on-screen control that toggles between mirror content and the reveal/photo state.','Test the transition repeatedly.','Do not add sensors or GPIO yet.'],'The reveal behavior works entirely in software first.')
      ]),
      phase('Add sleep and wake behavior','Make display state reliable before connecting physical triggers.',[
        step('Implement sleep state',['Create a state that hides bright UI content.','Keep the background fully black where the mirror should look reflective.','Make sleep reversible without reloading the page.'],'The display can enter and leave a convincing hidden state.'),
        step('Implement timed wake or reveal',['Add a controlled timer or software trigger for wake/reveal.','Prevent repeated triggers from stacking.','Return cleanly to the normal mirror state.'],'Repeated software triggers do not leave the interface stuck.'),
        step('Test restart behavior',['Restart MagicMirror or reboot the Pi.','Confirm the system returns to a predictable default state.'],'A restart does not leave the frame permanently revealed or asleep.')
      ]),
      phase('Add optional physical trigger','Only now add a button or sensor if the design needs one.',[
        step('Choose the trigger and GPIO',['Decide whether the trigger is a push button, PIR sensor or another supported input.','Choose the GPIO pin and document the physical pin number.','Keep the software toggle available as a fallback.'],'The trigger type and exact GPIO connection are defined before wiring.'),
        step('Wire and test the trigger separately',['Shut down and unplug the Pi.','Wire the trigger according to its safe input circuit.','Restore power and run a tiny standalone input test.','Do not connect the input to MagicMirror behavior until it reads reliably.'],'The physical trigger produces clean input events by itself.'),
        step('Connect trigger to reveal behavior',['Map the tested input event to the existing software reveal function.','Test repeated triggers.','Test trigger input while the frame is already revealed.'],'The physical trigger changes frame state without duplicate or stuck transitions.')
      ]),
      phase('Reassemble and finish','Close the frame only after every new behavior passes with the back open.',[
        step('Run an open-back final test',['Keep the back panel open.','Run mirror, reveal, sleep and wake behavior.','Check cables and optional trigger wiring during operation.'],'All Magic Frame states work with the hardware still accessible.'),
        step('Close the back without pressure',['Shut down and remove power.','Route DSI, USB-C and optional sensor wires with slack.','Close the back slowly and check for pressure.'],'The back closes flat without pinching or pulling any wire.'),
        step('Run the completed Magic Frame',['Power on from the final location.','Verify automatic MagicMirror start.','Test every reveal/sleep/wake path one final time.'],'The Magic Mirror Frame operates reliably in its final assembled state.')
      ])
    ]
  }
};
})();