import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('admin_session');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  // Jika belum login dan mencoba buka /admin, lempar ke halaman login
  if (!hasSession && !isLoginRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Jika sudah login tapi buka halaman login, kembalikan ke /admin
  if (hasSession && isLoginRoute) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};