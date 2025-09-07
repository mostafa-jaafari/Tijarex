import Image from 'next/image'
import React from 'react'

export function HeroSection() {
  return (
    <section
      className='min-h-100 px-6 bg-white flex items-center justify-between gap-3'
    >
      <div
        className='relative grow h-90 overflow-hidden rounded-xl flex-shrink-0 
          bg-neutral-50 border-b border-neutral-400 ring ring-neutral-200'
      >
        <Image
          src="/HeroImage1.jpg"
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
            className='text-xl capitalize font-semibold text-neutral-700'
          >
            Active winter with New trending hoodies
          </h1>
          <p
            className='mt-1 text-sm text-neutral-500'
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Illo 
          </p>
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
            from-white to-transparent z-10 w-full h-[60%]'
        />
      </div>
      <div
        className='w-3/5 h-90 overflow-hidden rounded-xl flex-shrink-0 
          bg-green-500'
      >
        Second
      </div>
    </section>
  )
}
