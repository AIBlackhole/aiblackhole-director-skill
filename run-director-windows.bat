@echo off
setlocal

set "ROOT=%~dp0"
set "HELPER=%ROOT%aiblackhole-director\scripts\local_import.py"
set "OPEN_FLAG=--open"

if /I "%~1"=="--no-open" (
  set "OPEN_FLAG="
  shift
)

python --version >nul 2>nul
if errorlevel 1 (
  py -3 --version >nul 2>nul
  if errorlevel 1 (
    echo Python 3 is required to run AI Blackhole Director.
    pause
    exit /b 1
  )
  set "PYTHON_CMD=py -3"
) else (
  set "PYTHON_CMD=python"
)

if "%~1"=="" (
  %PYTHON_CMD% "%HELPER%" %OPEN_FLAG%
) else (
  %PYTHON_CMD% "%HELPER%" "%~1" %OPEN_FLAG%
)

set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" (
  echo.
  echo Failed to start AI Blackhole Director.
  pause
)
exit /b %RC%
