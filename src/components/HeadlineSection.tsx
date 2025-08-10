"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


interface HeadlineSectionProps{
    TITLE: string;
    SHOWBUTTONS?: boolean;
    ISTITLELINK?: boolean;
    TITLEHREFLINK?: string;
    SCROLLREF?: React.RefObject<HTMLDivElement | null>;
}
export function HeadlineSection({ TITLE, SHOWBUTTONS, ISTITLELINK, TITLEHREFLINK, SCROLLREF }: HeadlineSectionProps) {
  
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // دالة لفحص حالة التمرير
    const checkScrollPosition = () => {
        if(!SCROLLREF?.current) return;
        const el = SCROLLREF.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        checkScrollPosition();
        if(!SCROLLREF?.current) return;
        const el = SCROLLREF.current;
        if (!el) return;

        // نراقب حدث التمرير لتحديث الأزرار ديناميكياً
        el.addEventListener("scroll", checkScrollPosition);

        return () => {
        el.removeEventListener("scroll", checkScrollPosition);
        };
    }, [SCROLLREF]);

    const scrollLeft = () => {
        if(!SCROLLREF?.current) return;
        if (SCROLLREF.current) {
            SCROLLREF.current.scrollBy({
            left: -400,
            behavior: "smooth",
        });
        }
    };
    const scrollRight = () => {
        if(!SCROLLREF?.current) return;
        if (SCROLLREF.current) {
            SCROLLREF.current.scrollBy({
            left: 400,
            behavior: "smooth",
        });
        }
    };
    return (
    <section
        className='w-full flex items-center justify-between mb-4'
    >
        {ISTITLELINK ? (
            <Link
                href={TITLEHREFLINK || ""}
                className='font-semibold text-2xl flex 
                    items-center gap-1'
            >
                {TITLE} <ChevronRight size={20}/>
            </Link>
        )
        :
        (
            <h1
                className='font-semibold text-2xl'
            >
                {TITLE}
            </h1>
        )}
        {SHOWBUTTONS && (
            <div
                className='flex items-center gap-2'
            >
                <button
                    disabled={!canScrollLeft}
                    onClick={scrollLeft}
                    className={`p-1 rounded-full ${
                        canScrollLeft
                        ? "bg-teal-600 cursor-pointer text-white hover:bg-teal-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    >
                    <ChevronLeft size={16} />
                </button>
                <button
                    disabled={!canScrollRight}
                    onClick={scrollRight}
                    className={`p-1 rounded-full ${
                        canScrollRight
                        ? "bg-teal-600 cursor-pointer text-white hover:bg-teal-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    >
                    <ChevronRight size={16} />
                </button>
            </div>
        )}
    </section>
  )
}
