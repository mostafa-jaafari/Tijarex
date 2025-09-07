import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function HeroSection() {
  return (
    <section
      className='min-h-100 px-6 bg-white flex items-center justify-between gap-3'
    >
      {/* --- Left Section --- */}
      <div
        className='relative grow h-90 overflow-hidden rounded-xl flex-shrink-0 
          bg-neutral-50 border-b border-neutral-400 ring ring-neutral-200'
      >
        <Image
          src="https://images.pexels.com/photos/17884411/pexels-photo-17884411.jpeg"
          fill
          alt='Hero-Image-1.jpg'
          className='object-cover object-left scale-110'
          priority
          quality={100}
        />
        <div
          className='absolute z-20 w-full h-full flex flex-col
            justify-end items-start text-start pb-12 px-12'
        >
          <h1
            className='text-2xl font-bold capitalize text-neutral-100'
          >
            Active winter with New trending hoodies
          </h1>
          {/* <p
            className='mt-1 text-sm text-teal-500'
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Illo 
          </p> */}
          <button
            className='mt-4 text-sm bg-teal-600/90 hover:bg-teal-600 rounded-lg
              border-b border-teal-800 ring ring-teal-600/90 px-6 py-1.5 
              cursor-pointer text-neutral-100 hover:text-white'
          >
            Discover Now
          </button>
        </div>
        <div 
          className='absolute bottom-0 left-0 bg-gradient-to-t 
            from-white/80 to-transparent z-10 w-full h-[60%]'
        />
      </div>
      {/* --- Right Section --- */}
      <div
        className='w-3/5 overflow-hidden rounded-xl flex-shrink-0 
          bg-teal-600 border-b border-teal-800 ring ring-teal-600/90
          flex items-start justify-between gap-3'
      >
        {/* --- Left Coontent Text --- */}
        <div
          className='w-1/2 p-12 h-90 flex flex-col justify-between flex-shrink-0'
        >
          <h1
            className='text-2xl font-bold text-white'
          >
            Discover Products You’ll Love, At Prices You Can’t Resist
          </h1>
          <p
            className='text-neutral-300 my-3 text-sm'
          >
            Find unique deals, trending items, and exclusive offers tailored just for you.
          </p>
          <Link
            href="/c/shop"
            className={`mt-3 px-6 py-1.5 w-max text-neutral-600 
              hover:text-neutral-600 font-semibold text-sm bg-white rounded-lg
              hover:bg-neutral-100`}
          >
            Shop Now
          </Link>
        </div>
        {/* --- Right Image Content --- */}
        <div
          className='relative w-1/2 h-90 flex-shrink-0 overflow-hidden'
        >
          <Image
            src="/HeroImage1.jpg"
            alt='Hero-Image-1.jpg'
            fill
            className='object-cover'
            priority
            quality={100}
          />
        </div>
      </div>
    </section>
  )
}
