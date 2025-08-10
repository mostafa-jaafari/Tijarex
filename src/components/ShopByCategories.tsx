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
                        className="group h-40 w-40 p-2 bg-teal-50 rounded-lg shadow 
                            flex flex-col justify-center items-center gap-2
                            cursor-pointer hover:shadow-lg">
                        <span
                            className='bg-white text-teal-600 p-4 
                                rounded-lg border border-gray-200'
                        >
                            <cat.icon 
                                size={25}
                                className='group-hover:scale-115 
                                    transition-all duration-300'
                            />
                        </span>
                        <h1 
                            className='font-semibold text-teal-600'
                        >
                            {cat.title}
                        </h1>
                    </div>
                )
            })}
        </div>
    </section>
  )
}
