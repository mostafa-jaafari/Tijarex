import "../../app/globals.css";
import { Inter } from 'next/font/google';
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "sonner";
import { NextAuthSessionProvider } from "@/context/NextAuthSessionProvider";
import { UserInfosContextProvider } from "@/context/UserInfosContext";
import { Metadata } from "next";
import { QuickViewProductContextProvider } from "@/context/QuickViewProductContext";
import { QuickViewProduct } from "@/components/QuickViewProduct";
import { FirstAffiliateLinkTrackerProvider } from "@/context/FirstAffiliateLinkContext";
import { AffiliateProductsContextProvider } from "@/context/AffiliateProductsContext";
import { MyCollectionProductsContextProvider } from "@/context/MyCollectionProductsContext";
import { MarketplaceProductsProvider } from "@/context/MarketplaceProductsContext";
import { AffiliateAvailableProductsProvider } from "@/context/AffiliateAvailableProductsContext";


export const metadata: Metadata = {
  title: {
    default: "Shopex - Your Trusted Marketplace for Quality Products in Morocco",
    template: "Shopex - %s"
  }
}
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-cenzel',
  weight: ['400']
})

// const cairo = Cairo({
//   subsets: ['arabic', 'latin'],
//   weight: ['400', '700'],
// });

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html 
      lang={locale} 
      className="scroll-smooth"
      suppressHydrationWarning={true}
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ fontFamily: inter.style.fontFamily }}>
      <body
        className={`w-full overflow-x-hidden
          ${inter.className} antialiased`}
          >
          <NextAuthSessionProvider>
            <MarketplaceProductsProvider>
              <AffiliateAvailableProductsProvider>
                <UserInfosContextProvider>
                  <MyCollectionProductsContextProvider>
                    <AffiliateProductsContextProvider>
                      <FirstAffiliateLinkTrackerProvider>
                        <QuickViewProductContextProvider>
                              <Toaster position="top-center" />
                              <NextIntlClientProvider locale={locale} messages={messages}>
                                  {children}
                                <QuickViewProduct />
                              </NextIntlClientProvider>
                              <ScrollToTop />
                        </QuickViewProductContextProvider>
                      </FirstAffiliateLinkTrackerProvider>
                    </AffiliateProductsContextProvider>
                  </MyCollectionProductsContextProvider>
                </UserInfosContextProvider>
              </AffiliateAvailableProductsProvider>
            </MarketplaceProductsProvider>
          </NextAuthSessionProvider>
      </body>
    </html>
  );
}