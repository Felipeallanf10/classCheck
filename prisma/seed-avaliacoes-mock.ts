import { PrismaClient } from '@prisma/client';
import { subDays, format } from 'date-fns';

const prisma = new PrismaClient();

// Estados emocionais do modelo circumplexo
const ESTADOS_EMOCIONAIS = [
  // Q1: Positivo + Alta Ativação
  { nome: 'Alegre', valencia: 0.7, ativacao: 0.7 },
  { nome: 'Animado', valencia: 0.8, ativacao: 0.8 },
  { nome: 'Entusiasmado', valencia: 0.6, ativacao: 0.7 },
  { nome: 'Confiante', valencia: 0.7, ativacao: 0.5 },
  
  // Q2: Positivo + Baixa Ativação
  { nome: 'Calmo', valencia: 0.6, ativacao: -0.5 },
  { nome: 'Relaxado', valencia: 0.7, ativacao: -0.6 },
  { nome: 'Satisfeito', valencia: 0.5, ativacao: -0.3 },
  { nome: 'Tranquilo', valencia: 0.6, ativacao: -0.4 },
  
  // Q3: Negativo + Baixa Ativação
  { nome: 'Triste', valencia: -0.6, ativacao: -0.5 },
  { nome: 'Desanimado', valencia: -0.5, ativacao: -0.4 },
  { nome: 'Cansado', valencia: -0.3, ativacao: -0.7 },
  { nome: 'Entediado', valencia: -0.4, ativacao: -0.6 },
  
  // Q4: Negativo + Alta Ativação
  { nome: 'Ansioso', valencia: -0.5, ativacao: 0.7 },
  { nome: 'Estressado', valencia: -0.6, ativacao: 0.8 },
  { nome: 'Frustrado', valencia: -0.5, ativacao: 0.6 },
  { nome: 'Irritado', valencia: -0.7, ativacao: 0.7 },
];

// Matérias disponíveis
const MATERIAS = [
  'Matemática',
  'Português',
  'História',
  'Geografia',
  'Ciências',
  'Inglês',
  'Educação Física',
  'Arte',
  'Física',
  'Química',
];

// Professores
const PROFESSORES = [
  'Prof. João Silva',
  'Profa. Maria Santos',
  'Prof. Carlos Oliveira',
  'Profa. Ana Costa',
  'Prof. Pedro Almeida',
  'Profa. Julia Ferreira',
  'Prof. Roberto Lima',
  'Profa. Fernanda Souza',
];

// Função para gerar variação realista (simula tendências)
function gerarValorComTendencia(base: number, dia: number, totalDias: number, volatilidade: number = 0.2): number {
  // Tendência crescente ao longo do tempo
  const tendencia = (dia / totalDias) * 0.3;
  // Ruído aleatório
  const ruido = (Math.random() - 0.5) * volatilidade;
  // Ciclo semanal (piora no meio da semana, melhora no fim)
  const cicloSemanal = Math.sin((dia % 7) * Math.PI / 3.5) * 0.15;
  
  return Math.max(-1, Math.min(1, base + tendencia + ruido + cicloSemanal));
}

