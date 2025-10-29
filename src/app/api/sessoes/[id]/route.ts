import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * Schema de validação para ações de sessão
 */
const AcaoSessaoSchema = z.object({
  action: z.enum(['pausar', 'retomar', 'finalizar', 'cancelar']),
});

/**
 * PATCH /api/sessoes/[id]
 * 
 * Gerencia estado da sessão (pausar, retomar, finalizar, cancelar)
 * 
 * Body:
 * - action: 'pausar' | 'retomar' | 'finalizar' | 'cancelar'
 * 
 * Estados possíveis:
 * - INICIAL → EM_ANDAMENTO (automático ao iniciar)
 * - EM_ANDAMENTO → PAUSADA (pausar)
 * - PAUSADA → EM_ANDAMENTO (retomar)
 * - EM_ANDAMENTO → FINALIZADA (finalizar)
 * - EM_ANDAMENTO/PAUSADA → CANCELADA (cancelar)
 * 
 * @example
 * PATCH /api/sessoes/abc123
 * Body: { "action": "pausar" }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params;

    // Parse e validação do body
    const body = await request.json();
    const validatedData = AcaoSessaoSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          erro: 'Dados inválidos',
          detalhes: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { action } = validatedData.data;

    // Buscar sessão
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        respostas: {
          select: {
            categoria: true,
            valorNormalizado: true,
            tempoResposta: true,
          },
        },
        questionario: {
          select: {
            id: true,
            titulo: true,
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

    // Processar ação
    switch (action) {
      case 'pausar':
        if (sessao.status !== 'EM_ANDAMENTO') {
          return NextResponse.json(
            { erro: 'Apenas sessões em andamento podem ser pausadas' },
            { status: 400 }
          );
        }

        await prisma.sessaoAdaptativa.update({
          where: { id: sessaoId },
          data: {
            status: 'PAUSADA',
            pausadoEm: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          mensagem: 'Sessão pausada com sucesso',
          status: 'PAUSADA',
          pausadaEm: new Date(),
        });

      case 'retomar':
        if (sessao.status !== 'PAUSADA') {
          return NextResponse.json(
            { erro: 'Apenas sessões pausadas podem ser retomadas' },
            { status: 400 }
          );
        }

        await prisma.sessaoAdaptativa.update({
          where: { id: sessaoId },
          data: {
            status: 'EM_ANDAMENTO',
            pausadoEm: null, // Limpa timestamp de pausa
          },
        });

        return NextResponse.json({
          success: true,
          mensagem: 'Sessão retomada com sucesso',
          status: 'EM_ANDAMENTO',
        });

      case 'finalizar':
        if (sessao.status !== 'EM_ANDAMENTO') {
          return NextResponse.json(
            { erro: 'Apenas sessões em andamento podem ser finalizadas' },
            { status: 400 }
          );
        }

        // Calcular scores finais por categoria
        const scoresPorCategoria: Record<string, number[]> = {};
        sessao.respostas.forEach((r) => {
          if (r.categoria && r.valorNormalizado !== null) {
            if (!scoresPorCategoria[r.categoria]) {
              scoresPorCategoria[r.categoria] = [];
            }
            scoresPorCategoria[r.categoria].push(r.valorNormalizado);
          }
        });

        const scoresFinais: Record<string, number> = {};
        Object.entries(scoresPorCategoria).forEach(([categoria, valores]) => {
          const media = valores.reduce((a, b) => a + b, 0) / valores.length;
          scoresFinais[categoria] = Math.round(media * 10); // 0-10
        });

        // Calcular tempo total
        const tempoTotalSegundos = Math.floor(
          (new Date().getTime() - sessao.iniciadoEm.getTime()) / 1000
        );

        // Calcular tempo médio por resposta
        const tempoMedioResposta = sessao.respostas.length > 0
          ? Math.round(
              sessao.respostas.reduce((sum, r) => sum + r.tempoResposta, 0) /
                sessao.respostas.length
            )
          : 0;

        // Finalizar sessão
        await prisma.sessaoAdaptativa.update({
          where: { id: sessaoId },
          data: {
            status: 'FINALIZADA',
            finalizadoEm: new Date(),
            scoresPorCategoria: scoresFinais,
            tempoTotalSegundos,
            tempoMedioResposta,
          },
        });

        // Atualizar XP do usuário (gamificação)
        const xpGanho = sessao.respostas.length * 10; // 10 XP por resposta
        await prisma.usuario.update({
          where: { id: sessao.usuarioId },
          data: {
            xpTotal: {
              increment: xpGanho,
            },
          },
        });

        return NextResponse.json({
          success: true,
          mensagem: 'Sessão finalizada com sucesso',
          status: 'FINALIZADA',
          finalizadoEm: new Date(),
          resultado: {
            scoresPorCategoria: scoresFinais,
            thetaFinal: sessao.thetaEstimado,
            confianca: sessao.confianca,
            totalPerguntas: sessao.respostas.length,
            tempoTotal: tempoTotalSegundos,
            tempoMedioResposta,
            xpGanho,
          },
        });

      case 'cancelar':
        if (!['EM_ANDAMENTO', 'PAUSADA'].includes(sessao.status)) {
          return NextResponse.json(
            { erro: 'Apenas sessões em andamento ou pausadas podem ser canceladas' },
            { status: 400 }
          );
        }

        await prisma.sessaoAdaptativa.update({
          where: { id: sessaoId },
          data: {
            status: 'CANCELADA',
            finalizadoEm: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          mensagem: 'Sessão cancelada com sucesso',
          status: 'CANCELADA',
          canceladaEm: new Date(),
        });

      default:
        return NextResponse.json(
          { erro: 'Ação inválida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[API] Erro ao gerenciar sessão:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao gerenciar sessão',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessoes/[id]
 * 
 * Busca informações detalhadas de uma sessão
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params;

    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
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
          select: {
            id: true,
            perguntaId: true,
            valor: true,
            valorNumerico: true,
            valorNormalizado: true,
            tempoResposta: true,
            categoria: true,
            dominio: true,
            respondidoEm: true,
          },
          orderBy: {
            respondidoEm: 'asc',
          },
        },
        alertas: {
          where: {
            ativo: true,
          },
          select: {
            id: true,
            tipo: true,
            nivel: true,
            categoria: true,
            mensagem: true,
            criadoEm: true,
          },
          orderBy: {
            criadoEm: 'desc',
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

    // Buscar pergunta atual se houver
    let perguntaAtual = null;
    if (sessao.proximaPergunta) {
      // Tentar buscar primeiro em PerguntaSocioemocional
      perguntaAtual = await prisma.perguntaSocioemocional.findUnique({
        where: { id: sessao.proximaPergunta },
        select: {
          id: true,
          texto: true,
          textoAuxiliar: true,
          categoria: true,
          dominio: true,
          tipoPergunta: true,
          obrigatoria: true,
          opcoes: true,
          valorMinimo: true,
          valorMaximo: true,
        },
      });

      // Se não encontrou, buscar no BancoPerguntasAdaptativo
      if (!perguntaAtual) {
        const perguntaBanco = await prisma.bancoPerguntasAdaptativo.findUnique({
          where: { id: sessao.proximaPergunta },
          select: {
            id: true,
            titulo: true,
            texto: true,
            textoAuxiliar: true,
            categoria: true,
            dominio: true,
            subcategoria: true,
            tipoPergunta: true,
            opcoes: true,
            escalaNome: true,
          },
        });

        if (perguntaBanco) {
          // Converter formato do banco para o formato esperado pelo frontend
          const opcoesLikert5 = Array.isArray(perguntaBanco.opcoes) && perguntaBanco.opcoes.length === 5
            ? perguntaBanco.opcoes
            : [
                { valor: 1, label: 'Muito insatisfeito' },
                { valor: 2, label: 'Insatisfeito' },
                { valor: 3, label: 'Neutro' },
                { valor: 4, label: 'Satisfeito' },
                { valor: 5, label: 'Muito satisfeito' },
              ];

          perguntaAtual = {
            id: perguntaBanco.id,
            texto: perguntaBanco.texto || perguntaBanco.titulo,
            textoAuxiliar: perguntaBanco.textoAuxiliar,
            categoria: perguntaBanco.categoria,
            dominio: perguntaBanco.dominio,
            tipoPergunta: 'LIKERT_5', // Força LIKERT_5 para compatibilidade com componente
            obrigatoria: true,
            opcoes: opcoesLikert5 as any,
            valorMinimo: 1,
            valorMaximo: 5,
          };
        }
      }
    }

    // Calcular progresso (dinâmico para adaptativos)
    const totalEstBase = sessao.totalPerguntasEstimado || 10;
    const perguntasRespondidas = sessao.respostas.length;
    // Se há pergunta atual, considere +1 na contagem para o total dinâmico
    const temProximaPergunta = !!sessao.proximaPergunta;
    const totalEstimadoDinamico = Math.max(totalEstBase, perguntasRespondidas + (temProximaPergunta ? 1 : 0));
    const porcentagem = Math.min(100, (perguntasRespondidas / totalEstimadoDinamico) * 100);
    const progresso = {
      perguntasRespondidas,
      totalEstimado: totalEstimadoDinamico,
      porcentagem,
    };

    // Calcular tempo decorrido
    const tempoDecorrido = sessao.finalizadoEm
      ? Math.floor((sessao.finalizadoEm.getTime() - sessao.iniciadoEm.getTime()) / 1000)
      : Math.floor((new Date().getTime() - sessao.iniciadoEm.getTime()) / 1000);

    return NextResponse.json({
      success: true,
      sessao: {
        id: sessao.id,
        status: sessao.status,
        contexto: sessao.contexto,
        iniciadoEm: sessao.iniciadoEm,
        pausadoEm: sessao.pausadoEm,
        finalizadoEm: sessao.finalizadoEm,
  totalPerguntasEstimado: totalEstimadoDinamico,
        questionario: sessao.questionario,
        usuario: sessao.usuario,
        progresso,
        perguntaAtual: perguntaAtual ? {
          id: perguntaAtual.id,
          tipoPergunta: perguntaAtual.tipoPergunta, // Corrigido: era 'tipo'
          texto: perguntaAtual.texto,
          textoAuxiliar: perguntaAtual.textoAuxiliar,
          categoria: perguntaAtual.categoria, // Adicionado
          dimensao: perguntaAtual.categoria, // Alias para compatibilidade
          dominio: perguntaAtual.dominio,
          obrigatoria: perguntaAtual.obrigatoria,
          opcoes: perguntaAtual.opcoes,
          valorMinimo: perguntaAtual.valorMinimo,
          valorMaximo: perguntaAtual.valorMaximo,
          ordem: 0, // Placeholder
          ativo: true, // Placeholder
        } : null,
        irt: {
          theta: sessao.thetaEstimado,
          erro: sessao.erroEstimacao,
          confianca: sessao.confianca,
        },
        nivelAlerta: sessao.nivelAlerta,
        scoresPorCategoria: sessao.scoresPorCategoria,
        tempoDecorrido,
        tempoTotal: sessao.tempoTotalSegundos, // Mapeia tempoTotalSegundos para tempoTotal
        tempoMedioResposta: sessao.tempoMedioResposta,
        respostas: sessao.respostas,
        alertas: sessao.alertas,
      },
    });
  } catch (error) {
    console.error('[API] Erro ao buscar sessão:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar sessão',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
