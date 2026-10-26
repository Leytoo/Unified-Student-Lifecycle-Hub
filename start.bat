@echo off
echo ========================================================
echo Starting EduGovHub University Enterprise Data Hub...
echo Frontend + Backend on http://localhost:5000
echo ========================================================
cd /d "%~dp0backend"
node dist/index.js
pause
