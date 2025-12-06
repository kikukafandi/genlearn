import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/dna',
    '/major-matching',
    '/minimum-keilmuan',
    '/modules',
    '/simulator'
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dna/:path*',
    '/major-matching/:path*',
    '/minimum-keilmuan/:path*',
    '/modules/:path*',
    '/simulator/:path*'
  ]
};
