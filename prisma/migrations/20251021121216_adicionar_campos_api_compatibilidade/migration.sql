-- AlterTable
ALTER TABLE "public"."alertas_socioemocionais" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mensagem" TEXT;

-- AlterTable
ALTER TABLE "public"."respostas_socioemocionais" ADD COLUMN     "categoria" "public"."CategoriaPergunta",
ADD COLUMN     "dominio" "public"."DominioEmocional",
ADD COLUMN     "escalaItem" TEXT,
ADD COLUMN     "escalaNome" TEXT,
ADD COLUMN     "respondidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "valorNumerico" DOUBLE PRECISION,
ADD COLUMN     "valorTexto" TEXT;

-- AlterTable
ALTER TABLE "public"."sessoes_adaptativas" ADD COLUMN     "aulaId" INTEGER,
ADD COLUMN     "pausadoEm" TIMESTAMP(3),
ADD COLUMN     "scoresPorCategoria" JSONB,
ADD COLUMN     "tempoMedioResposta" INTEGER,
ADD COLUMN     "totalPerguntasEstimado" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."sessoes_adaptativas" ADD CONSTRAINT "sessoes_adaptativas_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
