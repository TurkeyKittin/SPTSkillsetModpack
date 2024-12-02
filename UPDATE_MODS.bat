@echo off

REM Run git pull
git pull

REM Check the exit code of the git pull command
if %errorlevel% equ 0 (
    echo Update successful.
    exit
) else (
    echo Update failed. Please check the errors above.
    pause
)