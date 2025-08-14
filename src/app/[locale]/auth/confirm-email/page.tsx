import React from 'react'
import { ConfirmPage } from './ConfirmPage'
import { Metadata } from 'next'



export const metadata: Metadata = {
  title: "Email verification",
}
export default function page() {
  return (
    <main
        className='w-full min-h-120 flex justify-center items-center'
    >
        <ConfirmPage />
    </main>
  )
}
