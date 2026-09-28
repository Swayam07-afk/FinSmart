@echo off
title FinSmart Web Platform
echo ======================================================
echo   Starting FinSmart Financial Literacy Platform...
echo ======================================================
cd /d "%~dp0"

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Launching via Node.js server...
  start http://localhost:8000
  node server.js
  goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Launching via Python HTTP server on port 8000...
  start http://localhost:8000
  python -m http.server 8000
  goto end
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Launching via Python Launcher (py) on port 8000...
  start http://localhost:8000
  py -m http.server 8000
  goto end
)

echo Opening FinSmart directly in default browser...
start index.html

:end
pause
