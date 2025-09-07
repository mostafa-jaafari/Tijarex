import Footer from '@/components/Footer'
import { PublicHeader } from '@/components/PublicHeader'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main 
        className="w-full min-h-[200vh]
            bg-[#F1F1F1] flex flex-col">
      <PublicHeader />
      {children}
      <Footer />
    </main>
  )
}
