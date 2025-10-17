@echo off
echo ========================================
echo   ClassCheck - Correcao de Problemas
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK - Dependencias instaladas!
echo.

echo [2/4] Gerando Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao gerar Prisma Client
    pause
    exit /b 1
)
echo OK - Prisma Client gerado!
echo.

echo [3/4] Verificando instalacao...
call npm list react react-dom next lucide-react sonner @prisma/client
echo.

echo [4/4] Processo concluido!
echo.
echo ========================================
echo   Proximos passos:
echo ========================================
echo 1. Execute: npm run dev
echo 2. Abra: http://localhost:3000
echo 3. Quando pronto, execute: npx prisma migrate dev
echo.
echo Sistema de gamificacao instalado com sucesso!
echo ========================================
echo.
pause