async function main() {
  console.log('🌱 Iniciando seed de avaliações mock...');

  // Buscar usuário de teste (ID 52) - ALUNO
  const usuario = await prisma.usuario.findUnique({
    where: { id: 52 }
  });

  if (!usuario) {
    console.error('❌ Usuário ID 52 não encontrado. Execute o seed principal primeiro.');
    return;
  }

  console.log(`✅ Usuário (aluno) encontrado: ${usuario.nome}`);

  // Buscar ou criar professor de exemplo
  let professor = await prisma.professor.findFirst({
    where: { email: 'prof.teste@classcheck.com' }
  });

  if (!professor) {
    professor = await prisma.professor.create({
      data: {
        nome: 'Prof. Maria Silva',
        email: 'prof.teste@classcheck.com',
        materia: 'Geral',
        ativo: true,
      }
    });
    console.log(`✅ Professor criado: ${professor.nome}`);
  } else {
    console.log(`✅ Professor encontrado: ${professor.nome}`);
  }

  // Buscar todas as aulas do professor
  let aulas = await prisma.aula.findMany({
    where: { professorId: professor.id },
  });

  if (aulas.length === 0) {
    console.log('⚠️ Nenhuma aula encontrada. Criando aulas de exemplo...');
    
    // Criar aulas de exemplo para os últimos 90 dias
    const aulasParaCriar = [];
    const hoje = new Date();

    for (let i = 0; i < 90; i++) {
      const dataAula = subDays(hoje, 90 - i);
      const diaSemana = dataAula.getDay();
      
      // Pular fins de semana
      if (diaSemana === 0 || diaSemana === 6) continue;

      // 2-3 aulas por dia
      const numAulasDia = Math.random() > 0.5 ? 2 : 3;
      
      for (let j = 0; j < numAulasDia; j++) {
        const materia = MATERIAS[Math.floor(Math.random() * MATERIAS.length)];
        const hora = 8 + j * 2;
        
        aulasParaCriar.push({
          titulo: `${materia} - ${format(dataAula, 'dd/MM/yyyy')}`,
          descricao: `Aula de ${materia}`,
          materia,
          dataHora: new Date(dataAula.getFullYear(), dataAula.getMonth(), dataAula.getDate(), hora, 0),
          duracao: 120, // 2 horas
          professorId: professor.id,
          status: 'CONCLUIDA' as const,
        });
      }
    }

    // Inserir aulas em lote
    await prisma.aula.createMany({
      data: aulasParaCriar,
      skipDuplicates: true,
    });

    console.log(`✅ ${aulasParaCriar.length} aulas criadas`);
  }

  // Recarregar aulas
  const todasAulas = await prisma.aula.findMany({
    where: { professorId: professor.id },
    orderBy: { dataHora: 'asc' }
  });

  console.log(`📚 Total de aulas: ${todasAulas.length}`);

  // Limpar avaliações antigas do usuário
  await prisma.avaliacaoDidatica.deleteMany({
    where: { usuarioId: usuario.id }
  });
  await prisma.avaliacaoSocioemocional.deleteMany({
    where: { usuarioId: usuario.id }
  });

  console.log('🗑️ Avaliações antigas removidas');

  // Gerar avaliações para ~70% das aulas (nem todas foram avaliadas)
  const aulasParaAvaliar = todasAulas
    .filter(() => Math.random() > 0.3)
    .slice(0, 180); // Máximo de 180 avaliações

  console.log(`🎯 Gerando avaliações para ${aulasParaAvaliar.length} aulas...`);

  let avaliacoesCriadas = 0;
  const totalDias = aulasParaAvaliar.length;

  for (let i = 0; i < aulasParaAvaliar.length; i++) {
    const aula = aulasParaAvaliar[i];
    
    // Simular padrões realistas de estado emocional
    // Tendência geral: melhora ao longo do tempo
    const estadoBase = ESTADOS_EMOCIONAIS[Math.floor(Math.random() * ESTADOS_EMOCIONAIS.length)];
    
    const valencia = gerarValorComTendencia(estadoBase.valencia, i, totalDias, 0.3);
    const ativacao = gerarValorComTendencia(estadoBase.ativacao, i, totalDias, 0.3);
    
    // Confiança: geralmente alta, com variação
    const confianca = 0.7 + Math.random() * 0.25;
    
    // Determinar estado primário baseado no quadrante
    let estadoPrimario: string;
    if (valencia > 0 && ativacao > 0) {
      estadoPrimario = ['Alegre', 'Animado', 'Entusiasmado', 'Confiante'][Math.floor(Math.random() * 4)];
    } else if (valencia > 0 && ativacao <= 0) {
      estadoPrimario = ['Calmo', 'Relaxado', 'Satisfeito', 'Tranquilo'][Math.floor(Math.random() * 4)];
    } else if (valencia <= 0 && ativacao <= 0) {
      estadoPrimario = ['Triste', 'Desanimado', 'Cansado', 'Entediado'][Math.floor(Math.random() * 4)];
    } else {
      estadoPrimario = ['Ansioso', 'Estressado', 'Frustrado', 'Irritado'][Math.floor(Math.random() * 4)];
    }

    // Criar avaliação socioemocional
    const avaliacaoSocio = await prisma.avaliacaoSocioemocional.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aula.id,
        valencia: parseFloat(valencia.toFixed(2)),
        ativacao: parseFloat(ativacao.toFixed(2)),
        confianca: parseFloat(confianca.toFixed(2)),
        estadoPrimario,
        totalPerguntas: Math.floor(Math.random() * 8) + 5, // 5-12 perguntas
        tempoResposta: Math.floor(Math.random() * 120) + 60, // 60-180 segundos
        respostas: '[]', // JSON vazio para mock
      }
    });

    // Criar avaliação didática correspondente
    // Notas correlacionadas com valência (estado emocional positivo = notas melhores)
    const notaBase = 2.5 + (valencia + 1) * 1.25; // Converte -1,1 para escala 1-5
    const ruido = (Math.random() - 0.5);
    
    const compreensaoConteudo = Math.max(1, Math.min(5, Math.round(notaBase + ruido)));
    const engajamentoNota = Math.max(1, Math.min(5, Math.round(notaBase + (Math.random() - 0.5))));
    const ritmoAulaNota = Math.max(1, Math.min(5, Math.round(3 + (Math.random() - 0.5))));
    const recursosDidaticos = Math.max(1, Math.min(5, Math.round(notaBase + (Math.random() - 0.5) * 0.5)));

    await prisma.avaliacaoDidatica.create({
      data: {
        usuarioId: usuario.id,
        aulaId: aula.id,
        compreensaoConteudo,
        engajamento: engajamentoNota,
        ritmoAula: ritmoAulaNota,
        recursosDidaticos,
        pontoPositivo: Math.random() > 0.7 ? 'Explicação muito clara!' : null,
        pontoMelhoria: Math.random() > 0.8 ? 'Poderia ter mais exemplos práticos' : null,
        sugestao: null,
      }
    });

    avaliacoesCriadas++;
    
    if (avaliacoesCriadas % 20 === 0) {
      console.log(`  ⏳ ${avaliacoesCriadas}/${aulasParaAvaliar.length} avaliações criadas...`);
    }
  }

  console.log(`\n✅ Seed concluído com sucesso!`);
  console.log(`📊 Estatísticas:`);
  console.log(`   - Avaliações socioemocionais: ${avaliacoesCriadas}`);
  console.log(`   - Avaliações didáticas: ${avaliacoesCriadas}`);
  console.log(`   - Período: ${format(aulasParaAvaliar[0].dataHora, 'dd/MM/yyyy')} a ${format(aulasParaAvaliar[aulasParaAvaliar.length - 1].dataHora, 'dd/MM/yyyy')}`);
  console.log(`\n🎯 Você pode testar os relatórios agora!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
