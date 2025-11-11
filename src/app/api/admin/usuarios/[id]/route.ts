import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/usuarios/[id]
 * Atualiza um usuário (apenas ADMIN)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verificar permissão de ADMIN
  const { authorized, userId: adminId, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nome, email, senha, role, materia, ativo } = body;

    // Verificar se usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Se mudou o email, verificar se não existe outro usuário com esse email
    if (email && email !== usuarioExistente.email) {
      const emailJaExiste = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailJaExiste) {
        return NextResponse.json(
          { erro: 'Email já cadastrado' },
          { status: 409 }
        );
      }
    }

    // Preparar dados para update
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (ativo !== undefined) updateData.ativo = ativo;
    
    // Matéria apenas para professores
    if (role === 'PROFESSOR' && materia) {
      updateData.materia = materia;
    } else if (role !== 'PROFESSOR') {
      updateData.materia = null;
    }

    // Se enviou senha, fazer hash
    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    // Atualizar usuário
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        materia: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(usuarioAtualizado);

  } catch (error) {
    console.error('[API] Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar usuário', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/usuarios/[id]
 * Desativa um usuário (soft delete) (apenas ADMIN)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verificar permissão de ADMIN
  const { authorized, userId: adminId, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const id = parseInt(params.id);

    // Não pode deletar a si mesmo
    if (id === adminId) {
      return NextResponse.json(
        { erro: 'Você não pode desativar sua própria conta' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Desativar usuário (soft delete)
    await prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });

    return NextResponse.json({ 
      sucesso: true,
      mensagem: 'Usuário desativado com sucesso' 
    });

  } catch (error) {
    console.error('[API] Erro ao deletar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao deletar usuário', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
