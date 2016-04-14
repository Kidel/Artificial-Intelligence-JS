@echo off

setlocal
if exist "D:\Bitbucket\otakufeed\app.js" goto dHome

E:
cd "Bitbucket\otakufeed"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"

goto okHome

:dHome

D:
cd "Bitbucket\otakufeed"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"


:okHome

set "EXECUTABLE=nodemon start"
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end