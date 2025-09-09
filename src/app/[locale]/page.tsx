import { BestSellingProducts } from "@/components/BestSellingProducts";
import { BestSummerCollections } from "@/components/BestSummerCollections";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { PublicHeader } from "@/components/PublicHeader";
import { HeroSection } from "@/components/HeroSection";
import { ShopByCategories } from "@/components/ShopByCategories";
import { PublicHeaderCategories } from "@/components/PublicHeaderCategories";


export const PrimaryDark = "bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-800 hover:from-neutral-700 hover:via-neutral-700 hover:to-neutral-700 text-[13px] py-1 px-2 rounded-lg text-neutral-100 border-b border-neutral-400/50 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]";
export const PrimaryLight = "bg-white hover:bg-neutral-50 border-b border-neutral-400 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] text-neutral-700 cursor-pointer text-[13px] py-1 px-2 rounded-lg";
export const InputStyles = "w-full px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-neutral-400 focus:border-b-2 focus:border-neutral-600 transition-all";
export default function Home() {
  return (
    <main className="w-full bg-white">
      <PublicHeader />
      <PublicHeaderCategories />
      <HeroSection />
      <section
        className="px-6 mt-12 space-y-16"
      >
        <BestSellingProducts />
        <ShopByCategories />
        <BestSummerCollections />
        <FeaturedProducts />
      </section>
      <Footer />
    </main>
  );
}