import { ProductType } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: ProductType[];
    loading: boolean;
}

export const ProductCardSkeleton = () => (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};