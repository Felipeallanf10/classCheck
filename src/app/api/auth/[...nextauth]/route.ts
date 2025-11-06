// NextAuth.js route handler
import { NextResponse } from 'next/server'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ message: 'NextAuth endpoint' })
}

export async function POST() {
  return NextResponse.json({ message: 'NextAuth endpoint' })
}