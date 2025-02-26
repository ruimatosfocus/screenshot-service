#!/bin/bash

# Print GPU info
echo "Checking GPU..."
#nvidia-smi

# Set up virtual display
echo "Setting up virtual display..."
export DISPLAY=:99
Xvfb :99 -screen 0 1280x1024x24 -ac +extension GLX +render -noreset &
sleep 1  # Give Xvfb time to start

# Start D-Bus session
echo "Starting D-Bus..."
mkdir -p /var/run/dbus
dbus-daemon --system --fork

# Start your application
echo "Starting application..."
npm run start:prod