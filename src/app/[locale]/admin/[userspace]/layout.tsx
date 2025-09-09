import { PrivateHeader } from '@/components/PrivateHeader';
import { Sidebar } from '@/components/Sidebar';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode; params: { locale: string; userspace: string } }) {
  return (
      <main
        className='w-full h-screen flex flex-col 
          overflow-hidden bg-[#1A1A1A]'
      >
        <PrivateHeader />
        <div
          className='w-full flex flex-1 rounded-t-2xl bg-neutral-50 items-start overflow-hidden'
        >
          <Sidebar />
          <div className='flex-1 h-full overflow-y-auto'>
            {children}
          </div>
        </div>
      </main>
  )
}