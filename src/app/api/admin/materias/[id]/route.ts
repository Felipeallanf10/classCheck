import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/materias/[id]
 * Atualiza uma matéria (apenas ADMIN)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { nome, descricao, ativa } = body;

    // Verificar se matéria existe
    const materiaExistente = await prisma.materia.findUnique({
      where: { id },
    });

    if (!materiaExistente) {
      return NextResponse.json(
        { erro: 'Matéria não encontrada' },
        { status: 404 }
      );
    }

    // Se mudou o nome, verificar se não existe outra matéria com esse nome
    if (nome && nome.trim() !== materiaExistente.nome) {
      const nomeJaExiste = await prisma.materia.findUnique({
        where: { nome: nome.trim() },
      });

      if (nomeJaExiste) {
        return NextResponse.json(
          { erro: 'Já existe uma matéria com esse nome' },
          { status: 409 }
        );
      }
    }

    // Preparar dados para update
    const updateData: any = {};

    if (nome && nome.trim() !== '') updateData.nome = nome.trim();
    if (descricao !== undefined) updateData.descricao = descricao?.trim() || null;
    if (ativa !== undefined) updateData.ativa = ativa;

    // Atualizar matéria
    const materiaAtualizada = await prisma.materia.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(materiaAtualizada);

  } catch (error) {
    console.error('[API] Erro ao atualizar matéria:', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar matéria', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/materias/[id]
 * Desativa uma matéria (soft delete) (apenas ADMIN)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Verificar se matéria existe
    const materiaExistente = await prisma.materia.findUnique({
      where: { id },
    });

    if (!materiaExistente) {
      return NextResponse.json(
        { erro: 'Matéria não encontrada' },
        { status: 404 }
      );
    }

    // Desativar matéria (soft delete)
    await prisma.materia.update({
      where: { id },
      data: { ativa: false },
    });

    return NextResponse.json({ 
      sucesso: true,
      mensagem: 'Matéria desativada com sucesso' 
    });

  } catch (error) {
    console.error('[API] Erro ao deletar matéria:', error);
    return NextResponse.json(
      { erro: 'Erro ao deletar matéria', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
