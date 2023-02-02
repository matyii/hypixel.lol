#!/bin/bash

if command -v node > /dev/null 2>&1; then
  echo "Node.js is installed!"
  echo "Installing packages..."
  sleep 3
  npm i
  echo "Packages installed!"
  sleep 3
else
  echo "Node.js is not installed, opening the download website!"
  xdg-open https://nodejs.org