import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// --- تعريف اسم الكوكي الخاص بالريفيرال ---
const REFERRAL_COOKIE_NAME = 'referral_id';

// --- الدالة الرئيسية للـ middleware ---
export async function middleware(request: NextRequest) {
  // --- التحقق من وجود كود ريفيرال في رابط الصفحة ---
  const refCode = request.nextUrl.searchParams.get('ref');

  // --- تنفيذ المنطق الأصلي للـ routing و auth ---
  const response = await handleAuthAndRouting(request);

  // --- إذا وجد كود ريفيرال، ضع الكوكي في response ---
  if (refCode) {
    response.cookies.set({
      name: REFERRAL_COOKIE_NAME,
      value: refCode,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });
  }

  return response;
}

// --- كل منطق الـ middleware الأصلي ضمن هذه الدالة ---
async function handleAuthAndRouting(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // --- 1. التعامل مع اللغات ---
  const pathnameIsMissingLocale = !routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameIsMissingLocale) {
    return intlMiddleware(request);
  }
  const locale = pathname.split('/')[1] || routing.defaultLocale;

  // --- 2. الحصول على توكن المستخدم ---
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // --- 3. تحديد أنواع الصفحات ---
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

  // --- 4. إعادة التوجيه للصفحات العامة إذا كان المستخدم مسجل دخول ---
  if (isAuthenticated && (isLandingPage || isAuthPage)) {
    if (userRole === 'seller') {
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    }
    return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
  }

  // السماح بالوصول للصفحات العامة لجميع المستخدمين
  if (isPublicPage || isAuthPage || isLandingPage) {
    return intlMiddleware(request) || NextResponse.next();
  }

  // --- 5. حماية الصفحات المحمية ---
  if (!isAuthenticated) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 6. تطبيق قواعد Role-Based Routing ---
  const isAffiliatePath = pathname.startsWith(`/${locale}/affiliate`);
  const isSellerPath = pathname.startsWith(`/${locale}/seller`);


  // --- مسار المحظورات الخاصة بالـ Seller ---
  const SELLER_BLOCKED_ROUTES = [
    `/${locale}/seller/my-collection`,
  ];
  // منع Seller من الوصول للصفحات المحظورة
  if (userRole === 'seller') {
    if (SELLER_BLOCKED_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    }

    // السماح لبقية صفحات seller فقط
    if (!isSellerPath) {
      return NextResponse.redirect(new URL(`/${locale}/seller`, request.url));
    }
  }

  const AFFILIATE_BLOCKED_ROUTES = [
    `/${locale}/affiliate/upload-products`,
  ];
  // السماح لـ Affiliate بالوصول فقط لمسارات Affiliate
  if (userRole === 'affiliate') {
    if (AFFILIATE_BLOCKED_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
    }
    if(!isAffiliatePath){
      return NextResponse.redirect(new URL(`/${locale}/affiliate`, request.url));
    }
  }

  // إذا لم يكن هناك دور معلوم، أعاد توجيه لتسجيل الدخول
  if (!userRole) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // إذا اجتاز كل الشيكات، يسمح بالوصول
  return intlMiddleware(request) || NextResponse.next();
}

// --- Config الخاص بالـ middleware ---
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
