/**
 * API de Perfil de Gamificação
 * GET /api/gamificacao/perfil?usuarioId={id}
 */

import { NextRequest, NextResponse } from 'next/server';
import { buscarPerfilGamificacao } from '@/lib/gamificacao/xp-service';
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

    const perfil = await buscarPerfilGamificacao(validacao.data.usuarioId);

    if (!perfil) {
      return NextResponse.json(
        { erro: 'Perfil não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(perfil);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar perfil de gamificação' },
      { status: 500 }
    );
  }
}
