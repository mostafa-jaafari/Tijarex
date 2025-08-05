import Link from 'next/link'
import React from 'react'

export default function GlobalLogo() {
  return (
    <Link
        href="/"
        className='text-3xl font-semibold uppercase
            bg-gradient-to-r from-blue-600 to-blue-900 
            bg-clip-text text-transparent font-cinzel'
    >
        Tijarex
    </Link>
  )
}
