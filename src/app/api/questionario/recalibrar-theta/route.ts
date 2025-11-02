/**
 * API Route - Recalibrar Theta
 * 
 * Recalcula o theta (habilidade estimada IRT) após navegação reversa,
 * usando apenas as respostas que permanecem na sessão.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calcularTheta } from '@/lib/adaptive/irt-engine';

interface RespostaRecalibracao {
  perguntaId: string;
  valorNormalizado: number;
}

interface RequestBody {
  sessaoId: string;
  respostasAtuais: RespostaRecalibracao[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { sessaoId, respostasAtuais } = body;

    // Validações
    if (!sessaoId) {
      return NextResponse.json(
        { error: 'sessaoId é obrigatório' },
        { status: 400 }
      );
    }

    if (!Array.isArray(respostasAtuais)) {
      return NextResponse.json(
        { error: 'respostasAtuais deve ser um array' },
        { status: 400 }
      );
    }

    // Buscar sessão
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        respostas: {
          include: {
            pergunta: {
              include: {
                parametrosIRT: true
              }
            }
          },
          orderBy: { criadoEm: 'asc' }
        }
      }
    });

    if (!sessao) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se sessão está ativa
    if (sessao.status === 'FINALIZADA' || sessao.status === 'CANCELADA') {
      return NextResponse.json(
        { error: 'Sessão já finalizada ou cancelada' },
        { status: 400 }
      );
    }

    // Se não há respostas, retornar theta inicial
    if (respostasAtuais.length === 0) {
      const thetaInicial = 0;
      const erroInicial = 1.0;
      const confiancaInicial = 0.5;

      // Atualizar sessão
      await prisma.sessaoAdaptativa.update({
        where: { id: sessaoId },
        data: {
          thetaEstimado: thetaInicial,
          erroEstimacao: erroInicial,
          confianca: confiancaInicial
        }
      });

      return NextResponse.json({
        theta: thetaInicial,
        erro: erroInicial,
        confianca: confiancaInicial,
        respostasConsideradas: 0
      });
    }

    // Filtrar respostas que ainda estão na sessão
    const respostasValidas = sessao.respostas.filter(resposta => 
      respostasAtuais.some(r => r.perguntaId === resposta.perguntaId)
    );

    // Preparar dados para recálculo IRT
    const dadosIRT = respostasValidas
      .filter(r => r.pergunta.parametrosIRT)
      .map(resposta => ({
        parametroA: resposta.pergunta.parametrosIRT?.parametroA ?? 1.0,
        parametroB: resposta.pergunta.parametrosIRT?.parametroB ?? 0.0,
        parametroC: resposta.pergunta.parametrosIRT?.parametroC ?? 0.0,
        respostaCorreta: resposta.valorNormalizado >= 0.5, // Normalizado 0-1
        valorNormalizado: resposta.valorNormalizado
      }));

    // Recalcular theta usando IRT
    const resultado = calcularTheta(dadosIRT);

    // Atualizar sessão com novo theta
    await prisma.sessaoAdaptativa.update({
      where: { id: sessaoId },
      data: {
        thetaEstimado: resultado.theta,
        erroEstimacao: resultado.erro,
        confianca: resultado.confianca
      }
    });

    // Registrar log de recalibração
    await prisma.logAdaptativo.create({
      data: {
        sessaoId: sessaoId,
        usuarioId: sessao.usuarioId,
        regraAplicada: 'RECALIBRACAO_NAVEGACAO_REVERSA',
        algoritmo: 'IRT',
        thetaAtual: resultado.theta,
        informacaoFisher: resultado.informacao ?? 0,
        detalhes: {
          respostasRemovidas: sessao.respostas.length - respostasValidas.length,
          respostasConsideradas: respostasValidas.length,
          thetaAnterior: sessao.thetaEstimado,
          deltaTheta: resultado.theta - sessao.thetaEstimado
        }
      }
    });

    return NextResponse.json({
      theta: resultado.theta,
      erro: resultado.erro,
      confianca: resultado.confianca,
      respostasConsideradas: respostasValidas.length,
      deltaTheta: resultado.theta - sessao.thetaEstimado
    });

  } catch (error) {
    console.error('Erro ao recalibrar theta:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao recalibrar theta',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
