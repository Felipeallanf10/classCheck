-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TipoHumor" AS ENUM ('MUITO_TRISTE', 'TRISTE', 'NEUTRO', 'FELIZ', 'MUITO_FELIZ');

-- CreateEnum
CREATE TYPE "public"."StatusAula" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "public"."TipoEvento" AS ENUM ('AULA', 'PROVA', 'EVENTO', 'FERIADO', 'REUNIAO');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'ALUNO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."professores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "avatar" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."aulas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "materia" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "sala" TEXT,
    "status" "public"."StatusAula" NOT NULL DEFAULT 'AGENDADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avaliacoes" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "humor" "public"."TipoHumor" NOT NULL,
    "nota" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avaliacoes_socioemocionais" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "valencia" DOUBLE PRECISION NOT NULL,
    "ativacao" DOUBLE PRECISION NOT NULL,
    "estadoPrimario" TEXT NOT NULL,
    "confianca" DOUBLE PRECISION NOT NULL,
    "totalPerguntas" INTEGER NOT NULL,
    "tempoResposta" INTEGER NOT NULL,
    "respostas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_socioemocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avaliacoes_didaticas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "compreensaoConteudo" INTEGER NOT NULL,
    "ritmoAula" INTEGER NOT NULL,
    "recursosDidaticos" INTEGER NOT NULL,
    "engajamento" INTEGER NOT NULL,
    "pontoPositivo" TEXT,
    "pontoMelhoria" TEXT,
    "sugestao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_didaticas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avaliacoes_professores" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "dominioConteudo" INTEGER NOT NULL,
    "clarezaExplicacao" INTEGER NOT NULL,
    "pontualidade" INTEGER NOT NULL,
    "organizacao" INTEGER NOT NULL,
    "acessibilidade" INTEGER NOT NULL,
    "empatia" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacoes_professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."humor_registros" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "humor" "public"."TipoHumor" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "humor_registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."aulas_favoritas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aulas_favoritas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."eventos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "cor" TEXT,
    "tipo" "public"."TipoEvento" NOT NULL DEFAULT 'EVENTO',
    "aulaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "professores_email_key" ON "public"."professores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_usuarioId_aulaId_key" ON "public"."avaliacoes"("usuarioId", "aulaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_socioemocionais_usuarioId_aulaId_key" ON "public"."avaliacoes_socioemocionais"("usuarioId", "aulaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_didaticas_usuarioId_aulaId_key" ON "public"."avaliacoes_didaticas"("usuarioId", "aulaId");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_professores_usuarioId_professorId_periodo_key" ON "public"."avaliacoes_professores"("usuarioId", "professorId", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "humor_registros_usuarioId_data_key" ON "public"."humor_registros"("usuarioId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "aulas_favoritas_usuarioId_aulaId_key" ON "public"."aulas_favoritas"("usuarioId", "aulaId");

-- AddForeignKey
ALTER TABLE "public"."aulas" ADD CONSTRAINT "aulas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."professores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes" ADD CONSTRAINT "avaliacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes" ADD CONSTRAINT "avaliacoes_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_socioemocionais" ADD CONSTRAINT "avaliacoes_socioemocionais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_socioemocionais" ADD CONSTRAINT "avaliacoes_socioemocionais_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_didaticas" ADD CONSTRAINT "avaliacoes_didaticas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_didaticas" ADD CONSTRAINT "avaliacoes_didaticas_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avaliacoes_professores" ADD CONSTRAINT "avaliacoes_professores_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."professores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."humor_registros" ADD CONSTRAINT "humor_registros_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."aulas_favoritas" ADD CONSTRAINT "aulas_favoritas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."aulas_favoritas" ADD CONSTRAINT "aulas_favoritas_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."aulas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
