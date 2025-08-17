"use client";
import { DropDownMenu } from "@/components/FilterOrders";
import { ProductType } from "@/types/product";
import { 
    Search, 
    Grid3X3, 
    List,
    Eye,
    TrendingUp,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Download,
    ArrowRight,
    ArrowLeft,
    ShoppingCart,
    Filter
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Fixed filter configuration for products
const productFilters = [
    {
        title: "Category",
        filters: ["All", "Electronics", "Clothing", "Home", "Books", "Sports", "Beauty"],
        icon: Filter
    },
    {
        title: "Stock Status",
        filters: ["All", "In Stock", "Low Stock", "Out of Stock"],
        icon: Filter
    },
    {
        title: "Price Range",
        filters: ["All", "Under $25", "$25-$50", "$50-$100", "Over $100"],
        icon: Filter
    },
    {
        title: "Sales Performance",
        filters: ["All", "Best Sellers", "Low Sales", "No Sales"],
        icon: Filter
    }
];
    
export function ProductsPage() {
    const t = useTranslations("productspage");
    const sortOptions = [
        { label: t("sortoptions.0"), value: "name_asc" },
        { label: t("sortoptions.1"), value: "name_desc" },
        { label: t("sortoptions.2"), value: "price_asc" },
        { label: t("sortoptions.3"), value: "price_desc" },
        { label: t("sortoptions.4"), value: "sales_desc" },
        { label: t("sortoptions.5"), value: "date_desc" }
    ];
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name_asc");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    const [allProducts, setProducts] = useState<ProductType[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({
        "Category": "All",
        "Stock Status": "All",
        "Price Range": "All",
        "Sales Performance": "All"
    });

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                setProducts(data.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Helper function to check price range
    const matchesPriceRange = (price: number, range: string): boolean => {
        switch (range) {
            case "Under $25": return price < 25;
            case "$25-$50": return price >= 25 && price <= 50;
            case "$50-$100": return price >= 50 && price <= 100;
            case "Over $100": return price > 100;
            default: return true;
        }
    };

    // Helper function to check sales performance
    const matchesSalesPerformance = (sales: number, performance: string): boolean => {
        switch (performance) {
            case "Best Sellers": return sales > 100;
            case "Low Sales": return sales > 0 && sales <= 100;
            case "No Sales": return sales === 0;
            default: return true;
        }
    };

    // Filter and sort products
    const filteredProducts = allProducts
        .filter(product => {
            // Search filter
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.map((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Category filter
            const matchesCategory = selectedFilters["Category"] === "All" || 
                product.category.map((cat) => cat.toLowerCase() === selectedFilters["Category"]);
            
            // Stock status filter
            const matchesStock = selectedFilters["Stock Status"] === "All" || 
                product.status === selectedFilters["Stock Status"];
            
            // Price range filter
            const matchesPrice = selectedFilters["Price Range"] === "All" || 
                matchesPriceRange(product.sale_price, selectedFilters["Price Range"]);
            
            // Sales performance filter
            const matchesSales = selectedFilters["Sales Performance"] === "All" || 
                matchesSalesPerformance(product.sales, selectedFilters["Sales Performance"]);
            
            return matchesSearch && matchesCategory && matchesStock && matchesPrice && matchesSales;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "price_asc": return a.sale_price - b.sale_price;
                case "price_desc": return b.sale_price - a.sale_price;
                case "sales_desc": return b.sales - a.sales;
                case "date_desc": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                default: return 0;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilters, searchQuery, sortBy]);

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

    const handleFilterSelect = (filterTitle: string, item: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterTitle]: item
        }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({
            "Category": "All",
            "Stock Status": "All",
            "Price Range": "All",
            "Sales Performance": "All"
        });
        setSearchQuery("");
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(selectedFilters).some(value => value !== "All") || searchQuery !== "";

    const ProductCard = ({ product }: { product: ProductType }) => {
        const [currentImage, setCurrentImage] = useState(0);

        const handlePrevImage = () => {
            setCurrentImage((prev) => (prev === 0 ? product.product_images.length - 1 : prev - 1));
        };

        const handleNextImage = () => {
            setCurrentImage((prev) => (prev === product.product_images.length - 1 ? 0 : prev + 1));
        };

        // Loading Skeleton
        if(loading){
            return (
                <section className="w-full h-max">
                    <div className="relative w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
                        <div className="relative w-full h-64 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                <div className="w-10 h-3 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
                            <div className="flex justify-between">
                                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-full h-9 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </section>
            )
        }

        return (
            <section className="relative mb-4 group w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {/* Product Image Section */}
                <div className="relative w-full h-64 overflow-hidden">
                    <Link href={`/seller/products?p_id=${product.id}`}>
                        <Image
                            src={product.product_images[currentImage]}
                            alt={product.name}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Navigation Arrows */}
                    {product.product_images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 transition"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition">
                        <button className="p-2 bg-white rounded-full shadow hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button className="flex items-center justify-center p-2 bg-blue-600 rounded-full shadow hover:bg-blue-700 text-white transition">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Pagination Dots */}
                    {product.product_images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {product.product_images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                        i === currentImage ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                                ></span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">{product.category}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">${product.sale_price}</span>
                        {product.regular_price !== product.sale_price && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.regular_price}
                            </span>
                        )}
                    </div>

                    <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStockBadge(
                            product.status
                        )}`}
                    >
                        {product.status}
                    </span>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span>{product.sales} sales</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-blue-500" />
                            <span>${(product.revenue / 1000).toFixed(1)}K</span>
                        </div>
                    </div>
                    <button className="w-full mt-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition">
                        Make Order
                    </button>
                </div>
            </section>
        );
    };

    return (
        <section className="w-full mt-6 space-y-4">
            {/* Search and Controls */}
            <div className="flex items-center justify-between gap-4 px-6">
                {/* Search Bar */}
                <div className="w-full max-w-1/2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={t("searchinputplaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 py-1 pr-4 
                            h-full border border-gray-200 rounded-xl 
                            focus:outline-none focus:ring-2
                            focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 cursor-pointer px-4 py-1.5 text-sm rounded-lg border transition-colors ${
                            showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="font-medium">{t("filterbtn")}</span>
                    </button>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-0.5 cursor-pointer border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map(option => (
                            <option 
                                key={option.value} 
                                value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                                viewMode === "grid" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
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
                <div className="px-6 space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {productFilters.map((filter, idx) => (
                            <DropDownMenu
                                key={idx}
                                BtnTitle={filter.title}
                                CLASSNAME="w-full"
                                List={filter.filters}
                                selectedItem={selectedFilters[filter.title] || "All"}
                                onSelect={(item) => handleFilterSelect(filter.title, item)}
                                variant="secondary"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="px-6 flex items-center justify-between text-sm text-gray-600">
                <span>Showing {paginatedProducts.length} of {filteredProducts.length} products</span>
                {/* <span>Page {currentPage} of {totalPages}</span> */}
            </div>

            {/* Products Grid/Table */}
            {loading ? (
                <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCard key={i} product={{} as ProductType} />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="px-6 text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                                {/* <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th> */}
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/seller/products?p_id=${product.id}`}>
                                                <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={product.product_images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">${product.sale_price}</div>
                                        {product.regular_price !== product.sale_price && (
                                            <div className="text-xs text-gray-500 line-through">${product.regular_price}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStockBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">{product.stock} units</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.sales.toLocaleString()}</td>
                                    {/* <td className="px-6 py-4 text-sm text-gray-600">{product.lastUpdated}</td> */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors">
                                                <ShoppingCart className="w-4 h-4" />
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
                <div className="px-6 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            
                            return (
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
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </section>
    );
}