/* Pi Lab curriculum source of truth. Do not put lesson copy in the renderer. */
window.PI_LAB = {
  title: 'Pi Lab',
  healthCheckSource: 'Raspberry Pi Documentation · vcgencmd reference (reviewed 2026-08-25)',
  healthCheck: [
    ['Find the Pi’s network address', 'hostname -I', 'One or more local IP addresses are returned.'],
    ['Check core temperature', 'vcgencmd measure_temp', 'A temperature reading is returned, for example temp=45.0\'C.'],
    ['Check for under-voltage or throttling', 'vcgencmd get_throttled', '0x0 means no under-voltage or throttling has occurred. Any other value is a real bit flag — check the official vcgencmd documentation for what it means before ignoring it.'],
    ['Check free storage on the root filesystem', 'df -h /', 'The root filesystem shows comfortable free space.'],
    ['Check memory usage', 'free -h', 'Available memory is shown. If it is very low, close unused programs before running anything demanding.'],
    ['Check how long the Pi has been running', 'uptime', 'The current uptime and load average are printed.'],
    ['Confirm the SSH service is active, if you enabled it', 'sudo systemctl is-active ssh', 'Expected result: active.'],
    ['Shut down cleanly before ever removing power', 'sudo shutdown -h now', 'The Pi halts safely. Wait for all activity to stop before disconnecting power — never pull power from a running Pi.']
  ],
  healthLiveSetup: [
    ['Script contents — paste into ~/pi-health.py (created with: nano ~/pi-health.py)', '#!/usr/bin/env python3\n# Pi Lab health status page - standard library only, nothing to install.\nimport html as htmllib\nimport http.server\nimport socket\nimport socketserver\nimport shutil\nimport subprocess\n\nPORT = 8090\n\n\ndef run(cmd):\n    try:\n        return subprocess.run(cmd, capture_output=True, text=True, timeout=5).stdout.strip()\n    except Exception as e:\n        return "error: " + str(e)\n\n\ndef read_uptime():\n    try:\n        with open("/proc/uptime") as f:\n            seconds = float(f.read().split()[0])\n        h, rem = divmod(int(seconds), 3600)\n        m, _ = divmod(rem, 60)\n        return str(h) + "h " + str(m) + "m"\n    except Exception as e:\n        return "error: " + str(e)\n\n\ndef read_mem():\n    try:\n        info = {}\n        with open("/proc/meminfo") as f:\n            for line in f:\n                k, v = line.split(":", 1)\n                info[k] = v.strip()\n        total = int(info["MemTotal"].split()[0])\n        avail = int(info["MemAvailable"].split()[0])\n        pct = round((total - avail) / total * 100)\n        return str(pct) + "% used (" + str(avail // 1024) + " MB available of " + str(total // 1024) + " MB)"\n    except Exception as e:\n        return "error: " + str(e)\n\n\ndef snapshot():\n    disk = shutil.disk_usage("/")\n    return {\n        "host": socket.gethostname(),\n        "temp": run(["vcgencmd", "measure_temp"]) or "vcgencmd not available",\n        "throttled": run(["vcgencmd", "get_throttled"]) or "vcgencmd not available",\n        "disk": str(disk.free // (1024 ** 3)) + " GB free of " + str(disk.total // (1024 ** 3)) + " GB",\n        "memory": read_mem(),\n        "uptime": read_uptime(),\n        "ssh": run(["systemctl", "is-active", "ssh"]) or "not enabled",\n    }\n\n\nPAGE = """<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="5">\n<title>Pi Health Status</title>\n<style>\nbody{font:15px/1.5 system-ui,sans-serif;background:#08111c;color:#f4f7fb;padding:32px;max-width:520px;margin:auto}\nh1{font-size:22px}\ntable{width:100%;border-collapse:collapse;margin-top:16px}\ntd{padding:10px 0;border-top:1px solid #294359}\ntd:first-child{color:#9eb1c4;width:45%}\n.ok{color:#54d6b0}\n</style></head><body>\n<h1>__HOST__ live health status</h1>\n<p class="ok">Refreshes automatically every 5 seconds. Leave this tab open.</p>\n<table>\n<tr><td>Temperature</td><td>__TEMP__</td></tr>\n<tr><td>Throttle status</td><td>__THROTTLED__</td></tr>\n<tr><td>Disk (root)</td><td>__DISK__</td></tr>\n<tr><td>Memory</td><td>__MEMORY__</td></tr>\n<tr><td>Uptime</td><td>__UPTIME__</td></tr>\n<tr><td>SSH service</td><td>__SSH__</td></tr>\n</table>\n</body></html>"""\n\n\ndef render(data):\n    out = PAGE\n    for key, value in data.items():\n        out = out.replace("__" + key.upper() + "__", htmllib.escape(str(value)))\n    return out\n\n\nclass Handler(http.server.BaseHTTPRequestHandler):\n    def do_GET(self):\n        self.send_response(200)\n        self.send_header("Content-Type", "text/html; charset=utf-8")\n        self.end_headers()\n        self.wfile.write(render(snapshot()).encode("utf-8"))\n\n    def log_message(self, *args):\n        pass\n\n\nif __name__ == "__main__":\n    socketserver.TCPServer.allow_reuse_address = True\n    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:\n        print("Pi health status running at http://<this-pi>.local:" + str(PORT) + "/")\n        httpd.serve_forever()', 'Save with Ctrl+O, Enter, then Ctrl+X to exit nano.'],
    ['Run it once to test', 'python3 ~/pi-health.py', 'The terminal prints a URL. Leave this running and open that URL from another device on the same network.'],
    ['Open the live page from another device', 'http://<hostname>.local:8090/', 'Replace <hostname> with your Pi’s actual hostname. The page loads and refreshes automatically every 5 seconds.'],
    ['Stop the test run with Ctrl+C, then create a systemd service file — paste into /etc/systemd/system/pi-health.service using: sudo nano /etc/systemd/system/pi-health.service', '[Unit]\nDescription=Pi Lab health status page\nAfter=network.target\n\n[Service]\nExecStart=/usr/bin/python3 /home/<username>/pi-health.py\nRestart=on-failure\nUser=<username>\n\n[Install]\nWantedBy=multi-user.target', 'Replace <username> with your actual account name in both places.'],
    ['Reload systemd so it sees the new file', 'sudo systemctl daemon-reload', 'No output means it succeeded.'],
    ['Enable it to start at every boot', 'sudo systemctl enable pi-health.service', 'systemd confirms a symlink was created.'],
    ['Start it now without rebooting', 'sudo systemctl start pi-health.service', 'No output means it succeeded.'],
    ['Confirm it is running', 'sudo systemctl status pi-health.service', 'The status shows active (running).']
  ],
  courses: [
    {
      id: 'foundation',
      status: 'ready',
      icon: '01',
      title: 'Raspberry Pi 5 Foundation',
      short: 'Set up one reliable Raspberry Pi 5 before any project build.',
      duration: '70–100 min',
      level: 'New to Pi',
      source: 'Raspberry Pi Documentation · Getting started (reviewed 2026-08-25)',
      cover: '/assets/lesson-photos/foundation-kit-v20.png',
      materials: ['Raspberry Pi 5', 'official 27 W USB-C supply', 'microSD card', 'micro-HDMI display cable', 'keyboard + mouse'],
      safety: ['Power off before moving the microSD card or any ribbon cable.', 'Confirm a storage device by name and capacity before writing it.'],
      links: [
        ['Download Raspberry Pi Imager', 'https://www.raspberrypi.com/software/'],
        ['Official getting-started guide', 'https://www.raspberrypi.com/documentation/computers/getting-started.html']
      ],
      lessons: [
        {
          title: 'Make a safe, complete workbench',
          time: '10 min',
          kind: 'photo',
          image: '/assets/lesson-photos/foundation-kit-v20.png',
          alt: 'Raspberry Pi 5, microSD card, display cable, and power supply arranged on a workbench',
          caption: 'Illustrative workbench photo: identify the hardware here, then verify its labels against your actual parts. Keep the USB-C power lead disconnected.',
          goal: 'Identify every part before power is connected.',
          actions: [
            ['Place the Pi with its connectors visible', 'Do not place the board on metal or conductive packaging.'],
            ['Match the microSD card and reader', 'Use the card you intend to erase; remove other storage devices if you are unsure.'],
            ['Set aside display, keyboard, mouse, and power', 'Power is always connected last.']
          ],
          check: { q: 'When is it safe to insert the microSD card?', options: ['After the Pi is fully powered down', 'While the status LED is blinking', 'After connecting USB-C power'], answer: 0, why: 'The Pi must be powered down before inserting or removing boot media.' },
          success: 'You can name every part and the Pi has no power connected.'
        },
        {
          title: 'Install Raspberry Pi Imager',
          time: '10 min',
          kind: 'diagram',
          diagram: 'imager-download',
          goal: 'Install the official imaging tool on your computer.',
          actions: [
            ['Open the official Raspberry Pi software page', 'Use raspberrypi.com/software rather than a third-party download page.'],
            ['Download and install Raspberry Pi Imager', 'Choose the installer for your Windows, macOS, or Linux computer.'],
            ['Launch Imager', 'Leave the microSD card out until you are ready to select storage.']
          ],
          check: { q: 'What does Raspberry Pi Imager do?', options: ['Downloads an OS and writes it to boot media', 'Turns the Pi into a monitor', 'Formats a running Pi'], answer: 0, why: 'Imager selects an operating system and writes it to the storage device.' },
          success: 'Raspberry Pi Imager is open on your computer.'
        },
        {
          title: 'Select the Pi, operating system, and card',
          time: '15 min',
          kind: 'diagram',
          diagram: 'imager-select',
          goal: 'Make the three choices that determine the boot media.',
          actions: [
            ['Choose Device → Raspberry Pi 5', 'Match the board on your bench.'],
            ['Choose OS → Raspberry Pi OS Desktop', 'Use Desktop for this interactive lab; do not choose a random image.'],
            ['Choose Storage → your microSD card', 'Verify its capacity and name. Disconnect other drives if there is any doubt.']
          ],
          check: { q: 'Which selection deserves a final capacity check before you continue?', options: ['Storage', 'Device', 'Operating system'], answer: 0, why: 'Writing the image erases the selected storage device.' },
          success: 'Imager shows Raspberry Pi 5, Raspberry Pi OS Desktop, and the intended microSD card.'
        },
        {
          title: 'Set your identity and lab Wi-Fi',
          time: '15 min',
          kind: 'photo',
          image: '/assets/lesson-photos/official-imager-wifi-v21.png',
          alt: 'Official Raspberry Pi Imager Customisation Wi-Fi tab screenshot',
          caption: 'Official Raspberry Pi Imager Wi-Fi tab screenshot. Source: Raspberry Pi documentation; labels can change between Imager versions.',
          goal: 'Preconfigure the account, location, keyboard, and network details the Pi needs on first boot.',
          actions: [
            ['Open OS Customisation in Imager', 'When Imager offers customisation, open it before starting the write. Do not skip it if you need Wi-Fi or SSH on first boot.'],
            ['Choose a memorable hostname', 'Use lowercase letters, numbers, and hyphens only; for example pi-lab-01. It helps identify this Pi on your local network.'],
            ['Set localisation and keyboard layout', 'Choose the timezone, keyboard layout, and language that match the builder who will use the device.'],
            ['Create your user account', 'Use a unique username and a strong password. Keep both private; do not place credentials in a lab journal or project repository.'],
            ['Enter the exact Wi-Fi network', 'Confirm the SSID and password character by character. If available, use Ethernet as a fallback during first boot.']
          ],
          links: [['Official: Raspberry Pi Imager customisation', 'https://www.raspberrypi.com/documentation/computers/getting-started.html#install-using-imager']],
          check: { q: 'Why configure Wi-Fi before writing the card?', options: ['The Pi can join the intended network at first boot', 'It permanently improves the microSD card', 'It powers the Pi without USB-C', 'It removes the need for a user account'], answer: 0, why: 'Preconfigured Wi-Fi lets the Pi join the selected network as it first starts, which is especially important for remote access.' },
          success: 'A hostname, localisation, user account, and the intended network are entered, with no credentials recorded in your project notes.'
        },
        {
          title: 'Enable SSH before the first boot',
          time: '10 min',
          kind: 'photo',
          image: '/assets/lesson-photos/official-imager-ssh-v21.png',
          alt: 'Official Raspberry Pi Imager Remote Access screen with the Enable SSH toggle and authentication choices',
          caption: 'Official Raspberry Pi Imager Remote Access screenshot. Turn on Enable SSH before writing when you plan to work remotely; options may vary by Imager version.',
          goal: 'Make remote terminal access intentional and testable instead of discovering it is unavailable after the Pi is installed.',
          actions: [
            ['Open Customisation → Remote Access', 'In Raspberry Pi Imager, open the Remote Access subtab while the OS image is still being configured.'],
            ['Turn on Enable SSH', 'Use the Enable SSH toggle. Raspberry Pi OS does not enable the SSH server by default.'],
            ['Choose an authentication method', 'For a first local-lab setup, password authentication uses the username and password you created. Use public-key authentication only when you already understand and manage SSH keys.'],
            ['Confirm the login identity', 'The SSH username is the same user account you configured in Imager; it is not necessarily pi. Never share the password in notes or chat.'],
            ['Keep the official recovery path nearby', 'If the Imager screen changes, use the linked Raspberry Pi Remote Access guide rather than guessing or making boot-partition files.']
          ],
          links: [
            ['Official: Configure SSH in Imager', 'https://www.raspberrypi.com/documentation/computers/remote-access.html#enable-the-ssh-server'],
            ['Official: Remote access guide', 'https://www.raspberrypi.com/documentation/computers/remote-access.html']
          ],
          check: { q: 'Where should you enable SSH for a new Pi before its first boot?', options: ['Raspberry Pi Imager → Customisation → Remote Access', 'By connecting the USB-C power cable first', 'In a browser after the Pi is sealed in a project', 'By copying your password into the microSD card label'], answer: 0, why: 'Imager can preconfigure remote access during image creation, so SSH is ready when the Pi first connects to the network.' },
          success: 'Enable SSH is turned on, the intended authentication method is selected, and you know which username you will use to connect.',
          troubleshoot: [
            ['Password login is refused even though SSH is enabled', 'Reopen Imager’s Remote Access tab and confirm Password authentication was selected, not public-key only. If you intended to use a key, you must connect with that key instead of a password — Imager will not silently fall back to password login.'],
            ['You are not sure which username to use', 'The SSH username is always the account you created in the Customisation tab, not a Raspberry Pi OS default. If you did not set one, Imager falls back to whatever account image supplies, which may not exist on newer OS releases.']
          ]
        },
        {
          title: 'Write, verify, and install the card',
          time: '15–25 min',
          kind: 'diagram',
          diagram: 'imager-write',
          goal: 'Create boot media and move it safely to the powered-off Pi.',
          actions: [
            ['Start Write and accept the erase warning only after rechecking storage', 'Stay at the computer until Imager reports verification complete.'],
            ['Eject the microSD card from your computer', 'Do not pull it out during a write or verify step.'],
            ['Insert the card into the powered-off Pi', 'Seat it gently, then connect display, keyboard, and mouse.']
          ],
          check: { q: 'What is the correct order at the Pi?', options: ['Card and peripherals first; USB-C power last', 'USB-C power first; card while it boots', 'Insert the card after the desktop appears'], answer: 0, why: 'Connect storage and peripherals before power.' },
          success: 'The card is seated and the Pi remains unpowered.'
        },
        {
          title: 'Boot, update, and prove the foundation',
          time: '20–30 min',
          kind: 'photo',
          image: '/assets/lesson-photos/foundation-first-boot-v20.png',
          alt: 'Raspberry Pi 5 connected to a display, keyboard, mouse, and USB-C power after first boot',
          caption: 'Illustrative first-boot photo: compare the connection sequence and overall setup; verify your exact ports against your Pi before applying power.',
          goal: 'Prove the Pi is updated, reachable, and ready before beginning any project-specific lesson.',
          actions: [
            ['Connect USB-C power last', 'Wait for the boot screen, complete the first-boot prompts, and confirm the desktop, keyboard, mouse, and network all work.'],
            ['Confirm the Pi has joined the network', 'Open Terminal on the Pi and run the network command below. Record only the hostname or IP address you need for this session, never passwords.'],
            ['Confirm the SSH service is active', 'Run the SSH status command below on the Pi. If it is not active, return to the official Remote Access guide rather than guessing.'],
            ['Connect once from your other computer', 'On another computer connected to the same network, use the SSH command below after replacing the placeholders with your own username and hostname or IP address.'],
            ['Update and restart the Pi', 'Run the update commands one at a time, then restart. A project begins only after this clean restart works.']
          ],
          commands: [
            ['Find the Pi network address (run on the Pi)', 'hostname -I', 'One or more local IP addresses are returned.'],
            ['Confirm the SSH service (run on the Pi)', 'sudo systemctl is-active ssh', 'Expected result: active.'],
            ['Connect from your other computer', 'ssh <username>@<hostname>.local', 'Replace the placeholders. On networks that do not support .local names, use the IP address from hostname -I instead.'],
            ['Refresh package information (run on the Pi)', 'sudo apt update', 'The command finishes without a network or repository error.'],
            ['Install available system updates (run on the Pi)', 'sudo apt full-upgrade -y', 'Packages finish configuring; do not disconnect power while updates run.'],
            ['Restart to prove the updated system boots (run on the Pi)', 'sudo reboot', 'The Pi returns to a usable desktop after the restart.']
          ],
          links: [
            ['Official: Connect to an SSH server', 'https://www.raspberrypi.com/documentation/computers/remote-access.html#connect-to-an-ssh-server'],
            ['Official: Getting started', 'https://www.raspberrypi.com/documentation/computers/getting-started.html']
          ],
          check: { q: 'What proves the foundation is complete?', options: ['A clean restart reaches a usable desktop, the network works, and SSH is reachable when you enabled it', 'The board power LED turns on', 'The OS image was downloaded'], answer: 0, why: 'A working system has to boot, accept input, connect to the network, and provide the remote access path you deliberately configured.' },
          success: 'A clean restart reaches Raspberry Pi OS Desktop, the system is updated, and SSH works from another computer when it was enabled.',
          troubleshoot: [
            ['The Pi never joins the lab Wi-Fi', 'Reconnect a display and keyboard and check the network menu directly on the Pi. Re-verify the SSID and password character by character; hidden networks and 5 GHz-only networks can silently fail on some Pi models. As a fallback, connect Ethernet instead of Wi-Fi and finish setup that way.'],
            ['ssh: Could not resolve hostname *.local', 'Some routers and networks do not support mDNS/.local name resolution. Run hostname -I directly on the Pi (with a display connected, or via your router’s connected-devices list) and connect using that IP address instead of the hostname.'],
            ['SSH connection times out or is refused', 'Confirm the Pi finished booting and is on the same network as your other computer. Re-run sudo systemctl is-active ssh on the Pi to confirm the service is active — if it is not, SSH was not actually enabled before the card was written, and you will need to redo the Remote Access step in Imager.'],
            ['Password authentication is rejected during ssh login', 'Confirm you are using the exact username and password created in Imager’s Customisation tab, not a default like “pi”. If you chose public-key authentication instead of password, a password will never be accepted — you must connect using that key.']
          ]
        }
      ]
    },
    {
      id: 'mirror',
      status: 'ready',
      icon: '02',
      title: 'Smart Mirror',
      short: 'Build and test a MagicMirror² display in a frame, safely and in order.',
      duration: '3–4.5 hr',
      level: 'Foundation required',
      source: 'MagicMirror² Documentation · Installation and autostart guides (reviewed 2026-08-25)',
      cover: '/assets/lesson-photos/smart-mirror-finished.png',
      materials: ['Completed Pi 5 Foundation', 'temporary HDMI display and cable for early software testing', 'a DSI display compatible with your Pi model (confirm its resolution and power draw in its own documentation)', 'a DSI ribbon/FPC cable that matches your Pi’s DSI connector and reaches your mounting position with slack', 'two-way mirror acrylic or glass sized to fully cover your frame opening', 'a frame or enclosure deep enough for the display, Pi, cabling, and rear airflow (a deep shadow box works well)', 'non-marring, reversible mounting hardware such as heavy-duty hook-and-loop fasteners for a dry-fit before anything is permanent', 'a Pi case or standoff hardware that still leaves the DSI connector accessible'],
      safety: ['Disconnect USB-C power before touching the DSI ribbon.', 'Never press on an active LCD surface.', 'Do not seal the enclosure until thermal testing passes.'],
      links: [
        ['MagicMirror² installation guide', 'https://docs.magicmirror.builders/getting-started/installation.html'],
        ['Raspberry Pi display documentation', 'https://www.raspberrypi.com/documentation/computers/display.html']
      ],
      lessons: [
        {
          title: 'Inspect the mirror-specific parts',
          time: '15 min',
          kind: 'photo',
          image: '/assets/lesson-photos/smart-mirror-kit.png',
          alt: 'Smart Mirror parts arranged before assembly',
          caption: 'This is an inventory photo—not an assembly order. Keep the Pi powered off.',
          goal: 'Confirm the mirror build has the exact display, cable, frame, and power components.',
          actions: [
            ['Lay out frame, mirror, display, Pi, cable, and power supply', 'Compare physical labels; similar ribbon cables are not automatically interchangeable.'],
            ['Inspect the display and ribbon latches', 'Stop if a latch, flex cable, or LCD edge is damaged.'],
            ['Keep the Pi unpowered', 'No physical connection work happens with USB-C connected.']
          ],
          check: { q: 'When may you handle the DSI ribbon?', options: ['Only with USB-C power disconnected', 'While the display is running', 'Only after the frame is closed'], answer: 0, why: 'DSI connections are handled only while unpowered.' },
          success: 'All mirror-specific parts are identified and the Pi is powered off.'
        },
        {
          title: 'Prove MagicMirror² on a temporary display',
          time: '45–75 min',
          kind: 'diagram',
          diagram: 'software-test',
          goal: 'Make the software work on accessible hardware before it disappears behind the mirror.',
          actions: [
            ['Use the completed Pi foundation and a temporary HDMI display', 'Do not begin inside the frame — you want an easy display and keyboard on hand if something needs fixing.'],
            ['Confirm prerequisites, then clone the official repository', 'Check git and Node.js first. MagicMirror² requires a specific Node.js version, and its automated one-line installers were retired by the project in 2020 — only the manual, git-based install below is currently supported.'],
            ['Run the official installer, then create your config file', 'The installer is slow and produces little output — let it finish without interrupting it. Your local config.js is copied from the sample file; you never edit the sample directly.'],
            ['Start MagicMirror² and confirm it survives a restart', 'Watch the default clock-and-calendar layout render, then stop it and start it again before you treat the software as proven.']
          ],
          commands: [
            ['Confirm git and Node.js are installed', 'git --version && node -v', 'Both print version numbers. Compare the Node.js version against the "required" version linked from the MagicMirror² releases page — Raspberry Pi OS’s default apt Node.js package is often too old; install a current version from NodeSource or nodejs.org if needed.'],
            ['Clone the official MagicMirror² repository', 'git clone https://github.com/MagicMirrorOrg/MagicMirror.git', 'A new MagicMirror folder is created in your home directory.'],
            ['Run the official installer', 'cd ~/MagicMirror && node --run install-mm', 'This can take 10–25 minutes on a Raspberry Pi with little terminal output. Let it finish; do not interrupt it.'],
            ['Create your local configuration file', 'cd ~/MagicMirror && cp config/config.js.sample config/config.js', 'A new config.js file appears in the config folder — this is the file you edit later, not the sample.'],
            ['Start MagicMirror²', 'cd ~/MagicMirror && node --run start', 'The default MagicMirror² display opens on the temporary monitor.']
          ],
          links: [
            ['Official: MagicMirror² installation guide', 'https://docs.magicmirror.builders/getting-started/installation.html'],
            ['Official: MagicMirror² supported Node.js versions', 'https://github.com/MagicMirrorOrg/MagicMirror/releases']
          ],
          check: { q: 'Why test on a temporary display first?', options: ['Software and display problems are easier to isolate before framing', 'It makes the mirror darker', 'It avoids needing a power supply'], answer: 0, why: 'You want a known-good software and display state before physical assembly.' },
          success: 'The default MagicMirror² display works and survives a restart.',
          troubleshoot: [
            ['node --run install-mm fails, or a module error appears when starting', 'Check your Node.js version against the "required" version linked from the MagicMirror² releases page — a mismatch is the most common cause. Raspberry Pi OS’s default apt Node.js package is frequently too old; install a current version via NodeSource or nodejs.org, then re-run node --run install-mm.'],
            ['The window never opens on the temporary display', 'Confirm the temporary display is detected before starting MagicMirror², and try node --run start:dev for more detailed error output while you narrow down the problem.']
          ]
        },
        {
          title: 'Prove the optical effect',
          time: '20 min',
          kind: 'photo',
          image: '/assets/lesson-photos/smart-mirror-finished.png',
          alt: 'Finished Smart Mirror showing bright content on a black background',
          caption: 'Finished-project reference: use it to judge contrast, not as an assembly instruction.',
          goal: 'Confirm the actual mirror sheet, brightness, and room lighting produce a readable result.',
          actions: [
            ['Show sparse bright content on a black background', 'Unused display areas should be black.'],
            ['Hold the mirror acrylic in front of the running temporary display', 'Protect both surfaces and keep them parallel.'],
            ['Check the expected viewing distance and room lighting', 'Adjust only after observing the real environment.']
          ],
          check: { q: 'What makes unused display areas disappear into the reflection?', options: ['A black screen background', 'A brighter room light', 'A white full-screen page'], answer: 0, why: 'Black unused pixels blend into the reflected environment.' },
          success: 'Important content is readable through the mirror before anything is mounted.'
        },
        {
          title: 'Connect and test the DSI ribbon',
          time: '20 min',
          kind: 'photo',
          image: '/assets/lesson-photos/dsi-ribbon-seated.png',
          alt: 'DSI ribbon fully inserted and retained by a closed connector latch',
          caption: 'The ribbon is straight, fully inserted, and secured. Compare the stiffener and contact orientation to your exact hardware.',
          goal: 'Verify the display connection while both ends are still accessible.',
          actions: [
            ['Disconnect USB-C completely', 'Confirm no power LED is lit.'],
            ['Open the appropriate latch, align the ribbon, and insert it straight', 'Never force the cable or fold it sharply at the connector.'],
            ['Close the latch and test the display before frame work', 'If it is unstable, power down and correct it before proceeding.']
          ],
          check: { q: 'What is the next action if the display is blank after connecting DSI?', options: ['Power down, then recheck orientation and seating', 'Keep reseating it while powered', 'Mount it in the frame first'], answer: 0, why: 'Always remove power before inspecting or reseating the DSI connection.' },
          success: 'The display works before it enters the frame.',
          troubleshoot: [
            ['Display stays blank after connecting DSI', 'Power down, reopen the latch, and confirm the ribbon’s contacts face the correct direction for your specific display and Pi model. DSI ribbons are not universally symmetric; a reversed cable will not damage anything but will not show output either.'],
            ['Display flickers or shows garbled output', 'Power down and reseat the ribbon fully on both ends — a partially seated DSI connector is the most common cause. Also confirm the cable is not kinked or stretched taut.']
          ]
        },
        {
          title: 'Configure MagicMirror² for your display',
          time: '30–45 min',
          kind: 'diagram',
          diagram: 'mirror-config',
          goal: 'Set the correct resolution, orientation, and module layout so the mirror shows exactly what you intend once it is sealed inside the frame.',
          actions: [
            ['Confirm your display’s native resolution and refresh rate', 'Check the display’s own documentation rather than guessing; MagicMirror² and Raspberry Pi OS both perform best when set to the panel’s native resolution.'],
            ['Set display rotation if your frame is portrait', 'Use Raspberry Pi OS’s display settings to match how the display physically sits inside your frame, then confirm the image is right-side up before mounting.'],
            ['Open ~/MagicMirror/config/config.js in a text editor', 'This file controls which modules appear and where. Keep a copy of the default file before making changes.'],
            ['Choose and arrange modules for a mirror, not a monitor', 'Favor a small number of modules, such as clock and calendar, positioned away from the center — a mirror is read at a glance in passing, not studied closely.'],
            ['Restart MagicMirror² and confirm the layout on the real display', 'Run the start command again and check the layout using the actual DSI display, not the temporary one, since text size and viewing angle differ between panels.']
          ],
          commands: [
            ['Restart MagicMirror² after editing config.js', 'cd ~/MagicMirror && node --run start', 'The updated layout renders on the DSI display at its native resolution and orientation.']
          ],
          links: [
            ['Official: MagicMirror² configuration guide', 'https://docs.magicmirror.builders/configuration/introduction.html'],
            ['Official: Raspberry Pi display documentation', 'https://www.raspberrypi.com/documentation/computers/display.html']
          ],
          check: { q: 'Why confirm resolution and rotation before choosing modules?', options: ['A correct display setup prevents you from designing a layout that will not actually match the mounted screen', 'It makes the mirror glass more reflective', 'It is required to enable SSH', 'It permanently changes the two-way mirror sheet'], answer: 0, why: 'Module layout choices only make sense once the display’s real orientation and resolution are known.' },
          success: 'The DSI display shows the intended layout at the correct orientation and resolution before you move on to mounting.',
          troubleshoot: [
            ['The image is rotated or mirrored incorrectly', 'Recheck the physical DSI ribbon orientation first, then adjust the OS-level display rotation setting. Do not try to fix a hardware-flipped image only through software rotation — on touch panels that can misalign touch input with what is on screen.'],
            ['Content is cut off or has black bars', 'Confirm the configured resolution matches the display’s native resolution exactly; a mismatch is the most common cause of cropping or letterboxing on small DSI panels.']
          ]
        },
        {
          title: 'Autostart MagicMirror² on boot',
          time: '20–30 min',
          kind: 'diagram',
          diagram: 'mirror-autostart',
          goal: 'Make MagicMirror² start itself after every boot, using the project’s own recommended process manager, so the mirror never needs a keyboard once it is sealed.',
          actions: [
            ['Install PM2, the process manager MagicMirror² officially recommends', 'PM2 restarts MagicMirror² automatically if it crashes and keeps it running across reboots.'],
            ['Create a short launch script for PM2 to run', 'The script moves into the MagicMirror folder and starts it against a real display, since a boot-time process does not automatically have one attached the way a logged-in desktop session does.'],
            ['Start MagicMirror² under PM2 and confirm it runs', 'Check its status before relying on it, exactly as you would with any other background service.'],
            ['Enable PM2 to survive a reboot', 'PM2 requires one extra command, generated for your system, before it will restart itself and MagicMirror² automatically at boot.'],
            ['Reboot and confirm MagicMirror² appears with no manual steps', 'This proves the autostart chain end-to-end before you close the frame.']
          ],
          commands: [
            ['Install PM2 globally', 'sudo npm install -g pm2', 'PM2 installs without error.'],
            ['Generate your startup command', 'pm2 startup', 'PM2 prints a sudo env ... command tailored to your system. Copy it exactly and run it once before continuing.'],
            ['Launch script contents — paste into mm.sh (created with: cd ~ && nano mm.sh), then save with Ctrl+O, Enter, Ctrl+X', 'cd ./MagicMirror\nDISPLAY=:0 node --run start', 'A file named mm.sh now exists in your home folder.'],
            ['Make the script executable', 'chmod +x mm.sh', 'No output means it succeeded.'],
            ['Start MagicMirror² under PM2', 'pm2 start mm.sh', 'PM2 reports the process as online.'],
            ['Save the process list so PM2 restores it on boot', 'pm2 save', 'PM2 confirms the current process list has been saved.']
          ],
          links: [
            ['Official: MagicMirror² autostart guide', 'https://docs.magicmirror.builders/configuration/autostart.html']
          ],
          check: { q: 'Why does the launch script need DISPLAY=:0?', options: ['A boot-time background process does not automatically have a display attached the way a logged-in desktop session does', 'It changes the screen resolution', 'It is required to install PM2', 'It replaces config.js'], answer: 0, why: 'PM2 starts processes independently of a graphical login, so the script must explicitly point Electron at the running display.' },
          success: 'After a full reboot with no keyboard input, MagicMirror² appears automatically and pm2 status shows it online.',
          troubleshoot: [
            ['pm2 startup prints a command but nothing happens after reboot', 'You must copy and run the exact command PM2 printed — it is not automatic — before pm2 save takes effect. Re-run pm2 startup if you skipped that step.'],
            ['MagicMirror² starts under PM2 but the display stays blank', 'Confirm DISPLAY=:0 matches your actual display session, and that auto-login to the desktop is enabled. A background service cannot open a window on a session no one is logged into.'],
            ['pm2 status shows the process errored or restarting repeatedly', 'Run pm2 logs mm to see the real error. A wrong path in mm.sh or an incomplete node --run install-mm from the software-proof lesson are the most common causes.']
          ]
        },
        {
          title: 'Dry-fit, mount, and close the frame',
          time: '45–60 min',
          kind: 'photo',
          image: '/assets/lesson-photos/smart-mirror-dry-fit-v21.png',
          alt: 'Open Smart Mirror frame during a dry fit, with the display, Raspberry Pi, DSI cable, acrylic mirror layer, and rear panel visible',
          caption: 'Illustrative dry-fit reference: arrange and check every layer before anything is permanently fastened. Your exact frame and display may differ.',
          goal: 'Build the physical stack safely, verify its clearances, then close the frame only when every part fits without force.',
          actions: [
            ['Power down and dry-fit every layer', 'Disconnect USB-C power. Place the mirror layer, mask, display, Pi, cable route, and rear panel in position without adhesive or final screws.'],
            ['Center the active display from the front', 'Use low-tack painter’s tape or removable marks to center the display behind the viewing area. Confirm the visible screen is level before you mount it.'],
            ['Protect the display panel', 'Support only rigid display edges or manufacturer-approved mounting points. Nothing should press on the active LCD surface or pinch the DSI ribbon.'],
            ['Check cable space and Pi ventilation', 'Leave a gentle service loop in every cable, keep vents uncovered, and make sure the rear panel can close without rubbing a cable or board.'],
            ['Use non-marring, reversible fasteners for the first mount', 'Heavy-duty hook-and-loop fasteners or removable mounting squares let you adjust the display and Pi position without adhesive residue or new screw holes while you confirm fit.'],
            ['Make a reversible first closure', 'Close the rear panel slowly with temporary fasteners. Stop immediately if it bows, catches, or applies pressure; correct the fit before proceeding.']
          ],
          check: { q: 'What should you do if the rear panel will not close without pressure?', options: ['Tighten the screws until it seats', 'Remove the panel and correct the cable route or clearance', 'Add foam directly onto the LCD', 'Ignore it until the thermal test'], answer: 1, why: 'A forced closure can damage the display, cable, or Pi. The layout must be corrected while it is still easy to access.' },
          success: 'The screen is centered, no active display surface is under pressure, cables have slack, vents remain open, and the rear panel closes without force.'
        },
        {
          title: 'Validate, finish, and document the mirror',
          time: '30–45 min',
          kind: 'photo',
          image: '/assets/lesson-photos/smart-mirror-finished-v21.png',
          alt: 'Finished black-framed Smart Mirror in a home setting, showing a simple clock and weather display behind the reflective surface',
          caption: 'Finished-project reference: judge readability, alignment, reflections, and the clean closed enclosure. This is the final state, not a shortcut for earlier steps.',
          goal: 'Confirm that the finished mirror is stable, cool enough, and repeatable before you rely on it day to day.',
          actions: [
            ['Run a supervised 30-minute test', 'With the enclosure closed, observe display stability, Wi-Fi, cable strain, and any unexpected restarts. Do not leave a first test unattended.'],
            ['Check temperature before regular use', 'After the run, measure the Pi temperature and investigate instability, an unusually hot enclosure, or blocked airflow before calling the build complete.'],
            ['Perform two full cold boots', 'Shut down the Pi, disconnect power for at least 30 seconds, reconnect it, and repeat once. Each start should show one correctly aligned dashboard.'],
            ['Review the mirror from its intended viewing position', 'Check that information remains readable while the unused black screen area blends into the reflection. Adjust brightness or layout only after the hardware is stable.'],
            ['Create a builder recovery note', 'Record the display orientation, cable path, startup method, and how to access the rear panel. Never record passwords or private Wi-Fi details.']
          ],
          commands: [
            ['Check Raspberry Pi temperature after the test', 'vcgencmd measure_temp', 'A temperature reading is returned. If it keeps climbing or the system is unstable, reopen the frame and inspect ventilation before continued use.']
          ],
          check: { q: 'Which result is required before you consider this build ready for regular use?', options: ['The frame is closed once', 'One successful boot is enough', 'Two repeatable cold boots and a stable supervised thermal test', 'The display is set to maximum brightness'], answer: 2, why: 'The build is only reliable when it passes both a sustained test and repeatable cold starts.' },
          success: 'The mirror runs stably for 30 minutes, reports a reasonable temperature for its enclosure, cold-boots twice correctly, and has a non-secret recovery note.',
          troubleshoot: [
            ['Two mirrored dashboards or duplicate windows appear on cold boot', 'This is usually PM2 enabled twice, or a leftover autostart entry from an earlier attempt in addition to PM2. Run pm2 list to confirm only one mm process exists, and check ~/.config/autostart for an old browser or Electron launcher you no longer need.'],
            ['The enclosure runs hotter than expected', 'Reopen the rear panel and confirm the Pi’s vents are not blocked by the mirror layer, mounting hardware, or trapped cabling. Consider a case with a fan, or add ventilation gaps to the enclosure back panel, before extended daily use.'],
            ['Wi-Fi drops after the frame is closed', 'Enclosures — especially metal cases or metal-backed mirror sheets — can attenuate Wi-Fi signal. Reposition the Pi so its antenna side faces away from metal, or connect Ethernet if a cable can reach the mirror’s final location.']
          ]
        }
      ]
    },
    {
      id: 'electronics-lab',
      status: 'ready',
      icon: '03',
      title: 'Electronics Lab',
      short: 'Wire your first LED and button circuits safely, using the Pi’s own GPIO tools.',
      duration: '60–90 min',
      level: 'Foundation required',
      source: 'Raspberry Pi GPIO documentation · gpiozero documentation (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'a breadboard', 'jumper wires', 'assorted resistors (330Ω–1kΩ works for most LEDs)', 'a few LEDs', 'a momentary pushbutton'],
      safety: ['Always power down the Pi before wiring or rewiring a breadboard.', 'GPIO pins are 3.3V logic and are not 5V tolerant — never connect a 5V signal directly to a GPIO pin.', 'Always wire an LED with a current-limiting resistor in series; never connect one directly across a GPIO pin and ground.'],
      links: [
        ['Official: Raspberry Pi GPIO documentation', 'https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio'],
        ['Official: gpiozero documentation', 'https://gpiozero.readthedocs.io/']
      ],
      lessons: [
        {
          title: 'Read the GPIO header and know the voltage rules',
          time: '10 min',
          kind: 'diagram',
          diagram: 'gpio-pinout',
          goal: 'Understand the 40-pin header layout and the one rule that protects your Pi.',
          actions: [
            ['Power down before looking at wiring diagrams against the real header', 'Never probe or wire the header while the Pi is powered.'],
            ['Print the Pi’s own pinout reference', 'Use the command below rather than a diagram you found online — it always matches your exact Pi.'],
            ['Learn the one hard rule', 'GPIO pins run at 3.3V logic and are not 5V tolerant. A 5V signal on a GPIO pin can permanently damage it.']
          ],
          commands: [
            ['Print the GPIO pinout for this Pi', 'pinout', 'A labeled diagram of the 40-pin header is printed, including 3V3, 5V, GND, and each GPIO number.']
          ],
          check: { q: 'What happens if you connect a 5V signal directly to a GPIO input pin?', options: ['It can permanently damage the pin or the Pi', 'Nothing — GPIO pins are 5V tolerant', 'The Pi automatically lowers the voltage'], answer: 0, why: 'Raspberry Pi GPIO pins are 3.3V logic only; they are not 5V tolerant like some other boards.' },
          success: 'You can point to 3V3, 5V, and GND on the real header and state the 3.3V rule from memory.'
        },
        {
          title: 'Confirm gpiozero and wire your first LED',
          time: '20 min',
          kind: 'diagram',
          diagram: 'gpio-led',
          goal: 'Wire a single LED with a current-limiting resistor and confirm your Python environment can control it.',
          actions: [
            ['Power down, then wire the LED in series with a resistor', 'Run a GPIO pin through the resistor, into the LED’s longer (anode) leg, and the shorter leg to a GND pin.'],
            ['Confirm gpiozero is available', 'Raspberry Pi OS includes gpiozero by default — confirm it here rather than reinstalling blindly.'],
            ['Note which GPIO number you used', 'You will reference this exact number in your script; physical pin position and GPIO number are not the same thing.']
          ],
          commands: [
            ['Confirm gpiozero is installed', 'python3 -c "import gpiozero; print(gpiozero.__version__)"', 'A version number is printed.']
          ],
          check: { q: 'Why does the LED need a series resistor?', options: ['To limit current so it does not damage the LED or the GPIO pin', 'To make the LED brighter', 'To convert 3.3V to 5V'], answer: 0, why: 'Without a current-limiting resistor, an LED draws far more current than a GPIO pin is rated to safely supply.' },
          success: 'The LED is wired with a resistor in series, and python3 -c "import gpiozero..." prints a version with no error.'
        },
        {
          title: 'Blink the LED with a Python script',
          time: '15 min',
          kind: 'diagram',
          diagram: 'gpio-blink',
          goal: 'Write and run your first GPIO program.',
          actions: [
            ['Create a script file', 'Use nano or your preferred editor to create blink.py in your home folder.'],
            ['Enter the script below exactly, matching your LED’s GPIO number', 'gpiozero uses BCM (Broadcom) GPIO numbers, not physical pin positions — use the number from the pinout command, not the pin’s position on the header.'],
            ['Run it and confirm the LED blinks on a 1-second cycle', 'Stop it with Ctrl+C when you are satisfied it works.']
          ],
          commands: [
            ['Script contents — paste into blink.py', 'from gpiozero import LED\nfrom time import sleep\n\nled = LED(17)\nwhile True:\n    led.on()\n    sleep(1)\n    led.off()\n    sleep(1)', 'Replace 17 with your LED’s actual GPIO number if different.'],
            ['Run the script', 'python3 blink.py', 'The LED turns on and off once per second. Stop it with Ctrl+C.']
          ],
          check: { q: 'In gpiozero, LED(17) refers to which numbering scheme?', options: ['BCM GPIO number 17, not physical pin 17', 'The 17th physical pin on the header', 'A voltage of 17 millivolts'], answer: 0, why: 'gpiozero addresses pins by their BCM GPIO number, which is why the pinout command matters — it shows both numbering schemes.' },
          success: 'blink.py runs and the LED blinks on a clear 1-second cycle until you stop it.',
          troubleshoot: [
            ['The LED never lights', 'Power down and check LED polarity (the longer leg is the anode/positive side) and that the GPIO number in the script matches the pin you actually wired.'],
            ['"Permission denied" or a pin-busy error appears', 'Confirm no other script or process is already using that GPIO pin, and that you are running the script as the account created during Foundation, not a different user without GPIO group access.']
          ]
        },
        {
          title: 'Add a pushbutton input',
          time: '15 min',
          kind: 'diagram',
          diagram: 'gpio-button',
          goal: 'Read a physical button press safely, using the Pi’s internal pull-up resistor.',
          actions: [
            ['Power down, then wire a pushbutton between a GPIO pin and GND', 'gpiozero’s Button class uses the Pi’s internal pull-up resistor by default, so no external resistor is required for a basic button.'],
            ['Write a short script that waits for a press', 'Use a different GPIO number than your LED so the two circuits do not conflict.'],
            ['Test the button in isolation before combining it with the LED', 'Confirm it reliably detects a press before adding more complexity.']
          ],
          commands: [
            ['Script contents — paste into button_test.py', 'from gpiozero import Button\n\nbutton = Button(2)\nprint("Waiting for a press...")\nbutton.wait_for_press()\nprint("Pressed!")', 'Replace 2 with your button’s actual GPIO number if different.'],
            ['Run the script', 'python3 button_test.py', 'The script prints "Pressed!" the moment you press the button, then exits.']
          ],
          check: { q: 'Why doesn’t this button circuit need an external resistor?', options: ['gpiozero’s Button class enables the Pi’s internal pull-up resistor by default', 'Buttons never need resistors', 'The resistor is built into the button itself'], answer: 0, why: 'The Pi’s GPIO controller has configurable internal pull-up/pull-down resistors, and gpiozero enables the pull-up by default for Button.' },
          success: 'Pressing the button reliably prints "Pressed!" every time, with no false triggers.'
        },
        {
          title: 'Combine input and output into one program',
          time: '15 min',
          kind: 'diagram',
          diagram: 'gpio-combo',
          goal: 'Use a button press to control an LED, proving you can combine input and output in a single script.',
          actions: [
            ['Keep both circuits wired from the previous two lessons', 'Do not rewire — you are combining the scripts, not the circuits.'],
            ['Write a script where each button press toggles the LED', 'Use a loop that waits for a press, then flips the LED state.'],
            ['Run it and confirm the LED state changes on every press', 'This is your first complete input-to-output program.']
          ],
          commands: [
            ['Script contents — paste into toggle.py', 'from gpiozero import LED, Button\n\nled = LED(17)\nbutton = Button(2)\n\nwhile True:\n    button.wait_for_press()\n    led.toggle()', 'Replace 17 and 2 with your actual GPIO numbers if different.'],
            ['Run the script', 'python3 toggle.py', 'Each button press turns the LED on if it was off, or off if it was on.']
          ],
          check: { q: 'What does led.toggle() do?', options: ['Switches the LED to the opposite of its current state', 'Always turns the LED on', 'Blinks the LED once'], answer: 0, why: 'toggle() flips the LED’s current state, which is why one press turns it on and the next press turns it off.' },
          success: 'Every button press reliably flips the LED between on and off, with no missed or double presses.'
        }
      ]
    },
    {
      id: 'pomodoro',
      status: 'ready',
      icon: '04',
      title: 'Pomodoro Station',
      short: 'A physical focus timer with a start button and status LED that runs itself at boot.',
      duration: '75–100 min',
      level: 'Electronics Lab required',
      source: 'gpiozero documentation · systemd unit documentation (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Electronics Lab', 'a breadboard', 'a momentary pushbutton', 'an LED and resistor (or a small buzzer)'],
      safety: ['Power down before wiring or rewiring the breadboard.', 'Test any new timer duration at a shortened, accelerated interval before trusting it with real focus time.'],
      links: [
        ['Official: gpiozero documentation', 'https://gpiozero.readthedocs.io/'],
        ['Official: systemd.service unit documentation', 'https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html']
      ],
      lessons: [
        {
          title: 'Plan the Pomodoro cycle',
          time: '10 min',
          kind: 'diagram',
          diagram: 'pomodoro-plan',
          goal: 'Decide the work and break durations before you write any code.',
          actions: [
            ['Choose your work and break lengths', 'The classic Pomodoro pattern is 25 minutes of work and 5 minutes of break — start there and adjust later.'],
            ['Decide what the LED (or buzzer) should do at each stage', 'For example: solid on during work, blinking during break, off when idle.'],
            ['Reuse the button and LED wiring from Electronics Lab', 'No new wiring is required if that circuit is still connected.']
          ],
          check: { q: 'Why test with a short accelerated duration before using real times?', options: ['To confirm the logic works without waiting 25 real minutes per test', 'It is required by gpiozero', 'It saves electricity'], answer: 0, why: 'Verifying behavior with seconds instead of minutes catches logic mistakes in minutes instead of hours.' },
          success: 'You have a clear work/break plan and the LED and button are wired.'
        },
        {
          title: 'Write the Pomodoro timer script',
          time: '20 min',
          kind: 'diagram',
          diagram: 'pomodoro-script',
          goal: 'Build a script that runs one full work-then-break cycle each time the button is pressed.',
          actions: [
            ['Create pomodoro.py', 'Base it on the button-and-LED pattern from Electronics Lab.'],
            ['Have the LED turn solid on during work, then blink during break', 'gpiozero’s LED.blink() method handles the blinking pattern for you.'],
            ['Return to waiting for the next press after each cycle finishes', 'The script should run continuously, not exit after one cycle.']
          ],
          commands: [
            ['Script contents — paste into pomodoro.py', 'from gpiozero import Button, LED\nfrom time import sleep\n\nbutton = Button(2)\nled = LED(17)\nWORK_MIN = 25\nBREAK_MIN = 5\n\ndef run_cycle():\n    led.on()\n    sleep(WORK_MIN * 60)\n    led.blink(0.5, 0.5, n=10)\n    sleep(BREAK_MIN * 60)\n    led.off()\n\nwhile True:\n    button.wait_for_press()\n    run_cycle()', 'Replace 17 and 2 with your actual GPIO numbers if different.']
          ],
          check: { q: 'What does led.blink(0.5, 0.5, n=10) do?', options: ['Blinks the LED 10 times, on and off for half a second each', 'Turns the LED on for 10 seconds', 'Sets the LED brightness to 50%'], answer: 0, why: 'gpiozero’s blink() takes on-time, off-time, and a repeat count — here, 10 half-second on/off cycles.' },
          success: 'pomodoro.py contains a complete, saved script with your correct GPIO numbers.'
        },
        {
          title: 'Test a full cycle at accelerated speed',
          time: '10 min',
          kind: 'diagram',
          diagram: 'pomodoro-test',
          goal: 'Prove the logic works before trusting it with real work time.',
          actions: [
            ['Temporarily change WORK_MIN and BREAK_MIN to small fractions', 'For example, set WORK_MIN = 0.1 (6 seconds) to test quickly.'],
            ['Run the script and press the button', 'Confirm the LED turns solid on, then blinks, then turns off, in the right order.'],
            ['Restore the real durations before continuing', 'Do not skip this — an accelerated test left in place will not function as a real timer.']
          ],
          commands: [
            ['Run the script for testing', 'python3 pomodoro.py', 'Press the button; the LED should visibly change state through the accelerated cycle.']
          ],
          check: { q: 'What must you do after an accelerated test succeeds?', options: ['Restore WORK_MIN and BREAK_MIN to their real values', 'Immediately install it as a boot service', 'Delete the script and rewrite it'], answer: 0, why: 'The accelerated values exist only to test logic quickly; leaving them in place would make the timer useless for real focus sessions.' },
          success: 'The LED visibly moves through work → break → off in the correct order, and the real durations are restored.'
        },
        {
          title: 'Autostart the Pomodoro script at boot',
          time: '25 min',
          kind: 'diagram',
          diagram: 'pomodoro-service',
          goal: 'Make the timer available immediately after every boot, without opening a terminal.',
          actions: [
            ['Create a systemd service file', 'This is the standard Linux mechanism for running a background program automatically and restarting it if it crashes.'],
            ['Point the service at your script’s real path and your username', 'A wrong path or username is the most common reason a new service fails silently.'],
            ['Enable and start the service, then confirm its status', 'Check status before assuming it works — a service can be enabled but still failing.']
          ],
          commands: [
            ['Service file contents — paste into /etc/systemd/system/pomodoro.service using sudo nano', '[Unit]\nDescription=Pomodoro Station\nAfter=multi-user.target\n\n[Service]\nExecStart=/usr/bin/python3 /home/<username>/pomodoro.py\nRestart=on-failure\nUser=<username>\n\n[Install]\nWantedBy=multi-user.target', 'Replace <username> with your actual account name in both places.'],
            ['Reload systemd so it sees the new file', 'sudo systemctl daemon-reload', 'No output means it succeeded.'],
            ['Enable the service to start at every boot', 'sudo systemctl enable pomodoro.service', 'systemd confirms a symlink was created.'],
            ['Start it now without rebooting', 'sudo systemctl start pomodoro.service', 'No output means it succeeded.'],
            ['Confirm it is running', 'sudo systemctl status pomodoro.service', 'The status shows active (running).']
          ],
          check: { q: 'What is the most common reason a new systemd service fails silently?', options: ['A wrong file path or username in ExecStart/User', 'Running sudo systemctl daemon-reload', 'Using Restart=on-failure'], answer: 0, why: 'systemd runs ExecStart exactly as written — a typo in the path or username causes it to fail without any obvious error on screen.' },
          success: 'sudo systemctl status pomodoro.service shows active (running), and the service survives a full reboot.',
          troubleshoot: [
            ['systemctl status shows "failed" or "inactive"', 'Run sudo journalctl -u pomodoro.service to see the real error — a wrong ExecStart path or username is the most common cause.'],
            ['The service runs but nothing seems to happen', 'Confirm the GPIO wiring is still connected exactly as it was during manual testing; a service restart does not fix a loose breadboard connection.']
          ]
        }
      ]
    },
    {
      id: 'photo-frame',
      status: 'ready',
      icon: '05',
      title: 'Digital Photo Frame',
      short: 'Turn a spare display into a fullscreen slideshow that starts itself at boot.',
      duration: '45–70 min',
      level: 'Foundation required',
      source: 'feh manual (reviewed 2026-08-25) · freedesktop.org autostart specification (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'an HDMI or DSI display', 'a folder of your own photos', 'a stand or frame for the display'],
      safety: ['Never place private or sensitive photos in a folder that syncs to a shared or public location.', 'Power down before changing display connections.'],
      links: [
        ['feh manual', 'https://feh.finalrewind.org/'],
        ['freedesktop.org: Desktop Application Autostart Specification', 'https://specifications.freedesktop.org/autostart-spec/autostart-spec-latest.html']
      ],
      lessons: [
        {
          title: 'Prepare your photo library',
          time: '15 min',
          kind: 'diagram',
          diagram: 'frame-prepare',
          goal: 'Get your own photos onto the Pi in a dedicated folder before installing any slideshow software.',
          actions: [
            ['Create a dedicated folder for the slideshow', 'Keep it separate from other files so the slideshow never displays something unintended.'],
            ['Copy photos from your other computer over SSH', 'Reuse the SSH connection you proved in Foundation — this avoids removing the microSD card again.'],
            ['Confirm the photos copied correctly', 'List the folder contents before moving on.']
          ],
          commands: [
            ['Create the folder (run on the Pi)', 'mkdir -p ~/Pictures/frame', 'No output means it succeeded.'],
            ['Copy photos from your other computer (run on that computer, not the Pi)', 'scp *.jpg <username>@<hostname>.local:~/Pictures/frame/', 'Replace the placeholders. Each file uploads with a progress indicator.'],
            ['Confirm the files arrived (run on the Pi)', 'ls ~/Pictures/frame', 'Your photo filenames are listed.']
          ],
          check: { q: 'Why copy photos over SSH instead of removing the microSD card again?', options: ['It reuses the network connection you already proved in Foundation, with no card removal risk', 'SSH is required by feh', 'It compresses the photos automatically'], answer: 0, why: 'You already proved SSH works in Foundation; reusing it avoids repeating the higher-risk step of removing and reinserting the microSD card.' },
          success: 'Your chosen photos are visible in ~/Pictures/frame on the Pi.'
        },
        {
          title: 'Install feh',
          time: '10 min',
          kind: 'diagram',
          diagram: 'frame-install',
          goal: 'Install the lightweight image viewer that will run the slideshow.',
          actions: [
            ['Refresh package information', 'Do this before installing anything new.'],
            ['Install feh', 'feh is a small, scriptable image viewer well suited to a dedicated slideshow.'],
            ['Confirm it installed', 'Check its version before trying to use it.']
          ],
          commands: [
            ['Refresh package information', 'sudo apt update', 'The command finishes without a network or repository error.'],
            ['Install feh', 'sudo apt install -y feh', 'feh installs without error.'],
            ['Confirm the installed version', 'feh --version', 'A version number is printed.']
          ],
          check: { q: 'What is feh?', options: ['A lightweight, scriptable image viewer', 'A photo-editing suite', 'A cloud photo backup service'], answer: 0, why: 'feh is intentionally minimal, which is exactly what a dedicated slideshow needs — no unnecessary interface to work around.' },
          success: 'feh --version prints a version number with no error.'
        },
        {
          title: 'Run and test a fullscreen slideshow',
          time: '10 min',
          kind: 'diagram',
          diagram: 'frame-slideshow',
          goal: 'Confirm the slideshow displays correctly before making it start automatically.',
          actions: [
            ['Run feh against your photo folder with fullscreen, auto-zoom, a delay, hidden pointer, and randomized order', 'Each flag controls one behavior — test them together before automating anything.'],
            ['Watch a full cycle through your photos', 'Confirm images are not stretched or cropped in a way you dislike.'],
            ['Stop it with Escape before continuing', 'You will start it automatically in the next lesson.']
          ],
          commands: [
            ['Run a fullscreen, randomized slideshow', 'feh -F -Z -D 10 -Y -z ~/Pictures/frame', 'Photos fill the screen, auto-fit to the display, advance every 10 seconds, in random order, with the mouse pointer hidden.']
          ],
          check: { q: 'What does the -Z flag do?', options: ['Auto-zooms each image to fit the screen while keeping its aspect ratio', 'Randomizes the photo order', 'Sets the delay between photos'], answer: 0, why: '-Z (--auto-zoom) fits each image to the display without distorting its proportions.' },
          success: 'The slideshow cycles through your photos fullscreen, correctly scaled, with no mouse pointer visible.'
        },
        {
          title: 'Autostart the slideshow at boot',
          time: '15 min',
          kind: 'diagram',
          diagram: 'frame-autostart',
          goal: 'Make the slideshow appear automatically after every boot, with no terminal command needed.',
          actions: [
            ['Create the autostart folder if it does not already exist', 'This is the standard, desktop-environment-independent way to launch a graphical app at login.'],
            ['Create a .desktop autostart entry pointing at your feh command', 'This method works whether your desktop is running X11 or Wayland, and survives Raspberry Pi OS changing its default compositor.'],
            ['Reboot and confirm the slideshow appears with no manual steps', 'This proves the autostart chain end-to-end.']
          ],
          commands: [
            ['Create the autostart folder', 'mkdir -p ~/.config/autostart', 'No output means it succeeded.'],
            ['Autostart entry contents — paste into ~/.config/autostart/photoframe.desktop', '[Desktop Entry]\nType=Application\nName=Digital Photo Frame\nExec=feh -F -Z -D 10 -Y -z /home/<username>/Pictures/frame\nX-GNOME-Autostart-enabled=true', 'Replace <username> with your actual account name.']
          ],
          check: { q: 'Why use a .desktop autostart file instead of a compositor-specific config file?', options: ['It follows a standard that works across X11 and Wayland, and survives Raspberry Pi OS changing its default desktop compositor', 'It runs faster than any other method', 'feh requires this specific format to run at all'], answer: 0, why: 'Raspberry Pi OS has changed its default graphical compositor across releases; the XDG .desktop autostart standard is not tied to any one of them.' },
          success: 'After a full reboot with no keyboard input, the slideshow appears automatically in fullscreen.',
          troubleshoot: [
            ['The slideshow does not appear after reboot', 'Confirm Raspberry Pi OS is set to boot to desktop with auto-login — a .desktop autostart entry only runs once someone (or auto-login) reaches the desktop session.'],
            ['Photos appear stretched or the wrong aspect ratio', 'Confirm -Z is present in the command; without it, feh may not preserve the original aspect ratio on every display.']
          ]
        }
      ]
    },
    {
      id: 'desk-info',
      status: 'ready',
      icon: '06',
      title: 'Desk Info Center',
      short: 'An open, glanceable MagicMirror² display for a desk or shelf — no mirror glass required.',
      duration: '2–3 hr',
      level: 'Foundation required',
      source: 'MagicMirror² Documentation · Installation and autostart guides (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'a DSI or HDMI display', 'a stand, mount, or enclosure for the open display (no mirror sheet needed)'],
      safety: ['Disconnect USB-C power before connecting or disconnecting a DSI ribbon.', 'Keep display vents and Pi ventilation uncovered in any enclosure you build.'],
      links: [
        ['Official: MagicMirror² installation guide', 'https://docs.magicmirror.builders/getting-started/installation.html'],
        ['Official: MagicMirror² autostart guide', 'https://docs.magicmirror.builders/configuration/autostart.html']
      ],
      lessons: [
        {
          title: 'Choose an open display setup',
          time: '15 min',
          kind: 'diagram',
          diagram: 'desk-plan',
          goal: 'Decide how the display will stand or mount, since there is no mirror sheet to hide the bezel this time.',
          actions: [
            ['Choose a stand, wall mount, or simple enclosure', 'Unlike Smart Mirror, the display itself is visible, so cable routing and edge finish matter more.'],
            ['Confirm the display’s native resolution and connector', 'Check its own documentation rather than guessing.'],
            ['Plan cable routing before connecting anything', 'Decide where power and any ribbon cable will run before you mount the display.']
          ],
          check: { q: 'What is the main physical difference from Smart Mirror?', options: ['The display itself is visible, so there is no mirror sheet to hide behind', 'It requires a different Raspberry Pi model', 'It cannot run MagicMirror²'], answer: 0, why: 'Smart Mirror hides the display behind a two-way mirror; Desk Info Center shows the display openly, which is a simpler build but a more visible one.' },
          success: 'You have a stand or mount chosen and know the display’s native resolution.'
        },
        {
          title: 'Install MagicMirror²',
          time: '45–75 min',
          kind: 'diagram',
          diagram: 'software-test',
          goal: 'Install and prove the official MagicMirror² software before mounting anything.',
          actions: [
            ['Confirm prerequisites, then clone the official repository', 'Check git and Node.js first. Automated one-line installers were retired by the project in 2020 — only the manual, git-based install below is currently supported.'],
            ['Run the official installer, then create your config file', 'The installer is slow and produces little output — let it finish without interrupting it.'],
            ['Start MagicMirror² and confirm it survives a restart', 'Watch the default clock-and-calendar layout render, then stop and start it again.']
          ],
          commands: [
            ['Confirm git and Node.js are installed', 'git --version && node -v', 'Both print version numbers. Compare the Node.js version against the "required" version linked from the MagicMirror² releases page.'],
            ['Clone the official MagicMirror² repository', 'git clone https://github.com/MagicMirrorOrg/MagicMirror.git', 'A new MagicMirror folder is created in your home directory.'],
            ['Run the official installer', 'cd ~/MagicMirror && node --run install-mm', 'This can take 10–25 minutes on a Raspberry Pi with little terminal output.'],
            ['Create your local configuration file', 'cd ~/MagicMirror && cp config/config.js.sample config/config.js', 'A new config.js file appears in the config folder.'],
            ['Start MagicMirror²', 'cd ~/MagicMirror && node --run start', 'The default MagicMirror² display opens.']
          ],
          links: [
            ['Official: MagicMirror² installation guide', 'https://docs.magicmirror.builders/getting-started/installation.html'],
            ['Official: MagicMirror² supported Node.js versions', 'https://github.com/MagicMirrorOrg/MagicMirror/releases']
          ],
          check: { q: 'Why is only the manual git-based install currently supported?', options: ['The project retired its automated one-line installers in 2020', 'MagicMirror² does not support Raspberry Pi', 'npm no longer works on Raspberry Pi OS'], answer: 0, why: 'The MagicMirror² team removed the automated installers in 2020; community alternatives exist but are unsupported.' },
          success: 'The default MagicMirror² display works and survives a restart.',
          troubleshoot: [
            ['node --run install-mm fails, or a module error appears when starting', 'Check your Node.js version against the "required" version linked from the MagicMirror² releases page — a mismatch is the most common cause.'],
            ['The window never opens', 'Confirm the display is detected before starting MagicMirror², and try node --run start:dev for more detailed error output.']
          ]
        },
        {
          title: 'Configure modules for an open display',
          time: '25–35 min',
          kind: 'diagram',
          diagram: 'desk-config',
          goal: 'Set resolution, orientation, and a module layout suited to a glanceable, always-visible screen.',
          actions: [
            ['Confirm your display’s native resolution and refresh rate', 'Set Raspberry Pi OS and MagicMirror² to match it.'],
            ['Set rotation to match how the display will actually sit', 'Portrait or landscape, decided by your stand or mount, not by the default.'],
            ['Open ~/MagicMirror/config/config.js and choose modules', 'An open display can show more modules than a mirror can, since there is no reflective glass reducing contrast — but keep it uncluttered for a glance-friendly result.'],
            ['Restart and confirm the layout on the real display', 'Check it from your actual desk or shelf viewing distance.']
          ],
          commands: [
            ['Restart MagicMirror² after editing config.js', 'cd ~/MagicMirror && node --run start', 'The updated layout renders at the display’s native resolution and orientation.']
          ],
          check: { q: 'Why can an open Desk Info Center display show more modules than the Smart Mirror can?', options: ['There is no reflective two-way mirror layer reducing visible contrast', 'It uses a faster Raspberry Pi model', 'MagicMirror² has a different mode for open displays'], answer: 0, why: 'A two-way mirror sheet reduces the effective contrast and brightness a viewer sees, which is why Smart Mirror favors sparse, high-contrast layouts.' },
          success: 'The display shows the intended layout, correctly oriented, at native resolution.'
        },
        {
          title: 'Autostart MagicMirror² on boot',
          time: '20–30 min',
          kind: 'diagram',
          diagram: 'mirror-autostart',
          goal: 'Make MagicMirror² start itself after every boot using the project’s own recommended process manager.',
          actions: [
            ['Install PM2, the process manager MagicMirror² officially recommends', 'PM2 restarts MagicMirror² automatically if it crashes and keeps it running across reboots.'],
            ['Create a short launch script for PM2 to run', 'A boot-time process does not automatically have a display attached, so the script points Electron at one explicitly.'],
            ['Start MagicMirror² under PM2, save the process list, and enable startup', 'All three steps are required — skipping pm2 save or the printed startup command means it will not survive a reboot.'],
            ['Reboot and confirm it appears with no manual steps']
          ],
          commands: [
            ['Install PM2 globally', 'sudo npm install -g pm2', 'PM2 installs without error.'],
            ['Generate your startup command', 'pm2 startup', 'PM2 prints a sudo env ... command tailored to your system. Copy it exactly and run it once.'],
            ['Launch script contents — paste into mm.sh (created with: cd ~ && nano mm.sh)', 'cd ./MagicMirror\nDISPLAY=:0 node --run start', 'Save with Ctrl+O, Enter, Ctrl+X.'],
            ['Make the script executable', 'chmod +x mm.sh', 'No output means it succeeded.'],
            ['Start MagicMirror² under PM2', 'pm2 start mm.sh', 'PM2 reports the process as online.'],
            ['Save the process list', 'pm2 save', 'PM2 confirms the process list was saved.']
          ],
          links: [['Official: MagicMirror² autostart guide', 'https://docs.magicmirror.builders/configuration/autostart.html']],
          check: { q: 'What two steps are both required for MagicMirror² to survive a reboot under PM2?', options: ['Running the printed pm2 startup command, and pm2 save', 'Only pm2 start', 'Only installing PM2'], answer: 0, why: 'pm2 startup registers PM2 itself with systemd, and pm2 save records which processes PM2 should restore — skipping either one breaks the chain.' },
          success: 'After a full reboot with no keyboard input, MagicMirror² appears automatically.',
          troubleshoot: [
            ['pm2 startup prints a command but nothing happens after reboot', 'You must copy and run the exact command PM2 printed before pm2 save takes effect.'],
            ['MagicMirror² starts under PM2 but the display stays blank', 'Confirm DISPLAY=:0 matches your actual session and that auto-login to the desktop is enabled.']
          ]
        },
        {
          title: 'Mount, secure, and validate',
          time: '30–45 min',
          kind: 'diagram',
          diagram: 'desk-validate',
          goal: 'Finish the physical build and prove it is stable before relying on it daily.',
          actions: [
            ['Mount the display on its stand or enclosure with cable slack and open vents', 'Support only rigid edges or manufacturer-approved mounting points.'],
            ['Run a supervised 30-minute test', 'Observe stability, Wi-Fi, and temperature before calling it done.'],
            ['Perform two full cold boots', 'Each should show the correct layout with no manual intervention.'],
            ['Record a non-secret recovery note', 'Cable path, mounting method, and how to reach the Pi — never passwords or Wi-Fi credentials.']
          ],
          commands: [
            ['Check Raspberry Pi temperature after the test', 'vcgencmd measure_temp', 'A temperature reading is returned.']
          ],
          check: { q: 'What must a Desk Info Center pass before you consider it finished?', options: ['A supervised thermal test and two repeatable cold boots', 'One successful manual start', 'A cover photo of the finished build'], answer: 0, why: 'The same reliability bar applies as any always-on Pi display: it must survive a real test run and repeatable cold starts.' },
          success: 'The display runs stably for 30 minutes, reports a reasonable temperature, and cold-boots correctly twice.'
        }
      ]
    },
    {
      id: 'home-assistant',
      status: 'ready',
      icon: '07',
      title: 'Home Assistant Panel',
      short: 'Install Home Assistant OS and build a dedicated wall or desk panel for it.',
      duration: '2–3 hr',
      level: 'New to Pi (uses Foundation’s Imager skills)',
      source: 'Home Assistant Documentation · Raspberry Pi installation guide (reviewed 2026-08-25)',
      cover: null,
      materials: ['Raspberry Pi 5 with at least 2GB RAM', 'a microSD card, 32GB or larger', 'a stand or mount for a dedicated panel display (optional)'],
      safety: ['Home Assistant OS uses its own operating system image — do not write it over a card you still need for Raspberry Pi OS without backing it up first.', 'Never expose Home Assistant directly to the internet without understanding remote-access security; use it locally on your home network for this lab.'],
      links: [
        ['Official: Home Assistant on Raspberry Pi', 'https://www.home-assistant.io/installation/raspberrypi/'],
        ['Official: Home Assistant onboarding', 'https://www.home-assistant.io/getting-started/onboarding/']
      ],
      lessons: [
        {
          title: 'Choose and image Home Assistant OS',
          time: '30–40 min',
          kind: 'diagram',
          diagram: 'ha-image',
          goal: 'Write Home Assistant OS to a microSD card using the same Imager skills from Foundation.',
          actions: [
            ['Open Raspberry Pi Imager', 'This is the same tool from Foundation — Home Assistant OS is one of its listed operating systems.'],
            ['Choose OS → Other specific-purpose OS → Home automation → Home Assistant', 'Select the Home Assistant OS build that matches your Pi model.'],
            ['Choose your microSD card as Storage and recheck it', 'Writing erases the card, exactly as it did during Foundation.'],
            ['Write and verify, then move the card to the powered-off Pi']
          ],
          check: { q: 'Where is Home Assistant OS found in Raspberry Pi Imager?', options: ['Other specific-purpose OS → Home automation → Home Assistant', 'Raspberry Pi OS (Desktop)', 'It must be downloaded separately and cannot be written with Imager'], answer: 0, why: 'Home Assistant OS is officially listed inside Raspberry Pi Imager’s OS picker, using the same tool taught in Foundation.' },
          success: 'Home Assistant OS is written and verified, and the card is seated in the powered-off Pi.'
        },
        {
          title: 'First boot and onboarding',
          time: '20–30 min',
          kind: 'diagram',
          diagram: 'ha-onboard',
          goal: 'Boot Home Assistant OS and complete first-time setup from a browser on another device.',
          actions: [
            ['Connect Ethernet if possible for the first boot', 'A wired connection avoids needing to configure Wi-Fi before you can reach the web interface.'],
            ['Connect power and wait several minutes', 'Home Assistant OS prepares itself on first boot, which takes longer than a normal Raspberry Pi OS boot.'],
            ['Open the onboarding page from another device on the same network', 'Complete the account, location, and unit setup steps shown there.']
          ],
          commands: [
            ['Open onboarding from a browser on another device', 'http://homeassistant.local:8123/', 'The Home Assistant "Preparing Home Assistant" page appears, followed by onboarding once it finishes.']
          ],
          check: { q: 'Why is a first Home Assistant OS boot slower than a Raspberry Pi OS boot?', options: ['Home Assistant OS prepares its full application environment on first boot', 'The microSD card is defective', 'It is downloading Raspberry Pi OS in the background'], answer: 0, why: 'Home Assistant OS performs first-run setup work before its web interface becomes reachable, which takes noticeably longer than a standard desktop boot.' },
          success: 'The onboarding wizard completes and you can reach the Home Assistant dashboard.',
          troubleshoot: [
            ['homeassistant.local:8123 does not resolve', 'Some networks do not support .local name resolution. Find the Pi’s IP address from your router’s connected-devices list and use http://<ip-address>:8123/ instead.'],
            ['The page never finishes "Preparing Home Assistant"', 'Give it several more minutes on a first boot; if it truly never completes, reconnect a display to the Pi to check for an error, or re-verify the card write.']
          ]
        },
        {
          title: 'Build a dedicated panel dashboard',
          time: '30–45 min',
          kind: 'diagram',
          diagram: 'ha-dashboard',
          goal: 'Design a simple dashboard suited to a wall or desk panel rather than a phone screen.',
          actions: [
            ['Open the dashboard editor', 'Home Assistant’s Lovelace dashboard is fully editable from the web interface — no file editing required.'],
            ['Favor large, glanceable cards over dense detail', 'A wall panel is viewed briefly and often from a distance, unlike a phone.'],
            ['Add only the entities you actually check often', 'Start small; you can always add more once the panel earns its place.']
          ],
          check: { q: 'Why should a panel dashboard favor large, glanceable cards?', options: ['A wall or desk panel is typically viewed briefly and from a distance', 'Small cards load faster', 'Home Assistant requires large cards on Raspberry Pi'], answer: 0, why: 'A panel is used differently than a phone app — it needs to be readable from across a room in a few seconds.' },
          success: 'A dashboard exists with a small number of large, glanceable cards for the entities you check most.'
        },
        {
          title: 'Turn a display into a wall or desk panel',
          time: '30–45 min',
          kind: 'diagram',
          diagram: 'ha-panel',
          goal: 'Show the dashboard fullscreen on a dedicated display, without needing a browser bar or keyboard.',
          actions: [
            ['Decide which device will run the physical panel', 'This can be a second Pi running a fullscreen browser pointed at this Home Assistant instance, a tablet, or any device with a modern browser.'],
            ['Open the dashboard fullscreen in kiosk mode', 'Most modern browsers support a kiosk or fullscreen command-line flag that hides all browser chrome.'],
            ['Mount or stand the panel in its final location', 'Route any cables with slack and keep ventilation clear.']
          ],
          check: { q: 'What is the practical difference between "Home Assistant" and a "Home Assistant panel" in this lab?', options: ['Home Assistant is the server you set up in earlier lessons; the panel is a display device that shows its dashboard fullscreen', 'They are two names for the same software', 'A panel requires a second, separate Home Assistant installation'], answer: 0, why: 'The panel device does not need to run Home Assistant itself — it only needs a browser that can reach the dashboard you already built.' },
          success: 'The dashboard displays fullscreen on the panel device with no visible browser interface.'
        }
      ]
    },
    {
      id: 'ai-terminal',
      status: 'ready',
      icon: '08',
      title: 'Mini AI Terminal',
      short: 'Run a small local language model on your Pi 5, with no cloud account required.',
      duration: '60–90 min',
      level: 'Foundation required',
      source: 'Ollama documentation (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation (8GB RAM recommended)', 'a 64-bit Raspberry Pi OS install', 'a case with adequate cooling for sustained CPU load'],
      safety: ['Running a model uses sustained high CPU load — confirm your case has adequate cooling before long sessions.', 'A locally run model can still produce incorrect or misleading output; verify anything safety-critical against another source.'],
      links: [
        ['Official: Ollama', 'https://ollama.com/'],
        ['Official: Ollama Linux install script', 'https://ollama.com/download/linux']
      ],
      lessons: [
        {
          title: 'Confirm your Pi is ready for a local model',
          time: '10 min',
          kind: 'diagram',
          diagram: 'ai-check',
          goal: 'Verify the one hard requirement before installing anything.',
          actions: [
            ['Confirm you are running a 64-bit operating system', 'Ollama requires a 64-bit (ARM64/aarch64) OS; a 32-bit Raspberry Pi OS install cannot run it.'],
            ['Confirm your Pi has at least 8GB of RAM for comfortable use', 'Smaller models can run on less, but 8GB gives you more headroom.']
          ],
          commands: [
            ['Confirm a 64-bit kernel', 'uname -m', 'Expected result: aarch64. If this prints armv7l instead, your OS is 32-bit and is not supported.']
          ],
          check: { q: 'What is the one hard requirement for running Ollama on a Pi?', options: ['A 64-bit (ARM64) operating system', 'A GPU', 'An internet connection at all times'], answer: 0, why: 'Ollama ships ARM64 Linux builds; a 32-bit Raspberry Pi OS install is not supported.' },
          success: 'uname -m reports aarch64.'
        },
        {
          title: 'Install Ollama',
          time: '15 min',
          kind: 'diagram',
          diagram: 'ai-install',
          goal: 'Install the official Ollama runtime using its supported Linux installer.',
          actions: [
            ['Run the official install script', 'This detects your ARM64 architecture, installs the Ollama binary, and sets up a systemd service automatically.'],
            ['Confirm the service is running', 'The installer sets this up for you — verify it rather than assuming.'],
            ['Confirm the CLI responds', 'A simple version check confirms the install completed correctly.']
          ],
          commands: [
            ['Run the official installer', 'curl -fsSL https://ollama.com/install.sh | sh', 'The script downloads Ollama, installs it, and starts its systemd service.'],
            ['Confirm the service is active', 'sudo systemctl is-active ollama', 'Expected result: active.'],
            ['Confirm the CLI works', 'ollama --version', 'A version number is printed.']
          ],
          check: { q: 'What does the official Ollama install script set up automatically?', options: ['The Ollama binary and a systemd service to run it', 'A graphical desktop application', 'A cloud account'], answer: 0, why: 'The installer places the binary, creates a system user, and configures a systemd service so Ollama runs as a background service.' },
          success: 'ollama --version prints a version number and the ollama systemd service is active.'
        },
        {
          title: 'Pull and run a small model',
          time: '20–30 min',
          kind: 'diagram',
          diagram: 'ai-model',
          goal: 'Download a model small enough to run responsively on a Pi, and have a first conversation with it.',
          actions: [
            ['Pull a small model first', 'Start with a 1-billion-parameter class model — large models can be too slow to be usable on a Pi.'],
            ['Run it interactively from the terminal', 'This opens a simple back-and-forth chat session, entirely local.'],
            ['Set realistic expectations for response speed', 'A Pi 5 generates text far slower than a cloud service; short prompts and patience work best.']
          ],
          commands: [
            ['Pull a small, Pi-friendly model', 'ollama pull llama3.2:1b', 'The model downloads; size and time depend on your network connection.'],
            ['Start an interactive chat', 'ollama run llama3.2:1b', 'A prompt appears where you can type messages; type /bye to exit.']
          ],
          check: { q: 'Why start with a 1-billion-parameter model instead of a larger one?', options: ['Larger models can be too slow to be usable on a Pi’s hardware', 'Small models are more accurate', 'Ollama only supports models under 1 billion parameters'], answer: 0, why: 'Model size directly affects response speed on limited hardware; starting small confirms the setup works before you try something heavier.' },
          success: 'ollama run llama3.2:1b opens a working chat prompt and responds to a message, even if slowly.',
          troubleshoot: [
            ['The response takes a very long time or the Pi becomes unresponsive', 'This is expected for larger models on a Pi. Exit with /bye, try a smaller model, and close other running programs to free RAM.'],
            ['ollama pull fails partway through', 'Check your network connection and available storage space (df -h), then re-run the same pull command — it resumes rather than restarting from zero.']
          ]
        },
        {
          title: 'Build a simple terminal chat routine',
          time: '15 min',
          kind: 'diagram',
          diagram: 'ai-routine',
          goal: 'Turn the model into a quick-access terminal tool rather than a one-off experiment.',
          actions: [
            ['Confirm the model responds correctly to a few real questions', 'Judge it honestly — small local models are noticeably less capable than large cloud models.'],
            ['Decide on your everyday exit habit', 'Always exit cleanly with /bye rather than closing the terminal window, so Ollama can free memory properly.'],
            ['Note which tasks it is actually useful for', 'Small local models tend to help most with short, well-scoped tasks, not long or highly technical ones.']
          ],
          check: { q: 'What should you expect from a small local model compared to a large cloud-based one?', options: ['Noticeably less capability, in exchange for running fully offline and locally', 'Identical quality, just slower', 'Better accuracy on all tasks'], answer: 0, why: 'Small quantized models trade capability for size and speed; being realistic about this avoids frustration and misuse for tasks they are not suited to.' },
          success: 'You can start, use, and cleanly exit a local chat session, and you have a realistic sense of what it is good for.'
        }
      ]
    },
    {
      id: 'cyberdeck',
      status: 'ready',
      icon: '09',
      title: 'Portable Cyberdeck',
      short: 'A battery-powered, keyboard-equipped Pi you can use unplugged.',
      duration: '2–3 hr',
      level: 'Foundation required',
      source: 'PiSugar documentation (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'a PiSugar (or similar) battery pack sized for your Pi model', 'a small display', 'a portable keyboard (Bluetooth or USB)', 'a case or enclosure that fits the battery pack'],
      safety: ['Confirm your battery pack model is rated for your exact Pi model before assembling — battery HATs are not universally interchangeable across Pi versions.', 'Never charge a lithium battery pack unattended overnight during initial testing.', 'Power down before assembling or disassembling the battery HAT stack.'],
      links: [
        ['Official: PiSugar Power Manager', 'https://github.com/PiSugar/pisugar-power-manager-rs'],
        ['Official: PiSugar documentation', 'https://docs.pisugar.com/']
      ],
      lessons: [
        {
          title: 'Confirm compatibility and dry-fit the stack',
          time: '20 min',
          kind: 'diagram',
          diagram: 'deck-fit',
          goal: 'Confirm the battery pack, Pi, and case actually fit together before connecting anything electrically.',
          actions: [
            ['Check your battery pack’s documentation for your exact Pi model', 'Battery HATs are frequently model-specific — a pack sized for one Pi generation may not fit or work correctly with another.'],
            ['Power down, then dry-fit the Pi, battery pack, and case', 'Confirm GPIO header alignment and that the case still closes with everything stacked.'],
            ['Confirm the keyboard’s connection type', 'Bluetooth keyboards need pairing later; USB keyboards do not.']
          ],
          check: { q: 'Why check the battery pack’s documentation for your exact Pi model first?', options: ['Battery HATs are frequently model-specific and may not fit or work correctly on a different Pi generation', 'All battery packs are universally compatible', 'It determines the Wi-Fi password'], answer: 0, why: 'A physical or electrical mismatch is much easier to catch during a dry-fit than after everything is wired and closed up.' },
          success: 'The Pi, battery pack, and case dry-fit together correctly with no forced connections.'
        },
        {
          title: 'Install the official power manager software',
          time: '25–35 min',
          kind: 'diagram',
          diagram: 'deck-software',
          goal: 'Install the software that lets the Pi read battery level and manage safe shutdown.',
          actions: [
            ['Run the official installation script', 'This installs the power manager service and its web-based control panel.'],
            ['Open the web control panel from another device on the same network', 'This is where you monitor battery level and configure safe-shutdown behavior.'],
            ['Confirm the reported battery percentage looks reasonable', 'Compare it against how recently the pack was charged.']
          ],
          commands: [
            ['Download the official installer', 'wget -O pisugar-power-manager.sh https://cdn.pisugar.com/release/pisugar-power-manager.sh', 'The script downloads to your current folder.'],
            ['Run the installer', 'bash pisugar-power-manager.sh -c release', 'The installer sets up the PiSugar power manager service.']
          ],
          links: [['Official: PiSugar Power Manager control panel', 'https://docs.pisugar.com/']],
          check: { q: 'Where do you check battery level and configure shutdown behavior?', options: ['The PiSugar web control panel, reached from another device on the network', 'A physical dial on the battery pack', 'The Raspberry Pi Imager'], answer: 0, why: 'The official installer sets up a local web interface (by default on port 8421) for monitoring and configuring the battery pack.' },
          success: 'The PiSugar web control panel loads from another device and shows a plausible battery percentage.',
          troubleshoot: [
            ['The web control panel will not load', 'Confirm the Pi and your other device are on the same network, and confirm the installer finished without error by checking its terminal output again.']
          ]
        },
        {
          title: 'Pair a Bluetooth keyboard',
          time: '15–20 min',
          kind: 'diagram',
          diagram: 'deck-keyboard',
          goal: 'Connect a wireless keyboard so the cyberdeck does not depend on a USB cable.',
          actions: [
            ['Put the keyboard into pairing mode', 'Check the keyboard’s own manual for the exact key combination.'],
            ['Open the Pi’s Bluetooth pairing tool', 'Raspberry Pi OS includes a graphical Bluetooth manager, or you can use bluetoothctl from the terminal.'],
            ['Confirm the keyboard connects and reconnects automatically after a reboot', 'A one-time pairing that does not survive a reboot is not yet finished.']
          ],
          check: { q: 'What should you confirm before considering Bluetooth pairing complete?', options: ['That the keyboard reconnects automatically after a reboot, not just once', 'That the keyboard works over USB as a fallback', 'That the battery pack is fully charged'], answer: 0, why: 'Some Bluetooth pairings work once but do not automatically reconnect after the Pi restarts, which defeats the purpose on a portable device.' },
          success: 'The keyboard connects automatically every time the Pi boots, with no manual re-pairing.'
        },
        {
          title: 'Test unplugged and validate safe shutdown',
          time: '30–45 min',
          kind: 'diagram',
          diagram: 'deck-validate',
          goal: 'Prove the cyberdeck actually works unplugged, and that it shuts down safely before the battery is exhausted.',
          actions: [
            ['Disconnect USB-C power and confirm the Pi keeps running on battery', 'This is the entire point of the build — confirm it before relying on it anywhere.'],
            ['Configure a low-battery safe-shutdown threshold in the PiSugar control panel', 'A clean shutdown prevents microSD card corruption from a hard power cut.'],
            ['Use the Pi normally on battery for a real session', 'A short synthetic test is not the same as real, sustained use.'],
            ['Note the real-world runtime you observed', 'Write down approximately how long a full charge lasted under your actual usage, not a marketing figure.']
          ],
          check: { q: 'Why configure a low-battery safe-shutdown threshold instead of letting the battery run out completely?', options: ['A clean shutdown avoids microSD card corruption from a hard, uncontrolled power loss', 'It charges the battery faster', 'It is required to pair Bluetooth devices'], answer: 0, why: 'An uncontrolled power cut mid-write can corrupt the filesystem on the microSD card; a triggered safe shutdown avoids that risk.' },
          success: 'The Pi runs a real session entirely on battery and shuts down cleanly at your configured threshold rather than cutting out abruptly.'
        }
      ]
    },
    {
      id: 'personal-dashboard',
      status: 'ready',
      icon: '10',
      title: 'Personal Dashboard',
      short: 'A touchscreen kiosk for the web tools you actually use every day.',
      duration: '60–90 min',
      level: 'Foundation required',
      source: 'Chromium command-line switches reference · freedesktop.org autostart specification (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'a touchscreen display (a non-touch display also works, without touch navigation)', 'a stand or mount for the display'],
      safety: ['A kiosk-mode browser has no visible address bar — decide your escape method (SSH, or a keyboard shortcut) before you rely on it daily.', 'Do not save sensitive account passwords in a browser profile that others can physically access through the panel.'],
      links: [
        ['Chromium command-line switches reference', 'https://peter.sh/experiments/chromium-command-line-switches/'],
        ['freedesktop.org: Desktop Application Autostart Specification', 'https://specifications.freedesktop.org/autostart-spec/autostart-spec-latest.html']
      ],
      lessons: [
        {
          title: 'Choose what your dashboard actually shows',
          time: '10 min',
          kind: 'diagram',
          diagram: 'dash-plan',
          goal: 'Decide on one primary web page before building the kiosk, rather than guessing at build time.',
          actions: [
            ['Pick a single, genuinely useful starting page', 'A calendar, task list, or personal start page you already use is a better first choice than something built just for this lab.'],
            ['Confirm that page works well at your display’s resolution', 'Check it in a normal browser window first, sized to match your panel’s screen.'],
            ['Decide whether you need touch navigation', 'This determines whether you need a touchscreen or a non-touch display works just as well.']
          ],
          check: { q: 'Why choose an existing page you already use, rather than building something new for this lab?', options: ['A page you already rely on proves the kiosk is actually useful day to day', 'Custom pages are not supported by Chromium kiosk mode', 'Existing pages load faster'], answer: 0, why: 'A dashboard you never use loses its value quickly — start with something you already check regularly.' },
          success: 'You have one specific URL chosen and have confirmed it looks correct at your display’s resolution.'
        },
        {
          title: 'Launch Chromium in kiosk mode',
          time: '15 min',
          kind: 'diagram',
          diagram: 'dash-kiosk',
          goal: 'Run your chosen page fullscreen with no browser interface visible.',
          actions: [
            ['Confirm Chromium is installed', 'Raspberry Pi OS Desktop includes Chromium by default.'],
            ['Launch it with the kiosk flag pointed at your chosen URL', 'Kiosk mode hides the address bar, tabs, and all other browser chrome.'],
            ['Confirm it fills the screen with no visible browser interface', 'This is the core proof before you automate it.']
          ],
          commands: [
            ['Confirm Chromium is installed', 'chromium-browser --version', 'A version number is printed.'],
            ['Launch in kiosk mode', 'chromium-browser --kiosk "https://your-chosen-url"', 'The page opens fullscreen with no address bar, tabs, or window controls.']
          ],
          check: { q: 'What does the --kiosk flag do?', options: ['Hides all browser interface elements and fills the screen with just the page', 'Blocks all websites except one', 'Enables touch input on a non-touch display'], answer: 0, why: '--kiosk is a standard Chromium switch that removes browser chrome for a dedicated, appliance-like display.' },
          success: 'Your chosen page fills the screen with no address bar, tabs, or window border visible.'
        },
        {
          title: 'Add a safe way out of kiosk mode',
          time: '10 min',
          kind: 'diagram',
          diagram: 'dash-escape',
          goal: 'Decide, in advance, how you will regain control of the Pi once the browser has no visible interface.',
          actions: [
            ['Confirm SSH still works while the kiosk is running', 'You proved this in Foundation — reconfirm it here as your primary way to stop or restart the kiosk remotely.'],
            ['Learn the keyboard shortcut to close Chromium if a keyboard is attached', 'Alt+F4 typically closes it if a keyboard is plugged in during setup and testing.'],
            ['Do not skip this step', 'A kiosk with no planned way out becomes frustrating the first time something needs to change.']
          ],
          check: { q: 'Why confirm an escape method before finishing this build?', options: ['A kiosk display hides the normal browser controls, so you need another way to regain control', 'Chromium requires it to start', 'It is required for touchscreens specifically'], answer: 0, why: 'Once kiosk mode hides all browser chrome, you need a separate, deliberate way back in — SSH access is the most reliable one.' },
          success: 'You can reach the Pi over SSH while the kiosk is running, and know the keyboard shortcut as a backup.'
        },
        {
          title: 'Autostart the dashboard at boot',
          time: '15 min',
          kind: 'diagram',
          diagram: 'dash-autostart',
          goal: 'Make the dashboard appear automatically after every boot.',
          actions: [
            ['Create the autostart folder if it does not already exist', 'This is the standard, compositor-independent way to launch a graphical app at login.'],
            ['Create a .desktop autostart entry with your kiosk command', 'Point it at the exact command you tested in the earlier lesson.'],
            ['Reboot and confirm the dashboard appears with no manual steps']
          ],
          commands: [
            ['Create the autostart folder', 'mkdir -p ~/.config/autostart', 'No output means it succeeded.'],
            ['Autostart entry contents — paste into ~/.config/autostart/dashboard.desktop', '[Desktop Entry]\nType=Application\nName=Personal Dashboard\nExec=chromium-browser --kiosk "https://your-chosen-url"\nX-GNOME-Autostart-enabled=true', 'Replace the URL with your actual chosen page.']
          ],
          check: { q: 'Why use the same .desktop autostart approach as the Digital Photo Frame lab?', options: ['It is a standard method for launching any graphical app at login, independent of which app it is', 'Kiosk-mode Chromium requires a different method than other apps', 'It only works with Chromium'], answer: 0, why: 'The XDG autostart standard works the same way regardless of which graphical application you are launching.' },
          success: 'After a full reboot with no keyboard input, the dashboard appears fullscreen automatically.',
          troubleshoot: [
            ['The dashboard does not appear after reboot', 'Confirm Raspberry Pi OS is set to boot to desktop with auto-login enabled.'],
            ['You need to make a change but the browser has no visible controls', 'Connect over SSH and edit the .desktop file, or use Alt+F4 if a keyboard is attached, then restart the Pi to reload it.']
          ]
        }
      ]
    },
    {
      id: 'linux-basics',
      status: 'ready',
      icon: '11',
      title: 'Linux & Terminal Basics',
      short: 'Learn what a terminal actually does before you rely on one for every other lab.',
      duration: '70–90 min',
      level: 'New to terminals',
      source: 'Debian Documentation Project (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation'],
      safety: ['rm permanently deletes files — there is no Recycle Bin or Trash in the terminal.', 'Never run a command copied from an untrusted source without reading what it does first.'],
      links: [
        ['Debian: Introduction to the command line', 'https://www.debian.org/doc/manuals/debian-reference/ch01.en.html']
      ],
      lessons: [
        {
          title: 'What a terminal actually is',
          time: '10 min',
          kind: 'diagram',
          diagram: 'linux-prompt',
          goal: 'Understand what the terminal is for and how to read a prompt before typing anything into it.',
          actions: [
            ['Open Terminal from the Raspberry Pi OS desktop', 'Terminal gives you the same commands you already used in Foundation — apt, ssh, and so on — but you have not yet learned what those commands actually do.'],
            ['Read your own prompt', 'A prompt like username@hostname:~$ tells you who you are, which machine you are on, and where you are in the filesystem — ~ means your home folder.'],
            ['Understand that a command is just a program', 'Typing ls, cd, or apt runs a small program already installed on the system. You are not learning terminal magic; you are learning to run programs by name.']
          ],
          check: { q: 'What does the ~ in a terminal prompt usually mean?', options: ['Your home folder', 'The root of the entire filesystem', 'A hidden file'], answer: 0, why: '~ is shorthand for your home directory, for example /home/<username>.' },
          success: 'You can open Terminal and explain what your own prompt is telling you.'
        },
        {
          title: 'Move around the filesystem',
          time: '15 min',
          kind: 'diagram',
          diagram: 'linux-navigate',
          goal: 'Navigate directories confidently using pwd, ls, and cd.',
          actions: [
            ['Print your current location', 'pwd always tells you exactly where you are — use it whenever you are unsure.'],
            ['List what is in the current folder', 'ls shows files and folders; ls -la also shows hidden files (starting with a dot) and permission details.'],
            ['Move into and out of folders', 'cd foldername moves in; cd .. moves up one level; cd alone always returns to your home folder.'],
            ['Understand absolute vs relative paths', 'A path starting with / is absolute, measured from the filesystem root. Anything else is relative to where you currently are.']
          ],
          commands: [
            ['Show your current directory', 'pwd', 'The full path to where you currently are is printed.'],
            ['List files, including hidden ones, with details', 'ls -la', 'Every file and folder in the current directory is listed, including permissions and hidden dotfiles.'],
            ['Move into your Desktop folder, then back home', 'cd ~/Desktop && cd ~', 'No output — run pwd after each cd to confirm you moved.']
          ],
          check: { q: 'What does cd .. do?', options: ['Moves up one directory level', 'Deletes the current directory', 'Lists hidden files'], answer: 0, why: '.. always refers to the parent of the current directory.' },
          success: 'You can move to any folder, return home, and explain the difference between an absolute and a relative path.'
        },
        {
          title: 'Create, view, and safely remove files',
          time: '15 min',
          kind: 'diagram',
          diagram: 'linux-files',
          goal: 'Manage files from the command line, and understand why rm deserves caution.',
          actions: [
            ['Create a folder and a file', 'mkdir makes a folder; touch creates an empty file, or nano opens a real text editor.'],
            ['View a file without opening an editor', 'cat prints a short file straight to the terminal; less lets you scroll a long one.'],
            ['Understand that rm has no undo', 'Unlike a desktop trash bin, rm deletes immediately and permanently. There is no "restore from recycle bin."'],
            ['Practice removing only what you just created', 'Delete only the test folder and file you made in this lesson — never run rm on a path you have not fully read.']
          ],
          commands: [
            ['Create a test folder', 'mkdir ~/terminal-practice', 'No output — but ls ~ now shows the new folder.'],
            ['Create a test file inside it', 'touch ~/terminal-practice/notes.txt', 'No output — but ls ~/terminal-practice now shows notes.txt.'],
            ['View a file’s contents', 'cat ~/terminal-practice/notes.txt', 'Nothing prints yet, since the file is empty — that is expected.'],
            ['Remove only the test folder you just made', 'rm -r ~/terminal-practice', 'The folder and its contents are gone. Always re-read the exact path before pressing Enter on any rm command.']
          ],
          check: { q: 'What happens when you run rm on a file?', options: ['It is deleted immediately, with no trash or recycle bin to recover it from', 'It moves to a Trash folder', 'It asks for confirmation by default'], answer: 0, why: 'Unlike most graphical file managers, the terminal’s rm does not use a recycle bin — always double-check the path first.' },
          success: 'You created, viewed, and safely removed only the practice files you intended to.',
          troubleshoot: [['You are not sure what a folder contains before deleting it', 'Run ls on the path first and read the full output before running any rm command on it.']]
        },
        {
          title: 'Understand permissions and sudo',
          time: '15 min',
          kind: 'diagram',
          diagram: 'linux-permissions',
          goal: 'Read basic file permissions and understand what sudo actually does.',
          actions: [
            ['Read a permissions listing', 'ls -l shows a string like -rwxr-xr--. The first character is the type, then three groups of three (owner, group, everyone else) for read/write/execute.'],
            ['Understand what sudo does', 'sudo runs a single command as the superuser (root). It is not a general "make it work" switch — only use it when a command specifically needs elevated permission.'],
            ['Know when not to use sudo', 'If a command fails without sudo, understand why before reaching for it — many "permission denied" errors mean you are in the wrong folder, not that you need root.']
          ],
          commands: [
            ['View permissions for files in the current folder', 'ls -l', 'A permissions string, owner, group, size, and name are printed for each item.'],
            ['Run a single command as an administrator', 'sudo apt update', 'You are prompted for your password once, then the command runs with elevated permission.']
          ],
          check: { q: 'What does sudo actually do?', options: ['Runs one specific command with administrator (root) privileges', 'Permanently makes your account an administrator', 'Speeds up a command'], answer: 0, why: 'sudo elevates only the single command it precedes, not your whole session.' },
          success: 'You can read a basic permissions string and explain what sudo does in one sentence.'
        },
        {
          title: 'Install and manage software with apt',
          time: '15 min',
          kind: 'diagram',
          diagram: 'linux-apt',
          goal: 'Understand the package manager you have already been using since Foundation.',
          actions: [
            ['Refresh the package index before installing anything', 'sudo apt update does not install or upgrade anything by itself — it only refreshes the list of what is available.'],
            ['Install a specific package by name', 'sudo apt install -y <package> installs one named piece of software.'],
            ['Remove a package you no longer need', 'sudo apt remove <package> uninstalls it.'],
            ['Know the difference between update and upgrade', 'update refreshes the list; upgrade actually installs newer versions of packages you already have.']
          ],
          commands: [
            ['Refresh the package index', 'sudo apt update', 'The command finishes without a network or repository error.'],
            ['Install a small, harmless example package', 'sudo apt install -y figlet', 'figlet installs — a small program that prints large ASCII-art text.'],
            ['Try the package you just installed', 'figlet hello', 'The word "hello" is printed in large block letters made of characters.'],
            ['Remove it now that you have tried it', 'sudo apt remove -y figlet', 'figlet is uninstalled.']
          ],
          check: { q: 'What does sudo apt update actually do?', options: ['Refreshes the list of available packages and their versions', 'Installs every available update immediately', 'Removes unused packages'], answer: 0, why: 'update only refreshes package information; upgrade is the separate command that installs newer versions.' },
          success: 'You installed a real package, ran it, and removed it again — the exact cycle you will use in every future lab.'
        },
        {
          title: 'Read output, get help, and recover from mistakes',
          time: '10 min',
          kind: 'diagram',
          diagram: 'linux-help',
          goal: 'Build the habits that make the terminal forgiving instead of intimidating.',
          actions: [
            ['Use Tab to autocomplete', 'Start typing a command or filename and press Tab — the terminal completes it or shows your options.'],
            ['Use the Up arrow for command history', 'Pressing Up cycles through commands you already ran, so you rarely need to retype something.'],
            ['Cancel a stuck or wrong command', 'Ctrl+C stops whatever is currently running and gives you back the prompt.'],
            ['Get real help for any command', 'man <command> opens its full manual; most commands also support --help for a quick summary.']
          ],
          commands: [
            ['Read the full manual for a command', 'man ls', 'A scrollable manual page opens. Press q to quit back to your prompt.'],
            ['Get a quick summary instead', 'ls --help', 'A shorter usage summary prints directly in the terminal.']
          ],
          check: { q: 'What does Ctrl+C do in the terminal?', options: ['Stops the currently running command and returns your prompt', 'Copies selected text', 'Closes the terminal window'], answer: 0, why: 'Ctrl+C sends an interrupt signal, the standard way to stop a running command in the terminal.' },
          success: 'You can look up help for any command on your own, and you know how to cancel and recover from a stuck command.'
        }
      ]
    },
    {
      id: 'python-fundamentals',
      status: 'ready',
      icon: '12',
      title: 'Python Fundamentals',
      short: 'Learn the Python you will actually use in Electronics Lab, Pomodoro Station, and beyond.',
      duration: '90–120 min',
      level: 'New to programming',
      source: 'Python Documentation · Python Packaging Authority (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation (Thonny is preinstalled on Raspberry Pi OS Desktop)'],
      safety: ['Save your work before running a script that loops — use the Stop button in Thonny, or Ctrl+C in a terminal, to interrupt one that will not end.'],
      links: [
        ['Official: Python documentation', 'https://docs.python.org/3/'],
        ['Official: Thonny', 'https://thonny.org/']
      ],
      lessons: [
        {
          title: 'Run your first line of Python',
          time: '10 min',
          kind: 'diagram',
          diagram: 'py-first',
          goal: 'Confirm Thonny is ready and run code two different ways: interactively and as a saved script.',
          actions: [
            ['Open Thonny from the Raspberry Pi OS menu', 'Thonny is preinstalled on Raspberry Pi OS Desktop — you do not need to install anything for this lesson.'],
            ['Type directly into the Shell panel', 'The bottom panel runs one line at a time and shows the result immediately — good for quick experiments.'],
            ['Write and run a saved script', 'The top editor panel is for real programs. Save the file, then press the green Run button (or F5) to run the whole thing at once.']
          ],
          commands: [
            ['Type directly into the Shell panel', 'print("Hello, Pi")', 'Hello, Pi prints immediately below what you typed.']
          ],
          check: { q: 'What is the difference between typing into the Shell and running a saved script?', options: ['The Shell runs one line at a time immediately; a saved script runs a whole file at once', 'They are exactly the same', 'The Shell requires an internet connection'], answer: 0, why: 'The Shell is for quick one-line experiments; scripts are for real, repeatable programs.' },
          success: 'print("Hello, Pi") produces output both in the Shell and when run as a saved script.'
        },
        {
          title: 'Variables and basic types',
          time: '15 min',
          kind: 'diagram',
          diagram: 'py-variables',
          goal: 'Store values in variables and recognize Python’s core data types.',
          actions: [
            ['Assign a few variables of different types', 'A string in quotes, a whole number, a decimal number, and True/False are the four types you will use constantly.'],
            ['Check a variable’s type', 'The built-in type() function tells you exactly what kind of value you are holding — use it whenever you are unsure.'],
            ['Combine text and variables in output', 'An f-string like f"Hello, {name}" is the clearest way to mix fixed text with variable values.']
          ],
          commands: [
            ['Script contents — type or paste into Thonny, then press Run (F5)', 'name = "Nikki"\nage = 5\ntemperature = 21.5\nis_ready = True\n\nprint(type(name))\nprint(type(age))\nprint(type(temperature))\nprint(type(is_ready))\nprint(f"Hello, {name}!")', 'Four lines identifying each type print (str, int, float, bool), followed by Hello, Nikki!']
          ],
          check: { q: 'What does type() do?', options: ['Reports what kind of value a variable currently holds', 'Converts a variable to text', 'Deletes a variable'], answer: 0, why: 'type() is a built-in function that reports a value’s data type — useful whenever you are unsure what you are working with.' },
          success: 'Your script prints all four types correctly and greets you by name using an f-string.'
        },
        {
          title: 'Make decisions with conditionals',
          time: '15 min',
          kind: 'diagram',
          diagram: 'py-conditionals',
          goal: 'Control what a program does based on a condition.',
          actions: [
            ['Compare values', 'Comparison operators (==, !=, <, >, <=, >=) produce a True or False result.'],
            ['Write an if/elif/else chain', 'Only one branch runs — the first condition that evaluates to True.'],
            ['Combine conditions', 'and requires both sides to be True; or requires at least one side.']
          ],
          commands: [
            ['Script contents — type or paste into Thonny, then press Run (F5)', 'temperature = 28\n\nif temperature > 30:\n    print("Too hot")\nelif temperature > 20:\n    print("Comfortable")\nelse:\n    print("Too cold")', 'Prints "Comfortable", since 28 is greater than 20 but not greater than 30.']
          ],
          check: { q: 'In an if/elif/else chain, how many branches run?', options: ['Only the first one whose condition is True', 'All branches whose condition is True', 'Always the else branch'], answer: 0, why: 'Python checks each condition in order and stops at the first one that is True — the rest are skipped.' },
          success: 'Changing the temperature value changes which branch prints, and you can explain why.'
        },
        {
          title: 'Repeat work with loops',
          time: '15 min',
          kind: 'diagram',
          diagram: 'py-loops',
          goal: 'Use for and while loops correctly, and know how to stop a runaway one.',
          actions: [
            ['Use a for loop to repeat a known number of times', 'range(5) produces 5 numbers (0 through 4) — for loops are ideal when you know how many repetitions you want.'],
            ['Use a while loop to repeat until a condition changes', 'A while loop keeps running as long as its condition is True — make sure something inside it eventually makes that False.'],
            ['Know how to stop a stuck loop', 'If a script seems frozen, press the Stop button in Thonny, or Ctrl+C in a terminal — an infinite loop is a common beginner mistake, not a broken computer.']
          ],
          commands: [
            ['Script contents — a for loop', 'for i in range(5):\n    print("Count:", i)', 'Prints Count: 0 through Count: 4, five lines total.'],
            ['Script contents — a while loop', 'count = 0\nwhile count < 3:\n    print("Still going:", count)\n    count += 1\nprint("Done")', 'Prints three "Still going" lines, then "Done". Removing the count += 1 line would make this loop run forever.']
          ],
          check: { q: 'What would happen if you removed count += 1 from the while loop example?', options: ['The loop would run forever, since count would never reach 3', 'The script would immediately crash', 'It would run exactly once'], answer: 0, why: 'The condition count < 3 would always stay True since count never changes, creating an infinite loop.' },
          success: 'You can explain the difference between a for loop and a while loop, and you know how to interrupt a stuck one.'
        },
        {
          title: 'Organize code with functions',
          time: '15 min',
          kind: 'diagram',
          diagram: 'py-functions',
          goal: 'Write a reusable function instead of repeating code.',
          actions: [
            ['Define a function with def', 'A function is a named, reusable block of code — you have already been calling built-in functions like print() and type().'],
            ['Pass information in with parameters', 'Parameters let a function work with different values each time it is called, instead of being hardcoded.'],
            ['Send information back out with return', 'return hands a value back to whatever called the function; print() only displays something — it does not hand a value back to your code.']
          ],
          commands: [
            ['Script contents — a reusable function', 'def celsius_to_fahrenheit(celsius):\n    return celsius * 9 / 5 + 32\n\nprint(celsius_to_fahrenheit(0))\nprint(celsius_to_fahrenheit(100))', 'Prints 32.0, then 212.0 — the correct Fahrenheit equivalents of freezing and boiling.']
          ],
          check: { q: 'What does the return statement do that print() does not?', options: ['Hands a value back to the code that called the function, so it can be used further', 'Displays text on the screen', 'Deletes the function'], answer: 0, why: 'return makes a function’s result usable elsewhere in your program; print() only displays something and hands nothing back.' },
          success: 'celsius_to_fahrenheit(0) and celsius_to_fahrenheit(100) both return the correct values.'
        },
        {
          title: 'Install a third-party library the correct way',
          time: '20 min',
          kind: 'diagram',
          diagram: 'py-venv',
          goal: 'Install and use a library beyond Python’s built-in set, the way current Raspberry Pi OS actually requires.',
          actions: [
            ['Understand why a virtual environment is required now', 'Current Raspberry Pi OS (Bookworm) blocks pip install run outside a virtual environment, to protect the system’s own Python installation. This is standard current Python packaging practice, not a Pi-specific workaround.'],
            ['Create a virtual environment', 'A venv is a private, self-contained copy of Python for one project — it keeps that project’s libraries separate from the system and from other projects.'],
            ['Activate it, then install a library inside it', 'Once activated, your prompt changes and pip install works normally, installing only into that environment.'],
            ['Run a script using the virtual environment’s Python', 'Any script you run while the environment is active uses the libraries you installed into it.']
          ],
          commands: [
            ['Create a virtual environment named env', 'python3 -m venv ~/env', 'A new ~/env folder is created containing a private Python installation.'],
            ['Activate it', 'source ~/env/bin/activate', 'Your prompt gains an (env) prefix, showing the environment is active.'],
            ['Install a real example library inside it', 'pip install requests', 'requests installs without the externally-managed-environment error, since you are inside the venv.'],
            ['Confirm it is importable', 'python3 -c "import requests; print(requests.__version__)"', 'A version number prints.'],
            ['Leave the environment when you are done', 'deactivate', 'Your prompt returns to normal.']
          ],
          check: { q: 'Why does current Raspberry Pi OS block pip install outside a virtual environment?', options: ['To protect the system’s own Python installation from conflicting package versions', 'Because pip is broken on Raspberry Pi OS', 'Because Thonny requires it'], answer: 0, why: 'This is the standard, current Python packaging practice (an "externally managed environment" protection), not something unique to Raspberry Pi OS.' },
          success: 'You created a virtual environment, installed a real library into it, confirmed it imports correctly, and know how to activate and deactivate it for future projects.',
          troubleshoot: [['pip install fails with an "externally-managed-environment" error', 'This means you are not inside an active virtual environment. Run source ~/env/bin/activate first (creating it with python3 -m venv ~/env if you have not already), then try pip install again.']]
        }
      ]
    },
    {
      id: 'pihole',
      status: 'ready',
      icon: '13',
      title: 'Pi-hole Network Ad Blocker',
      short: 'Block ads and trackers network-wide by making your Pi your network’s DNS server.',
      duration: '60–90 min',
      level: 'Foundation required',
      source: 'Pi-hole Documentation · docs.pi-hole.net and GitHub (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'a static IP address or DHCP reservation for the Pi on your router', 'at least 4 GB of free storage (recommended)'],
      safety: ['Set a static IP or DHCP reservation before installing — Pi-hole depends on its own address never changing.', 'If this Pi goes offline, every device pointed at it loses DNS resolution until you switch them back — understand this trade-off before making it your only DNS server.'],
      links: [
        ['Official: Pi-hole documentation', 'https://docs.pi-hole.net/'],
        ['Official: Pi-hole GitHub', 'https://github.com/pi-hole/pi-hole']
      ],
      lessons: [
        {
          title: 'Understand Pi-hole and prepare your network',
          time: '15 min',
          kind: 'diagram',
          diagram: 'pihole-plan',
          goal: 'Understand the DNS-sinkhole concept and get your network ready before installing anything.',
          actions: [
            ['Understand what Pi-hole actually does', 'Pi-hole works as a DNS server: when a device asks to look up a known ad or tracker domain, Pi-hole answers with nothing instead of the real address, so the ad never loads.'],
            ['Give the Pi a static IP or DHCP reservation', 'Pi-hole must stay at the same address permanently — set this in your router or Raspberry Pi OS network settings before installing.'],
            ['Confirm free storage', 'Pi-hole recommends at least 4 GB of free space for its logs and blocklists.']
          ],
          commands: [
            ['Check free storage before installing', 'df -h /', 'Confirm several GB of free space on the root filesystem.']
          ],
          check: { q: 'Why does Pi-hole require a static IP or DHCP reservation?', options: ['Every device on the network needs to reliably find it at the same address to use it as their DNS server', 'It makes installation faster', 'It is required to enable SSH'], answer: 0, why: 'If the Pi’s address changes, every device configured to use it for DNS breaks.' },
          success: 'The Pi has a fixed IP address and at least a few GB of free storage confirmed.'
        },
        {
          title: 'Install Pi-hole',
          time: '20 min',
          kind: 'diagram',
          diagram: 'pihole-install',
          goal: 'Run the official installer and complete first-time setup.',
          actions: [
            ['Run the official install script', 'This downloads and runs Pi-hole’s installer directly from their GitHub-hosted script.'],
            ['Follow the interactive setup', 'You will choose your network interface, an upstream DNS provider (for example Cloudflare or Google), and whether to install the web admin interface — accept the web interface.'],
            ['Note the password shown at the end', 'The installer generates a random admin password once, shown only at the end, unless you set your own.']
          ],
          commands: [
            ['Run the official Pi-hole installer', 'curl -sSL https://install.pi-hole.net | bash', 'An interactive installer walks you through network interface, upstream DNS, and blocklist choices, then finishes with the admin web address and password.'],
            ['Set your own admin password (optional, recommended)', 'pihole setpassword', 'You are prompted to enter and confirm a new password for the web interface.']
          ],
          check: { q: 'What happens if you do not set your own admin password?', options: ['The installer generates a random one and shows it once at the end of setup', 'The web interface has no password at all', 'Installation fails'], answer: 0, why: 'Pi-hole always requires a password for the admin interface; if you do not set one, it generates and displays a random one exactly once.' },
          success: 'Installation completes and you have recorded your admin password.',
          troubleshoot: [['The installer fails partway through', 'Confirm your network connection is stable and re-run the same command — the installer can usually resume or be safely re-run.']]
        },
        {
          title: 'Access and explore the admin dashboard',
          time: '10 min',
          kind: 'diagram',
          diagram: 'pihole-dashboard',
          goal: 'Open the web interface and understand what you are looking at.',
          actions: [
            ['Open the admin interface from another device', 'Use the Pi’s IP address in a browser on the same network.'],
            ['Log in with your admin password', 'This is the password you set or were shown at the end of installation.'],
            ['Review the dashboard', 'The dashboard shows queries blocked today, total queries, and which domains were most frequently blocked.']
          ],
          commands: [
            ['Open the admin interface', 'http://<pi-ip-address>/admin/', 'Replace the placeholder with your Pi’s actual IP address. A login screen appears.']
          ],
          check: { q: 'What does the Pi-hole dashboard show?', options: ['Live statistics on DNS queries and how many were blocked', 'A list of installed apt packages', 'Your Wi-Fi password'], answer: 0, why: 'The dashboard is Pi-hole’s monitoring view into DNS activity across your network.' },
          success: 'You can log in and read today’s query and block statistics.'
        },
        {
          title: 'Point your network at Pi-hole',
          time: '20 min',
          kind: 'diagram',
          diagram: 'pihole-network',
          goal: 'Actually make devices use Pi-hole for DNS, network-wide or per device.',
          actions: [
            ['Prefer the router-level method', 'Setting your router’s DHCP DNS option to the Pi’s IP address makes every device on the network use Pi-hole automatically, with no per-device setup.'],
            ['Use per-device DNS as a fallback', 'If your router does not support this, set an individual device’s network settings to use the Pi’s IP as its DNS server — useful for testing one device first.'],
            ['Confirm blocking is actually working', 'Visit a page you know contains ads and compare it before and after, or check the dashboard for a rising block count.']
          ],
          check: { q: 'What is the advantage of setting DNS at the router instead of per device?', options: ['Every device on the network is covered automatically, with no per-device setup', 'It blocks ads faster', 'It is required — per-device DNS does not work'], answer: 0, why: 'Router-level DNS configuration is inherited by every device that joins the network.' },
          success: 'At least one device is confirmed using Pi-hole for DNS, and the dashboard shows real query activity.',
          troubleshoot: [
            ['Devices still show ads after switching DNS', 'Some devices or browsers use hardcoded DNS-over-HTTPS that bypasses your network settings entirely — check that specific browser’s network or security settings.'],
            ['The whole network loses internet access', 'Every device now depends on this one Pi for DNS. If Pi-hole is down, all name lookups fail. Fix the Pi first, or temporarily point devices back to your router’s original DNS.']
          ]
        },
        {
          title: 'Maintain Pi-hole over time',
          time: '15 min',
          kind: 'diagram',
          diagram: 'pihole-maintain',
          goal: 'Keep blocklists current and know how to recover if something breaks.',
          actions: [
            ['Update the blocklists periodically', 'Blocklists are just data — refresh them periodically rather than assuming they update themselves forever.'],
            ['Know the single point of failure trade-off', 'Because every device depends on this one Pi for DNS, treat it like real infrastructure: do not casually reboot it without warning, and know how to quickly point devices back to normal DNS if needed.'],
            ['Check on it after any Pi reboot', 'Confirm the dashboard loads and queries are being processed after any reboot or power event.']
          ],
          commands: [
            ['Manually refresh blocklists', 'pihole -g', 'Pi-hole re-downloads and rebuilds its blocklists.']
          ],
          check: { q: 'What real risk does making Pi-hole your only DNS server introduce?', options: ['If the Pi goes offline, every device pointed at it loses DNS resolution', 'The blocklists become permanently out of date', 'The web interface stops working'], answer: 0, why: 'Pi-hole becomes a single point of failure for your whole network’s DNS once devices depend on it.' },
          success: 'You know how to manually refresh blocklists and understand the single-point-of-failure trade-off you accepted.'
        }
      ]
    },
    {
      id: 'retropie',
      status: 'ready',
      icon: '14',
      title: 'RetroPie Game Emulation',
      short: 'Turn a Raspberry Pi into a retro game console, using only games you legally own.',
      duration: '90–120 min',
      level: 'New to Pi (separate SD card recommended)',
      source: 'RetroPie Documentation (reviewed 2026-08-25)',
      cover: null,
      materials: ['A separate Raspberry Pi and microSD card (RetroPie ships as its own OS image, not added to your Foundation card)', 'a USB or Bluetooth game controller', 'a display connected via HDMI', 'your own legally-owned games to create ROM backups from'],
      safety: ['RetroPie includes no games. Only use ROM files you created yourself from media or cartridges you legally own — never download ROMs from the internet.', 'Copyright law does not clearly protect "personal backup" copies of games the way it does some other media; treat ROM legality seriously, not casually.'],
      links: [
        ['Official: RetroPie download', 'https://retropie.org.uk/download/'],
        ['Official: RetroPie documentation', 'https://github.com/RetroPie/RetroPie-Docs']
      ],
      lessons: [
        {
          title: 'Understand what RetroPie is (and is not)',
          time: '10 min',
          kind: 'diagram',
          diagram: 'retro-plan',
          goal: 'Set correct expectations before installing anything.',
          actions: [
            ['Understand RetroPie is a full OS image, not an app', 'Unlike most labs in this app, RetroPie replaces the whole operating system on its own microSD card — it is not installed on top of your Foundation card.'],
            ['Understand the ROM legality boundary clearly', 'RetroPie includes zero games or BIOS files by design. You are expected to supply ROM files you created yourself from games and hardware you own — not downloaded from the internet.'],
            ['Decide whether to use a separate Pi or a second microSD card', 'Either works; what matters is that this is a distinct install, separate from your Foundation setup.']
          ],
          check: { q: 'Does RetroPie include any games?', options: ['No — it includes zero games or BIOS files by design; you must supply your own', 'Yes, a small starter library', 'Only free indie games'], answer: 0, why: 'RetroPie explicitly ships with no copyrighted content; ROMs and BIOS files are the user’s responsibility.' },
          success: 'You understand RetroPie is a separate OS image and that ROM sourcing is entirely your responsibility.'
        },
        {
          title: 'Download and write the RetroPie image',
          time: '20 min',
          kind: 'diagram',
          diagram: 'retro-image',
          goal: 'Get the official RetroPie image onto a microSD card.',
          actions: [
            ['Download the correct image for your Pi model', 'RetroPie publishes a separate image per Raspberry Pi generation — get the one matching your exact board.'],
            ['Open Raspberry Pi Imager and choose a custom image', 'RetroPie is not in Imager’s built-in OS list — choose "Use custom" and point it at the file you downloaded.'],
            ['Write to a dedicated microSD card, then recheck it', 'This is a completely separate card from any Foundation or project card you have already built.']
          ],
          links: [['Official: RetroPie download page', 'https://retropie.org.uk/download/']],
          check: { q: 'Where do you find RetroPie in Raspberry Pi Imager’s OS list?', options: ['You do not — choose "Use custom" and point it at the downloaded image file', 'Under Home automation', 'Under Emulation'], answer: 0, why: 'RetroPie is not a built-in Imager entry; it is written using the custom-image option.' },
          success: 'The RetroPie image is written to a dedicated microSD card.'
        },
        {
          title: 'First boot and controller setup',
          time: '20 min',
          kind: 'diagram',
          diagram: 'retro-controller',
          goal: 'Boot RetroPie and configure your first controller.',
          actions: [
            ['Boot with a controller and display connected', 'EmulationStation, RetroPie’s menu system, shows a controller configuration screen automatically on first boot.'],
            ['Hold any button to identify your controller', 'Follow the on-screen prompts to map each button one at a time; hold a button briefly to skip any you do not have.'],
            ['Reconfigure later if needed', 'You can rerun controller setup any time from EmulationStation’s menu, or fully reset it from RetroPie Setup if it goes wrong.']
          ],
          check: { q: 'When does EmulationStation first ask you to configure a controller?', options: ['Automatically, the first time it boots with a controller connected', 'Only if you enable it manually in a settings file', 'It cannot be configured; controllers are automatic'], answer: 0, why: 'First boot triggers an automatic controller-mapping screen in EmulationStation.' },
          success: 'Your controller is mapped and responds correctly in the EmulationStation menu.',
          troubleshoot: [['An Xbox-style controller is not detected', 'Add options xpad triggers_to_buttons=0 to /etc/modprobe.d/xpad.conf, reboot, and reconfigure in EmulationStation.']]
        },
        {
          title: 'Transfer your own ROM backups',
          time: '25 min',
          kind: 'diagram',
          diagram: 'retro-roms',
          goal: 'Move ROM files you created yourself into the correct folders.',
          actions: [
            ['Choose a transfer method', 'A USB drive, a network share (Samba), or SFTP/SCP over SSH all work — pick whichever is easiest on your network.'],
            ['Use the correct per-system folder', 'Each console has its own folder under ~/RetroPie/roms/ — for example NES files go directly in ~/RetroPie/roms/nes.'],
            ['Only transfer files you created from media you own', 'This lab does not cover, link, or suggest any ROM source — you are responsible for how you obtained your files.'],
            ['Refresh EmulationStation after adding files', 'A system only appears in the menu once it has at least one ROM in its folder.']
          ],
          commands: [
            ['Refresh EmulationStation after adding ROM files', 'F4 (from EmulationStation), or Start → Quit → Restart EmulationStation', 'The menu reloads and any system with new ROM files now appears.']
          ],
          check: { q: 'Where do NES ROM files belong?', options: ['~/RetroPie/roms/nes', '~/RetroPie/roms/', 'Anywhere — RetroPie scans the whole card'], answer: 0, why: 'Each emulated system has its own dedicated folder under ~/RetroPie/roms/.' },
          success: 'A system you added ROMs for now appears in the EmulationStation menu with your game listed.',
          troubleshoot: [['A game does not appear in the menu', 'Confirm the ROM file is in the correct system folder and that the matching emulator is installed via RetroPie Setup.']]
        },
        {
          title: 'Set up Bluetooth controllers (optional)',
          time: '15 min',
          kind: 'diagram',
          diagram: 'retro-bluetooth',
          goal: 'Pair a wireless controller instead of using USB.',
          actions: [
            ['Open Bluetooth configuration from the RetroPie menu', 'Available inside EmulationStation’s RetroPie menu, or via the RetroPie-Setup script directly.'],
            ['Register and connect the controller', 'Select its MAC address from the scan results to pair it.'],
            ['Configure its buttons the same way as a USB controller', 'Bluetooth controllers use the same EmulationStation input configuration screen.']
          ],
          check: { q: 'How do you configure buttons on a Bluetooth controller once paired?', options: ['The same EmulationStation input configuration screen used for USB controllers', 'A separate Bluetooth-only settings app', 'It configures itself automatically with no input needed'], answer: 0, why: 'EmulationStation treats a paired Bluetooth controller the same as a wired one for button mapping.' },
          success: 'A Bluetooth controller is paired, reconnects on its own, and responds correctly in-game.'
        },
        {
          title: 'Troubleshoot and finish',
          time: '15 min',
          kind: 'diagram',
          diagram: 'retro-finish',
          goal: 'Recognize and fix the most common first-time problems.',
          actions: [
            ['Know the black-screen-after-boot fix', 'This is usually caused by an experimental display driver setting — it is fixed by editing /boot/config.txt or via raspi-config, not by reflashing the card.'],
            ['Confirm a complete, working setup', 'At least one system with at least one of your own ROMs launches and plays correctly with your controller.'],
            ['Document what you built', 'Record which systems and controllers you set up — not any ROM source details.']
          ],
          check: { q: 'What commonly causes a black screen right after boot?', options: ['An experimental display driver setting that can be changed without reflashing the card', 'A corrupted microSD card that must be rewritten', 'A missing controller'], answer: 0, why: 'This is a known, documented display-driver issue with a simple configuration fix.' },
          success: 'At least one game launches and plays correctly using your own legally-sourced ROM and configured controller.'
        }
      ]
    },
    {
      id: 'security-camera',
      status: 'ready',
      icon: '15',
      title: 'Security Camera & Motion Detection',
      short: 'Capture photos and video with the official camera library, then detect motion automatically.',
      duration: '75–100 min',
      level: 'Foundation required',
      source: 'Raspberry Pi Documentation · picamera2 (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation', 'an official Raspberry Pi Camera Module and matching ribbon cable for your Pi model', 'a case or mount that leaves the camera connector accessible'],
      safety: ['The camera (CSI) connector looks identical to the display (DSI) connector but is electrically different — plugging a camera into the wrong port can damage it.', 'Camera sensors are sensitive to static electricity; earth yourself before handling the board.', 'Always disconnect power before connecting or disconnecting the camera ribbon.'],
      links: [
        ['Official: Raspberry Pi camera documentation', 'https://www.raspberrypi.com/documentation/accessories/camera.html'],
        ['Official: picamera2 GitHub', 'https://github.com/raspberrypi/picamera2']
      ],
      lessons: [
        {
          title: 'Connect the camera safely',
          time: '15 min',
          kind: 'diagram',
          diagram: 'cam-connect',
          goal: 'Physically connect the camera module without damaging it.',
          actions: [
            ['Power down completely', 'Never connect or disconnect a camera ribbon while the Pi is powered.'],
            ['Identify the correct connector', 'Confirm you are using the port labeled for the camera (CSI), not the one for a display (DSI) — they look alike but are not interchangeable.'],
            ['Insert the ribbon with contacts facing the correct direction', 'Pull the connector flap open until it stops, insert the cable with metallic contacts facing away from the flap, keep it straight, then push the flap closed until it clicks.']
          ],
          check: { q: 'What happens if you plug a camera into the display (DSI) connector?', options: ['It can damage the camera, the display, or the Pi — they are electrically different despite looking similar', 'Nothing, they are interchangeable', 'The Pi automatically detects and corrects it'], answer: 0, why: 'CSI and DSI connectors are physically similar but carry different signals; connecting the wrong device can cause damage.' },
          success: 'The camera is connected to the correct port, with its ribbon fully seated and the flap closed.'
        },
        {
          title: 'Confirm the camera is detected',
          time: '15 min',
          kind: 'diagram',
          diagram: 'cam-detect',
          goal: 'Prove the camera works in software before writing any code.',
          actions: [
            ['Confirm picamera2 is installed', 'It is preinstalled on Raspberry Pi OS Desktop (Bullseye and later) but not on Lite images.'],
            ['Run the built-in detection command', 'This lists every camera the system can currently see, without needing any code.'],
            ['Take one test photo from the command line', 'Confirms the whole camera pipeline works before you write a single line of Python.']
          ],
          commands: [
            ['Confirm picamera2 is installed', 'python3 -c "import picamera2; print(picamera2.__version__)"', 'A version number prints. If it fails, install it with sudo apt install python3-picamera2.'],
            ['List detected cameras', 'rpicam-hello --list-cameras', 'Your connected camera and its supported modes are listed, or "No cameras available" if something is wrong.'],
            ['Take one test photo', 'rpicam-still -o test.jpg', 'A file named test.jpg is created — open it to confirm the camera actually sees something.']
          ],
          check: { q: 'What does rpicam-hello --list-cameras tell you?', options: ['Which cameras the system currently detects, or that none are available', 'The camera’s resolution history', 'Nothing — it takes a photo'], answer: 0, why: 'It is the standard first diagnostic step before writing any camera code.' },
          success: 'rpicam-hello --list-cameras shows your camera, and test.jpg contains a real image.',
          troubleshoot: [['"No cameras available"', 'Power down and recheck the ribbon is in the camera (not display) port, fully seated, with contacts facing the correct direction. Also confirm you are on a current Raspberry Pi OS release.']]
        },
        {
          title: 'Capture photos and video with picamera2',
          time: '20 min',
          kind: 'diagram',
          diagram: 'cam-capture',
          goal: 'Write your first camera scripts.',
          actions: [
            ['Write a still-photo script', 'Configure a preview, start the camera, then capture a still frame to a file.'],
            ['Write a short video script', 'Use the H264 encoder to record a fixed-length clip.'],
            ['Always close the camera when done', 'picam2.close() releases the camera so other programs, or your next script run, can use it.']
          ],
          commands: [
            ['Script contents — capture a photo', 'from picamera2 import Picamera2\nimport time\n\npicam2 = Picamera2()\nconfig = picam2.create_preview_configuration(main={"size": (800, 600)})\npicam2.configure(config)\npicam2.start()\ntime.sleep(2)\npicam2.capture_file("photo.jpg")\npicam2.close()', 'photo.jpg is created after a 2-second warm-up.'],
            ['Script contents — capture a 10-second video', 'from picamera2 import Picamera2\nfrom picamera2.encoders import H264Encoder\nimport time\n\npicam2 = Picamera2()\nconfig = picam2.create_video_configuration()\npicam2.configure(config)\nencoder = H264Encoder(10000000)\npicam2.start_recording(encoder, "video.h264")\ntime.sleep(10)\npicam2.stop_recording()', 'A 10-second video.h264 file is created.']
          ],
          check: { q: 'Why call picam2.close() at the end of a script?', options: ['It releases the camera so other programs or later script runs can use it', 'It saves the photo to disk', 'It is only needed for video, not photos'], answer: 0, why: 'Leaving the camera open can block the next script or program from accessing it.' },
          success: 'Both scripts run without error and produce a real photo and a real video file.'
        },
        {
          title: 'Detect motion automatically',
          time: '25 min',
          kind: 'diagram',
          diagram: 'cam-motion',
          goal: 'Build a script that only records when something actually moves.',
          actions: [
            ['Understand the frame-difference approach', 'The script compares each new frame to the previous one; a large enough difference means motion. This is the same technique used in picamera2’s own official example.'],
            ['Start recording only when motion crosses a threshold', 'Avoids recording constantly when nothing is actually happening.'],
            ['Stop recording after a period of no motion', 'Prevents the camera from recording forever once triggered.']
          ],
          commands: [
            ['Script contents — motion-triggered recording (based on the official picamera2 example)', 'import time\nimport numpy as np\nfrom picamera2 import Picamera2\nfrom picamera2.encoders import H264Encoder\n\npicam2 = Picamera2()\nvideo_config = picam2.create_video_configuration()\npicam2.configure(video_config)\nencoder = H264Encoder(10000000)\npicam2.start()\n\nprev = None\nrecording = False\nlast_motion = 0\n\nwhile True:\n    cur = picam2.capture_array()\n    if prev is not None:\n        mse = np.square(np.subtract(cur.astype("int16"), prev.astype("int16"))).mean()\n        if mse > 7:\n            last_motion = time.time()\n            if not recording:\n                picam2.start_recording(encoder, "motion.h264")\n                recording = True\n        elif recording and time.time() - last_motion > 2:\n            picam2.stop_recording()\n            recording = False\n    prev = cur\n    time.sleep(0.2)', 'The script writes motion.h264 whenever the frame changes enough, and stops about 2 seconds after motion stops.']
          ],
          check: { q: 'How does this script actually detect motion?', options: ['By comparing the numeric difference between consecutive video frames', 'By listening for sound', 'By checking a light sensor'], answer: 0, why: 'A large enough pixel difference between frames indicates something in the scene changed — the core idea behind simple frame-difference motion detection.' },
          success: 'Waving your hand in front of the camera reliably starts a recording, and it stops a couple of seconds after you stop moving.',
          troubleshoot: [['It never detects motion, or detects it constantly', 'Adjust the mse threshold (7 in the example) up if it triggers too easily, or down if it misses real motion — lighting and camera noise affect the right value for your setup.']]
        },
        {
          title: 'Mount it and put it to work',
          time: '20 min',
          kind: 'diagram',
          diagram: 'cam-mount',
          goal: 'Turn the working script into an actual, positioned security camera.',
          actions: [
            ['Choose a stable mounting position', 'Aim it at the area you actually want monitored, with the ribbon cable routed safely.'],
            ['Run a real test period', 'Let it run for a real span of time covering normal activity, not just a five-second desk test.'],
            ['Review what it captured', 'Confirm recordings actually contain the motion you expect, and are not missing normal activity or triggering on nothing.'],
            ['Decide on autostart if you want it always running', 'Reuse the systemd service pattern from Pomodoro Station if you want this script to start automatically at boot.']
          ],
          check: { q: 'Why run a real test period instead of just a quick desk test?', options: ['To confirm the motion threshold and camera position actually work for real activity in the real location', 'It is required by picamera2', 'To let the camera sensor warm up'], answer: 0, why: 'A short desk test cannot reveal false positives or negatives caused by real lighting changes, distances, or traffic patterns.' },
          success: 'The camera is mounted in its real position and a real test period confirms it reliably captures the motion you care about.'
        }
      ]
    },
    {
      id: 'weather-station',
      status: 'ready',
      icon: '16',
      title: 'Weather Station',
      short: 'Read temperature, humidity, and pressure from a real sensor and log it over time.',
      duration: '75–100 min',
      level: 'Python Fundamentals required',
      source: 'Adafruit Learn · BME280 CircuitPython guide (reviewed 2026-08-25)',
      cover: null,
      materials: ['Completed Pi 5 Foundation and Python Fundamentals', 'a BME280 (or compatible I2C) temperature/humidity/pressure sensor breakout', 'four jumper wires', 'a breadboard (optional, for a temporary setup)'],
      safety: ['Power down before wiring or rewiring the sensor.', 'Double-check VIN/GND polarity before connecting power — reversed power is a common cause of a dead sensor.'],
      links: [
        ['Official: Adafruit BME280 CircuitPython guide', 'https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout/python-circuitpython-test'],
        ['Raspberry Pi I2C pinout reference', 'https://pinout.xyz/pinout/i2c']
      ],
      lessons: [
        {
          title: 'Wire the sensor and enable I2C',
          time: '20 min',
          kind: 'diagram',
          diagram: 'weather-wire',
          goal: 'Physically connect the sensor and enable the interface it needs.',
          actions: [
            ['Power down, then wire four connections', 'Pi 3.3V → sensor VIN, Pi GND → sensor GND, Pi SDA (GPIO2) → sensor SDI, Pi SCL (GPIO3) → sensor SCK.'],
            ['Enable I2C in Raspberry Pi OS settings', 'Use raspi-config → Interface Options → I2C → Enable, then reboot if prompted.'],
            ['Install i2c-tools to confirm detection', 'This gives you a command to directly confirm the sensor is seen on the bus, independent of any Python code.']
          ],
          commands: [
            ['Install I2C detection tools', 'sudo apt install -y i2c-tools', 'i2c-tools installs without error.'],
            ['Confirm the sensor is detected', 'i2cdetect -y 1', 'The sensor appears at address 0x76 or 0x77 in the grid. If the grid is empty, recheck wiring before continuing.']
          ],
          check: { q: 'What does an empty i2cdetect -y 1 grid usually mean?', options: ['A wiring mistake, or I2C is not yet enabled', 'The sensor is broken beyond repair', 'You need to reinstall Raspberry Pi OS'], answer: 0, why: 'An empty result is the standard sign of a wiring error or a disabled I2C interface — check both before assuming hardware failure.' },
          success: 'i2cdetect -y 1 shows the sensor at 0x76 or 0x77.',
          troubleshoot: [
            ['i2cdetect shows nothing', 'Confirm I2C is actually enabled (recheck raspi-config), and recheck you have not swapped the SDA/SCL wires with an SPI pinout by mistake.'],
            ['The sensor gets warm or nothing works', 'Power down immediately and recheck VIN/GND are not reversed — a swapped power connection is the most common cause of a damaged sensor.']
          ]
        },
        {
          title: 'Install the sensor library the correct way',
          time: '15 min',
          kind: 'diagram',
          diagram: 'weather-venv',
          goal: 'Install the official Adafruit library inside a virtual environment.',
          actions: [
            ['Create and activate a virtual environment', 'Reuse the venv skill from Python Fundamentals — current Raspberry Pi OS blocks pip install outside one.'],
            ['Install the official library inside it', 'This is Adafruit’s actively maintained CircuitPython library for the BME280.'],
            ['Confirm it imports correctly', 'A quick import check catches installation problems before you write real code.']
          ],
          commands: [
            ['Create a virtual environment for this project', 'python3 -m venv ~/weather-env', 'A new environment is created.'],
            ['Activate it', 'source ~/weather-env/bin/activate', 'Your prompt gains a (weather-env) prefix.'],
            ['Install the official BME280 library', 'pip3 install adafruit-circuitpython-bme280', 'The library and its dependencies install without an externally-managed-environment error.']
          ],
          check: { q: 'Why use a virtual environment for this library instead of installing it system-wide?', options: ['Current Raspberry Pi OS blocks pip install outside a virtual environment to protect the system Python install', 'The BME280 library only works inside a venv', 'It makes the sensor readings more accurate'], answer: 0, why: 'This is the same externally-managed-environment protection covered in Python Fundamentals.' },
          success: 'pip3 install adafruit-circuitpython-bme280 completes with no error inside the active virtual environment.'
        },
        {
          title: 'Read live sensor values',
          time: '15 min',
          kind: 'diagram',
          diagram: 'weather-read',
          goal: 'Read real temperature, humidity, and pressure from the sensor.',
          actions: [
            ['Write a minimal reading script', 'Use board.I2C() to connect and the library’s Adafruit_BME280_I2C class to read values.'],
            ['Run it with the virtual environment active', 'The library is only installed inside that environment, so the script must run from there too.'],
            ['Compare readings against something you can verify', 'Compare the temperature reading to a thermometer or your phone’s weather app as a sanity check, understanding they will not match exactly.']
          ],
          commands: [
            ['Script contents — read live values', 'import board\nfrom adafruit_bme280 import basic as adafruit_bme280\n\ni2c = board.I2C()\nbme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c)\n\nprint("Temperature: %0.1f C" % bme280.temperature)\nprint("Humidity: %0.1f %%" % bme280.humidity)\nprint("Pressure: %0.1f hPa" % bme280.pressure)', 'Three lines print with real, plausible-looking readings for your current room.']
          ],
          check: { q: 'Why might the sensor’s temperature reading run a little warmer than the actual room?', options: ['The sensor sitting close to the Pi’s own board heat can slightly raise its reading', 'The library always adds a fixed offset', 'I2C is not accurate enough to be trusted'], answer: 0, why: 'Board heat is a well-known source of a few degrees of offset in DIY sensor placements; positioning the sensor away from the board when possible reduces it.' },
          success: 'The script prints plausible temperature, humidity, and pressure values that roughly match another source.'
        },
        {
          title: 'Log readings over time',
          time: '20 min',
          kind: 'diagram',
          diagram: 'weather-log',
          goal: 'Record a history of readings instead of only reading them once.',
          actions: [
            ['Write a logging script', 'Append one row per run to a CSV file, including a timestamp.'],
            ['Schedule it to run automatically', 'Use cron to run the script every few minutes without needing to remember to run it yourself.'],
            ['Check that rows are actually accumulating', 'Confirm the file is growing over time before trusting it for anything.']
          ],
          commands: [
            ['Script contents — append one logged reading', 'import csv\nimport datetime\nimport board\nfrom adafruit_bme280 import basic as adafruit_bme280\n\ni2c = board.I2C()\nbme280 = adafruit_bme280.Adafruit_BME280_I2C(i2c)\n\nrow = [datetime.datetime.now().isoformat(), bme280.temperature, bme280.humidity, bme280.pressure]\nwith open("/home/<username>/weather-log.csv", "a", newline="") as f:\n    csv.writer(f).writerow(row)', 'One new line is appended to weather-log.csv every time the script runs.'],
            ['Edit your crontab to run it every 5 minutes', 'crontab -e', 'Add a line: */5 * * * * /home/<username>/weather-env/bin/python3 /home/<username>/log_weather.py'],
            ['Confirm rows are accumulating', 'cat ~/weather-log.csv', 'A growing list of timestamped rows appears after a few scheduled runs.']
          ],
          check: { q: 'Why point cron at the virtual environment’s own python3, not the system one?', options: ['The BME280 library is only installed inside that virtual environment', 'cron requires it', 'It runs faster'], answer: 0, why: 'Only the interpreter inside ~/weather-env has the library installed; the system python3 would fail to import it.' },
          success: 'weather-log.csv grows on its own every 5 minutes without you running anything manually.',
          troubleshoot: [['The cron job never seems to run', 'Cron jobs do not activate a virtual environment automatically — always call the venv’s own python3 binary by its full path, as shown above, rather than relying on activation.']]
        },
        {
          title: 'Review and make sense of your data',
          time: '15 min',
          kind: 'diagram',
          diagram: 'weather-review',
          goal: 'Turn logged rows into something you can actually read and use.',
          actions: [
            ['Let it log for a real stretch of time', 'A few hours to a full day of readings is far more useful than a five-minute test.'],
            ['Open the CSV and look for patterns', 'Even without a chart, sorted timestamped rows reveal daily temperature and pressure trends.'],
            ['Decide what, if anything, comes next', 'You now have a real local sensor logging pipeline you can extend — for example, alerting past a threshold, or feeding a dashboard from Desk Info Center.']
          ],
          check: { q: 'What is the minimum useful logging duration before drawing conclusions from the data?', options: ['At least a few hours, ideally a full day, to see a real pattern', 'One single reading is enough', 'Exactly 5 minutes'], answer: 0, why: 'A handful of readings cannot show a real trend; several hours to a day reveals actual daily variation.' },
          success: 'weather-log.csv contains at least several hours of real, growing data that shows a visible trend.'
        }
      ]
    }
  ]
};
