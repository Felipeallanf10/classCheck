import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helpers'

// GET - Buscar dados do perfil do usuário logado
export async function GET() {
  // Verificar autenticação
  const { authenticated, userId, error } = await requireAuth()
  if (!authenticated) return error!

  try {

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        avatar: true,
        role: true,
        materia: true,
        ativo: true,
        createdAt: true,
      },
    })

    if (!usuario) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { erro: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar dados do perfil
export async function PATCH(request: Request) {
  // Verificar autenticação
  const { authenticated, userId, error } = await requireAuth()
  if (!authenticated) return error!

  try {
    const body = await request.json()

    const { nome, email, avatar, materia, senhaAtual, novaSenha } = body

    // Buscar usuário atual
    const usuarioAtual = await prisma.usuario.findUnique({
      where: { id: userId },
    })

    if (!usuarioAtual) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Se está alterando email, verificar se já existe
    if (email && email !== usuarioAtual.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: { email },
      })

      if (emailExistente) {
        return NextResponse.json(
          { erro: 'Este email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: any = {}

    if (nome) updateData.nome = nome
    if (email) updateData.email = email
    if (avatar !== undefined) updateData.avatar = avatar
    if (materia !== undefined && usuarioAtual.role === 'PROFESSOR') {
      updateData.materia = materia
    }

    // Se está alterando senha
    if (novaSenha && senhaAtual) {
      const bcrypt = require('bcryptjs')
      
      // Verificar senha atual
      const senhaValida = await bcrypt.compare(senhaAtual, usuarioAtual.senha)
      
      if (!senhaValida) {
        return NextResponse.json(
          { erro: 'Senha atual incorreta' },
          { status: 400 }
        )
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10)
      updateData.senha = novaSenhaHash
    }

    // Atualizar usuário
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        avatar: true,
        role: true,
        materia: true,
        ativo: true,
        createdAt: true,
      },
    })

    return NextResponse.json(usuarioAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { erro: 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}
