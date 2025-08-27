import React from 'react'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import QuickSetupGuide from '@/components/QuickSetupGuide'
import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import EarningsChart from '@/components/EarningsChart'
import { StatisticCards } from '@/components/StatisticCards'

export default function page() {
  return (
    <section
        className='w-full flex p-3 gap-3 overflow-auto'
    >
    <div
        className='w-full space-y-3'
    >
        <WelcomeBanner />
        <div
          className='w-full min-h-[400px] max-h-[510px]
            flex gap-3 items-start overflow-hidden'
        >
          {/* <QuickSetupGuide /> */}
          <EarningsChart />
          <PopularProductsWidget />
        </div>
        <StatisticCards />
    </div>
    </section>
  )
}