import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function HeroSection() {
  return (
    <section className="relative min-h-100 bg-neutral-100 flex items-center justify-center text-center">
      {/* --- Background Image --- */}
      <Image
        src="https://images.pexels.com/photos/3768249/pexels-photo-3768249.jpeg"
        alt="Hero-Background-Image"
        fill
        className="object-cover object-bottom"
        priority
        quality={100}
      />
      {/* --- Overlay --- */}
      <div className="absolute inset-0 bg-teal-700/60" />

      {/* --- Content --- */}
      <div className="relative z-10 p-6 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-white leading-tight">
          Upgrade Your Style, Effortlessly
        </h1>
        <p className="mt-4 text-lg text-neutral-200 max-w-2xl">
          Explore our curated collection of high-quality products. From the latest trends to timeless classics, we have everything you need to express your unique style.
        </p>
        <Link
          href="/c/shop"
          className="mt-8 px-8 py-3 text-lg font-bold text-teal-700 bg-white rounded-full hover:bg-neutral-100 transition-colors duration-300"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}