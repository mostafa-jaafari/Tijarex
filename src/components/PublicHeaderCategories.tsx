"use client";

import Link from "next/link";



const Available_Categories = ["fashion", "clothes", "men", "women", "kids", "books", "art"];

export function PublicHeaderCategories() {
  return (
    <section
        className="flex items-center justify-center gap-12 bg-white
             border-b border-neutral-200"
    >
      {Available_Categories.map((cat, idx) => {
        return (
            <Link
                key={idx}
                href={`/c/shop?cat=${cat.toLowerCase().replace(" ", "")}`}
            >
                <div
                    className="text-neutral-700 text-sm capitalize py-3"
                >
                    <h1
                        className="hover:text-teal-600"
                    >
                        {cat}
                    </h1>
                </div>
            </Link>
        )
      })}
    </section>
  )
}
