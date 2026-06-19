import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // We use localStorage for session (client-side only).
  // For server-side route protection we use a session cookie set on login.
  // The actual enforcement happens client-side via redirects in components.
  // This middleware simply passes all requests through without Supabase overhead.

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
