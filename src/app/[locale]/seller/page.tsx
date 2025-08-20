import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import { SellerStatisticCards } from '@/components/SellerStatisticCards'
import EarningsChart from '@/components/EarningsChart'
import React from 'react'
import QuickSetupGuide from '@/components/QuickSetupGuide'
import { WelcomeBanner } from '@/components/WelcomeBanner'


export const metadata = {
  title: "Seller Dashboard | Tijarex.ma",
  description: "Monitor your store performance, view earnings, and track popular products on your tijarex.ma seller dashboard.",
  keywords: [
    "seller dashboard",
    "tijarex.ma",
    "store performance",
    "earnings",
    "popular products",
    "ecommerce analytics",
    "sales statistics"
  ],
  openGraph: {
    title: "Seller Dashboard | tijarex.ma",
    description: "Stay updated with your store's performance and analytics on tijarex.ma.",
    url: "https://tijarex.ma/seller",
    type: "website"
  }
}
export default async function page() {
  return (
    <main
        className='w-full bg-gray-50'
    >
      <section
          className='w-full flex'
      >
        {/* --- section Content --- */}
        <section className='flex-1 flex flex-col p-4 space-y-4'>
        {/* --- Content Area --- */}
          <WelcomeBanner />
          <QuickSetupGuide />
          <SellerStatisticCards />
          <EarningsChart />
        </section>
        {/* --- Sidebar --- */}
          <PopularProductsWidget />
      </section>
    </main>
  )
}