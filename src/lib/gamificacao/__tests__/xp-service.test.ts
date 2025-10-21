import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

// Mocks com factory functions para evitar hoisting issues
vi.mock('@/lib/prisma', () => {
  const perfilGamificacaoMock = {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  }

  const historicoXPMock = {
    create: vi.fn(),
    findMany: vi.fn(),
  }

  return {
    prisma: {
      perfilGamificacao: perfilGamificacaoMock,
      historicoXP: historicoXPMock,
      $transaction: vi.fn((operations: any) => {
        if (Array.isArray(operations)) {
          return Promise.all(operations)
        }
        return operations({ perfilGamificacao: perfilGamificacaoMock, historicoXP: historicoXPMock })
      }),
    },
  }
})

vi.mock('../conquistas-service', () => ({
  verificarConquistas: vi.fn(() => Promise.resolve([])),
}))

import { adicionarXP } from '../xp-service'
import { prisma } from '@/lib/prisma'
import { verificarConquistas } from '../conquistas-service'

describe('adicionarXP', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-10-21T12:00:00Z'))
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('atualiza perfil e histórico usando transação', async () => {
    const ultimaAtividade = new Date('2025-10-20T12:00:00Z')

    vi.mocked(prisma.perfilGamificacao.findUnique)
      .mockResolvedValueOnce({
        id: 42,
        usuarioId: 1,
        xpTotal: 200,
        nivel: 3,
        streakAtual: 2,
        melhorStreak: 2,
        ultimaAtividade,
        totalAvaliacoes: 5,
        avaliacoesConsecutivas: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .mockResolvedValueOnce({
        id: 42,
        usuarioId: 1,
        xpTotal: 200,
        nivel: 3,
        streakAtual: 2,
        melhorStreak: 2,
        ultimaAtividade,
        totalAvaliacoes: 5,
        avaliacoesConsecutivas: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

    vi.mocked(prisma.perfilGamificacao.create).mockReset()
    vi.mocked(prisma.perfilGamificacao.update).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.historicoXP.create).mockResolvedValueOnce({} as any)

    const resultado = await adicionarXP({
      usuarioId: 1,
      acao: 'AVALIAR_AULA',
      descricao: 'Teste de XP',
    })

    expect(prisma.perfilGamificacao.create).not.toHaveBeenCalled()
    expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    expect(prisma.perfilGamificacao.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { usuarioId: 1 },
        data: expect.objectContaining({
          xpTotal: 380,
          nivel: 3,
          streakAtual: 3,
          avaliacoesConsecutivas: 3,
        }),
      }),
    )
    expect(prisma.historicoXP.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          perfilId: 42,
          xpGanho: 180,
          acao: 'AVALIAR_AULA',
        }),
      }),
    )

    expect(resultado).toMatchObject({
      xpGanho: 180,
      xpTotal: 380,
      nivelAtual: 3,
      subiuNivel: false,
      streakAtual: 3,
    })

    expect(verificarConquistas).toHaveBeenCalledWith({
      usuarioId: 1,
      acao: 'AVALIAR_AULA',
    })
  })

  it('cria perfil quando não existe e inicializa estatísticas', async () => {
    vi.mocked(prisma.perfilGamificacao.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

    vi.mocked(prisma.perfilGamificacao.create).mockResolvedValueOnce({
      id: 99,
      usuarioId: 2,
      xpTotal: 0,
      nivel: 1,
      streakAtual: 0,
      melhorStreak: 0,
      ultimaAtividade: null,
      totalAvaliacoes: 0,
      avaliacoesConsecutivas: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    vi.mocked(prisma.perfilGamificacao.update).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.historicoXP.create).mockResolvedValueOnce({} as any)

    const resultado = await adicionarXP({
      usuarioId: 2,
      acao: 'AVALIAR_AULA',
    })

    expect(prisma.perfilGamificacao.create).toHaveBeenCalledTimes(1)
    expect(prisma.perfilGamificacao.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { usuarioId: 2 },
        data: expect.objectContaining({
          xpTotal: 150,
          streakAtual: 1,
          avaliacoesConsecutivas: 1,
        }),
      }),
    )

    expect(prisma.historicoXP.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          perfilId: 99,
          xpGanho: 150,
        }),
      }),
    )

    expect(resultado).toMatchObject({
      xpTotal: 150,
      nivelAtual: 2,
      streakAtual: 1,
      subiuNivel: true,
    })
    expect(resultado.multiplicadorAplicado).toBeCloseTo(1.5, 5)
  })
})
