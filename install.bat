@echo off

echo Checking if Node.js is installed
where node 2>nul >nul

if %ERRORLEVEL% == 0 (
  echo Node.js is installed!
  echo Installing packages...
  ping 127.0.0.1 -n 3 > nul
  npm i
  echo Packages installed!
  ping 127.0.0.1 -n 3 > nul
) else (
  echo Node.js is not installed, opening download page!
  start https://nodejs.org
)