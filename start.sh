#!/bin/bash

# Print GPU info
echo "Checking GPU..."
nvidia-smi

# Start Xvfb
echo "Starting Xvfb..."
Xvfb :99 -screen 0 1280x1024x24 -ac +extension GLX +render &
sleep 1

# Start dbus
echo "Starting dbus..."
mkdir -p /var/run/dbus
dbus-daemon --system --fork

# Start your application
echo "Starting application..."
npm run start:prod