import React from 'react'
import { Smartphone, ShoppingBag, Watch, Sofa, Headphones, Shirt } from "lucide-react";
import { HeadlineSection } from './HeadlineSection';
import Link from 'next/link';


export function ShopByCategories() {
    const categories = [
        {
            icon: Smartphone,
            title: "Mobiles",
            quantity: 124,
            isNew: true
        },
        {
            icon: ShoppingBag,
            title: "Shoes",
            quantity: 87,
            isNew: false
        },
        {
            icon: Watch,
            title: "Watches",
            quantity: 56,
            isNew: true
        },
        {
            icon: Sofa,
            title: "Furniture",
            quantity: 43,
            isNew: false
        },
        {
            icon: Headphones,
            title: "Audio",
            quantity: 92,
            isNew: true
        },
        {
            icon: Shirt,
            title: "Clothes",
            quantity: 210,
            isNew: false
        }
    ];
  return (
    <section
        id='shop by categories'
        className='w-full scroll-mt-25'
    >
        <HeadlineSection 
            TITLE='Shop by categories'
            ISTITLELINK
            TITLEHREFLINK='/'
        />
        <div
            className='grid grid-cols-2 md:grid-cols-4 
            lg:grid-cols-6 gap-2 place-items-center'
        >
            {categories.map((cat, i) => {
                return (
                    <Link
                        href={`/c/shop?cat=${cat.title.toLowerCase()}`}
                        key={i}
                    >
                        <div 
                            className="relative group hover:shadow-lg h-40 w-40 p-2
                                bg-gradient-to-b from-teal-500 to-teal-900 rounded-lg
                                hover:from-teal-900 hover:to-teal-500
                                flex flex-col justify-center items-center gap-2
                                transition-colors duration-200">
                            <span
                                className='primary-button-w text-black p-4 
                                    rounded-lg border border-gray-200'
                            >
                                <cat.icon 
                                    size={25}
                                    className='group-hover:scale-115 
                                        transition-all duration-300 text-teal-700'
                                />
                            </span>
                            <h1
                                className='font-semibold text-white'
                            >
                                {cat.title}
                            </h1>
                            {cat.isNew &&
                                <span
                                    className='absolute right-2 top-2 text-white
                                        text-xs bg-teal-900 rounded px-1.5 py-0.5 shadow'
                                >
                                    New
                                </span>
                            }
                        </div>
                    </Link>
                )
            })}
        </div>
    </section>
  )
}
