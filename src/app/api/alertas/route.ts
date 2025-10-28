import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Schema de validação para query params de alertas
 */
const AlertasQuerySchema = z.object({
  usuarioId: z.string().nullable().transform((val) => val ? parseInt(val, 10) : null).optional(),
  nivel: z.enum(['VERDE', 'AMARELO', 'LARANJA', 'VERMELHO']).nullable().optional(),
  tipo: z.string().nullable().optional(),
  ativo: z.enum(['true', 'false']).nullable().optional(),
  questionarioId: z.string().nullable().optional(),
  sessaoId: z.string().nullable().optional(), // Adicionado suporte para filtro por sessão
  status: z.string().nullable().optional(), // Adicionado suporte para filtro por status
});

/**
 * GET /api/alertas
 * 
 * Lista alertas socioemocionais do usuário
 * 
 * Query Params:
 * - usuarioId: number (opcional, mas recomendado)
 * - nivel: 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO' (opcional)
 * - tipo: string (opcional)
 * - ativo: 'true' | 'false' (opcional)
 * - questionarioId: string (opcional)
 * - sessaoId: string (opcional)
 * - status: string (opcional, valores: ATIVO, VISUALIZADO, EM_ACOMPANHAMENTO, RESOLVIDO - suporta múltiplos separados por vírgula)
 * 
 * @example
 * GET /api/alertas?usuarioId=1&nivel=VERMELHO
 * GET /api/alertas?usuarioId=1&ativo=true
 * GET /api/alertas?sessaoId=abc123&status=ATIVO,VISUALIZADO,EM_ACOMPANHAMENTO
 */
export async function GET(request: NextRequest) {
  try {
    // Extrair e validar query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      usuarioId: searchParams.get('usuarioId'),
      nivel: searchParams.get('nivel'),
      tipo: searchParams.get('tipo'),
      ativo: searchParams.get('ativo'),
      questionarioId: searchParams.get('questionarioId'),
      sessaoId: searchParams.get('sessaoId'),
      status: searchParams.get('status'),
    };

    const validatedParams = AlertasQuerySchema.safeParse(queryParams);

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          erro: 'Parâmetros inválidos',
          detalhes: validatedParams.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Construir filtros para Prisma
    const where: any = {};

    // Filtro de ativo (padrão: não filtrar, mostrar todos se não especificado)
    if (validatedParams.data.ativo !== undefined && validatedParams.data.ativo !== null) {
      where.ativo = validatedParams.data.ativo === 'true';
    }

    if (validatedParams.data.usuarioId) {
      where.usuarioId = validatedParams.data.usuarioId;
    }

    if (validatedParams.data.nivel) {
      where.nivel = validatedParams.data.nivel;
    }

    if (validatedParams.data.tipo) {
      where.tipo = validatedParams.data.tipo;
    }

    if (validatedParams.data.questionarioId) {
      where.questionarioId = validatedParams.data.questionarioId;
    }

    if (validatedParams.data.sessaoId) {
      where.sessaoId = validatedParams.data.sessaoId;
    }

    // Filtro de status (suporta múltiplos valores separados por vírgula)
    if (validatedParams.data.status) {
      const statusList = validatedParams.data.status.split(',').map(s => s.trim());
      // Mapear status para ativo/resolvido
      const statusMap: any = {};
      
      if (statusList.includes('ATIVO')) {
        statusMap.ativo = true;
        statusMap.resolvidoEm = null;
      }
      if (statusList.includes('VISUALIZADO')) {
        statusMap.notificado = true;
      }
      if (statusList.includes('EM_ACOMPANHAMENTO')) {
        // Alertas em acompanhamento são aqueles visualizados mas ainda ativos
        statusMap.ativo = true;
        statusMap.notificado = true;
      }
      if (statusList.includes('RESOLVIDO')) {
        statusMap.ativo = false;
      }

      Object.assign(where, statusMap);
    }

    // Buscar alertas
    const alertas = await prisma.alertaSocioemocional.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true,
          },
        },
        questionario: {
          select: {
            id: true,
            titulo: true,
            tipo: true,
          },
        },
        sessao: {
          select: {
            id: true,
            status: true,
            iniciadoEm: true,
            finalizadoEm: true,
          },
        },
      },
      orderBy: [
        { nivel: 'desc' }, // VERMELHO → LARANJA → AMARELO → VERDE
        { criadoEm: 'desc' }, // Mais recentes primeiro
      ],
    });

    // Formatar resposta
    const alertasFormatados = alertas.map((alerta) => ({
      id: alerta.id,
      tipo: alerta.tipo,
      nivel: alerta.nivel,
      categoria: alerta.categoria,
      mensagem: alerta.mensagem,
      descricao: alerta.descricao,
      recomendacoes: alerta.recomendacoes,
      notificado: alerta.notificado,
      ativo: alerta.ativo,
      usuario: alerta.usuario,
      questionario: alerta.questionario,
      sessao: alerta.sessao
        ? {
            id: alerta.sessao.id,
            status: alerta.sessao.status,
            iniciadoEm: alerta.sessao.iniciadoEm,
            finalizadoEm: alerta.sessao.finalizadoEm,
          }
        : null,
      criadoEm: alerta.criadoEm,
      atualizadoEm: alerta.atualizadoEm,
      resolvidoEm: alerta.resolvidoEm,
    }));

    // Contar por nível
    const contagemPorNivel = alertasFormatados.reduce(
      (acc, alerta) => {
        acc[alerta.nivel] = (acc[alerta.nivel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      total: alertasFormatados.length,
      contagemPorNivel,
      alertas: alertasFormatados,
    });
  } catch (error) {
    console.error('[API] Erro ao buscar alertas:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar alertas',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alertas/[id]
 * 
 * Atualiza status de um alerta (marcar como resolvido, desativar, etc.)
 * Implementado em: /api/alertas/[id]/route.ts
 */
