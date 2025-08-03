import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import { SellerStatisticCards } from '@/components/SellerStatisticCards'
import EarningsChart from '@/components/EarningsChart'
import React from 'react'
import QuickSetupGuide from '@/components/QuickSetupGuide'

export const metadata = {
  title: "Seller Dashboard | Jamla.ma",
  description: "Monitor your store performance, view earnings, and track popular products on your Jamla.ma seller dashboard.",
  keywords: [
    "seller dashboard",
    "Jamla.ma",
    "store performance",
    "earnings",
    "popular products",
    "ecommerce analytics",
    "sales statistics"
  ],
  openGraph: {
    title: "Seller Dashboard | Jamla.ma",
    description: "Stay updated with your store's performance and analytics on Jamla.ma.",
    url: "https://jamla.ma/seller",
    type: "website"
  }
}
export default async function page() {
  return (
    <main
        className='w-full'
    >
      <section
          className='w-full flex'
      >
        {/* --- section Content --- */}
        <section className='flex-1 flex flex-col p-4 space-y-4'>
        {/* --- Content Area --- */}
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