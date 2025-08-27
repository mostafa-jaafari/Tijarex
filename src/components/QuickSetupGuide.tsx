"use client";
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { WhiteButtonStyles } from './Header';
import { useUserInfos } from '@/context/UserInfosContext';

export default function QuickSetupGuide() {
    const { userInfos, isLoadingUserInfos } = useUserInfos();

    const ConfigSteps = [
        {
            title: "Create your account.",
            description: "Register your account and set up your basic details to start selling in minutes",
            btntitle: "Create account",
            image: "/create-account-avatar.png",
            imagestyles: "absolute z-30 group-hover:scale-140 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: true,
            link: {
                label: "Start your journey with us !",
                href: userInfos?.UserRole === "seller" ? "/seller" : "/affiliate",
            }
        },{
            title: "Add balance",
            description: "Top up your balance to start fulfilling your orders smoothly",
            btntitle: "Add balance",
            image: "/CIH-MASTERCARD.png",
            imagestyles: "absolute z-30 scale-140 group-hover:scale-180 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: !!(userInfos?.totalbalance && userInfos.totalbalance > 0),
            link: {
                label: "Activate your account with credit.",
                href: "add-balance",
            }
        },
        userInfos?.UserRole === "seller" ? {
            title: "Add your First Product",
            description: "List your products to reach a wider audience and boost your sales",
            btntitle: "Add products",
            image: "/First-Order.png",
            imagestyles: "absolute z-30 scale-125 group-hover:scale-160 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: !!(userInfos?.activeproducts && userInfos.activeproducts > 0),
            link: {
                label: "Start adding your products.",
                href: "upload-products"
            }
        } : {
            title: "Drop your First Product.",
            description: "Drop products to your store and earn commissions as an affiliate marketer",
            btntitle: "Find products",
            image: "/First-Order.png",
            imagestyles: "absolute z-30 scale-140 group-hover:scale-180 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: false,
            link: {
                label: "Start promoting products.",
                href: "products"
            }
        },
    ];

    // ✅ حساب النسبة المئوية حسب الخطوات المنجزة
    const completedSteps = ConfigSteps.filter(step => step.iscompleted).length;
    const totalSteps = ConfigSteps.length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);

    const [percent, setPercent] = useState(progressPercent);
    const [animatedWidth, setAnimatedWidth] = useState("0%");
    const [displayedPercent, setDisplayedPercent] = useState(0);

    // كلما تبدل progressPercent نحدّث percent
    useEffect(() => {
        setPercent(progressPercent);
    }, [progressPercent]);

    // For smooth animation bar
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedWidth(`${percent}%`);
        }, 50);
        return () => clearTimeout(timeout);
    }, [percent]);

    // to change the number step by step and smooth
    useEffect(() => {
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(progress * percent);
            setDisplayedPercent(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [percent]);

    return (
        <section className='relative w-full p-4 min-h-40 rounded-xl bg-white border border-gray-200'>
            <h1 className='text-lg font-semibold text-gray-900 mb-3'>
                Quick setup guide
            </h1>

            <Image
                src="/Pattern-1.jpg"
                alt=''
                fill
                className='object-cover scale-x-[-1] opacity-10 group-hover:scale-140 transition-all duration-400'
                loading='lazy'
            />

            <div className='w-full flex flex-shrink-0 items-center flex-wrap justify-between gap-2'>
                {ConfigSteps.map((card, idx) => (
                    <div
                        key={idx}
                        className='group relative bg-teal-50 flex-shrink-0 grow min-w-[220] max-w-[300px] h-70 rounded-2xl overflow-hidden border border-gray-200 shadow shadow-gray-100'
                    >
                        <Image
                            src="/Grid-Pattern.jpg"
                            alt=''
                            fill
                            className='object-cover opacity-10 group-hover:scale-140 transition-all duration-400'
                            loading='lazy'
                        />
                        <div className={card.imagestyles}>
                            <Image 
                                src={card.image}
                                alt=''
                                width={120}
                                height={120}
                                quality={100}
                                priority
                            />
                        </div>
                        <div
                            className='absolute bottom-0 left-0 z-40 p-4
                                min-h-50 w-full flex flex-col justify-end
                                space-y-2 bg-gradient-to-t from-white via-white'
                        >
                            <h1 className='font-semibold text-teal-800'>
                                {card.title}
                            </h1>
                            <span>
                                <p className='text-xs text-gray-500'>
                                    {card.description}
                                </p>
                            </span>
                            {isLoadingUserInfos ? (
                                <div className='w-24 h-6 bg-gray-300 rounded-lg shadow-sm animate-pulse'/>
                            ) : card.iscompleted ? (
                                <button
                                    disabled
                                    className={`b py-1 flex items-center gap-1 px-4 
                                        w-max text-sm cursor-not-allowed
                                        bg-gradient-to-r from-teal-500 to-teal-600
                                        text-white rounded-lg shadow-sm
                                        hover:from-teal-600 hover:to-teal-700
                                        transition-colors duration-200 ease-in-out`}
                                >
                                    Completed <CircleCheckBig size={16} />
                                </button>
                            ) : (
                                <Link
                                    href={`${userInfos ? (userInfos.UserRole === "seller" ? "seller" : "affiliate") : "/"}/${card.link.href}`}
                                    className={`rounded-lg py-1 px-4 w-max text-sm 
                                            ${WhiteButtonStyles}
                                            ring ring-gray-200`}
                                >
                                    {card.btntitle}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className='w-full flex items-center gap-2 pt-3'>
                <div className='w-full'>
                    <div className='rounded-full border border-teal-200 bg-teal-100'>
                        <span 
                            className="relative flex h-2 rounded-full bg-teal-600 transition-all duration-1000 ease-out 
                            after:absolute after:right-0 after:-top-1 after:w-4 after:shadow after:h-4 after:rounded-full after:bg-teal-600"
                            style={{ width: animatedWidth }}
                        ></span> 
                    </div>
                </div>
                <p className='text-gray-500'>{displayedPercent}%</p>
            </div>
        </section>
    )
}
