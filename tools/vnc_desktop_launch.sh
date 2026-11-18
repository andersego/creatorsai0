#!/bin/bash
# LinkedIn VNC desktop launcher (rootless) - rebuilt 18-11, validated with Ander session
# Requires: /tmp/vnc-root (deb-extracted Xvfb/x11vnc/websockify), /tmp/xkbhook.so, /tmp/noVNC, /tmp/cloudflared
# If /tmp was wiped: re-run the deb extraction per tools/login_bridge_meta.json on GitHub
set -x
export LD_LIBRARY_PATH=/tmp/vnc-root/usr/lib/x86_64-linux-gnu:/tmp/vnc-root/usr/lib
export LD_PRELOAD=/tmp/xkbhook.so
rm -rf /tmp/.X99-lock /tmp/.X11-unix/X99 2>/dev/null
mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# 1. Xvfb
setsid nohup /tmp/vnc-root/usr/bin/Xvfb :99 -screen 0 1366x900x24 -xkbdir /tmp/vnc-root/usr/share/X11/xkb > /tmp/xvfb.log 2>&1 &
sleep 5

# 2. Chromium windowed with LinkedIn session (CDP on 9450)
export DISPLAY=:99
rm -f /tmp/chrome-prats/profile/Singleton* 2>/dev/null
setsid nohup env HOME=/opt/data/home XDG_CACHE_HOME=/tmp/chrome-vnc-cache XDG_CONFIG_HOME=/tmp/chrome-vnc-cfg   /opt/hermes/tools/chromium-1208/chrome-linux64/chrome --no-sandbox --disable-gpu --disable-crash-reporter   --disable-crashpad --disable-dev-shm-usage --remote-debugging-port=9450 --remote-allow-origins=*   --user-data-dir=/tmp/chrome-prats/profile --window-size=1366,900 https://www.linkedin.com/feed/ > /tmp/chrome-vnc.log 2>&1 &
sleep 8

# 3. x11vnc
setsid nohup /tmp/vnc-root/usr/bin/x11vnc -display :99 -nopw -quiet -forever -shared -rfbport 5900 > /tmp/x11vnc.log 2>&1 &
sleep 3

# 4. websockify + noVNC
export PYTHONPATH=/opt/data/home/.local/lib/python3.14/site-packages
setsid nohup python3 -m websockify --web /tmp/noVNC 6080 localhost:5900 > /tmp/websockify.log 2>&1 &
sleep 3

# 5. cloudflared tunnel
pkill -f "cloudflared tunnel" 2>/dev/null; sleep 1
setsid nohup /tmp/cloudflared tunnel --url http://127.0.0.1:6080 --no-autoupdate --protocol http2 > /tmp/tunnel.log 2>&1 &
sleep 12
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tunnel.log | head -1
