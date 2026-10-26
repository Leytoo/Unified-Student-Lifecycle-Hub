@echo off
echo Starting EduGovHub in Development Mode...
start "EduGov Backend" cmd /k "cd /d %~dp0backend && npm.cmd run dev"
start "EduGov Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"
