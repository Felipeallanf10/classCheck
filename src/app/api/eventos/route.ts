import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoEvento = z.enum(['AULA', 'PROVA', 'EVENTO', 'FERIADO', 'REUNIAO'])

const createEventoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres'),
  descricao: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional().nullable(),
  dataInicio: z.string().datetime('Data de início inválida'),
  dataFim: z.string().datetime('Data de fim inválida').optional().nullable(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)').optional().nullable(),
  tipo: TipoEvento,
  aulaId: z.number().int().positive().optional().nullable()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const tipo = searchParams.get('tipo')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const aulaId = searchParams.get('aulaId')
    const mes = searchParams.get('mes') // Formato: YYYY-MM
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (tipo && TipoEvento.safeParse(tipo).success) {
      where.tipo = tipo
    }
    
    if (aulaId) {
      where.aulaId = parseInt(aulaId)
    }
    
    // Filtro por período
    if (mes) {
      // Filtrar por mês específico
      const [ano, mesNum] = mes.split('-').map(Number)
      const primeiroDia = new Date(ano, mesNum - 1, 1)
      const ultimoDia = new Date(ano, mesNum, 0, 23, 59, 59)
      
      where.dataInicio = {
        gte: primeiroDia,
        lte: ultimoDia
      }
    } else if (dataInicio || dataFim) {
      where.dataInicio = {}
      
      if (dataInicio) {
        where.dataInicio.gte = new Date(dataInicio)
      }
      
      if (dataFim) {
        where.dataInicio.lte = new Date(dataFim)
      }
    }

    // Buscar total de registros para paginação
    const total = await prisma.evento.count({ where })

    // Buscar eventos com paginação
    const eventos = await prisma.evento.findMany({
      where,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        cor: true,
        tipo: true,
        createdAt: true,
        updatedAt: true,
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            duracao: true,
            sala: true,
            status: true,
            professor: {
              select: {
                id: true,
                nome: true,
                materia: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { dataInicio: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      data: eventos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createEventoSchema.parse(body)

    // Se é um evento de AULA, verificar se aula existe
    if (data.tipo === 'AULA' && data.aulaId) {
      const aula = await prisma.aula.findUnique({
        where: { id: data.aulaId }
      })

      if (!aula) {
        return NextResponse.json(
          { error: 'Aula não encontrada' },
          { status: 404 }
        )
      }

      if (aula.status === 'CANCELADA') {
        return NextResponse.json(
          { error: 'Não é possível criar evento para aula cancelada' },
          { status: 400 }
        )
      }
    }

    // Validar que dataFim é posterior a dataInicio
    if (data.dataFim) {
      const inicio = new Date(data.dataInicio)
      const fim = new Date(data.dataFim)
      
      if (fim <= inicio) {
        return NextResponse.json(
          { error: 'Data de fim deve ser posterior à data de início' },
          { status: 400 }
        )
      }
    }

    // Definir cor padrão baseada no tipo se não fornecida
    const coresPadrao: Record<string, string> = {
      AULA: '#3B82F6',      // Azul
      PROVA: '#EF4444',     // Vermelho
      EVENTO: '#10B981',    // Verde
      FERIADO: '#F59E0B',   // Laranja
      REUNIAO: '#8B5CF6'    // Roxo
    }

    const eventoData = {
      ...data,
      dataInicio: new Date(data.dataInicio),
      dataFim: data.dataFim ? new Date(data.dataFim) : null,
      cor: data.cor || coresPadrao[data.tipo] || '#6B7280'
    }

    const evento = await prisma.evento.create({
      data: eventoData,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        cor: true,
        tipo: true,
        createdAt: true,
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            professor: {
              select: {
                id: true,
                nome: true,
                materia: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
