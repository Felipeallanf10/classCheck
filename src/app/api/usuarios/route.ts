import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const createUserSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['ALUNO', 'PROFESSOR', 'ADMIN']).default('ALUNO')
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
    const data = createUserSchema.parse(body)
    
    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }
    
    const usuario = await prisma.usuario.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
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
