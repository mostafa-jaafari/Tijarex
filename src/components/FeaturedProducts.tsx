import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Countdown } from './CountDown'

export default function FeaturedProducts() {
  return (
    <section
        className='w-full mb-50'
    >

    <div
        className='relative w-full min-h-80 rounded-lg 
            bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 shadow-sm'
    >
        <Image
            src="/HeadPhone-Product.png"
            alt=''
            width={350}
            height={350}
            priority
            quality={100}
            className='absolute -top-35 left-50 drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]'
        />
        <div className="w-full flex justify-between p-12">
            <div
                className='space-y-3'
            >
                <h2 
                    className="text-5xl font-bold uppercase text-white"
                >
                    HeadPhone
                </h2>
                <p 
                    className="text-lg font-semibold text-teal-100"
                >
                    Summer Offers
                </p>
                <span
                    className='flex items-end gap-2'
                >
                    <ins
                        className='text-2xl font-semibold text-teal-100'
                    >
                        149 Dh
                    </ins>
                    <del
                        className='text-gray-300'
                    >
                        199 Dh
                    </del>
                </span>
                <p 
                    className="text-sm mt-6 max-w-[270px] text-gray-200"
                >
                    Get your favorite wireless headphones at the best price before the season ends!
                </p>
                <button 
                    className="group primary-button-w w-40 py-2 font-semibold
                        text-teal-600 shadow-sm flex justify-center
                        items-center gap-2 ">
                    <ShoppingCart size={15} className='translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out' /> <span className='-translate-x-3 group-hover:translate-x-0 transition-all duration-300 ease-in-out'>Shop Now</span>
                </button>
            </div>
            <Countdown 
                targetDate="2025-09-08"
                CONTAINERCLASSNAME='max-w-60 w-full flex justify-end gap-2 h-max'
                DAYTIMECLASSNAME='w-8 h-8 flex items-center justify-center font-semibold bg-white rounded-lg shadow-sm'
                HOURTIMECLASSNAME='w-8 h-8 flex items-center justify-center font-semibold bg-white rounded-lg shadow-sm'
                MINTIMECLASSNAME='w-8 h-8 flex items-center justify-center font-semibold bg-white rounded-lg shadow-sm'
                SECTIMECLASSNAME='w-8 h-8 flex items-center justify-center font-semibold bg-white rounded-lg shadow-sm'
            />
        </div>
    </div>
    </section>
  )
}
