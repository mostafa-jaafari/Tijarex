import React from 'react'
import { LoginForm } from './LoginForm'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Login | Jamla.ma',
    description: 'Sign in to your Jamla.ma account to manage your brand, access exclusive features, and grow your business online.',
    openGraph: {
        title: 'Login | Jamla.ma',
        description: 'Access your Jamla.ma account and unlock powerful tools to build and manage your brand with ease.',
        url: 'https://jamla.ma/auth/login',
        siteName: 'Jamla.ma',
        images: [
            {
                url: 'https://images.pexels.com/photos/26761029/pexels-photo-26761029.jpeg',
                width: 1200,
                height: 630,
                alt: 'Login to Jamla.ma',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    keywords: [
        'Jamla.ma',
        'login',
        'sign in',
        'brand management',
        'business tools',
        'account access',
        'digital branding',
    ],
    robots: {
        index: true,
        follow: true,
    },
}

export default async function page() {
    return (
    <main
        className='w-full h-screen flex p-3 items-start justify-end'
            style={{
                backgroundImage: 'url(/Auth-Background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f0f4f8',
            }}
    >
        <LoginForm />
    </main>
  )
}
