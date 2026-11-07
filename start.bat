@echo off
title Midnight Memories - TCG Booster
echo ==============================================
echo   Starting Midnight Memories Booster App...
echo ==============================================
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting local dev server on http://localhost:3000 ...
call npm run dev
pause
