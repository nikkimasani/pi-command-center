#!/usr/bin/env bash
set -euo pipefail
REPO="$HOME/pi-projects/pi-command-center"
if [ ! -f "$REPO/index.html" ]; then
  echo "Pi Command Center was not found at $REPO"
  echo "Clone it first with: git clone https://github.com/nikkimasani/pi-command-center.git $REPO"
  exit 1
fi
mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/pi-project-server.service" <<SERVICE
[Unit]
Description=Pi Command Center local project server
After=network-online.target

[Service]
Type=simple
WorkingDirectory=$REPO
ExecStart=/usr/bin/python3 -m http.server 8088 --bind 127.0.0.1 --directory $REPO
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
SERVICE
systemctl --user daemon-reload
systemctl --user enable --now pi-project-server.service
systemctl --user --no-pager status pi-project-server.service || true
echo "Local project server: http://127.0.0.1:8088/"
