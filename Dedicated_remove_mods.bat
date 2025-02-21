@echo off
setlocal enabledelayedexpansion

REM Enable ANSI escape codes
for /F "tokens=2 delims==" %%i in ('"prompt $E" ^| find /V ""') do set "ESC=%%i"

REM Define color codes
set "RED=%ESC%[31m"
set "GREEN=%ESC%[32m"
set "YELLOW=%ESC%[33m"
set "RESET=%ESC%[0m"


REM Array of plugins to delete
set plugins[0]=AmandsGraphics.dll
set plugins[1]=BossNotifier.dll
set plugins[2]=CactusPie.RamCleanerInterval.dll
set plugins[3]=ContinuousHealing.dll
set plugins[4]=DrakiaXYZ-QuickMoveToContainer.dll
set plugins[5]=DrakiaXYZ-SearchOpenContainers.dll
set plugins[6]=Endurance.dll
set plugins[7]=Gaylatea-UseLooseLoot.dll
set plugins[8]=HandsAreNotBusy.dll
set plugins[9]=HideSpecialIcon.dll
set plugins[10]=IhanaMies-HealingAutoCancel.dll
set plugins[11]=IncreaseLookDirection.dll
set plugins[12]=MergeConsumables.dll
set plugins[13]=Tyfon.AutoDeposit.dll
set plugins[14]=UseItemsFromAnywhere.dll
set plugins[15]=Wara-ModdingStatsHelper.dll

set plugins[16]=acidphantasm-stattrack
REM set plugins[16.111111]=BorkelRNVG
set plugins[17]=Declutterer
set plugins[18]=DynamicMaps
set plugins[19]=MoreCheckmarks
set plugins[20]=PlayerEncumbranceBar
set plugins[21]=StashManagementHelper
set plugins[22]=StashSearch

REM Array of mods to delete
set mods[0]=acidphantasm-brightlasers
set mods[1]=ChooChoo-TraderModding
REM set mods[1.111111111]=BRNVG_N-15Adapter
set mods[2]=delod-arenalockboxmod
set mods[3]=ExpandedTaskText
set mods[4]=Jehree-GildedKeyStorage
set mods[5]=lacyway-mergeconsumables
set mods[6]=MoreCheckmarksBackend
set mods[7]=odt-iteminfo
set mods[8]=odt-realisticthermalscopes
set mods[9]=Platinum-TheBlacklist-2.0.2
set mods[10]=redlaser42-Increase Climb Height
set mods[11]=rootsnine-qcadjustments
set mods[12]=SPTDynamicMaps

REM Function to delete plugins
:deletePlugins
for /L %%i in (0,1,22) do (
    set "item=!plugins[%%i]!"
    if defined item (
        set "itemPath=BepInEx\plugins\!item!"
        if exist "!itemPath!" (
            if exist "!itemPath!\*" (
                echo Deleting folder !itemPath!...
                rmdir /S /Q "!itemPath!"
            ) else (
                echo Deleting file !itemPath!...
                del /Q "!itemPath!"
            )
        ) else (
            echo !itemPath! does not exist.
        )
    ) else (
        echo Plugin !plugins[%%i]! is not defined.
        pause
    )
)

REM Function to delete mods
:deleteMods
for /L %%i in (0,1,12) do (
    set "item=!mods[%%i]!"
    if defined item (
        set "itemPath=user\mods\!item!"
        if exist "!itemPath!" (
            if exist "!itemPath!\*" (
                echo Deleting folder !itemPath!...
                rmdir /S /Q "!itemPath!"
            ) else (
                echo Deleting file !itemPath!...
                del /Q "!itemPath!"
            )
        ) else (
            echo !itemPath! does not exist.
        )
    ) else (
        echo Mod !mods[%%i]! is not defined.
        pause
    )
)

echo Deletion complete.
pause