import "../../app/globals.css";
import { Cairo, Bebas_Neue, Sorts_Mill_Goudy } from 'next/font/google'
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


export const metadata: Metadata = {
  title: {
    default: "Tijarex - Your Trusted Marketplace for Quality Products in Morocco",
    template: "Tijarex - %s"
  }
}
const cinzel = Sorts_Mill_Goudy({
  subsets: ['latin'],
  variable: '--font-cenzel',
  weight: ['400']
})

const bebas_neue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  weight: ['400'],
})
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`w-full overflow-x-hidden 
          ${cairo.className} ${cinzel.variable} ${bebas_neue.variable} antialiased`}
          >
          <QuickViewProductContextProvider>
            <NextAuthSessionProvider>
              <UserInfosContextProvider>
                <Toaster position="top-center" />
                <NextIntlClientProvider locale={locale} messages={messages}>
                  <QuickViewProduct />
                    {children}
                </NextIntlClientProvider>
                <ScrollToTop />
              </UserInfosContextProvider>
            </NextAuthSessionProvider>
          </QuickViewProductContextProvider>
      </body>
    </html>
  );
}