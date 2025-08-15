import React from 'react'
import { Smartphone, ShoppingBag, Watch, Sofa, Headphones, Shirt } from "lucide-react";
import { HeadlineSection } from './HeadlineSection';


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
        className='w-full '
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
                    <div 
                        key={i} 
                        className="relative group h-40 w-40 p-2 primary-button-b
                            flex flex-col justify-center items-center gap-2">
                        <span
                            className='primary-button-w text-teal-600 p-4 
                                rounded-lg border border-gray-200'
                        >
                            <cat.icon 
                                size={25}
                                className='group-hover:scale-115 
                                    transition-all duration-300'
                            />
                        </span>
                        <h1
                            className='font-semibold white'
                        >
                            {cat.title}
                        </h1>
                        {cat.isNew &&
                            <span
                                className='absolute right-2 top-2 text-black
                                    text-sm bg-white rounded px-3 shadow'
                            >
                                New
                            </span>
                        }
                    </div>
                )
            })}
        </div>
    </section>
  )
}
