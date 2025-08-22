import { ProductType2 } from '@/types/product';
import { ProductTableRow } from './ProductTableRow'; // Create this component
import { useUserInfos } from '@/context/UserInfosContext';

interface ProductsTableProps {
    products: ProductType2[];
    loading: boolean;
}

export const ProductsTable = ({ products, loading }: ProductsTableProps) => {
    // Add a skeleton loader for the table view
    const { userInfos } = useUserInfos();
    if (loading) return <p>Loading table...</p>; 
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead 
                        className="bg-gradient-to-r from-[#1A1A1A] via-neutral-800 
                            to-[#1A1A1A] border-b border-gray-200">
                        <tr>
                            <th scope="col" className="w-[30%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Product</th>
                            <th scope="col" className="w-[12%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Category</th>
                            <th scope="col" className="w-[10%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Price</th>
                            {userInfos?.UserRole === "seller" ? null : (
                                <th scope="col" className="w-[12%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Commission</th>
                            )}
                            <th scope="col" className="w-[12%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="w-[12%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Performance</th>
                            <th scope="col" className="w-[12%] text-center px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
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