"use client";
import React, { useEffect, useRef, useState } from 'react'
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProductUI';
import { ProductType } from '@/types/product';

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [trendProducts, setTrendsProducts] = useState<ProductType[] | []>([]);
    useEffect(() => {
        const handleFetchTrendsProducts = async () => {
            const Res = await fetch("/api/products");
            const { products } = await Res.json();
            if (Array.isArray(products)) {
                const SelectedProduct = products.filter(
                    (product: ProductType) => product.isTrend);
                setTrendsProducts(SelectedProduct as ProductType[] | []);
            } else {
                setTrendsProducts([]);
            }
        }
        handleFetchTrendsProducts();
    },[])
    return (
    <section>
        <HeadlineSection
            TITLE="Best Selling Products"
            SHOWBUTTONS
            SCROLLREF={scrollRef}
        />
        <div
            ref={scrollRef}
            className='w-full flex items-center flex-nowrap 
                overflow-x-hidden scrollbar-hide gap-2'
        >
            {trendProducts.map((product) => {
                return (
                    <BestSellingProductUI
                        key={product.id}
                        PRODUCTCATEGORIE={product.category}
                        PRODUCTID={product.id}
                        PRODUCTIMAGES={product.product_images}
                        PRODUCTSALEPRICE={product.sale_price}
                        PRODUCTREGULARPRICE={product.regular_price}
                        PRODUCTTITLE={product.title}
                        STOCK={product.stock}
                        OWNER={product.owner}
                    />
                )
            })}
        </div>
    </section>
  )
}
