import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'


interface HeadlineSectionProps{
    TITLE: string;
    SHOWBUTTONS?: boolean;
    ISTITLELINK?: boolean;
    TITLEHREFLINK?: string;
}
export function HeadlineSection({ TITLE, SHOWBUTTONS, ISTITLELINK, TITLEHREFLINK }: HeadlineSectionProps) {
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
                <span
                    className='bg-gray-200 hover:shadow-lg hover:bg-gray-300
                        hover:scale-105 cursor-pointer rounded-full p-1
                        transition-all duration-200'
                        >
                    <ChevronLeft size={16} />
                </span>
                <span
                    className='bg-gray-200 hover:shadow-lg hover:bg-gray-300
                        hover:scale-105 cursor-pointer rounded-full p-1
                        transition-all duration-200'
                >
                    <ChevronRight size={16} />
                </span>
            </div>
        )}
    </section>
  )
}
