-- ===============================================
-- ATUALIZAR AULAS PARA NOVEMBRO/2025
-- ===============================================

-- 1. Atualizar todas as aulas para novembro de 2025
UPDATE aulas 
SET "dataHora" = 
  CASE 
    -- Se o dia for maior que 30, ajusta para dia 30
    WHEN EXTRACT(DAY FROM "dataHora") > 30 THEN 
      MAKE_TIMESTAMP(2025, 11, 30, 
        EXTRACT(HOUR FROM "dataHora")::int, 
        EXTRACT(MINUTE FROM "dataHora")::int, 
        0)
    ELSE 
      MAKE_TIMESTAMP(2025, 11, 
        EXTRACT(DAY FROM "dataHora")::int, 
        EXTRACT(HOUR FROM "dataHora")::int, 
        EXTRACT(MINUTE FROM "dataHora")::int, 
        0)
  END,
  "updatedAt" = NOW();

-- 2. Verificar resultado
SELECT 
  DATE("dataHora") as data,
  COUNT(*) as total_aulas
FROM aulas
GROUP BY DATE("dataHora")
ORDER BY data;

-- 3. Ver algumas aulas de exemplo
SELECT 
  id,
  titulo,
  materia,
  "dataHora",
  duracao
FROM aulas
ORDER BY "dataHora" DESC
LIMIT 10;

-- ===============================================
-- COMANDOS EXTRAS ÚTEIS
-- ===============================================

-- Contar total de aulas
SELECT COUNT(*) as total FROM aulas;

-- Ver distribuição por dia da semana
SELECT 
  TO_CHAR("dataHora", 'Day') as dia_semana,
  COUNT(*) as total
FROM aulas
WHERE EXTRACT(MONTH FROM "dataHora") = 11
  AND EXTRACT(YEAR FROM "dataHora") = 2025
GROUP BY TO_CHAR("dataHora", 'Day'), EXTRACT(DOW FROM "dataHora")
ORDER BY EXTRACT(DOW FROM "dataHora");

-- Ver aulas por matéria em novembro
SELECT 
  materia,
  COUNT(*) as total
FROM aulas
WHERE EXTRACT(MONTH FROM "dataHora") = 11
  AND EXTRACT(YEAR FROM "dataHora") = 2025
GROUP BY materia
ORDER BY total DESC;
