import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Extract locale from pathname (assuming format like /en/auth/login)
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle locale redirection first
  if (pathnameIsMissingLocale) {
    const response = intlMiddleware(request);
    if (response) return response;
  }

  // Get current locale from pathname or default
  const locale = pathname.split('/')[1] || routing.defaultLocale;
  
  // Check authentication
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Define different page types
  const authPages = [
    `/${locale}/auth/login`,
    `/${locale}/auth/register`,
  ];
  
  const isAuthPage = authPages.some(page => pathname.startsWith(page));
  const isLandingPage = pathname === `/${locale}`; // Landing page (root with locale)
  const isSellerPage = pathname.startsWith(`/${locale}/seller`);
  
  // Landing page logic: only accessible to non-logged-in users
  if (isLandingPage) {
    if (token) {
      // Logged-in user trying to access landing page → redirect to seller
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    } else {
      // Not logged-in user → allow access to landing page
      const response = intlMiddleware(request);
      return response || NextResponse.next();
    }
  }
  
  // Auth pages logic: only accessible to non-logged-in users
  if (isAuthPage) {
    if (token) {
      // Logged-in user trying to access auth pages → redirect to seller
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    } else {
      // Not logged-in user → allow access to auth pages
      const response = intlMiddleware(request);
      return response || NextResponse.next();
    }
  }
  
  // Protected pages logic: require authentication
  if (!token && !isAuthPage && !isLandingPage) {
    // Not logged-in user trying to access protected pages → redirect to landing
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  // Apply next-intl middleware for other cases
  const response = intlMiddleware(request);
  return response || NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|trpc).*)',
    // Always run for root
    '/'
  ]
};