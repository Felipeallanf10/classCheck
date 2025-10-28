import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/questionarios/[id]
 * 
 * Busca questionário específico com suas perguntas
 * 
 * @example
 * GET /api/questionarios/WHO5
 * GET /api/questionarios/PHQ9
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar questionário com perguntas
    const questionario = await prisma.questionarioSocioemocional.findUnique({
      where: { 
        id,
        publicado: true, // Apenas publicados
      },
      include: {
        perguntas: {
          where: {
            ativo: true,
          },
          orderBy: {
            ordem: 'asc',
          },
          select: {
            id: true,
            texto: true,
            textoAuxiliar: true,
            categoria: true,
            dominio: true,
            tipoPergunta: true,
            obrigatoria: true,
            ordem: true,
            opcoes: true,
            valorMinimo: true,
            valorMaximo: true,
            padraoResposta: true,
            dificuldade: true,
            discriminacao: true,
            peso: true,
            escalaNome: true,
            escalaItem: true,
            tags: true,
            palavrasChave: true,
          },
        },
        regras: {
          where: {
            ativo: true,
          },
          select: {
            id: true,
            nome: true,
            prioridade: true,
            eventoGatilho: true,
          },
        },
        _count: {
          select: {
            sessoes: true,
            alertas: true,
          },
        },
      },
    });

    if (!questionario) {
      return NextResponse.json(
        { erro: 'Questionário não encontrado' },
        { status: 404 }
      );
    }

    // Formatar resposta
    const questionarioFormatado = {
      id: questionario.id,
      titulo: questionario.titulo,
      descricao: questionario.descricao,
      versao: questionario.versao,
      tipo: questionario.tipo,
      frequencia: questionario.frequencia,
      duracaoEstimada: questionario.duracaoEstimada,
      categorias: questionario.categorias,
      adaptativo: questionario.adaptativo,
      nivelAdaptacao: questionario.nivelAdaptacao,
      instrucoes: questionario.instrucoes,
      instrucoesFinais: questionario.instrucoesFinais,
      limitesTempo: {
        minimo: questionario.tempoMinimo,
        maximo: questionario.tempoMaximo,
      },
      limitesIdade: {
        minima: questionario.idadeMinima,
        maxima: questionario.idadeMaxima,
      },
      oficial: questionario.oficial,
      perguntas: questionario.perguntas,
      regras: questionario.regras,
      estatisticas: {
        totalPerguntas: questionario.perguntas.length,
        sessoesRealizadas: questionario._count.sessoes,
        alertasGerados: questionario._count.alertas,
      },
      criadoEm: questionario.criadoEm,
      atualizadoEm: questionario.atualizadoEm,
      publicadoEm: questionario.publicadoEm,
    };

    return NextResponse.json({
      success: true,
      questionario: questionarioFormatado,
    });

  } catch (error) {
    console.error('[API] Erro ao buscar questionário:', error);
    
    return NextResponse.json(
      { 
        erro: 'Erro ao buscar questionário',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
