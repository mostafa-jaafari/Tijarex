import "../../app/globals.css";
import { Cairo, Bebas_Neue } from 'next/font/google'
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { NextAuthSessionProvider } from "@/context/NextAuthSessionProvider";
import { getServerSession, Session } from "next-auth";
import { UserInfosContextProvider } from "@/context/UserInfosContext";



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
  const IsArabic = locale === 'ar';
  const session: Session | null = await getServerSession();
  return (
    <html dir={IsArabic ? "rtl" : "ltr"} lang={locale} className="scroll-smooth">
      <body
        className={`w-full overflow-x-hidden 
          bg-white dark:bg-[#0a0a0a] 
          ${cairo.className} ${bebas_neue.variable} antialiased`}
          >
          <NextAuthSessionProvider>
            <UserInfosContextProvider>
              <Toaster position="top-center" />
              <NextIntlClientProvider locale={locale} messages={messages}>
                <section
                  className="w-full flex"
                >
                  <Sidebar
                    session={session}
                  />
                  {children}
                </section>
              </NextIntlClientProvider>
              <ScrollToTop />
            </UserInfosContextProvider>
          </NextAuthSessionProvider>
      </body>
    </html>
  );
}