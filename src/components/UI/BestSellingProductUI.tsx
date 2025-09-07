"use client";
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flame, ShoppingBag, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

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
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const HandleQuickView = () => {
        setProductID(PRODUCTID as string || "");
        setIsShowQuickViewProduct(true)
    }
    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentImage((prev) => (prev + direction + (PRODUCTIMAGES?.length || 1)) % (PRODUCTIMAGES?.length || 1));
        };
    return (
        <section
            className='relative w-full max-w-[220px]
                overflow-hidden flex-shrink-0'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className='relative w-full h-[220px] overflow-hidden rounded-lg'
            >
                <AnimatePresence initial={false}>
                    <motion.div 
                        key={currentImage} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.3 }} 
                        className="absolute inset-0"
                    >
                        <Image 
                            onClick={HandleQuickView} 
                            src={PRODUCTIMAGES?.[currentImage] || '/placeholder-image.png'} 
                            alt="Product image" 
                            fill 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                            className="object-cover w-full h-full cursor-pointer"/>
                    </motion.div>
                </AnimatePresence>
                <div 
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 
                        backdrop-blur-sm bg-neutral-200 rounded-full 
                        p-0.5 flex gap-1`}>
                    {PRODUCTIMAGES.map((_, i) => (
                        <div 
                            key={i} 
                            onClick={() => setCurrentImage(i)} 
                            className={`h-2 cursor-pointer rounded-full transition-all 
                                duration-300 
                                ${i === currentImage ? 'w-5 bg-teal-600'
                                :
                                'w-2 bg-teal-600/40'}
                            `}
                        />
                    ))}
                </div>
                <AnimatePresence>
                    {isHovered && (<>
                        <motion.button onClick={(e) => handleImageNavigation(e, -1)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowLeft size={16} /> </motion.button>
                        <motion.button onClick={(e) => handleImageNavigation(e, 1)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowRight size={16} /> </motion.button>
                    </>)}
                </AnimatePresence>
            </div>
            {/* --- Trend Badge --- */}
            <span
                className='absolute z-20 top-2 right-2 bg-teal-700
                    rounded-lg p-1 text-white'
            >
                <Flame size={22}/>
            </span>
            {/* --- Product Infos --- */}
            <div className='mt-1'>
            {/* --- Category --- */}
                <Link
                    href={`/c/shop?cat=${PRODUCTCATEGORY}`}
                    className='mt-2 w-max text-teal-700 font-semibold 
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
                    className='font-semibold capitalize text-sm text-neutral-800 
                    cursor-pointer hover:text-neutral-600'
                >
                    {PRODUCTTITLE}
                </h1>

                <span
                    className='flex items-end gap-2'
                >
                    <b
                        className='text-teal-700'
                    >
                        {PRODUCTSALEPRICE} Dh
                    </b>
                    <del
                        className='text-sm text-neutral-500'
                        >
                        {PRODUCTREGULARPRICE} Dh
                    </del>
                </span>
                <button
                    className='flex items-center gap-2 cursor-pointer 
                        justify-center mt-2 bg-teal-700/90 rounded-lg 
                        w-full py-1.5 text-white text-sm hover:bg-teal-700'
                >
                    <ShoppingBag size={18}/> Add to Cart
                </button>
            </div>
        </section>
    )
}
