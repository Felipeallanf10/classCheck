-- CreateEnum
CREATE TYPE "public"."TipoQuestionario" AS ENUM ('CHECK_IN_DIARIO', 'AVALIACAO_SEMANAL', 'AVALIACAO_MENSAL', 'AVALIACAO_POS_AULA', 'AVALIACAO_CRITICA', 'QUESTIONARIO_INICIAL', 'QUESTIONARIO_FINAL', 'PESQUISA_SATISFACAO', 'AUTOAVALIACAO');

-- CreateEnum
CREATE TYPE "public"."FrequenciaQuestionario" AS ENUM ('DIARIO', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL', 'SOB_DEMANDA');

-- CreateEnum
CREATE TYPE "public"."NivelAdaptacao" AS ENUM ('BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO');

-- CreateEnum
CREATE TYPE "public"."CategoriaPergunta" AS ENUM ('HUMOR_GERAL', 'ANSIEDADE', 'DEPRESSAO', 'ESTRESSE', 'SONO', 'CONCENTRACAO', 'MOTIVACAO', 'RELACIONAMENTOS', 'AUTOESTIMA', 'ENERGIA', 'FADIGA', 'IRRITABILIDADE', 'PENSAMENTOS_NEGATIVOS', 'APOIO_SOCIAL', 'DESEMPENHO_ACADEMICO', 'SATISFACAO_VIDA', 'BEM_ESTAR', 'SAUDE_FISICA');

-- CreateEnum
CREATE TYPE "public"."DominioEmocional" AS ENUM ('ANIMADO', 'ENTUSIASMADO', 'EUFÓRICO', 'EXCITADO', 'FELIZ', 'CONTENTE', 'CALMO', 'RELAXADO', 'SERENO', 'TRANQUILO', 'ENTEDIADO', 'CANSADO', 'DEPRIMIDO', 'LETARGICO', 'TRISTE', 'ANSIOSO', 'ESTRESSADO', 'NERVOSO', 'TENSO', 'IRRITADO', 'NEUTRO');

-- CreateEnum
CREATE TYPE "public"."TipoPergunta" AS ENUM ('LIKERT_5', 'LIKERT_7', 'LIKERT_10', 'ESCALA_VISUAL', 'MULTIPLA_ESCOLHA', 'MULTIPLA_SELECAO', 'TEXTO_CURTO', 'TEXTO_LONGO', 'SIM_NAO', 'EMOJI_PICKER', 'SLIDER_NUMERICO', 'ESCALA_FREQUENCIA', 'ESCALA_INTENSIDADE', 'DATA', 'HORA', 'RANKING');

-- CreateEnum
CREATE TYPE "public"."TipoCondicao" AS ENUM ('VALOR_EXATO', 'VALOR_DIFERENTE', 'MAIOR_QUE', 'MENOR_QUE', 'MAIOR_OU_IGUAL', 'MENOR_OU_IGUAL', 'RANGE_NUMERICO', 'CONTEM_TEXTO', 'MULTIPLAS_RESPOSTAS', 'PADRAO_TEMPORAL', 'DESVIO_PADRAO', 'TENDENCIA');

-- CreateEnum
CREATE TYPE "public"."TipoAcao" AS ENUM ('INSERIR_PERGUNTA', 'PULAR_SECAO', 'FINALIZAR_QUESTIONARIO', 'BUSCAR_BANCO', 'CRIAR_ALERTA', 'NOTIFICAR_PROFISSIONAL', 'ALTERAR_FLUXO', 'RECOMENDAR_RECURSO');

-- CreateEnum
CREATE TYPE "public"."EventoGatilho" AS ENUM ('INICIO_QUESTIONARIO', 'FIM_QUESTIONARIO', 'RESPOSTA_INDIVIDUAL', 'GRUPO_RESPOSTAS', 'TEMPO_DECORRIDO', 'PADRAO_DETECTADO');

-- CreateEnum
CREATE TYPE "public"."StatusSessao" AS ENUM ('EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "public"."NivelAlerta" AS ENUM ('VERDE', 'AMARELO', 'LARANJA', 'VERMELHO');

-- CreateEnum
CREATE TYPE "public"."TipoAlerta" AS ENUM ('RISCO_BAIXO', 'RISCO_MODERADO', 'RISCO_ALTO', 'CRISE_IMEDIATA', 'PADRAO_PREOCUPANTE', 'MELHORA_SIGNIFICATIVA', 'ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."StatusAlerta" AS ENUM ('PENDENTE', 'EM_ANALISE', 'NOTIFICADO', 'EM_ACOMPANHAMENTO', 'RESOLVIDO', 'FALSO_POSITIVO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "public"."PeriodoHistorico" AS ENUM ('DIA', 'SEMANA', 'MES', 'TRIMESTRE', 'SEMESTRE', 'ANO');

-- CreateEnum
CREATE TYPE "public"."CategoriaConquista" AS ENUM ('ENGAJAMENTO', 'CONSISTENCIA', 'PROGRESSO', 'SOCIAL', 'APRENDIZADO', 'ESPECIAL', 'SECRETA');

-- CreateEnum
CREATE TYPE "public"."Raridade" AS ENUM ('COMUM', 'INCOMUM', 'RARO', 'EPICO', 'LENDARIO');

-- CreateEnum
CREATE TYPE "public"."TipoBadge" AS ENUM ('PERMANENTE', 'TEMPORARIO', 'PROGRESSIVO', 'SAZONAL');

-- CreateEnum
CREATE TYPE "public"."CategoriaBadge" AS ENUM ('FREQUENCIA', 'CONQUISTA', 'QUALIDADE', 'ESPECIAL', 'ELITE');

-- CreateEnum
CREATE TYPE "public"."TipoNotificacao" AS ENUM ('LEMBRETE_CHECKIN', 'LEMBRETE_QUESTIONARIO', 'ALERTA_EMOCIONAL', 'CONQUISTA_DESBLOQUEADA', 'BADGE_GANHO', 'NIVEL_SUBIU', 'MENSAGEM_SISTEMA', 'MENSAGEM_PROFISSIONAL', 'ATUALIZACAO', 'DICA_BEM_ESTAR');

-- CreateEnum
CREATE TYPE "public"."PrioridadeNotificacao" AS ENUM ('BAIXA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "public"."TipoLog" AS ENUM ('AUTENTICACAO', 'NAVEGACAO', 'ACAO_USUARIO', 'SISTEMA', 'ERRO', 'ALERTA', 'INTEGRACAO');

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "nivel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "proximoNivel" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "xpTotal" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."questionarios_socioemocionais" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "versao" TEXT NOT NULL DEFAULT '1.0',
    "tipo" "public"."TipoQuestionario" NOT NULL,
    "frequencia" "public"."FrequenciaQuestionario",
    "duracaoEstimada" INTEGER,
    "categorias" TEXT[],
    "adaptativo" BOOLEAN NOT NULL DEFAULT false,
    "nivelAdaptacao" "public"."NivelAdaptacao",
    "instrucoes" TEXT,
    "instrucoesFinais" TEXT,
    "tempoMinimo" INTEGER,
    "tempoMaximo" INTEGER,
    "idadeMinima" INTEGER,
    "idadeMaxima" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "oficial" BOOLEAN NOT NULL DEFAULT false,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "versaoAnterior" TEXT,
    "criadoPorId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "publicadoEm" TIMESTAMP(3),

    CONSTRAINT "questionarios_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."perguntas_socioemocionais" (
    "id" TEXT NOT NULL,
    "questionarioId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "textoAuxiliar" TEXT,
    "categoria" "public"."CategoriaPergunta" NOT NULL,
    "dominio" "public"."DominioEmocional" NOT NULL,
    "tipoPergunta" "public"."TipoPergunta" NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,
    "opcoes" JSONB,
    "valorMinimo" DOUBLE PRECISION,
    "valorMaximo" DOUBLE PRECISION,
    "padraoResposta" TEXT,
    "dificuldade" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "discriminacao" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "peso" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "escalaNome" TEXT,
    "escalaItem" TEXT,
    "tags" TEXT[],
    "palavrasChave" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "validada" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perguntas_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banco_perguntas_adaptativo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "textoAuxiliar" TEXT,
    "categoria" "public"."CategoriaPergunta" NOT NULL,
    "dominio" "public"."DominioEmocional" NOT NULL,
    "subcategoria" TEXT,
    "tipoPergunta" "public"."TipoPergunta" NOT NULL,
    "opcoes" JSONB,
    "parametroA" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "parametroB" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "parametroC" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "escalaNome" TEXT,
    "escalaItem" TEXT,
    "escalaVersao" TEXT,
    "condicoes" JSONB,
    "vezesUsada" INTEGER NOT NULL DEFAULT 0,
    "taxaResposta" DOUBLE PRECISION,
    "tempoMedioResposta" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "validada" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banco_perguntas_adaptativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regras_adaptacao" (
    "id" TEXT NOT NULL,
    "questionarioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "prioridade" INTEGER NOT NULL DEFAULT 0,
    "condicoes" JSONB NOT NULL,
    "acoes" JSONB NOT NULL,
    "tipoCondicao" "public"."TipoCondicao" NOT NULL,
    "tipoAcao" "public"."TipoAcao"[],
    "executarUmaVez" BOOLEAN NOT NULL DEFAULT false,
    "executarSempre" BOOLEAN NOT NULL DEFAULT false,
    "ordemExecucao" INTEGER NOT NULL DEFAULT 0,
    "eventoGatilho" "public"."EventoGatilho",
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "vezesAcionada" INTEGER NOT NULL DEFAULT 0,
    "ultimoAcionamento" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regras_adaptacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessoes_adaptativas" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "questionarioId" TEXT NOT NULL,
    "status" "public"."StatusSessao" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "progresso" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "perguntasApresentadas" TEXT[],
    "perguntasRespondidas" TEXT[],
    "perguntaAtual" TEXT,
    "proximaPergunta" TEXT,
    "thetaEstimado" DOUBLE PRECISION,
    "erroEstimacao" DOUBLE PRECISION,
    "confianca" DOUBLE PRECISION,
    "nivelAlerta" "public"."NivelAlerta" NOT NULL DEFAULT 'VERDE',
    "alertasGerados" TEXT[],
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadoEm" TIMESTAMP(3),
    "tempoTotalSegundos" INTEGER,
    "contexto" JSONB,
    "dispositivo" TEXT,

    CONSTRAINT "sessoes_adaptativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."respostas_socioemocionais" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "valor" JSONB NOT NULL,
    "valorNormalizado" DOUBLE PRECISION,
    "tempoResposta" INTEGER NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 1,
    "alterada" BOOLEAN NOT NULL DEFAULT false,
    "valencia" DOUBLE PRECISION,
    "ativacao" DOUBLE PRECISION,
    "thetaAposResposta" DOUBLE PRECISION,
    "contribuicaoInfo" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "respostas_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alertas_socioemocionais" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "sessaoId" TEXT,
    "questionarioId" TEXT NOT NULL,
    "nivel" "public"."NivelAlerta" NOT NULL,
    "tipo" "public"."TipoAlerta" NOT NULL,
    "categoria" "public"."CategoriaPergunta" NOT NULL,
    "dominio" "public"."DominioEmocional",
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "recomendacoes" JSONB,
    "dadosContexto" JSONB NOT NULL,
    "regrasAcionadas" TEXT[],
    "scoreTotal" DOUBLE PRECISION,
    "scoreDominio" DOUBLE PRECISION,
    "desvioMedia" DOUBLE PRECISION,
    "status" "public"."StatusAlerta" NOT NULL DEFAULT 'PENDENTE',
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "lidoEm" TIMESTAMP(3),
    "notificado" BOOLEAN NOT NULL DEFAULT false,
    "notificadoEm" TIMESTAMP(3),
    "acao" TEXT,
    "observacoes" TEXT,
    "resolvidoEm" TIMESTAMP(3),
    "resolvidoPor" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alertas_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."historico_emocional" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "periodo" "public"."PeriodoHistorico" NOT NULL,
    "valenciaMedia" DOUBLE PRECISION NOT NULL,
    "ativacaoMedia" DOUBLE PRECISION NOT NULL,
    "estadoDominante" TEXT NOT NULL,
    "scoreHumor" DOUBLE PRECISION,
    "scoreAnsiedade" DOUBLE PRECISION,
    "scoreEstresse" DOUBLE PRECISION,
    "scoreMotivacao" DOUBLE PRECISION,
    "scoreSono" DOUBLE PRECISION,
    "scoreRelacionamentos" DOUBLE PRECISION,
    "scoreAutoestima" DOUBLE PRECISION,
    "totalAvaliacoes" INTEGER NOT NULL DEFAULT 0,
    "taxaResposta" DOUBLE PRECISION,
    "tendenciaValencia" TEXT,
    "tendenciaAtivacao" TEXT,
    "totalAlertas" INTEGER NOT NULL DEFAULT 0,
    "alertasVermelhos" INTEGER NOT NULL DEFAULT 0,
    "alertasLaranjas" INTEGER NOT NULL DEFAULT 0,
    "alertasAmarelos" INTEGER NOT NULL DEFAULT 0,
    "desvioValencia" DOUBLE PRECISION,
    "desvioAtivacao" DOUBLE PRECISION,

    CONSTRAINT "historico_emocional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conquistas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "public"."CategoriaConquista" NOT NULL,
    "xp" INTEGER NOT NULL,
    "icone" TEXT NOT NULL,
    "cor" TEXT,
    "raridade" "public"."Raridade" NOT NULL,
    "criterios" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "oculta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "conquistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios_conquistas" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "conquistaId" TEXT NOT NULL,
    "conquistadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progresso" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuarios_conquistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badges" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "cor" TEXT,
    "animacao" TEXT,
    "tipo" "public"."TipoBadge" NOT NULL,
    "categoria" "public"."CategoriaBadge" NOT NULL,
    "criterios" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios_badges" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "badgeId" TEXT NOT NULL,
    "conquistadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nivel" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "usuarios_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checkins" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "humor" INTEGER NOT NULL,
    "emoji" TEXT,
    "observacao" TEXT,
    "atividades" TEXT[],
    "localizacao" TEXT,
    "clima" TEXT,
    "xpGanho" INTEGER NOT NULL DEFAULT 10,
    "streak" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" "public"."TipoNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "dados" JSONB,
    "icone" TEXT,
    "cor" TEXT,
    "prioridade" "public"."PrioridadeNotificacao" NOT NULL DEFAULT 'NORMAL',
    "acao" TEXT,
    "acaoLabel" TEXT,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "lidaEm" TIMESTAMP(3),
    "enviada" BOOLEAN NOT NULL DEFAULT false,
    "enviadaEm" TIMESTAMP(3),
    "agendadaPara" TIMESTAMP(3),
    "expiraEm" TIMESTAMP(3),
    "pushNotification" BOOLEAN NOT NULL DEFAULT false,
    "emailNotification" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs_atividades" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER,
    "tipo" "public"."TipoLog" NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT,
    "entidadeId" TEXT,
    "dados" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "dispositivo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_atividades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questionarios_socioemocionais_tipo_ativo_idx" ON "public"."questionarios_socioemocionais"("tipo", "ativo");

-- CreateIndex
CREATE INDEX "questionarios_socioemocionais_publicado_ativo_idx" ON "public"."questionarios_socioemocionais"("publicado", "ativo");

-- CreateIndex
CREATE INDEX "perguntas_socioemocionais_categoria_ativo_idx" ON "public"."perguntas_socioemocionais"("categoria", "ativo");

-- CreateIndex
CREATE INDEX "perguntas_socioemocionais_dominio_ativo_idx" ON "public"."perguntas_socioemocionais"("dominio", "ativo");

-- CreateIndex
CREATE INDEX "perguntas_socioemocionais_escalaNome_idx" ON "public"."perguntas_socioemocionais"("escalaNome");

-- CreateIndex
CREATE INDEX "perguntas_socioemocionais_questionarioId_ordem_idx" ON "public"."perguntas_socioemocionais"("questionarioId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "banco_perguntas_adaptativo_codigo_key" ON "public"."banco_perguntas_adaptativo"("codigo");

-- CreateIndex
CREATE INDEX "banco_perguntas_adaptativo_categoria_dominio_ativo_idx" ON "public"."banco_perguntas_adaptativo"("categoria", "dominio", "ativo");

-- CreateIndex
CREATE INDEX "banco_perguntas_adaptativo_escalaNome_idx" ON "public"."banco_perguntas_adaptativo"("escalaNome");

-- CreateIndex
CREATE INDEX "banco_perguntas_adaptativo_codigo_idx" ON "public"."banco_perguntas_adaptativo"("codigo");

-- CreateIndex
CREATE INDEX "regras_adaptacao_questionarioId_ativo_prioridade_idx" ON "public"."regras_adaptacao"("questionarioId", "ativo", "prioridade");

-- CreateIndex
CREATE INDEX "regras_adaptacao_tipoCondicao_tipoAcao_idx" ON "public"."regras_adaptacao"("tipoCondicao", "tipoAcao");

-- CreateIndex
CREATE INDEX "sessoes_adaptativas_usuarioId_status_idx" ON "public"."sessoes_adaptativas"("usuarioId", "status");

-- CreateIndex
CREATE INDEX "sessoes_adaptativas_questionarioId_status_idx" ON "public"."sessoes_adaptativas"("questionarioId", "status");

-- CreateIndex
CREATE INDEX "sessoes_adaptativas_nivelAlerta_idx" ON "public"."sessoes_adaptativas"("nivelAlerta");

-- CreateIndex
CREATE INDEX "respostas_socioemocionais_sessaoId_ordem_idx" ON "public"."respostas_socioemocionais"("sessaoId", "ordem");

-- CreateIndex
CREATE INDEX "respostas_socioemocionais_usuarioId_timestamp_idx" ON "public"."respostas_socioemocionais"("usuarioId", "timestamp");

-- CreateIndex
CREATE INDEX "respostas_socioemocionais_perguntaId_idx" ON "public"."respostas_socioemocionais"("perguntaId");

-- CreateIndex
CREATE INDEX "alertas_socioemocionais_usuarioId_nivel_status_idx" ON "public"."alertas_socioemocionais"("usuarioId", "nivel", "status");

-- CreateIndex
CREATE INDEX "alertas_socioemocionais_nivel_status_criadoEm_idx" ON "public"."alertas_socioemocionais"("nivel", "status", "criadoEm");

-- CreateIndex
CREATE INDEX "alertas_socioemocionais_categoria_nivel_idx" ON "public"."alertas_socioemocionais"("categoria", "nivel");

-- CreateIndex
CREATE INDEX "historico_emocional_usuarioId_periodo_data_idx" ON "public"."historico_emocional"("usuarioId", "periodo", "data");

-- CreateIndex
CREATE UNIQUE INDEX "historico_emocional_usuarioId_data_periodo_key" ON "public"."historico_emocional"("usuarioId", "data", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "conquistas_codigo_key" ON "public"."conquistas"("codigo");

-- CreateIndex
CREATE INDEX "conquistas_categoria_raridade_idx" ON "public"."conquistas"("categoria", "raridade");

-- CreateIndex
CREATE INDEX "usuarios_conquistas_usuarioId_idx" ON "public"."usuarios_conquistas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_conquistas_usuarioId_conquistaId_key" ON "public"."usuarios_conquistas"("usuarioId", "conquistaId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_codigo_key" ON "public"."badges"("codigo");

-- CreateIndex
CREATE INDEX "usuarios_badges_usuarioId_idx" ON "public"."usuarios_badges"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_badges_usuarioId_badgeId_key" ON "public"."usuarios_badges"("usuarioId", "badgeId");

-- CreateIndex
CREATE INDEX "checkins_usuarioId_data_idx" ON "public"."checkins"("usuarioId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "checkins_usuarioId_data_key" ON "public"."checkins"("usuarioId", "data");

-- CreateIndex
CREATE INDEX "notificacoes_usuarioId_lida_criadoEm_idx" ON "public"."notificacoes"("usuarioId", "lida", "criadoEm");

-- CreateIndex
CREATE INDEX "notificacoes_tipo_enviada_idx" ON "public"."notificacoes"("tipo", "enviada");

-- CreateIndex
CREATE INDEX "logs_atividades_usuarioId_tipo_criadoEm_idx" ON "public"."logs_atividades"("usuarioId", "tipo", "criadoEm");

-- CreateIndex
CREATE INDEX "logs_atividades_tipo_criadoEm_idx" ON "public"."logs_atividades"("tipo", "criadoEm");

-- AddForeignKey
ALTER TABLE "public"."perguntas_socioemocionais" ADD CONSTRAINT "perguntas_socioemocionais_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "public"."questionarios_socioemocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regras_adaptacao" ADD CONSTRAINT "regras_adaptacao_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "public"."questionarios_socioemocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessoes_adaptativas" ADD CONSTRAINT "sessoes_adaptativas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessoes_adaptativas" ADD CONSTRAINT "sessoes_adaptativas_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "public"."questionarios_socioemocionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas_socioemocionais" ADD CONSTRAINT "respostas_socioemocionais_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "public"."sessoes_adaptativas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas_socioemocionais" ADD CONSTRAINT "respostas_socioemocionais_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "public"."perguntas_socioemocionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas_socioemocionais" ADD CONSTRAINT "respostas_socioemocionais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alertas_socioemocionais" ADD CONSTRAINT "alertas_socioemocionais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alertas_socioemocionais" ADD CONSTRAINT "alertas_socioemocionais_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "public"."sessoes_adaptativas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alertas_socioemocionais" ADD CONSTRAINT "alertas_socioemocionais_questionarioId_fkey" FOREIGN KEY ("questionarioId") REFERENCES "public"."questionarios_socioemocionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."historico_emocional" ADD CONSTRAINT "historico_emocional_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios_conquistas" ADD CONSTRAINT "usuarios_conquistas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios_conquistas" ADD CONSTRAINT "usuarios_conquistas_conquistaId_fkey" FOREIGN KEY ("conquistaId") REFERENCES "public"."conquistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios_badges" ADD CONSTRAINT "usuarios_badges_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios_badges" ADD CONSTRAINT "usuarios_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkins" ADD CONSTRAINT "checkins_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notificacoes" ADD CONSTRAINT "notificacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_atividades" ADD CONSTRAINT "logs_atividades_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
