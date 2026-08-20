(() => {
  'use strict';

  const VERSION = '2.0';
  const STEPS = [
    {
      id: 1,
      title: 'Flash Raspberry Pi OS to the microSD card',
      summary: 'Prepare the 128 GB microSD card and select Raspberry Pi OS 64-bit Desktop in Raspberry Pi Imager.',
      image: '/assets/setup/v2/step-01-microsd-setup.svg',
      alt: '128 GB microSD setup tutorial for Raspberry Pi 5',
      actions: [
        'Insert the 128 GB SanDisk microSD card into your computer.',
        'Open Raspberry Pi Imager and select Raspberry Pi 5.',
        'Choose Raspberry Pi OS 64-bit Desktop.',
        'Choose the 128 GB microSD card as storage.',
        'Do not press Write until the custom settings in Step 2 are complete.'
      ],
      expected: 'Raspberry Pi Imager shows Raspberry Pi 5, Raspberry Pi OS 64-bit Desktop, and the correct 128 GB card.'
    },
    {
      id: 2,
      title: 'Configure Raspberry Pi Imager settings',
      summary: 'Enable SSH, save Wi-Fi, set the hostname to nikkipi, and choose the America/Chicago timezone before writing the card.',
      image: '/assets/setup/v2/step-02-imager-settings.svg',
      alt: 'Raspberry Pi Imager custom settings guide with SSH and Wi-Fi enabled',
      actions: [
        'Open OS customisation in Raspberry Pi Imager.',
        'Set hostname to nikkipi.',
        'Set your username and password.',
        'Enter your Wi-Fi SSID and password.',
        'Enable SSH with password authentication.',
        'Set timezone to America/Chicago and the correct keyboard layout.',
        'Save the settings, then write and verify the microSD card.'
      ],
      expected: 'The microSD card finishes writing with SSH, Wi-Fi, hostname, login and timezone settings preconfigured.'
    },
    {
      id: 3,
      title: 'Install the Raspberry Pi 5 in the metal case',
      summary: 'Mount the Pi 5 securely while keeping USB-C, HDMI, USB, Ethernet and DSI access clear.',
      image: '/assets/setup/v2/step-03-metal-case-assembly.svg',
      alt: 'Raspberry Pi 5 metal case assembly diagram',
      actions: [
        'Place the Pi 5 on a clean, nonconductive work surface.',
        'Align the board with the case standoffs and port cutouts.',
        'Install and tighten the screws evenly until snug.',
        'Confirm the board is flat and not under mechanical stress.',
        'Confirm the DSI connector area and all required external ports remain accessible.'
      ],
      expected: 'The Pi 5 is secure, airflow is unobstructed, and every required connector is reachable.'
    },
    {
      id: 4,
      title: 'Boot the Pi and complete the first startup checks',
      summary: 'Boot Raspberry Pi OS, confirm Wi-Fi, update the system, and reboot before connecting project hardware.',
      image: '/assets/setup/v2/step-04-first-boot-guide.svg',
      alt: 'Raspberry Pi OS first boot and system update guide',
      actions: [
        'Insert the flashed microSD card into the Pi.',
        'Connect the display, keyboard and USB-C power.',
        'Confirm Raspberry Pi OS reaches the desktop.',
        'Confirm Wi-Fi connects successfully.',
        'Open Terminal and run sudo apt update.',
        'Run sudo apt upgrade -y.',
        'Run sudo reboot after updates complete.'
      ],
      expected: 'Raspberry Pi OS boots normally, Wi-Fi is connected, updates complete without errors, and the Pi restarts cleanly.'
    },
    {
      id: 5,
      title: 'Power off and connect the DSI cable safely',
      summary: 'Fully remove power before opening the DSI latch or inserting the display ribbon cable.',
      image: '/assets/setup/v2/step-05-dsi-connection-guide.svg',
      alt: 'Raspberry Pi DSI ribbon cable unlock align insert and lock guide',
      actions: [
        'Shut down Raspberry Pi OS completely.',
        'Disconnect USB-C power from the Pi.',
        'Lift the DSI connector latch gently.',
        'Align the ribbon cable straight and centered.',
        'Insert the ribbon fully into the socket.',
        'Close the latch evenly without forcing it.',
        'Verify the ribbon is not twisted, pinched or under tension before restoring power.'
      ],
      expected: 'The DSI ribbon is fully seated, correctly oriented, locked evenly and mechanically relaxed.'
    },
    {
      id: 6,
      title: 'Verify display, touch, Wi-Fi, SSH and temperature',
      summary: 'Run the final shared-system checklist before starting any project-specific assembly.',
      image: '/assets/setup/v2/step-06-build-verification.svg',
      alt: 'Raspberry Pi final build verification checklist',
      actions: [
        'Boot the Pi again and confirm the display is stable.',
        'Test tap, swipe and pointer alignment on the touchscreen.',
        'Confirm Wi-Fi reconnects after reboot.',
        'Confirm SSH works from another device using nikkipi.',
        'Check the case temperature and verify airflow is unobstructed.'
      ],
      expected: 'Display, touch, Wi-Fi, SSH and temperature checks all pass consistently. The Pi is ready for project-specific steps.'
    }
  ];

  window.SHARED_PI_SETUP_V2 = Object.freeze(STEPS.map(step => Object.freeze({...step}))); 

  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function installStyles() {
    if (document.getElementById('shared-setup-v2-styles')) return;
    const style = document.createElement('style');
    style.id = 'shared-setup-v2-styles';
    style.textContent = `
      .setup-v2-head{margin-bottom:22px}.setup-v2-head h1{font-size:clamp(26px,4vw,42px);line-height:1.12;margin:6px 0 10px}.setup-v2-head p{max-width:760px;color:var(--muted);font-size:14px}.setup-v2-list{display:grid;gap:22px}.setup-v2-card{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);gap:0;background:var(--panel);border:1px solid var(--line);border-radius:20px;overflow:hidden;min-width:0}.setup-v2-visual{background:#07101b;display:flex;align-items:flex-start;justify-content:center;min-width:0}.setup-v2-visual img{width:100%;height:auto;display:block;object-fit:contain;background:#07101b}.setup-v2-copy{padding:24px;min-width:0}.setup-v2-kicker{display:flex;align-items:center;gap:10px;color:var(--green);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.setup-v2-num{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(75,212,155,.14);border:1px solid rgba(75,212,155,.38);font-size:13px}.setup-v2-copy h2{font-size:clamp(20px,2.6vw,29px);line-height:1.18;margin:13px 0 8px}.setup-v2-summary{color:var(--muted);font-size:13px;line-height:1.6}.setup-v2-copy h3{font-size:13px;margin:20px 0 10px}.setup-v2-actions{display:grid;gap:9px;list-style:none;counter-reset:setup-action}.setup-v2-actions li{counter-increment:setup-action;display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;color:#dbe6f3;font-size:13px;line-height:1.5}.setup-v2-actions li:before{content:counter(setup-action);width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--panel2);border:1px solid var(--line);color:var(--green);font-size:11px;font-weight:800}.setup-v2-expected{margin-top:20px;padding:14px 15px;border-radius:12px;background:rgba(75,212,155,.08);border:1px solid rgba(75,212,155,.28)}.setup-v2-expected strong{display:block;color:var(--green);font-size:11px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:5px}.setup-v2-expected p{font-size:12px;color:#cde9dc;line-height:1.55}.setup-v2-version{margin-top:18px;color:var(--muted);font-size:10px;text-align:right}@media(max-width:900px){.setup-v2-card{grid-template-columns:1fr}.setup-v2-visual img{max-height:none}}@media(max-width:560px){.setup-v2-list{gap:16px}.setup-v2-card{border-radius:16px}.setup-v2-copy{padding:18px 16px}.setup-v2-head{margin-bottom:16px}.setup-v2-actions li{font-size:12.5px}.setup-v2-expected{padding:12px}}`;
    document.head.appendChild(style);
  }

  function markup() {
    return `<div class="breadcrumb"><button class="text-link" onclick="renderHome()">Home</button> / Setup Guide</div>
      <div class="setup-v2-head"><span class="eyebrow">Start here</span><h1>Shared Raspberry Pi Setup</h1><p>Complete these six shared-system steps before you mount, glue, cut or wire anything for an individual project.</p></div>
      <div class="setup-v2-list">${STEPS.map(step => `<article class="setup-v2-card" data-setup-v2-step="${step.id}">
        <figure class="setup-v2-visual"><img src="${step.image}" alt="${esc(step.alt)}" width="1122" height="1402" loading="${step.id <= 2 ? 'eager' : 'lazy'}" decoding="async"></figure>
        <div class="setup-v2-copy"><div class="setup-v2-kicker"><span class="setup-v2-num">${step.id}</span> Step ${step.id} of ${STEPS.length}</div><h2>${esc(step.title)}</h2><p class="setup-v2-summary">${esc(step.summary)}</p><h3>What to do</h3><ol class="setup-v2-actions">${step.actions.map(action => `<li>${esc(action)}</li>`).join('')}</ol><div class="setup-v2-expected"><strong>What you should see</strong><p>${esc(step.expected)}</p></div></div>
      </article>`).join('')}</div><div class="setup-v2-version">Shared Setup V${VERSION}</div>`;
  }

  function renderV2() {
    const host = document.querySelector('#setupView');
    if (!host) return;
    host.innerHTML = markup();
    host.scrollIntoView({block:'start'});
  }

  installStyles();
  const original = window.renderSetup;
  if (typeof original === 'function') {
    window.renderSetup = function sharedSetupV2Render() {
      original.apply(this, arguments);
      renderV2();
    };
    if (document.querySelector('#setupView.active')) renderV2();
  } else {
    const timer = setInterval(() => {
      if (typeof window.renderSetup !== 'function') return;
      clearInterval(timer);
      const base = window.renderSetup;
      window.renderSetup = function sharedSetupV2Render() { base.apply(this, arguments); renderV2(); };
    }, 25);
    setTimeout(() => clearInterval(timer), 5000);
  }
})();