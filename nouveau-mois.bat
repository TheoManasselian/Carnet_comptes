@echo off
:: Calcule le mois suivant et crée le fichier JSON correspondant

:: Récupère la date (année et mois)
for /f "tokens=1-2 delims=-" %%a in ('powershell -command "Get-Date -Format yyyy-MM"') do (
  set ANNEE=%%a
  set MOIS=%%b
)

:: Mois actuel (mettre 1 pour mois suivant)
for /f %%d in ('powershell -command "(Get-Date).AddMonths(0).ToString('yyyy-MM')"') do set PROCHAIN=%%d

:: Nom du fichier
set FICHIER=data\%PROCHAIN%.json

:: Création si inexistan
if exist "%FICHIER%" (
  echo Le fichier %FICHIER% existe deja.
) else (
  echo [] > "%FICHIER%"
  echo Fichier cree : %FICHIER%
)
echo.

pause
