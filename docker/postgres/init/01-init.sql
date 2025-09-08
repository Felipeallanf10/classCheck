-- ==============================================
-- Script de Inicialização PostgreSQL
-- ClassCheck Database Setup
-- ==============================================

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Mensagem de confirmação
SELECT 'PostgreSQL inicializado com sucesso para ClassCheck!' as message;
