@echo off
setlocal
set "NODE_DIR=%~dp0..\node-v22.16.0-win-x64\node-v22.16.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"
npm run dev
pause
