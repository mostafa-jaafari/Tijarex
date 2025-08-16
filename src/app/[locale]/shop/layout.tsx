import { Header } from '@/components/Header'
import { ShopFilter } from '@/components/ShopFilter'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main 
        className="w-full min-h-[200vh]
            bg-[#F1F1F1] flex flex-col">
      <Header />

      <section className="w-full flex flex-1 items-start">
        <aside className="sticky top-14 p-2 h-full">
          <ShopFilter />
        </aside>

        <div className="flex-1">{children}</div>
      </section>
    </main>
  )
}
