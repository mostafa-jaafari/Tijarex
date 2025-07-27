import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import { SellerStatisticCards } from '@/components/SellerStatisticCards'
import EarningsChart from '@/components/EarningsChart'
import React from 'react'
import { RightDashboardHeader } from '@/components/RightDashboardHeader'

export default function page() {
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
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">Monitor your store performance</p>
    </div>

    {/* Right Side */}
        <RightDashboardHeader />
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