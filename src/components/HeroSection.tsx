import { BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function HeroSection() {
  return (
    <section
        className="relative w-full h-[60vh] p-6 
            bg-teal-00 flex items-end justify-between"
    >
        <div
            className='absolute -left-2'
        >
            <Image
                src="/Hero-Image-1.png"
                alt=''
                width={330}
                height={330}
                quality={100}
                priority
                className='rotate-5 rounded-xl 
                    overflow-hidden shadow-lg'
            />
            <span
                className='bg-white 
                    shadow-lg p-4 font-semibold rounded-lg 
                    absolute -right-30 top-8 text-teal-600
                    flex items-center gap-2'
            >Stylish Comfort <BadgeCheck size={20} /></span>
        </div>

        <div 
            className='w-full flex flex-col items-center space-y-6 justify-center'
        >
            <p
                className='max-w-120 tracking-wider leading-tight text-teal-600 text-center text-5xl font-semibold'
            >
                Become a Seller Boost Your Earnings Today!
            </p>
            <div
                className='flex items-center gap-6'
            >
                <button
                    className='cursor-pointer py-2 px-6 rounded-lg primary-button'
                >
                    Join Us Now
                </button>
                <button
                    className='cursor-pointer py-2 px-6 rounded-lg border 
                        border-teal-600 text-teal-600 font-semibold'
                >
                    Shop Now
                </button>
            </div>
        </div>

        <div
            className='absolute -right-2'
        >
            <Image
                src="/Hero-Image-2.png"
                alt=''
                width={330}
                height={330}
                quality={100}
                priority
                className='rotate-5 rounded-xl 
                    overflow-hidden shadow-lg'
            />
            <span
                className='bg-white 
                    shadow-lg p-4 font-semibold rounded-lg 
                    absolute -left-30 top-8 text-teal-600
                    flex items-center gap-2'
            >Fresh Arrivals <BadgeCheck size={20} /></span>
        </div>        
    </section>
  )
}
