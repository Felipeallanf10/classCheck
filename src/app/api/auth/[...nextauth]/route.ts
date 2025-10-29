// NextAuth.js route handler
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'NextAuth endpoint' })
}

export async function POST() {
  return NextResponse.json({ message: 'NextAuth endpoint' })
}