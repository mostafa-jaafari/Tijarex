"use client";

import { Search, PackageSearch, Box } from "lucide-react";
import { CustomDropdown } from "../UI/CustomDropdown";
import { ProductCardUI } from "../UI/ProductCardUI";
import { useUserInfos } from "@/context/UserInfosContext";
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductType } from "@/types/product";
import Link from "next/link";
import { toast } from "sonner";
// ⭐️ NOTE: This page should use a context that fetches the affiliate's *claimed* products,
// not the products *available* to be claimed. You'll need to create and swap this context.
import { useAffiliateAvailableProducts } from "@/context/AffiliateAvailableProductsContext";

// --- Reusable Components ---

const ProductCardSkeleton = () => (
    <div>
        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full h-6 bg-gray-200 rounded-md mt-3 animate-pulse" />
        <div className="w-1/2 h-6 bg-gray-200 rounded-md mt-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-200 rounded-md mt-3 animate-pulse" />
    </div>
);

// This modal is intended to edit affiliate-specific info.
// It will take the base ProductType and allow setting new affiliate values.
const EditAffiliateProductModal = ({ 
    product, 
    onClose,
    onSave,
}: { 
    product: ProductType; 
    onClose: () => void;
    onSave: (updates: { title: string, description: string, price: number }) => Promise<void>;
}) => {
    // ⭐️ FIX: Initialize with base product data as a starting point.
    const [title, setTitle] = useState<string>(product.title);
    const [description, setDescription] = useState<string>(product.description);
    const [price, setPrice] = useState<number>(product.original_sale_price);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (price <= product.original_sale_price) {
            toast.error("Your new price must be higher than the original product price.");
            return;
        }
        setIsSaving(true);
        await onSave({ title, description, price });
        setIsSaving(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-neutral-800">Edit Your Product Details</h2>
            <div>
                <label className="text-sm font-medium text-neutral-600">Your Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label className="text-sm font-medium text-neutral-600">Your Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={4} />
            </div>
            <div>
                <label className="text-sm font-medium text-neutral-600">Your Sale Price (Original: {product.original_sale_price.toFixed(2)} Dh)</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:bg-teal-300">
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function MyCollectionPage() {
    const { userInfos } = useUserInfos();
    // ⭐️ NOTE: This context fetches AVAILABLE products, not the user's collection.
    // This is a logical error. You need a new context like `useMyAffiliateCollection`.
    // For now, the code is fixed to work with the data from this context.
    const { affiliateAvailableProductsData, isLoadingAffiliateAvailableProducts, refetch } = useAffiliateAvailableProducts();

    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [sortBy, setSortBy] = useState('Newest');
    
    const categories = useMemo(() => {
        if (!affiliateAvailableProductsData) return ['All Categories'];
        const uniqueCategories = new Set<string>(affiliateAvailableProductsData.map(p => p.category));
        return ['All Categories', ...Array.from(uniqueCategories)];
    }, [affiliateAvailableProductsData]);

    // ⭐️ FIX: Removed 'Commission' sort option as it's not possible with the current data structure.
    const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'];

    useEffect(() => {
        if (!affiliateAvailableProductsData) {
            setFilteredProducts([]);
            return;
        }
        let products = [...affiliateAvailableProductsData];

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            // ⭐️ FIX: Search now works on the available fields in ProductType.
            products = products.filter(p =>
                p.title.toLowerCase().includes(lowercasedTerm) ||
                p.category.toLowerCase().includes(lowercasedTerm)
            );
        }
        if (selectedCategory !== 'All Categories') {
            products = products.filter(p => p.category === selectedCategory);
        }
        
        switch (sortBy) {
            // ⭐️ FIX: Sorting by price now uses the original_sale_price.
            case 'Price: Low to High':
                products.sort((a, b) => a.original_sale_price - b.original_sale_price);
                break;
            case 'Price: High to Low':
                products.sort((a, b) => b.original_sale_price - a.original_sale_price);
                break;
            case 'Newest':
            default:
                 // ⭐️ FIX: Correctly handles sorting by Firestore Timestamp.
                 products.sort((a, b) => {
                    const timeA = (a.AffiliateInfos?.AffiliateInfo?.AffiliateCreatedAt as FirebaseFirestore.Timestamp)?.toDate?.().getTime() || 0;
                    const timeB = (b.AffiliateInfos?.AffiliateInfo?.AffiliateCreatedAt as FirebaseFirestore.Timestamp)?.toDate?.().getTime() || 0;
                    return timeB - timeA;
                 });
                 break;
        }
        setFilteredProducts(products);
    }, [searchTerm, selectedCategory, sortBy, affiliateAvailableProductsData]);

    const handleSaveEdit = async (updates: { title: string, description: string, price: number }) => {
        if (!productToEdit) return;
        const toastId = toast.loading("Updating product...");

        try {
            // ⭐️ NOTE: This API endpoint needs to be created.
            // It should update the affiliate-specific information for a product.
            const response = await fetch('/api/affiliates/update-product', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // You'll need to decide how to identify the affiliate product to update.
                    // This might be the original product ID.
                    originalProductId: productToEdit.id,
                    ...updates
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update product.");
            }
            
            await refetch();
            toast.success("Product updated successfully!", { id: toastId });
            setProductToEdit(null);

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred.", { id: toastId });
        }
    };
    
    return (
        <section>
            {/* --- Header & Filters --- */}
            <div className="w-full flex justify-center">
                 <div className="group bg-white flex gap-3 items-center px-3 grow max-w-[600px] min-w-[400px] border-b border-neutral-400 ring ring-neutral-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg focus-within:ring-neutral-300">
                    <Search size={20} className="text-gray-400" />
                    <input type="text" placeholder="Search your collection by name, category..." className="grow rounded-lg outline-none focus:py-3 transition-all duration-300 py-2.5 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <CustomDropdown options={categories} selectedValue={selectedCategory} onSelect={setSelectedCategory} />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-nowrap text-sm text-gray-500">Sort by:</p>
                    <CustomDropdown options={sortOptions} selectedValue={sortBy} onSelect={setSortBy} />
                </div>
            </div>
            <hr className="w-full border-gray-200 my-4"/>

            {/* --- Products Grid --- */}
            <div className="w-full grid grid-cols-1 sm-grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {isLoadingAffiliateAvailableProducts ? (
                    Array(8).fill(0).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCardUI
                            key={product.id}
                            product={product}
                            isAffiliate={userInfos?.UserRole === "affiliate"}
                            // ⭐️ NOTE: This should probably be onEditClick, but depends on your ProductCardUI component
                            onClaimClick={() => setProductToEdit(product)}
                        />
                    ))
                ) : (
                    <div className="col-span-full w-full flex flex-col items-center justify-center py-20 bg-white border-b border-neutral-400 ring ring-neutral-200 rounded-xl">
                        <PackageSearch size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-bold text-neutral-700">Your Collection is Empty</h2>
                        <p className="text-gray-500 mt-2">Claim products from the marketplace to see them here.</p>
                        <div className='mt-6 flex justify-center gap-2 w-full'>
                            <Link href="/admin/affiliate/products" prefetch className="w-max inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-neutral-700 border-b border-neutral-800 text-neutral-100 ring ring-neutral-700 hover:bg-neutral-700/90">
                                <Box size={16} /> Discover Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            
            {/* --- Edit Modal --- */}
            <AnimatePresence>
                {productToEdit && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                        onClick={() => setProductToEdit(null)}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <EditAffiliateProductModal 
                                product={productToEdit}
                                onClose={() => setProductToEdit(null)}
                                onSave={handleSaveEdit}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}