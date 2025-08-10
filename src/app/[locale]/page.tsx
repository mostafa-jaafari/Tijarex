import { ScrollReveal } from "@/components/Animations/ScrollReveal";
import { BestSellingProducts } from "@/components/BestSellingProducts";
import BestSummerCollections from "@/components/BestSummerCollections";
import { Header } from "@/components/Header";

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
    <main className="w-full">
      <Header />
      <section
        className="px-6 mt-12 space-y-12"
      >
        <ScrollReveal>
          <BestSellingProducts />
        </ScrollReveal>
        <BestSummerCollections />
      </section>
    </main>
  );
}