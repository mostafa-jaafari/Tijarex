import { Flame } from 'lucide-react';
import Image from 'next/image';
import React from 'react'


interface BestSellingProductUIProps{
    PRODUCTIMAGE: string;
    PRODUCTID: string | number;
    PRODUCTTITLE: string;
    PRODUCTPRICE: number;
    PRODUCTCATEGORIE: string;
}
export function BestSellingProductUI({ PRODUCTIMAGE, PRODUCTID, PRODUCTCATEGORIE, PRODUCTPRICE , PRODUCTTITLE}: BestSellingProductUIProps) {

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
                quality={100}
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
            <h1
                className='text-sm text-teal-900'
            >
                {PRODUCTTITLE}
            </h1>
            <span
                className='flex items-center gap-2'
            >
                <del
                    className='text-xs text-gray-400'
                >
                    123 Dh
                </del>
                <b>
                    {PRODUCTPRICE} Dh
                </b>
                <p
                    className='text-gray-400 text-sm lowercase'
                    >
                    ● {PRODUCTCATEGORIE}
                </p>
            </span>
        </div>
    </section>
  )
}
