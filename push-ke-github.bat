@echo off
setlocal

rem =====================================================
rem  Script push otomatis ke GitHub.
rem  Cukup double-click file ini setiap ingin meng-upload
rem  perubahan terbaru project ke repo:
rem  https://github.com/ganangrizki22/Portofolio
rem =====================================================

cd /d "%~dp0"

if not exist ".git" (
    echo Menginisialisasi git repository...
    git init
    if errorlevel 1 (
        echo.
        echo Git belum terinstall atau gagal dijalankan.
        echo Install dulu dari https://git-scm.com/downloads
        pause
        exit /b 1
    )
)

git branch -M main

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Menambahkan remote origin...
    git remote add origin https://github.com/ganangrizki22/Portofolio.git
)

echo.
echo Menambahkan perubahan...
git add .

echo Membuat commit...
git commit -m "Update portofolio - %date% %time%"

echo.
echo Mengirim ke GitHub... (mungkin akan muncul jendela login/authorize)
git push -u origin main

echo.
echo =====================================================
echo Selesai! Cek https://github.com/ganangrizki22/Portofolio
echo =====================================================
echo Tekan tombol apa saja untuk menutup jendela ini.
pause >nul
