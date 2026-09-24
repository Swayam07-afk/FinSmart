@echo off
title Upload FinSmart to GitHub (New Branch / Update)
echo ======================================================
echo   FinSmart — Create & Push to GitHub (New Branch)
echo ======================================================
echo.
cd /d "%~dp0"
node push_to_github.mjs
pause
