@echo off
setlocal
cd /d "%~dp0"
set "BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%BUNDLED_NODE%" (
  "%BUNDLED_NODE%" ".\node_modules\next\dist\bin\next" dev
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js was not found. Install Node.js or run this project through Codex.
    pause
    exit /b 1
  )
  node ".\node_modules\next\dist\bin\next" dev
)
