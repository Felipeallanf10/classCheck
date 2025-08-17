-- ==============================================
-- ClassCheck - Inicialização do Banco MySQL
-- Este script roda automaticamente na primeira execução
-- ==============================================

-- Criar banco se não existir
CREATE DATABASE IF NOT EXISTS classcheck_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco
USE classcheck_db;

-- Configurações de timezone
SET time_zone = '+00:00';

-- Criar usuário se não existir (redundância, já criado via docker-compose)
-- CREATE USER IF NOT EXISTS 'classcheck_user'@'%' IDENTIFIED BY 'classcheck_password';
-- GRANT ALL PRIVILEGES ON classcheck_db.* TO 'classcheck_user'@'%';
-- FLUSH PRIVILEGES;

-- Logs de inicialização
SELECT 'ClassCheck Database initialized successfully!' as status;
