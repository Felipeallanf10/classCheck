import { PrismaClient, CategoriaPergunta, DominioEmocional, TipoPergunta } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de Escalas Clínicas Validadas...\n');

  // ============ PHQ-9 (Patient Health Questionnaire) ============
  console.log('🌱 Seeding PHQ-9 - Depressão (9 perguntas)...');
  
  const phq9Perguntas = [
    {
      codigo: 'PHQ9_001',
      titulo: 'Desânimo e depressão',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu desanimado(a), deprimido(a) ou sem esperança?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'TRISTE' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.8,
      parametroB: 0.5,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_1',
      validada: true,
    },
    {
      codigo: 'PHQ9_002',
      titulo: 'Falta de interesse',
      texto: 'Nas últimas 2 semanas, com que frequência você teve pouco interesse ou prazer em fazer as coisas?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'TRISTE' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.0,
      parametroB: 0.3,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_2',
      validada: true,
    },
    {
      codigo: 'PHQ9_003',
      titulo: 'Problemas com sono',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para dormir ou permanecer dormindo, ou dormiu demais?',
      categoria: 'SONO' as CategoriaPergunta,
      dominio: 'CANSADO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.5,
      parametroB: 0.2,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_3',
      validada: true,
    },
    {
      codigo: 'PHQ9_004',
      titulo: 'Cansaço e falta de energia',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu cansado(a) ou com pouca energia?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'CANSADO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.6,
      parametroB: 0.1,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_4',
      validada: true,
    },
    {
      codigo: 'PHQ9_005',
      titulo: 'Alterações no apetite',
      texto: 'Nas últimas 2 semanas, com que frequência você teve pouco apetite ou comeu demais?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'TRISTE' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.4,
      parametroB: 0.4,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_5',
      validada: true,
    },
    {
      codigo: 'PHQ9_006',
      titulo: 'Sentimentos de fracasso',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu mal consigo mesmo(a) — ou que é um fracasso ou decepcionou sua família ou você mesmo(a)?',
      categoria: 'AUTOESTIMA' as CategoriaPergunta,
      dominio: 'TRISTE' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.1,
      parametroB: 0.7,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_6',
      validada: true,
    },
    {
      codigo: 'PHQ9_007',
      titulo: 'Dificuldade de concentração',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para se concentrar nas coisas (como ler o jornal ou assistir televisão)?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'CANSADO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.7,
      parametroB: 0.6,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_7',
      validada: true,
    },
    {
      codigo: 'PHQ9_008',
      titulo: 'Agitação ou lentidão',
      texto: 'Nas últimas 2 semanas, com que frequência você se movimentou ou falou tão devagar que outras pessoas poderiam perceber? Ou ao contrário — esteve tão agitado(a) ou inquieto(a) que você ficou andando de um lado para o outro muito mais do que de costume?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.5,
      parametroB: 0.9,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_8',
      validada: true,
    },
    {
      codigo: 'PHQ9_009',
      titulo: 'Pensamentos autodestrutivos',
      texto: 'Nas últimas 2 semanas, com que frequência você pensou em se ferir de alguma forma ou que seria melhor estar morto(a)?',
      categoria: 'DEPRESSAO' as CategoriaPergunta,
      dominio: 'TRISTE' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.5,
      parametroB: 1.2,
      parametroC: 0.0,
      escalaNome: 'PHQ-9',
      escalaItem: 'PHQ9_9',
      validada: true,
    },
  ];

  for (const pergunta of phq9Perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }
  console.log('✅ PHQ-9: 9 perguntas criadas/atualizadas');

  // ============ GAD-7 (Generalized Anxiety Disorder) ============
  console.log('\n🌱 Seeding GAD-7 - Ansiedade (7 perguntas)...');
  
  const gad7Perguntas = [
    {
      codigo: 'GAD7_001',
      titulo: 'Nervosismo e ansiedade',
      texto: 'Nas últimas 2 semanas, com que frequência você se sentiu nervoso(a), ansioso(a) ou muito tenso(a)?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.0,
      parametroB: 0.3,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_1',
      validada: true,
    },
    {
      codigo: 'GAD7_002',
      titulo: 'Preocupação descontrolada',
      texto: 'Nas últimas 2 semanas, com que frequência você não conseguiu parar de se preocupar ou não conseguiu controlar essas preocupações?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.2,
      parametroB: 0.5,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_2',
      validada: true,
    },
    {
      codigo: 'GAD7_003',
      titulo: 'Preocupação excessiva',
      texto: 'Nas últimas 2 semanas, com que frequência você se preocupou demais com várias coisas diferentes?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.9,
      parametroB: 0.2,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_3',
      validada: true,
    },
    {
      codigo: 'GAD7_004',
      titulo: 'Dificuldade para relaxar',
      texto: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para relaxar?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.8,
      parametroB: 0.4,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_4',
      validada: true,
    },
    {
      codigo: 'GAD7_005',
      titulo: 'Inquietação',
      texto: 'Nas últimas 2 semanas, com que frequência você ficou tão inquieto(a) que não conseguiu ficar parado(a)?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'NERVOSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.1,
      parametroB: 0.7,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_5',
      validada: true,
    },
    {
      codigo: 'GAD7_006',
      titulo: 'Irritabilidade',
      texto: 'Nas últimas 2 semanas, com que frequência você ficou facilmente irritado(a) ou chateado(a)?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 1.7,
      parametroB: 0.5,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_6',
      validada: true,
    },
    {
      codigo: 'GAD7_007',
      titulo: 'Medo de algo terrível',
      texto: 'Nas últimas 2 semanas, com que frequência você sentiu medo de que algo terrível pudesse acontecer?',
      categoria: 'ANSIEDADE' as CategoriaPergunta,
      dominio: 'TENSO' as DominioEmocional,
      tipoPergunta: 'ESCALA_FREQUENCIA' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Nenhuma vez' },
        { valor: 1, label: 'Vários dias' },
        { valor: 2, label: 'Mais da metade dos dias' },
        { valor: 3, label: 'Quase todos os dias' },
      ],
      parametroA: 2.3,
      parametroB: 0.9,
      parametroC: 0.0,
      escalaNome: 'GAD-7',
      escalaItem: 'GAD7_7',
      validada: true,
    },
  ];

  for (const pergunta of gad7Perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }
  console.log('✅ GAD-7: 7 perguntas criadas/atualizadas');

  // ============ WHO-5 (Well-Being Index) ============
  console.log('\n🌱 Seeding WHO-5 - Bem-Estar (5 perguntas)...');
  
  const who5Perguntas = [
    {
      codigo: 'WHO5_001',
      titulo: 'Alegria e bom humor',
      texto: 'Nas últimas 2 semanas, você se sentiu alegre e de bom humor?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      dominio: 'FELIZ' as DominioEmocional,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Todo o tempo' },
      ],
      parametroA: 1.9,
      parametroB: -0.5,
      parametroC: 0.0,
      escalaNome: 'WHO-5',
      escalaItem: 'WHO5_1',
      validada: true,
    },
    {
      codigo: 'WHO5_002',
      titulo: 'Calma e relaxamento',
      texto: 'Nas últimas 2 semanas, você se sentiu calmo(a) e relaxado(a)?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      dominio: 'CALMO' as DominioEmocional,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Todo o tempo' },
      ],
      parametroA: 1.8,
      parametroB: -0.3,
      parametroC: 0.0,
      escalaNome: 'WHO-5',
      escalaItem: 'WHO5_2',
      validada: true,
    },
    {
      codigo: 'WHO5_003',
      titulo: 'Energia e atividade',
      texto: 'Nas últimas 2 semanas, você se sentiu ativo(a) e com energia?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      dominio: 'ANIMADO' as DominioEmocional,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Todo o tempo' },
      ],
      parametroA: 2.0,
      parametroB: -0.4,
      parametroC: 0.0,
      escalaNome: 'WHO-5',
      escalaItem: 'WHO5_3',
      validada: true,
    },
    {
      codigo: 'WHO5_004',
      titulo: 'Sono restaurador',
      texto: 'Nas últimas 2 semanas, você acordou se sentindo descansado(a) e revigorado(a)?',
      categoria: 'SONO' as CategoriaPergunta,
      dominio: 'CALMO' as DominioEmocional,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Todo o tempo' },
      ],
      parametroA: 1.7,
      parametroB: -0.2,
      parametroC: 0.0,
      escalaNome: 'WHO-5',
      escalaItem: 'WHO5_4',
      validada: true,
    },
    {
      codigo: 'WHO5_005',
      titulo: 'Interesse por coisas',
      texto: 'Nas últimas 2 semanas, seu dia a dia esteve cheio de coisas que te interessam?',
      categoria: 'HUMOR_GERAL' as CategoriaPergunta,
      dominio: 'ANIMADO' as DominioEmocional,
      tipoPergunta: 'LIKERT_5' as TipoPergunta,
      opcoes: [
        { valor: 0, label: 'Em nenhum momento' },
        { valor: 1, label: 'Poucos momentos' },
        { valor: 2, label: 'Menos da metade do tempo' },
        { valor: 3, label: 'Mais da metade do tempo' },
        { valor: 4, label: 'Todo o tempo' },
      ],
      parametroA: 1.9,
      parametroB: -0.6,
      parametroC: 0.0,
      escalaNome: 'WHO-5',
      escalaItem: 'WHO5_5',
      validada: true,
    },
  ];

  for (const pergunta of who5Perguntas) {
    await prisma.bancoPerguntasAdaptativo.upsert({
      where: { codigo: pergunta.codigo },
      update: pergunta,
      create: pergunta,
    });
  }
  console.log('✅ WHO-5: 5 perguntas criadas/atualizadas');

  // ============ Estatísticas Finais ============
  console.log('\n📊 Estatísticas Finais:');
  const total = await prisma.bancoPerguntasAdaptativo.count();
  const porEscala = await prisma.bancoPerguntasAdaptativo.groupBy({
    by: ['escalaNome'],
    _count: true,
  });

  console.log(`   Total de perguntas no banco: ${total}`);
  console.log('   Por escala clínica:');
  porEscala.forEach((item) => {
    if (item.escalaNome) {
      console.log(`     - ${item.escalaNome}: ${item._count} perguntas`);
    }
  });

  console.log('\n✅ Seed de escalas clínicas concluído com sucesso!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
