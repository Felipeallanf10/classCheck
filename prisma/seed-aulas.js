const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (cuidado em produção!)
  console.log('🧹 Limpando dados antigos...')
  await prisma.avaliacaoProfessor.deleteMany()
  await prisma.avaliacaoDidatica.deleteMany()
  await prisma.avaliacaoSocioemocional.deleteMany()
  await prisma.aulaFavorita.deleteMany()
  await prisma.avaliacao.deleteMany()
  await prisma.evento.deleteMany()
  await prisma.humorRegistro.deleteMany()
  await prisma.aula.deleteMany()
  await prisma.professor.deleteMany()
  await prisma.usuario.deleteMany()

  // Criar usuário de teste
  console.log('👤 Criando usuário de teste...')
  const usuario = await prisma.usuario.create({
    data: {
      email: 'aluno@teste.com',
      nome: 'João Silva',
      role: 'ALUNO',
      ativo: true,
    },
  })

  // Criar professores
  console.log('👨‍🏫 Criando professores...')
  const professores = await Promise.all([
    prisma.professor.create({
      data: {
        nome: 'Prof. Ana Costa',
        email: 'ana.costa@escola.com',
        materia: 'Geografia',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Lucas Mendes',
        email: 'lucas.mendes@escola.com',
        materia: 'História',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Carla Santos',
        email: 'carla.santos@escola.com',
        materia: 'Matemática',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Maria Silva',
        email: 'maria.silva@escola.com',
        materia: 'Português',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. João Oliveira',
        email: 'joao.oliveira@escola.com',
        materia: 'Ciências',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Pedro Almeida',
        email: 'pedro.almeida@escola.com',
        materia: 'Educação Física',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Sarah Johnson',
        email: 'sarah.johnson@escola.com',
        materia: 'Inglês',
        ativo: true,
      },
    }),
    prisma.professor.create({
      data: {
        nome: 'Prof. Beatriz Lima',
        email: 'beatriz.lima@escola.com',
        materia: 'Arte',
        ativo: true,
      },
    }),
  ])

  // Criar aulas para hoje (13/10/2025)
  console.log('📚 Criando aulas de hoje (13/10/2025)...')
  const hoje = new Date('2025-10-13T00:00:00')
  
  const aulasHoje = await Promise.all([
    // Aula 1 - Geografia (09:00)
    prisma.aula.create({
      data: {
        titulo: 'Geografia – Continentes e Oceanos',
        descricao: 'Estudo dos continentes e suas características geográficas principais. Análise de mapas e formações terrestres.',
        materia: 'Geografia',
        dataHora: new Date('2025-10-13T09:00:00'),
        duracao: 50,
        professorId: professores[0].id,
        sala: 'Sala 201',
        status: 'CONCLUIDA',
      },
    }),
    // Aula 2 - Português (10:00)
    prisma.aula.create({
      data: {
        titulo: 'Português – Análise Sintática',
        descricao: 'Análise sintática e classes gramaticais. Exercícios práticos de identificação.',
        materia: 'Português',
        dataHora: new Date('2025-10-13T10:00:00'),
        duracao: 50,
        professorId: professores[3].id,
        sala: 'Sala 105',
        status: 'CONCLUIDA',
      },
    }),
    // Aula 3 - Matemática (11:00)
    prisma.aula.create({
      data: {
        titulo: 'Matemática – Equações do 2º Grau',
        descricao: 'Resolução de equações quadráticas usando fórmula de Bhaskara e fatoração.',
        materia: 'Matemática',
        dataHora: new Date('2025-10-13T11:00:00'),
        duracao: 50,
        professorId: professores[2].id,
        sala: 'Sala 302',
        status: 'AGENDADA',
      },
    }),
    // Aula 4 - Ciências (14:00)
    prisma.aula.create({
      data: {
        titulo: 'Ciências – Sistema Solar',
        descricao: 'Planetas, órbitas e características do sistema solar. Apresentação multimídia.',
        materia: 'Ciências',
        dataHora: new Date('2025-10-13T14:00:00'),
        duracao: 50,
        professorId: professores[4].id,
        sala: 'Lab. Ciências',
        status: 'AGENDADA',
      },
    }),
    // Aula 5 - História (15:00)
    prisma.aula.create({
      data: {
        titulo: 'História – Revolução Francesa',
        descricao: 'Contexto histórico e principais eventos da Revolução Francesa. Análise de documentos.',
        materia: 'História',
        dataHora: new Date('2025-10-13T15:00:00'),
        duracao: 50,
        professorId: professores[1].id,
        sala: 'Sala 203',
        status: 'AGENDADA',
      },
    }),
    // Aula 6 - Arte (16:00)
    prisma.aula.create({
      data: {
        titulo: 'Arte – Renascimento Italiano',
        descricao: 'Características e principais artistas do Renascimento. Análise de obras.',
        materia: 'Arte',
        dataHora: new Date('2025-10-13T16:00:00'),
        duracao: 50,
        professorId: professores[7].id,
        sala: 'Sala de Arte',
        status: 'AGENDADA',
      },
    }),
  ])

  // Criar aulas para amanhã (14/10/2025)
  console.log('📚 Criando aulas de amanhã (14/10/2025)...')
  const amanha = new Date('2025-10-14T00:00:00')
  
  const aulasAmanha = await Promise.all([
    prisma.aula.create({
      data: {
        titulo: 'Inglês – Present Perfect Tense',
        descricao: 'Uso e estrutura do Present Perfect. Exercícios de conversação.',
        materia: 'Inglês',
        dataHora: new Date('2025-10-14T08:00:00'),
        duracao: 50,
        professorId: professores[6].id,
        sala: 'Sala 104',
        status: 'AGENDADA',
      },
    }),
    prisma.aula.create({
      data: {
        titulo: 'Matemática – Porcentagem',
        descricao: 'Cálculos de porcentagem aplicados a situações do cotidiano.',
        materia: 'Matemática',
        dataHora: new Date('2025-10-14T10:00:00'),
        duracao: 50,
        professorId: professores[2].id,
        sala: 'Sala 302',
        status: 'AGENDADA',
      },
    }),
    prisma.aula.create({
      data: {
        titulo: 'Educação Física – Futsal',
        descricao: 'Técnicas e táticas do futsal. Prática em quadra.',
        materia: 'Educação Física',
        dataHora: new Date('2025-10-14T13:00:00'),
        duracao: 100,
        professorId: professores[5].id,
        sala: 'Quadra',
        status: 'AGENDADA',
      },
    }),
    prisma.aula.create({
      data: {
        titulo: 'Geografia – Clima e Vegetação',
        descricao: 'Tipos de clima e suas relações com a vegetação.',
        materia: 'Geografia',
        dataHora: new Date('2025-10-14T15:00:00'),
        duracao: 50,
        professorId: professores[0].id,
        sala: 'Sala 201',
        status: 'AGENDADA',
      },
    }),
  ])

  // Criar aulas para depois de amanhã (15/10/2025)
  console.log('📚 Criando aulas para 15/10/2025...')
  const depois = new Date('2025-10-15T00:00:00')
  
  const aulasDepois = await Promise.all([
    prisma.aula.create({
      data: {
        titulo: 'Português – Interpretação de Texto',
        descricao: 'Técnicas de leitura e interpretação de textos literários.',
        materia: 'Português',
        dataHora: new Date('2025-10-15T09:00:00'),
        duracao: 50,
        professorId: professores[3].id,
        sala: 'Sala 105',
        status: 'AGENDADA',
      },
    }),
    prisma.aula.create({
      data: {
        titulo: 'História – Império Romano',
        descricao: 'Ascensão e queda do Império Romano. Legado cultural.',
        materia: 'História',
        dataHora: new Date('2025-10-15T11:00:00'),
        duracao: 50,
        professorId: professores[1].id,
        sala: 'Sala 203',
        status: 'AGENDADA',
      },
    }),
  ])

  // Criar avaliações SOCIOEMOCIONAIS (NOVO MODELO!)
  console.log('⭐ Criando avaliações socioemocionais...')
  await Promise.all([
    // Geografia - Estado Engajado Positivo
    prisma.avaliacaoSocioemocional.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[0].id,
        valencia: 0.7,  // Positivo
        ativacao: 0.5,  // Alta energia
        estadoPrimario: 'Engajado',
        confianca: 0.92,
        totalPerguntas: 8,
        tempoResposta: 156,
        respostas: JSON.stringify([
          { perguntaId: 1, valor: 8, timestamp: Date.now() },
          { perguntaId: 5, valor: 7, timestamp: Date.now() + 1000 },
          { perguntaId: 12, valor: 9, timestamp: Date.now() + 2000 },
        ]),
      },
    }),
    // Português - Estado Calmo Positivo
    prisma.avaliacaoSocioemocional.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[1].id,
        valencia: 0.6,  // Positivo
        ativacao: -0.2, // Baixa energia (calmo)
        estadoPrimario: 'Calmo',
        confianca: 0.88,
        totalPerguntas: 7,
        tempoResposta: 142,
        respostas: JSON.stringify([
          { perguntaId: 2, valor: 7, timestamp: Date.now() },
          { perguntaId: 8, valor: 6, timestamp: Date.now() + 1000 },
        ]),
      },
    }),
  ])

  // Criar avaliações DIDÁTICAS (NOVO MODELO!)
  console.log('📝 Criando avaliações didáticas...')
  await Promise.all([
    prisma.avaliacaoDidatica.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[0].id,
        compreensaoConteudo: 5,
        ritmoAula: 3,  // Adequado
        recursosDidaticos: 4,
        engajamento: 5,
        pontoPositivo: 'Os mapas ajudaram muito a entender!',
        sugestao: 'Poderia ter mais exercícios práticos',
      },
    }),
  ])

  // Criar avaliações antigas (modelo legado - manter para compatibilidade)
  console.log('⭐ Criando avaliações legadas...')
  await Promise.all([
    prisma.avaliacao.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[5].id,
        humor: 'MUITO_FELIZ',
        nota: 5,
        feedback: 'Adorei aprender sobre Renascimento!',
      },
    }),
  ])

  // Marcar algumas aulas como favoritas
  console.log('⭐ Marcando aulas favoritas...')
  await Promise.all([
    prisma.aulaFavorita.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[0].id, // Geografia
      },
    }),
    prisma.aulaFavorita.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasHoje[1].id, // Português
      },
    }),
    prisma.aulaFavorita.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aulasAmanha[2].id, // Ed. Física
      },
    }),
  ])

  console.log('✅ Seed concluído com sucesso!')
  console.log(`
📊 Resumo:
  - ${professores.length} professores criados
  - ${aulasHoje.length} aulas criadas para hoje (13/10/2025)
  - ${aulasAmanha.length} aulas criadas para amanhã (14/10/2025)
  - ${aulasDepois.length} aulas criadas para 15/10/2025
  - 2 avaliações SOCIOEMOCIONAIS criadas (novo modelo!) 🎯
  - 1 avaliação DIDÁTICA criada (novo modelo!) 📝
  - 1 avaliação legada criada (compatibilidade)
  - 3 aulas favoritas marcadas
  - 1 usuário de teste: aluno@teste.com
  `)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
