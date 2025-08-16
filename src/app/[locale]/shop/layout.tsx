import Footer from '@/components/Footer'
import { Header } from '@/components/Header'
import { ShopFilter } from '@/components/ShopFilter'
import React from 'react'

export default function layout({ children }: {children: React.ReactNode}) {
  return (
    <main
        className='w-full'
    >
        <Header />
        <section
            className='w-full flex items-start'
        >
            <ShopFilter />
            {children}
            <Footer />
        </section>
    </main>
  )
}
