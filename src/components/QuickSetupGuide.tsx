"use client";
import { CircleCheckBig } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function QuickSetupGuide() {

    const stepsConfig = [
        {
            title: "Create your account.",
            description: "Register your account and set up your basic details to start selling in minutes",
            btntitle: "Create account",
            image: "/create-account-avatar.png",
            imagestyles: "absolute z-30 group-hover:scale-140 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: true,
            link: {
                label: "Start your journey with us !",
                href: "/seller"
            }
        },{
            title: "Add balance",
            description: "Top up your balance to start fulfilling your orders smoothly",
            btntitle: "Add balance",
            image: "/CIH-MASTERCARD.png",
            imagestyles: "absolute z-30 scale-140 group-hover:scale-180 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: false,
            link: {
                label: "Activate your account with credit.",
                href: "/seller/add-balance",
            }
        },{
            title: "Make your first order.",
            description: "Test the system by placing a sample or real order and see how it works !",
            btntitle: "Make first order",
            image: "/First-Order.png",
            imagestyles: "absolute z-30 scale-140 group-hover:scale-180 group-hover:translate-y-6 transition-transform duration-400 ease-out w-full flex justify-center items-center",
            iscompleted: false,
            link: {
                label: "Try your first order now !",
                href: "/seller"
            }
        },
    ];
    const [percent, setPercent] = useState(25);
    const [animatedWidth, setAnimatedWidth] = useState("0%");
    const [displayedPercent, setDisplayedPercent] = useState(0);

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
        <section
            className='relative w-full p-4 min-h-40 rounded-2xl 
                bg-white border border-gray-200'
        >
            <h1
                className='text-lg font-semibold text-gray-900 mb-3'
            >
                Quick setup guide
            </h1>

            <Image
                src="/Pattern-1.jpg"
                alt=''
                fill
                className='object-cover scale-x-[-1] opacity-10 group-hover:scale-140 transition-all duration-400'
                loading='lazy'
            />
            <div className='w-full flex flex-shrink-0 items-center justify-between gap-2'>
                {stepsConfig.map((card, idx) => {
                    return (
                        <div
                            key={idx}
                            className='group relative bg-white w-1/3 h-70 rounded-2xl 
                                overflow-hidden border border-gray-200 shadow shadow-gray-100'
                        >
                            <Image
                                src="/Grid-Pattern.jpg"
                                alt=''
                                fill
                                className='object-cover opacity-10 group-hover:scale-140 transition-all duration-400'
                                loading='lazy'
                            />
                            <div
                                className={card.imagestyles}
                            >
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
                                <h1>{card.title}</h1>
                                <span>
                                    <p className='text-sm text-gray-500'>
                                        {card.description}
                                    </p>
                                    <Link 
                                        href={card.link.href} 
                                        className='text-sm text-blue-600'
                                    >
                                        {card.link.label}
                                    </Link>
                                </span>
                                {card.iscompleted ? (
                                    <button
                                        disabled
                                        className='checked-button rounded-xl py-1 
                                            flex items-center gap-1 px-4 w-max 
                                            text-sm cursor-not-allowed'
                                    >
                                        Completed <CircleCheckBig size={16} />
                                    </button>
                                ) : (
                                    <Link
                                        href={card.link.href}
                                        className='primary-button rounded-xl py-1 px-4 w-max text-sm cursor-pointer'
                                    >
                                        {card.btntitle}
                                    </Link>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div
                className='w-full flex items-center gap-2 pt-3'
            >
                <div
                    className='w-full'
                >
                    <div
                        className='rounded-full border border-blue-200 bg-blue-100'
                    >
                        <span 
                            className="relative flex h-2 rounded-full 
                            bg-blue-600 transition-all 
                            duration-1000 ease-out 
                            after:absolute 
                            after:right-0 
                            after:-top-1 
                            after:w-4 
                            after:shadow 
                            after:h-4 
                            after:rounded-full
                            after:bg-blue-600"
                            style={{ width: animatedWidth }}
                        ></span> 
                    </div>
                </div>
                <p className='text-gray-500'>{displayedPercent}%</p>
            </div>
        </section>
  )
}
