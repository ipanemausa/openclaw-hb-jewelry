@echo off
REM ============================================
REM  HB Jewelry — Setup Git + GitHub Pages
REM  Ejecutar desde: C:\Users\ipane\openclaw-cloud-2026
REM ============================================

echo [1/6] Copiando proyecto a openclaw-cloud-2026...
xcopy /E /I hb-jewelry ..\openclaw-cloud-2026\hb-jewelry 2>nul
cd ..\openclaw-cloud-2026\hb-jewelry

echo [2/6] Inicializando repositorio Git...
git init
git branch -M main

echo [3/6] Configurando .gitignore...
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo *.pyc >> .gitignore
echo __pycache__/ >> .gitignore
echo .DS_Store >> .gitignore

echo [4/6] Primer commit...
git add .
git commit -m "feat: HB Jewelry — init site + cotizacion flow (OpenClaw 2026)"

echo [5/6] Conectando con GitHub...
echo.
echo  >> Crea el repo en: https://github.com/new
echo  >> Nombre: openclaw-hb-jewelry
echo  >> Visibilidad: Public (para GitHub Pages gratis)
echo  >> NO inicializar con README
echo.
pause

git remote add origin https://github.com/ipanemausa/openclaw-hb-jewelry.git
git push -u origin main

echo [6/6] Activar GitHub Pages...
echo.
echo  >> Ve a: https://github.com/ipanemausa/openclaw-hb-jewelry/settings/pages
echo  >> Source: Deploy from branch
echo  >> Branch: main  /  Folder: /docs
echo  >> Save
echo.
echo  >> Tu sitio estara en:
echo  >> https://ipanemausa.github.io/openclaw-hb-jewelry/
echo.
echo [DONE] HB Jewelry online.
pause
