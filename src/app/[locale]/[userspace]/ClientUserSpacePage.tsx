"use client";
import { EarningsChart } from '@/components/EarningsChart';
import { PopularProductsWidget } from '@/components/PopularProductsWidget';
import QuickSetupGuide from '@/components/QuickSetupGuide';
import { StatisticCards } from '@/components/StatisticCards';
import { TraficSourcesWidget } from '@/components/TraficSourcesWidget';
import { useUserInfos } from '@/context/UserInfosContext';
import React from 'react'

export default function ClientUserSpacePage({ UserSpaceParamsId }: { UserSpaceParamsId: string; }) {
  const { isFinishSetup, isLoadingUserInfos, userInfos } = useUserInfos();
  let UserSpaceRendered;
  switch (UserSpaceParamsId) {
    case "seller":
      UserSpaceRendered = (<div>Seller Space</div>);
      break;
  
    case "affiliate":
      UserSpaceRendered = (
        <section
          className='w-full space-y-4'
        >
          {/* --- Quick Setup Guide & Trends Products */}
          {isFinishSetup && (
            <StatisticCards
                isLoadingUserInfos={isLoadingUserInfos}
                userInfos={userInfos}
            />
          )}
          <div
            className='w-full flex items-start gap-4'
          >
            {!isFinishSetup && (
                <QuickSetupGuide />
            )}
            {isFinishSetup && (
                <TraficSourcesWidget 
                    isFinishSetup={isFinishSetup}
                    isLoadingUserInfos={isLoadingUserInfos}
                    userInfos={userInfos}
                />
            )}
            <PopularProductsWidget />
          </div>
          {!isFinishSetup && (
            <StatisticCards
                isLoadingUserInfos={isLoadingUserInfos}
                userInfos={userInfos}
            />
          )}
          <div
            className='w-full flex items-start gap-4'
          >
            <EarningsChart isFinishSetup={isFinishSetup} />
            {!isFinishSetup && (
                <TraficSourcesWidget 
                    isFinishSetup={isFinishSetup}
                    isLoadingUserInfos={isLoadingUserInfos}
                    userInfos={userInfos}
                />
            )}
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
