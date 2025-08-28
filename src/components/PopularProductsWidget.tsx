"use client";
import { useGlobaleProducts } from '@/context/GlobalProductsContext';
import { ProductType } from '@/types/product';
import { SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';

interface WidgetCardProps {
    title?: string;
    stock?: number;
    sold?: number;
    saleprice?: number;
    regularprice?: number;
    productimage?: string;
}
const WidgetCard = ({ title, stock, sold, saleprice, regularprice, productimage }: WidgetCardProps) => {
    return (
        <section
            className='w-full min-h-40 rounded-xl 
                bg-white border border-gray-200 p-1 flex flex-col 
                justify-end'
        >
            <div
                className='relative w-full h-30 bg-gray-100 
                    overflow-hidden shadow-sm rounded-lg mb-2'
            >
                <Image
                    src={productimage || "/no-image.png"}
                    fill
                    alt='product image'
                    className='object-cover'
                    loading='lazy'
                    quality={100}
                />
            </div>
            <div
                className='px-2'
            >
                <h1 className='font-semibold text-sm text-neutral-800'>
                    {title}
                </h1>
                <p
                    className='text-neutral-400 text-xs my-1'
                >
                    <span>
                        {stock} Available | 
                    </span> {' '}
                    <span>
                        {sold} Sold
                    </span>
                </p>
                <span className='text-md font-semibold text-neutral-800'>
                    {saleprice} Dh <del className='text-neutral-400 text-xs font-normal'>{regularprice} Dh</del>
                </span>
            </div>
        </section>
    )
}
export function PopularProductsWidget({ isFinishSetup }: { isFinishSetup: boolean; }) {
    const { globalProductsData, isLoadingGlobalProducts } = useGlobaleProducts();

    // const TrendingProducts = globalProductsData?.sort((a, b) => b.sales - a.sales).slice(0, 4) as ProductType[] || [];
    return (
        <section
            className={`bg-white border border-gray-200 rounded-xl p-4
                min-w-[400px] ${isFinishSetup ? "h-[510px]" : "h-[400px]"} overflow-auto`}
        >
            <div
                className='w-full flex items-start justify-between'
            >
                <h1 className='text-lg font-semibold text-gray-900 mb-3'>
                    Trending Products
                </h1>
                <span
                    className='text-xs text-blue-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline'
                >
                    View All <SquareArrowOutUpRight size={14}/>
                </span>
            </div>
            <div
                className='w-full grid grid-cols-2 gap-3'
            >
                {isLoadingGlobalProducts ? (
                    Array(4).fill(0).map((_, idx) => (
                        <div
                            key={idx}
                            className='w-full min-h-30 rounded-xl 
                                space-y-2 p-2 border border-gray-200 overflow-hidden flex flex-col justify-end'
                        >
                            <div className='w-full h-30 bg-gray-300 animate-pulse rounded-lg mb-2'/>
                            <span className='flex w-30 h-4 rounded-full bg-gray-200 animate-pulse' />
                            <span className='flex w-full h-4 rounded-full bg-gray-200 animate-pulse' />
                            <div
                                className='flex items-center gap-2'
                            >
                                <span className='flex w-20 h-4 rounded-full bg-gray-200 animate-pulse' />
                            </div>
                        </div>
                    ))
                ) : globalProductsData.length > 0 ? globalProductsData.map((product, idx) => (
                    <WidgetCard 
                        key={idx}
                        regularprice={product.original_regular_price}
                        saleprice={product.original_sale_price}
                        sold={product.sales}
                        stock={product.stock}
                        title={product.title}
                        productimage={product.product_images[0]}
                    />
                ))
                :
                <div
                    className='w-full flex justify-center my-6 text-sm text-neutral-500'
                >
                    No Products founded !
                </div>}
            </div>
        </section>
    )
}
