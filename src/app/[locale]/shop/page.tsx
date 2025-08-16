import { Metadata } from 'next';
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
        className='w-full min-h-70 bg-red-500'
    >
        {JSON.stringify(searchParams.cat)}
        Shop Page
    </section>
  )
}
