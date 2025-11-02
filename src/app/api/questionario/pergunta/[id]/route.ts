/**
 * API Route - Buscar Pergunta por ID
 * 
 * Retorna os dados completos de uma pergunta específica,
 * usado principalmente para navegação reversa.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const sessaoId = searchParams.get('sessaoId');

    // Validações
    if (!id) {
      return NextResponse.json(
        { error: 'ID da pergunta é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar pergunta com todas as relações necessárias
    const pergunta = await prisma.perguntaSocioemocional.findUnique({
      where: { id },
      include: {
        opcoes: {
          orderBy: { valor: 'asc' }
        },
        parametrosIRT: true,
        categoria: true
      }
    });

    if (!pergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se a pergunta já foi respondida nesta sessão (se sessaoId fornecido)
    let respostaExistente = null;
    if (sessaoId) {
      respostaExistente = await prisma.respostaSocioemocional.findFirst({
        where: {
          sessaoId: sessaoId,
          perguntaId: id
        }
      });
    }

    // Formatar resposta
    const response = {
      id: pergunta.id,
      texto: pergunta.texto,
      textoAuxiliar: pergunta.textoAuxiliar,
      categoria: pergunta.categoria.nome,
      dominio: pergunta.dominio,
      tipoPergunta: pergunta.tipoPergunta,
      opcoes: pergunta.opcoes.map(opcao => ({
        id: opcao.id,
        texto: opcao.texto,
        valor: opcao.valor,
        emoji: opcao.emoji,
        cor: opcao.cor
      })),
      valorMinimo: pergunta.valorMinimo,
      valorMaximo: pergunta.valorMaximo,
      obrigatoria: pergunta.obrigatoria,
      ordem: pergunta.ordem,
      
      // Dados IRT (se existirem)
      parametrosIRT: pergunta.parametrosIRT ? {
        discriminacao: pergunta.parametrosIRT.parametroA,
        dificuldade: pergunta.parametrosIRT.parametroB,
        acerto: pergunta.parametrosIRT.parametroC,
        informacaoMaxima: pergunta.parametrosIRT.informacaoMaxima
      } : null,
      
      // Resposta existente (se houver)
      respostaExistente: respostaExistente ? {
        valor: respostaExistente.valor,
        valorNormalizado: respostaExistente.valorNumerico,
        timestamp: respostaExistente.criadoEm
      } : null
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar pergunta',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
