"use client";

import { Eye, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Image from "next/image";

export function PopularProductsWidget() {
    const popularProducts = [
        {
            id: "P001",
            name: "Wireless Headphones Pro",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=48&h=48&fit=crop&crop=center",
            sales: 1250,
            revenue: "$24,500",
            growth: 12,
            stock: "In Stock",
            isPositive: true
        },
        {
            id: "P002", 
            name: "Smart Watch Series X",
            category: "Wearables",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=48&h=48&fit=crop&crop=center",
            sales: 890,
            revenue: "$17,800",
            growth: 8,
            stock: "Low Stock",
            isPositive: true
        },
        {
            id: "P003",
            name: "Gaming Mechanical Keyboard",
            category: "Gaming",
            image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=48&h=48&fit=crop&crop=center",
            sales: 680,
            revenue: "$13,600",
            growth: -3,
            stock: "In Stock",
            isPositive: false
        },
        {
            id: "P004",
            name: "4K Webcam Ultra",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=48&h=48&fit=crop&crop=center",
            sales: 520,
            revenue: "$10,400",
            growth: 15,
            stock: "In Stock",
            isPositive: true
        },
        {
            id: "P005",
            name: "Bluetooth Speaker Mini",
            category: "Audio",
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=48&h=48&fit=crop&crop=center",
            sales: 410,
            revenue: "$8,200",
            growth: 5,
            stock: "Out of Stock",
            isPositive: true
        }
    ];

    const getStockBadge = (stock: string) => {
        switch (stock) {
            case "In Stock":
                return "bg-green-100 text-green-800 border-green-200";
            case "Low Stock":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Out of Stock":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                    <p className="text-sm text-gray-600">Best performing items</p>
                </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {popularProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        {/* Rank */}
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                        </div>

                        {/* Product Image */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        if (target.parentElement) {
                                            target.parentElement.innerHTML = `
                                                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <div class="w-5 h-5 text-gray-400">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                                        {product.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {product.category}
                                    </p>
                                </div>
                                <div className={`
                                    flex items-center space-x-1 text-xs font-medium
                                    ${product.isPositive ? 'text-green-600' : 'text-red-600'}
                                `}>
                                    {product.isPositive ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    <span>{product.growth}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {product.revenue}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {product.sales.toLocaleString()} sales
                                    </p>
                                </div>
                                <span className={`
                                    px-2 py-1 text-xs font-medium rounded border
                                    ${getStockBadge(product.stock)}
                                `}>
                                    {product.stock}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">
                <Eye className="w-4 h-4" />
                <span>View All Products</span>
            </button>
        </div>
    );
}