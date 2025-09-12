"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    ArrowLeft, ArrowRight, Heart, Box, BarChart2, Flame, User, Eye, Store, 
    Copy, Trash2, AlertTriangle, Loader2 
} from 'lucide-react'; // Added Loader2
import { AffiliateProductType, ProductType } from '@/types/product';
import { useQuickViewProduct } from '@/context/QuickViewProductContext';
import { useParams } from 'next/navigation';
import { HandleGetRefLink } from '../Functions/GetAffiliateLink';
import { useUserInfos } from '@/context/UserInfosContext';
import { useFirstAffiliateLink } from '@/context/FirstAffiliateLinkContext';
import { toast } from 'sonner';
import { useAffiliateProducts } from '@/context/AffiliateProductsContext';

// --- Confirmation Modal Component (with isLoading prop) ---
interface ConfirmationModalProps {
    isOpen: boolean;
    isLoading: boolean; // New prop to handle loading state
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    productName: string;
}

const ConfirmationModal = ({ isOpen, isLoading, onClose, onConfirm, title, productName }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={!isLoading ? onClose : undefined} // Prevent closing on overlay click while loading
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4 text-left">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to remove &quot;<span className="font-medium">{productName}</span>&quot; from your collection? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        disabled={isLoading} // Disable button when loading
                        className="inline-flex w-full justify-center items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto disabled:bg-red-400 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading} // Disable button when loading
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- TYPE GUARD ---
export function isAffiliateProduct(product: ProductType | AffiliateProductType): product is AffiliateProductType {
    return 'AffiliateTitle' in product;
}

// Props for the Universal UI Component
type ProductCardUIProps = {
  product: ProductType | AffiliateProductType;
  isAffiliate: boolean;
  isFavorite?: boolean;
  onClaimClick: (p: ProductType | AffiliateProductType) => void;
  onFavoriteToggled?: (productId: string, isNowFavorite: boolean) => void;
};

export const ProductCardUI = ({
    product,
    isFavorite,
    isAffiliate,
    onClaimClick,
    onFavoriteToggled,
}: ProductCardUIProps) => {
    // --- State Management ---
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(false); // NEW: Loading state for deletion

    const [isFavorited, setIsFavorited] = useState(isFavorite);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    useEffect(() => {
        setIsFavorited(isFavorite);
    }, [isFavorite]);
     const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isTogglingFavorite) return;

        setIsTogglingFavorite(true);
        const originalIsFavorited = isFavorited;
        setIsFavorited(!originalIsFavorited);

        const productIdToToggle = isAffiliateProduct(product) ? product.originalProductId : product.id;

        try {
            const response = await fetch('/api/products/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: productIdToToggle }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update favorites.');
            }
            
            setIsFavorited(result.isFavorite);
            toast.success(result.isFavorite ? "Added to favorites!" : "Removed from favorites.");

            // --- ADD THIS BLOCK TO NOTIFY THE PARENT ---
            // If the callback function exists, call it with the result.
            if (onFavoriteToggled) {
                onFavoriteToggled(productIdToToggle, result.isFavorite);
            }
            // --- END OF ADDED BLOCK ---

        } catch (error) {
            setIsFavorited(originalIsFavorited);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const { userInfos } = useUserInfos();
    const { hasGottenFirstLink, markAsGotten } = useFirstAffiliateLink();
    const { refetchAffiliateProducts } = useAffiliateProducts();
    
    // --- Data Destructuring & Fallbacks ---
    const { product_images, currency, sales = 0, stock = 0 } = product;
    const title = isAffiliateProduct(product) ? product.AffiliateTitle : product.title;
    const salePrice = isAffiliateProduct(product) ? product.AffiliateSalePrice : product.original_sale_price;
    const regularPrice = isAffiliateProduct(product) ? product.AffiliateRegularPrice : product.original_regular_price;
    const SubPage = useParams().subpagesid;

    // --- Handlers ---
    const { setProductID, setIsShowQuickViewProduct } = useQuickViewProduct();
    const handleImageNavigation = (e: React.MouseEvent, direction: number) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + direction + (product_images?.length || 1)) % (product_images?.length || 1));
    };
    const HandleShowQuickView = () => {
        const viewId = isAffiliateProduct(product) ? product.id : product.id;
        setProductID(viewId);
        setIsShowQuickViewProduct(true);
    };
    const handleClaimClick = () => onClaimClick(product);
    
    // --- Main Deletion Logic ---
    const handleConfirmDelete = async () => {
        setIsDeleting(true); // Start loading
        const toastId = toast.loading("Deleting product from your collection...");
        try {
            const response = await fetch('/api/affiliate/remove-from-collection', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ affiliateProductId: product.id }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete product.');
            }
            toast.success('Product removed successfully!', { id: toastId });
            await refetchAffiliateProducts(); // Wait for refetch to complete
        } catch (error) {
            console.error('Failed to delete affiliate product:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsDeleting(false); // Stop loading
            setIsConfirmModalOpen(false); // Close modal
        }
    };

    return (
        <>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-white border-b border-neutral-400/50 ring shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden group p-1.5 transition-all ring-neutral-200 duration-300 ease-in-out hover:-translate-y-0.5"
            >
                {/* --- Image Section --- */}
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-purple-100 border border-gray-100">
                    <AnimatePresence initial={false}>
                        <motion.div key={currentImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                            <Image onClick={HandleShowQuickView} src={product_images?.[currentImage] || '/placeholder-image.png'} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover w-full h-full cursor-pointer"/>
                        </motion.div>
                    </AnimatePresence>
                    {sales > 500 && <p className='py-0.5 px-2 text-orange-400 rounded-full flex items-center gap-1 text-[12px] font-semibold bg-orange-900 shadow-sm absolute top-2 left-2'><Flame size={14} className='fill-current' /> Hot Seller</p>}
                    {SubPage !== "my-collection" && (
                        <motion.button
                            onClick={handleToggleFavorite}
                            disabled={isTogglingFavorite}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className={`absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer backdrop-blur-sm transition-colors duration-300 ${isFavorited ? 'bg-purple-600/80' : 'bg-black/20'} disabled:cursor-not-allowed`}
                        >
                            <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-white text-white' : ' text-white'}`} />
                        </motion.button>
                    )}
                    {(product_images?.length || 0) > 1 && (
                        <>
                            <AnimatePresence>
                                {isHovered && (<>
                                    <motion.button onClick={(e) => handleImageNavigation(e, -1)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowLeft size={16} /> </motion.button>
                                    <motion.button onClick={(e) => handleImageNavigation(e, 1)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer"> <ArrowRight size={16} /> </motion.button>
                                </>)}
                            </AnimatePresence>
                            <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-transparent rounded-full p-0.5 flex gap-1`}>
                                {product_images.map((_, i) => (<div key={i} onClick={() => setCurrentImage(i)} className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === currentImage ? 'w-5 bg-purple-600' : 'w-2 bg-purple-600/40'}`} />))}
                            </div>
                        </>
                    )}
                </div>

                {/* --- Content Section --- */}
                <div className="pt-3 px-1">
                    <h3 onClick={HandleShowQuickView} className="font-semibold cursor-pointer w-max text-neutral-700 truncate">{title}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-neutral-700">{(salePrice || 0).toFixed(2)} {currency}</span>
                        {(regularPrice || 0) > (salePrice || 0) && <span className="text-sm text-gray-400 line-through">{(regularPrice || 0).toFixed(2)} {currency}</span>}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-x-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><BarChart2 size={16} className="text-gray-400" /><div><div className="font-semibold">{sales.toLocaleString()}</div><div className="text-xs text-gray-400">Sales</div></div></div>
                        <div className="flex items-center gap-2"><User size={16} className="text-gray-400" /><div><div className="font-semibold">15</div><div className="text-xs text-gray-400">Affiliate</div></div></div>
                        <div className="flex items-center gap-2"><Box size={16} className="text-gray-400" /><div><div className="font-semibold">{stock.toLocaleString()}</div><div className="text-xs text-gray-400">Stock</div></div></div>
                    </div>
                    <div className="group-hover:mt-3 h-0 group-hover:h-[44px] transition-all duration-200">
                        <motion.div animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }} initial={{ opacity: 0, y: 5 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="flex items-center gap-2">
                            {isAffiliate && SubPage === "my-collection" ? (
                                <div className='w-full flex items-center gap-2'>
                                    <button onClick={() => HandleGetRefLink(product.id as string, userInfos?.uniqueuserid as string, hasGottenFirstLink, markAsGotten)} className={`bg-neutral-900 hover:bg-neutral-900/90 rounded-lg text-sm text-neutral-100 w-full flex items-center justify-center gap-2 py-2.5 cursor-pointer`}>Get Link <Copy size={16} /></button>
                                    <button onClick={() => setIsConfirmModalOpen(true)} className={`bg-red-700 hover:bg-red-800/90 rounded-lg text-sm text-neutral-100 p-2.5 cursor-pointer`}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (isAffiliate && SubPage === "products" || isAffiliate && SubPage === "favorites") ? (
                                <button onClick={handleClaimClick} className={`bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>Drop To Collection <Store size={16} /></button>
                            ) : !isAffiliate && (
                                <button onClick={HandleShowQuickView} className={`bg-neutral-900 hover:bg-neutral-900/90 rounded-lg text-sm text-neutral-100 w-full flex items-center justify-center gap-2 py-2 cursor-pointer`}>Quick View <Eye size={16} /></button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- Render Confirmation Modal --- */}
            <AnimatePresence>
                {isConfirmModalOpen && (
                    <ConfirmationModal
                        isOpen={isConfirmModalOpen}
                        isLoading={isDeleting}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Product"
                        productName={title}
                    />
                )}
            </AnimatePresence>
        </>
    );
};