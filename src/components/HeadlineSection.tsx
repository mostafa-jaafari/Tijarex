"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';

interface HeadlineSectionProps {
    TITLE: string;
    SHOWBUTTONS?: boolean;
    ISTITLELINK?: boolean;
    TITLEHREFLINK?: string;
    // --- FIX: Allow the ref's current property to be null ---
    // This makes the component's prop type match the type created by useRef(null)
    SCROLLREF?: React.RefObject<HTMLDivElement | null>;
}

export function HeadlineSection({ TITLE, SHOWBUTTONS, ISTITLELINK, TITLEHREFLINK, SCROLLREF }: HeadlineSectionProps) {
    
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollPosition = useCallback(() => {
        const el = SCROLLREF?.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 1);
        const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
        setCanScrollRight(!isAtEnd);
    }, [SCROLLREF]);

    useEffect(() => {
        const element = SCROLLREF?.current;
        if (!element) return;

        checkScrollPosition();
        element.addEventListener("scroll", checkScrollPosition, { passive: true });
        const resizeObserver = new ResizeObserver(checkScrollPosition);
        resizeObserver.observe(element);

        return () => {
            element.removeEventListener("scroll", checkScrollPosition);
            resizeObserver.unobserve(element);
        };
    }, [SCROLLREF, checkScrollPosition]);

    const scrollLeft = () => {
        SCROLLREF?.current?.scrollBy({ left: -400, behavior: "smooth" });
    };

    const scrollRight = () => {
        SCROLLREF?.current?.scrollBy({ left: 400, behavior: "smooth" });
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
                        aria-label="Scroll left"
                        className={`p-1 rounded-full transition-colors duration-200 ${
                            canScrollLeft
                                ? "bg-teal-700 cursor-pointer text-white hover:bg-teal-600"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        disabled={!canScrollRight}
                        onClick={scrollRight}
                        aria-label="Scroll right"
                        className={`p-1 rounded-full transition-colors duration-200 ${
                            canScrollRight
                                ? "bg-teal-700 cursor-pointer text-white hover:bg-teal-600"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}