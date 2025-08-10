"use client";
import React, { useRef } from 'react'
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProduct';
import { Fake_Products } from './FakeProducts';

export function BestSellingProducts() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
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
                overflow-x-auto scrollbar-hide gap-2'
        >
            {Fake_Products.map((product) => {
                return (
                    <BestSellingProductUI
                        key={product.id}
                        PRODUCTID={product.id}
                        PRODUCTIMAGE={product.image}
                        PRODUCTTITLE={product.name}
                        PRODUCTPRICE={product.price}
                        PRODUCTCATEGORIE={product.category}
                        OWNER={product?.owner}
                        STOCK={product.stock}
                    />
                )
            })}
        </div>
    </section>
  )
}
