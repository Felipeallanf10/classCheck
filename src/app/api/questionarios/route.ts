import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Schema de validação para query params
 */
const QueryParamsSchema = z.object({
  tipo: z.enum([
    'AUTOAVALIACAO',
    'DIAGNOSTICO',
    'TRIAGEM',
    'ACOMPANHAMENTO',
    'INTERVENCAO',
    'PESQUISA',
    'SCREENING',
    'LONGITUDINAL',
    'TRANSVERSAL'
  ]).nullable().optional(),
  categoria: z.string().nullable().optional(),
  adaptativo: z.enum(['true', 'false']).nullable().optional(),
  ativo: z.enum(['true', 'false']).nullable().optional(),
  oficial: z.enum(['true', 'false']).nullable().optional(),
});

/**
 * GET /api/questionarios
 * 
 * Lista questionários disponíveis
 * 
 * Query Params (todos opcionais):
 * - tipo: TipoQuestionario
 * - categoria: string (ex: BEM_ESTAR, DEPRESSAO)
 * - adaptativo: 'true' | 'false'
 * - ativo: 'true' | 'false' (se não especificado, retorna todos)
 * - oficial: 'true' | 'false'
 * 
 * @example
 * GET /api/questionarios - Lista todos os questionários
 * GET /api/questionarios?tipo=AUTOAVALIACAO&adaptativo=true
 * GET /api/questionarios?ativo=true&oficial=true
 * GET /api/questionarios?categoria=BEM_ESTAR
 */
export async function GET(request: NextRequest) {
  try {
    // Extrair e validar query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      tipo: searchParams.get('tipo'),
      categoria: searchParams.get('categoria'),
      adaptativo: searchParams.get('adaptativo'),
      ativo: searchParams.get('ativo'),
      oficial: searchParams.get('oficial'),
    };

    // Validar query params
    const validatedParams = QueryParamsSchema.safeParse(queryParams);
    
    if (!validatedParams.success) {
      return NextResponse.json(
        { 
          erro: 'Parâmetros inválidos',
          detalhes: validatedParams.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    // Construir filtros para Prisma
    const where: any = {};

    // Adicionar filtro de ativo apenas se especificado
    if (validatedParams.data.ativo !== null && validatedParams.data.ativo !== undefined) {
      where.ativo = validatedParams.data.ativo === 'true';
    }

    // Adicionar filtros opcionais
    if (validatedParams.data.tipo) {
      where.tipo = validatedParams.data.tipo;
    }

    if (validatedParams.data.categoria) {
      where.categorias = {
        has: validatedParams.data.categoria,
      };
    }

    if (validatedParams.data.adaptativo) {
      where.adaptativo = validatedParams.data.adaptativo === 'true';
    }

    if (validatedParams.data.oficial !== undefined && validatedParams.data.oficial !== null) {
      where.oficial = validatedParams.data.oficial === 'true';
    }

    // Buscar questionários no banco
    const questionarios = await prisma.questionarioSocioemocional.findMany({
      where,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        versao: true,
        tipo: true,
        frequencia: true,
        duracaoEstimada: true,
        categorias: true,
        adaptativo: true,
        nivelAdaptacao: true,
        instrucoes: true,
        tempoMinimo: true,
        tempoMaximo: true,
        idadeMinima: true,
        idadeMaxima: true,
        oficial: true,
        criadoEm: true,
        publicadoEm: true,
        _count: {
          select: {
            perguntas: true,
            sessoes: true,
          },
        },
      },
      orderBy: [
        { oficial: 'desc' }, // Oficiais primeiro
        { publicadoEm: 'desc' }, // Mais recentes primeiro
      ],
    });

    // Formatar resposta
    const questionariosFormatados = questionarios.map((q) => ({
      id: q.id,
      titulo: q.titulo,
      descricao: q.descricao,
      versao: q.versao,
      tipo: q.tipo,
      frequencia: q.frequencia,
      duracaoEstimada: q.duracaoEstimada,
      categorias: q.categorias,
      adaptativo: q.adaptativo,
      nivelAdaptacao: q.nivelAdaptacao,
      instrucoes: q.instrucoes,
      limitesTempo: {
        minimo: q.tempoMinimo,
        maximo: q.tempoMaximo,
      },
      limitesIdade: {
        minima: q.idadeMinima,
        maxima: q.idadeMaxima,
      },
      oficial: q.oficial,
      estatisticas: {
        totalPerguntas: q._count.perguntas,
        sessoesRealizadas: q._count.sessoes,
      },
      criadoEm: q.criadoEm,
      publicadoEm: q.publicadoEm,
    }));

    return NextResponse.json({
      success: true,
      total: questionariosFormatados.length,
      questionarios: questionariosFormatados,
    });

  } catch (error) {
    console.error('[API] Erro ao buscar questionários:', error);
    
    return NextResponse.json(
      { 
        erro: 'Erro ao buscar questionários',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/questionarios/[id]
 * 
 * Busca um questionário específico com suas perguntas
 * Implementado em: /api/questionarios/[id]/route.ts
 */
