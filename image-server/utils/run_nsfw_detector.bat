@echo off
setlocal

echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Vérifiez si l'activation a réussi
if errorlevel 1 (
    echo Failed to activate virtual environment
    exit /b 1
)

echo Running NSFW detector...
python utils\nsfw_detector.py %1

REM Vérifiez si l'exécution du script Python a réussi
if errorlevel 1 (
    echo NSFW detector failed
    exit /b 1
)

echo NSFW detector completed successfully
endlocal
