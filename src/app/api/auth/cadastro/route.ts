import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema de validação
const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validatedData = cadastroSchema.parse(body);
    
    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.senha, 10);
    
    // Criar usuário com role ALUNO (padrão)
    const usuario = await prisma.usuario.create({
      data: {
        nome: validatedData.nome,
        email: validatedData.email,
        senha: hashedPassword,
        role: 'ALUNO', // Sempre cria como ALUNO
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        usuario
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
