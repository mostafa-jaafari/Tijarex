import { ProductType2 } from '@/types/product';
import { ProductTableRow } from './ProductTableRow'; // Create this component

interface ProductsTableProps {
    products: ProductType2[];
    loading: boolean;
}

export const ProductsTable = ({ products, loading }: ProductsTableProps) => {
    // Add a skeleton loader for the table view
    if (loading) return <p>Loading table...</p>; 

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Product</th>
                            {/* ... other headers */}
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <ProductTableRow key={product.id} product={product} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};