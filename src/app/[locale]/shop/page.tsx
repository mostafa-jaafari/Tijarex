import { parseReferralUrl } from '@/components/Functions/GenerateUniqueRefLink';
import { ShopFilter } from '@/components/ShopFilter';
import { ShopInputSearch } from '@/components/ShopInputSearch';
import { BestSellingProductUI } from '@/components/UI/BestSellingProductUI';
import { ProductType } from '@/types/product';
import { Tag, Info } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

interface ShopPageProps{
    searchParams: Promise<{
        cat?: string;
        pf?: string;
        pt?: string;
        sortby?: string;
        ref?: string; // <-- ADDED: To catch the referral code
    }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata>{
    const resolvedSearchParams = await searchParams;
    const category = resolvedSearchParams.cat || "All Products";
    return {
        title: `Shop | ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Browse products in the ${category} category.`,
    };
}

async function getShopProducts(): Promise<ProductType[]>{
    try {
        // Ensure you are using the correct internal URL for your API route
        const Res = await fetch("/api/products");
        if (!Res.ok) throw new Error('Failed to fetch products');
        
        const { products } = await Res.json();
        return Array.isArray(products) ? products : [];
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
    const hasFilters = searchParams.cat || searchParams.pf || searchParams.pt || searchParams.sortby;

    // If no filters are applied, return the original full list
    if (!hasFilters) {
        return products;
    }

    // Filter by category
    if (searchParams.cat) {
        // This logic assumes `product.category` is a string. Adjust if it's an array.
        filteredProducts = filteredProducts.filter((p) => 
            p.category.toLowerCase() === searchParams.cat?.toLowerCase()
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
            const priceA = a.original_sale_price || a.original_regular_price;
            const priceB = b.original_sale_price || b.original_regular_price;
            switch (searchParams.sortby) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'name': return a.title.localeCompare(b.title);
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                default: return 0;
            }
        });
    }

    return filteredProducts;
}

export default async function page({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;
    
    // --- REFERRAL LOGIC ---
    const { ref: referralCode, ...filterParams } = resolvedSearchParams;
    const affiliateInfo = referralCode ? parseReferralUrl(referralCode) : null;
    // --- END REFERRAL LOGIC ---

    const allProducts: ProductType[] = await getShopProducts();
    const filteredProducts = filterProducts(allProducts, filterParams);
    
    const hasActiveFilters = Object.keys(filterParams).length > 0;
    
    return (
        <section className="w-full flex flex-1 items-start gap-4">
            <aside className="sticky top-14 p-2 h-full hidden md:block">
                <ShopFilter />
            </aside>
            <div
                className='flex-1 w-full shrink-0 bg-white p-4 shadow-md 
                    rounded-xl overflow-y-auto ring ring-gray-200'
            >
                {/* --- REFERRAL BANNER --- */}
                {affiliateInfo && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-200">
                        <Info className="h-5 w-5 flex-shrink-0" />
                        <span>
                            Welcome! You&apos;ve been referred by: <strong className="font-semibold">{affiliateInfo.affiliateId}</strong>
                        </span>
                    </div>
                )}
                {/* --- END REFERRAL BANNER --- */}

                <ShopInputSearch />
                <div className='flex items-center gap-3 justify-center py-3'>
                    {["sports", "books", "fashion", "electronics"].map((sug, idx) => (
                        <Link key={idx} href={`/shop?cat=${sug.toLowerCase().replace(" ", "")}`}>
                            <span className='text-sm bg-gray-100 ring ring-gray-200 rounded-full px-2 flex items-center gap-1 hover:bg-gray-200'>
                                <Tag size={12} /> {sug}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className='w-full flex justify-between items-center'>
                    <span className='text-sm text-gray-500'>
                        Showing {filteredProducts.length} of {allProducts.length} Products
                    </span>
                    {hasActiveFilters && (
                        <Link href="/shop" className='text-red-500 text-sm font-semibold hover:underline'>
                            Clear Filters
                        </Link>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6 py-6'>
                        {filteredProducts.map((product: ProductType) => (
                            <BestSellingProductUI
                                key={product.id}
                                PRODUCTCATEGORIE={product.category}
                                PRODUCTID={product.id}
                                PRODUCTIMAGES={product.product_images}
                                PRODUCTSALEPRICE={product.original_sale_price}
                                PRODUCTREGULARPRICE={product.original_regular_price}
                                PRODUCTTITLE={product.title}
                                STOCK={product.stock}
                                OWNER={product.owner}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='w-full min-h-40 flex items-center justify-center text-gray-500'>
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </section>
    )
}