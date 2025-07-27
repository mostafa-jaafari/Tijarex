"use client";

import { RightDashboardHeader } from "@/components/RightDashboardHeader";
import { 
    Search, 
    Plus, 
    Grid3X3, 
    List, 
    Edit2,
    Trash2,
    Eye,
    TrendingUp,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Sample products data
const productsData = [
    {
        id: "P001",
        name: "Wireless Headphones Pro",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
        price: 299.99,
        originalPrice: 349.99,
        stock: 45,
        status: "In Stock",
        sales: 1250,
        revenue: 374875,
        lastUpdated: "2024-01-15",
        rating: 4.8
    },
    {
        id: "P002",
        name: "Smart Watch Series X",
        category: "Wearables",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center",
        price: 199.99,
        originalPrice: 229.99,
        stock: 8,
        status: "Low Stock",
        sales: 890,
        revenue: 177991,
        lastUpdated: "2024-01-14",
        rating: 4.6
    },
    {
        id: "P003",
        name: "Gaming Mechanical Keyboard",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop&crop=center",
        price: 149.99,
        originalPrice: 149.99,
        stock: 0,
        status: "Out of Stock",
        sales: 680,
        revenue: 101993,
        lastUpdated: "2024-01-13",
        rating: 4.7
    },
    {
        id: "P004",
        name: "4K Webcam Ultra",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200&h=200&fit=crop&crop=center",
        price: 89.99,
        originalPrice: 99.99,
        stock: 23,
        status: "In Stock",
        sales: 520,
        revenue: 46795,
        lastUpdated: "2024-01-12",
        rating: 4.5
    },
    {
        id: "P005",
        name: "Bluetooth Speaker Mini",
        category: "Audio",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center",
        price: 59.99,
        originalPrice: 79.99,
        stock: 67,
        status: "In Stock",
        sales: 410,
        revenue: 24596,
        lastUpdated: "2024-01-11",
        rating: 4.3
    },
    {
        id: "P006",
        name: "USB-C Hub Pro",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1625842268584-8f3296705fc3?w=200&h=200&fit=crop&crop=center",
        price: 39.99,
        originalPrice: 49.99,
        stock: 156,
        status: "In Stock",
        sales: 789,
        revenue: 31556,
        lastUpdated: "2024-01-10",
        rating: 4.4
    }
];

const categories = ["All", "Electronics", "Wearables", "Gaming", "Audio", "Accessories"];
const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"];
const sortOptions = [
    { label: "Name A-Z", value: "name_asc" },
    { label: "Name Z-A", value: "name_desc" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Best Selling", value: "sales_desc" },
    { label: "Latest Added", value: "date_desc" }
];

export function ProductsPage() {
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStockStatus, setSelectedStockStatus] = useState("All");
    const [sortBy, setSortBy] = useState("name_asc");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Filter and sort products
    const filteredProducts = productsData
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesStock = selectedStockStatus === "All" || product.status === selectedStockStatus;
            return matchesSearch && matchesCategory && matchesStock;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "price_asc": return a.price - b.price;
                case "price_desc": return b.price - a.price;
                case "sales_desc": return b.sales - a.sales;
                case "date_desc": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                default: return 0;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const getStockBadge = (status: string) => {
        switch (status) {
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

    type Product = {
        id: string;
        name: string;
        category: string;
        image: string;
        price: number;
        originalPrice: number;
        stock: number;
        status: string;
        sales: number;
        revenue: number;
        lastUpdated: string;
        rating: number;
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group">
            {/* Product Image */}
            <div className="aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice !== product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                </div>

                <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStockBadge(product.status)}`}>
                    {product.status}
                </span>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{product.sales} sales</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>${(product.revenue / 1000).toFixed(1)}K</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex items-center px-6 py-2 justify-between border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <RightDashboardHeader />
            </div>

            {/* Search and Controls */}
            <div className="flex items-center justify-between space-x-4 p-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                    {/* Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                            showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-sm font-medium">Filters</span>
                    </button>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "grid" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "table" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="m-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                            <select
                                value={selectedStockStatus}
                                onChange={(e) => setSelectedStockStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {stockStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedStockStatus("All");
                                    setSearchQuery("");
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="px-6 flex items-center justify-between text-sm text-gray-600">
                <span>Showing {paginatedProducts.length} of {filteredProducts.length} products</span>
                <span>Page {currentPage} of {totalPages}</span>
            </div>

            {/* Products Grid */}
            {viewMode === "grid" ? (
                <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                /* Products Table */
                <div className="mx-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">${product.price}</div>
                                        {product.originalPrice !== product.price && (
                                            <div className="text-xs text-gray-500 line-through">${product.originalPrice}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStockBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">{product.stock} units</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.sales.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.lastUpdated}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}