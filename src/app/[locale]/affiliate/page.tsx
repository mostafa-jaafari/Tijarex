import React from 'react'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import QuickSetupGuide from '@/components/QuickSetupGuide'
import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import EarningsChart from '@/components/EarningsChart'

export default function page() {
  return (
    <section
        className='w-full flex p-3 gap-3 overflow-auto mb-6'
    >
    <div
        className='w-full space-y-3'
    >
        <WelcomeBanner />
        <QuickSetupGuide />
        <EarningsChart />
    </div>
    <PopularProductsWidget />
    </section>
  )
}