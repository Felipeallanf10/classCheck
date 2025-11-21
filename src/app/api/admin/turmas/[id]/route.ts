import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/turmas/[id]
 * Atualiza uma turma (apenas ADMIN)
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
    const { nome, codigo, ano, periodo, ativa } = body;

    // Verificar se turma existe
    const turmaExistente = await prisma.turma.findUnique({
      where: { id },
    });

    if (!turmaExistente) {
      return NextResponse.json(
        { erro: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Se mudou o código, verificar se não existe outra turma com esse código
    if (codigo && codigo !== turmaExistente.codigo) {
      const codigoJaExiste = await prisma.turma.findUnique({
        where: { codigo },
      });

      if (codigoJaExiste) {
        return NextResponse.json(
          { erro: 'Código de turma já cadastrado' },
          { status: 409 }
        );
      }
    }

    // Preparar dados para update
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (codigo) updateData.codigo = codigo;
    if (ano) updateData.ano = ano;
    if (periodo) updateData.periodo = periodo;
    if (ativa !== undefined) updateData.ativa = ativa;

    // Atualizar turma
    const turmaAtualizada = await prisma.turma.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(turmaAtualizada);

  } catch (error) {
    console.error('[API] Erro ao atualizar turma:', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar turma', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/turmas/[id]
 * Desativa uma turma (soft delete) (apenas ADMIN)
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

    // Verificar se turma existe
    const turmaExistente = await prisma.turma.findUnique({
      where: { id },
    });

    if (!turmaExistente) {
      return NextResponse.json(
        { erro: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Desativar turma (soft delete)
    await prisma.turma.update({
      where: { id },
      data: { ativa: false },
    });

    return NextResponse.json({ 
      sucesso: true,
      mensagem: 'Turma desativada com sucesso' 
    });

  } catch (error) {
    console.error('[API] Erro ao deletar turma:', error);
    return NextResponse.json(
      { erro: 'Erro ao deletar turma', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
