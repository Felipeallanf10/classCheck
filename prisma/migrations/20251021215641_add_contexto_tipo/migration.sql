-- CreateEnum
CREATE TYPE "public"."ContextoTipo" AS ENUM ('GERAL', 'AULA', 'CHECK_IN', 'EVENTO');

-- AlterTable
ALTER TABLE "public"."questionarios_socioemocionais" ADD COLUMN     "contextoPrincipal" "public"."ContextoTipo" NOT NULL DEFAULT 'GERAL';

-- AlterTable
ALTER TABLE "public"."sessoes_adaptativas" ADD COLUMN     "contextoMetadata" JSONB,
ADD COLUMN     "contextoTipo" "public"."ContextoTipo" NOT NULL DEFAULT 'GERAL',
ADD COLUMN     "eventoId" TEXT;

-- CreateIndex
CREATE INDEX "questionarios_socioemocionais_contextoPrincipal_ativo_idx" ON "public"."questionarios_socioemocionais"("contextoPrincipal", "ativo");

-- CreateIndex
CREATE INDEX "sessoes_adaptativas_contextoTipo_status_idx" ON "public"."sessoes_adaptativas"("contextoTipo", "status");
