"use client"
import React, { useRef, useEffect } from 'react';
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProductUI';
import { useGlobalProducts } from '@/context/GlobalProductsContext';
import { Loader2 } from 'lucide-react';

// A simple spinner component for loading more products
const LoadMoreSpinner = () => (
    <div className="flex-shrink-0 w-40 h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
    </div>
);

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    // Get the new state and functions from the context
    const { globalProductsData, isLoadingGlobalProducts, fetchMoreProducts, hasMore, isLoadingMore } = useGlobalProducts();
    
    // This useEffect handles drag-to-scroll
    useEffect(() => {
        // ... (your existing drag-to-scroll logic remains the same)
        const element = scrollRef.current;
        if (!element) return;
        let isDown = false, startX: number, scrollLeft: number;
        const onMouseDown = (e: MouseEvent) => { isDown = true; element.classList.add('cursor-grabbing'); startX = e.pageX - element.offsetLeft; scrollLeft = element.scrollLeft; };
        const onMouseLeaveOrUp = () => { isDown = false; element.classList.remove('cursor-grabbing'); };
        const onMouseMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - element.offsetLeft; const walk = (x - startX) * 2; element.scrollLeft = scrollLeft - walk; };
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('mouseleave', onMouseLeaveOrUp);
        element.addEventListener('mouseup', onMouseLeaveOrUp);
        element.addEventListener('mousemove', onMouseMove);
        return () => {
            element.removeEventListener('mousedown', onMouseDown);
            element.removeEventListener('mouseleave', onMouseLeaveOrUp);
            element.removeEventListener('mouseup', onMouseLeaveOrUp);
            element.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    // --- NEW: This useEffect handles infinite scroll ---
    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;
        
        const handleScroll = () => {
            // Check if user has scrolled to the end (with a 100px buffer)
            const isAtEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 100;
            if (isAtEnd && hasMore && !isLoadingMore) {
                fetchMoreProducts();
            }
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);

    }, [hasMore, isLoadingMore, fetchMoreProducts]);

    // No longer need to sort or slice here. The API and context handle it.
    const trendProducts = globalProductsData;

    return (
        <section id='best selling' className='scroll-mt-25'>
            <HeadlineSection
                TITLE="Best Selling Products"
                SHOWBUTTONS
                SCROLLREF={scrollRef}
            />

            <div
                ref={scrollRef}
                className='w-full flex items-center flex-nowrap 
                    overflow-x-auto hide-scrollbar gap-2 cursor-grab'
            >
                {isLoadingGlobalProducts ? (
                    Array(6).fill(0).map((_, idx) => (
                        <div key={idx} className='w-full max-w-[250px] min-h-40 rounded-xl space-y-2 flex-shrink-0'>
                            <div className='w-full h-60 bg-gray-300 animate-pulse'/>
                            <span className='block w-3/4 h-4 rounded-full bg-gray-200 animate-pulse' />
                            <span className='block w-1/2 h-4 rounded-full bg-gray-200 animate-pulse' />
                            <div className='flex items-center gap-2 pt-1'>
                                <span className='flex w-20 h-6 rounded-full bg-gray-200 animate-pulse' />
                                <span className='flex w-20 h-6 rounded-full bg-gray-200 animate-pulse' />
                            </div>
                        </div>
                    ))
                ) : (
                    trendProducts.map((product) => (
                        <BestSellingProductUI
                            key={product.id}
                            PRODUCTCATEGORY={product.category}
                            PRODUCTID={product.id}
                            PRODUCTIMAGES={product.product_images}
                            PRODUCTSALEPRICE={product.original_sale_price}
                            PRODUCTREGULARPRICE={product.original_regular_price}
                            PRODUCTTITLE={product.title}
                            STOCK={product.stock}
                            OWNER={product?.owner}
                        />
                    ))
                )}
                
                {/* --- NEW: Show spinner while loading the next page --- */}
                {isLoadingMore && <LoadMoreSpinner />}
            </div>
        </section>
    );
}