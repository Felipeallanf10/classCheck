import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/sessoes/[id]/resultado
 * 
 * Retorna resultado completo de uma sessão finalizada
 * 
 * Inclui:
 * - Dados da sessão
 * - Scores por categoria
 * - IRT (theta, erro, confiança)
 * - Alertas gerados
 * - Histórico de respostas
 * - Recomendações
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar sessão completa
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id },
      include: {
        questionario: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            tipo: true,
            adaptativo: true,
            duracaoEstimada: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true,
          },
        },
        respostas: {
          include: {
            pergunta: {
              select: {
                id: true,
                texto: true,
                textoAuxiliar: true,
                categoria: true,
                dominio: true,
                tipoPergunta: true,
                opcoes: true,
                valorMinimo: true,
                valorMaximo: true,
                peso: true,
              },
            },
          },
          orderBy: {
            ordem: 'asc',
          },
        },
        alertas: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!sessao) {
      return NextResponse.json(
        { erro: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se sessão foi finalizada
    if (sessao.status !== 'FINALIZADA') {
      return NextResponse.json(
        { erro: 'Sessão ainda não foi finalizada' },
        { status: 400 }
      );
    }

    // Calcular scores por categoria
    const scoresPorCategoria = calcularScoresPorCategoria(sessao.respostas);

    // Calcular score total
    const scoreTotal = calcularScoreTotal(sessao.respostas);

    // Calcular tempo total
    const tempoTotal = sessao.finalizadoEm && sessao.iniciadoEm
      ? Math.floor((sessao.finalizadoEm.getTime() - sessao.iniciadoEm.getTime()) / 1000)
      : 0;

    // Calcular tempo médio por resposta
    const tempoMedioResposta = sessao.respostas.length > 0
      ? Math.floor(tempoTotal / sessao.respostas.length)
      : 0;

    // Gerar recomendações baseadas no nível de alerta
    const recomendacoes = gerarRecomendacoes(
      sessao.nivelAlerta,
      scoresPorCategoria,
      sessao.questionario.tipo
    );

    // Calcular dados do Circumplex (se houver)
    const circumplex = calcularCircumplex(sessao.respostas);

    // Formatar resposta
    const resultado = {
      success: true,
      sessao: {
        id: sessao.id,
        status: sessao.status,
        iniciadaEm: sessao.iniciadoEm,
        finalizadaEm: sessao.finalizadoEm,
        tempoTotal,
        tempoMedioResposta,
      },
      questionario: sessao.questionario,
      usuario: sessao.usuario,
      scores: {
        total: scoreTotal,
        porCategoria: scoresPorCategoria,
        interpretacao: interpretarScore(scoreTotal, sessao.questionario.tipo),
      },
      irt: {
        theta: sessao.thetaEstimado || 0,
        erro: sessao.erroEstimacao || 1,
        confianca: sessao.confianca || 0,
      },
      circumplex,
      nivelAlerta: sessao.nivelAlerta,
      alertas: sessao.alertas.map(alerta => ({
        id: alerta.id,
        tipo: alerta.tipo,
        nivel: alerta.nivel,
        categoria: alerta.categoria,
        mensagem: alerta.mensagem,
        descricao: alerta.descricao,
        recomendacoes: alerta.recomendacoes,
        criadoEm: alerta.criadoEm,
      })),
      recomendacoes,
      respostas: sessao.respostas
        .filter(resposta => resposta.pergunta !== null)
        .map(resposta => ({
          id: resposta.id,
          ordem: resposta.ordem,
          pergunta: {
            id: resposta.pergunta!.id,
            texto: resposta.pergunta!.texto,
            textoAuxiliar: resposta.pergunta!.textoAuxiliar,
            categoria: resposta.pergunta!.categoria,
            dominio: resposta.pergunta!.dominio,
            tipo: resposta.pergunta!.tipoPergunta,
            opcoes: resposta.pergunta!.opcoes,
            peso: resposta.pergunta!.peso,
          },
          resposta: {
            valor: resposta.valorTexto || resposta.valorNumerico || resposta.valor,
            valorNormalizado: resposta.valorNormalizado,
          },
          tempoResposta: resposta.tempoResposta,
          timestamp: resposta.timestamp,
        })),
      estatisticas: {
        totalPerguntas: sessao.respostas.length,
        perguntasObrigatorias: sessao.respostas.filter(r => r.pergunta && r.pergunta.peso && r.pergunta.peso > 1).length,
        tempoTotal,
        tempoMedioResposta,
        taxaConclusao: 100, // Sempre 100% pois sessão finalizada
      },
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('[API] Erro ao buscar resultado da sessão:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar resultado da sessão',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * Calcula scores por categoria
 */
function calcularScoresPorCategoria(respostas: any[]): Record<string, number> {
  const scoresPorCategoria: Record<string, { soma: number; count: number }> = {};

  for (const resposta of respostas) {
    const categoria = resposta.pergunta.categoria;
    if (!categoria) continue;

    const valor = resposta.valorNormalizado || 0;
    const peso = resposta.pergunta.peso || 1;

    if (!scoresPorCategoria[categoria]) {
      scoresPorCategoria[categoria] = { soma: 0, count: 0 };
    }

    scoresPorCategoria[categoria].soma += valor * peso;
    scoresPorCategoria[categoria].count += peso;
  }

  // Calcular médias
  const scores: Record<string, number> = {};
  for (const [categoria, dados] of Object.entries(scoresPorCategoria)) {
    scores[categoria] = dados.count > 0 ? dados.soma / dados.count : 0;
  }

  return scores;
}

/**
 * Calcula score total da sessão
 */
function calcularScoreTotal(respostas: any[]): number {
  if (respostas.length === 0) return 0;

  let somaTotal = 0;
  let pesoTotal = 0;

  for (const resposta of respostas) {
    const valor = resposta.valorNormalizado || 0;
    const peso = resposta.pergunta.peso || 1;

    somaTotal += valor * peso;
    pesoTotal += peso;
  }

  return pesoTotal > 0 ? (somaTotal / pesoTotal) * 100 : 0;
}

/**
 * Interpreta score baseado no tipo de questionário
 */
function interpretarScore(score: number, tipoQuestionario: string): string {
  // PHQ-9 (Depressão)
  if (tipoQuestionario === 'AUTOAVALIACAO' || tipoQuestionario.includes('PHQ')) {
    if (score < 20) return 'Mínimo';
    if (score < 40) return 'Leve';
    if (score < 60) return 'Moderado';
    if (score < 80) return 'Moderadamente Grave';
    return 'Grave';
  }

  // WHO-5 (Bem-estar)
  if (tipoQuestionario.includes('WHO')) {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    if (score >= 20) return 'Baixo';
    return 'Muito Baixo';
  }

  // GAD-7 (Ansiedade)
  if (tipoQuestionario.includes('GAD')) {
    if (score < 20) return 'Mínimo';
    if (score < 40) return 'Leve';
    if (score < 60) return 'Moderado';
    return 'Grave';
  }

  // Padrão
  if (score >= 80) return 'Muito Alto';
  if (score >= 60) return 'Alto';
  if (score >= 40) return 'Médio';
  if (score >= 20) return 'Baixo';
  return 'Muito Baixo';
}

/**
 * Calcula posição no modelo Circumplex (Russell)
 */
function calcularCircumplex(respostas: any[]): { valencia: number; ativacao: number } | null {
  // Identificar dimensões emocionais
  const dimensoesValencia = ['BEM_ESTAR', 'HUMOR', 'SATISFACAO', 'AUTOESTIMA'];
  const dimensoesAtivacao = ['ENERGIA', 'ANSIEDADE', 'ESTRESSE', 'EXCITACAO'];

  let valenciaSum = 0;
  let valenciaCount = 0;
  let ativacaoSum = 0;
  let ativacaoCount = 0;

  for (const resposta of respostas) {
    const categoria = resposta.pergunta.categoria;
    const valor = resposta.valorNormalizado || 0;

    if (dimensoesValencia.includes(categoria)) {
      valenciaSum += valor;
      valenciaCount++;
    }

    if (dimensoesAtivacao.includes(categoria)) {
      // Inverter ansiedade/estresse (valores altos = ativação negativa)
      if (categoria === 'ANSIEDADE' || categoria === 'ESTRESSE') {
        ativacaoSum += (1 - valor);
      } else {
        ativacaoSum += valor;
      }
      ativacaoCount++;
    }
  }

  if (valenciaCount === 0 && ativacaoCount === 0) {
    return null;
  }

  // Normalizar para -1 a 1
  const valencia = valenciaCount > 0 ? (valenciaSum / valenciaCount) * 2 - 1 : 0;
  const ativacao = ativacaoCount > 0 ? (ativacaoSum / ativacaoCount) * 2 - 1 : 0;

  return { valencia, ativacao };
}

/**
 * Gera recomendações baseadas no resultado
 */
function gerarRecomendacoes(
  nivelAlerta: string,
  scores: Record<string, number>,
  tipoQuestionario: string
): string[] {
  const recomendacoes: string[] = [];

  // Recomendações por nível de alerta
  switch (nivelAlerta) {
    case 'VERMELHO':
      recomendacoes.push('🚨 Procure ajuda profissional imediatamente');
      recomendacoes.push('📞 CVV - Disque 188 (24h, gratuito)');
      recomendacoes.push('👨‍⚕️ Agende consulta com psicólogo da instituição');
      recomendacoes.push('👥 Converse com coordenador pedagógico');
      break;

    case 'LARANJA':
      recomendacoes.push('⚠️ Recomendamos conversar com um profissional');
      recomendacoes.push('👨‍⚕️ Considere agendar consulta com psicólogo');
      recomendacoes.push('👥 Fale com seu coordenador pedagógico');
      recomendacoes.push('📚 Acesse recursos de apoio disponíveis');
      break;

    case 'AMARELO':
      recomendacoes.push('💛 Fique atento ao seu bem-estar');
      recomendacoes.push('🧘 Pratique técnicas de relaxamento');
      recomendacoes.push('😴 Mantenha rotina de sono regular');
      recomendacoes.push('🏃 Pratique atividades físicas');
      break;

    case 'VERDE':
      recomendacoes.push('✅ Continue cuidando do seu bem-estar');
      recomendacoes.push('📊 Faça check-ins regulares');
      recomendacoes.push('🎯 Mantenha hábitos saudáveis');
      break;
  }

  // Recomendações específicas por categoria
  for (const [categoria, score] of Object.entries(scores)) {
    if (score > 0.7) { // Score alto (problemático)
      switch (categoria) {
        case 'ANSIEDADE':
          recomendacoes.push('🧘 Técnicas de respiração podem ajudar com ansiedade');
          break;
        case 'DEPRESSAO':
          recomendacoes.push('☀️ Exposição à luz solar e atividade física ajudam');
          break;
        case 'ESTRESSE':
          recomendacoes.push('⏸️ Faça pausas regulares durante os estudos');
          break;
        case 'SONO':
          recomendacoes.push('😴 Estabeleça horário regular para dormir');
          break;
      }
    }
  }

  // Recursos gerais
  recomendacoes.push('📖 Acesse nossa biblioteca de recursos de bem-estar');
  recomendacoes.push('🎯 Faça uma nova avaliação em 2 semanas');

  return recomendacoes;
}
