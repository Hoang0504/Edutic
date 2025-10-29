import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/reset-password',
    '/api/auth/google'
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  // Static files and API routes (except auth) can pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Static files like favicon.ico, etc.
  ) {
    return NextResponse.next();
  }

  // Get token from various sources
  let token: string | null = null;
  
  // First try to get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // If no header token, try to get from cookies
  if (!token) {
    token = request.cookies.get('mytoeic_token')?.value || null;
  }

  // If no token found and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If we have a token, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        // Token expired
        if (!isPublicRoute) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('message', 'Phiên đăng nhập đã hết hạn');
          const response = NextResponse.redirect(loginUrl);
          response.cookies.delete('mytoeic_token');
          return response;
        }
      }

      // Check admin routes
      if (pathname.startsWith('/admin')) {
        if (decoded.role !== 'admin') {
          return NextResponse.redirect(new URL('/login?message=Bạn không có quyền truy cập', request.url));
        }
      }

      // Check protected routes (dashboard, practice, etc.)
      const protectedRoutes = ['/dashboard', '/practice', '/flashcards', '/exams', '/profile'];
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      
      if (isProtectedRoute && (!decoded.userId || !decoded.role)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('message', 'Vui lòng đăng nhập để tiếp tục');
        return NextResponse.redirect(loginUrl);
      }

      // If logged in user tries to access auth pages, redirect to appropriate dashboard
      if (token && (pathname === '/login' || pathname === '/register')) {
        if (decoded.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

    } catch (error) {
      console.error('JWT verification failed:', error);
      
      // Invalid token, clear it and redirect to login if accessing protected route
      if (!isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('message', 'Phiên đăng nhập không hợp lệ');
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('mytoeic_token');
        return response;
      }
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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 