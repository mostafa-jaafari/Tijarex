"use client";

import { Zap } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Countdown } from './CountDown';
import Link from 'next/link';
import { useAffiliateAvailableProducts } from '@/context/AffiliateAvailableProductsContext';

// Reusable Loading Skeleton Component (no changes needed here)
const FeaturedProductsSkeleton = () => (
    <section className="w-full my-12 px-4 animate-pulse">
        <div className="text-left mb-8">
            <div className="h-7 w-48 bg-gray-200 rounded-md"></div>
            <div className="h-5 w-72 bg-gray-200 rounded-md mt-2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Skeleton */}
            <div className="lg:col-span-2 h-[380px] bg-gray-200 rounded-xl"></div>
            {/* Side Skeletons - Now shows three */}
            <div className="grid grid-cols-1 gap-8">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    </section>
);

export default function FeaturedProducts() {
    const { affiliateAvailableProductsData, isLoadingAffiliateAvailableProducts } = useAffiliateAvailableProducts();

    // Filter and sort products to find the best deals
    const featuredProducts = useMemo(() => {
        if (!affiliateAvailableProductsData) return [];

        const onSaleProducts = affiliateAvailableProductsData.filter(p =>
            p.original_sale_price && p.original_regular_price && p.original_sale_price < p.original_regular_price
        );

        return onSaleProducts
            .map(product => ({
                ...product,
                discount: ((product.original_regular_price - product.original_sale_price) / product.original_regular_price) * 100,
            }))
            .sort((a, b) => b.discount - a.discount)
            // --- FIX: Select 4 products (1 main + 3 side) ---
            .slice(0, 4); 

    }, [affiliateAvailableProductsData]);

    if (isLoadingAffiliateAvailableProducts) {
        return <FeaturedProductsSkeleton />;
    }

    // --- FIX: Destructure the 4 products correctly ---
    // The first becomes the main product, the rest (3) become the side products.
    const [mainProduct, ...otherProducts] = featuredProducts;

    if (!mainProduct) {
        return null; // Don't render if no suitable products are found
    }

    // Dynamic countdown for the main product
    const dealExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return (
        <section className="w-full my-12 px-4">
            <div className="text-left mb-8">
                <h2 className="font-semibold text-xl text-neutral-700">Deals of the Day</h2>
                <p className="text-sm text-neutral-500">Don&apos;t miss out on these limited-time offers!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Product Card - No changes to this section */}
                <Link
                    href={`/c/shop/product?pid=${mainProduct.id}`}
                    className="group lg:col-span-2 relative w-full min-h-[380px] rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg overflow-hidden p-8 flex flex-col md:flex-row items-center justify-between text-white"
                >
                    <div className="z-10 w-full md:w-1/2 space-y-4 text-center md:text-left">
                        <p className="font-semibold text-teal-100 flex items-center justify-center md:justify-start gap-2">
                            <Zap size={18} />
                            {mainProduct.category}
                        </p>
                        <h3 className="text-4xl lg:text-5xl font-extrabold uppercase drop-shadow-md">
                            {mainProduct.title}
                        </h3>
                        <p className="text-sm text-gray-200 max-w-sm line-clamp-2">
                            {mainProduct.description}
                        </p>
                        <div className="flex items-end gap-3 justify-center md:justify-start">
                            <span className="text-3xl font-bold text-white">
                                Dh{mainProduct.original_sale_price.toFixed(2)}
                            </span>
                            <del className="text-gray-300">Dh{mainProduct.original_regular_price.toFixed(2)}</del>
                        </div>
                        <div className="pt-4">
                            <Countdown
                                targetDate={dealExpires}
                                CONTAINERCLASSNAME="flex justify-center md:justify-start gap-3 items-center"
                                DAYTIMECLASSNAME="text-2xl font-bold"
                                HOURTIMECLASSNAME="text-2xl font-bold"
                                MINTIMECLASSNAME="text-2xl font-bold"
                                SECTIMECLASSNAME="text-2xl font-bold"
                                DAYLABELCLASSNAME="text-xs text-teal-200"
                                HOURLABELCLASSNAME="text-xs text-teal-200"
                                MINLABELCLASSNAME="text-xs text-teal-200"
                                SECLABELCLASSNAME="text-xs text-teal-200"
                                DAYLABEL="Days"
                                HOURLABEL="Hours"
                                MINLABEL="Minutes"
                                SECLABEL="Seconds"
                            />
                        </div>
                    </div>
                    <div className="relative w-full md:w-1/2 h-64 md:h-full mt-6 md:mt-0">
                        <Image
                            src={mainProduct.product_images[0] || '/placeholder.png'}
                            alt={mainProduct.title}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-in-out"
                        />
                    </div>
                </Link>

                {/* --- FIX: Other Product Cards - Now maps up to 3 cards --- */}
                <div className="grid grid-cols-1 gap-6">
                    {otherProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/c/shop/product?pid=${product.id}`}
                            className="bg-white rounded-xl overflow-hidden 
                                flex items-center group transition-all
                                border-b border-neutral-400 ring ring-neutral-200"
                        >
                            <div className="relative w-1/3 h-full flex-shrink-0">
                                <Image
                                    src={product.product_images[0] || '/placeholder.png'}
                                    alt={product.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="group-hover:scale-110 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                            <div className="p-4 flex-grow">
                                <p className="text-xs text-gray-500">{product.category}</p>

                                <h4 className="font-semibold text-gray-800 truncate">{product.title}</h4>
                                <div className="flex items-end gap-2 mt-2">
                                    <span className="font-bold text-teal-700">Dh{product.original_sale_price.toFixed(2)}</span>
                                    <del className="text-sm text-gray-400">Dh{product.original_regular_price.toFixed(2)}</del>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}