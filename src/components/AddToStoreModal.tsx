"use client";

import { useState, useMemo, useEffect } from 'react';
import { ProductType } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Percent, Store } from 'lucide-react';
import Image from 'next/image';
import { WhiteButtonStyles } from './Header';

interface AddToStoreModalProps {
    product: ProductType | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (editedProduct: ProductType, commission: number) => void;
}

export const AddToStoreModal = ({ product, isOpen, onClose, onSubmit }: AddToStoreModalProps) => {
    const [commission, setCommission] = useState<number>(0);
    const [editedName, setEditedName] = useState(product?.title ?? "");
    const [editedDescription, setEditedDescription] = useState(product?.description ?? "");

    // Effect to update state when a new product is selected while modal is open
    useEffect(() => {
        if (product) {
            setEditedName(product.title);
            setEditedDescription(product.description);
            setCommission(0); // Reset commission for new product
        }
    }, [product]);
    
    const newSalePrice = useMemo(() => {
        return (product?.original_sale_price ?? 0) + commission;
    }, [product?.original_sale_price, commission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        const editedProductData = {
            ...product,
            name: editedName,
            description: editedDescription,
        };
        onSubmit(editedProductData, commission);
    };

    return (
        <AnimatePresence>
            {isOpen && product && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-[#1e1e1e] border border-neutral-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-neutral-700 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-white">Add Product to Your Store</h3>
                            <button onClick={onClose} className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 flex-grow overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column: Image & Details */}
                                <div className="md:col-span-1 space-y-4">
                                     <div className="aspect-square relative w-full">
                                        <Image
                                            src={product.product_images[0]}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg'>
                                            <p className='text-xs text-neutral-400 mb-1'>Original Price</p>
                                            <p className='text-white font-semibold'>{product.original_sale_price.toFixed(2)} {product.currency}</p>
                                        </div>
                                         <div className='p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg'>
                                            <p className='text-xs text-neutral-400 mb-1'>Available Stock</p>
                                            <p className='text-white font-semibold'>{product.stock.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Form Inputs */}
                                <div className="md:col-span-2 space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1.5">Product Title</label>
                                        <div className="relative">
                                            <Edit3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                            <input
                                                type="text"
                                                id="name"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="w-full bg-[#111] border border-neutral-700 rounded-lg shadow-sm py-2.5 pl-9 pr-3 text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="commission" className="block text-sm font-medium text-neutral-300 mb-1.5">Your Commission ({product.currency})</label>
                                        <div className="relative">
                                            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                            <input
                                                type="number"
                                                id="commission"
                                                value={commission}
                                                onChange={(e) => setCommission(parseFloat(e.target.value))}
                                                className="w-full bg-[#111] border border-neutral-700 rounded-lg shadow-sm py-2.5 pl-9 pr-3 text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                placeholder="Commission (Dh)"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg text-white">
                                        <span className="text-base font-semibold">New Selling Price:</span>
                                        <span className="text-xl font-bold">{newSalePrice.toFixed(2)} {product.currency}</span>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1.5">Description (Optional)</label>
                                        <textarea
                                            id="description"
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            rows={5}
                                            className="w-full bg-[#111] border border-neutral-700 rounded-lg shadow-sm p-3 text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex justify-end items-center gap-3 p-5 border-t border-neutral-700 flex-shrink-0">
                            <button type="button" onClick={onClose} className="py-2 px-5 bg-neutral-700 text-white rounded-lg font-semibold hover:bg-neutral-600 transition-colors">
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                onClick={handleSubmit} 
                                className={`py-2 px-5 rounded-lg cursor-pointer
                                    font-semibold flex items-center gap-1
                                    ${WhiteButtonStyles}`}>
                                Drop to <Store size={20}/>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};