"use client";
import { Eye, Flame, SquareArrowOutUpRight, Store } from 'lucide-react'; // Added Store icon
import Image from 'next/image';
import { useUserInfos } from '@/context/UserInfosContext';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { useTrendingProducts } from './Functions/useTrendingProducts';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClaimProductFlow from './DropToCollectionsProducts/ClaimProductFlow';
import { ProductType } from '@/types/product'; // Import the global type

// --- Refactored WidgetCard to accept the full product object ---
interface WidgetCardProps {
    product: ProductType;
    userRole: string;
    UniqueUserId: string;
    onClaimClick: (product: ProductType) => void;
}

const WidgetCard = ({ product, userRole, onClaimClick }: WidgetCardProps) => {
    const { setProductID, setIsShowQuickViewProduct } = useQuickViewProduct();
    
    // Destructure properties from the product object for cleaner access
    const {
        id,
        title,
        stock = 0,
        sales = 0,
        original_sale_price: saleprice,
        original_regular_price: regularprice,
        product_images,
    } = product;
    
    const productimage = product_images?.[0];

    const HandleShowQuickView = (productId: string) => {
        setProductID(productId || "");
        setIsShowQuickViewProduct(true);
    }

    return (
        <section className='w-full rounded-xl bg-white border border-gray-200 p-1 flex flex-col justify-end'>
            <div className='relative w-full h-36 bg-gray-100 overflow-hidden shadow-sm rounded-lg mb-2'>
                <Image
                    onClick={() => HandleShowQuickView(id)}
                    src={productimage || "/no-image.png"}
                    fill
                    alt={title || 'product image'}
                    className='cursor-pointer object-cover'
                    loading='lazy'
                    quality={100}
                />
                <div className='absolute top-2 left-2'>
                    <span className='flex w-max rounded-lg shadow-sm p-1 bg-white'>
                        <Flame size={20} className='text-orange-600 fill-orange-600'/>
                    </span>
                </div>
            </div>
            <div className='px-2'>
                <h1 
                    onClick={() => HandleShowQuickView(id)}
                    className='cursor-pointer font-semibold text-sm text-neutral-800 truncate'
                >
                    {title}
                </h1>
                <p className='text-neutral-400 text-xs my-1'>
                    <span>{stock} Available |</span>{' '}
                    <span>{sales} Sold</span>
                </p>
                <span className='text-md font-semibold text-neutral-800'>
                    {saleprice?.toFixed(2)} Dh <del className='text-neutral-400 text-xs font-normal'>{regularprice?.toFixed(2)} Dh</del>
                </span>
            </div>
            <div className='p-2'>
                {userRole === "affiliate" ? (
                    // --- THIS IS THE UPDATED BUTTON LOGIC ---
                    <button 
                        onClick={() => onClaimClick(product)}
                        className={`bg-purple-600 hover:bg-purple-700 
                            rounded-lg text-sm text-white
                            w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>
                        Drop To Collection <Store size={16} />
                    </button>
                ) : (
                    <button 
                        onClick={() => HandleShowQuickView(id)}
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

// Skeleton component for the WidgetCard (no changes needed)
const WidgetCardSkeleton = () => {
    return (
        <div className='w-full rounded-xl bg-white border border-gray-200 p-1 flex flex-col justify-end animate-pulse'>
            <div className='w-full h-36 bg-gray-200 rounded-lg mb-2'></div>
            <div className='px-2 space-y-2'>
                <div className='h-4 bg-gray-200 rounded-md w-3/4'></div>
                <div className='h-3 bg-gray-200 rounded-md w-1/2'></div>
                <div className='h-5 bg-gray-200 rounded-md w-1/3'></div>
            </div>
            <div className='p-2'>
                <div className='h-10 bg-gray-300 rounded-lg w-full'></div>
            </div>
        </div>
    )
}

// --- The Main Widget Component ---
export function TrendingProductsWidget() {
    const { trendingProducts, isLoading } = useTrendingProducts(2);
    const { userInfos } = useUserInfos();
    
    // --- NEW: State to manage the claim modal ---
    const [productToClaim, setProductToClaim] = useState<ProductType | null>(null);

    // --- NEW: Handler to open the claim modal ---
    const handleClaimClick = (product: ProductType) => {
        setProductToClaim(product);
    };
    
    // Early return if userInfos is not available yet
    if (!userInfos) {
        // You can return a skeleton here as well for a smoother loading experience
        return (
            <section className="w-full max-w-[500px] border-b h-full border-neutral-400/50 ring ring-neutral-200 bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] px-6 py-3">
                <div className='h-8 bg-gray-200 rounded-md mb-3 w-1/2 animate-pulse'></div>
                <div className='grow grid grid-cols-2 gap-3'>
                    <WidgetCardSkeleton />
                    <WidgetCardSkeleton />
                </div>
            </section>
        );
    }
    
    return (
        <section className="w-full max-w-[500px] border-b h-full border-neutral-400/50 ring ring-neutral-200 bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] px-6 py-3">
            <div className='w-full flex items-start justify-between'>
                <h1 className='text-lg font-semibold text-gray-900 mb-3'>
                    Trending Products
                </h1>
                <span className='text-xs text-blue-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline'>
                    View All <SquareArrowOutUpRight size={14}/>
                </span>
            </div>
            <div className='grow grid grid-cols-2 gap-3'>
                {isLoading ? (
                    <>
                        <WidgetCardSkeleton />
                        <WidgetCardSkeleton />
                    </>
                ) : (
                    trendingProducts.map((product) => (
                        <WidgetCard 
                            key={product.id} // Use stable product ID
                            product={product} // Pass the full product object
                            UniqueUserId={userInfos.uniqueuserid}
                            userRole={userInfos.UserRole}
                            onClaimClick={handleClaimClick} // Pass the handler
                        />
                    ))
                )}
            </div>

            {/* --- NEW: Render the Claim Flow Modal --- */}
            <AnimatePresence>
                {productToClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setProductToClaim(null)}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <ClaimProductFlow 
                                sourceProduct={productToClaim}
                                onClose={() => setProductToClaim(null)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}