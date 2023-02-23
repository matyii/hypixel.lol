#!/bin/bash

if command -v node > /dev/null 2>&1; then
  echo "Node.js is installed!"
  echo "Installing packages..."
  sleep 3
  npm i
  echo "Packages installed, do you want to set up?"
  read SETUP
  if ["$SETUP" == "Y"]; then
    command node setup.js
  else 
  echo "Skipping setup!"
  fi
else
  echo "Node.js is not installed, opening the download website!"
  xdg-open https://nodejs.org