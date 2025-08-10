import { ProductCardProps } from '@/types/product';
import { Flame, Tag } from 'lucide-react';
import Image from 'next/image';
import React from 'react'


export function BestSellingProductUI({ PRODUCTIMAGE, STOCK, OWNER, PRODUCTCATEGORIE, PRODUCTPRICE , PRODUCTTITLE}: ProductCardProps) {

  return (
    <section
        className='relative w-full max-w-[250px] min-h-40 rounded-xl 
            overflow-hidden flex-shrink-0'
    >
        <div
            className='relative w-full h-60 overflow-hidden'
        >
            <Image
                src={PRODUCTIMAGE}
                alt=''
                fill
                className='object-cover hover:scale-115 hover:rotate-5 transition-all duration-300'
            />
        </div>
        {/* --- Trend Badge --- */}
        <span
            className='absolute z-20 top-2 right-2 bg-teal-600 
                rounded-lg p-1 text-white'
        >
            <Flame size={20}/>
        </span>
        {/* --- Product Infos --- */}
        
        <div
            className='pt-2'
        >
            <span
                className='w-max text-gray-400 text-sm hover:text-teal-600 
                    cursor-pointer flex items-center gap-1'
            >
                <Tag size={14} />
                <p
                    className='lowercase'
                >
                    {PRODUCTCATEGORIE}
                </p>
            </span>
            <h1
                className='text-sm text-teal-900'
            >
                {PRODUCTTITLE}
            </h1>
            <div
                className='text-sm text-green-600 font-semibold
                    flex items-center gap-1'
            >
                ●<span>({STOCK})</span> in stock
            </div>
            <span
                className='flex items-center gap-2'
            >
                <del
                    className='text-xs text-gray-400'
                >
                    123 Dh
                </del>
                <b
                    className='text-teal-600'
                >
                    {PRODUCTPRICE} Dh
                </b>
            </span>
            {/* --- Seller Infos --- */}
            {OWNER ? (
                <div
                    className='flex items-center gap-2'
                >
                    <div
                        className='relative flex-shrink-0 w-6 h-6 
                            rounded-full overflow-hidden'
                    >
                        <Image
                            src={OWNER.image}
                            alt=''
                            fill
                            className='object-cover'
                        />
                    </div>
                    <h1
                        className='text-sm text-teal-900'
                    >
                        {OWNER.name}
                    </h1>
                </div>
            ) : (
                <div
                    className='flex items-center gap-2'
                >
                    <div
                        className='relative flex-shrink-0 w-6 h-6'
                    >
                        <Image
                            src="/LOGO1.png"
                            alt=''
                            fill
                            className='object-contain'
                        />
                    </div>
                    <h1
                        className='text-sm text-teal-600'
                    >
                        Tijarex
                    </h1>
                </div>
            )}
        </div>
    </section>
  )
}
