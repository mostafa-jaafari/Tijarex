"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Box, BarChart2, Flame, User, Eye, Store, Copy } from 'lucide-react';
import { ProductType, AffiliateProductType } from '@/types/product';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { useParams } from 'next/navigation';
import { HandleGetRefLink } from '../Functions/GetAffiliateLink';
import { useUserInfos } from '@/context/UserInfosContext';
import { useFirstAffiliateLink } from '@/context/FirstAffiliateLinkContext';

// Type Guard to differentiate between the two product types
function isAffiliateProduct(product: ProductType | AffiliateProductType): product is AffiliateProductType {
    return (product as AffiliateProductType).AffiliateTitle !== undefined;
}

// Props for the Universal UI Component
interface ProductCardUIProps {
    product: ProductType | AffiliateProductType;
    isFavorite: boolean;
    isAffiliate: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onClaimClick: (product: ProductType) => void;
}

export const ProductCardUI = ({
    product,
    isFavorite,
    isAffiliate,
    onToggleFavorite,
    onClaimClick,
}: ProductCardUIProps) => {
    // UI-Specific State
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { userInfos } = useUserInfos();
    const { hasGottenFirstLink, markAsGotten } = useFirstAffiliateLink();
    // --- Data Normalization ---
    const title = isAffiliateProduct(product) ? product.AffiliateTitle : product.title;
    const salePrice = isAffiliateProduct(product) ? product.AffiliateSalePrice : product.original_sale_price;
    const regularPrice = isAffiliateProduct(product) ? product.AffiliateRegularPrice : product.original_regular_price;

    // --- FIX: Provide default fallbacks for optional numeric data ---
    // This prevents the 'toLocaleString of undefined' error.
    const sales = product.sales ?? 0;
    const stock = product.stock ?? 0;
    
    // Destructure common properties
    const { id, product_images, currency } = product;

    // --- Handlers ---
    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + direction + (product_images?.length || 1)) % (product_images?.length || 1));
    };

    const { setProductID, setIsShowQuickViewProduct } = useQuickViewProduct();
    const HandleShowQuickView = () => {
        setProductID(id || "");
        setIsShowQuickViewProduct(true);
    }

    const handleClaimClick = () => {
        // Ensure the data is always in the standard ProductType format for the modal
        if (isAffiliateProduct(product)) {
            const mappedProduct: ProductType = {
                id: product.id,
                title: product.AffiliateTitle,
                description: product.AffiliateDescription,
                original_sale_price: product.AffiliateSalePrice,
                original_regular_price: product.AffiliateRegularPrice,
                createdAt: product.AffiliateCreatedAt,
                category: product.category,
                product_images: product.product_images,
                stock: product.stock,
                sales: product.sales,
                currency: product.currency,
                sizes: product.sizes,
                colors: product.colors,
                owner: product.owner ?? undefined,
                lastUpdated: product.AffiliateCreatedAt,
                rating: 0,
                reviews: [],
                productrevenu: 0,
            };
            onClaimClick(mappedProduct);
        } else {
            onClaimClick(product);
        }
    };
    const SubPage = useParams().subpagesid;
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white border-b border-neutral-400/50 
                ring shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]
                rounded-lg overflow-hidden group p-1.5 transition-all 
                ring-neutral-200 duration-300 ease-in-out
                hover:-translate-y-0.5"
        >
            <div
                className='text-xs'
            >
            </div>
            {/* --- Image Section --- */}
            <div 
                className="relative w-full aspect-[4/3] rounded-lg 
                    overflow-hidden bg-purple-100 border border-gray-100">
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
                            onClick={HandleShowQuickView}
                            src={product_images?.[currentImage] || '/placeholder-image.png'}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover w-full h-full cursor-pointer"
                        />
                    </motion.div>
                </AnimatePresence>

                {sales > 500 && (
                    <p 
                        className='py-0.5 px-2 text-orange-400 rounded-full 
                            flex items-center gap-1 text-[12px] font-semibold
                            bg-orange-900 shadow-sm absolute top-2 left-2'>
                        <Flame size={14} className='fill-current' /> Hot Seller
                    </p>
                )}
                
                <motion.button
                    onClick={onToggleFavorite}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className={`absolute top-2 right-2 w-9 h-9 flex 
                        items-center justify-center rounded-full 
                        cursor-pointer backdrop-blur-sm
                        transition-colors duration-300 
                        ${isFavorite ? 'bg-purple-600/80' : 'bg-black/20'}`}
                >
                    <Heart className={`w-5 h-5 transition-all 
                            ${isFavorite ? 'fill-white text-white' : ' text-white'}`} />
                </motion.button>

                {(product_images?.length || 0) > 1 && (
                    <>
                        <AnimatePresence>
                           {isHovered && (
                                <>
                                    <motion.button onClick={(e) => handleImageNavigation(e, -1)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowLeft size={16} /> </motion.button>
                                    <motion.button onClick={(e) => handleImageNavigation(e, 1)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowRight size={16} /> </motion.button>
                                </>
                            )}
                        </AnimatePresence>
                        <div 
                            className={`absolute bottom-1 left-1/2 -translate-x-1/2 
                                backdrop-blur-sm bg-transparent rounded-full 
                                p-0.5 flex gap-1`}>
                            {product_images.map((_, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setCurrentImage(i)} 
                                    className={`h-2 cursor-pointer rounded-full 
                                        transition-all duration-300 
                                        ${i === currentImage ? 'w-5 bg-purple-600' : 'w-2 bg-purple-600/40'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* --- Content Section --- */}
            <div className="pt-3 px-1">
                <h3 
                    onClick={HandleShowQuickView}
                    className="font-semibold cursor-pointer w-max text-neutral-700 truncate"
                >
                    {title}
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-neutral-700">{(salePrice || 0).toFixed(2)} {currency}</span>
                    {(regularPrice || 0) > (salePrice || 0) && <span className="text-sm text-gray-400 line-through">{(regularPrice || 0).toFixed(2)} {currency}</span>}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><BarChart2 size={16} className="text-gray-400" /><div><div className="font-semibold">{sales.toLocaleString()}</div><div className="text-xs text-gray-400">Sales</div></div></div>
                    <div className="flex items-center gap-2"><User size={16} className="text-gray-400" /><div><div className="font-semibold">15</div><div className="text-xs text-gray-400">Affiliate</div></div></div>
                    <div className="flex items-center gap-2"><Box size={16} className="text-gray-400" /><div><div className="font-semibold">{stock.toLocaleString()}</div><div className="text-xs text-gray-400">Stock</div></div></div>
                </div>
                <div className="group-hover:mt-3 h-0 group-hover:h-[44px] transition-all duration-200">
                    <motion.div
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
                        initial={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="flex items-center gap-2"
                    >
                        {isAffiliate && SubPage === "my-collection" ? 
                        (
                            <button 
                                onClick={() => HandleGetRefLink(product.id as string, userInfos?.uniqueuserid as string, hasGottenFirstLink, markAsGotten)} 
                                className={`bg-neutral-900 hover:bg-neutral-900/90 
                                    rounded-lg text-sm text-neutral-100
                                    w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                                Get Link <Copy size={16} />
                            </button>
                        )
                        :
                        isAffiliate && SubPage === "products" ?
                        (
                            <button 
                                onClick={handleClaimClick}
                                className={`bg-purple-600 hover:bg-purple-700 
                                    rounded-lg text-sm text-white
                                    w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                                Drop To Collection <Store size={16} />
                            </button>
                        )
                        :
                        !isAffiliate &&
                        (
                            <button 
                                onClick={HandleShowQuickView}
                                className={`bg-neutral-900 hover:bg-neutral-900/90 
                                    rounded-lg text-sm text-neutral-100
                                    w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                                Quick View <Eye size={16} />
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};