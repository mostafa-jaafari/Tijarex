import { PrivateHeader } from '@/components/PrivateHeader';
import { Sidebar } from '@/components/Sidebar';
import React from 'react';

export default function layout({ children, params }: { children: React.ReactNode; params: { locale: string; userspace: string } }) {
  return (
    <main
      // 1. Make the main container a vertical flexbox
      className='w-full h-screen flex flex-col 
        overflow-hidden bg-[#FBFBFB]'
    >
      <PrivateHeader />
      <div
        className='w-full flex flex-1 items-start gap-4 overflow-hidden'
      >
        <Sidebar />
        <div className='flex-1 h-full overflow-y-auto'>
          {children}
        </div>
      </div>
    </main>
  )
}