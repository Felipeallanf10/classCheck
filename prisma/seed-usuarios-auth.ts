import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de usuários com autenticação...')

  // Hash padrão para senha "senha123"
  const senhaHash = await bcrypt.hash('senha123', 10)

  // ========================================
  // 1. CRIAR ADMIN
  // ========================================
  console.log('👤 Criando administrador...')
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
  console.log(`✅ Admin criado: ${admin.email}`)

  // ========================================
  // 2. CRIAR PROFESSORES
  // ========================================
  console.log('\n👨‍🏫 Criando professores...')
  
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
  console.log(`✅ Professor criado: ${professorMatematica.nome} - ${professorMatematica.materia}`)

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
  console.log(`✅ Professor criado: ${professorPortugues.nome} - ${professorPortugues.materia}`)

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
  console.log(`✅ Professor criado: ${professorCiencias.nome} - ${professorCiencias.materia}`)

  // ========================================
  // 3. CRIAR TURMAS
  // ========================================
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
  console.log(`✅ Turma criada: ${turma5A.nome} (${turma5A.codigo})`)

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
  console.log(`✅ Turma criada: ${turma6B.nome} (${turma6B.codigo})`)

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
  console.log(`✅ Turma criada: ${turma7C.nome} (${turma7C.codigo})`)

  // ========================================
  // 4. VINCULAR PROFESSORES ÀS TURMAS
  // ========================================
  console.log('\n🔗 Vinculando professores às turmas...')

  // Prof. Matemática -> Turma 5A e 6B
  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma5A.id,
        professorId: professorMatematica.id,
        materia: 'Matemática',
      },
    },
    update: {},
    create: {
      turmaId: turma5A.id,
      professorId: professorMatematica.id,
      materia: 'Matemática',
      ativo: true,
    },
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
    create: {
      turmaId: turma6B.id,
      professorId: professorMatematica.id,
      materia: 'Matemática',
      ativo: true,
    },
  })
  console.log(`✅ Prof. ${professorMatematica.nome} vinculado às turmas 5A e 6B`)

  // Profa. Português -> Turma 5A e 7C
  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma5A.id,
        professorId: professorPortugues.id,
        materia: 'Português',
      },
    },
    update: {},
    create: {
      turmaId: turma5A.id,
      professorId: professorPortugues.id,
      materia: 'Português',
      ativo: true,
    },
  })

  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma7C.id,
        professorId: professorPortugues.id,
        materia: 'Português',
      },
    },
    update: {},
    create: {
      turmaId: turma7C.id,
      professorId: professorPortugues.id,
      materia: 'Português',
      ativo: true,
    },
  })
  console.log(`✅ Profa. ${professorPortugues.nome} vinculada às turmas 5A e 7C`)

  // Prof. Ciências -> Todas as turmas
  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma5A.id,
        professorId: professorCiencias.id,
        materia: 'Ciências',
      },
    },
    update: {},
    create: {
      turmaId: turma5A.id,
      professorId: professorCiencias.id,
      materia: 'Ciências',
      ativo: true,
    },
  })

  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma6B.id,
        professorId: professorCiencias.id,
        materia: 'Ciências',
      },
    },
    update: {},
    create: {
      turmaId: turma6B.id,
      professorId: professorCiencias.id,
      materia: 'Ciências',
      ativo: true,
    },
  })

  await prisma.turmaProfessor.upsert({
    where: {
      turmaId_professorId_materia: {
        turmaId: turma7C.id,
        professorId: professorCiencias.id,
        materia: 'Ciências',
      },
    },
    update: {},
    create: {
      turmaId: turma7C.id,
      professorId: professorCiencias.id,
      materia: 'Ciências',
      ativo: true,
    },
  })
  console.log(`✅ Prof. ${professorCiencias.nome} vinculado a todas as turmas`)

  // ========================================
  // 5. CRIAR ALUNOS
  // ========================================
  console.log('\n👦 Criando alunos...')

  const alunosData = [
    // Turma 5A (8 alunos)
    { nome: 'Ana Paula Costa', email: 'ana.costa@aluno.com', turmaId: turma5A.id, matricula: '5A001' },
    { nome: 'Bruno Henrique Lima', email: 'bruno.lima@aluno.com', turmaId: turma5A.id, matricula: '5A002' },
    { nome: 'Carolina Souza', email: 'carolina.souza@aluno.com', turmaId: turma5A.id, matricula: '5A003' },
    { nome: 'Daniel Rodrigues', email: 'daniel.rodrigues@aluno.com', turmaId: turma5A.id, matricula: '5A004' },
    { nome: 'Eduarda Fernandes', email: 'eduarda.fernandes@aluno.com', turmaId: turma5A.id, matricula: '5A005' },
    { nome: 'Felipe Santos', email: 'felipe.santos@aluno.com', turmaId: turma5A.id, matricula: '5A006' },
    { nome: 'Gabriela Alves', email: 'gabriela.alves@aluno.com', turmaId: turma5A.id, matricula: '5A007' },
    { nome: 'Henrique Martins', email: 'henrique.martins@aluno.com', turmaId: turma5A.id, matricula: '5A008' },

    // Turma 6B (6 alunos)
    { nome: 'Isabella Pereira', email: 'isabella.pereira@aluno.com', turmaId: turma6B.id, matricula: '6B001' },
    { nome: 'João Pedro Oliveira', email: 'joao.oliveira@aluno.com', turmaId: turma6B.id, matricula: '6B002' },
    { nome: 'Larissa Cardoso', email: 'larissa.cardoso@aluno.com', turmaId: turma6B.id, matricula: '6B003' },
    { nome: 'Mateus Silva', email: 'mateus.silva@aluno.com', turmaId: turma6B.id, matricula: '6B004' },
    { nome: 'Natália Costa', email: 'natalia.costa@aluno.com', turmaId: turma6B.id, matricula: '6B005' },
    { nome: 'Otávio Ribeiro', email: 'otavio.ribeiro@aluno.com', turmaId: turma6B.id, matricula: '6B006' },

    // Turma 7C (6 alunos)
    { nome: 'Patrícia Gomes', email: 'patricia.gomes@aluno.com', turmaId: turma7C.id, matricula: '7C001' },
    { nome: 'Rafael Nascimento', email: 'rafael.nascimento@aluno.com', turmaId: turma7C.id, matricula: '7C002' },
    { nome: 'Sofia Mendes', email: 'sofia.mendes@aluno.com', turmaId: turma7C.id, matricula: '7C003' },
    { nome: 'Thiago Barbosa', email: 'thiago.barbosa@aluno.com', turmaId: turma7C.id, matricula: '7C004' },
    { nome: 'Valentina Azevedo', email: 'valentina.azevedo@aluno.com', turmaId: turma7C.id, matricula: '7C005' },
    { nome: 'William Castro', email: 'william.castro@aluno.com', turmaId: turma7C.id, matricula: '7C006' },
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

    // Vincular aluno à turma
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

    console.log(`✅ Aluno criado e vinculado: ${aluno.nome} (${alunoData.matricula})`)
  }

  // ========================================
  // 6. RESUMO
  // ========================================
  console.log('\n📊 RESUMO DO SEED:')
  console.log('='.repeat(50))
  
  const totalUsuarios = await prisma.usuario.count()
  const totalAdmins = await prisma.usuario.count({ where: { role: Role.ADMIN } })
  const totalProfessores = await prisma.usuario.count({ where: { role: Role.PROFESSOR } })
  const totalAlunos = await prisma.usuario.count({ where: { role: Role.ALUNO } })
  const totalTurmas = await prisma.turma.count()
  const totalVinculosProfessores = await prisma.turmaProfessor.count()
  const totalVinculosAlunos = await prisma.turmaAluno.count()

  console.log(`👥 Total de usuários: ${totalUsuarios}`)
  console.log(`   - Admins: ${totalAdmins}`)
  console.log(`   - Professores: ${totalProfessores}`)
  console.log(`   - Alunos: ${totalAlunos}`)
  console.log(`\n🏫 Total de turmas: ${totalTurmas}`)
  console.log(`\n🔗 Vínculos:`)
  console.log(`   - Professores → Turmas: ${totalVinculosProfessores}`)
  console.log(`   - Alunos → Turmas: ${totalVinculosAlunos}`)

  console.log('\n🔐 CREDENCIAIS DE ACESSO:')
  console.log('='.repeat(50))
  console.log('Senha padrão para todos: senha123')
  console.log('\nAdmin:')
  console.log('  📧 admin@classcheck.com')
  console.log('\nProfessores:')
  console.log('  📧 prof.matematica@classcheck.com')
  console.log('  📧 prof.portugues@classcheck.com')
  console.log('  📧 prof.ciencias@classcheck.com')
  console.log('\nAlunos (exemplos):')
  console.log('  📧 ana.costa@aluno.com')
  console.log('  📧 bruno.lima@aluno.com')
  console.log('  📧 carolina.souza@aluno.com')
  console.log('='.repeat(50))
  console.log('\n✅ Seed de usuários concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
