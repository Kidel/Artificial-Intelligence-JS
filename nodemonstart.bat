@echo off

setlocal
if exist "D:\GitHub\Machine-Learning-JS\app.js" goto dHome

E:
cd "GitHub\Machine-Learning-JS"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"

goto okHome

:dHome

D:
cd "GitHub\Machine-Learning-JS"
set "CURRENT_DIR=%cd%"
echo "%CURRENT_DIR%"


:okHome

set "EXECUTABLE=nodemon start"
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end