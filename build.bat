@echo off
echo =================================================================
echo             GOURMET HAVEN - PRODUCTION COMPILER
echo =================================================================
echo.
echo Compiling luxury stylesheets, static HTML pages, Webpack scripts,
echo and resolving asset paths for GitHub Pages subfolder hosting...
echo.
cd restaurant\restaurant
nvm\v10.16.3\node.exe node_modules\gulp\bin\gulp.js static-build
echo.
echo =================================================================
echo Build complete! All optimized public files are in the public/ folder.
echo =================================================================
echo.
pause
