import Image from 'next/image'
import React from 'react'

export function HeroSection() {
  return (
    <section
      className='min-h-100 px-6 bg-white flex items-center justify-between gap-3'
    >
      <div
        className='relative grow h-90 overflow-hidden rounded-xl flex-shrink-0 
          bg-red-500'
      >
        <Image
          src="/HeroImage1.jpg"
          fill
          alt='Hero-Image-1.jpg'
          className='object-cover object-top'
          priority
          quality={100}
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
