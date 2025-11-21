import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/turmas
 * Lista todas as turmas (apenas ADMIN)
 */
export async function GET(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {

    // Buscar parâmetros de filtro
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo');
    const ativa = searchParams.get('ativa');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};

    if (periodo) {
      where.periodo = periodo;
    }

    if (ativa !== null) {
      where.ativa = ativa === 'true';
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
        { ano: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar turmas
    const turmas = await prisma.turma.findMany({
      where,
      include: {
        _count: {
          select: {
            alunos: true,
            professores: true,
            aulas: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      turmas,
      total: turmas.length,
    });

  } catch (error) {
    console.error('[API] Erro ao listar turmas:', error);
    return NextResponse.json(
      { erro: 'Erro ao listar turmas', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/turmas
 * Cria uma nova turma (apenas ADMIN)
 */
export async function POST(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const body = await request.json();
    const { nome, codigo, ano, periodo, ativa } = body;

    // Validações
    if (!nome || !codigo || !ano || !periodo) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: nome, codigo, ano, periodo' },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const existente = await prisma.turma.findUnique({
      where: { codigo },
    });

    if (existente) {
      return NextResponse.json(
        { erro: 'Código de turma já cadastrado' },
        { status: 409 }
      );
    }

    // Criar turma
    const novaTurma = await prisma.turma.create({
      data: {
        nome,
        codigo,
        ano,
        periodo,
        ativa: ativa ?? true,
      },
      include: {
        _count: {
          select: {
            alunos: true,
            professores: true,
            aulas: true,
          },
        },
      },
    });

    return NextResponse.json(novaTurma, { status: 201 });

  } catch (error) {
    console.error('[API] Erro ao criar turma:', error);
    return NextResponse.json(
      { erro: 'Erro ao criar turma', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
