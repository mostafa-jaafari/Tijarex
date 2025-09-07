import { ShopFilter } from '@/components/ShopFilter';
import { ShopInputSearch } from '@/components/ShopInputSearch';
import { BestSellingProductUI } from '@/components/UI/BestSellingProductUI';
import { ProductType } from '@/types/product';
import { Tag } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'

interface ShopPageProps{
    searchParams: Promise<{
        cat?: string;
        pf?: string;
        pt?: string;
        sortby?: string;
    }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata>{
    const resolvedSearchParams = await searchParams;
    const category = resolvedSearchParams.cat || "categorie";
    return {
        title: `Shop | ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Browse products in ${category} category.`,
    };
}

async function getShopProducts(): Promise<ProductType[]>{
    try {
        const Res = await fetch(`http://localhost:3000/api/products`);
        if (!Res.ok) {
            throw new Error('Failed to fetch products');
        }
        const { products } = await Res.json();
        if(!Array.isArray(products)){
            return [];
        }
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function filterProducts(products: ProductType[], searchParams: {
    cat?: string;
    pf?: string;
    pt?: string;
    sortby?: string;
}): ProductType[] {
    
    let filteredProducts = [...products];
    if(!searchParams.pf && !searchParams.pt && !searchParams.cat && !searchParams.sortby){
        return [];
    }
    // Filter by category
    if (searchParams.cat) {
        filteredProducts = filteredProducts.filter((p) =>
            Array.isArray(p.category) && p.category.some((c) => c.toLowerCase() === searchParams.cat?.toLowerCase())
        );
    }

    // Filter by price range
    if (searchParams.pf || searchParams.pt) {
        const priceFrom = searchParams.pf ? parseFloat(searchParams.pf) : 0;
        const priceTo = searchParams.pt ? parseFloat(searchParams.pt) : Infinity;
        
        filteredProducts = filteredProducts.filter((p) => {
            const price = p.original_sale_price || p.original_regular_price;
            return price >= priceFrom && price <= priceTo;
        });
    }

    // Sort products
    if (searchParams.sortby) {
        filteredProducts.sort((a, b) => {
            switch (searchParams.sortby) {
                case 'price-low':
                    return (a.original_sale_price || a.original_regular_price) - (b.original_sale_price || b.original_regular_price);
                case 'price-high':
                    return (b.original_sale_price || b.original_regular_price) - (a.original_sale_price || a.original_regular_price);
                case 'name':
                    return (a.title || a.title).localeCompare(b.title || b.title);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });
    }

    return filteredProducts;
}

export default async function page({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;
    const Products: ProductType[] = await getShopProducts();
    const FiltredProducts = filterProducts(Products, resolvedSearchParams);
    const ReadedProducts = FiltredProducts.length === 0 ? Products : FiltredProducts;
    
    return (
        <section className="w-full flex flex-1 items-start">
            <aside className="sticky top-14 p-2 h-full">
                <ShopFilter />
            </aside>
            <div
                className='flex-1 w-full shrink-0 bg-white p-4 shadow-md 
                    rounded-xl overflow-y-auto ring ring-gray-200'
            >
                    <ShopInputSearch />
                    <div
                        className='flex items-center gap-3 justify-center py-3'
                    >
                        {["sports", "books", "fashion", "electronics"].map((sug, idx) => {
                            return (
                                <Link
                                    key={idx}
                                    href={`/c/shop?cat=${sug.toLowerCase().replace(" ", "")}`}
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

                    <div
                        className='w-full flex justify-between'
                    >
                        <span
                            className='text-sm text-gray-500'
                        >
                            Showing ({ReadedProducts.length}) Products
                        </span>
                        {(resolvedSearchParams.pf || resolvedSearchParams.pt || resolvedSearchParams.cat || resolvedSearchParams.sortby) && (
                            <Link 
                                href="/c/shop"
                                className='text-red-500 text-sm font-semibold'
                                >
                                Clear Filters
                            </Link>
                        )}
                    </div>
                    {ReadedProducts.length > 0 ? 
                        (
                            <div
                                className='w-full grid grid-cols-4 gap-x-2 gap-y-6 py-6'
                            >
                                {ReadedProducts.map((product: ProductType) => {
                                    return (
                                        <BestSellingProductUI
                                            key={product.id}
                                            PRODUCTCATEGORIE={product.category}
                                            PRODUCTID={product.id}
                                            PRODUCTIMAGES={product.product_images}
                                            PRODUCTSALEPRICE={product.original_sale_price}
                                            PRODUCTREGULARPRICE={product.original_regular_price}
                                            PRODUCTTITLE={product.title || product.title}
                                            STOCK={product.stock}
                                            OWNER={product.owner}
                                        />
                                    )
                                })}
                            </div>
                        )
                        :
                        (
                            <div
                                className='w-full min-h-40 flex items-center justify-center text-gray-500'
                            >
                                Not Founded
                            </div>
                        )
                    }
            </div>
        </section>
    )
}