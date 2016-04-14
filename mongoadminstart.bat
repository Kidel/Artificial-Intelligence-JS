@echo off

setlocal

D:
if exist "D:\Bitbucket\otakufeed\app.js" goto dHome

E:
set "CURRENT_DIR=Bitbucket\otakufeed"
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

goto okHome

:dHome

D:
set "CURRENT_DIR=Bitbucket\otakufeed"
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"


:okHome

set "EXECUTABLE=node mongo-express\app.js"
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end