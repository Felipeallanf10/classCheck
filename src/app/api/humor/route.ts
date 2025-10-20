import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoHumor = z.enum(['MUITO_TRISTE', 'TRISTE', 'NEUTRO', 'FELIZ', 'MUITO_FELIZ'])

const createHumorSchema = z.object({
  usuarioId: z.number().int().positive('ID do usuário é obrigatório'),
  humor: TipoHumor,
  data: z.string().datetime().optional(), // Se não fornecido, usa data atual
  observacao: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').optional().nullable()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const usuarioId = searchParams.get('usuarioId')
    const humor = searchParams.get('humor')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId)
    }
    
    if (humor && TipoHumor.safeParse(humor).success) {
      where.humor = humor
    }
    
    if (dataInicio || dataFim) {
      where.data = {}
      
      if (dataInicio) {
        where.data.gte = new Date(dataInicio)
      }
      
      if (dataFim) {
        where.data.lte = new Date(dataFim)
      }
    }

    // Buscar total de registros para paginação
    const total = await prisma.humorRegistro.count({ where })

    // Buscar registros de humor com paginação
    const registros = await prisma.humorRegistro.findMany({
      where,
      select: {
        id: true,
        humor: true,
        data: true,
        observacao: true,
        createdAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: { data: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      data: registros,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar registros de humor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createHumorSchema.parse(body)

    // Verificar se usuário existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.usuarioId }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { error: 'Usuário não está ativo' },
        { status: 400 }
      )
    }

    // Definir data (usar fornecida ou data atual)
    const dataRegistro = data.data ? new Date(data.data) : new Date()
    
    // Normalizar data para apenas a data (sem hora)
    const dataSemHora = new Date(dataRegistro.setHours(0, 0, 0, 0))

    // Verificar se já existe registro de humor para este usuário nesta data
    const registroExistente = await prisma.humorRegistro.findUnique({
      where: {
        usuarioId_data: {
          usuarioId: data.usuarioId,
          data: dataSemHora
        }
      }
    })

    if (registroExistente) {
      return NextResponse.json(
        { 
          error: 'Você já registrou seu humor hoje. Use PUT para editar o registro.',
          registroExistente: {
            id: registroExistente.id,
            humor: registroExistente.humor,
            data: registroExistente.data
          }
        },
        { status: 409 }
      )
    }

    // Criar registro de humor
    const registro = await prisma.humorRegistro.create({
      data: {
        usuarioId: data.usuarioId,
        humor: data.humor,
        data: dataSemHora,
        observacao: data.observacao
      },
      select: {
        id: true,
        humor: true,
        data: true,
        observacao: true,
        createdAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true
          }
        }
      }
    })

    // ⚠️ SISTEMA DE ALERTAS - Detectar humor baixo consecutivo
    if (data.humor === 'MUITO_TRISTE' || data.humor === 'TRISTE') {
      // Buscar últimos 7 dias de humor do usuário
      const seteDiasAtras = new Date()
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

      const registrosRecentes = await prisma.humorRegistro.findMany({
        where: {
          usuarioId: data.usuarioId,
          data: {
            gte: seteDiasAtras
          }
        },
        orderBy: { data: 'desc' },
        take: 7
      })

      // Contar dias consecutivos de humor baixo
      let diasConsecutivos = 0
      for (const reg of registrosRecentes) {
        if (reg.humor === 'MUITO_TRISTE' || reg.humor === 'TRISTE') {
          diasConsecutivos++
        } else {
          break
        }
      }

      // Se 3 ou mais dias consecutivos, retornar alerta
      if (diasConsecutivos >= 3) {
        return NextResponse.json({
          ...registro,
          alerta: {
            tipo: 'HUMOR_BAIXO_CONSECUTIVO',
            mensagem: `Detectamos ${diasConsecutivos} dias consecutivos de humor baixo. Considere procurar apoio.`,
            diasConsecutivos,
            gravidade: diasConsecutivos >= 5 ? 'ALTA' : 'MEDIA'
          }
        }, { status: 201 })
      }
    }

    return NextResponse.json(registro, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Erro de constraint unique do Prisma
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Você já registrou seu humor para esta data' },
        { status: 409 }
      )
    }

    console.error('Erro ao criar registro de humor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
