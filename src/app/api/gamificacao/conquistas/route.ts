/**
 * API Route: GET /api/gamificacao/conquistas
 * Lista todas as conquistas disponíveis
 */

import { NextResponse } from 'next/server'
import { buscarTodasConquistas } from '@/lib/gamificacao/conquistas-service'

export async function GET() {
  try {
    const conquistas = await buscarTodasConquistas()
    
    return NextResponse.json(conquistas, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conquistas' },
      { status: 500 }
    )
  }
}
