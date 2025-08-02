import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import { SellerStatisticCards } from '@/components/SellerStatisticCards'
import EarningsChart from '@/components/EarningsChart'
import React from 'react'
import { RightDashboardHeader } from '@/components/RightDashboardHeader'
import { getServerSession, Session } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import { authOptions } from "@/lib/auth";

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
  const session: Session | null = await getServerSession(authOptions);
  const t = await getTranslations("sellerdashboard");
  return (
    <main
        className='w-full bg-gray-50'
    >
        <section className='w-full'>
            {/* --- Header --- */}
<div className="sticky z-50 top-0 bg-white border-b border-gray-200">
  <div className="px-6 py-2 flex items-center justify-between">
    
    {/* Left Side */}
    <div>
      {JSON.stringify(session?.user)}
      <h1 className="text-2xl font-semibold text-gray-900">{t("headertitle")}</h1>
      <p className="text-sm text-gray-600 mt-1">{t("headersubtitle")}</p>
    </div>

    {/* Right Side */}
        <RightDashboardHeader
          session={session}
        />
    </div>
    </div>

            <section
                className='w-full flex'
            >
            {/* --- section Content --- */}
            <section className='flex-1 flex flex-col'>

                {/* --- Content Area --- */}
                <div className='p-4 space-y-4'>
                <SellerStatisticCards />
                <EarningsChart />
                </div>
            </section>

            {/* --- Sidebar --- */}
            <aside className='w-max bg-white border-l border-gray-200 flex-shrink-0'>
                <div className='p-2'>
                <PopularProductsWidget />
                </div>
            </aside>
            </section>
        </section>
    </main>
  )
}