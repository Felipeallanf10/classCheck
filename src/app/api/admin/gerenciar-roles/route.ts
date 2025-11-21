import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação para atualizar role
const atualizarRoleSchema = z.object({
  usuarioId: z.number().positive(),
  novoRole: z.enum(['ALUNO', 'PROFESSOR', 'ADMIN']),
  materia: z.string().optional(), // Obrigatório apenas para PROFESSOR
});

// Listar todos os usuários (apenas ADMIN)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem acessar.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // Filtrar por role
    const busca = searchParams.get('busca'); // Buscar por nome ou email
    
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
      ];
    }
    
    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        materia: true,
        ativo: true,
        createdAt: true,
        avatar: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ usuarios });
    
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar usuários' },
      { status: 500 }
    );
  }
}

// Atualizar role de um usuário (apenas ADMIN)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem modificar roles.' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = atualizarRoleSchema.parse(body);
    
    // Validar: se for PROFESSOR, materia é obrigatória
    if (validatedData.novoRole === 'PROFESSOR' && !validatedData.materia) {
      return NextResponse.json(
        { error: 'Matéria é obrigatória para professores' },
        { status: 400 }
      );
    }
    
    // Verificar se usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: validatedData.usuarioId }
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar role
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: validatedData.usuarioId },
      data: {
        role: validatedData.novoRole,
        materia: validatedData.novoRole === 'PROFESSOR' 
          ? validatedData.materia 
          : null, // Limpar materia se não for professor
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        materia: true,
        ativo: true,
      }
    });
    
    return NextResponse.json({
      message: 'Role atualizado com sucesso',
      usuario: usuarioAtualizado
    });
    
  } catch (error: any) {
    console.error('Erro ao atualizar role:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao atualizar role' },
      { status: 500 }
    );
  }
}
