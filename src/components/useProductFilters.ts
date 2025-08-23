"use client";
import { useState, useEffect, useMemo } from 'react';
import { ProductType } from '@/types/product';

const ITEMS_PER_PAGE = 12;

// --- Helper functions for matching filter criteria ---
// These functions make the main filter logic much cleaner.

const matchesSearch = (product: ProductType, query: string): boolean => {
    if (!query) return true;
    const lowerCaseQuery = query.toLowerCase();

    // حول category دايمًا لمصفوفة
    const categories = Array.isArray(product.category)
        ? product.category
        : product.category
            ? [product.category] // لو string → مصفوفة
            : [];

    return (
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        categories.some(cat => cat.toLowerCase().includes(lowerCaseQuery))
    );
};

const matchesCategory = (product: ProductType, category: string | undefined): boolean => {
    if (!category) return true; // Pass if no category filter is set
    return product.category.includes(category);
};

const matchesStockStatus = (product: ProductType, status: string | undefined): boolean => {
    if (!status) return true; // Pass if no status filter is set
    return product.status === status;
};

const matchesPriceRange = (price: number, range: string | undefined): boolean => {
    if (!range) return true; // Pass if no price range filter is set
    switch (range) {
        case "Under $25": return price < 25;
        case "$25-$50": return price >= 25 && price <= 50;
        case "$50-$100": return price >= 50 && price <= 100;
        case "Over $100": return price > 100;
        default: return true;
    }
};


export const useProductFilters = () => {
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('sales_desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setAllProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        // This is the core filtering logic.
        // A product must pass EVERY condition to be included.
        return allProducts
            .filter(product => {
                const passSearch = matchesSearch(product, searchQuery);
                const passCategory = matchesCategory(product, selectedFilters["Category"]);
                const passStock = matchesStockStatus(product, selectedFilters["Stock Status"]);
                const passPrice = matchesPriceRange(product.sale_price, selectedFilters["Price Range"]);

                return passSearch && passCategory && passStock && passPrice;
            })
            .sort((a, b) => {
                // Sorting logic remains the same
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
    }, [allProducts, searchQuery, selectedFilters, sortBy]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    
    // REFINED HANDLER TO MANAGE FILTER STATE
    const handleFilterSelect = (filterTitle: string, item: string) => {
        setCurrentPage(1); // CRITICAL: Reset to page 1 on any filter change
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            // If user selects "All" or an empty value, we remove the filter key from the state object.
            if (item === "All" || !item) {
                delete newFilters[filterTitle];
            } else {
                // Otherwise, we set or update the filter.
                newFilters[filterTitle] = item;
            }
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
        setSearchQuery('');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.keys(selectedFilters).length;
    const hasActiveFilters = activeFilterCount > 0 || searchQuery !== '';

    return {
        state: {
            loading,
            viewMode,
            searchQuery,
            sortBy,
            currentPage,
            totalPages,
            paginatedProducts,
            filteredCount: filteredAndSortedProducts.length,
            selectedFilters,
            activeFilterCount,
            hasActiveFilters,
        },
        actions: {
            setViewMode,
            setSearchQuery,
            setSortBy,
            setCurrentPage,
            handleFilterSelect,
            clearAllFilters,
        },
    };
};