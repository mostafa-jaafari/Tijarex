import React from 'react'
import { HeadlineSection } from './HeadlineSection'
import SummerCollectionProductUI from './UI/SummerCollectionProductUI'
import { Fake_Products } from './FakeProducts'

export default function BestSummerCollections() {
  return (
    <section
        className='w-full'
    >
        <HeadlineSection
            TITLE='Discover our best of summer 2025'
        />
        <div>
        
        <div
            className='w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'
        >
            {Fake_Products.slice(3, 8).map((product) => {
                return (
                <SummerCollectionProductUI
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
      </div>
    </section>
  )
}
