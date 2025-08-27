"use client";
import React from 'react'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import QuickSetupGuide from '@/components/QuickSetupGuide'
import { PopularProductsWidget } from '@/components/PopularProductsWidget'
import EarningsChart from '@/components/EarningsChart'
import { StatisticCards } from '@/components/StatisticCards'
import { useAffiliateProducts } from '@/context/AffiliateProductsContext';
import { useUserInfos } from '@/context/UserInfosContext';

export function ClientPage() {
    const { isLoadingUserInfos, userInfos, setIsFinishSetup, isFinishSetup } = useUserInfos();
    const { isAffiliateProductsLoading, affiliateProducts } = useAffiliateProducts();
    
    if(isLoadingUserInfos || isAffiliateProductsLoading) {
        return (
            <section 
                className="w-full h-screen flex justify-center items-center">
                <div className="w-20 h-20 border-2 border-transparent border-t-current rounded-full animate-spin">
                </div>
            </section>
        )
    }
    
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
                <QuickSetupGuide
                    affiliateProducts={affiliateProducts}
                    userInfos={userInfos}
                    isLoadingUserInfos={isLoadingUserInfos}
                    setIsFinishSetup={setIsFinishSetup}
                />
                {isFinishSetup && (
                    <EarningsChart />
                )}
                <PopularProductsWidget
                    isFinishSetup={isFinishSetup}
                />
            </div>
            <StatisticCards />
            {!isFinishSetup && (
                <EarningsChart />
            )}
            <footer>
                <p className='text-sm text-gray-500 text-center py-4'>
                    &copy; 2024 Tijarex. All rights reserved.
                </p>
            </footer>
        </div>
        </section>
    )
}