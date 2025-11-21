import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const createUserSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['ALUNO', 'PROFESSOR', 'ADMIN']).default('ALUNO'),
  materia: z.string().optional()
})

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senha, ...rest } = createUserSchema.parse(body)
    
    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: rest.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)
    
    const usuario = await prisma.usuario.create({
      data: {
        ...rest,
        senha: senhaHash
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        materia: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
