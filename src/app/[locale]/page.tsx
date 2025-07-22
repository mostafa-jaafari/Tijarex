import { Header } from "@/components/Header";
import { Hero } from "@/components/HeroSection";
import { getLocale } from "next-intl/server";


export default async function Home() {
  const locale = await getLocale();
  const IsArabic = locale === 'ar';
  return (
    <main className="w-full min-h-200">
      <section
        className="w-full bg-black min-h-screen"
      >
        <Header />
        <Hero />
      </section>
    </main>
  );
}