import { FAQList } from "@/components/FAQList";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HeroStatistics } from "@/components/HeroStatistics";
import { HowItWorks } from "@/components/HowItWorks";
import { LastCallToAction } from "@/components/LastCallToAction";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const metadata = {
  title: "Jamla.ma - Your Trusted Marketplace for Quality Products in Morocco",
  description:
    "Discover the best deals on electronics, fashion, home essentials, and more at Jamla.ma. Shop with confidence, enjoy fast delivery, and experience exceptional customer service. Join thousands of happy customers across Morocco!",
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
    title: "Jamla.ma - Your Trusted Marketplace for Quality Products in Morocco",
    description:
      "Shop the latest products and enjoy unbeatable prices at Jamla.ma. Fast delivery and excellent support for all your needs.",
    url: "https://jamla.ma",
    siteName: "Jamla.ma",
    images: [
      {
        url: "https://jamla.ma/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jamla.ma Marketplace"
      }
    ],
    locale: "fr_MA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamla.ma - Your Trusted Marketplace for Quality Products in Morocco",
    description:
      "Find the best products and deals at Jamla.ma. Shop online with confidence and enjoy fast delivery across Morocco.",
    images: ["https://jamla.ma/og-image.jpg"]
  }
};
export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
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
      <FeaturedProducts />
      <Testimonials />
      <FAQList />
      <LastCallToAction />
      <Footer />
    </main>
  );
}