"use client";

import { useState, useEffect, useMemo } from 'react';
import { OrderType } from '@/types/orders';

const PAGE_SIZE = 10; // How many orders to show per page

export const useOrders = () => {
    // --- Raw Data and Loading State ---
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Control State (for search, filters, sorting, etc.) ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
    const [sortBy, setSortBy] = useState('date_desc'); // Default sort
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/currentuserorders");
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (error) {
                console.error(error);
                setOrders([]); // Set to empty array on error to prevent crashes
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // --- Memoized Logic for Filtering and Sorting ---
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = [...orders];

        // 1. Filter by Search Query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(lowercasedQuery) ||
                order.seller.name.toLowerCase().includes(lowercasedQuery) ||
                order.product_name.toLowerCase().includes(lowercasedQuery)
            );
        }

        // 2. Filter by Selected Status (you can add more filter types here)
        if (selectedFilters.Status && selectedFilters.Status !== 'all') {
            filtered = filtered.filter(order => order.status === selectedFilters.Status);
        }

        // 3. Sort the results
        switch (sortBy) {
            case 'total_asc':
                filtered.sort((a, b) => a.total_mount - b.total_mount);
                break;
            case 'total_desc':
                filtered.sort((a, b) => b.total_mount - a.total_mount);
                break;
            case 'date_asc':
                filtered.sort((a, b) => new Date(a.ordred_in).getTime() - new Date(b.ordred_in).getTime());
                break;
            case 'date_desc':
            default:
                filtered.sort((a, b) => new Date(b.ordred_in).getTime() - new Date(a.ordred_in).getTime());
                break;
        }
        
        return filtered;
    }, [orders, searchQuery, selectedFilters, sortBy]);

    // --- Memoized Logic for Pagination ---
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredAndSortedOrders.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredAndSortedOrders, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedOrders.length / PAGE_SIZE);
    const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

    // --- Action Handlers to be called from the UI ---
    const handleFilterSelect = (title: string, item: string) => {
        setCurrentPage(1); // Reset to first page on any filter change
        setSelectedFilters(prev => ({ ...prev, [title]: item === 'all' ? '' : item }));
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
        setSearchQuery('');
        setCurrentPage(1);
    };
    
    // --- Return State and Actions for the page to use ---
    return {
        state: {
            loading,
            orders: paginatedOrders,
            totalCount: filteredAndSortedOrders.length,
            totalPages,
            currentPage,
            searchQuery,
            selectedFilters,
            sortBy,
            activeFilterCount,
        },
        actions: {
            setSearchQuery,
            handleFilterSelect,
            clearAllFilters,
            setSortBy,
            setCurrentPage,
        },
    };
};