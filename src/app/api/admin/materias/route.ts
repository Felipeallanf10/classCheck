import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/materias
 * Lista todas as matérias (apenas ADMIN)
 */
export async function GET(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const { searchParams } = new URL(request.url);
    const apenasAtivas = searchParams.get('ativas') === 'true';

    const where = apenasAtivas ? { ativa: true } : {};

    const materias = await prisma.materia.findMany({
      where,
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json({ materias });

  } catch (error) {
    console.error('[API] Erro ao listar matérias:', error);
    return NextResponse.json(
      { erro: 'Erro ao listar matérias', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/materias
 * Cria uma nova matéria (apenas ADMIN)
 */
export async function POST(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const body = await request.json();
    const { nome, descricao } = body;

    // Validações
    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { erro: 'Nome da matéria é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se matéria já existe
    const existente = await prisma.materia.findUnique({
      where: { nome: nome.trim() },
    });

    if (existente) {
      return NextResponse.json(
        { erro: 'Matéria já cadastrada' },
        { status: 409 }
      );
    }

    // Criar matéria
    const novaMateria = await prisma.materia.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
      },
    });

    return NextResponse.json(novaMateria, { status: 201 });

  } catch (error) {
    console.error('[API] Erro ao criar matéria:', error);
    return NextResponse.json(
      { erro: 'Erro ao criar matéria', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
