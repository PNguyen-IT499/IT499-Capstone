@echo off
echo =================================================================
echo             GOURMET HAVEN - DEVELOPMENT SERVER
echo =================================================================
echo.
echo Launching your local development hot-reload server...
echo.
echo BrowserSync will automatically open the website at:
echo 👉 http://localhost:3000
echo.
nvm\v10.16.3\node.exe node_modules\gulp\bin\gulp.js static-dev
echo.
echo =================================================================
echo Server shut down.
echo =================================================================
echo.
pause
