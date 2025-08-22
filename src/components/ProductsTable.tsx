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
                    <thead className="bg-gray-50/75 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="w-[30%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                            <th scope="col" className="w-[12%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                            <th scope="col" className="w-[10%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                            <th scope="col" className="w-[12%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Commission</th>
                            <th scope="col" className="w-[12%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="w-[12%] text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                            <th scope="col" className="w-[12%] text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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