"use client";
import { 
    Package, 
    ArrowUpRight, 
    ArrowDownRight, 
    TrendingUp,
    Star,
    Users,
    Zap,
    RefreshCw
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

interface PopularProduct extends ProductType {
    growth?: number;
    isPositive?: boolean;
    rank?: number;
}

export function PopularProductsWidget() {
    const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProducts = async (showRefreshing = false) => {
        try {
            if (showRefreshing) setRefreshing(true);
            setError(null);
            
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();
            
            const sortedProducts = data.products
                .sort((a: ProductType, b: ProductType) => b.sales - a.sales)
                .slice(0, 8)
                .map((product: ProductType, index: number) => ({
                    ...product,
                    rank: index + 1,
                    growth: Math.floor(Math.random() * 30) - 5,
                    isPositive: Math.random() > 0.3
                }));

            setPopularProducts(sortedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products");
        } finally {
            setLoading(false);
            if (showRefreshing) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getStockBadge = (stock: string) => {
        switch (stock) {
            case "In Stock":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Low Stock":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Out of Stock":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // --- UX ENHANCEMENT: Refined Rank Badge Colors ---
    // Changed the default badge from blue to a neutral gray to better match the theme.
    const getRankBadge = (rank: number) => {
        if (rank === 1) return "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg";
        if (rank === 2) return "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md";
        if (rank === 3) return "bg-gradient-to-br from-orange-500 to-yellow-600 text-white shadow-md";
        return "bg-gray-100 text-gray-600 border border-gray-200"; // More neutral for other ranks
    };

    // --- UI ENHANCEMENT: Updated Currency to Dh (Dirham) ---
    // Matches the currency shown in the dashboard header.
    const formatRevenue = (sales: number, price: number) => {
        const revenue = sales * price;
        if (revenue >= 1000000) return `${(revenue / 1000000).toFixed(1)}M Dh`;
        if (revenue >= 1000) return `${(revenue / 1000).toFixed(1)}K Dh`;
        return `${revenue.toLocaleString()} Dh`;
    };

    // --- UI ENHANCEMENT: Updated Skeleton to match new layout ---
    const ProductSkeleton = () => (
        <div className="flex items-start gap-4 p-4 animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="flex-shrink-0 w-14 h-14 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2 mt-1">
                <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-end justify-between pt-2">
                    <div className="space-y-1.5">
                        <div className="w-20 h-5 bg-gray-200 rounded"></div>
                        <div className="w-28 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="w-full max-w-md py-4 pr-4"> {/* Increased max-w for better spacing */}
            <div 
                className="bg-gradient-to-br from-10% from-white to-teal-50 border border-gray-200 
                    rounded-xl overflow-hidden">
                {/* Header remains largely the same, it's already well-designed */}
                <div className="bg-white border-b border-gray-200">
                     <div className="flex items-center justify-between px-5 py-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Top Performing</h3>
                                <p className="text-sm text-gray-500">Best selling affiliate products</p>
                            </div>
                        </div>
                        <button
                            onClick={() => fetchProducts(true)}
                            disabled={refreshing}
                            className="p-2 text-gray-500 rounded-full hover:text-teal-600 hover:bg-teal-50 transition-colors duration-200 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                     <div className="px-5 pb-4">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="font-semibold">+18%</span>
                                <span className="text-gray-500">vs last month</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="max-h-[28rem] overflow-y-auto divide-y divide-gray-100">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
                    ) : error ? (
                        <div className="p-8 text-center">
                            <div className="inline-block p-3 bg-red-50 rounded-full">
                                <Package className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-700">{error}</p>
                            <p className="mt-1 text-xs text-gray-500">There was an issue loading your product data.</p>
                            <button
                                onClick={() => fetchProducts()}
                                className="mt-4 px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 font-semibold hover:bg-teal-50 rounded-md transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        popularProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                            >
                                {/* --- UI ENHANCEMENT: Styled Rank Badge --- */}
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-shadow ${getRankBadge(product.rank!)}`}
                                >
                                    {product.rank === 1 ? <Zap className="w-4 h-4 text-white fill-white"/> : `#${product.rank}`}
                                </div>

                                {/* Product Image */}
                                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border group-hover:shadow-lg group-hover:border-teal-200 transition">
                                    <Image
                                        src={product.product_images?.[0] || "/api/placeholder/56/56"}
                                        alt={product.name}
                                        width={56}
                                        height={56}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    {/* --- UI ENHANCEMENT: Improved Info Layout & Hierarchy --- */}
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-800 truncate group-hover:text-teal-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{Array.isArray(product.category) ? product.category[0] : product.category}</span>
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                    4.5
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${product.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
                                        >
                                            {product.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {Math.abs(product.growth!)}%
                                        </span>
                                    </div>

                                    <div className="flex items-end justify-between mt-2.5">
                                        <div>
                                            {/* Revenue is now the most prominent metric */}
                                            <p className="text-base font-bold text-gray-900">
                                                {formatRevenue(product.sales, product.sale_price)}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span>{product.sales.toLocaleString()} sold</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> 234 affiliates
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5">
                                             <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStockBadge(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Link */}
                <div className="bg-gray-50/70 border-t border-gray-200">
                    <Link 
                        href="/seller/products"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors duration-200"
                    >
                        <span>View All Products</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}