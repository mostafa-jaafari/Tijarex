import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// --- Define a constant for the referral cookie name ---
const REFERRAL_COOKIE_NAME = 'referral_id';

// --- The main middleware function ---
export async function middleware(request: NextRequest) {
  
  // --- 1. Check for a referral code in the URL's query parameters ---
  const refCode = request.nextUrl.searchParams.get('ref');

  // --- 2. Execute all your original routing and auth logic to get the intended response ---
  const response = await handleAuthAndRouting(request);

  // --- 3. If a referral code was found, set the cookie on the response ---
  if (refCode) {
    response.cookies.set({
      name: REFERRAL_COOKIE_NAME,
      value: refCode, // The value from the URL (e.g., the affiliate's unique ID)
      path: '/',      // Make the cookie available on all pages of your site
      httpOnly: true, // For security, prevent client-side JS from accessing it
      secure: process.env.NODE_ENV === 'production', // Use only on HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days (in seconds)
    });
  }
  
  // --- 4. Return the final response (either original or with the new cookie) ---
  return response;
}

// --- All of your original middleware logic is now safely contained in this function ---
async function handleAuthAndRouting(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // 1. Handle Locale
  const pathnameIsMissingLocale = !routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameIsMissingLocale) {
    return intlMiddleware(request);
  }

  const locale = pathname.split('/')[1] || routing.defaultLocale;

  // 2. Get User Token
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
    if (userRole === 'seller') {
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
  }

  // Allow access to other public pages for everyone
  if (isPublicPage || isAuthPage || isLandingPage) {
    return intlMiddleware(request) || NextResponse.next();
  }

  // 5. Handle Protected Pages
  if (!isAuthenticated) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 6. Enforce Strict Role-Based Routing for Authenticated Users
  const isAffiliatePath = pathname.startsWith(`/${locale}/affiliate`);
  const isSellerPath = pathname.startsWith(`/${locale}/seller`);

  if (userRole === 'seller' && !isSellerPath) {
    return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
  }
  
  if (userRole === 'affiliate' && !isAffiliatePath) {
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
  }
  
  if (!userRole) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // If all checks pass, allow access.
  return intlMiddleware(request) || NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};