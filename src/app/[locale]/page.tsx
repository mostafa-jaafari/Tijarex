import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HeroStatistics } from "@/components/HeroStatistics";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
// import { getLocale } from "next-intl/server";


export default async function Home() {
  // const locale = await getLocale();
  // const IsArabic = locale === 'ar';
  return (
    <main className="w-full">
      <section
        className="w-full bg-black min-h-screen"
      >
        <Header />
        <div className="absolute z-10 right-[25%] w-[300px] lg:w-[600px] md:w-[600px] h-[300px] lg:h-[600px] md:h-[600px] rounded-full bg-blue-600 opacity-20 blur-3xl" />
        <HeroSection />
      </section>
      <HeroStatistics />
      <WhyChooseUs />
      <HowItWorks />
    </main>
  );
}