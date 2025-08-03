"use client";
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

export default function QuickSetupGuide() {
    return (
    <section
        className='relative w-full p-4 min-h-40 rounded-2xl 
            bg-white shadow'
    >
        <h1
            className='text-lg font-semibold text-gray-900'
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
            {Array(3).fill(0).map((_, idx) => {
                return (
                    <div
                        key={idx}
                        className='group relative bg-white w-1/3 h-70 rounded-2xl 
                            overflow-hidden border border-gray-200 shadow
                            hover:shadow-lg transition-shadow duration-300'
                    >
                        <Image
                            src="/Grid-Pattern.jpg"
                            alt=''
                            fill
                            className='object-cover opacity-10 group-hover:scale-140 transition-all duration-400'
                            loading='lazy'
                        />
                        <div
                            className='absolute bottom-0 left-0 z-20 p-4
                                min-h-50 w-full flex flex-col justify-end
                                space-y-2 bg-gradient-to-t from-white via-white'
                        >
                            <h1>Add your first product</h1>
                            <span>
                                <p className='text-sm text-gray-500'>
                                    Start by adding a product and a few key details. Not ready?
                                </p>
                                <Link href="/seller" className='text-sm text-blue-600'>
                                    Start with a sample product
                                </Link>
                            </span>
                            <button
                                className='primary-button rounded-xl py-1 px-4 w-max text-sm cursor-pointer'
                            >
                                Add product
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    </section>
  )
}
