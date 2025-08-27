"use client";
import React, { useEffect, useRef, useState } from 'react'
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProductUI';
import { ProductType } from '@/types/product';

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [trendProducts, setTrendsProducts] = useState<ProductType[]>([]);
    const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleFetchTrendsProducts = async () => {
            setIsLoadingTrends(true);
            try {
                const Res = await fetch("/api/products");
                if (!Res.ok) throw new Error("Failed to fetch products");
                const { products } = await Res.json();
                if (Array.isArray(products)) {
                    setTrendsProducts(products);
                } else {
                    setTrendsProducts([]);
                }
            } catch (err) {
                console.error(err as string);
                setError(err as string || "Unknown error occurred");
            } finally {
                setIsLoadingTrends(false);
            }
        }

        handleFetchTrendsProducts();
    }, []);

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
            {isLoadingTrends && (
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
            {error && (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
            )}

            {/* Products list */}
            {!isLoadingTrends && !error && (
                <div
                    ref={scrollRef}
                    className='w-full flex items-center flex-nowrap 
                        overflow-x-auto scrollbar-hide gap-2'
                >
                    {trendProducts.map((product) => (
                        <BestSellingProductUI
                            key={product.id}
                            PRODUCTCATEGORIE={product.category}
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
