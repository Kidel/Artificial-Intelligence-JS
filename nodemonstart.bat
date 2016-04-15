@echo off

setlocal
if exist "D:\Bitbucket\Machine-Learning\app.js" goto dHome

E:
cd "Bitbucket\Machine-Learning"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"

goto okHome

:dHome

D:
cd "Bitbucket\Machine-Learning"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"


:okHome

set "EXECUTABLE=nodemon start"
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end