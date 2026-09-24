@echo off
title FinSmart Web Platform
echo ======================================================
echo   Starting FinSmart Financial Literacy Platform...
echo ======================================================
cd /d "%~dp0"
start http://localhost:8000
node server.js
pause
