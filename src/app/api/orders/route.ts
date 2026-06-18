import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  // Placeholder for creating COD order in Supabase
  return NextResponse.json({ message: 'Order placed successfully', order: body })
}
