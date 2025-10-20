/**
 * API de Progresso de Conquistas
 * GET /api/gamificacao/conquistas/progresso?usuarioId={id}
 */

import { NextRequest, NextResponse } from 'next/server';
import { buscarProgressoConquistas } from '@/lib/gamificacao/conquistas-service';
import { usuarioIdParamSchema } from '@/lib/gamificacao/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    // Valida parâmetros
    const validacao = usuarioIdParamSchema.safeParse({
      usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
    });

    if (!validacao.success) {
      return NextResponse.json(
        { erro: 'Parâmetro usuarioId é obrigatório e deve ser um número' },
        { status: 400 }
      );
    }

    const progresso = await buscarProgressoConquistas(validacao.data.usuarioId);

    return NextResponse.json(progresso);
  } catch (error) {
    console.error('Erro ao buscar progresso de conquistas:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar progresso de conquistas' },
      { status: 500 }
    );
  }
}
