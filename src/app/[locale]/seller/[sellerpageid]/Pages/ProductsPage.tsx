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
    ArrowRight,
    ArrowLeft,
    ShoppingCart,
    Filter,
    Star,
    Heart,
    Share2,
    Users,
    Zap,
    X,
    RefreshCw
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Enhanced filter configuration for affiliate products
const productFilters = [
    {
        title: "Category",
        filters: ["All", "Electronics", "Clothing", "Home & Garden", "Books & Media", "Sports & Fitness", "Beauty & Health", "Automotive", "Toys & Games"],
        icon: Filter
    },
    {
        title: "Seller Type",
        filters: ["All", "Our Products", "Partner Sellers", "Premium Partners"],
        icon: Users
    },
    {
        title: "Stock Status",
        filters: ["All", "In Stock", "Low Stock", "Limited Edition", "Pre-Order"],
        icon: Filter
    },
    {
        title: "Price Range",
        filters: ["All", "Under $25", "$25-$50", "$50-$100", "$100-$250", "Over $250"],
        icon: Filter
    },
    {
        title: "Commission Rate",
        filters: ["All", "5-10%", "10-15%", "15-20%", "20%+"],
        icon: DollarSign
    },
    {
        title: "Performance",
        filters: ["All", "Hot Sellers", "Trending", "New Arrivals", "Best Commission"],
        icon: TrendingUp
    }
];

// Save filters to localStorage
const FILTERS_STORAGE_KEY = 'affiliate_product_filters';
    
