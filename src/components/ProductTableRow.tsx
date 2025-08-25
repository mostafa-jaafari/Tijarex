"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '@/types/product';
import { Heart, Eye, Star, TrendingUp, Copy } from 'lucide-react';
import { useUserInfos } from '@/context/UserInfosContext';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { getStockBadge } from './Functions/GetStockBadge';

interface ProductTableRowProps {
    product: ProductType;
}

export const ProductTableRow = ({ product }: ProductTableRowProps) => {
    const { userInfos } = useUserInfos();
    const { setIsShowQuickViewProduct, setProductID } = useQuickViewProduct();

    const HandleQuickView = () => {
        setProductID(product.id as string || "");
        setIsShowQuickViewProduct(true)
    }
    const [isFavorite, setIsFavorite] = useState(false);

    // const commissionRate = product.commission || 10;
    // const estimatedEarning = (product.sale_price * commissionRate) / 100;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click events if any
        setIsFavorite(prev => !prev);
        // In a real app, you would call a function passed via props:
        // onToggleFavorite(product.id);
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-150">
            {/* Product Cell */}
            <td className="text-start px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                    <Link href={`/seller/products?p_id=${product.id}`} className="flex-shrink-0">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden group">
                            <Image
                                src={product.product_images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                        <Link href={`/seller/products?p_id=${product.id}`} className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 hover:text-teal-600 transition-colors">
                            {product.name.length > 30 ? `${product.name.slice(0, 30)}...` : product.name}
                        </Link>
                        <div className="text-xs text-gray-500 mt-1">
                            ID: {product.id.length > 30 ? `${product.id.slice(0, 30)}...` : product.id}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            {/* In a real app, rating would come from product data */}
                            <span className="text-xs text-gray-600 font-medium">4.5 (234 reviews)</span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Category Cell */}
            <td className="text-center px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800">
                    {Array.isArray(product.category) ? product.category[0] : product.category}
                </div>
                {/* In a real app, this would come from product data */}
                <div className="text-xs text-gray-500 mt-1">Partner Seller</div>
            </td>

            {/* Price Cell */}
            <td className="text-center px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-800">
                    ${product.sale_price.toFixed(2)}
                </div>
                {product.regular_price > product.sale_price && (
                    <div className="text-xs text-gray-400 line-through">
                        ${product.regular_price.toFixed(2)}
                    </div>
                )}
            </td>

            {/* Commission Cell */}
            {userInfos?.UserRole === "seller" ? null : (
                <td className="text-center px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                        {/* {commissionRate}% */}
                        20%
                    </div>
                    <div className="text-xs text-gray-500">
                        {/* Earn ${estimatedEarning.toFixed(2)} */}
                        Earn $20
                    </div>
                </td>
            )}

            {/* Stock Cell */}
            <td className="text-center px-6 py-4 whitespace-nowrap">
                {getStockBadge(product.stock)}
                <div className="text-xs text-gray-500 mt-1.5">
                    {product.stock} units left
                </div>
            </td>

            {/* Performance Cell */}
            <td className="text-center px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {product.sales.toLocaleString()} sold
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    ${product.revenue >= 1000 ? `${product.revenue / 1000}K` : product.revenue >= 1000000 ? `${product.revenue / 1000000}M` : product.revenue} revenue
                </div>
            </td>

            {/* Actions Cell */}
            <td className="text-center px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                    {/* --- Add To Favorite --- */}
                    <button
                        onClick={handleFavoriteClick}
                        className={`p-2 cursor-pointer rounded-lg transition-colors 
                            ${isFavorite
                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label="Add to favorites"
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    {/* --- Quick View --- */}
                    <button 
                        onClick={HandleQuickView}
                        className="cursor-pointer p-2 text-gray-400 
                            hover:text-teal-600 hover:bg-teal-50 rounded-lg 
                            transition-colors" 
                            aria-label="Quick view">
                        <Eye className="w-4 h-4" />
                    </button>
                    {/* --- Copy Product Link --- */}
                    <button 
                        className="cursor-pointer p-2 text-gray-400 hover:text-green-600 
                            hover:bg-green-50 rounded-lg transition-colors" 
                        aria-label="Copy product link">
                        <Copy className="w-4 h-4" />
                    </button>
                    {userInfos?.UserRole !== "seller" && (
                        <button 
                            className={`ml-2 px-4 py-2 text-xs font-bold rounded-lg
                                bg-gradient-to-r text-white 
                                from-[#1A1A1A] via-neutral-900 to-[#1A1A1A] 
                                hover:from-gray-500 cursor-pointer
                                ring ring-neutral-200
                                transition-colors`}>
                            Promote
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};