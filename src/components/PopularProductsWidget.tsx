"use client";
import { 
    Eye, 
    Package, 
    ArrowUpRight, 
    ArrowDownRight, 
    TrendingUp,
    DollarSign,
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
            
            // Sort products by sales and take top 8
            const sortedProducts = data.products
                .sort((a: ProductType, b: ProductType) => b.sales - a.sales)
                .slice(0, 8)
                .map((product: ProductType, index: number) => ({
                    ...product,
                    rank: index + 1,
                    // Simulate growth percentage (in real app, this would come from API)
                    growth: Math.floor(Math.random() * 30) - 5, // Random between -5 and 25
                    isPositive: Math.random() > 0.3 // 70% chance of positive growth
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
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md";
        if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md";
        if (rank === 3) return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md";
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm";
    };

    const formatRevenue = (sales: number, price: number) => {
        const revenue = sales * price;
        if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
        if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}K`;
        return `$${revenue.toLocaleString()}`;
    };

    // Loading Skeleton
    const ProductSkeleton = () => (
        <div className="flex items-start gap-3 p-4 animate-pulse">
            <div className="flex-shrink-0 w-7 h-7 bg-gray-200 rounded-full"></div>
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="w-full max-w-[400px] py-4 pr-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Enhanced Header */}
                <div className="relative bg-teal-50 border-b border-gray-200">
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <TrendingUp className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Top Performing</h3>
                                <p className="text-sm text-gray-600">Best selling affiliate products</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => fetchProducts(true)}
                            disabled={refreshing}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    
                    {/* Stats Bar */}
                    <div className="px-5 pb-4">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                                <ArrowUpRight className="w-3 h-3" />
                                <span className="font-medium">+18%</span>
                                <span className="text-gray-500">vs last month</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))
                    ) : error ? (
                        <div className="p-6 text-center">
                            <div className="text-gray-400 mb-2">
                                <Package className="w-8 h-8 mx-auto" />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{error}</p>
                            <button
                                onClick={() => fetchProducts()}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        popularProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex items-start gap-3 p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                            >
                                {/* Enhanced Rank Badge */}
                                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadge(product.rank!)}`}>
                                    {product.rank === 1 && <span>👑</span>}
                                    {product.rank !== 1 && product.rank}
                                </div>

                                {/* Product Image with Hover Effect */}
                                <div className="flex-shrink-0 relative">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group-hover:shadow-md transition-shadow">
                                        <Image
                                            src={product.product_images?.[0] || "/api/placeholder/48/48" || ""}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/api/placeholder/48/48";
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Hot Badge for Top 3 */}
                                    {product.rank! <= 3 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <Zap className="w-2 h-2 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-gray-500">
                                                    {Array.isArray(product.category) ? product.category[0] : product.category}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs text-gray-500">4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Growth Indicator */}
                                        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                                            product.isPositive 
                                                ? 'text-green-700 bg-green-100' 
                                                : 'text-red-700 bg-red-100'
                                        }`}>
                                            {product.isPositive ? (
                                                <ArrowUpRight className="w-3 h-3" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3" />
                                            )}
                                            <span>{Math.abs(product.growth!)}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900">
                                                    {formatRevenue(product.sales, product.sale_price)}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <DollarSign className="w-3 h-3" />
                                                    <span>{product.commission || 10}%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{product.sales.toLocaleString()} sold</span>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    <span>234 affiliates</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Stock Badge */}
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStockBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Action */}
                                <Link 
                                    href={`/seller/products?p_id=${product.id}`}
                                    className="absolute inset-0 z-10"
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Enhanced Footer */}
                <div className="bg-gray-50 border-t border-gray-200">
                    <Link 
                        href="/seller/products"
                        className="w-full flex items-center justify-center 
                            gap-2 py-3 px-4 text-sm font-semibold 
                            text-teal-600 hover:text-teal-700 
                            hover:bg-teal-50 transition-all duration-200"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View All Products</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}