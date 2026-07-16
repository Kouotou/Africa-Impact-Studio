// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to default locale (fr)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, public assets, api routes, media files)
    '/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.pdf|.*\\.zip).*)',
  ],
};
