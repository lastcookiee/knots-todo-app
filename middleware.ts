// Middleware for route protection and authentication
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/api/auth/login', '/api/auth/register']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Get token from request headers or cookies
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('knots_token')?.value

  // If accessing a protected API route without token
  if (pathname.startsWith('/api') && !isPublicRoute && !token) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Authentication required' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // For page routes, let the client-side routing handle redirects
  // since localStorage tokens are not available in middleware

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}