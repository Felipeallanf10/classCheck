import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { limparCache, estatisticasCache, verificarConexao } from '@/lib/cache/redis-cache';

// Forçar dinâmico
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/cache
 * Obter estatísticas do cache
 */
export async function GET() {
  try {
    const usuario = await requireAuth();

    if (usuario.role !== 'ADMIN') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    const stats = await estatisticasCache();
    const conectado = await verificarConexao();

    return NextResponse.json({
      sucesso: true,
      dados: {
        ...stats,
        conectado,
      },
    });
  } catch (erro) {
    console.error('[API Admin Cache] Erro ao obter estatísticas:', erro);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/cache
 * Limpar todo o cache (somente ADMIN)
 */
export async function DELETE() {
  try {
    const usuario = await requireAuth();

    if (usuario.role !== 'ADMIN') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    await limparCache();

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Cache limpo com sucesso',
    });
  } catch (erro) {
    console.error('[API Admin Cache] Erro ao limpar cache:', erro);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
