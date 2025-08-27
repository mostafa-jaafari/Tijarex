import { BestSellingProducts } from "@/components/BestSellingProducts";
import { BestSummerCollections } from "@/components/BestSummerCollections";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { PublicHeader } from "@/components/PublicHeader";
import { HeroSection } from "@/components/HeroSection";
import { ShopByCategories } from "@/components/ShopByCategories";

export const PrimaryDark = "bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-800";
export const PrimaryPurple = "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500";
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