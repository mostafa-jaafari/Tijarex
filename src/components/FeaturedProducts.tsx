import Image from 'next/image'
import React from 'react'
import { HeadlineSection } from './HeadlineSection'

export default function FeaturedProducts() {
  return (
    <section
        className='w-full'
    >
        <HeadlineSection
            TITLE='Featured Products'
            ISTITLELINK
            TITLEHREFLINK='/'
        />
    <div
        className='w-full h-150 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2'
    >
        <div
            className='relative w-full h-full bg-gray-50 rounded-lg overflow-hidden'
        >
            <Image
                src="https://images.pexels.com/photos/3735655/pexels-photo-3735655.jpeg"
                alt=''
                fill
                className='object-cover'
            />
        </div>
        <div
            className='grid grid-cols-1 grid-rows-2 gap-2'
        >
            <div className='relative w-full h-full bg-gray-50 rounded-lg overflow-hidden'>
                <Image
                    src="https://images.pexels.com/photos/859057/pexels-photo-859057.jpeg"
                    alt=''
                    fill
                    className='object-cover'
                />
            </div>
            <div className='relative w-full h-full bg-gray-50 rounded-lg overflow-hidden'>
                <Image
                    src="https://images.pexels.com/photos/22032444/pexels-photo-22032444.jpeg"
                    alt=''
                    fill
                    className='object-cover'
                />
            </div>
        </div>
    </div>
    </section>
  )
}
