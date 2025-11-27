import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { determinarProximaPergunta } from '@/lib/adaptive/proxima-pergunta-service';
import { validarRespostaPorTipo } from '@/lib/validations/resposta-schemas';
import { invalidarCache } from '@/lib/cache/redis-cache';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * Determina estado emocional primário baseado em valência e ativação (Modelo Circumplex)
 */
function determinarEstadoEmocional(valencia: number, ativacao: number): string {
  // Modelo de Russell's Circumplex - 8 quadrantes
  const angulo = Math.atan2(ativacao, valencia) * (180 / Math.PI);
  
  if (angulo >= -22.5 && angulo < 22.5) return 'Calmo';
  if (angulo >= 22.5 && angulo < 67.5) return 'Relaxado';
  if (angulo >= 67.5 && angulo < 112.5) return 'Entediado';
  if (angulo >= 112.5 && angulo < 157.5) return 'Triste';
  if ((angulo >= 157.5 && angulo <= 180) || (angulo >= -180 && angulo < -157.5)) return 'Estressado';
  if (angulo >= -157.5 && angulo < -112.5) return 'Ansioso';
  if (angulo >= -112.5 && angulo < -67.5) return 'Tenso';
  if (angulo >= -67.5 && angulo < -22.5) return 'Animado';
  
  return 'Neutro';
}

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
      const sessaoFinalizada = await prisma.sessaoAdaptativa.update({
        where: { id: sessaoId },
        data: {
          status: 'FINALIZADA',
          finalizadoEm: new Date(),
          scoresPorCategoria: scoresFinais,
        },
        include: {
          respostas: {
            select: {
              categoria: true,
              valorNormalizado: true,
            },
          },
        },
      });

      // Se sessão vinculada a uma aula, criar AvaliacaoSocioemocional
      if (sessaoFinalizada.aulaId) {
        try {
          // Calcular valência e ativação a partir das respostas
          // Usar categorias de bem-estar geral
          const respostasEmocao = sessaoFinalizada.respostas.filter(
            r => r.categoria === 'BEM_ESTAR' || 
                 r.categoria === 'HUMOR_GERAL' || 
                 r.categoria === 'SATISFACAO_VIDA' ||
                 r.categoria === 'ENERGIA'
          );

          let valencia = 0;
          let ativacao = 0;

          if (respostasEmocao.length > 0) {
            // Calcular média de valência (respostas positivas vs negativas)
            const valoresNormalizados = respostasEmocao
              .filter(r => r.valorNormalizado !== null)
              .map(r => r.valorNormalizado!);
            
            if (valoresNormalizados.length > 0) {
              valencia = valoresNormalizados.reduce((sum, val) => sum + val, 0) / valoresNormalizados.length;
              // Normalizar para -1 a 1
              valencia = (valencia * 2) - 1;

              // Calcular ativação baseada na dispersão das respostas
              const mediaQuadrada = valoresNormalizados.reduce((sum, val) => sum + val * val, 0) / valoresNormalizados.length;
              ativacao = Math.sqrt(mediaQuadrada);
              // Normalizar para -1 a 1
              ativacao = (ativacao * 2) - 1;
            }
          }

          // Determinar estado emocional primário
          const estadoPrimario = determinarEstadoEmocional(valencia, ativacao);

          // Criar avaliação socioemocional
          await prisma.avaliacaoSocioemocional.create({
            data: {
              usuarioId: sessao.usuarioId,
              aulaId: sessaoFinalizada.aulaId,
              valencia,
              ativacao,
              estadoPrimario,
              confianca: resultado.confianca,
              totalPerguntas: perguntasRespondidas,
              tempoResposta: Math.floor(
                (new Date().getTime() - sessao.iniciadoEm.getTime()) / 1000
              ),
              respostas: JSON.stringify(sessaoFinalizada.respostas),
            },
          });

          console.log('[API] AvaliacaoSocioemocional criada para aula:', sessaoFinalizada.aulaId);
        } catch (error) {
          console.error('[API] Erro ao criar AvaliacaoSocioemocional:', error);
          // Não falhar a finalização se houver erro ao criar avaliação
        }
      }

      // Se for questionário didático, criar AvaliacaoDidatica
      if (sessaoFinalizada.aulaId && sessao.questionarioId === 'questionario-didatico-aula') {
        try {
          // Buscar respostas completas para extrair valores
          const respostasDidaticas = await prisma.respostaSocioemocional.findMany({
            where: { sessaoId },
            orderBy: { ordem: 'asc' },
          });

          // Mapear respostas por ID da pergunta
          const respostasPorPergunta = respostasDidaticas.reduce((acc, r) => {
            const perguntaId = r.perguntaId || r.perguntaBancoId;
            if (perguntaId) {
              acc[perguntaId] = r.valorNumerico || 0;
            }
            return acc;
          }, {} as Record<string, number>);

          // Extrair valores das perguntas didáticas
          const compreensaoConteudo = respostasPorPergunta['didatico-p1-compreensao'] || 3;
          const ritmoAula = respostasPorPergunta['didatico-p2-ritmo'] || 3;
          const recursosDidaticos = respostasPorPergunta['didatico-p3-recursos'] || 3;
          const engajamento = Math.round(respostasPorPergunta['didatico-p4-engajamento'] || 5);

          // Extrair feedbacks textuais (opcional)
          const respostaPontoPositivo = respostasDidaticas.find(r => r.perguntaId === 'didatico-p5-ponto-positivo');
          const respostaSugestao = respostasDidaticas.find(r => r.perguntaId === 'didatico-p6-sugestao');

          const pontoPositivo = respostaPontoPositivo?.valorTexto || null;
          const sugestao = respostaSugestao?.valorTexto || null;

          // Criar avaliação didática
          await prisma.avaliacaoDidatica.create({
            data: {
              usuarioId: sessao.usuarioId,
              aulaId: sessaoFinalizada.aulaId,
              compreensaoConteudo,
              ritmoAula,
              recursosDidaticos,
              engajamento,
              pontoPositivo,
              pontoMelhoria: sugestao,
              sugestao: sugestao,
            },
          });

          // Marcar aula como avaliada
          await prisma.aula.update({
            where: { id: sessaoFinalizada.aulaId },
            data: { status: 'CONCLUIDA' }, // Ou adicionar campo 'avaliada: true' se existir
          });

          console.log('[API] AvaliacaoDidatica criada e aula marcada como avaliada:', sessaoFinalizada.aulaId);
        } catch (error) {
          console.error('[API] Erro ao criar AvaliacaoDidatica:', error);
          // Não falhar a finalização se houver erro ao criar avaliação
        }
      }

      // Verificar se deve continuar com questionário didático
      const deveContinuarComDidatico = 
        sessaoFinalizada.aulaId && // Tem aula vinculada
        sessao.questionarioId === 'questionario-impacto-aula'; // É o questionário socioemocional de aula

      // Invalidar caches relacionados
      const cachesToInvalidate = [
        `relatorios:aluno:${sessao.usuarioId}`,
        `dashboard:turma:${sessaoFinalizada.aulaId}`,
      ];
      
      await invalidarCache(cachesToInvalidate).catch((err) => {
        console.error('[API] Erro ao invalidar cache:', err);
        // Não falhar a finalização se houver erro ao invalidar cache
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
        // Novo: informar se deve iniciar questionário didático
        proximoQuestionario: deveContinuarComDidatico ? {
          id: 'questionario-didatico-aula',
          titulo: 'Avaliação Didática da Aula',
          tipo: 'DIDATICO',
          aulaId: sessaoFinalizada.aulaId,
        } : null,
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
