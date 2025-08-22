"use client";
import { useState, useEffect, useMemo } from 'react';
import { ProductType2 } from '@/types/product';

const ITEMS_PER_PAGE = 12;

export const useProductFilters = () => {
    const [allProducts, setAllProducts] = useState<ProductType2[]>([]);
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
                // In a real app, you'd fetch from your API
                const res = await fetch("/api/products"); 
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setAllProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setAllProducts([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        return allProducts
            .filter(product => {
                // Implement full filtering logic here based on `selectedFilters`
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                // ...etc
                return matchesSearch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "name_asc": return a.name.localeCompare(b.name);
                    case "name_desc": return b.name.localeCompare(a.name);
                    case "price_asc": return a.sale_price - b.sale_price;
                    case "price_desc": return b.sale_price - a.sale_price;
                    case "commission_desc": return (b.commission || 0) - (a.commission || 0);
                    case "sales_desc": return b.sales - a.sales;
                    case "date_desc": return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                    default: return 0;
                }
            });
    }, [allProducts, searchQuery, sortBy]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

    const handleFilterSelect = (filterTitle: string, item: string) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (item === "All" || !item) {
                delete newFilters[filterTitle];
            } else {
                newFilters[filterTitle] = item;
            }
            return newFilters;
        });
        setCurrentPage(1);
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