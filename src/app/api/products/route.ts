import { NextResponse } from 'next/server'

export async function GET() {
  // Placeholder for fetching from Supabase
  return NextResponse.json({ products: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  // Placeholder for creating in Supabase
  return NextResponse.json({ message: 'Product created', product: body })
}
