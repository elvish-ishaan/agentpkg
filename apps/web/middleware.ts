import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect routes requiring auth
  const protectedPaths = [
    '/dashboard',
    '/settings',
  ]

  // Check if current path starts with any protected path
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  // Also protect org settings pages (matches /orgs/[orgName]/settings)
  const isOrgSettings = /^\/orgs\/[^/]+\/settings/.test(pathname)

  if (!token && (isProtected || isOrgSettings)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
}
