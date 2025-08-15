"use client";
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { ProductCardProps } from '@/types/product';
import { BadgeCheck, Eye, Flame, ShoppingCart, Tag } from 'lucide-react';
import Image from 'next/image';
import React from 'react'


export function BestSellingProductUI({ PRODUCTID, PRODUCTTITLE, PRODUCTIMAGES, PRODUCTREGULARPRICE, PRODUCTSALEPRICE, PRODUCTCATEGORIE, OWNER, STOCK }: ProductCardProps) {
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();
    const HandleQuickView = () => {
        setProductID(PRODUCTID as string || "");
        setIsShowQuickViewProduct(true)
    }
    return (
        <section
            className='group relative w-full max-w-[250px] min-h-40 rounded-xl 
                overflow-hidden flex-shrink-0'
        >
            <div
                className='relative w-full h-60 overflow-hidden'
            >
                <Image
                    src={PRODUCTIMAGES[0] || ""}
                    alt=''
                    fill
                    loading='lazy'
                    className="object-cover hover:scale-115 hover:rotate-5 
                        transition-all duration-300"
                />
                <div
                    className='translate-y-20 group-hover:translate-y-0 
                        absolute z-20 bottom-0 left-0 w-full 
                        bg-gradient-to-t from-black/80 py-3 to-transparent 
                        flex justify-center gap-1 px-3
                        transition-transform duration-300'
                >
                    <button
                        onClick={HandleQuickView}
                        className='w-full primary-button border-b-2 
                            border-neutral-500 text-sm rounded-xl 
                            py-2 flex justify-center
                            items-center gap-1 text-white font-semibold'
                    >
                        <Eye size={16}/> Quick view
                    </button>
                    <button
                        className='w-full bg-white hover:bg-gray-100 text-sm 
                            rounded-lg py-2 flex gap-1 justify-center
                            border-b-2 border-gray-500 cursor-pointer'
                    >
                        <ShoppingCart size={18}/> Add to Cart
                    </button>
                </div>
            </div>
            {/* --- Trend Badge --- */}
            <span
                className='absolute z-20 top-2 right-2 bg-black
                    rounded-lg p-1 text-white'
            >
                <Flame size={20}/>
            </span>
            {/* --- Product Infos --- */}
            
            <div
                className='pt-2'
            >
                <span
                    className='w-max text-gray-400 text-sm hover:text-black/80
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
                    className='text-sm'
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
                        {PRODUCTREGULARPRICE} Dh
                    </del>
                    <b
                        className='text-teal-700'
                    >
                        {PRODUCTSALEPRICE} Dh
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
                                src={OWNER.image || ""}
                                alt=''
                                fill
                                className='object-cover'
                            />
                        </div>
                        <h1
                            className='text-sm text-black/50 hover:text-black 
                                cursor-pointer flex items-center gap-1'
                        >
                            {OWNER.name} <BadgeCheck size={14}/>
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
                            className='text-sm text-teal-700 flex items-center gap-1'
                        >
                            Tijarex <BadgeCheck size={14}/>
                        </h1>
                    </div>
                )}
            </div>
        </section>
    )
}
