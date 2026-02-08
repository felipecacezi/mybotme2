
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  const isProtectedRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/cadastro') || pathname.startsWith('/forgot-password')

  // If the user is trying to access a protected route without a token,
  // redirect them to the login page.
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If the user is authenticated and tries to access an auth page (login/register),
  // redirect them to the dashboard.
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
   matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the public landing page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-*.js|/).+)',
    '/', // Re-include the root path if you want middleware to run on it
  ],
}
