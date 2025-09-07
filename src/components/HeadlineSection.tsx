"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react'

interface HeadlineSectionProps {
    TITLE: string;
    SHOWBUTTONS?: boolean;
    ISTITLELINK?: boolean;
    TITLEHREFLINK?: string;
    SCROLLREF?: React.RefObject<HTMLDivElement | null>;
}

export function HeadlineSection({ TITLE, SHOWBUTTONS, ISTITLELINK, TITLEHREFLINK, SCROLLREF }: HeadlineSectionProps) {
    
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // دالة لفحص حالة التمرير - مربوطة بـ useCallback
    const checkScrollPosition = useCallback(() => {
        if (!SCROLLREF?.current) return;
        const el = SCROLLREF.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }, [SCROLLREF]);

    useEffect(() => {
        checkScrollPosition();
        if (!SCROLLREF?.current) return;
        const el = SCROLLREF.current;

        el.addEventListener("scroll", checkScrollPosition);
        return () => {
            el.removeEventListener("scroll", checkScrollPosition);
        };
    }, [SCROLLREF, checkScrollPosition]);

    const scrollLeft = () => {
        if (!SCROLLREF?.current) return;
        SCROLLREF.current.scrollBy({ left: -400, behavior: "smooth" });
        // Call checkScrollPosition after a brief delay to allow smooth scroll to complete
        setTimeout(checkScrollPosition, 100);
    };

    const scrollRight = () => {
        if (!SCROLLREF?.current) return;
        SCROLLREF.current.scrollBy({
            left: 400,
            behavior: "smooth",
        });
        // Add the missing checkScrollPosition call
        setTimeout(checkScrollPosition, 100);
    };

    return (
        <section className='w-full flex items-center justify-between mb-8'>
            {ISTITLELINK ? (
                <Link
                    href={TITLEHREFLINK || ""}
                    className='font-semibold text-xl text-neutral-700 hover:text-neutral-800 flex items-center gap-1'
                >
                    {TITLE} <ChevronRight size={20} />
                </Link>
            ) : (
                <h1 className='font-semibold text-xl text-neutral-700'>
                    {TITLE}
                </h1>
            )}
            {SHOWBUTTONS && (
                <div className='flex items-center gap-2'>
                    <button
                        disabled={!canScrollLeft}
                        onClick={scrollLeft}
                        className={`p-1 rounded-full ${canScrollLeft
                            ? "bg-teal-700 cursor-pointer text-white hover:bg-teal-700/50"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        disabled={!canScrollRight}
                        onClick={scrollRight}
                        className={`p-1 rounded-full ${canScrollRight
                            ? "bg-teal-700 cursor-pointer text-white hover:bg-teal-700/50"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}