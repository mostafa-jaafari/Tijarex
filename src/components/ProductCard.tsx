"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, ShoppingCart, Star, DollarSign, Users, TrendingUp, Flame } from 'lucide-react';
import { ProductType } from '@/types/product';


// Utility function for stock status badge styling
// const getStockBadge = (status: string) => {
//     switch (status.toLowerCase()) {
//         case 'in stock': return 'bg-green-100 text-green-800 border-green-200';
//         case 'low stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//         default: return 'bg-red-100 text-red-800 border-red-200';
//     }
// };

interface ProductCardProps {
    product: ProductType;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => {
            const next = prev + direction;
            if (next < 0) return product.product_images.length - 1;
            if (next >= product.product_images.length) return 0;
            return next;
        });
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(prev => !prev);
    };

    // Default commission rate of 10% if not specified in product data
    const commissionRate = 10;
    const estimatedEarning = (product.sale_price * commissionRate) / 100;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="font-sans bg-white border border-gray-200 
                rounded-lg hover:shadow-lg
                overflow-hidden group p-3 transition-all 
                duration-300 ease-in-out hover:-translate-y-1.5"
        >
            {/* --- Image Section --- */}
            <div 
                className="relative w-full aspect-[4/3] rounded-xl 
                    overflow-hidden">
                <Link href={`/seller/products?p_id=${product.id}`} className="block w-full h-full">
                    <AnimatePresence>
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                
                {/* --- Overlays & Actions --- */}
                
                {/* Badges (Inspired by "Best Seller" pill) */}
                <div 
                    className="absolute top-4 left-4 flex flex-col 
                    items-start gap-2"
                >
                    {product.isTrend && (
                        <div 
                            className="flex items-center gap-1 px-2 
                                py-1.5 bg-[#1A1A1A] backdrop-blur-sm
                                sm text-white text-xs font-semibold rounded-lg"
                        >
                            <TrendingUp 
                                size={14}
                            /> 
                            Trending
                        </div>
                    )}
                    {commissionRate >= 15 && (
                        <div 
                            className="flex items-center gap-1.5 px-3 
                                py-1.5 bg-teal-600/80 backdrop-blur-
                                sm text-white text-xs font-semibold rounded-full"
                        >
                            <DollarSign 
                                size={14}
                            /> 
                            {commissionRate}% Commission
                        </div>
                    )}
                </div>

                {/* Favorite Button (Inspired by circular icon) */}
                <motion.button
                    onClick={toggleFavorite}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-3 right-3 w-8 h-8 flex items-center 
                        justify-center rounded-lg cursor-pointer backdrop-blur-md 
                        transition-colors duration-300 
                        ${isFavorite ?
                            'bg-teal-600/80 text-white'
                            :
                            'bg-white/70 text-gray-800 hover:bg-white'}`}
                >
                    <Heart 
                        className={`w-5 h-5 transition-all 
                            ${isFavorite ? 'fill-current' : ''}`}
                    />
                </motion.button>

                {/* Image Navigation Arrows */}
                <AnimatePresence>
                    {isHovered && product.product_images.length > 1 && (
                        <>
                            <motion.button 
                                onClick={(e) => handleImageNavigation(e, -1)} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -10 }} 
                                className="absolute top-1/2 left-3 transform 
                                    -translate-y-1/2 p-2 bg-[#1A1A1A] text-white
                                    rounded-full shadow-md backdrop-blur-sm
                                    hover:text-[#1A1A1A] hover:bg-white cursor-pointer"
                            >
                                        <ArrowLeft 
                                            size={18}
                                        />
                            </motion.button>
                            <motion.button 
                                onClick={(e) => handleImageNavigation(e, 1)} 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="absolute top-1/2 right-3 transform 
                                    -translate-y-1/2 p-2 bg-[#1A1A1A] text-white
                                    rounded-full shadow-md backdrop-blur-sm
                                    hover:text-[#1A1A1A] hover:bg-white cursor-pointer"
                            >
                                        <ArrowRight 
                                            size={18}
                                        />
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.product_images.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`} />
                    ))}
                </div>
            </div>

            {/* --- Content Section --- */}
            <div className="pt-3 space-y-1">
                <div
                    className='flex gap-1 items-start justify-between'
                >
                    <h3 
                        className="text-wrap font-semibold text-neutral-800">
                        <Link 
                            href={`/seller/products?p_id=${product.id}`}
                        >
                            {product.name}
                        </Link>
                    </h3>
                    {product.sales > 500 && (
                        <div 
                            className="flex flex-shrink-0 items-center 
                                font-semibold text-orange-500 text-xs"
                        >
                            <Flame 
                                size={18}
                            />
                            Hot Seller
                        </div>
                    )}
                </div>

                {/* --- DYNAMIC CONTENT AREA --- */}
                {/* This container has a fixed height to prevent layout shift on hover */}
                <div className="relative h-[68px]"> 
                    {/* Default State: Price, Stats */}
                    <motion.div
                        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -10 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <div className="flex justify-between items-baseline">
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-teal-600">{product.sale_price.toFixed(2)} {product.currency}</span>
                                {product.regular_price > product.sale_price && <span className="text-sm text-gray-400 line-through">{product.regular_price.toFixed(2)} {product.currency}</span>}
                            </div>
                             <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-medium text-gray-600">{product.rating}</span>
                            </div>
                        </div>
                         <div className="flex justify-between text-xs text-gray-400 mt-3">
                            <div className="flex items-center gap-1.5"><TrendingUp size={14} /><span>{product.sales.toLocaleString()} sold</span></div>
                            <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                <span>{product.owner?.name || 'Partner'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hover State: Earning Info & CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute inset-0 flex flex-col items-center justify-between"
                    >
                        <div className="w-full flex justify-start items-end gap-1">
                            <p className="text-sm text-green-600">Est. Earning</p>
                            <p className="font-bold text-green-600">{estimatedEarning.toFixed(2)} {product.currency}</p>
                        </div>
                        <button 
                            className="w-full px-3 py-2 bg-gradient-to-r from-[#1A1A1A] 
                                via-neutral-800 to-[#1A1A1A] hover:from-black
                                hover:via-neutral-900 hover:to-black 
                                text-white rounded-lg flex justify-center items-center gap-2 
                                cursor-pointer text-sm transition-colors duration-300">
                            <ShoppingCart 
                                size={16}
                            />
                                Add to Store
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};