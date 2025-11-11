import { PrismaClient, Role, TipoHumor, StatusAula } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed completo do banco de dados...\n')

  const senhaHash = await bcrypt.hash('senha123', 10)

  // ========================================
  // 1. CRIAR USUÁRIOS E TURMAS
  // ========================================
  console.log('👥 Criando usuários...')
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@classcheck.com' },
    update: {},
    create: {
      nome: 'Admin Sistema',
      email: 'admin@classcheck.com',
      senha: senhaHash,
      role: Role.ADMIN,
      ativo: true,
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  const professorMatematica = await prisma.usuario.upsert({
    where: { email: 'prof.matematica@classcheck.com' },
    update: {},
    create: {
      nome: 'Prof. João Silva',
      email: 'prof.matematica@classcheck.com',
      senha: senhaHash,
      role: Role.PROFESSOR,
      materia: 'Matemática',
      ativo: true,
    },
  })

  const professorPortugues = await prisma.usuario.upsert({
    where: { email: 'prof.portugues@classcheck.com' },
    update: {},
    create: {
      nome: 'Profa. Maria Santos',
      email: 'prof.portugues@classcheck.com',
      senha: senhaHash,
      role: Role.PROFESSOR,
      materia: 'Português',
      ativo: true,
    },
  })

  const professorCiencias = await prisma.usuario.upsert({
    where: { email: 'prof.ciencias@classcheck.com' },
    update: {},
    create: {
      nome: 'Prof. Carlos Oliveira',
      email: 'prof.ciencias@classcheck.com',
      senha: senhaHash,
      role: Role.PROFESSOR,
      materia: 'Ciências',
      ativo: true,
    },
  })
  console.log(`✅ 3 Professores criados`)

  // Criar turmas
  console.log('\n🏫 Criando turmas...')
  const turma5A = await prisma.turma.upsert({
    where: { codigo: '5A-2024' },
    update: {},
    create: {
      nome: '5º Ano A',
      codigo: '5A-2024',
      ano: '5º Ano',
      periodo: 'MANHA',
      ativa: true,
    },
  })

  const turma6B = await prisma.turma.upsert({
    where: { codigo: '6B-2024' },
    update: {},
    create: {
      nome: '6º Ano B',
      codigo: '6B-2024',
      ano: '6º Ano',
      periodo: 'TARDE',
      ativa: true,
    },
  })

  const turma7C = await prisma.turma.upsert({
    where: { codigo: '7C-2024' },
    update: {},
    create: {
      nome: '7º Ano C',
      codigo: '7C-2024',
      ano: '7º Ano',
      periodo: 'MANHA',
      ativa: true,
    },
  })
  console.log(`✅ 3 Turmas criadas`)

  // Vincular professores às turmas
  console.log('\n🔗 Vinculando professores às turmas...')
  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma5A.id,
        professorId: professorMatematica.id,
        materia: 'Matemática',
      },
    },
    update: {},
    create: { turmaId: turma5A.id, professorId: professorMatematica.id, materia: 'Matemática', ativo: true },
  })

  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma6B.id,
        professorId: professorMatematica.id,
        materia: 'Matemática',
      },
    },
    update: {},
    create: { turmaId: turma6B.id, professorId: professorMatematica.id, materia: 'Matemática', ativo: true },
  })
  console.log(`✅ Vínculos criados`)

  // Criar alunos
  console.log('\n👦 Criando alunos...')
  const alunosData = [
    { nome: 'Ana Paula Costa', email: 'ana.costa@aluno.com', turmaId: turma5A.id, matricula: '5A001' },
    { nome: 'Bruno Henrique Lima', email: 'bruno.lima@aluno.com', turmaId: turma5A.id, matricula: '5A002' },
    { nome: 'Carolina Souza', email: 'carolina.souza@aluno.com', turmaId: turma5A.id, matricula: '5A003' },
    { nome: 'Daniel Rodrigues', email: 'daniel.rodrigues@aluno.com', turmaId: turma6B.id, matricula: '6B001' },
    { nome: 'Eduarda Fernandes', email: 'eduarda.fernandes@aluno.com', turmaId: turma6B.id, matricula: '6B002' },
    { nome: 'Felipe Santos', email: 'felipe.santos@aluno.com', turmaId: turma7C.id, matricula: '7C001' },
  ]

  for (const alunoData of alunosData) {
    const aluno = await prisma.usuario.upsert({
      where: { email: alunoData.email },
      update: {},
      create: {
        nome: alunoData.nome,
        email: alunoData.email,
        senha: senhaHash,
        role: Role.ALUNO,
        ativo: true,
      },
    })

    await prisma.turmaAluno.upsert({
      where: {
        turmaId_alunoId: {
          turmaId: alunoData.turmaId,
          alunoId: aluno.id,
        },
      },
      update: {},
      create: {
        turmaId: alunoData.turmaId,
        alunoId: aluno.id,
        matricula: alunoData.matricula,
        ativo: true,
      },
    })
  }
  console.log(`✅ ${alunosData.length} Alunos criados e vinculados`)

  // ========================================
  // 2. CRIAR AULAS
  // ========================================
  console.log('\n📚 Criando aulas...')
  
  const hoje = new Date()
  const ontem = new Date(hoje)
  ontem.setDate(ontem.getDate() - 1)
  const anteontem = new Date(hoje)
  anteontem.setDate(anteontem.getDate() - 2)
  
  const aulas = []
  
  // Aulas da semana passada
  aulas.push(await prisma.aula.create({
    data: {
      titulo: 'Introdução às Frações',
      descricao: 'Conceitos básicos de frações e suas representações',
      materia: 'Matemática',
      dataHora: anteontem,
      duracao: 50,
      professorId: professorMatematica.id,
      turmaId: turma5A.id,
      sala: 'Sala 101',
      status: 'AGENDADA',
    },
  }))

  aulas.push(await prisma.aula.create({
    data: {
      titulo: 'Verbos e Conjugações',
      descricao: 'Estudo dos tempos verbais no presente',
      materia: 'Português',
      dataHora: anteontem,
      duracao: 50,
      professorId: professorPortugues.id,
      turmaId: turma5A.id,
      sala: 'Sala 102',
      status: 'AGENDADA',
    },
  }))

  aulas.push(await prisma.aula.create({
    data: {
      titulo: 'Sistema Solar',
      descricao: 'Planetas e suas características',
      materia: 'Ciências',
      dataHora: ontem,
      duracao: 50,
      professorId: professorCiencias.id,
      turmaId: turma6B.id,
      sala: 'Lab. Ciências',
      status: 'AGENDADA',
    },
  }))

  aulas.push(await prisma.aula.create({
    data: {
      titulo: 'Geometria Plana',
      descricao: 'Triângulos e suas propriedades',
      materia: 'Matemática',
      dataHora: ontem,
      duracao: 50,
      professorId: professorMatematica.id,
      turmaId: turma6B.id,
      sala: 'Sala 101',
      status: 'AGENDADA',
    },
  }))

  aulas.push(await prisma.aula.create({
    data: {
      titulo: 'Interpretação de Texto',
      descricao: 'Análise de crônicas brasileiras',
      materia: 'Português',
      dataHora: hoje,
      duracao: 50,
      professorId: professorPortugues.id,
      turmaId: turma7C.id,
      sala: 'Sala 102',
      status: 'AGENDADA',
    },
  }))

  console.log(`✅ ${aulas.length} Aulas criadas`)

  // ========================================
  // 3. CRIAR AVALIAÇÕES DE HUMOR
  // ========================================
  console.log('\n💭 Criando avaliações de humor...')
  
  const alunos = await prisma.usuario.findMany({
    where: { role: Role.ALUNO },
  })

  let avaliacoesCount = 0
  for (const aluno of alunos) {
    // Cada aluno avalia as 3 primeiras aulas
    for (let i = 0; i < Math.min(3, aulas.length); i++) {
      await prisma.avaliacao.create({
        data: {
          usuarioId: aluno.id,
          aulaId: aulas[i].id,
          humor: [TipoHumor.FELIZ, TipoHumor.MUITO_FELIZ, TipoHumor.NEUTRO, TipoHumor.TRISTE][Math.floor(Math.random() * 4)],
          nota: Math.floor(Math.random() * 3) + 3, // 3, 4 ou 5
          feedback: Math.random() > 0.5 ? 'Gostei da aula!' : undefined,
        },
      })
      avaliacoesCount++
    }
  }
  console.log(`✅ ${avaliacoesCount} Avaliações de humor criadas`)

  console.log(`\n✅ Sem questionários adaptativos (executar seed-adaptativo separadamente)`)

  // ========================================
  // RESUMO
  // ========================================
  const totalUsuarios = await prisma.usuario.count()
  const totalTurmas = await prisma.turma.count()
  const totalAulas = await prisma.aula.count()
  const totalAvaliacoes = await prisma.avaliacao.count()
  const totalAvaliacoesSocio = await prisma.avaliacaoSocioemocional.count()
  const totalCheckIns = await prisma.checkIn.count()

  console.log('\n📊 RESUMO DO SEED COMPLETO:')
  console.log('='.repeat(50))
  console.log(`👥 Usuários: ${totalUsuarios}`)
  console.log(`   - 1 Admin`)
  console.log(`   - 3 Professores`)
  console.log(`   - ${totalUsuarios - 4} Alunos`)
  console.log(`🏫 Turmas: ${totalTurmas}`)
  console.log(`📚 Aulas: ${totalAulas}`)
  console.log(`💭 Avaliações de Humor: ${totalAvaliacoes}`)
  console.log(`🧠 Avaliações Socioemocionais: ${totalAvaliacoesSocio}`)
  console.log(`✅ Check-ins: ${totalCheckIns}`)
  console.log('='.repeat(50))
  
  console.log('\n🔐 CREDENCIAIS:')
  console.log('Senha para todos: senha123')
  console.log('\nAdmin: admin@classcheck.com')
  console.log('Professores: prof.matematica@classcheck.com')
  console.log('Alunos: ana.costa@aluno.com, bruno.lima@aluno.com...')
  
  console.log('\n✅ Seed completo concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
