import Image from 'next/image'
import React from 'react'
import { RegisterForm } from './RegisterForm'



export const metadata = {
    title: 'Register | Jamla',
    description: 'Create a new account on Jamla. Sign up to access exclusive features and join our community.',
    keywords: ['register', 'sign up', 'Jamla', 'account', 'authentication'],
    openGraph: {
        title: 'Register | Jamla',
        description: 'Create a new account on Jamla. Sign up to access exclusive features and join our community.',
        images: [
            {
                url: 'https://images.pexels.com/photos/26761029/pexels-photo-26761029.jpeg',
                alt: 'Register on Jamla',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Register | Jamla',
        description: 'Create a new account on Jamla. Sign up to access exclusive features and join our community.',
        images: ['https://images.pexels.com/photos/26761029/pexels-photo-26761029.jpeg'],
    },
};

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
