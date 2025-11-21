-- CreateEnum
CREATE TYPE "GranularidadeMetrica" AS ENUM ('DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL');

-- CreateTable
CREATE TABLE "logs_adaptativos" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "perguntaBancoId" TEXT,
    "regraAplicada" TEXT NOT NULL,
    "motivoSelecao" TEXT,
    "algoritmo" TEXT NOT NULL DEFAULT 'IRT',
    "thetaAtual" DOUBLE PRECISION,
    "informacaoFisher" DOUBLE PRECISION,
    "parametroA" DOUBLE PRECISION,
    "parametroB" DOUBLE PRECISION,
    "parametroC" DOUBLE PRECISION,
    "perguntasDisponiveis" INTEGER,
    "categoria" TEXT,
    "dominio" TEXT,
    "respostaValor" JSONB,
    "thetaAposResposta" DOUBLE PRECISION,
    "erroAposResposta" DOUBLE PRECISION,
    "gatilhosAtivados" TEXT[],
    "condicoesAvaliadas" JSONB,
    "ordem" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tempoDecisao" INTEGER,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "fonte" TEXT,

    CONSTRAINT "logs_adaptativos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_socioemocionais" (
    "id" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFim" TIMESTAMP(3) NOT NULL,
    "granularidade" "GranularidadeMetrica" NOT NULL,
    "categoria" "CategoriaPergunta",
    "dominio" "DominioEmocional",
    "scoreMinimo" DOUBLE PRECISION NOT NULL,
    "scoreMaximo" DOUBLE PRECISION NOT NULL,
    "scoreMedio" DOUBLE PRECISION NOT NULL,
    "scoreMediana" DOUBLE PRECISION,
    "desvioPadrao" DOUBLE PRECISION,
    "thetaMedio" DOUBLE PRECISION,
    "thetaMinimo" DOUBLE PRECISION,
    "thetaMaximo" DOUBLE PRECISION,
    "confiancaMedia" DOUBLE PRECISION,
    "valenciaMedia" DOUBLE PRECISION,
    "ativacaoMedia" DOUBLE PRECISION,
    "totalSessoes" INTEGER NOT NULL,
    "totalRespostas" INTEGER NOT NULL,
    "taxaResposta" DOUBLE PRECISION,
    "tempoMedioResposta" DOUBLE PRECISION,
    "tendencia" TEXT,
    "variacaoPercent" DOUBLE PRECISION,
    "alertasVermelhos" INTEGER NOT NULL DEFAULT 0,
    "alertasLaranjas" INTEGER NOT NULL DEFAULT 0,
    "alertasAmarelos" INTEGER NOT NULL DEFAULT 0,
    "scorePHQ9" DOUBLE PRECISION,
    "scoreGAD7" DOUBLE PRECISION,
    "scoreWHO5" DOUBLE PRECISION,
    "calculadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versao" TEXT NOT NULL DEFAULT '1.0',

    CONSTRAINT "metricas_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_adaptativos_sessaoId_ordem_idx" ON "logs_adaptativos"("sessaoId", "ordem");

-- CreateIndex
CREATE INDEX "logs_adaptativos_usuarioId_timestamp_idx" ON "logs_adaptativos"("usuarioId", "timestamp");

-- CreateIndex
CREATE INDEX "logs_adaptativos_regraAplicada_timestamp_idx" ON "logs_adaptativos"("regraAplicada", "timestamp");

-- CreateIndex
CREATE INDEX "logs_adaptativos_algoritmo_timestamp_idx" ON "logs_adaptativos"("algoritmo", "timestamp");

-- CreateIndex
CREATE INDEX "metricas_socioemocionais_usuarioId_periodoInicio_periodoFim_idx" ON "metricas_socioemocionais"("usuarioId", "periodoInicio", "periodoFim");

-- CreateIndex
CREATE INDEX "metricas_socioemocionais_categoria_periodoInicio_idx" ON "metricas_socioemocionais"("categoria", "periodoInicio");

-- CreateIndex
CREATE INDEX "metricas_socioemocionais_granularidade_periodoInicio_idx" ON "metricas_socioemocionais"("granularidade", "periodoInicio");

-- CreateIndex
CREATE INDEX "metricas_socioemocionais_calculadoEm_idx" ON "metricas_socioemocionais"("calculadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "metricas_socioemocionais_usuarioId_categoria_granularidade__key" ON "metricas_socioemocionais"("usuarioId", "categoria", "granularidade", "periodoInicio");

-- AddForeignKey
ALTER TABLE "logs_adaptativos" ADD CONSTRAINT "logs_adaptativos_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes_adaptativas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_adaptativos" ADD CONSTRAINT "logs_adaptativos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricas_socioemocionais" ADD CONSTRAINT "metricas_socioemocionais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
