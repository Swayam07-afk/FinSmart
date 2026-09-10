@echo off
title Push FinSmart to GitHub
echo ======================================================
echo   Create and Push FinSmart Repository to GitHub
echo ======================================================
cd /d "%~dp0"
node push_to_github.mjs
pause
