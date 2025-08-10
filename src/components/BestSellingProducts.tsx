"use client";
import React from 'react'
import { HeadlineSection } from './HeadlineSection';
import { BestSellingProductUI } from './UI/BestSellingProduct';
import { Fake_Products } from './FakeProducts';

export function BestSellingProducts() {
  return (
    <section>
        <HeadlineSection
            TITLE="Best Selling Products"
            SHOWBUTTONS
        />
        <div
            className='w-full flex items-center flex-nowrap 
                overflow-x-scroll gap-2'
        >
            {Fake_Products.map((product) => {
                return (
                    <BestSellingProductUI
                        key={product.id}
                        PRODUCTID={product.id}
                        PRODUCTIMAGE={product.image}
                        PRODUCTTITLE={product.description}
                        PRODUCTPRICE={product.price}
                        PRODUCTCATEGORIE={product.category}
                    />
                )
            })}
        </div>
    </section>
  )
}
