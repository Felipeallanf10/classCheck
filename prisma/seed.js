const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Criar professores de exemplo
  const professor1 = await prisma.professor.create({
    data: {
      nome: 'Maria Silva',
      email: 'maria.silva@escola.com',
      materia: 'Matemática',
      ativo: true,
    },
  })

  const professor2 = await prisma.professor.create({
    data: {
      nome: 'João Santos',
      email: 'joao.santos@escola.com',
      materia: 'História',
      ativo: true,
    },
  })

  // Criar usuários de exemplo
  const aluno1 = await prisma.usuario.create({
    data: {
      nome: 'Ana Costa',
      email: 'ana.costa@aluno.com',
      role: 'ALUNO',
      ativo: true,
    },
  })

  const aluno2 = await prisma.usuario.create({
    data: {
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@aluno.com',
      role: 'ALUNO',
      ativo: true,
    },
  })

  // Criar aulas de exemplo
  const aula1 = await prisma.aula.create({
    data: {
      titulo: 'Álgebra Linear',
      descricao: 'Introdução aos conceitos básicos de álgebra linear',
      materia: 'Matemática',
      dataHora: new Date('2024-10-10T09:00:00'),
      duracao: 60,
      professorId: professor1.id,
      sala: 'Sala 101',
      status: 'AGENDADA',
    },
  })

  const aula2 = await prisma.aula.create({
    data: {
      titulo: 'História do Brasil',
      descricao: 'Período colonial brasileiro',
      materia: 'História',
      dataHora: new Date('2024-10-10T14:00:00'),
      duracao: 90,
      professorId: professor2.id,
      sala: 'Sala 205',
      status: 'AGENDADA',
    },
  })

  // Criar avaliações de exemplo
  await prisma.avaliacao.create({
    data: {
      usuarioId: aluno1.id,
      aulaId: aula1.id,
      humor: 'FELIZ',
      nota: 5,
      feedback: 'Aula muito boa, professora explica muito bem!',
    },
  })

  await prisma.avaliacao.create({
    data: {
      usuarioId: aluno2.id,
      aulaId: aula1.id,
      humor: 'NEUTRO',
      nota: 4,
      feedback: 'Conteúdo interessante mas um pouco difícil.',
    },
  })

  // Criar registros de humor
  await prisma.humorRegistro.create({
    data: {
      usuarioId: aluno1.id,
      humor: 'FELIZ',
      data: new Date(),
      observacao: 'Me sentindo bem hoje!',
    },
  })

  console.log('Dados de exemplo criados com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
