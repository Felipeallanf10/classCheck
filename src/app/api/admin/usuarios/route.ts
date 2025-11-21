import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/usuarios
 * Lista todos os usuários (apenas ADMIN)
 */
export async function GET(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    // Buscar parâmetros de filtro
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const ativo = searchParams.get('ativo');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (ativo !== null) {
      where.ativo = ativo === 'true';
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar usuários
    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        avatar: true,
        materia: true,
        createdAt: true,
        _count: {
          select: {
            turmasAluno: true,
            turmasProfessor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      usuarios: usuarios.map((u) => ({
        ...u,
        totalTurmas: u.role === 'PROFESSOR' ? u._count.turmasProfessor : u._count.turmasAluno,
      })),
      total: usuarios.length,
    });

  } catch (error) {
    console.error('[API] Erro ao listar usuários:', error);
    return NextResponse.json(
      { erro: 'Erro ao listar usuários', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/usuarios
 * Cria um novo usuário (apenas ADMIN)
 */
export async function POST(request: NextRequest) {
  // Verificar permissão de ADMIN
  const { authorized, error } = await checkRole(['ADMIN']);
  if (!authorized) return error!;

  try {
    const body = await request.json();
    const { nome, email, senha, role, materia, ativo } = body;

    // Validações
    if (!nome || !email || !senha || !role) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: nome, email, senha, role' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existente) {
      return NextResponse.json(
        { erro: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role,
        materia: role === 'PROFESSOR' ? materia : null,
        ativo: ativo ?? true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        materia: true,
        createdAt: true,
      },
    });

    return NextResponse.json(novoUsuario, { status: 201 });

  } catch (error) {
    console.error('[API] Erro ao criar usuário:', error);
    return NextResponse.json(
      { erro: 'Erro ao criar usuário', mensagem: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
