import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/usuarios/[id]
 * 
 * Busca informações públicas de um usuário por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { erro: 'ID inválido' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        materia: true,
        avatar: true,
        ativo: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);

  } catch (error) {
    console.error('[API] Erro ao buscar usuário:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar usuário',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
