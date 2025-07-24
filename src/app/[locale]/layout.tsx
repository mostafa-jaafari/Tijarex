import type { Metadata } from "next";
import "../../app/globals.css";
import { Cairo, Bebas_Neue } from 'next/font/google'
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/next"


const bebas_neue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  weight: ['400'],
})
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Home | Jamla.ma',
  description: 'Build your brand easily with MODIFY.ma',
}

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
  const IsArabic = locale === 'ar';
  return (
    <html dir={IsArabic ? "rtl" : "ltr"} lang={locale} className="scroll-smooth">
      <body
        className={`w-full overflow-x-hidden 
          bg-white dark:bg-[#0a0a0a] 
          ${cairo.className} ${bebas_neue.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}