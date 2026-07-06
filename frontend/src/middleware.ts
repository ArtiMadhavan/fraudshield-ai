import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Check if it's a protected route (starts with /dashboard)
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access dashboard without a token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && token) {
    // Check if token is valid (not expired) using native atob (Edge compatible)
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      if (decoded.exp * 1000 > Date.now()) {
        // Redirect to dashboard if trying to access login/home while authenticated
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        // Token expired, let them access public routes but delete cookie
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    } catch (e) {
      // Invalid token, delete it
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .svg (svg files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
