"use client";
import { useState } from 'react';
import { useProductFilters } from '@/components/useProductFilters';
import { ControlsPanel } from '@/components/ControlsPanel';
import { ProductFiltersPanel } from '@/components/ProductFiltersPanel';
import { ResultsBar } from '@/components/ResultsBar';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductsTable } from '@/components/ProductsTable';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/UI/PaginationProps';
import { toast } from 'sonner';
import { ProductType } from '@/types/product';
import { AddToStoreModal } from '@/components/AddToStoreModal';


export default function ProductsPage() {
    // The hook provides all the data and logic
    const { state, actions } = useProductFilters();
    const [showFilters, setShowFilters] = useState(false);
    
    const {
        loading, viewMode, paginatedProducts, filteredCount
    } = state;

    // --- New State for the Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const handleOpenAddToStore = (product: ProductType) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSubmitAddToStore = async (editedProduct: ProductType, commission: number) => {
        const loadingToast = toast.loading("Adding product to your store...");

        try {
            const response = await fetch('/api/affiliate/addproducttostore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: editedProduct, commission }),
            });

            if (response.status === 409) {
                // The product already exists
                toast.error('This product is already in your store.', { id: loadingToast });
                handleCloseModal();
                return; // Stop execution
            }
            
            if (!response.ok) {
                throw new Error('Failed to add product.');
            }

            toast.success('Product added successfully!', { id: loadingToast });
            handleCloseModal();

        } catch (error) {
            toast.error('Something went wrong. Please try again.', { id: loadingToast });
            console.error(error);
        }
    };

    return (
        <div className="w-full py-3 px-6">
            <div className="max-w-screen-2xl mx-auto">

                <ControlsPanel
                    searchQuery={state.searchQuery}
                    onSearchChange={(e) => actions.setSearchQuery(e.target.value)}
                    onSearchClear={() => actions.setSearchQuery('')}
                    activeFilterCount={state.activeFilterCount}
                    onFilterToggle={() => setShowFilters(!showFilters)}
                    viewMode={viewMode}
                    onViewModeChange={actions.setViewMode}
                    showFilters={showFilters}
                />

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
                    onSortChange={actions.setSortBy}
                />

                <main>
                    {filteredCount === 0 && !loading ? (
                        <EmptyState onClear={actions.clearAllFilters} />
                    ) : viewMode === 'grid' ? (
                        <ProductGrid 
                            products={paginatedProducts} 
                            loading={loading}
                            onAddToStore={handleOpenAddToStore}
                        />
                    ) : (
                        <ProductsTable 
                            products={paginatedProducts}
                            loading={loading}
                            onAddToStore={handleOpenAddToStore}
                        />
                    )}
                </main>
                
                <Pagination
                    currentPage={state.currentPage}
                    totalPages={state.totalPages}
                    onPageChange={actions.setCurrentPage}
                />
            </div>
            {/* Render the Modal */}
            <AddToStoreModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={handleCloseModal}
                onSubmit={handleSubmitAddToStore}
            />
        </div>
    );
}