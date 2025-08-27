import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Handle Locale
  const pathnameIsMissingLocale = !routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameIsMissingLocale) {
    return intlMiddleware(request);
  }

  const locale = pathname.split('/')[1] || routing.defaultLocale;

  // 2. Get User Token (which now includes the role)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // 3. Define Page Types
  const authPages = [
    `/${locale}/auth/login`,
    `/${locale}/auth/register`,
    `/${locale}/auth/confirm-email`,
    `/${locale}/auth/verifyemail`,
  ];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const isLandingPage = pathname === `/${locale}`;
  
  const publicPages = [
    `/${locale}/shop`,
    `/${locale}/auth/onboarding`,
  ];
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));

  // 4. Handle Redirects for Logged-in Users on Public Pages
  if (isAuthenticated && (isLandingPage || isAuthPage)) {
    // If a logged-in user tries to access login/landing, redirect to their dashboard
    if (userRole === 'seller') {
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    }
    // Default redirect for affiliates or users with other roles
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
  }

  // Allow access to other public pages for everyone
  if (isPublicPage || isAuthPage || isLandingPage) {
    return intlMiddleware(request) || NextResponse.next();
  }

  // 5. Handle Protected Pages: From here on, all routes require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 6. Enforce Strict Role-Based Routing for Authenticated Users
  const isAffiliatePath = pathname.startsWith(`/${locale}/affiliate`);
  const isSellerPath = pathname.startsWith(`/${locale}/seller`);

  if (userRole === 'seller' && !isSellerPath) {
    // If a seller is anywhere but a seller path, redirect them.
    return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
  }
  
  if (userRole === 'affiliate' && !isAffiliatePath) {
    // If an affiliate is anywhere but an affiliate path, redirect them.
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
  }
  
  if (!userRole) {
    // User is logged in but has no role, send them to login.
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // If all checks pass, allow access.
  return intlMiddleware(request) || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};