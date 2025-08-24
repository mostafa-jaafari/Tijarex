"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Heart,
    Box, BarChart2, Eye,
    Flame,
    Store,
} from 'lucide-react';
import { ProductType } from '@/types/product';
import { useUserInfos } from '@/context/UserInfosContext';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';

// --- Helper Components for Badges ---


interface ProductCardProps {
    product: ProductType;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { userInfos } = useUserInfos();
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const HandleQuickView = () => {
        setProductID(product.id as string || "");
        setIsShowQuickViewProduct(true)
    }
    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + direction + product.product_images.length) % product.product_images.length);
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(prev => !prev);
    };
    
    const shortDescription = product.description?.length > 60 ? `${product.description.slice(0, 60)}...` : product.description;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="font-sans bg-white border border-gray-200 
                rounded-lg overflow-hidden group p-3 transition-all 
                duration-300 ease-in-out hover:shadow-xl hover:-translate-y-0.5"
        >
            {/* --- Product Image --- */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Link href={`/seller/products?p_id=${product.id}`} className="block w-full h-full">
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
                                src={product.product_images[currentImage]}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    </AnimatePresence>
                </Link>

                <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
                    {product.sales > 500 && (
                        <p
                            className='py-1 px-2 text-orange-400 rounded-full 
                            flex items-center gap-1 text-xs 
                            font-semibold bg-orange-900 shadow-sm'
                        >
                            <Flame 
                                size={16}
                                className='fill-current'
                            />
                                Hot Seller
                        </p>
                    )}
                </div>
                
                <motion.button
                    onClick={toggleFavorite}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer backdrop-blur-sm bg-black/20 transition-colors duration-300 ${isFavorite ? 'text-red-500' : 'text-white'}`}
                >
                    <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>

                {product.product_images.length > 1 && (
                    <>
                        <AnimatePresence>
                            {isHovered && (
                                <>
                                    <motion.button 
                                        onClick={(e) => handleImageNavigation(e, -1)} 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: -10 }} 
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 
                                            p-2 bg-white/80 cursor-pointer text-gray-800 rounded-full
                                            shadow-md hover:bg-white"
                                    > <ArrowLeft 
                                        size={16}
                                    />
                                    </motion.button>
                                    <motion.button 
                                        onClick={(e) => handleImageNavigation(e, 1)} 
                                        initial={{ opacity: 0, x: 10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 10 }} 
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 
                                            p-2 bg-white/80 cursor-pointer text-gray-800 rounded-full
                                            shadow-md hover:bg-white"
                                    > <ArrowRight 
                                        size={16}
                                    />
                                    </motion.button>
                                </>
                            )}
                        </AnimatePresence>
                        <div 
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
                        >
                            {product.product_images.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 
                                        ${i === currentImage ?
                                            'w-5 bg-white'
                                            :
                                            'w-1.5 bg-white/60'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* --- Content Section --- */}
            <div className="pt-3 px-1">
                <h3 className="font-semibold text-neutral-800 truncate">
                    <Link href={`/seller/products?p_id=${product.id}`}>{product.name}</Link>
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-teal-600">{product.sale_price.toFixed(2)} {product.currency}</span>
                    {product.regular_price > product.sale_price && <span className="text-sm text-gray-400 line-through">{product.regular_price.toFixed(2)} {product.currency}</span>}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <BarChart2 size={16} className="text-gray-400" />
                        <div> <div className="font-semibold">{product.sales.toLocaleString()}</div> <div className="text-xs text-gray-400">Sales</div> </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Box size={16} className="text-gray-400" />
                        <div> <div className="font-semibold">{product.stock.toLocaleString()}</div> <div className="text-xs text-gray-400">Stock</div> </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Box size={16} className="text-gray-400" />
                        <div> <div className="font-semibold">{product.stock.toLocaleString()}</div> <div className="text-xs text-gray-400">Stock</div> </div>
                    </div> */}
                </div>

                {/* --- ACTION AREA (FIXED) --- */}
                {/* This wrapper div reserves the space for the buttons, preventing layout shift */}
                <div className="group-hover:mt-3 h-0 group-hover:h-[44px] transition-all duration-200">
                    <motion.div
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 5
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="flex items-center gap-2"
                    >
                        {userInfos?.UserRole === "affiliate" && (
                            <button className="w-full py-2.5 bg-gray-800 hover:bg-black text-white rounded-lg flex justify-center items-center gap-2 text-sm font-semibold transition-colors">
                                <Store size={16} /> Add to Store
                            </button>
                        )}
                        <button 
                            onClick={HandleQuickView}
                            className="grow flex justify-center p-2.5 bg-gray-100 hover:bg-gray-200 
                                text-gray-700 rounded-lg transition-colors">
                            <Eye size={16} />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};