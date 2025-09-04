"use client";
import { Copy, Eye, Flame, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import { HandleGetRefLink } from './Functions/GetAffiliateLink';
import { useUserInfos } from '@/context/UserInfosContext';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { useFirstAffiliateLink } from '@/context/FirstAffiliateLinkContext';
import { useTrendingProducts } from './Functions/useTrendingProducts';

interface WidgetCardProps {
    title?: string;
    stock?: number;
    sold?: number;
    saleprice?: number;
    regularprice?: number;
    productimage?: string;
    productid: string;
    UniqueUserId: string;
    userRole: string;
}

const WidgetCard = ({ title, stock, sold, saleprice, regularprice, productimage, productid, UniqueUserId, userRole }: WidgetCardProps) => {
    const { setProductID, setIsShowQuickViewProduct } = useQuickViewProduct();
    const { hasGottenFirstLink, markAsGotten } = useFirstAffiliateLink();
    
    const HandleShowQuickView = (productid: string) => {
        setProductID(productid as string || "");
        setIsShowQuickViewProduct(true);
    }

    return (
        <section
            className='w-full rounded-xl 
                bg-white border border-gray-200 p-1 flex flex-col 
                justify-end'
        >
            <div
                className='relative w-full h-36 bg-gray-100 
                    overflow-hidden shadow-sm rounded-lg mb-2'
            >
                <Image
                    onClick={() => HandleShowQuickView(productid)}
                    src={productimage || "/no-image.png"}
                    fill
                    alt='product image'
                    className='cursor-pointer object-cover'
                    loading='lazy'
                    quality={100}
                />
                <div
                    className='absolute top-2 left-2'
                >
                    <span
                        className='flex w-max rounded-lg shadow-sm p-1 bg-white'
                    >
                        <Flame size={20} className='text-orange-600 fill-orange-600'/>
                    </span>
                </div>
            </div>
            <div
                className='px-2'
            >
                <h1 
                    onClick={() => HandleShowQuickView(productid)}
                    className='cursor-pointer font-semibold text-sm text-neutral-800'
                >
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
            <div
                className='p-2'
            >
                {userRole === "affiliate" ? (
                <button 
                    onClick={() => HandleGetRefLink(productid as string, UniqueUserId, hasGottenFirstLink, markAsGotten)}
                    className={`bg-neutral-900 hover:bg-neutral-900/90 
                        rounded-lg text-sm text-neutral-100
                        w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                    Get Link <Copy size={16} />
                </button>
                )
            :
            (
                <button 
                    onClick={() => HandleShowQuickView(productid)}
                    className={`bg-neutral-900 hover:bg-neutral-900/90 
                        rounded-lg text-sm text-neutral-100
                        w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                    Quick View <Eye size={16} />
                </button>
            )}
            </div>
        </section>
    )
}

// Skeleton component for the WidgetCard
const WidgetCardSkeleton = () => {
    return (
        <div
            className='w-full rounded-xl 
                bg-white border border-gray-200 p-1 flex flex-col 
                justify-end animate-pulse'
        >
            {/* Image Skeleton */}
            <div
                className='w-full h-36 bg-gray-200 
                    rounded-lg mb-2'
            ></div>
            <div
                className='px-2 space-y-2'
            >
                {/* Title Skeleton */}
                <div className='h-4 bg-gray-200 rounded-md w-3/4'></div>
                {/* Stock/Sold Skeleton */}
                <div className='h-3 bg-gray-200 rounded-md w-1/2'></div>
                {/* Price Skeleton */}
                <div className='h-5 bg-gray-200 rounded-md w-1/3'></div>
            </div>
            <div
                className='p-2'
            >
                {/* Button Skeleton */}
                <div className='h-10 bg-gray-300 rounded-lg w-full'></div>
            </div>
        </div>
    )
}


export function TrendingProductsWidget() {
    const { trendingProducts, isLoading } = useTrendingProducts(2);
    const { userInfos } = useUserInfos();
    
    // Early return if userInfos is not available yet to prevent potential errors
    if (!userInfos) return null;
    
    return (
        <section
            className="w-full max-w-[500px] border-b h-full
                border-neutral-400/50 ring ring-neutral-200 bg-white
                rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] px-6 py-3"
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
                className='grow grid grid-cols-2 gap-3'
            >
                {isLoading ? (
                    // Use the new skeleton component
                    <>
                        <WidgetCardSkeleton />
                        <WidgetCardSkeleton />
                    </>
                ) : (
                    trendingProducts.map((product, idx) => (
                        <WidgetCard 
                            key={idx}
                            regularprice={product.original_regular_price}
                            saleprice={product.original_sale_price}
                            sold={product.sales}
                            stock={product.stock}
                            title={product.title}
                            productimage={product.product_images[0]}
                            productid={product.id}
                            UniqueUserId={userInfos?.uniqueuserid}
                            userRole={userInfos?.UserRole}
                        />
                    ))
                )}
            </div>
        </section>
    )
}