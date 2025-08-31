import { EarningsChart } from '@/components/EarningsChart';
import { PopularProductsWidget } from '@/components/PopularProductsWidget';
import QuickSetupGuide from '@/components/QuickSetupGuide';
import { StatisticCards } from '@/components/StatisticCards';
import { TraficSourcesWidget } from '@/components/TraficSourcesWidget';
import React from 'react'

export default async function page({ params }: { params: { locale: string; userspace: string } }) {
  const ParamsId = await params.userspace;
  
  let UserSpaceRendered;
  switch (ParamsId) {
    case "seller":
      UserSpaceRendered = (<div>Seller Space</div>);
      break;
  
    case "affiliate":
      UserSpaceRendered = (
        <section
          className='w-full space-y-4'
        >
          {/* --- Quick Setup Guide & Trends Products */}
          <div
            className='w-full flex items-start gap-4'
          >
            <QuickSetupGuide />
            <PopularProductsWidget  />
          </div>
          <StatisticCards />
          <div
            className='w-full flex items-start gap-4'
          >
            <EarningsChart />
            <TraficSourcesWidget />
          </div>
        </section>
      );
      break;
    default:
      UserSpaceRendered = (<div>Unknown Space</div>);
      break;
  }
  return (
    <div
      className='w-full pt-6 px-12'
    >
      <h1
        className='text-xl font-bold text-neutral-700 mb-6'
      >
        Welcome to Tijarex.
      </h1>
      {UserSpaceRendered}
      <footer
        className='w-full flex justify-center py-3 text-sm text-neutral-500'
      >
        &copy; 2025 Tijarex. Alll rights reserved.
      </footer>
    </div>
  )
}
