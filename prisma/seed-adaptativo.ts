/**
 * Seed do Banco de Dados - Sistema Adaptativo
 * 
 * Popula o banco com questionários validados e dados iniciais
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // Limpar APENAS dados do seed adaptativo (PHQ-9, WHO-5)
    console.log('🧹 Limpando dados existentes do seed adaptativo...');
    
    // Deletar perguntas de PHQ-9 e WHO-5
    const existingPhq9 = await prisma.questionarioSocioemocional.findFirst({
      where: { titulo: { contains: 'PHQ-9' } }
    });
    const existingWho5 = await prisma.questionarioSocioemocional.findFirst({
      where: { titulo: { contains: 'WHO-5' } }
    });
    
    if (existingPhq9) {
      await prisma.perguntaSocioemocional.deleteMany({
        where: { questionarioId: existingPhq9.id }
      });
      await prisma.questionarioSocioemocional.delete({
        where: { id: existingPhq9.id }
      });
    }
    
    if (existingWho5) {
      await prisma.perguntaSocioemocional.deleteMany({
        where: { questionarioId: existingWho5.id }
      });
      await prisma.questionarioSocioemocional.delete({
        where: { id: existingWho5.id }
      });
    }
    
    // Limpar conquistas e badges se necessário
    await prisma.usuarioBadge.deleteMany();
    await prisma.usuarioConquista.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.conquista.deleteMany();
    
    console.log('✅ Limpeza concluída!\n');

    // ==============================================
    // WHO-5 - Well-Being Index
    // ==============================================
    console.log('📝 Criando WHO-5...');
    
    const who5 = await prisma.questionarioSocioemocional.create({
      data: {
        titulo: 'WHO-5 - Índice de Bem-Estar',
        descricao: 'Questionário da OMS para avaliar bem-estar geral nas últimas duas semanas.',
        tipo: 'AUTOAVALIACAO',
        versao: '1998',
        duracaoEstimada: 2,
        categorias: ['BEM_ESTAR', 'HUMOR_GERAL', 'SONO', 'ENERGIA'],
        adaptativo: false,
        instrucoes: 'Para cada afirmação, indique como você se sentiu nas últimas duas semanas.',
        tempoMinimo: 60,
        tempoMaximo: 300,
        idadeMinima: 13,
        ativo: true,
        oficial: true,
        publicado: true
      }
    });

    const perguntasWHO5 = [
      {
        texto: 'Nas últimas duas semanas, eu me senti alegre e de bom humor',
        categoria: 'BEM_ESTAR' as const,
        dominio: 'FELIZ' as const,
        ordem: 1
      },
      {
        texto: 'Nas últimas duas semanas, eu me senti calmo(a) e relaxado(a)',
        categoria: 'BEM_ESTAR' as const,
        dominio: 'CALMO' as const,
        ordem: 2
      },
      {
        texto: 'Nas últimas duas semanas, eu me senti ativo(a) e vigoroso(a)',
        categoria: 'ENERGIA' as const,
        dominio: 'ANIMADO' as const,
        ordem: 3
      },
      {
        texto: 'Nas últimas duas semanas, eu acordei me sentindo fresco(a) e descansado(a)',
        categoria: 'SONO' as const,
        dominio: 'RELAXADO' as const,
        ordem: 4
      },
      {
        texto: 'Nas últimas duas semanas, meu dia a dia tem sido cheio de coisas que me interessam',
        categoria: 'BEM_ESTAR' as const,
        dominio: 'CONTENTE' as const,
        ordem: 5
      }
    ];

    for (const p of perguntasWHO5) {
      await prisma.perguntaSocioemocional.create({
        data: {
          questionarioId: who5.id,
          texto: p.texto,
          categoria: p.categoria,
          dominio: p.dominio,
          tipoPergunta: 'LIKERT_5',
          obrigatoria: true,
          ordem: p.ordem,
          opcoes: {
            opcoes: [
              { valor: 0, label: 'Em nenhum momento' },
              { valor: 1, label: 'Raramente' },
              { valor: 2, label: 'Menos da metade do tempo' },
              { valor: 3, label: 'Mais da metade do tempo' },
              { valor: 4, label: 'A maior parte do tempo' },
              { valor: 5, label: 'O tempo todo' }
            ]
          },
          valorMinimo: 0,
          valorMaximo: 5,
          dificuldade: 0.3,
          discriminacao: 1.2,
          peso: 1.0,
          escalaNome: 'WHO-5',
          escalaItem: `WHO5_${p.ordem}`,
          tags: ['bem-estar', 'who-5'],
          palavrasChave: ['bem-estar', 'humor', 'sono', 'energia'],
          ativo: true,
          validada: true
        }
      });
    }
    console.log('✅ WHO-5 criado com sucesso!');

    // ==============================================
    // PHQ-9 - Patient Health Questionnaire
    // ==============================================
    console.log('\n📝 Criando PHQ-9...');
    
    const phq9 = await prisma.questionarioSocioemocional.create({
      data: {
        titulo: 'PHQ-9 - Questionário de Saúde do Paciente',
        descricao: 'Instrumento para rastreamento de depressão (DSM-IV).',
        tipo: 'AUTOAVALIACAO',
        versao: '1999',
        duracaoEstimada: 3,
        categorias: ['DEPRESSAO', 'SONO', 'ENERGIA', 'CONCENTRACAO', 'AUTOESTIMA'],
        adaptativo: true,
        nivelAdaptacao: 'MEDIO',
        instrucoes: 'Nas últimas duas semanas, com que frequência você foi incomodado pelos seguintes problemas?',
        tempoMinimo: 90,
        tempoMaximo: 480,
        idadeMinima: 16,
        ativo: true,
        oficial: true,
        publicado: true
      }
    });

    const perguntasPHQ9 = [
      {
        texto: 'Pouco interesse ou prazer em fazer as coisas',
        categoria: 'DEPRESSAO' as const,
        dominio: 'ENTEDIADO' as const,
        dificuldade: 0.2
      },
      {
        texto: 'Sentindo-se para baixo, deprimido(a) ou sem esperança',
        categoria: 'DEPRESSAO' as const,
        dominio: 'DEPRIMIDO' as const,
        dificuldade: 0.3
      },
      {
        texto: 'Dificuldade para dormir ou dormir demais',
        categoria: 'SONO' as const,
        dominio: 'CANSADO' as const,
        dificuldade: 0.4
      },
      {
        texto: 'Sentindo-se cansado(a) ou com pouca energia',
        categoria: 'FADIGA' as const,
        dominio: 'LETARGICO' as const,
        dificuldade: 0.3
      },
      {
        texto: 'Falta de apetite ou comendo demais',
        categoria: 'SAUDE_FISICA' as const,
        dominio: 'DEPRIMIDO' as const,
        dificuldade: 0.4
      },
      {
        texto: 'Sentindo-se mal consigo mesmo(a) ou que você é um fracasso',
        categoria: 'AUTOESTIMA' as const,
        dominio: 'TRISTE' as const,
        dificuldade: 0.6
      },
      {
        texto: 'Dificuldade para se concentrar nas coisas',
        categoria: 'CONCENTRACAO' as const,
        dominio: 'DEPRIMIDO' as const,
        dificuldade: 0.5
      },
      {
        texto: 'Lentidão para se movimentar ou falar, ou muito agitado(a)',
        categoria: 'SAUDE_FISICA' as const,
        dominio: 'ANSIOSO' as const,
        dificuldade: 0.7
      },
      {
        texto: 'Pensamentos de que seria melhor você morrer ou de se ferir',
        categoria: 'PENSAMENTOS_NEGATIVOS' as const,
        dominio: 'DEPRIMIDO' as const,
        dificuldade: 0.9
      }
    ];

    for (let i = 0; i < perguntasPHQ9.length; i++) {
      const p = perguntasPHQ9[i];
      await prisma.perguntaSocioemocional.create({
        data: {
          questionarioId: phq9.id,
          texto: p.texto,
          categoria: p.categoria,
          dominio: p.dominio,
          tipoPergunta: 'LIKERT_5',
          obrigatoria: true,
          ordem: i + 1,
          opcoes: {
            opcoes: [
              { valor: 0, label: 'Nenhuma vez' },
              { valor: 1, label: 'Vários dias' },
              { valor: 2, label: 'Mais da metade dos dias' },
              { valor: 3, label: 'Quase todos os dias' }
            ]
          },
          valorMinimo: 0,
          valorMaximo: 3,
          dificuldade: p.dificuldade,
          discriminacao: 1.5,
          peso: i === 8 ? 2.0 : 1.0, // Última pergunta tem peso maior (risco)
          escalaNome: 'PHQ-9',
          escalaItem: `PHQ9_${i + 1}`,
          tags: ['depressão', 'phq-9', 'saúde mental'],
          palavrasChave: ['depressão', 'tristeza', 'sono', 'energia'],
          ativo: true,
          validada: true
        }
      });
    }
    console.log('✅ PHQ-9 criado com sucesso!');

    // ==============================================
    // Regras de Adaptação
    // ==============================================
    console.log('\n📋 Criando Regras de Adaptação...');

    // Regra: Alerta Depressão Grave
    await prisma.regraAdaptacao.create({
      data: {
        questionarioId: phq9.id,
        nome: 'Alerta Depressão Grave',
        descricao: 'Dispara alerta quando score PHQ-9 indica depressão grave',
        prioridade: 10,
        condicoes: {
          all: [
            { fact: 'scores', path: '$.DEPRESSAO', operator: 'greaterThanInclusive', value: 15 }
          ]
        },
        acoes: [
          {
            type: 'CRIAR_ALERTA',
            params: {
              nivel: 'VERMELHO',
              tipo: 'DEPRESSAO_GRAVE',
              titulo: 'Sintomas de Depressão Grave',
              descricao: 'Score PHQ-9 indica sintomas graves. Recomenda-se avaliação urgente.'
            }
          }
        ],
        tipoCondicao: 'MAIOR_OU_IGUAL',
        tipoAcao: ['CRIAR_ALERTA'],
        eventoGatilho: 'FIM_QUESTIONARIO',
        ativo: true
      }
    });

    // Regra: Risco Suicídio
    await prisma.regraAdaptacao.create({
      data: {
        questionarioId: phq9.id,
        nome: 'Alerta Risco Suicídio',
        descricao: 'Dispara alerta urgente se houver pensamentos suicidas',
        prioridade: 100,
        condicoes: {
          all: [
            { fact: 'resposta', path: '$.escalaItem', operator: 'equal', value: 'PHQ9_9' },
            { fact: 'resposta', path: '$.valor', operator: 'greaterThan', value: 0 }
          ]
        },
        acoes: [
          {
            type: 'CRIAR_ALERTA',
            params: {
              nivel: 'VERMELHO',
              tipo: 'RISCO_SUICIDIO',
              titulo: '⚠️ ALERTA URGENTE: Risco Detectado',
              descricao: 'Pensamentos sobre morte/autolesão detectados. AÇÃO IMEDIATA.'
            }
          },
          {
            type: 'NOTIFICAR_PROFISSIONAL',
            params: {
              urgencia: 'CRITICA'
            }
          }
        ],
        tipoCondicao: 'VALOR_EXATO',
        tipoAcao: ['CRIAR_ALERTA', 'NOTIFICAR_PROFISSIONAL'],
        eventoGatilho: 'RESPOSTA_INDIVIDUAL',
        executarUmaVez: true,
        ativo: true
      }
    });

    console.log('✅ Regras criadas com sucesso!');

    // ==============================================
    // Conquistas
    // ==============================================
    console.log('\n🏆 Criando Conquistas...');

    await prisma.conquista.createMany({
      data: [
        {
          codigo: 'FIRST_EVALUATION',
          titulo: 'Primeira Avaliação',
          descricao: 'Complete sua primeira avaliação socioemocional',
          categoria: 'ENGAJAMENTO',
          xp: 50,
          icone: '🎯',
          raridade: 'COMUM',
          criterios: { tipo: 'COMPLETAR_AVALIACAO', quantidade: 1 },
          ativo: true,
          oculta: false
        },
        {
          codigo: 'SELF_KNOWLEDGE',
          titulo: 'Autoconhecimento',
          descricao: 'Complete 5 avaliações socioemocionais',
          categoria: 'PROGRESSO',
          xp: 200,
          icone: '🧠',
          raridade: 'INCOMUM',
          criterios: { tipo: 'COMPLETAR_AVALIACAO', quantidade: 5 },
          ativo: true,
          oculta: false
        },
        {
          codigo: 'WEEKLY_STREAK',
          titulo: 'Jornada Semanal',
          descricao: 'Complete avaliações por 7 dias seguidos',
          categoria: 'CONSISTENCIA',
          xp: 150,
          icone: '📅',
          raridade: 'RARO',
          criterios: { tipo: 'DIAS_CONSECUTIVOS', quantidade: 7 },
          ativo: true,
          oculta: false
        }
      ]
    });

    console.log('✅ Conquistas criadas!');

    // ==============================================
    // Badges
    // ==============================================
    console.log('\n🎖️ Criando Badges...');

    await prisma.badge.createMany({
      data: [
        {
          codigo: 'EMOTIONAL_EXPLORER',
          titulo: 'Explorador Emocional',
          descricao: 'Explore todos os questionários disponíveis',
          tipo: 'PERMANENTE',
          categoria: 'CONQUISTA',
          criterios: { tipo: 'COMPLETAR_TODOS_QUESTIONARIOS' },
          icone: '🔍',
          ativo: true
        },
        {
          codigo: 'MIND_WARRIOR',
          titulo: 'Guerreiro da Mente',
          descricao: 'Supere desafios emocionais com resiliência',
          tipo: 'PERMANENTE',
          categoria: 'QUALIDADE',
          criterios: { tipo: 'MELHORIA_SCORE', porcentagem: 30 },
          icone: '⚔️',
          ativo: true
        },
        {
          codigo: 'DEDICATED_STUDENT',
          titulo: 'Aluno Dedicado',
          descricao: 'Mantenha frequência consistente nas avaliações',
          tipo: 'PERMANENTE',
          categoria: 'FREQUENCIA',
          criterios: { tipo: 'DIAS_CONSECUTIVOS', minimo: 14 },
          icone: '📚',
          ativo: true
        }
      ]
    });

    console.log('✅ Badges criados!');

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('   - 2 questionários (WHO-5, PHQ-9)');
    console.log('   - 14 perguntas socioemocionais');
    console.log('   - 2 regras de adaptação');
    console.log('   - 3 conquistas');
    console.log('   - 3 badges');

  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
