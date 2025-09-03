"use client";
import React, { useRef } from 'react'
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProductUI';
import { useGlobalProducts } from '@/context/GlobalProductsContext';

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { globalProductsData, isLoadingGlobalProducts } = useGlobalProducts();
    
    const trendProducts = globalProductsData.sort((a, b) => b.sales - a.sales).slice(0, 10); // Top 10 best selling products
    return (
        <section
            id='best selling'
            className='scroll-mt-25'
        >
            <HeadlineSection
                TITLE="Best Selling Products"
                SHOWBUTTONS
                SCROLLREF={scrollRef}
            />

            {/* Loading / Error handling */}
            {isLoadingGlobalProducts && (
                <div
                    className='w-full flex items-center flex-nowrap 
                        overflow-x-auto scrollbar-hide gap-2'
                >
                    {Array(6).fill(0).map((_, idx) => {
                        return(
                            <div
                                key={idx}
                                className='w-full max-w-[250px] min-h-40 rounded-xl 
                                    space-y-2 flex-shrink-0 overflow-hidden'
                            >
                                <div className='w-full h-60 bg-gray-300 animate-pulse'/>
                                <span className='flex w-30 h-4 rounded-full bg-gray-200 animate-pulse' />
                                <span className='flex w-50 h-4 rounded-full bg-gray-200 animate-pulse' />
                                <div
                                    className='flex items-center gap-2'
                                >
                                    <span className='flex w-20 h-6 rounded-full bg-gray-200 animate-pulse' />
                                    <span className='flex w-20 h-6 rounded-full bg-gray-200 animate-pulse' />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Products list */}
            {!isLoadingGlobalProducts && (
                <div
                    ref={scrollRef}
                    className='w-full flex items-center flex-nowrap 
                        overflow-x-auto scrollbar-hide gap-2'
                >
                    {trendProducts.map((product) => (
                        <BestSellingProductUI
                            key={product.id}
                            PRODUCTCATEGORY={product.category}
                            PRODUCTID={product.id}
                            PRODUCTIMAGES={product.product_images}
                            PRODUCTSALEPRICE={product.original_sale_price}
                            PRODUCTREGULARPRICE={product.original_regular_price}
                            PRODUCTTITLE={product.title}
                            STOCK={product.stock}
                            OWNER={product.owner}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
