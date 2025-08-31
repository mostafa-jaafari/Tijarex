import { BestSellingProducts } from "@/components/BestSellingProducts";
import { BestSummerCollections } from "@/components/BestSummerCollections";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { PublicHeader } from "@/components/PublicHeader";
import { HeroSection } from "@/components/HeroSection";
import { ShopByCategories } from "@/components/ShopByCategories";

export const PrimaryDark = "bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-800 hover:from-neutral-700 hover:via-neutral-700 hover:to-neutral-700 text-[13px] py-1 px-2 rounded-lg text-neutral-100 border-b border-neutral-200 ring ring-neutral-300";
export const PrimaryLight = "bg-white hover:bg-neutral-50 ring ring-neutral-200 border-b border-neutral-400 text-neutral-700 cursor-pointer text-[13px] py-1 px-2 rounded-lg";
export default function Home() {
  return (
    <main className="w-full">
      <PublicHeader />
      <HeroSection />
      <section
        className="px-6 mt-12 space-y-30"
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