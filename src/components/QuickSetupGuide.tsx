"use client";
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PrimaryDark, PrimaryLight } from '@/app/[locale]/page';
import { useUserInfos } from '@/context/UserInfosContext';
import { useFirstAffiliateLink } from '@/context/FirstAffiliateLinkContext';

export default function QuickSetupGuide() {
  const { userInfos, isLoadingUserInfos, setIsFinishSetup } = useUserInfos();
  const { isLoadingCheckingFirstAffiliateLink, hasGottenFirstLink } = useFirstAffiliateLink();

  const ConfigSteps = [
    {
      title: "Create your account.",
      description: "Create your account to get started with Tijarex.",
      btntitle: "Create account",
      isLoadingButton: false,
      image: "/create-account-avatar.png",
      imagestyles:
        "absolute z-30 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-300 ease-out w-full flex justify-center items-center",
      iscompleted: true,
      link: {
        label: "Start your journey with us !",
        href: userInfos?.UserRole === "seller" ? "/seller" : "/affiliate",
      },
    },
    {
      title: "Add balance",
      description: "Top up your balance to start earn commissions.",
      btntitle: "Add balance",
      isLoadingButton: isLoadingUserInfos,
      image: "/CIH-MASTERCARD.png",
      imagestyles:
        "absolute z-30 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-300 ease-out w-full flex justify-center items-center",
      iscompleted: !!(userInfos?.totalbalance && userInfos.totalbalance > 0),
      link: {
        label: "Activate your account with credit.",
        href: "add-balance",
      },
    },
    userInfos?.UserRole === "seller"
      ? {
          title: "Add your First Product",
          description: "List your products to reach a wider audience and boost your sales",
          btntitle: "Add products",
          isLoadingButton: isLoadingUserInfos,
          image: "/First-Order.png",
          imagestyles:
            "absolute z-30 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-300 ease-out w-full flex justify-center items-center",
          iscompleted: !!(userInfos?.activeproducts && userInfos.activeproducts > 0),
          link: {
            label: "Start adding your products.",
            href: "upload-products",
          },
        }
      : {
          title: "Claim Affiliate Link.",
          description: "Begin affiliate journey with link.",
          btntitle: "Claim products",
          isLoadingButton: isLoadingCheckingFirstAffiliateLink,
          image: "/First-Order.png",
          imagestyles:
            "absolute z-30 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-300 ease-out w-full flex justify-center items-center",
          iscompleted:
            hasGottenFirstLink,
            link: {
            label: "Start promoting products.",
            href: "products",
          },
        },
  ];

  // progress calculation
  const completedSteps = ConfigSteps.filter((step) => step.iscompleted).length;
  const totalSteps = ConfigSteps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const [animatedWidth, setAnimatedWidth] = useState("2%");

  const IsCompletedAllSteps = completedSteps === totalSteps;
  // trigger animation
  useEffect(() => {
    setAnimatedWidth(`${progressPercent}%`);
    setIsFinishSetup(IsCompletedAllSteps);
  }, [IsCompletedAllSteps, progressPercent, setIsFinishSetup]);

  if (IsCompletedAllSteps) {
    return null;
  }

  return (
    <section
      className="relative w-full max-w-[650px] 
        border-b border-neutral-400/50 ring ring-neutral-200 bg-white 
        rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-6"
    >
      <h1 className="text-lg font-semibold text-gray-900 mb-3">Quick setup guide</h1>
      <Image
        src="/Pattern-1.jpg"
        alt=""
        fill
        className="object-cover scale-x-[-1] opacity-10 group-hover:scale-110 transition-all duration-300"
        loading="lazy"
      />

      <div className="w-full grid grid-cols-3 gap-2">
        {ConfigSteps.map((card, idx) => (
          <div
            key={idx}
            className="group relative flex-shrink-0 w-full h-[240px] 
              border-b border-neutral-400/50 ring ring-neutral-200
              rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]
              overflow-hidden bg-purple-100"
          >
            <Image
              src="/Grid-Pattern.jpg"
              alt=""
              fill
              className="object-cover opacity-10 group-hover:scale-110 transition-all duration-300"
              loading="lazy"
            />
            <div className={card.imagestyles}>
              <Image 
                src={card.image} 
                alt="" 
                width={120} 
                height={120} 
                quality={100} 
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 z-40 p-4 min-h-[120px] w-full flex flex-col justify-end space-y-2 bg-gradient-to-t from-white via-white">
              <h1 className="font-semibold text-neutral-700 text-sm">{card.title}</h1>
              <p className="text-xs text-gray-500">{card.description}</p>

              {card.isLoadingButton ? (
                <div className="w-24 h-6 bg-gray-300 rounded-lg shadow-sm animate-pulse" />
              ) : card.iscompleted ? (
                <button
                  disabled
                  className={`flex items-center gap-1 cursor-not-allowed 
                      w-max ${PrimaryDark}`}
                >
                  Completed <CircleCheckBig size={16} />
                </button>
              ) : (
                <Link
                  href={`/${userInfos ? (userInfos.UserRole === "seller" ? "seller" : "affiliate") : ""}/${card.link.href}`}
                  className={`${PrimaryLight} w-max`}
                >
                  {card.btntitle}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full flex items-center gap-2 pt-3">
        <div className="w-full">
          <div className="rounded-full border border-neutral-200 bg-neutral-100">
            <span
              className="relative flex h-2 rounded-full bg-purple-600 
                transition-all duration-1000 ease-out after:absolute 
                after:right-0 after:-top-1 after:w-4 after:h-4 
                after:rounded-full after:bg-purple-600 after:shadow"
              style={{ width: animatedWidth }}
            />
          </div>
        </div>
        <p className="text-gray-500">
          {completedSteps}/{ConfigSteps.length}
        </p>
      </div>
    </section>
  );
}
