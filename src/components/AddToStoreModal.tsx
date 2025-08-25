"use client";

import { useState, useMemo } from 'react';
import { ProductType } from '@/types/product';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface AddToStoreModalProps {
    product: ProductType | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (editedProduct: ProductType, commission: number) => void;
}

export const AddToStoreModal = ({ product, isOpen, onClose, onSubmit }: AddToStoreModalProps) => {
    // State for the affiliate's commission
    const [commission, setCommission] = useState<number>(0);
    // State for editable fields, initialized with original product data
    const [editedName, setEditedName] = useState(product?.name ?? "");
    const [editedDescription, setEditedDescription] = useState(product?.description ?? "");

    // Calculate the new price in real-time
    const newSalePrice = useMemo(() => {
        return (product?.sale_price ?? 0) + commission;
    }, [product?.sale_price, commission]);

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const editedProductData = {
            ...product,
            name: editedName,
            description: editedDescription,
        };
        onSubmit(editedProductData, commission);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold">Add Product to Your Store</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex gap-6">
                        <div className="w-1/3">
                            <Image
                                src={product.product_images[0]}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="rounded-lg object-cover aspect-square"
                            />
                        </div>
                        <div className="w-2/3 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Title</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="font-semibold">{product.sale_price.toFixed(2)} {product.currency}</span>
                        </div>
                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Your Commission ({product.currency})</label>
                             <input
                                type="number"
                                id="commission"
                                value={commission}
                                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="e.g., 10.00"
                            />
                        </div>
                        <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                            <span className="text-lg font-bold text-teal-700">New Selling Price:</span>
                            <span className="text-xl font-bold text-teal-700">{newSalePrice.toFixed(2)} {product.currency}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 rounded-lg font-semibold">
                            Cancel
                        </button>
                        <button type="submit" className="py-2 px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-black">
                            Confirm and Add to My Store
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};