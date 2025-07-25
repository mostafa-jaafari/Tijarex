import Image from 'next/image'
import React from 'react'
import { RegisterForm } from './RegisterForm'

export default function page() {
  return (
    <main
        className='flex items-start bg-black w-full text-white min-h-screen'
    >
        <div
            className='w-full'
        >
            <RegisterForm />
        </div>
        <div
            className='relative h-screen w-full lg:flex hidden'
        >
            <Image
                src="https://images.pexels.com/photos/26761029/pexels-photo-26761029.jpeg"
                alt='https://images.pexels.com/photos/26761029/pexels-photo-26761029.jpeg'
                fill
                className='object-cover'
            />
        </div>
    </main>
  )
}
