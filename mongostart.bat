@echo off

setlocal
if exist "F:\MongoDB\Server\3.0\bin\mongod.exe" goto dHome
if exist "D:\MongoDB\Server\3.0\bin\mongod.exe" goto fHome

set "CURRENT_DIR=E:\mongodb-win32-i386-3.0.7\bin"
E:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

if exist "%CURRENT_DIR%\mongod.exe" goto okHome
echo Can't find mongod.exe
goto end

:dHome

set "CURRENT_DIR=F:\MongoDB\Server\3.0\bin" 
F:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

if exist "%CURRENT_DIR%\mongod.exe" goto okHome
echo Can't find mongod.exe
goto end

:fHome

set "CURRENT_DIR=D:\MongoDB\Server\3.0\bin"
F:
cd "%CURRENT_DIR%"
echo "%CURRENT_DIR%"

:okHome

if exist "D:\Bitbucket\Machine-Learning\data\" goto dData

set "EXECUTABLE=mongod.exe --dbpath E:\Bitbucket\Machine-Learning\data\"
goto okData

:dData
set "EXECUTABLE=mongod.exe --dbpath D:\Bitbucket\Machine-Learning\data\"

:okData
echo "%EXECUTABLE%"
call %EXECUTABLE%

:end