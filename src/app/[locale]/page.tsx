import { ScrollReveal } from "@/components/Animations/ScrollReveal";
import { BestSellingProducts } from "@/components/BestSellingProducts";
import BestSummerCollections from "@/components/BestSummerCollections";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { ShopByCategories } from "@/components/ShopByCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tijarex - Your Trusted Marketplace for Quality Products in Morocco",
  description:
    "Discover the best deals on electronics, fashion, home essentials, and more at Tijarex. Shop with confidence, enjoy fast delivery, and experience exceptional customer service. Join thousands of happy customers across Morocco!",
  keywords: [
    "Jamla",
    "Morocco",
    "Marketplace",
    "Online Shopping",
    "Electronics",
    "Fashion",
    "Home Essentials",
    "Best Deals",
    "Fast Delivery",
    "Customer Service"
  ],
  openGraph: {
    title: "Tijarex - Your Trusted Marketplace for Quality Products in Morocco",
    description:
      "Shop the latest products and enjoy unbeatable prices at Tijarex. Fast delivery and excellent support for all your needs.",
    url: "https://Tijarex",
    siteName: "Tijarex",
    images: [
      {
        url: "https://Tijarex/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tijarex Marketplace"
      }
    ],
    locale: "fr_MA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tijarex - Your Trusted Marketplace for Quality Products in Morocco",
    description:
      "Find the best products and deals at Tijarex. Shop online with confidence and enjoy fast delivery across Morocco.",
    images: ["https://Tijarex/og-image.jpg"]
  }
};
export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      <section
        className="px-6 mt-12 space-y-30"
      >
        <ScrollReveal>
          <BestSellingProducts />
        </ScrollReveal>
        <ShopByCategories />
        <BestSummerCollections />
        <FeaturedProducts />
      </section>
      <Footer />
    </main>
  );
}