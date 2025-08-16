import { ShopInputSearch } from '@/components/ShopInputSearch';
import { BestSellingProductUI } from '@/components/UI/BestSellingProductUI';
import { ProductType } from '@/types/product';
import { Tag } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'


interface ShopPageProps{
    searchParams: {
        cat: string;
    };
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata>{
    const category = searchParams.cat || "categorie";
    return {
        title: `Shop | ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Browse products in ${category} category.`,
    };
}


async function getShopProducts(){
    const Res = await fetch(`http://localhost:3000/api/products`);
    const { products } = await Res.json();
    if(!Array.isArray(products)){
        return [];
    }
    return products;
}
export default async function page({ searchParams }: ShopPageProps) {
    const Products = await getShopProducts();

  return (
    <section
        className='w-full min-h-70 shrink-0 bg-white p-4 shadow-md 
            rounded-xl overflow-y-auto'
    >
            <ShopInputSearch />
            <div
                className='flex items-center gap-3 justify-center py-3'
            >
                {["sport", "books", "fashion", "electronics"].map((sug, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={`/shop?cat=${sug.toLowerCase().replace(" ", "")}`}
                        >
                            <span
                                className='text-sm bg-gray-100 ring ring-gray-200 
                                    rounded-full px-2 flex items-center gap-1
                                    hover:bg-gray-200'
                            >
                                <Tag size={12} /> {sug}
                            </span>
                        </Link>
                    )
                })}
            </div>

            {Products.length > 0 ? 
                (
                    <div
                        className='w-full grid grid-cols-4 gap-x-2 gap-y-6 py-6'
                    >
                        {Products.map((product: ProductType) => {
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
                )
                :
                (
                    <div>
                        Not Founded
                    </div>
                )
            }
    </section>
  )
}
