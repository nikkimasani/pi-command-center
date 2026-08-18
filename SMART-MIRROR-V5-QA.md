# Smart Mirror Course V5 implementation lock

Smart Mirror is the reference-quality course for Pi Command Center. Do not route it through the generic project-course renderer.

## Course structure
1. Prep and flash Raspberry Pi OS
2. First boot and software setup
3. Customize MagicMirror modules
4. Launch MagicMirror automatically on boot
5. Screen orientation and touch
6. Physical assembly
7. Final in-frame test
8. Wall mount or desk placement

## Beginner UX contract
Every lesson must contain, in this order:
- Phase + step position
- Short action title
- Why this matters
- Exact visual or software screen reference
- Detailed numbered/checkable actions
- One-copy-per-command controls when commands exist
- Expected result
- Troubleshooting for likely failure states
- A user verification gate before Next

Never use a finished-project photo as a fallback for an unrelated action. If an exact physical visual does not exist, omit the image and flag the asset as missing in development rather than displaying a misleading image.

## Technical corrections verified against current official docs
- Raspberry Pi Imager can preconfigure username/password, Wi-Fi, hostname, locale and SSH.
- First SSH connection requires accepting the host authenticity prompt, then entering the configured account password.
- MagicMirror² official manual install currently uses `git clone https://github.com/MagicMirrorOrg/MagicMirror.git`, `cd MagicMirror`, `node --run install-mm`, `cp config/config.js.sample config/config.js`, then `node --run start`.
- Do not teach the older `npm install` / `npm run start` sequence as the primary current MagicMirror install path.
- MagicMirror² official PM2 autostart guidance uses PM2 plus a start script. The course should follow the current documented PM2 pattern rather than inventing an unsupported shortcut.

## Visual asset contract
Physical actions use fixed explicit asset IDs, never fuzzy keyword matching. Target examples:
- smart-mirror/phase-02/dsi/pi-connector-location
- smart-mirror/phase-02/dsi/pi-latch-open
- smart-mirror/phase-02/dsi/pi-ribbon-aligned
- smart-mirror/phase-02/dsi/pi-ribbon-seated
- smart-mirror/phase-02/dsi/display-side-connection
- smart-mirror/phase-02/dsi/expected-result
- smart-mirror/phase-06/frame/dry-fit
- smart-mirror/phase-06/frame/mirror-layer
- smart-mirror/phase-06/frame/display-position
- smart-mirror/phase-06/frame/pi-position
- smart-mirror/phase-06/frame/cable-routing
- smart-mirror/phase-06/frame/back-panel-clearance

Software lessons should use current screenshots/reference screens for Imager, SSH/Terminal and MagicMirror configuration where possible.

## Responsive acceptance criteria
- No horizontal page overflow at 320px width.
- No instructional heading should dominate the viewport.
- Images render inline and do not require an Enlarge action to understand the step.
- Commands wrap/scroll inside their own container, never expand the page width.
- Primary Previous/Next controls remain reachable on phone, tablet and desktop.
- Phase navigation is collapsible on small screens.

## Deployment acceptance criteria
Do not tell the user a UI change is live until the production deployment is verified to contain the expected release marker. Smart Mirror V5 must display a visible `SMART MIRROR COURSE V5` marker during QA. Remove or soften the marker only after production verification.
