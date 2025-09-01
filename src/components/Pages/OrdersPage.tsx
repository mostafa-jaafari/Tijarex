"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { OrderType } from '@/types/orders';
import { useOrders } from '@/components/useOrders'; 
import { OrdersControlsPanel } from '@/components/OrdersControlsPanel';
import { OrdersFilterPanel } from '@/components/OrdersFilterPanel';

// Reusable components you already have
import { ResultsBar } from '@/components/ResultsBar';
import { Pagination } from '@/components/UI/PaginationProps';
import { EmptyState } from '@/components/EmptyState';

// Helper function for status badge styling
const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Skeleton component for the table's loading state
const TableSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-200 rounded-full"></div><div><div className="h-4 bg-gray-200 rounded w-24"></div></div></div></td>
        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div></td>
        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-md"></div><div><div className="h-4 bg-gray-200 rounded w-32"></div></div></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div></td>
        <td className="px-6 py-4 text-center"><div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto"></div></td>
      </tr>
    ))
);

export default function OrdersPage() {
    const { state, actions } = useOrders();
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="w-full p-3 space-y-4">
            <div className="max-w-screen-2xl mx-auto">
                <OrdersControlsPanel
                    searchQuery={state.searchQuery}
                    onSearchChange={(e) => actions.setSearchQuery(e.target.value)}
                    onSearchClear={() => actions.setSearchQuery('')}
                    activeFilterCount={state.activeFilterCount}
                    onFilterToggle={() => setShowFilters(!showFilters)}
                />

                <AnimatePresence>
                    {showFilters && (
                        <OrdersFilterPanel
                            selectedFilters={state.selectedFilters}
                            onFilterSelect={actions.handleFilterSelect}
                            onClear={actions.clearAllFilters}
                        />
                    )}
                </AnimatePresence>

                <ResultsBar
                    resultCount={state.orders.length}
                    totalCount={state.totalCount}
                    sortBy={state.sortBy}
                    onSortChange={actions.setSortBy}
                />

                <main>
                    {state.totalCount === 0 && !state.loading ? (
                        <EmptyState onClear={actions.clearAllFilters} />
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['Order', 'Customer', 'Status', 'Product', 'Total', 'Date', 'Actions'].map(header => (
                                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {state.loading ? (
                                            <TableSkeleton />
                                        ) : (
                                            state.orders.map((order: OrderType) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-teal-600">#{order.id.slice(0, 7).toUpperCase()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <Image className="w-8 h-8 rounded-full object-cover" src={order.seller.profile_image} alt={order.seller.name} width={32} height={32} />
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{order.seller.name}</div>
                                                                <div className="text-xs text-gray-500">{order.seller.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <Image className="w-10 h-10 rounded-lg border border-gray-200 object-cover" src={order.product_image} alt={order.product_name} width={40} height={40}/>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{order.product_name}</div>
                                                                <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">${order.total_mount.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.ordred_in).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <MoreHorizontal size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
                
                <Pagination
                    currentPage={state.currentPage}
                    totalPages={state.totalPages}
                    onPageChange={actions.setCurrentPage}
                />
            </div>
        </div>
    );
}