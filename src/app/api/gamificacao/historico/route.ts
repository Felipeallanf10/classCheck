/**
 * API de Histórico de XP
 * GET /api/gamificacao/historico?usuarioId={id}&limite={numero}
 */

import { NextRequest, NextResponse } from 'next/server';
import { buscarHistoricoXP } from '@/lib/gamificacao/xp-service';
import { buscarHistoricoSchema } from '@/lib/gamificacao/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const limite = searchParams.get('limite');

    // Valida parâmetros
    const validacao = buscarHistoricoSchema.safeParse({
      usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
      limite: limite ? parseInt(limite) : 20,
    });

    if (!validacao.success) {
      return NextResponse.json(
        { erro: 'Parâmetros inválidos', detalhes: validacao.error.errors },
        { status: 400 }
      );
    }

    const historico = await buscarHistoricoXP(
      validacao.data.usuarioId,
      validacao.data.limite
    );

    return NextResponse.json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar histórico de XP' },
      { status: 500 }
    );
  }
}
