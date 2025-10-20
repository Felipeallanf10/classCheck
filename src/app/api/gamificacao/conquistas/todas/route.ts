/**
 * API de Todas as Conquistas
 * GET /api/gamificacao/conquistas/todas
 */

import { NextResponse } from 'next/server';
import { buscarTodasConquistas } from '@/lib/gamificacao/conquistas-service';

export async function GET() {
  try {
    const conquistas = await buscarTodasConquistas();

    return NextResponse.json(conquistas);
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar conquistas disponíveis' },
      { status: 500 }
    );
  }
}
