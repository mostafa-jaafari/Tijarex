"use client"


import { signOut } from 'next-auth/react'
import React from 'react'

export default function SignOut() {
  return (
    <button
        onClick={() => signOut()}
        className='bg-red-600 hover:bg-red-700 py-1 px-6
        rounded-lg border border-red-900'
    >
        SignOut
    </button>
  )
}
