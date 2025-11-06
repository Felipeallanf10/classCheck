import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { determinarProximaPergunta } from '@/lib/adaptive/proxima-pergunta-service';
import { validarRespostaPorTipo } from '@/lib/validations/resposta-schemas';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * Schema de validação para submissão de resposta
 */
const SubmeterRespostaSchema = z.object({
  perguntaId: z.string().min(1, 'ID da pergunta é obrigatório'),
  valor: z.union([
    z.number(),
    z.string(),
    z.boolean(),
    z.array(z.any()),
    z.record(z.any()),
  ]),
  tempoResposta: z.number().int().positive('Tempo de resposta deve ser positivo'),
  valorTexto: z.string().optional(),
});

/**
 * POST /api/sessoes/[id]/resposta
 * 
 * Submete resposta para uma pergunta da sessão adaptativa
 * 
 * Body:
 * - perguntaId: string (obrigatório)
 * - valor: number | string | boolean | array | object (obrigatório)
 * - tempoResposta: number (segundos, obrigatório)
 * - valorTexto: string (opcional, para respostas com texto adicional)
 * 
 * Fluxo:
 * 1. Valida resposta com Zod
 * 2. Salva resposta no banco
 * 3. Executa rules engine
 * 4. Atualiza theta IRT (se adaptativo)
 * 5. Determina próxima pergunta ou finaliza
 * 6. Gera alertas se necessário
 * 
 * @example
 * POST /api/sessoes/abc123/resposta
 * Body: { "perguntaId": "WHO5_1", "valor": 3, "tempoResposta": 15 }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessaoId } = await params;

    // Parse e validação do body
    const body = await request.json();
    const validatedData = SubmeterRespostaSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          erro: 'Dados inválidos',
          detalhes: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { perguntaId, valor, tempoResposta, valorTexto } = validatedData.data;

    // Buscar sessão
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        questionario: {
          select: {
            id: true,
            titulo: true,
            adaptativo: true,
            perguntas: {
              where: { ativo: true },
              select: { id: true },
            },
          },
        },
        respostas: {
          select: {
            perguntaId: true,
            perguntaBancoId: true,
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

    if (sessao.status !== 'EM_ANDAMENTO') {
      return NextResponse.json(
        { erro: `Sessão está ${sessao.status}. Não é possível submeter respostas.` },
        { status: 400 }
      );
    }

    // Buscar pergunta (primeiro em PerguntaSocioemocional, depois no banco adaptativo)
    let pergunta: any = await prisma.perguntaSocioemocional.findUnique({
      where: { id: perguntaId },
      select: {
        id: true,
        texto: true,
        textoAuxiliar: true,
        categoria: true,
        dominio: true,
        tipoPergunta: true,
        valorMinimo: true,
        valorMaximo: true,
        opcoes: true,
        dificuldade: true,
        discriminacao: true,
        peso: true,
        escalaNome: true,
        escalaItem: true,
      },
    });

    // Se não encontrou, buscar no banco adaptativo
    let perguntaBanco = null;
    if (!pergunta) {
      perguntaBanco = await prisma.bancoPerguntasAdaptativo.findUnique({
        where: { id: perguntaId },
        select: {
          id: true,
          texto: true,
          categoria: true,
          dominio: true,
          tipoPergunta: true,
          parametroA: true,
          parametroB: true,
          escalaNome: true,
          escalaItem: true,
        },
      });

      if (!perguntaBanco) {
        return NextResponse.json(
          { erro: 'Pergunta não encontrada' },
          { status: 404 }
        );
      }

      // Converter para formato compatível
      pergunta = {
        id: perguntaBanco.id,
        texto: perguntaBanco.texto,
        categoria: perguntaBanco.categoria,
        dominio: perguntaBanco.dominio,
        tipoPergunta: perguntaBanco.tipoPergunta,
        valorMinimo: 1,
        valorMaximo: 5,
        dificuldade: perguntaBanco.parametroB,
        discriminacao: perguntaBanco.parametroA,
        peso: 1.0,
        escalaNome: perguntaBanco.escalaNome,
        escalaItem: perguntaBanco.escalaItem,
      };
    }

  // Verificar se pergunta já foi respondida (questionário OU banco)
  const jaRespondida = sessao.respostas.some((r) => r.perguntaId === perguntaId || r.perguntaBancoId === perguntaId);
    if (jaRespondida) {
      return NextResponse.json(
        { erro: 'Pergunta já foi respondida nesta sessão' },
        { status: 400 }
      );
    }

    // Validar resposta por tipo
    const respostaValida = validarRespostaPorTipo(
      pergunta.tipoPergunta,
      valor,
      tempoResposta,
      perguntaId
    );

    if (!respostaValida) {
      return NextResponse.json(
        { erro: 'Resposta inválida para o tipo de pergunta' },
        { status: 400 }
      );
    }

    // Normalizar valor (0-1) para IRT
    let valorNormalizado = 0;
    if (typeof valor === 'number') {
      const min = pergunta.valorMinimo || 0;
      const max = pergunta.valorMaximo || 10;
      valorNormalizado = (valor - min) / (max - min);
    } else if (typeof valor === 'boolean') {
      valorNormalizado = valor ? 1 : 0;
    } else if (Array.isArray(valor)) {
      valorNormalizado = valor.length > 0 ? 1 : 0;
    }

    // Salvar resposta usando perguntaBancoId quando for pergunta de banco (sem proxies)
    const resposta = await prisma.respostaSocioemocional.create({
      data: {
        sessaoId,
        usuarioId: sessao.usuarioId,
        perguntaId: perguntaBanco ? null : perguntaId,
        perguntaBancoId: perguntaBanco ? perguntaId : null,
        valor: valor as any, // Prisma Json aceita objeto/valor diretamente
        valorNumerico: typeof valor === 'number' ? valor : null,
        valorTexto: valorTexto,
        valorNormalizado,
        tempoResposta,
        categoria: pergunta.categoria,
        dominio: pergunta.dominio,
        escalaNome: pergunta.escalaNome,
        escalaItem: pergunta.escalaItem,
        respondidoEm: new Date(),
        ordem: sessao.respostas.length + 1,
      },
    });

    console.log('[API resposta] Resposta salva:', {
      respostaId: resposta.id,
      perguntaId,
      ordem: resposta.ordem,
      totalRespostasAntes: sessao.respostas.length
    });

    // Determinar próxima pergunta (executa rules engine + IRT)
    const resultado = await determinarProximaPergunta(sessaoId);

    console.log('[API resposta] Resultado próxima pergunta:', {
      temPergunta: !!resultado.pergunta,
      perguntaId: resultado.pergunta?.id,
      eventosAtivados: resultado.eventos?.length || 0,
      theta: resultado.thetaAtualizado,
      confianca: resultado.confianca,
    });

    // Atualizar sessão
    const perguntasRespondidas = sessao.respostas.length + 1;
    const totalEstimado = sessao.totalPerguntasEstimado || 10;
    const progressoPercentual = (perguntasRespondidas / totalEstimado) * 100;

    await prisma.sessaoAdaptativa.update({
      where: { id: sessaoId },
      data: {
        perguntasApresentadas: resultado.pergunta 
          ? [...sessao.perguntasApresentadas, resultado.pergunta.id]
          : sessao.perguntasApresentadas,
        proximaPergunta: resultado.pergunta?.id || null, // CORRIGIDO: atualizar proximaPergunta
        thetaEstimado: resultado.thetaAtualizado,
        erroEstimacao: resultado.erroEstimacao,
        confianca: resultado.confianca,
      },
    });

    // Verificar se deve finalizar
    // IMPORTANTE: Não finalizar baseado em totalPerguntasEstimado (pode ter adaptativas)
    // Finalizar apenas quando não há próxima pergunta OU confiança muito alta
    const deveFinalizar = 
      !resultado.pergunta || // Não há próxima pergunta (todas respondidas + regras processadas)
      (sessao.questionario.adaptativo && resultado.confianca >= 0.95 && perguntasRespondidas >= 3); // Alta confiança EM adaptativos (mínimo 3 perguntas)

    if (deveFinalizar) {
      // Calcular scores finais por categoria
      const respostasFinais = await prisma.respostaSocioemocional.findMany({
        where: { sessaoId },
        select: {
          categoria: true,
          valorNormalizado: true,
        },
      });

      const scoresPorCategoria: Record<string, number[]> = {};
      respostasFinais.forEach((r) => {
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

      // Finalizar sessão
      await prisma.sessaoAdaptativa.update({
        where: { id: sessaoId },
        data: {
          status: 'FINALIZADA',
          finalizadoEm: new Date(),
          scoresPorCategoria: scoresFinais,
        },
      });

      return NextResponse.json({
        success: true,
        respostaId: resposta.id,
        finalizada: true,
        resultado: {
          scoresPorCategoria: scoresFinais,
          thetaFinal: resultado.thetaAtualizado,
          confianca: resultado.confianca,
          totalPerguntas: perguntasRespondidas,
          tempoTotal: Math.floor(
            (new Date().getTime() - sessao.iniciadoEm.getTime()) / 1000
          ),
        },
        alertas: [],
      });
    }

    // Retornar próxima pergunta
    return NextResponse.json({
      success: true,
      respostaId: resposta.id,
      finalizada: false,
      proximaPergunta: resultado.pergunta,
      progresso: {
        perguntasRespondidas,
        totalEstimado,
        porcentagem: Math.min(progressoPercentual, 100),
      },
      irt: {
        theta: resultado.thetaAtualizado,
        erro: resultado.erroEstimacao,
        confianca: resultado.confianca,
      },
      nivelAlerta: sessao.nivelAlerta,
      alertas: [],
    });

  } catch (error) {
    console.error('[API] Erro ao submeter resposta:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao submeter resposta',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
