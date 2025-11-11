import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-temp';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/avaliacoes/professor
 * 
 * Cria uma nova avaliação de professor
 * Permite apenas uma avaliação por professor por mês
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      professorId,
      dominioConteudo,
      clarezaExplicacao,
      pontualidade,
      organizacao,
      acessibilidade,
      empatia,
      comentario,
    } = body;

    // Pegar ID do usuário autenticado
    const usuarioId = await getCurrentUserId();

    // Validar campos obrigatórios
    if (!professorId) {
      return NextResponse.json(
        { erro: 'ID do professor é obrigatório' },
        { status: 400 }
      );
    }

    const criterios = [dominioConteudo, clarezaExplicacao, pontualidade, organizacao, acessibilidade, empatia];
    
    if (criterios.some(c => c === undefined || c === null || c < 1 || c > 5)) {
      return NextResponse.json(
        { erro: 'Todos os critérios devem ser avaliados com notas de 1 a 5' },
        { status: 400 }
      );
    }

    // Gerar período no formato YYYY-MM
    const hoje = new Date();
    const periodo = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

    // Verificar se o professor existe
    const professor = await prisma.usuario.findUnique({
      where: { id: professorId },
      select: { id: true, role: true, ativo: true },
    });

    if (!professor) {
      return NextResponse.json(
        { erro: 'Professor não encontrado' },
        { status: 404 }
      );
    }

    if (professor.role !== 'PROFESSOR') {
      return NextResponse.json(
        { erro: 'Usuário não é um professor' },
        { status: 400 }
      );
    }

    if (!professor.ativo) {
      return NextResponse.json(
        { erro: 'Professor não está ativo' },
        { status: 400 }
      );
    }

    // Verificar se já avaliou neste período
    const avaliacaoExistente = await prisma.avaliacaoProfessor.findUnique({
      where: {
        usuarioId_professorId_periodo: {
          usuarioId,
          professorId,
          periodo,
        },
      },
    });

    if (avaliacaoExistente) {
      return NextResponse.json(
        { erro: 'Você já avaliou este professor neste mês' },
        { status: 409 } // Conflict
      );
    }

    // Criar avaliação
    const avaliacao = await prisma.avaliacaoProfessor.create({
      data: {
        usuarioId,
        professorId,
        periodo,
        dominioConteudo: parseInt(dominioConteudo),
        clarezaExplicacao: parseInt(clarezaExplicacao),
        pontualidade: parseInt(pontualidade),
        organizacao: parseInt(organizacao),
        acessibilidade: parseInt(acessibilidade),
        empatia: parseInt(empatia),
        comentario: comentario || null,
      },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            materia: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        avaliacao: {
          id: avaliacao.id,
          professorNome: avaliacao.professor.nome,
          periodo: avaliacao.periodo,
          createdAt: avaliacao.createdAt,
        },
        mensagem: 'Avaliação enviada com sucesso! Obrigado por contribuir.',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[API] Erro ao salvar avaliação de professor:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao salvar avaliação',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/avaliacoes/professor
 * 
 * Verifica se o usuário já avaliou um professor neste período
 * Query params:
 * - professorId: number (obrigatório)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get('professorId');

    if (!professorId) {
      return NextResponse.json(
        { erro: 'ID do professor é obrigatório' },
        { status: 400 }
      );
    }

    // Pegar ID do usuário autenticado
    const usuarioId = await getCurrentUserId();

    // Gerar período atual
    const hoje = new Date();
    const periodo = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

    // Verificar se já avaliou
    const avaliacao = await prisma.avaliacaoProfessor.findUnique({
      where: {
        usuarioId_professorId_periodo: {
          usuarioId,
          professorId: parseInt(professorId),
          periodo,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      jaAvaliou: !!avaliacao,
      avaliacao: avaliacao ? {
        id: avaliacao.id,
        dataAvaliacao: avaliacao.createdAt,
      } : null,
    });

  } catch (error) {
    console.error('[API] Erro ao verificar avaliação:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao verificar avaliação',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
