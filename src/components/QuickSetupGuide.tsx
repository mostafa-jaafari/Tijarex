"use client";
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PrimaryDark } from '@/app/[locale]/page';
import { ProductType } from '@/types/product';
import { UserInfosType } from '@/types/userinfos';

interface QuickSetupGuideProps {
  userInfos: UserInfosType | null;
  affiliateProducts: ProductType[];
  isLoadingUserInfos: boolean;
  setIsFinishSetup: (value: boolean) => void;
}

export default function QuickSetupGuide({
  userInfos,
  affiliateProducts,
  isLoadingUserInfos,
  setIsFinishSetup,
}: QuickSetupGuideProps) {
  const ConfigSteps = [
    {
      title: "Create your account.",
      description: "Register your account and set up your basic details to start selling in minutes",
      btntitle: "Create account",
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
      description: "Top up your balance to start fulfilling your orders smoothly",
      btntitle: "Add balance",
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
          title: "Drop your First Product.",
          description: "Drop products to your store and earn commissions as an affiliate marketer",
          btntitle: "Find products",
          image: "/First-Order.png",
          imagestyles:
            "absolute z-30 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-300 ease-out w-full flex justify-center items-center",
          iscompleted:
            userInfos?.UserRole === "affiliate" ? affiliateProducts.length > 0 : false,
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

  // trigger animation
  useEffect(() => {
    setAnimatedWidth(`${progressPercent}%`);
    setIsFinishSetup(completedSteps === totalSteps);
  }, [progressPercent, completedSteps, totalSteps, setIsFinishSetup]);

  if (completedSteps === totalSteps) {
    return null;
  }

  return (
    <section
      className="relative w-full p-4 min-h-[400px] rounded-xl bg-white border border-gray-200"
    >
      <h1 className="text-lg font-semibold text-gray-900 mb-3">Quick setup guide</h1>
      <Image
        src="/Pattern-1.jpg"
        alt=""
        fill
        className="object-cover scale-x-[-1] opacity-10 group-hover:scale-110 transition-all duration-300"
        loading="lazy"
      />

      <div className="w-full flex flex-wrap justify-between gap-2">
        {ConfigSteps.map((card, idx) => (
          <div
            key={idx}
            className="group relative bg-purple-100 flex-shrink-0 grow min-w-[220px] max-w-[300px] h-[280px] rounded-2xl overflow-hidden border border-gray-200 shadow"
          >
            <Image
              src="/Grid-Pattern.jpg"
              alt=""
              fill
              className="object-cover opacity-10 group-hover:scale-110 transition-all duration-300"
              loading="lazy"
            />
            <div className={card.imagestyles}>
              <Image src={card.image} alt="" width={120} height={120} quality={100} priority />
            </div>
            <div className="absolute bottom-0 left-0 z-40 p-4 min-h-[120px] w-full flex flex-col justify-end space-y-2 bg-gradient-to-t from-white via-white">
              <h1 className="font-semibold text-neutral-800">{card.title}</h1>
              <p className="text-xs text-gray-500">{card.description}</p>

              {isLoadingUserInfos ? (
                <div className="w-24 h-6 bg-gray-300 rounded-lg shadow-sm animate-pulse" />
              ) : card.iscompleted ? (
                <button
                  disabled
                  className={`px-2 text-[13px] py-1.5 flex items-center gap-1 w-max cursor-not-allowed ${PrimaryDark} text-white rounded-lg shadow-sm`}
                >
                  Completed <CircleCheckBig size={16} />
                </button>
              ) : (
                <Link
                  href={`/${userInfos ? (userInfos.UserRole === "seller" ? "seller" : "affiliate") : ""}/${card.link.href}`}
                  className="rounded-lg px-2 py-1.5 w-max text-sm border border-gray-300 shadow-sm text-[13px] hover:bg-purple-50"
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
              className="relative flex h-2 rounded-full bg-black transition-all duration-1000 ease-out after:absolute after:right-0 after:-top-1 after:w-4 after:h-4 after:rounded-full after:bg-black after:shadow"
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
