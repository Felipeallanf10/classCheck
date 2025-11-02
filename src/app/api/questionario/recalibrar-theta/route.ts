/**
 * API Route - Recalibrar Theta
 * 
 * Recalcula o theta (habilidade estimada IRT) após navegação reversa,
 * usando apenas as respostas que permanecem na sessão.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RespostaRecalibracao {
  perguntaId: string;
  valorNormalizado: number;
}

interface RequestBody {
  sessaoId: string;
  respostasAtuais: RespostaRecalibracao[];
}

// Constantes IRT
const THETA_INICIAL = 0;
const ERRO_INICIAL = 1.0;

/**
 * Calcula probabilidade de acerto usando modelo IRT 3PL
 */
function probabilidadeAcerto(
  theta: number,
  parametros: { discriminacao: number; dificuldade: number; acerto: number }
): number {
  const { discriminacao, dificuldade, acerto } = parametros;
  const expoente = -discriminacao * (theta - dificuldade);
  return acerto + (1 - acerto) / (1 + Math.exp(expoente));
}

/**
 * Atualiza estimativa de theta usando método de Newton-Raphson
 */
function atualizarTheta(
  thetaAtual: number,
  respostas: Array<{
    valorNormalizado: number;
    discriminacao: number;
    dificuldade: number;
    acerto: number;
  }>
): { theta: number; erro: number; confianca: number } {
  if (respostas.length === 0) {
    return { theta: THETA_INICIAL, erro: ERRO_INICIAL, confianca: 0.5 };
  }

  let theta = thetaAtual;
  const maxIteracoes = 20;
  const tolerancia = 0.001;
  const maxPasso = 0.5;

  // Método de Newton-Raphson
  for (let iter = 0; iter < maxIteracoes; iter++) {
    let primeiraDerivada = 0;
    let segundaDerivada = 0;

    for (const resposta of respostas) {
      const p = probabilidadeAcerto(theta, resposta);
      const q = 1 - p;
      const u = Math.max(0.001, Math.min(0.999, resposta.valorNormalizado));

      const termo1 = resposta.discriminacao * (p - resposta.acerto) / (p * (1 - resposta.acerto));
      primeiraDerivada += (u - p) * termo1;

      const termo2 = Math.pow(resposta.discriminacao, 2) * Math.pow(p - resposta.acerto, 2);
      const termo3 = p * q * Math.pow(1 - resposta.acerto, 2);
      
      if (termo3 > 1e-9) {
        segundaDerivada -= termo2 / termo3;
      }
    }

    let delta = 0;
    if (Math.abs(segundaDerivada) > 1e-9) {
      delta = primeiraDerivada / Math.abs(segundaDerivada);
    }
    
    delta = Math.max(-maxPasso, Math.min(maxPasso, delta));
    theta = theta + delta;
    theta = Math.max(-3, Math.min(3, theta));

    if (Math.abs(delta) < tolerancia) {
      break;
    }
  }

  // Calcular informação total e erro
  let informacaoTotal = 0;
  for (const resposta of respostas) {
    const p = probabilidadeAcerto(theta, resposta);
    const q = 1 - p;
    const info = Math.pow(resposta.discriminacao, 2) * q * Math.pow(p - resposta.acerto, 2) / (p * Math.pow(1 - resposta.acerto, 2));
    informacaoTotal += info;
  }

  const erro = informacaoTotal > 0 ? 1 / Math.sqrt(informacaoTotal) : ERRO_INICIAL;
  const confianca = Math.max(0, Math.min(1, 1 - erro));

  return { theta, erro, confianca };
}

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

    // Buscar sessão com respostas
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId }
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

    // Buscar respostas da sessão
    const todasRespostas = await prisma.respostaSocioemocional.findMany({
      where: { sessaoId },
      include: {
        pergunta: true
      },
      orderBy: { respondidoEm: 'asc' }
    });

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
    const respostasValidas = todasRespostas.filter((resposta: any) => 
      respostasAtuais.some((r: RespostaRecalibracao) => r.perguntaId === resposta.perguntaId)
    );

    // Preparar dados para recálculo IRT
    const dadosIRT = respostasValidas
      .filter((r: any) => r.pergunta && r.valorNumerico !== null)
      .map((resposta: any) => ({
        valorNormalizado: resposta.valorNumerico ?? 0.5,
        discriminacao: resposta.pergunta?.discriminacao ?? 1.0,
        dificuldade: resposta.pergunta?.dificuldade ?? 0.0,
        acerto: 0.0 // Modelo 3PL sem chute para perguntas abertas
      }));

    // Recalcular theta usando IRT
    const resultado = atualizarTheta(sessao.thetaEstimado ?? 0, dadosIRT);

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
        perguntaId: '00000000-0000-0000-0000-000000000000', // Placeholder para recalibração
        regraAplicada: 'RECALIBRACAO_NAVEGACAO_REVERSA',
        algoritmo: 'IRT',
        thetaAtual: resultado.theta,
        informacaoFisher: 0,
        ordem: 0 // Ordem 0 para logs de recalibração
      }
    });

    return NextResponse.json({
      theta: resultado.theta,
      erro: resultado.erro,
      confianca: resultado.confianca,
      respostasConsideradas: respostasValidas.length,
      deltaTheta: resultado.theta - (sessao.thetaEstimado ?? 0)
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
