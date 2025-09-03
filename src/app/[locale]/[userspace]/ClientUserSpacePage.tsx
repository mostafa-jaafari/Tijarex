"use client";
import { EarningsChart } from '@/components/EarningsChart';
import { PopularProductsWidget } from '@/components/PopularProductsWidget';
import QuickSetupGuide from '@/components/QuickSetupGuide';
import { StatisticCards } from '@/components/StatisticCards';
import { TraficSourcesWidget } from '@/components/TraficSourcesWidget';
import { useUserInfos } from '@/context/UserInfosContext';
import React from 'react'

export default function ClientUserSpacePage() {
  const { isLoadingUserInfos, userInfos } = useUserInfos();
  
  if(isLoadingUserInfos){
    return (
      <section 
        className="w-full h-[90vh] flex justify-center items-center">
        <div className="w-20 h-20 border-2 border-transparent border-t-current rounded-full animate-spin" />
      </section>
    )
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

      <section
        className='w-full space-y-4'
      >
        {/* --- Quick Setup Guide & Trends Products */}
        <QuickSetupGuide />
        <StatisticCards
            isLoadingUserInfos={isLoadingUserInfos}
            userInfos={userInfos}
        />
        <div
          className='w-full h-[52vh] flex items-start gap-4'
        >
          <PopularProductsWidget />
          <TraficSourcesWidget 
              userInfos={userInfos}
          />
        </div>
        <div
          className='w-full flex items-start gap-4'
        >
          <EarningsChart />
        </div>
      </section>

      <footer
        className='w-full flex justify-center py-3 text-sm text-neutral-500'
      >
        &copy; 2025 Tijarex. Alll rights reserved.
      </footer>
    </div>
  )
}
