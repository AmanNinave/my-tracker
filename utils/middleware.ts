import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Get token from cookie

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile']; // Example protected routes

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?callbackUrl=${request.nextUrl.pathname}`
    return NextResponse.redirect(url)
  }

  if(!isProtectedRoute && token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'], // Match all routes except API, static, and files
};