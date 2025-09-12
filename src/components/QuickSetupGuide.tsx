"use client";
import { CircleCheck, CircleDashed, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUserInfos } from '@/context/UserInfosContext';
import { useFirstAffiliateLink } from '@/context/FirstAffiliateLinkContext';
import { ProductType } from '@/types/product';
import { useAffiliateAvailableProducts } from '@/context/AffiliateAvailableProductsContext';

// --- Skeleton Component (no changes needed) ---
const QuickSetupGuideSkeleton = () => {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                <div className="flex items-center gap-3 w-1/4">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                </div>
            </div>
            <div className="space-y-1">
                {Array(3).fill(0).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded-md w-48"></div>
                                <div className="h-3 bg-gray-200 rounded-md w-64"></div>
                            </div>
                        </div>
                        <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function QuickSetupGuide() {
  // --- All your existing logic and hooks remain unchanged ---
  const { userInfos, isLoadingUserInfos, setIsFinishSetup } = useUserInfos();
  const { isLoadingCheckingFirstAffiliateLink, hasGottenFirstLink } = useFirstAffiliateLink();
  const { affiliateAvailableProductsData, isLoadingAffiliateAvailableProducts } = useAffiliateAvailableProducts();
  
  const [isMinimized, setIsMinimized] = useState(false);

  const IsUploadOneProductAtLeast = affiliateAvailableProductsData.find(
    (p: ProductType) => p.owner?.email.toLowerCase() === userInfos?.email
  );

  const ConfigSteps = [
    {
      title: "Create your account",
      description: "You are already here! This step is complete.",
      btntitle: "Completed",
      isLoadingButton: false,
      iscompleted: true,
      link: { href: "/products" },
    },
    {
      title: "Add balance to your account",
      description: "Top up to activate your account and start earning.",
      btntitle: "Add balance",
      isLoadingButton: isLoadingUserInfos,
      iscompleted: !!(userInfos?.totalbalance && userInfos.totalbalance > 0),
      link: { href: "/add-balance" },
    },
    userInfos?.UserRole === "seller"
      ? {
          title: "Add your first product",
          description: "List your first item to start selling to a wider audience.",
          btntitle: "Add product",
          isLoadingButton: isLoadingAffiliateAvailableProducts,
          iscompleted: !!IsUploadOneProductAtLeast,
          link: { href: "/upload-products" },
        }
      : {
          title: "Claim your first affiliate link",
          description: "Promote products by generating your first affiliate link.",
          btntitle: "Claim link",
          isLoadingButton: isLoadingCheckingFirstAffiliateLink,
          iscompleted: hasGottenFirstLink,
          link: { href: "products" },
        },
  ];

  const completedSteps = ConfigSteps.filter((step) => step.iscompleted).length;
  const totalSteps = ConfigSteps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const [animatedWidth, setAnimatedWidth] = useState("0%");
  const IsCompletedAllSteps = completedSteps === totalSteps;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(`${progressPercent}%`), 100);
    if (!isLoadingUserInfos && !isLoadingAffiliateAvailableProducts && !isLoadingCheckingFirstAffiliateLink) {
        setIsFinishSetup(IsCompletedAllSteps);
    }
    return () => clearTimeout(timer);
  }, [IsCompletedAllSteps, progressPercent, setIsFinishSetup, isLoadingUserInfos, isLoadingAffiliateAvailableProducts, isLoadingCheckingFirstAffiliateLink]);

  const isLoading = isLoadingUserInfos || isLoadingAffiliateAvailableProducts || isLoadingCheckingFirstAffiliateLink;

  if (isLoading) {
    return <QuickSetupGuideSkeleton />;
  }

  if (IsCompletedAllSteps) {
    return null;
  }

  return (
    <section 
      className="w-full bg-white border-b border-neutral-400/50
        ring ring-neutral-200 rounded-xl 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
                <h1 className="text-lg font-semibold text-gray-900">Setup guide</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Follow these steps to get your account ready.
                </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{completedSteps} / {totalSteps} completed</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                            className="h-2 bg-green-500 rounded-full transition-all duration-700 ease-out" 
                            style={{ width: animatedWidth }}>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  aria-label={isMinimized ? 'Expand guide' : 'Collapse guide'}
                >
                    {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
            </div>
        </div>
      </div>

      {/* Collapsible Steps List */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isMinimized ? 'max-h-0' : 'max-h-[500px]'}`}
      >
        <div className="border-t border-gray-200">
          {ConfigSteps.map((step) => {
              return (
                  <div key={step.title} className="flex items-center justify-between p-4 even:bg-gray-50/50">
                      <div className="flex items-center gap-4">
                          {/* --- UPDATED: Simplified Status Icon --- */}
                          <div className="w-6 h-6 flex items-center justify-center">
                              {step.iscompleted ? (
                                  <CircleCheck className="text-green-500" size={24} />
                              ) : (
                                  <CircleDashed className="text-gray-400" size={24} />
                              )}
                          </div>
                          {/* Text Content */}
                          <div>
                              <h2 className="font-medium text-gray-800 text-sm">{step.title}</h2>
                              <p className="text-xs text-gray-500">{step.description}</p>
                          </div>
                      </div>
                      {/* --- UPDATED: Simplified Action Button --- */}
                      <div className="w-36 text-right">
                          {step.isLoadingButton ? (
                              <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse ml-auto"></div>
                          ) : step.iscompleted ? (
                              <button 
                                disabled 
                                className="inline-flex items-center justify-center 
                                  gap-2 px-3 py-1.5 text-sm font-medium text-green-700 
                                  bg-green-100 rounded-lg cursor-not-allowed
                                  ring ring-green-200"
                              >
                                  <CheckCircle size={16}/> Completed
                              </button>
                          ) : (
                              <Link
                                  href={`/${userInfos?.UserRole === "seller" ? "seller" : "affiliate"}${step.link.href}`}
                                  className={`bg-white text-sm text-neutral-700 border-b 
                                      border-neutral-400 ring ring-neutral-200 
                                      rounded-lg hover:bg-neutral-50 px-3 py-1.5 
                                      capitalize`}
                              >
                                  {step.btntitle}
                              </Link>
                          )}
                      </div>
                  </div>
              );
          })}
        </div>
      </div>
    </section>
  );
}