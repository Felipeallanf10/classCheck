/*
  Warnings:

  - You are about to drop the `professores` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `senha` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Periodo" AS ENUM ('MANHA', 'TARDE', 'NOITE', 'INTEGRAL');

-- DropForeignKey
ALTER TABLE "aulas" DROP CONSTRAINT "aulas_professorId_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes_professores" DROP CONSTRAINT "avaliacoes_professores_professorId_fkey";

-- AlterTable
ALTER TABLE "aulas" ADD COLUMN     "turmaId" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "materia" TEXT,
ADD COLUMN     "senha" TEXT NOT NULL;

-- DropTable
DROP TABLE "professores";

-- CreateTable
CREATE TABLE "turmas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "periodo" "Periodo" NOT NULL DEFAULT 'MANHA',
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas_alunos" (
    "id" SERIAL NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "matricula" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas_professores" (
    "id" SERIAL NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "materia" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_professores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "turmas_codigo_key" ON "turmas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_alunos_turmaId_alunoId_key" ON "turmas_alunos"("turmaId", "alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_professores_turmaId_professorId_materia_key" ON "turmas_professores"("turmaId", "professorId", "materia");

-- AddForeignKey
ALTER TABLE "turmas_alunos" ADD CONSTRAINT "turmas_alunos_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas_alunos" ADD CONSTRAINT "turmas_alunos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas_professores" ADD CONSTRAINT "turmas_professores_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas_professores" ADD CONSTRAINT "turmas_professores_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
