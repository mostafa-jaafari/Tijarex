"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductType2 } from '@/types/product';
import { ArrowLeft, ArrowRight, Heart, Share2, ShoppingCart, Star, Zap, DollarSign, Users, TrendingUp } from 'lucide-react';
import { getStockBadge } from './Functions/GetStockBadge';

interface ProductCardProps {
    product: ProductType2;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    // This state should ideally be managed globally (Context, Zustand, Redux)
    // and passed down to the card. Here, it's local for demonstration.
    const [isFavorite, setIsFavorite] = useState(false); 

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(prev => !prev);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? product.product_images.length - 1 : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev === product.product_images.length - 1 ? 0 : prev + 1));
    };

    const commissionRate = product.commission || 10;
    const estimatedEarning = (product.sale_price * commissionRate) / 100;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
        >
            {/* --- Image Section --- */}
            <div className="relative w-full h-64 overflow-hidden">
                <Link href={`/seller/products?p_id=${product.id}`} className="block w-full h-full">
                    {/* Animated Image Switcher */}
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={product.product_images[currentImage]}
                                alt={product.name}
                                fill
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    </AnimatePresence>
                </Link>

                {/* --- Image Overlay & Actions --- */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Top-Right Actions (Favorite/Share) */}
                <div className="absolute top-3 right-3 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <motion.button
                        onClick={toggleFavorite}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2.5 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                            isFavorite
                                ? 'bg-red-500/80 text-white'
                                : 'bg-white/80 text-gray-700 hover:bg-white'
                        }`}
                        aria-label="Toggle favorite"
                     >
                         <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </motion.button>
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white/80 rounded-full backdrop-blur-sm text-gray-700 hover:bg-white transition-colors duration-300"
                        aria-label="Share product"
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Image Navigation */}
                {product.product_images.length > 1 && (
                    <>
                        <motion.button
                            onClick={handlePrevImage}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute top-1/2 left-3 transform -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white text-gray-800"
                            aria-label="Previous image"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            onClick={handleNextImage}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white text-gray-800"
                            aria-label="Next image"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.sales > 500 && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                            <Zap size={14} /> Hot
                        </span>
                    )}
                     {commissionRate >= 15 && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                           <DollarSign size={14} /> {commissionRate}%
                        </span>
                    )}
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.product_images.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImage(i); }}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentImage ? 'w-4 bg-white shadow' : 'w-2 bg-white/60'}`}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* --- Info Section --- */}
            <div className="relative p-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-500">{Array.isArray(product.category) ? product.category[0] : product.category}</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-700">4.5</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 h-12">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-gray-900">${product.sale_price.toFixed(2)}</span>
                        {product.regular_price > product.sale_price && (
                            <span className="text-sm text-gray-400 line-through">${product.regular_price.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                {/* --- Hover-reveal CTA & Info --- */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                               <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                                        <DollarSign size={14} />
                                        <span>Earn ${estimatedEarning.toFixed(2)}</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${getStockBadge(product.status)}`}>
                                        {product.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={14} className="text-gray-400" />
                                        <span>{product.sales.toLocaleString()} sold</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} className="text-gray-400" />
                                        <span>Partner</span>
                                    </div>
                                </div>
                                 <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
                                >
                                    <ShoppingCart size={16} />
                                    Promote Product
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};