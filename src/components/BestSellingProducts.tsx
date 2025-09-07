"use client"
import React, { useRef, useEffect } from 'react'; // Import useEffect
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProductUI';
import { useGlobalProducts } from '@/context/GlobalProductsContext';

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { globalProductsData, isLoadingGlobalProducts } = useGlobalProducts();
    
    // --- FIX: Added useEffect to handle drag-to-scroll functionality ---
    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        const onMouseDown = (e: MouseEvent) => {
            isDown = true;
            element.classList.add('cursor-grabbing'); // Change cursor to show dragging is active
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        };

        const onMouseLeaveOrUp = () => {
            isDown = false;
            element.classList.remove('cursor-grabbing');
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault(); // Prevent text selection while dragging
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2; // The multiplier makes scrolling faster
            element.scrollLeft = scrollLeft - walk;
        };
        
        // Add event listeners
        element.addEventListener('mousedown', onMouseDown);
        element.addEventListener('mouseleave', onMouseLeaveOrUp);
        element.addEventListener('mouseup', onMouseLeaveOrUp);
        element.addEventListener('mousemove', onMouseMove);

        // Cleanup function to remove listeners when the component unmounts
        return () => {
            element.removeEventListener('mousedown', onMouseDown);
            element.removeEventListener('mouseleave', onMouseLeaveOrUp);
            element.removeEventListener('mouseup', onMouseLeaveOrUp);
            element.removeEventListener('mousemove', onMouseMove);
        };
    }, [isLoadingGlobalProducts]); // Re-attach listeners if loading state changes

    const trendProducts = globalProductsData?.sort((a, b) => b.sales - a.sales).slice(0, 10) || [];

    return (
        <section id='best selling' className='scroll-mt-25'>
            <HeadlineSection
                TITLE="Best Selling Products"
                SHOWBUTTONS
                SCROLLREF={scrollRef}
            />

            <div
                ref={scrollRef}
                // Added cursor-grab to indicate it's draggable
                className='w-full flex items-center flex-nowrap 
                    overflow-x-auto hide-scrollbar gap-2 cursor-grab'
            >
                {isLoadingGlobalProducts ? (
                    Array(6).fill(0).map((_, idx) => (
                        // --- FIX: Removed incorrect ref from the skeleton ---
                        <div
                            key={idx}
                            className='w-full max-w-[250px] min-h-40 rounded-xl space-y-2 flex-shrink-0'
                        >
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
                    trendProducts.length > 0 && trendProducts.map((product) => (
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
            </div>
        </section>
    );
}