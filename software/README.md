# Pi Command Center companion software

The custom Pi projects use one local project suite so you do not have to find random downloads. The suite is served only on the Pi at `127.0.0.1:8088`.

## Install once

```bash
sudo apt update
sudo apt install -y git python3 chromium || sudo apt install -y git python3 chromium-browser
mkdir -p ~/pi-projects
git clone https://github.com/nikkimasani/pi-command-center.git ~/pi-projects/pi-command-center
cd ~/pi-projects/pi-command-center
bash software/install-local-server.sh
```

## Included modes

- Personal Dashboard: `/software/project-suite.html?app=dashboard`
- Pomodoro Station: `/software/project-suite.html?app=pomodoro`
- Desk Info Center: `/software/project-suite.html?app=desk`
- Digital Photo Frame: `/software/project-suite.html?app=photo`
- Cyberdeck Launcher: `/software/project-suite.html?app=cyberdeck`
- Mini AI Terminal launcher: `/software/project-suite.html?app=ai`
- Magic Frame sleep/photo controller: `/software/project-suite.html?app=magic`
- Electronics Lab GPIO tests: `software/electronics-lab.py`

MagicMirror² is installed separately from the official `MagicMirrorOrg/MagicMirror` repository. Home Assistant Panel uses your existing Home Assistant dashboard rather than installing a second Home Assistant server on the display Pi.

Never put an API key, Home Assistant password, or other secret in browser-delivered HTML.
