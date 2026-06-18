import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ cart: [] })
}

export async function POST() {
  return NextResponse.json({ message: 'Added to cart' })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Removed from cart' })
}
