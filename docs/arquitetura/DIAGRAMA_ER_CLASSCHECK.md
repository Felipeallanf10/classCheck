# 🗂️ Diagrama ER - ClassCheck

**Data:** 16 de outubro de 2025  
**Versão:** 1.0

---

## 📊 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USUARIO ||--o{ AVALIACAO_SOCIOEMOCIONAL : realiza
    USUARIO ||--o{ AVALIACAO_DIDATICA : realiza
    USUARIO ||--o{ AVALIACAO_PROFESSOR : realiza
    USUARIO ||--o{ CHECK_IN : faz
    USUARIO ||--o{ USUARIO_CONQUISTA : possui
    USUARIO ||--o{ USUARIO_BADGE : possui
    USUARIO ||--o{ HISTORICO_XP : acumula
    USUARIO ||--o{ NOTIFICACAO : recebe
    USUARIO ||--o{ LOG_ATIVIDADE : gera
    USUARIO ||--o{ SESSAO : tem
    USUARIO ||--o{ PRESENCA : registra
    
    QUESTIONARIO_SOCIOEMOCIONAL ||--o{ PERGUNTA_SOCIOEMOCIONAL : contem
    QUESTIONARIO_SOCIOEMOCIONAL ||--o{ RESPOSTA_SOCIOEMOCIONAL : recebe
    
    PERGUNTA_SOCIOEMOCIONAL ||--o{ RESPOSTA_SOCIOEMOCIONAL : possui
    
    USUARIO ||--o{ RESPOSTA_SOCIOEMOCIONAL : responde
    
    AULA ||--o{ AVALIACAO_DIDATICA : recebe
    AULA ||--o{ PRESENCA : controla
    AULA ||--o{ NOTIFICACAO : gera
    AULA }o--|| PROFESSOR : ministrada_por
    
    PROFESSOR ||--o{ AULA : ministra
    PROFESSOR ||--o{ AVALIACAO_PROFESSOR : recebe
    PROFESSOR ||--o{ PROFESSOR_DISCIPLINA : leciona
    
    DISCIPLINA ||--o{ PROFESSOR_DISCIPLINA : possui
    
    CONQUISTA ||--o{ USUARIO_CONQUISTA : desbloqueada_por
    
    BADGE ||--o{ USUARIO_BADGE : conquistado_por
    
    RELATORIO_CONSOLIDADO }o--|| USUARIO : sobre
    METRICA_SOCIOEMOCIONAL }o--|| USUARIO : analisa
    
    BANCO_PERGUNTAS_ADAPTATIVO ||--o{ REGRA_ADAPTACAO : usa
    
    SESSAO_ADAPTATIVA }o--|| USUARIO : pertence
    SESSAO_ADAPTATIVA }o--|| QUESTIONARIO_SOCIOEMOCIONAL : instancia
    
    USUARIO {
        uuid id PK
        string email UK
        string senha
        string nome
        enum role
        int xpTotal
        int nivel
        datetime criadoEm
    }
    
    QUESTIONARIO_SOCIOEMOCIONAL {
        uuid id PK
        string titulo
        enum tipo
        enum frequencia
        boolean adaptativo
        enum nivelAdaptacao
        boolean ativo
    }
    
    PERGUNTA_SOCIOEMOCIONAL {
        uuid id PK
        uuid questionarioId FK
        string texto
        int ordem
        enum categoria
        enum tipo
        enum formatoResposta
        json opcoes
        json condicoes
        enum nivelAlerta
    }
    
    RESPOSTA_SOCIOEMOCIONAL {
        uuid id PK
        uuid usuarioId FK
        uuid questionarioId FK
        uuid perguntaId FK
        string sessaoId
        string respostaTexto
        float respostaNumero
        boolean respostaBoolean
        float pontuacao
        enum nivelAlerta
        datetime respondidoEm
    }
    
    CHECK_IN {
        uuid id PK
        uuid usuarioId FK
        enum humor
        int intensidade
        array emocoes
        int nivelEnergia
        float valencia
        float ativacao
        int streakDias
        datetime criadoEm
    }
    
    AVALIACAO_DIDATICA {
        uuid id PK
        uuid usuarioId FK
        uuid aulaId FK
        int notaGeral
        int clareza
        int metodologia
        int ritmo
        string feedbackPositivo
        boolean compreendeuConteudo
        datetime criadoEm
    }
    
    AVALIACAO_PROFESSOR {
        uuid id PK
        uuid usuarioId FK
        uuid professorId FK
        int dominioConteudo
        int clareza Comunicacao
        int empatia
        boolean recomendaria
        boolean anonima
        datetime criadoEm
    }
    
    AULA {
        uuid id PK
        uuid professorId FK
        string titulo
        string disciplina
        datetime dataHora
        int duracao
        enum tipo
        enum formato
        enum status
        float mediaNotas
        datetime criadoEm
    }
    
    PROFESSOR {
        uuid id PK
        string nome
        string email UK
        enum titulacao
        string departamento
        float mediaGeral
        boolean ativo
    }
    
    DISCIPLINA {
        uuid id PK
        string codigo UK
        string nome
        int cargaHorariaTeorica
        enum nivel
        boolean ativa
    }
    
    CONQUISTA {
        uuid id PK
        string codigo UK
        string titulo
        enum tipo
        enum raridade
        int xp
        int totalDesbloqueios
    }
    
    USUARIO_CONQUISTA {
        uuid id PK
        uuid usuarioId FK
        uuid conquistaId FK
        datetime desbloqueadaEm
        boolean visualizada
    }
    
    BADGE {
        uuid id PK
        string codigo UK
        string nome
        enum categoria
        enum nivel
        enum raridade
    }
    
    USUARIO_BADGE {
        uuid id PK
        uuid usuarioId FK
        uuid badgeId FK
        enum nivel
        datetime conquistadoEm
    }
    
    HISTORICO_XP {
        uuid id PK
        uuid usuarioId FK
        int quantidade
        enum origem
        float multiplicador
        int nivelAnterior
        int nivelAtual
        datetime criadoEm
    }
    
    NOTIFICACAO {
        uuid id PK
        uuid usuarioId FK
        string titulo
        string mensagem
        enum tipo
        enum prioridade
        boolean lida
        datetime criadoEm
    }
    
    PRESENCA {
        uuid id PK
        uuid usuarioId FK
        uuid aulaId FK
        boolean presente
        int percentualPresenca
        datetime horarioChegada
        boolean atrasado
    }
    
    BANCO_PERGUNTAS_ADAPTATIVO {
        uuid id PK
        string codigo UK
        string textoPergunta
        enum dominio
        enum nivel
        json condicoesUso
        int vezesMostrada
        float taxaResposta
    }
    
    REGRA_ADAPTACAO {
        uuid id PK
        string nome
        enum condicaoTipo
        json condicaoValor
        enum acaoTipo
        json acaoParametros
        int ordem
    }
    
    SESSAO_ADAPTATIVA {
        uuid id PK
        uuid usuarioId FK
        uuid questionarioId FK
        array perguntasExibidas
        array perguntasPuladas
        float pontuacaoParcial
        boolean finalizada
        datetime iniciadaEm
    }
    
    RELATORIO_CONSOLIDADO {
        uuid id PK
        enum tipoRelatorio
        enum escopo
        uuid usuarioId FK
        datetime periodoInicio
        datetime periodoFim
        json metricas
        json alertas
        datetime geradoEm
    }
    
    METRICA_SOCIOEMOCIONAL {
        uuid id PK
        uuid usuarioId FK
        datetime periodoInicio
        datetime periodoFim
        float humorMedio
        float energiaMedia
        float valenciaMedia
        float ativacaoMedia
        int totalCheckIns
        datetime calculadoEm
    }
    
    SESSAO {
        uuid id PK
        uuid usuarioId FK
        string token UK
        string ipAddress
        string dispositivo
        boolean ativo
        datetime expiraEm
        datetime criadoEm
    }
    
    LOG_ATIVIDADE {
        uuid id PK
        uuid usuarioId FK
        enum acao
        string entidade
        string entidadeId
        boolean sucesso
        string ipAddress
        datetime criadoEm
    }
    
    AUDITORIA_ALTERACAO {
        uuid id PK
        uuid usuarioId FK
        string tabela
        string registroId
        enum operacao
        json valorAnterior
        json valorNovo
        datetime criadoEm
    }
```

---

## 🔗 Cardinalidades Principais

### Relacionamentos 1:N (Um para Muitos)

```
USUARIO (1) ----< (N) CHECK_IN
- Um usuário pode fazer muitos check-ins
- Um check-in pertence a apenas um usuário

USUARIO (1) ----< (N) AVALIACAO_DIDATICA
- Um usuário pode fazer muitas avaliações de aulas
- Uma avaliação pertence a apenas um usuário

AULA (1) ----< (N) AVALIACAO_DIDATICA
- Uma aula pode ter muitas avaliações
- Uma avaliação é de apenas uma aula

PROFESSOR (1) ----< (N) AULA
- Um professor pode ministrar muitas aulas
- Uma aula é ministrada por apenas um professor

QUESTIONARIO_SOCIOEMOCIONAL (1) ----< (N) PERGUNTA_SOCIOEMOCIONAL
- Um questionário contém muitas perguntas
- Uma pergunta pertence a apenas um questionário

USUARIO (1) ----< (N) HISTORICO_XP
- Um usuário tem muitos registros de XP
- Um registro de XP pertence a apenas um usuário
```

### Relacionamentos N:M (Muitos para Muitos)

```
USUARIO (N) ----< USUARIO_CONQUISTA >---- (M) CONQUISTA
- Muitos usuários podem ter muitas conquistas
- Tabela intermediária: USUARIO_CONQUISTA

USUARIO (N) ----< USUARIO_BADGE >---- (M) BADGE
- Muitos usuários podem ter muitos badges
- Tabela intermediária: USUARIO_BADGE

PROFESSOR (N) ----< PROFESSOR_DISCIPLINA >---- (M) DISCIPLINA
- Muitos professores podem lecionar muitas disciplinas
- Tabela intermediária: PROFESSOR_DISCIPLINA
```

### Relacionamentos 1:1 (Um para Um)

```
USUARIO (1) ---- (1) CONFIGURACAO_NOTIFICACAO
- Um usuário tem uma configuração de notificação
- Chave estrangeira única na configuração
```

---

## 📋 Chaves e Restrições

### Chaves Primárias (PK)
- Todas as tabelas usam **UUID** como chave primária
- Padrão: `@id @default(uuid())`
- Vantagem: Distribuído, não sequencial, seguro

### Chaves Únicas (UK)
```prisma
Usuario.email           @unique
Usuario.matricula       @unique (se existir)
Usuario.cpf             @unique (se existir)
Professor.email         @unique
Professor.matricula     @unique (se existir)
Disciplina.codigo       @unique
Conquista.codigo        @unique
Badge.codigo            @unique
Sessao.token            @unique
Sessao.refreshToken     @unique

// Compostas
@@unique([usuarioId, aulaId])           // Uma avaliação por usuário/aula
@@unique([usuarioId, conquistaId])      // Uma conquista por usuário
@@unique([usuarioId, badgeId, nivel])   // Um badge por nível por usuário
```

### Chaves Estrangeiras (FK)
```prisma
// Com DELETE CASCADE (em cascata)
RespostaSocioemocional.usuarioId  → Usuario.id (CASCADE)
CheckIn.usuarioId                 → Usuario.id (CASCADE)
AvaliacaoDidatica.usuarioId       → Usuario.id (CASCADE)
UsuarioConquista.usuarioId        → Usuario.id (CASCADE)

// Com DELETE SET NULL (anula referência)
Notificacao.aulaId                → Aula.id (SET NULL)
LogAtividade.usuarioId            → Usuario.id (SET NULL)

// Com DELETE RESTRICT (impede exclusão)
Aula.professorId                  → Professor.id (RESTRICT)
ProfessorDisciplina.disciplinaId  → Disciplina.id (RESTRICT)
```

---

## 🔍 Índices de Performance

### Índices Simples

```sql
-- Buscas por usuário
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_usuario_matricula ON Usuario(matricula);

-- Buscas por data
CREATE INDEX idx_checkin_criado ON CheckIn(criadoEm);
CREATE INDEX idx_avaliacao_criado ON AvaliacaoDidatica(criadoEm);

-- Buscas por status
CREATE INDEX idx_aula_status ON Aula(status);
CREATE INDEX idx_notificacao_lida ON Notificacao(lida);

-- Buscas por tipo
CREATE INDEX idx_conquista_tipo ON Conquista(tipo);
CREATE INDEX idx_questionario_tipo ON QuestionarioSocioemocional(tipo);
```

### Índices Compostos

```sql
-- Queries frequentes de usuário + data
CREATE INDEX idx_checkin_usuario_data ON CheckIn(usuarioId, criadoEm);
CREATE INDEX idx_avaliacao_usuario_data ON AvaliacaoDidatica(usuarioId, criadoEm);
CREATE INDEX idx_resposta_usuario_sessao ON RespostaSocioemocional(usuarioId, sessaoId);

-- Professor + disciplina + data
CREATE INDEX idx_aula_prof_data ON Aula(professorId, dataHora);
CREATE INDEX idx_aula_disc_data ON Aula(disciplina, dataHora);

-- Relatórios por período
CREATE INDEX idx_relatorio_periodo ON RelatorioConsolidado(periodoInicio, periodoFim);
CREATE INDEX idx_metrica_periodo ON MetricaSocioemocional(periodoInicio, periodoFim);

-- Notificações não lidas
CREATE INDEX idx_notif_usuario_lida_data ON Notificacao(usuarioId, lida, criadoEm);

-- Logs e auditoria
CREATE INDEX idx_log_usuario_data ON LogAtividade(usuarioId, criadoEm);
CREATE INDEX idx_log_acao_data ON LogAtividade(acao, criadoEm);
CREATE INDEX idx_auditoria_tabela_registro ON AuditoriaAlteracao(tabela, registroId);
```

---

## 🎯 Regras de Integridade

### Validações de Domínio

```typescript
// Escalas válidas
notaGeral: 1-5
clareza: 1-5
intensidade: 1-5
nivelEnergia: 0-10
qualidadeSono: 1-5

// Coordenadas circumplex
valencia: -1.0 a 1.0
ativacao: -1.0 a 1.0

// Percentuais
percentualPresenca: 0-100
percentualCompleto: 0-100
taxaResposta: 0.0-1.0

// XP e níveis
xpTotal: >= 0
nivel: >= 1
quantidade (XP): >= 0

// Tempo
duracao (aula): > 0
tempoResposta: >= 0
streakDias: >= 0
```

### Regras de Negócio

```typescript
// 1. Check-in único por dia
CHECK: único(usuarioId, DATE(criadoEm))

// 2. Avaliação única por usuário/aula
CHECK: único(usuarioId, aulaId)

// 3. Sessão válida
CHECK: expiraEm > criadoEm
CHECK: IF ativo THEN expiraEm > NOW()

// 4. Aula não pode ser no passado (ao criar)
CHECK: dataHora >= NOW() (para novas aulas)

// 5. Período de relatório válido
CHECK: periodoFim > periodoInicio

// 6. Professor ativo pode dar aula
CHECK: IF Aula.professorId THEN Professor.ativo = true

// 7. Resposta deve ter pelo menos um valor
CHECK: respostaTexto IS NOT NULL OR 
       respostaNumero IS NOT NULL OR 
       respostaBoolean IS NOT NULL OR
       respostaArray IS NOT NULL

// 8. Conquista desbloqueada apenas uma vez
CHECK: único(usuarioId, conquistaId)

// 9. Badge por nível único
CHECK: único(usuarioId, badgeId, nivel)

// 10. Presença única por usuário/aula
CHECK: único(usuarioId, aulaId)
```

---

## 🔄 Triggers e Automações

### Triggers Sugeridos

```sql
-- 1. Atualizar médias ao inserir avaliação
TRIGGER after_avaliacao_didatica_insert
ON AvaliacaoDidatica AFTER INSERT
BEGIN
  UPDATE Aula 
  SET mediaNotas = (SELECT AVG(notaGeral) FROM AvaliacaoDidatica WHERE aulaId = NEW.aulaId),
      totalAvaliacoes = totalAvaliacoes + 1
  WHERE id = NEW.aulaId;
END;

-- 2. Calcular XP e atualizar usuário
TRIGGER after_historico_xp_insert
ON HistoricoXP AFTER INSERT
BEGIN
  UPDATE Usuario
  SET xpTotal = xpTotal + NEW.quantidade,
      nivel = FLOOR((xpTotal + NEW.quantidade) / 100) + 1,
      proximoNivel = ((FLOOR((xpTotal + NEW.quantidade) / 100) + 1) * 100)
  WHERE id = NEW.usuarioId;
END;

-- 3. Verificar conquistas ao atualizar usuário
TRIGGER after_usuario_update_check_conquistas
ON Usuario AFTER UPDATE
BEGIN
  -- Lógica para verificar se novas conquistas foram atingidas
  CALL check_conquistas(NEW.id);
END;

-- 4. Atualizar timestamp automaticamente
TRIGGER before_update_set_timestamp
ON [TODAS_TABELAS] BEFORE UPDATE
BEGIN
  SET NEW.atualizadoEm = NOW();
END;

-- 5. Log de auditoria em alterações críticas
TRIGGER after_avaliacao_update_audit
ON AvaliacaoDidatica AFTER UPDATE
BEGIN
  INSERT INTO AuditoriaAlteracao (
    usuarioId, tabela, registroId, operacao, 
    valorAnterior, valorNovo
  ) VALUES (
    CURRENT_USER_ID(), 'AvaliacaoDidatica', OLD.id, 'UPDATE',
    ROW_TO_JSON(OLD), ROW_TO_JSON(NEW)
  );
END;

-- 6. Notificação de streak em risco
TRIGGER after_checkin_check_streak
ON CheckIn AFTER INSERT
BEGIN
  IF (SELECT DATEDIFF(NOW(), MAX(criadoEm)) FROM CheckIn 
      WHERE usuarioId = NEW.usuarioId AND id != NEW.id) > 1 THEN
    -- Streak foi quebrado, notificar
    INSERT INTO Notificacao (usuarioId, tipo, titulo, mensagem)
    VALUES (NEW.usuarioId, 'STREAK_RISCO', 'Streak perdido!', 'Sua sequência foi interrompida.');
  END IF;
END;

-- 7. Atualizar média do professor
TRIGGER after_avaliacao_professor_insert
ON AvaliacaoProfessor AFTER INSERT
BEGIN
  UPDATE Professor
  SET mediaGeral = (
    SELECT AVG((dominioConteudo + clarezaComunicacao + empatia + paciencia) / 4.0)
    FROM AvaliacaoProfessor
    WHERE professorId = NEW.professorId
  ),
  totalAvaliacoes = totalAvaliacoes + 1
  WHERE id = NEW.professorId;
END;
```

---

## 📊 Views Materializadas

### Views Recomendadas

```sql
-- 1. Dashboard de usuário
CREATE MATERIALIZED VIEW vw_dashboard_usuario AS
SELECT 
  u.id,
  u.nome,
  u.xpTotal,
  u.nivel,
  COUNT(DISTINCT c.id) AS totalCheckIns,
  COUNT(DISTINCT ad.id) AS totalAvaliacoes,
  COUNT(DISTINCT uc.id) AS totalConquistas,
  AVG(c.intensidade) AS humorMedio7Dias,
  MAX(c.streakDias) AS streakAtual
FROM Usuario u
LEFT JOIN CheckIn c ON c.usuarioId = u.id AND c.criadoEm >= NOW() - INTERVAL 7 DAY
LEFT JOIN AvaliacaoDidatica ad ON ad.usuarioId = u.id
LEFT JOIN UsuarioConquista uc ON uc.usuarioId = u.id
GROUP BY u.id;

-- 2. Métricas de aula
CREATE MATERIALIZED VIEW vw_metricas_aula AS
SELECT
  a.id,
  a.titulo,
  a.professorId,
  a.disciplina,
  AVG(ad.notaGeral) AS mediaGeral,
  AVG(ad.clareza) AS mediaClareza,
  AVG(ad.metodologia) AS mediaMetodologia,
  COUNT(DISTINCT ad.usuarioId) AS totalAvaliacoes,
  COUNT(DISTINCT p.usuarioId) AS totalPresencas,
  (COUNT(DISTINCT ad.usuarioId) * 100.0 / NULLIF(COUNT(DISTINCT p.usuarioId), 0)) AS taxaAvaliacao
FROM Aula a
LEFT JOIN AvaliacaoDidatica ad ON ad.aulaId = a.id
LEFT JOIN Presenca p ON p.aulaId = a.id AND p.presente = true
GROUP BY a.id;

-- 3. Ranking de alunos
CREATE MATERIALIZED VIEW vw_ranking_alunos AS
SELECT
  u.id,
  u.nome,
  u.xpTotal,
  u.nivel,
  RANK() OVER (ORDER BY u.xpTotal DESC) AS posicaoGeral,
  COUNT(DISTINCT uc.conquistaId) AS totalConquistas,
  COUNT(DISTINCT ub.badgeId) AS totalBadges
FROM Usuario u
LEFT JOIN UsuarioConquista uc ON uc.usuarioId = u.id
LEFT JOIN UsuarioBadge ub ON ub.usuarioId = u.id
WHERE u.role = 'ALUNO' AND u.ativo = true
GROUP BY u.id
ORDER BY u.xpTotal DESC;

-- 4. Alertas socioemocionais
CREATE MATERIALIZED VIEW vw_alertas_socioemocionais AS
SELECT
  u.id AS usuarioId,
  u.nome,
  AVG(c.intensidade) AS humorMedio7Dias,
  COUNT(CASE WHEN c.humor IN ('PESSIMO', 'RUIM') THEN 1 END) AS diasRuins7Dias,
  MAX(c.criadoEm) AS ultimoCheckIn,
  DATEDIFF(NOW(), MAX(c.criadoEm)) AS diasSemCheckIn,
  CASE
    WHEN AVG(c.intensidade) <= 2 THEN 'VERMELHO'
    WHEN AVG(c.intensidade) <= 3 THEN 'LARANJA'
    WHEN DATEDIFF(NOW(), MAX(c.criadoEm)) > 7 THEN 'AMARELO'
    ELSE 'VERDE'
  END AS nivelAlerta
FROM Usuario u
LEFT JOIN CheckIn c ON c.usuarioId = u.id AND c.criadoEm >= NOW() - INTERVAL 7 DAY
WHERE u.role = 'ALUNO' AND u.ativo = true
GROUP BY u.id
HAVING nivelAlerta != 'VERDE';

-- 5. Performance de professores
CREATE MATERIALIZED VIEW vw_performance_professores AS
SELECT
  p.id,
  p.nome,
  p.departamento,
  AVG(ap.dominioConteudo) AS mediaDominioConteudo,
  AVG(ap.clarezaComunicacao) AS mediaClarezaComunicacao,
  AVG(ap.empatia) AS mediaEmpatia,
  AVG((ap.dominioConteudo + ap.clarezaComunicacao + ap.empatia + ap.paciencia) / 4.0) AS mediaGeral,
  COUNT(DISTINCT ap.usuarioId) AS totalAvaliacoes,
  COUNT(DISTINCT a.id) AS totalAulas,
  SUM(CASE WHEN ap.recomendaria = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS taxaRecomendacao
FROM Professor p
LEFT JOIN Aula a ON a.professorId = p.id
LEFT JOIN AvaliacaoProfessor ap ON ap.professorId = p.id
WHERE p.ativo = true
GROUP BY p.id;
```

---

## 🔐 Políticas de Acesso (RLS)

### Row Level Security

```sql
-- 1. Alunos só veem seus próprios dados
CREATE POLICY aluno_proprios_dados ON CheckIn
FOR SELECT TO ALUNO
USING (usuarioId = current_user_id());

-- 2. Professores veem avaliacoes de suas aulas
CREATE POLICY professor_suas_aulas ON AvaliacaoDidatica
FOR SELECT TO PROFESSOR
USING (aulaId IN (
  SELECT id FROM Aula WHERE professorId = current_user_id()
));

-- 3. Coordenadores veem tudo do departamento
CREATE POLICY coordenador_departamento ON Usuario
FOR SELECT TO COORDENADOR
USING (
  departamento = (SELECT departamento FROM Usuario WHERE id = current_user_id())
);

-- 4. Psicólogos veem métricas anonimizadas
CREATE POLICY psicologo_metricas ON MetricaSocioemocional
FOR SELECT TO PSICOLOGO
USING (true); -- Mas dados pessoais são mascarados na aplicação

-- 5. Admins têm acesso total
CREATE POLICY admin_full_access ON *
FOR ALL TO ADMIN
USING (true);
```

---

## 📈 Estratégias de Particionamento

### Tabelas Grandes (Particionamento Recomendado)

```sql
-- 1. CheckIn por mês
CREATE TABLE CheckIn (
  ...
) PARTITION BY RANGE (YEAR(criadoEm), MONTH(criadoEm)) (
  PARTITION p202401 VALUES LESS THAN (2024, 2),
  PARTITION p202402 VALUES LESS THAN (2024, 3),
  ...
);

-- 2. LogAtividade por trimestre
CREATE TABLE LogAtividade (
  ...
) PARTITION BY RANGE (QUARTER(criadoEm)) (
  PARTITION pq1 VALUES LESS THAN (2),
  PARTITION pq2 VALUES LESS THAN (3),
  PARTITION pq3 VALUES LESS THAN (4),
  PARTITION pq4 VALUES LESS THAN (5)
);

-- 3. RespostaSocioemocional por ano
CREATE TABLE RespostaSocioemocional (
  ...
) PARTITION BY RANGE (YEAR(respondidoEm));

-- 4. AuditoriaAlteracao por tabela e ano
CREATE TABLE AuditoriaAlteracao (
  ...
) PARTITION BY LIST (tabela) SUBPARTITION BY RANGE (YEAR(criadoEm));
```

---

## 🎯 Próximas Etapas

1. ✅ Levantamento de requisitos concluído
2. ✅ Diagrama ER criado
3. ⏳ Implementar schema no Prisma
4. ⏳ Criar seeds de dados de teste
5. ⏳ Implementar triggers e views
6. ⏳ Configurar índices
7. ⏳ Testes de carga e performance
8. ⏳ Documentar APIs

---

**Mantido por:** Equipe ClassCheck  
**Última atualização:** 16 de outubro de 2025  
**Versão:** 1.0