export function ProductsPage() {
    const t = useTranslations("productspage");
    const sortOptions = [
        { label: t("sortoptions.0"), value: "name_asc" },
        { label: t("sortoptions.1"), value: "name_desc" },
        { label: t("sortoptions.2"), value: "price_asc" },
        { label: t("sortoptions.3"), value: "price_desc" },
        { label: t("sortoptions.4"), value: "commission_desc" },
        { label: t("sortoptions.5"), value: "sales_desc" },
        { label: t("sortoptions.6"), value: "date_desc" }
    ];
    
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name_asc");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Increased for better grid layout
    
    const [allProducts, setAllProducts] = useState<ProductType[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    
    // Load saved filters from localStorage
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    // Fall back to default if parsing fails
                }
            }
        }
        return {
            "Category": "All",
            "Seller Type": "All",
            "Stock Status": "All",
            "Price Range": "All",
            "Commission Rate": "All",
            "Performance": "All"
        };
    });

    // Save filters to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(selectedFilters));
        }
    }, [selectedFilters]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                setAllProducts(data.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Enhanced helper functions
    const matchesPriceRange = (price: number, range: string): boolean => {
        switch (range) {
            case "Under $25": return price < 25;
            case "$25-$50": return price >= 25 && price <= 50;
            case "$50-$100": return price >= 50 && price <= 100;
            case "$100-$250": return price >= 100 && price <= 250;
            case "Over $250": return price > 250;
            default: return true;
        }
    };

    const matchesCommissionRate = (commission: number, range: string): boolean => {
        switch (range) {
            case "5-10%": return commission >= 5 && commission < 10;
            case "10-15%": return commission >= 10 && commission < 15;
            case "15-20%": return commission >= 15 && commission < 20;
            case "20%+": return commission >= 20;
            default: return true;
        }
    };

    const matchesPerformance = (sales: number, performance: string): boolean => {
        switch (performance) {
            case "Hot Sellers": return sales > 500;
            case "Trending": return sales > 100 && sales <= 500;
            case "New Arrivals": return true; // Would check date in real implementation
            case "Best Commission": return true; // Would check commission rate
            default: return true;
        }
    };

    // Enhanced filter and sort logic
    const filteredProducts = allProducts
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.some((cat: string) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesCategory = selectedFilters["Category"] === "All" || 
                product.category.some((cat: string) => cat === selectedFilters["Category"]);
            
            const matchesStock = selectedFilters["Stock Status"] === "All" || 
                product.status === selectedFilters["Stock Status"];
            
            const matchesPrice = selectedFilters["Price Range"] === "All" || 
                matchesPriceRange(product.sale_price, selectedFilters["Price Range"]);
            
            const matchesCommission = selectedFilters["Commission Rate"] === "All" || 
                matchesCommissionRate(product.commission || 10, selectedFilters["Commission Rate"]);
            
            const matchesPerf = selectedFilters["Performance"] === "All" || 
                matchesPerformance(product.sales, selectedFilters["Performance"]);
            
            return matchesSearch && matchesCategory && matchesStock && matchesPrice && matchesCommission && matchesPerf;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "price_asc": return a.sale_price - b.sale_price;
                case "price_desc": return b.sale_price - a.sale_price;
                case "commission_desc": return (b.commission || 10) - (a.commission || 10);
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
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Low Stock":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Limited Edition":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "Pre-Order":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "Out of Stock":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const handleFilterSelect = (filterTitle: string, item: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterTitle]: item
        }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            "Category": "All",
            "Seller Type": "All",
            "Stock Status": "All",
            "Price Range": "All",
            "Commission Rate": "All",
            "Performance": "All"
        });
        setSearchQuery("");
    };

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const hasActiveFilters = Object.values(selectedFilters).some(value => value !== "All") || searchQuery !== "";
    const activeFilterCount = Object.values(selectedFilters).filter(value => value !== "All").length;

    // Enhanced Product Card Component
    const ProductCard = ({ product }: { product: ProductType }) => {
        const [currentImage, setCurrentImage] = useState(0);
        const [isHovered, setIsHovered] = useState(false);
        
        const handlePrevImage = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentImage((prev) => (prev === 0 ? product.product_images.length - 1 : prev - 1));
        };

        const handleNextImage = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentImage((prev) => (prev === product.product_images.length - 1 ? 0 : prev + 1));
        };

        const handleFavorite = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
        };

        if(loading){
            return (
                <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
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
                        <div className="w-20 h-5 bg-gray-200 rounded-lg"></div>
                        <div className="flex justify-between">
                            <div className="w-16 h-3 bg-gray-200 rounded"></div>
                            <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            )
        }

        const commissionRate = product.commission || 10;
        const estimatedEarning = (product.sale_price * commissionRate) / 100;

        return (
            <div 
                className="relative w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image Section */}
                <div className="relative w-full h-56 overflow-hidden bg-gray-50">
                    <Link href={`/seller/products?p_id=${product.id}`}>
                        <Image
                            src={product.product_images[currentImage]}
                            alt={product.name}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    {/* Overlay Elements */}
                    <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300`}></div>

                    {/* Top Actions */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        {/* Badges */}
                        <div className="flex flex-col gap-1">
                            {product.sales > 500 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg">
                                    <Zap className="w-3 h-3" />
                                    Hot
                                </span>
                            )}
                            {commissionRate >= 15 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg">
                                    <DollarSign className="w-3 h-3" />
                                    {commissionRate}%
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                            <button 
                                onClick={handleFavorite}
                                className={`p-2 rounded-lg shadow-md transition-all duration-200 ${
                                    favorites.has(product.id) 
                                        ? 'bg-red-500 text-white hover:bg-red-600' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 bg-white text-gray-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white text-gray-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {product.product_images.length > 1 && isHovered && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-90 rounded-lg shadow hover:bg-opacity-100 text-gray-700 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-white bg-opacity-90 rounded-lg shadow hover:bg-opacity-100 text-gray-700 transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* Image Indicators */}
                    {product.product_images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {product.product_images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentImage(i);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        i === currentImage ? "bg-white shadow-md" : "bg-white bg-opacity-50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="p-4 space-y-3">
                    {/* Product Name & Rating */}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight">
                            {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{Array.isArray(product.category) ? product.category[0] : product.category}</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">4.5</span>
                            </div>
                        </div>
                    </div>

                    {/* Price & Commission */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">${product.sale_price}</span>
                            {product.regular_price !== product.sale_price && (
                                <span className="text-sm text-gray-400 line-through">
                                    ${product.regular_price}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="w-3 h-3" />
                                <span>Earn ${estimatedEarning.toFixed(2)}</span>
                            </div>
                            <div className="text-gray-500">
                                {commissionRate}% commission
                            </div>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg border ${getStockBadge(product.status)}`}
                    >
                        {product.status}
                    </span>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span>{product.sales.toLocaleString()} sold</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-blue-500" />
                            <span>Partner</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Promote Product
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full p-2">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-300 rounded-lg">
                <div className="w-full px-6 py-3">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Products</h1>
                        <p className="text-gray-600 text-sm">
                            Discover and promote products from our marketplace and trusted partner sellers. 
                            Earn commissions on every successful referral.
                        </p>
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="w-full lg:max-w-md relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products, brands, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 ${
                                    showFilters 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
                                }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="font-medium">Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors"
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
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === "grid" 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === "table" 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters Panel */}
                {showFilters && (
                    <div className="w-full px-6 pb-6 space-y-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Filter Products</h3>
                            <div className="flex items-center gap-3">
                                {hasActiveFilters && (
                                    <span className="text-xs text-gray-500">
                                        {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                                    </span>
                                )}
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Clear All
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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
            </div>



            {/* Results Summary */}
            <div className="w-full px-6 py-3 mt-2 rounded-lg shadow-sm bg-white border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> of{' '}
                        <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                    </div>
                    <div className="text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full py-2">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <ProductCard key={i} product={{} as ProductType} />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-6">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No products found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We couldn&apos;t find any products matching your search criteria. 
                            Try adjusting your filters or search terms.
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* Enhanced Products Table */
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Commission</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paginatedProducts.map(product => {
                                        const commissionRate = product.commission || 10;
                                        const estimatedEarning = (product.sale_price * commissionRate) / 100;
                                        
                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Link href={`/seller/products?p_id=${product.id}`}>
                                                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={product.product_images[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </Link>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-semibold text-gray-900 text-sm line-clamp-2">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                ID: {product.id}
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-xs text-gray-600">4.5 (234)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {Array.isArray(product.category) ? product.category[0] : product.category}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Partner Seller
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ${product.sale_price}
                                                    </div>
                                                    {product.regular_price !== product.sale_price && (
                                                        <div className="text-xs text-gray-500 line-through">
                                                            ${product.regular_price}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-green-600">
                                                        {commissionRate}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Earn ${estimatedEarning.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg border ${getStockBadge(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {product.stock} units
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-900">
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                        {product.sales.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        ${(product.revenue / 1000).toFixed(1)}K revenue
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => toggleFavorite(product.id)}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                favorites.has(product.id)
                                                                    ? 'text-red-500 hover:bg-red-50'
                                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                            }`}
                                                        >
                                                            <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                                                            Promote
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <div className="w-full px-6 pb-6">
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 7) {
                                        page = i + 1;
                                    } else if (currentPage <= 4) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 3) {
                                        page = totalPages - 6 + i;
                                    } else {
                                        page = currentPage - 3 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Affiliate Info Banner */}
            <div className="w-full px-6 pb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Partner Marketplace
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                Our affiliate program features products from our in-house catalog and trusted partner sellers. 
                                All sellers are thoroughly vetted to ensure quality products and reliable fulfillment. 
                                Earn competitive commissions ranging from 5% to 25% on successful referrals.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Verified Sellers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Quality Guaranteed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Fast Payouts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}