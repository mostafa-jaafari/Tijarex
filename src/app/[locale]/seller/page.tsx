import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import { StatisticCards } from '@/components/StatisticCards'
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
        className='w-full bg-gray-100'
    >
      <section
          className='w-full flex'
      >
        {/* --- section Content --- */}
        <section className='flex-1 flex flex-col p-2 space-y-2'>
        {/* --- Content Area --- */}
          <WelcomeBanner />
          <QuickSetupGuide />
          <StatisticCards />
          <EarningsChart />
        </section>
        {/* --- Sidebar --- */}
          <PopularProductsWidget />
      </section>
    </main>
  )
}