@echo off
cd /d "%~dp0"

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  python server\panorama_server.py
) else (
  py server\panorama_server.py
)

pause
