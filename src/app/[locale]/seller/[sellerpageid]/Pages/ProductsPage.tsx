"use client";
import { useState } from 'react';
import { useProductFilters } from '@/components/useProductFilters';
import { ControlsPanel } from '@/components/ControlsPanel';
import { ProductFiltersPanel } from '@/components/ProductFiltersPanel';
import { ActiveFilters } from '@/components/ActiveFilters';
import { ResultsBar } from '@/components/ResultsBar';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductsTable } from '@/components/ProductsTable';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/UI/PaginationProps';


export default function ProductsPage() {
    // The hook provides all the data and logic
    const { state, actions } = useProductFilters();
    const [showFilters, setShowFilters] = useState(false);
    
    const {
        loading, viewMode, paginatedProducts, filteredCount, hasActiveFilters
    } = state;

    return (
        <div className="w-full bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">

                <ControlsPanel
                    searchQuery={state.searchQuery}
                    onSearchChange={(e) => actions.setSearchQuery(e.target.value)}
                    onSearchClear={() => actions.setSearchQuery('')}
                    activeFilterCount={state.activeFilterCount}
                    onFilterToggle={() => setShowFilters(!showFilters)}
                    viewMode={viewMode}
                    onViewModeChange={actions.setViewMode}
                />

                {hasActiveFilters && (
                    <ActiveFilters 
                        selectedFilters={state.selectedFilters}
                        onClearFilter={actions.handleFilterSelect}
                        onClearAll={actions.clearAllFilters}
                    />
                )}

                {/* You would use Framer Motion here for smooth transitions */}
                {showFilters && (
                    <ProductFiltersPanel 
                        selectedFilters={state.selectedFilters}
                        onFilterSelect={actions.handleFilterSelect}
                        onClear={actions.clearAllFilters}
                    />
                )}

                <ResultsBar
                    resultCount={paginatedProducts.length}
                    totalCount={filteredCount}
                    sortBy={state.sortBy}
                    onSortChange={(e) => actions.setSortBy(e.target.value)}
                />

                <main>
                    {filteredCount === 0 && !loading ? (
                        <EmptyState onClear={actions.clearAllFilters} />
                    ) : viewMode === 'grid' ? (
                        <ProductGrid products={paginatedProducts} loading={loading} />
                    ) : (
                        <ProductsTable products={paginatedProducts} loading={loading} />
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