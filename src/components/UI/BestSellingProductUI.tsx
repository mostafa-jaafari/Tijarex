"use client";
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { Flame, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface ProductCardProps{
    PRODUCTID: string;
    PRODUCTTITLE: string;
    PRODUCTIMAGES: string[];
    PRODUCTREGULARPRICE: number;
    PRODUCTSALEPRICE: number;
    PRODUCTCATEGORY: string;
    OWNER?: {email: string; image: string; name: string;};
    STOCK: number;
}
export function BestSellingProductUI({ PRODUCTID, PRODUCTTITLE, PRODUCTIMAGES, PRODUCTREGULARPRICE, PRODUCTSALEPRICE, PRODUCTCATEGORY }: ProductCardProps) {
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();
    const HandleQuickView = () => {
        setProductID(PRODUCTID as string || "");
        setIsShowQuickViewProduct(true)
    }
    return (
        <section
            className='relative w-full max-w-[250px] min-h-40 
                overflow-hidden flex-shrink-0'
        >
            <div
                className='relative w-full h-60 overflow-hidden rounded-lg'
            >
                <Image
                    src={PRODUCTIMAGES[0] || ""}
                    onClick={HandleQuickView}
                    alt=''
                    fill
                    loading='lazy'
                    className="object-cover hover:scale-105 cursor-pointer
                        transition-all duration-300"
                />
            </div>
            {/* --- Trend Badge --- */}
            <span
                className='absolute z-20 top-2 right-2 bg-black
                    rounded-lg p-1 text-white'
            >
                <Flame size={20}/>
            </span>
            {/* --- Product Infos --- */}
            
            {/* --- Category --- */}
            <Link
                href={`/c/shop?cat=${PRODUCTCATEGORY}`}
                className='mt-2 w-max text-purple-700 font-semibold 
                    text-xs hover:text-black/80 cursor-pointer 
                    capitalize flex items-center gap-1'
            >
                <Tag size={14} />
                <p>
                    {PRODUCTCATEGORY}
                </p>
            </Link>
            <h1
                onClick={HandleQuickView}
                className='mb-1 font-semibold text-sm text-neutral-800 
                    cursor-pointer hover:text-neutral-600'
            >
                {PRODUCTTITLE}
            </h1>

            <span
                className='flex items-end gap-2'
            >
                <b
                    className='text-purple-700'
                >
                    {PRODUCTSALEPRICE} Dh
                </b>
                <del
                    className='text-sm text-neutral-500'
                >
                    {PRODUCTREGULARPRICE} Dh
                </del>
            </span>
        </section>
    )
}
