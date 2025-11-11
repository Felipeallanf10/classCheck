-- DropForeignKey
ALTER TABLE "public"."respostas_socioemocionais" DROP CONSTRAINT "respostas_socioemocionais_perguntaId_fkey";

-- AlterTable
ALTER TABLE "public"."respostas_socioemocionais" ADD COLUMN     "perguntaBancoId" TEXT,
ALTER COLUMN "perguntaId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "respostas_socioemocionais_perguntaBancoId_idx" ON "public"."respostas_socioemocionais"("perguntaBancoId");

-- AddForeignKey
ALTER TABLE "public"."respostas_socioemocionais" ADD CONSTRAINT "respostas_socioemocionais_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "public"."perguntas_socioemocionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas_socioemocionais" ADD CONSTRAINT "respostas_socioemocionais_perguntaBancoId_fkey" FOREIGN KEY ("perguntaBancoId") REFERENCES "public"."banco_perguntas_adaptativo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
