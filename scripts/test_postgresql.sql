-- ==============================================
-- COMANDOS SQL PARA TESTAR POSTGRESQL
-- ClassCheck Database Test Scripts
-- ==============================================

-- 1. VERIFICAR VERSÃO E INFORMAÇÕES DO BANCO
SELECT version();
SELECT current_database(), current_user, current_timestamp;

-- 2. LISTAR TODAS AS TABELAS
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. VERIFICAR ESTRUTURA DAS TABELAS PRINCIPAIS
\d usuarios
\d professores  
\d aulas
\d avaliacoes

-- 4. INSERIR DADOS DE TESTE

-- Inserir usuários de teste
INSERT INTO usuarios (email, nome, avatar, role, ativo) VALUES
('joao.aluno@exemplo.com', 'João Silva', 'https://via.placeholder.com/150', 'ALUNO', true),
('maria.aluna@exemplo.com', 'Maria Santos', 'https://via.placeholder.com/150', 'ALUNO', true),
('admin@classcheck.com', 'Admin ClassCheck', 'https://via.placeholder.com/150', 'ADMIN', true);

-- Inserir professores de teste
INSERT INTO professores (nome, email, materia, avatar, ativo) VALUES
('Prof. Carlos Oliveira', 'carlos@exemplo.com', 'Matemática', 'https://via.placeholder.com/150', true),
('Prof.ª Ana Costa', 'ana@exemplo.com', 'Português', 'https://via.placeholder.com/150', true),
('Prof. Roberto Lima', 'roberto@exemplo.com', 'História', 'https://via.placeholder.com/150', true);

-- Inserir aulas de teste
INSERT INTO aulas (titulo, descricao, materia, "dataHora", duracao, "professorId", sala, status) VALUES
('Álgebra Linear', 'Introdução aos conceitos de álgebra linear', 'Matemática', '2025-09-06 08:00:00', 90, 1, 'Sala 101', 'AGENDADA'),
('Literatura Brasileira', 'Análise de obras do romantismo', 'Português', '2025-09-06 10:00:00', 90, 2, 'Sala 202', 'AGENDADA'),
('Brasil Império', 'História do período imperial brasileiro', 'História', '2025-09-06 14:00:00', 90, 3, 'Sala 303', 'AGENDADA');

-- Inserir avaliações de teste
INSERT INTO avaliacoes ("usuarioId", "aulaId", humor, nota, feedback) VALUES
(1, 1, 'FELIZ', 5, 'Aula muito boa! Professor explica muito bem.'),
(2, 1, 'MUITO_FELIZ', 5, 'Adorei a explicação sobre vetores!'),
(1, 2, 'NEUTRO', 3, 'Aula ok, mas poderia ter mais exemplos.');

-- Inserir registros de humor
INSERT INTO humor_registros ("usuarioId", humor, data, observacao) VALUES
(1, 'FELIZ', '2025-09-05', 'Dia produtivo de estudos'),
(2, 'MUITO_FELIZ', '2025-09-05', 'Consegui entender álgebra!'),
(1, 'NEUTRO', '2025-09-04', 'Dia normal');

-- Inserir favoritos
INSERT INTO aulas_favoritas ("usuarioId", "aulaId") VALUES
(1, 1),
(1, 2),
(2, 1);

-- Inserir eventos
INSERT INTO eventos (titulo, descricao, "dataInicio", "dataFim", cor, tipo, "aulaId") VALUES
('Prova de Matemática', 'Avaliação sobre álgebra linear', '2025-09-10 08:00:00', '2025-09-10 10:00:00', '#FF6B6B', 'PROVA', 1),
('Feriado Nacional', 'Independência do Brasil', '2025-09-07 00:00:00', '2025-09-07 23:59:59', '#4ECDC4', 'FERIADO', NULL);

-- 5. CONSULTAS DE TESTE E VERIFICAÇÃO

-- Contar registros em cada tabela
SELECT 'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'professores', COUNT(*) FROM professores  
UNION ALL
SELECT 'aulas', COUNT(*) FROM aulas
UNION ALL
SELECT 'avaliacoes', COUNT(*) FROM avaliacoes
UNION ALL
SELECT 'humor_registros', COUNT(*) FROM humor_registros
UNION ALL
SELECT 'aulas_favoritas', COUNT(*) FROM aulas_favoritas
UNION ALL
SELECT 'eventos', COUNT(*) FROM eventos;

-- Consulta completa com JOINs
SELECT 
    a.titulo as aula,
    p.nome as professor,
    a.materia,
    a."dataHora",
    a.sala,
    a.status,
    COUNT(av.id) as total_avaliacoes,
    ROUND(AVG(av.nota), 2) as nota_media
FROM aulas a
LEFT JOIN professores p ON a."professorId" = p.id
LEFT JOIN avaliacoes av ON a.id = av."aulaId"
GROUP BY a.id, a.titulo, p.nome, a.materia, a."dataHora", a.sala, a.status
ORDER BY a."dataHora";

-- Relatório de humor por usuário
SELECT 
    u.nome,
    hr.humor,
    hr.data,
    hr.observacao
FROM usuarios u
JOIN humor_registros hr ON u.id = hr."usuarioId"
ORDER BY u.nome, hr.data DESC;

-- Top aulas favoritas
SELECT 
    a.titulo,
    p.nome as professor,
    COUNT(af."usuarioId") as total_favoritos
FROM aulas a
JOIN professores p ON a."professorId" = p.id  
LEFT JOIN aulas_favoritas af ON a.id = af."aulaId"
GROUP BY a.id, a.titulo, p.nome
ORDER BY total_favoritos DESC;

-- 6. COMANDOS DE LIMPEZA (USE COM CUIDADO!)
-- Descomente as linhas abaixo apenas se quiser limpar os dados de teste

-- DELETE FROM eventos WHERE titulo LIKE '%Teste%' OR titulo LIKE '%Prova de Matemática%' OR titulo LIKE '%Feriado Nacional%';
-- DELETE FROM aulas_favoritas WHERE "usuarioId" IN (SELECT id FROM usuarios WHERE email LIKE '%@exemplo.com%');
-- DELETE FROM humor_registros WHERE "usuarioId" IN (SELECT id FROM usuarios WHERE email LIKE '%@exemplo.com%');  
-- DELETE FROM avaliacoes WHERE "usuarioId" IN (SELECT id FROM usuarios WHERE email LIKE '%@exemplo.com%');
-- DELETE FROM aulas WHERE "professorId" IN (SELECT id FROM professores WHERE email LIKE '%@exemplo.com%');
-- DELETE FROM professores WHERE email LIKE '%@exemplo.com%';
-- DELETE FROM usuarios WHERE email LIKE '%@exemplo.com%' OR email = 'admin@classcheck.com';

-- 7. VERIFICAÇÕES DE PERFORMANCE
EXPLAIN ANALYZE SELECT * FROM usuarios WHERE email = 'joao.aluno@exemplo.com';
EXPLAIN ANALYZE SELECT * FROM aulas WHERE "dataHora" >= '2025-09-06';

-- 8. INFORMAÇÕES DO SISTEMA
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    typname as data_type
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY tablename, attname;

-- ==============================================
-- COMO USAR ESTE ARQUIVO:
-- 
-- 1. Conectar no PostgreSQL:
--    docker-compose exec db psql -U classcheck_user -d classcheck_db
--
-- 2. Executar comandos individuais copiando e colando
--
-- 3. Ou executar arquivo completo:
--    docker-compose exec db psql -U classcheck_user -d classcheck_db < test_queries.sql
-- ==============================================
