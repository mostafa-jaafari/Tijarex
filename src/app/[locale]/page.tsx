import { Header } from "@/components/Header";
import { Hero } from "@/components/HeroSection";
import { getLocale } from "next-intl/server";


export default async function Home() {
  const locale = await getLocale();
  const IsArabic = locale === 'ar';
  return (
    <main className="w-full">
      <section
        className="w-full bg-black min-h-screen"
      >
        <Header />
        <div className="absolute z-10 right-[25%] w-[600px] h-[600px] rounded-full bg-blue-600 opacity-20 blur-3xl" />
        <Hero />
      </section>
    </main>
  );
}