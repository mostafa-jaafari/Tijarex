import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Extract locale from pathname (assuming format like /en/auth/login)
  const pathnameIsMissingLocale = !routing.locales.some(
  (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
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
    `/${locale}/auth/confirm-email`,
    `/${locale}/auth/verifyemail`,
  ];
  
  // Fixed: Check shop pages properly
  const isShopPage = pathname.startsWith(`/${locale}/shop`);
  const isOnboardingPage = pathname === `/${locale}/auth/onboarding`;
  const isNotProtectedPage = isShopPage || isOnboardingPage;

  const isAuthPage = authPages.some(page => pathname.startsWith(page));
  const isLandingPage = pathname === `/${locale}`; // Landing page (root with locale)
  
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
  
  // Shop pages and onboarding: accessible without authentication
  if (isNotProtectedPage) {
    const response = intlMiddleware(request);
    return response || NextResponse.next();
  }
  
  // Protected pages logic: require authentication
  if (!token) {
    // Not logged-in user trying to access protected pages → redirect to landing
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  // Apply next-intl middleware for other cases
  const response = intlMiddleware(request);
  return response || NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
