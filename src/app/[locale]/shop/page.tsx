import { ShopInputSearch } from '@/components/ShopInputSearch';
import { Tag } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'


interface ShopPageProps{
    searchParams: {
        cat: string;
    };
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata>{
    const category = searchParams.cat || "categorie";
    return {
        title: `Shop | ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Browse products in ${category} category.`,
    };
}
export default function page({ searchParams }: ShopPageProps) {
  return (
    <section
        className='w-full min-h-70 shrink-0 bg-white p-4 shadow-md 
            rounded-xl overflow-y-auto'
    >
        <div>
            <ShopInputSearch />
            <div
                className='flex items-center gap-3 justify-center py-3'
            >
                {["sport", "books", "fashion", "electronics"].map((sug, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={`/shop?cat=${sug.toLowerCase().replace(" ", "")}`}
                        >
                            <span
                                className='text-sm bg-gray-100 ring ring-gray-200 
                                    rounded-full px-2 flex items-center gap-1
                                    hover:bg-gray-200'
                            >
                                <Tag size={12} /> {sug}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    </section>
  )
}
